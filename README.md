# Sitespeed Grade

Sitespeed 性能评级指标

## 安装使用

```shell
npm install sitespeed-grade
npm install sitespeed.io
npx sitespeed.io https://github.com --plugins.add ./node_modules/sitespeed-grade/lib/index.js
```

集成 Grafana 时，如果需要在 Grafana 上显性能评级指标，需要按以下几点要求配置

1. 将官方的 sitespeed/grafana-bootstrap 替换为 zhbhun/grafana-bootstrap。
2. sitespeed.io 执行时先移除 "graphite"，再重新添加 "graphite"（保证 sitespeed-grade 插件在 graphite 之前执行）

    ```shell
    npx sitespeed.io https://github.com --plugin.remove graphite --plugins.add ./node_modules/sitespeed-grade/lib/index.js --plugin.add graphite
    ```

## 配置说明

```js
{
  grade: {
    total: 10, // 评级总分，默认为 10
    metrics: [ // 评级指标集合
      {
        name: 'xxx', // 指标名称,
        weight: 10, // 指标评级权重
        targets: { // 得分目标值的计算因子，key 值为网络配置的别名，value 值时计算因子的配置项
          '3g': [ // 3G 网络得分目标值区间
            [100, 1], 
            [200, 0.9],
            [300, 0.8],
            [400, 0.7],
            [600, -0.5],
            [1000, -3]
          ],
          '4g': [] // 4G 网络得分目标值区间
        },
        value: 'browserScripts.${iteration}.timings.pageTimings.redirectionTime' // 原始值（直接获取）
      },
      {
        name: 'xxx', // 指标名称,
        weight: 10, // 指标评级权重
        targets: { // 得分目标值的计算因子
          '3g': 300, // 3G 网络得分目标值
          '4g': 100 // 4G 网络得分目标值
        },
        value: [
          'browserScripts.${iteration}.timings.navigationTiming.responseStart',
          'browserScripts.${iteration}.timings.navigationTiming.requestStart'
        ] // 原始值（插值计算）
      },
    ]
  }
}
```

计算原理如下所示

1. 计算指标项的原始值（根据 value 计算获得）；

    如果原始值不存在，则忽略该项指标

2. 根据指标项的目标值计算得分因子（用上一步获得的原始值和目标值 targets 比对）；
3. 计算指标项总权重（只有得分因子大于 0 的才算在内）

    如果得分因子为小于 0，可以认为该项指标作为附件扣分项，不计入总权重

3. 计算评级得分：评级总分 * ∑(指标项得分因子 * 指标项权重 / 指标项总权重 )

## 开发调试

```shell
docker-compose pull
mkdir volumes
mkdir volumes/grafana
chmod 777 volumes/grafana
mkdir volumes/whisper
docker-compose up -d
npm run test:xxx
# 访问 http://localhost:3000 查看 grafana 数据
# 修改 lib/defaultConfig 调整性能评级规则
```
