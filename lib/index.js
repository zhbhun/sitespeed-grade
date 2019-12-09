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

module.exports = {
  name() {
    return 'grade';
  },
  open(context, options) {
    this.network = options.browsertime.connectivity.alias;
    this.options = Object.assign({}, defaultConfig, options.grade);
  },
  processMessage(message, queue) {
    const make = this.make;
    switch (message.type) {
      case 'browsertime.pageSummary': {
        if (message.data && message.data.browserScripts) {
          const errorStats = new Stats();
          message.data.browserScripts.map((browserScript, index) => {
            const grades = this.options.metrics.reduce((rcc, item) => {
              const { name, weight, targets, value } = item;

              // 确认目标值
              const target = targets[this.network];
              if (target === undefined) {
                return rcc;
              }

              // 计算实际值
              let realValue;
              if (typeof value === 'string') {
                realValue = getValue(message.data, value.replace('${iteration}', index));
              } else if (Array.isArray(value) && value[0] && value[1]) {
                const valueA = getValue(message.data, value[0].replace('${iteration}', index));
                const valueB = getValue(message.data, value[1].replace('${iteration}', index));
                if (valueA !== undefined && valueB !== undefined && valueA > valueB) {
                  realValue = valueA - valueB;
                }
              }

              // 计算得分
              if (realValue !== undefined && target !== undefined) {
                const result = {
                  name,
                  weight,
                  value: realValue,
                };
                let matchedFactor;
                if (Array.isArray(target)) {
                  target.some((item, index) => {
                    if (realValue <= item[0] || index === target.length - 1) {
                      matchedFactor = item[1];
                      return true;
                    }
                    return false;
                  });
                } else {
                  matchedFactor = Math.min(target / realValue, 1);
                }
                result.factor = matchedFactor;
                result.grade = this.options.total * matchedFactor;
                rcc.push(result);
              }
              return rcc;
            }, []);
            const totalWeight = grades.reduce((weight, item) => {
              return weight + (item.grade > 0 ? item.weight : 0);
            }, 0);
            const finalGrade = Number(grades.reduce((grade, item) => {
              return grade + (item.grade * (item.weight / totalWeight));
            }, 0).toFixed(1));
            browserScript.custom = Object.assign({}, browserScript.custom, {
              grade: {
                total: finalGrade,
                metrics: grades
              }
            });
            errorStats.push(finalGrade);
          });
          const statistics = statsHelpers.summarizeStats(
            errorStats,
            {
              decimals: 1
            }
          );
          message.data.statistics = Object.assign(
            message.data.statistics, {
              custom: Object.assign(
                message.data.statistics.custom || {},
                {
                  grade: statistics
                }
              )
            }
          );
        }
        break;
      }
      default:
        break;
    }
  }
};
