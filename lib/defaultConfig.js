/**
 * @example
 * ```js
 * var formula = make(1, 2);
 * formula(0); // 1
 * formula(1); // 0.25
 * ```
 * @example
 * ```js
 * var formula = make(10000, 2);
 * formula(0); // 1
 * formula(1000); // 0.826
 * formula(10000); // 0.25
 * ```
 */
function formula(scale, exponent) {
  return function (base) {
    return 1 / Math.pow(base / scale + 1, exponent)
  };
}

function testFormular(func) {
  var data = [
    100,
    200,
    400,
    600,
    800,
    1000,
    1200,
    1400,
    1500,
    1600,
    1800,
    2000,
    2500,
    3000,
    4000,
    5000,
    6000,
    7000,
    8000,
    9000,
    10000
  ];
  for (var index = 0; index < data.length; index++) {
    var time = data[index];
    console.log(time + ':', func(time));
  }
}

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
      /**
       * @test testFormular(value => formula(1000, 2)(value) - 1)
       * 100: -0.17355371900826455
       * 200: -0.3055555555555556
       * 400: -0.4897959183673468
       * 600: -0.609375
       * 800: -0.691358024691358
       * 1000: -0.75
       * 1200: -0.7933884297520661
       * 1400: -0.8263888888888888
       * 1500: -0.84
       * 1600: -0.8520710059171598
       * 1800: -0.8724489795918366
       * 2000: -0.8888888888888888
       * 2500: -0.9183673469387755
       * 3000: -0.9375
       * 4000: -0.96
       * 5000: -0.9722222222222222
       * 6000: -0.9795918367346939
       * 7000: -0.984375
       * 8000: -0.9876543209876543
       * 9000: -0.99
       * 10000: -0.9917355371900827
       */
      targets: value => formula(1000, 2)(value) - 1,
      value: 'browserScripts.${iteration}.timings.pageTimings.redirectionTime'
    },
    // 首次绘制
    {
      name: 'firstPaint',
      weight: 5,
      /**
       * @test testFormular(formula(5000, 2))
       * 100: 0.9611687812379854
       * 200: 0.9245562130177514
       * 400: 0.8573388203017832
       * 600: 0.7971938775510203
       * 800: 0.7431629013079668
       * 1000: 0.6944444444444444
       * 1200: 0.6503642039542143
       * 1400: 0.6103515625
       * 1500: 0.5917159763313609
       * 1600: 0.573921028466483
       * 1800: 0.5406574394463669
       * 2000: 0.5102040816326532
       * 2500: 0.4444444444444444
       * 3000: 0.39062499999999994
       * 4000: 0.30864197530864196
       * 5000: 0.25
       * 6000: 0.20661157024793386
       * 7000: 0.1736111111111111
       * 8000: 0.14792899408284022
       * 9000: 0.1275510204081633
       * 10000: 0.1111111111111111
       */
      targets: formula(5000, 2),
      value: 'browserScripts.${iteration}.timings.paintTiming.first-paint'
    },
    // 首次有效绘制
    {
      name: 'firstMeaningfulPaint',
      weight: 10,
      /**
       * @test testFormular(formula(5000, 2))
       * 100: 0.9611687812379854
       * 200: 0.9245562130177514
       * 400: 0.8573388203017832
       * 600: 0.7971938775510203
       * 800: 0.7431629013079668
       * 1000: 0.6944444444444444
       * 1200: 0.6503642039542143
       * 1400: 0.6103515625
       * 1500: 0.5917159763313609
       * 1600: 0.573921028466483
       * 1800: 0.5406574394463669
       * 2000: 0.5102040816326532
       * 2500: 0.4444444444444444
       * 3000: 0.39062499999999994
       * 4000: 0.30864197530864196
       * 5000: 0.25
       * 6000: 0.20661157024793386
       * 7000: 0.1736111111111111
       * 8000: 0.14792899408284022
       * 9000: 0.1275510204081633
       * 10000: 0.1111111111111111
       */
      targets: formula(5000, 2),
      value: 'browserScripts.${iteration}.cdp.performance.FirstMeaningfulPaint'
    },
    // 页面加载时长
    {
      name: 'pageLoadTime',
      weight: 5,
      /**
       * @test testFormular(value => formula(10000, 2)(Math.max(0, value - 1000)))
       * 100: 1
       * 200: 1
       * 400: 1
       * 600: 1
       * 800: 1
       * 1000: 1
       * 1200: 0.9611687812379854
       * 1400: 0.9245562130177514
       * 1500: 0.9070294784580498
       * 1600: 0.8899964400142398
       * 1800: 0.8573388203017832
       * 2000: 0.8264462809917354
       * 2500: 0.7561436672967865
       * 3000: 0.6944444444444444
       * 4000: 0.5917159763313609
       * 5000: 0.5102040816326532
       * 6000: 0.4444444444444444
       * 7000: 0.39062499999999994
       * 8000: 0.34602076124567477
       * 9000: 0.30864197530864196
       * 10000: 0.2770083102493075
       */
      targets: value => formula(10000, 2)(Math.max(0, value - 1000)),
      value: 'browserScripts.${iteration}.timings.navigationTiming.loadEventEnd'
    },
    // 速度指数
    {
      name: 'speedIndex',
      weight: 8,
      /**
       * @test testFormular(value => formula(10000, 2)(Math.max(0, value - 1000)))
       * 100: 1
       * 200: 1
       * 400: 1
       * 600: 1
       * 800: 1
       * 1000: 1
       * 1200: 0.9611687812379854
       * 1400: 0.9245562130177514
       * 1500: 0.9070294784580498
       * 1600: 0.8899964400142398
       * 1800: 0.8573388203017832
       * 2000: 0.8264462809917354
       * 2500: 0.7561436672967865
       * 3000: 0.6944444444444444
       * 4000: 0.5917159763313609
       * 5000: 0.5102040816326532
       * 6000: 0.4444444444444444
       * 7000: 0.39062499999999994
       * 8000: 0.34602076124567477
       * 9000: 0.30864197530864196
       * 10000: 0.2770083102493075
       */
      targets: value => formula(10000, 2)(Math.max(0, value - 1000)),
      value: 'browserScripts.${iteration}.visualMetrics.SpeedIndex'
    }
  ]
};

module.exports = defaultConfig;
