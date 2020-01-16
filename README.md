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
        negative: false, // 是否计入总权重
        targets: [ // 得分目标值的计算因子(不区分网络)
          [100, 1], 
          [200, 0.9],
          [300, 0.8],
          [400, 0.7],
          [600, 0.5],
          [1000, 0.3]
        ],
        value: 'browserScripts.${iteration}.timings.pageTimings.redirectionTime' // 原始值（直接获取）
      },
      {
        name: 'xxx', // 指标名称,
        weight: 10, // 指标评级权重
        targets: { // 得分目标值的计算因子，key 值为网络配置的别名，value 值时计算因子的配置项
          '3g': [ // 3G 网络得分目标值区间
            [100, 1], 
            [200, 0.9],
            [300, 0.8],
            [400, 0.7],
            [600, 0.5],
            [1000, 0.3]
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
        ] // 原始值（差值计算）
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

### 默认配置

1. 技术指标

    - 网页传输大小
    - 重定向时间
    - 网络连接时间
    - 服务端响应时间
    - 服务端下载时间

2. 以用户为中心的指标

    - 首次绘制
    - 首次内容绘制
    - 首次有效绘制
    - 可交互时间
    - 速度指数

默认配置参考 [defaultConfig.js](./lib/defaultConfig.js)

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

## 测试数据

### 延迟测试

ps：测试脚本采用了 [tsproxy](https://github.com/WPO-Foundation/tsproxy) 来模拟延迟，上下载的速率均为 9216 Kbps。并且设置了一组不同的 latency（0、200、300、400、500、600、700、800、900），通过测试结果分析 latency 值对网页加载的影响。

运行脚本

```bash
npm run test:latency
```

测试结果

```bash
baidu 0
 connect - median: 88 | mean: 85 | min: 76 | max: 92
 response - median: 261 | mean: 269 | min: 230 | max: 315
 download - median: 147 | mean: 148 | min: 115 | max: 183
baidu 200
 connect - median: 495 | mean: 570 | min: 470 | max: 746
 response - median: 550 | mean: 542 | min: 457 | max: 620
 download - median: 183 | mean: 177 | min: 162 | max: 187
baidu 300
 connect - median: 693 | mean: 796 | min: 676 | max: 1019
 response - median: 622 | mean: 617 | min: 599 | max: 630
 download - median: 159 | mean: 161 | min: 133 | max: 191
baidu 400
 connect - median: 898 | mean: 1018 | min: 880 | max: 1275
 response - median: 659 | mean: 652 | min: 585 | max: 711
 download - median: 160 | mean: 135 | min: 82 | max: 162
baidu 500
 connect - median: 1160 | mean: 1279 | min: 1090 | max: 1588
 response - median: 724 | mean: 730 | min: 709 | max: 758
 download - median: 99 | mean: 105 | min: 73 | max: 143
baidu 600
 connect - median: 1284 | mean: 1483 | min: 1276 | max: 1890
 response - median: 843 | mean: 861 | min: 834 | max: 905
 download - median: 137 | mean: 132 | min: 110 | max: 148
baidu 700
 connect - median: 1468 | mean: 1707 | min: 1467 | max: 2185
 response - median: 922 | mean: 937 | min: 888 | max: 1001
 download - median: 107 | mean: 119 | min: 99 | max: 150
baidu 800
 connect - median: 1688 | mean: 1946 | min: 1671 | max: 2479
 response - median: 1109 | mean: 1106 | min: 1054 | max: 1154
 download - median: 126 | mean: 128 | min: 106 | max: 152
baidu 900
 connect - median: 1896 | mean: 2182 | min: 1853 | max: 2796
 response - median: 1163 | mean: 1157 | min: 1113 | max: 1194
 download - median: 147 | mean: 126 | min: 82 | max: 149
```

分析

- 网络连接：2 * latency + 原有延迟时长
- 响应：latency + 原有响应时长
- 下载：不影响

### 下载速度测试

ps：测试脚本采用了 [tsproxy](https://github.com/WPO-Foundation/tsproxy) 来模拟延迟，延迟均为 0。并且设置了一组不同的下载速度（1024、2048...9120），上传速度为四分之一的下载速度，通过测试结果分析下载速率值对网页加载的影响。

运行脚本

```bash
npm run test:latency
```

```bash
baidu 1024
 connect - median: 86 | mean: 91 | min: 74 | max: 114
 response - median: 811 | mean: 847 | min: 808 | max: 922
 download - median: 674 | mean: 677 | min: 655 | max: 701
baidu 2048
 connect - median: 97 | mean: 101 | min: 82 | max: 123
 response - median: 469 | mean: 475 | min: 460 | max: 496
 download - median: 325 | mean: 327 | min: 320 | max: 337
baidu 3072
 connect - median: 63 | mean: 75 | min: 59 | max: 102
 response - median: 368 | mean: 360 | min: 336 | max: 377
 download - median: 221 | mean: 223 | min: 214 | max: 235
baidu 4096
 connect - median: 82 | mean: 86 | min: 78 | max: 98
 response - median: 288 | mean: 335 | min: 278 | max: 438
 download - median: 174 | mean: 176 | min: 164 | max: 189
baidu 5120
 connect - median: 88 | mean: 92 | min: 83 | max: 105
 response - median: 430 | mean: 424 | min: 290 | max: 552
 download - median: 282 | mean: 249 | min: 135 | max: 329
baidu 6144
 connect - median: 93 | mean: 88 | min: 77 | max: 94
 response - median: 295 | mean: 302 | min: 259 | max: 352
 download - median: 180 | mean: 182 | min: 112 | max: 254
baidu 7168
 connect - median: 96 | mean: 95 | min: 83 | max: 105
 response - median: 368 | mean: 326 | min: 240 | max: 369
 download - median: 164 | mean: 166 | min: 107 | max: 226
baidu 8192
 connect - median: 65 | mean: 63 | min: 56 | max: 68
 response - median: 252 | mean: 241 | min: 212 | max: 259
 download - median: 113 | mean: 105 | min: 88 | max: 114
baidu 9216
 connect - median: 171 | mean: 160 | min: 123 | max: 185
 response - median: 324 | mean: 329 | min: 248 | max: 416
 download - median: 150 | mean: 138 | min: 104 | max: 160
```

- 网络连接：不受影响
- 响应：在上传速度较低时会影响响应速度
- 下载：根据传输文件大小和下载速率有关

    例子中百度移动端首页大小大于在 90KB 左右，在测试例子中下载速度从 1024 提升到 4096 之间，都有缩小相应倍数的下载时长，但继续提升下载速度时，影响不是很大了。

    可以根据计算公式 `（90KB * 8bit / 下载速度）` 粗略计算下载时长：

    - 90 * 8 / 1024 = 0.703125s
    - 90 * 8 / 2048 = 0.3515625s
    - 90 * 8 / 3172 = 0.22698612862547288s
    - ...

## 网络配置

根据最新的 [中国宽带速率状况报告_第23期（2019Q1）.pdf](http://www.chinabda.cn/Site/Default/Uploads/kindeditor/file/20190522/%E4%B8%AD%E5%9B%BD%E5%AE%BD%E5%B8%A6%E9%80%9F%E7%8E%87%E7%8A%B6%E5%86%B5%E6%8A%A5%E5%91%8A_%E7%AC%AC23%E6%9C%9F%EF%BC%882019Q1%EF%BC%89.pdf)，可知目前 4G 的平均速率在 23.01Mbit/s 左右，3G 的平均速率在 8.89Mbit/s 左右。由于移动宽带网络由基站覆盖范围内的大量用户共享，区域内的人员密集程度会直接影响到每个用户所能体验到的下载速率。另一方面，移动宽带用户上网体验速率还会受到建筑物阻隔、用户的位置移动速率、用户终端配置等影响。所以在模拟测试的时候，建议在统计出来的数据基础上再打个半折。

- 4G

    - downstream：12288Kbps / 12Mbps
    - upstream: 3072Kbps / 3MBps
    - rtt: 30

- 3G

    - downstream：4096Kbps / 4Mbps
    - upstream: 1024Kbps / 1MBps
    - rtt: 50

## 误区

- 性能得分低，代表性能优化的不好

    得分低并不代表性能优化的不好，可能与具体的业务有关系，例如：电商类的业务资源比较多，加载性能得分自然比较低。

- 业务本身就复杂，已经尽力优化了

    除了从前端代码层面的技术方向上去优化加载性能，也可以考虑与客户端合作，通过预加载和离线包的方式去优化。

- ...
