
const defaultConfig = {
  total: 10,
  metrics: [
    {
      // 重定向
      name: 'redirect',
      weight: 10,
      targets: {
        '3g': [
          [10, 0],
          [200, -0.2],
          [400, -0.4],
          [600, -0.6],
          [800, -0.8],
          [1000, -1]
        ],
        '4g': [
          [10, 0],
          [100, -0.2],
          [200, -0.4],
          [300, -0.6],
          [400, -0.8],
          [500, -1]
        ]
      },
      value: 'browserScripts.${iteration}.timings.pageTimings.redirectionTime'
    },
    {
      // 网络连接
      name: 'connect',
      weight: 2,
      targets: {
        '3g': [
          [800, 1],
          [1000, 0.9],
          [1200, 0.8],
          [1400, 0.7],
          [1600, 0.6],
          [2000, 0.4],
          [2500, 0.2],
          [3000, 0]
        ],
        '4g': [
          [400, 1],
          [500, 0.9],
          [600, 0.8],
          [700, 0.7],
          [800, 0.6],
          [1000, 0.4],
          [1500, 0.2],
          [2000, 0]
        ]
      },
      value: 'browserScripts.${iteration}.timings.pageTimings.serverConnectionTime'
    },
    {
      // 响应等待
      name: 'responseWait',
      weight: 10,
      targets: {
        '3g': [
          [200, 1],
          [300, 0.9],
          [400, 0.8],
          [500, 0.7],
          [600, 0.6],
          [800, 0.4],
          [1000, 0.2],
          [2000, 0]
        ],
        '4g': [
          [200, 1],
          [300, 0.9],
          [400, 0.8],
          [500, 0.7],
          [600, 0.6],
          [800, 0.4],
          [1000, 0.2],
          [2000, 0]
        ]
      },
      value: [
        'browserScripts.${iteration}.timings.navigationTiming.responseStart',
        'browserScripts.${iteration}.timings.navigationTiming.requestStart'
      ]
    },
    // 响应下载
    {
      name: 'responseDownload',
      weight: 10,
      targets: {
        '3g': [
          [100, 1],
          [200, 0.9],
          [300, 0.8],
          [400, 0.7],
          [500, 0.6],
          [750, 0.4],
          [1000, 0.2],
          [1500, 0]
        ],
        '4g': [
          [50, 1],
          [100, 0.9],
          [150, 0.8],
          [200, 0.7],
          [250, 0.6],
          [350, 0.4],
          [500, 0.2],
          [1000, 0]
        ]
      },
      value: 'browserScripts.${iteration}.timings.pageTimings.pageDownloadTime'
    },
    // 首次渲染耗时
    {
      name: 'firstRender',
      weight: 10,
      targets: {
        '3g': [
          [800, 1],
          [1200, 0.9],
          [1600, 0.8],
          [2000, 0.6],
          [300, 0.4],
          [4000, 0.2],
          [5000, 0]
        ],
        '4g': [
          [400, 1],
          [600, 0.9],
          [800, 0.8],
          [1000, 0.6],
          [1500, 0.4],
          [2000, 0.2],
          [3000, 0]
        ]
      },
      value: [
        'browserScripts.${iteration}.timings.firstPaint',
        'browserScripts.${iteration}.timings.navigationTiming.responseEnd',
      ]
    },
    // DOM 构建耗时
    {
      name: 'domContentLoaded',
      weight: 10,
      targets: {
        '3g': [
          [800, 1],
          [1200, 0.9],
          [1600, 0.8],
          [2000, 0.6],
          [300, 0.4],
          [4000, 0.2],
          [5000, 0]
        ],
        '4g': [
          [400, 1],
          [600, 0.9],
          [800, 0.8],
          [1000, 0.6],
          [1500, 0.4],
          [2000, 0.2],
          [3000, 0]
        ]
      },
      value: [
        'browserScripts.${iteration}.timings.navigationTiming.domContentLoadedEventStart',
        'browserScripts.${iteration}.timings.navigationTiming.responseEnd'
      ]
    },
    // 加载时长
    {
      name: 'load',
      weight: 5,
      targets: {
        '3g': [
          [4000, 1],
          [5000, 0.9],
          [6000, 0.8],
          [7000, 0.6],
          [10000, 0.4],
          [15000, 0.2],
          [20000, 0]
        ],
        '4g': [
          [2000, 1],
          [2500, 0.9],
          [3000, 0.8],
          [3500, 0.6],
          [5000, 0.4],
          [6000, 0.2],
          [10000, 0]
        ]
      },
      value: [
        'browserScripts.${iteration}.timings.navigationTiming.loadEventStart',
        'browserScripts.${iteration}.timings.navigationTiming.domContentLoadedEventStart'
      ]
    },
    // 速度指数
    {
      name: 'speedIndex',
      weight: 10,
      targets: {
        '3g': [
          [4000, 1],
          [5000, 0.9],
          [6000, 0.8],
          [7000, 0.6],
          [10000, 0.4],
          [15000, 0.2],
          [20000, 0]
        ],
        '4g': [
          [2000, 1],
          [2500, 0.9],
          [3000, 0.8],
          [3500, 0.6],
          [5000, 0.4],
          [6000, 0.2],
          [10000, 0]
        ]
      },
      value: 'browserScripts.${iteration}.visualMetrics.SpeedIndex'
    },
    // HTML 传输大小
    {
      name: 'htmlTransferSize',
      weight: 5,
      targets: {
        '3g': [
          [51200, 1],
          [102400, 0.8],
          [154600, 0.6],
          [204800, 0.4],
          [307200, 0.6],
          [409600, 0.2],
          [501200, 0]
        ],
        '4g': [
          [51200, 1],
          [102400, 0.8],
          [154600, 0.6],
          [204800, 0.4],
          [307200, 0.6],
          [409600, 0.2],
          [501200, 0]
        ],
      },
      value: 'browserScripts.${iteration}.pageinfo.documentSize.transferSize'
    }
  ]
};

module.exports = defaultConfig;
