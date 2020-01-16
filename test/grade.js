/**
 * 综合测试
 */
const path = require('path');
const fs = require('fs');
const fse = require('fs-extra');
const shell = require('shelljs');
const chalk = require('chalk');
const config = require('../.sitespeedio.test.json');
const SitespeedGrade = require('../lib');
const findDataPath = require('./utils/findDataPath');
const websites = require('./websites.json');

const context = path.resolve(__dirname, '../');
const output = path.resolve(context, 'output/grade');

function test({ type, name, page, url }) {
  return new Promise(async (resolve, reject) => {
    const outoutPath = path.resolve(output, type, name, page);
    const cmd = `sitespeed.io "${url}" --config ./.sitespeedio.test.json --outputFolder ${outoutPath}`;
    console.log('$', chalk.blue(cmd));
    if (await fse.exists(outoutPath)) {
      reject(new Error('aready run.'));
      return;
    }
    await fse.ensureDirSync(outoutPath);
    await fse.emptyDir(outoutPath);
    shell.exec(cmd, {
      cwd: context,
      async: true,
      fatal: false,
      silent: false,
    }, async (code, stdout, stderr) => {
      if (code === 0) {
        const pagesPath = path.resolve(outoutPath, 'pages');
        await fse.copy(
          await findDataPath(pagesPath),
          outoutPath,
          { overwrite: true }
        );
        await fse.emptyDir(pagesPath);
        resolve(stdout);
      } else {
        reject(new Error(stderr));
      }
    });
  });
}

async function runWebPage(website, index) {
  if (website.pages && website.pages[index]) {
    const webpage = website.pages[index];
    try {
      await test({
        type: website.type,
        name: website.name,
        page: webpage.name,
        url: webpage.url,
      });
      console.log(chalk.green('success\n'));
    } catch (error) {
      console.log(chalk.red(`failure: ${error.message}\n`));
    }
    await runWebPage(website, index + 1);
  }
}

async function runWebsite(index) {
  if (websites && websites[index]) {
    const website = websites[index];
    await runWebPage(website, 0);
    await runWebsite(index + 1);
  }
}

async function run() {
  await runWebsite(0);
  SitespeedGrade.open(context, config);
  for (let index = 0; index < websites.length; index++) {
    const { type, name, pages } = websites[index];
    for (let index = 0; index < pages.length; index++) {
      const { name: page, url } = pages[index];
      const summaryPath = path.resolve(output, type, name, page, 'browsertime.pageSummary.json');
      if (await fse.exists(summaryPath)) {
        console.log(type, name, page);
        const summary = await fse.readJSON(summaryPath);
        SitespeedGrade.processGrade(summary);
        const { browserScripts, statistics: { custom: { grade } } } = summary;
        console.log(`    median: ${grade.median} | mean: ${grade.mean} | min: ${grade.min} | max: ${grade.max}`);
        for (let i = 0; i < browserScripts.length; i++) {
          const { custom: { grade: { metrics } } } = browserScripts[i];
          console.log(`    $${i}`);
          for (let j = 0; j < metrics.length; j++) {
            const { name, value, factor, grade } = metrics[j];
            console.log(`        ${name} - value: ${value} | factor: ${factor} | grade: ${grade}`);
          }
        }
      }
    }
  }
}

run();


