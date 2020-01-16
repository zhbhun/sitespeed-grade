/**
 * htmlTransferSize - browserScripts.${iteration}.pageinfo.documentSize.transferSize
 * redirectionTime - browserScripts.${iteration}.timings.pageTimings.redirectionTime
 * serverConnectionTime - browserScripts.${iteration}.timings.pageTimings.serverConnectionTime
 * serverResponseTime - browserScripts.${iteration}.timings.pageTimings.serverResponseTime
 * pageDownloadTime - browserScripts.${iteration}.timings.pageTimings.pageDownloadTime
 * firstPaint - browserScripts.${iteration}.timings.paintTiming.first-paint
 * firstContentfulPaint - browserScripts.${iteration}.timings.paintTiming.first-contentful-paint
 * firstMeaningfulPaint - browserScripts.${iteration}.cdp.performance.FirstMeaningfulPaint
 * domContentLoadedTime - browserScripts.${iteration}.timings.navigationTiming.domContentLoadedEventEnd
 * pageLoadTime - browserScripts.${iteration}.timings.navigationTiming.loadEventEnd
 * speedIndex - browserScripts.${iteration}.visualMetrics.SpeedIndex
 */
const defaultConfig = {
  total: 10,
  metrics: [
    // 重定向
    {
      name: 'redirectionTime',
      weight: 10,
      negative: true,
      targets: [
        [50, 0],
        [100, -0.1],
        [200, -0.2],
        [300, -0.25],
        [400, -0.3],
        [500, -0.35],
        [600, -0.4],
        [700, -0.45],
        [800, -0.5],
        [1000, -0.55],
        [1200, -0.6],
        [1500, -0.65],
        [1800, -0.7],
        [2200, -0.75],
        [2600, -0.8],
        [3100, -0.85],
        [3600, -0.9],
        [4200, -0.95],
        [4800, -1],
      ],
      value: 'browserScripts.${iteration}.timings.pageTimings.redirectionTime'
    },
    // 首次绘制
    {
      name: 'firstPaint',
      weight: 4,
      targets: [
        [600, 1],
        [700, 0.95],
        [800, 0.9],
        [900, 0.85],
        [1000, 0.8],
        [1200, 0.75],
        [1400, 0.7],
        [1600, 0.65],
        [1800, 0.6],
        [2100, 0.55],
        [2400, 0.5],
        [2700, 0.45],
        [3000, 0.4],
        [3400, 0.35],
        [3800, 0.3],
        [4200, 0.25],
        [4600, 0.2],
        [5100, 0.15],
        [5600, 0.1],
        [6200, 0.05],
        [6800, 0],
      ],
      value: 'browserScripts.${iteration}.timings.paintTiming.first-paint'
    },
    // 首次有效绘制
    {
      name: 'firstMeaningfulPaint',
      weight: 10,
      targets: [
        [1000, 1],
        [1100, 0.95],
        [1200, 0.9],
        [1350, 0.85],
        [1500, 0.8],
        [1700, 0.75],
        [1900, 0.7],
        [2150, 0.65],
        [2400, 0.6],
        [2700, 0.55],
        [3000, 0.5],
        [3350, 0.45],
        [3700, 0.4],
        [4100, 0.35],
        [4500, 0.3],
        [4950, 0.25],
        [5400, 0.2],
        [5900, 0.15],
        [6400, 0.1],
        [6950, 0.05],
        [7500, 0]
      ],
      value: 'browserScripts.${iteration}.cdp.performance.FirstMeaningfulPaint'
    },
    // DOM 加载时长
    {
      name: 'domContentLoadedTime',
      weight: 6,
      targets: [
        [1000, 1],
        [1100, 0.95],
        [1200, 0.9],
        [1350, 0.85],
        [1500, 0.8],
        [1700, 0.75],
        [1900, 0.7],
        [2150, 0.65],
        [2400, 0.6],
        [2700, 0.55],
        [3000, 0.5],
        [3350, 0.45],
        [3700, 0.4],
        [4100, 0.35],
        [4500, 0.3],
        [4950, 0.25],
        [5400, 0.2],
        [5900, 0.15],
        [6400, 0.1],
        [6950, 0.05],
        [7500, 0]
      ],
      value: 'browserScripts.${iteration}.timings.navigationTiming.domContentLoadedEventEnd'
    },
    // 页面加载时长
    {
      name: 'pageLoadTime',
      weight: 4,
      targets: [
        [1500, 1],
        [1600, 0.95],
        [1700, 0.9],
        [1850, 0.85],
        [2000, 0.8],
        [2200, 0.75],
        [2400, 0.7],
        [2650, 0.65],
        [2900, 0.6],
        [3200, 0.55],
        [3500, 0.5],
        [3850, 0.45],
        [4200, 0.4],
        [4600, 0.35],
        [5000, 0.3],
        [5450, 0.25],
        [5900, 0.2],
        [6400, 0.15],
        [6900, 0.1],
        [7450, 0.05],
        [8000, 0]
      ],
      value: 'browserScripts.${iteration}.timings.navigationTiming.loadEventEnd'
    },
    // 速度指数
    {
      name: 'speedIndex',
      weight: 8,
      targets: [
        [1500, 1],
        [1600, 0.95],
        [1700, 0.9],
        [1850, 0.85],
        [2000, 0.8],
        [2200, 0.75],
        [2400, 0.7],
        [2650, 0.65],
        [2900, 0.6],
        [3200, 0.55],
        [3500, 0.5],
        [3850, 0.45],
        [4200, 0.4],
        [4600, 0.35],
        [5000, 0.3],
        [5450, 0.25],
        [5900, 0.2],
        [6400, 0.15],
        [6900, 0.1],
        [7450, 0.05],
        [8000, 0]
      ],
      value: 'browserScripts.${iteration}.visualMetrics.SpeedIndex'
    }
  ]
};

module.exports = defaultConfig;
