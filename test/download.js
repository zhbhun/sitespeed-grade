/**
 * 延迟测试
 */
const path = require('path');
const fs = require('fs');
const fse = require('fs-extra');
const shell = require('shelljs');
const chalk = require('chalk');
const findDataPath = require('./utils/findDataPath');

const context = path.resolve(__dirname, '../');
const output = path.resolve(context, 'output/download');
const webpages = [
  {
    name: 'baidu',
    url: 'https://m.baidu.com'
  }
];
const downloads = [1024, 2048, 3072, 4096, 5120, 6144, 7168, 8192, 9216];

function test({ name, url, download }) {
  return new Promise(async (resolve, reject) => {
    const outoutPath = path.resolve(output, name, String(download));
    const cmd = `sitespeed.io ${url} --config ./.sitespeedio.test.json --browsertime.connectivity.latency 0 --browsertime.connectivity.upstreamKbps ${download / 4} --browsertime.connectivity.downstreamKbps ${download} --outputFolder ${outoutPath}`;
    console.log('$', chalk.blue(cmd));
    if (await fse.exists(outoutPath)) {
      reject(new Error('aready run.'));
      return;
    }
    await fse.ensureDirSync(outoutPath);
    await fse.emptyDir(outoutPath);
    shell.exec(
      cmd,
      {
        cwd: context,
        async: true,
        fatal: false,
        silent: false
      },
      async (code, stdout, stderr) => {
        if (code === 0) {
          const pagesPath = path.resolve(outoutPath, 'pages');
          await fse.copy(await findDataPath(pagesPath), outoutPath, {
            overwrite: true
          });
          await fse.emptyDir(pagesPath);
          resolve(stdout);
        } else {
          reject(new Error(stderr));
        }
      }
    );
  });
}

async function runDownload(webpage, index) {
  if (index < downloads.length) {
    try {
      await test({
        name: webpage.name,
        url: webpage.url,
        download: downloads[index]
      });
      console.log(chalk.green('success\n'));
    } catch (error) {
      console.log(chalk.red(`failure: ${error.message}\n`));
    }
    await runDownload(webpage, index + 1);
  }
}

async function runWebpage(index) {
  if (index < webpages.length) {
    const webpage = webpages[index];
    await runDownload(webpage, 0);
    await runWebpage(index + 1);
  }
}

async function run() {
  await runWebpage(0);
  for (let index = 0; index < webpages.length; index++) {
    const { name } = webpages[index];
    for (let index = 0; index < downloads.length; index++) {
      const download = downloads[index];
      const summaryPath = path.resolve(
        output,
        name,
        String(download),
        'browsertime.pageSummary.json'
      );
      if (await fse.exists(summaryPath)) {
        console.log(name, download);
        const summary = await fse.readJSON(summaryPath);
        const {
          statistics: {
            timings: { pageTimings }
          }
        } = summary;
        printMetric('connect', pageTimings.serverConnectionTime);
        printMetric('response', pageTimings.serverResponseTime);
        printMetric('download', pageTimings.pageDownloadTime);
      }
    }
  }
}

function printMetric(name, metric) {
  console.log(
    ` ${name} - median: ${metric.median} | mean: ${metric.mean} | min: ${metric.min} | max: ${metric.max}`
  );
}

run();

