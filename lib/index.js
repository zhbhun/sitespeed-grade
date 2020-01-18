const Stats = require('./fast-stats').Stats;
const statsHelpers = require('./statsHelpers');
const defaultConfig = require('./defaultConfig');

const getValue = (data, path) => {
  return path.split('.').reduce((rcc, item) => {
    if (rcc === undefined) {
      return undefined;
    }
    return rcc[item] !== undefined ? rcc[item] : undefined;
  }, data);
};

/**
 * @typedef Metric
 * @property {string} name 指标名称
 * @property {number} weight 指标权重
 * @property {boolean} negative 是否不计入总权重
 * @property {Array|Object} targets 指标目标值
 * @property {String|Array} value 指标取值
 */

/**
 * @typedef Grade
 * @property {string} name 指标名称
 * @property {number} weight 指标权重
 * @property {boolean} negative 是否不计入总权重
 * @property {number} value 指标实际值
 * @property {number} factor 指标取值因子
 * @property {number} grade 指标得分
 */

module.exports = {
  name() {
    return 'grade';
  },
  open(context, options) {
    this.network = options.browsertime.connectivity.alias;
    this.options = Object.assign({}, defaultConfig, options.grade);
  },
  processGrade(data) {
    const stats = new Stats();
    data.browserScripts.map((browserScript, index) => {
      /**
       * @type Grade[]
       */
      const grades = this.options.metrics.reduce((rcc, item) => {
        /**
         * @type Metric
         */
        const { name, weight, negative, targets, value } = item;

        // 确认目标值
        const target =
          Array.isArray(targets) ||
          typeof targets === 'number' ||
          typeof targets === 'function'
            ? targets
            : targets[this.network];
        if (target === undefined) {
          return rcc;
        }

        // 计算实际值
        let realValue;
        if (typeof value === 'string') {
          realValue = getValue(data, value.replace('${iteration}', index));
        } else if (Array.isArray(value) && value[0] && value[1]) {
          const valueA = getValue(
            data,
            value[0].replace('${iteration}', index)
          );
          const valueB = getValue(
            data,
            value[1].replace('${iteration}', index)
          );
          if (valueA !== undefined && valueB !== undefined && valueA > valueB) {
            realValue = valueA - valueB;
          }
        }

        // 计算得分
        if (realValue !== undefined && target !== undefined) {
          const result = {
            name,
            weight,
            negative,
            value: realValue
          };
          let matchedFactor;
          if (typeof target === 'function') {
            matchedFactor = target(realValue);
          } else if (Array.isArray(target)) {
            const matched = target.some((item, index) => {
              if (realValue <= item[0] || index === target.length - 1) {
                matchedFactor = item[1];
                return true;
              }
              return false;
            });
            if (!matched) {
              matchedFactor = 0;
            }
          } else {
            matchedFactor = Math.max(target / realValue, 1);
          }
          if (matchedFactor > 1) {
            matchedFactor = 1;
          }
          result.factor = matchedFactor;
          result.grade = this.options.total * matchedFactor;
          rcc.push(result);
        }
        return rcc;
      }, []);
      const totalWeight = grades.reduce((weight, item) => {
        return weight + (item.negative !== true ? item.weight : 0);
      }, 0);
      let finalGrade = 0;
      if (totalWeight > 0) {
        finalGrade = Number(
          grades
            .reduce((grade, item) => {
              return grade + item.grade * (item.weight / totalWeight);
            }, 0)
            .toFixed(1)
        );
      }
      if (finalGrade < 0) {
        finalGrade = 0;
      }
      browserScript.custom = Object.assign({}, browserScript.custom, {
        grade: {
          total: finalGrade,
          metrics: grades
        }
      });
      stats.push(finalGrade);
    });
    const statistics = statsHelpers.summarizeStats(stats, {
      decimals: 1
    });
    data.statistics = Object.assign(data.statistics, {
      custom: Object.assign(data.statistics.custom || {}, {
        grade: statistics
      })
    });
  },
  processMessage(message, queue) {
    switch (message.type) {
      case 'browsertime.pageSummary': {
        if (message.data && message.data.browserScripts) {
          this.processGrade(message.data);
        }
        break;
      }
      default:
        break;
    }
  }
};
