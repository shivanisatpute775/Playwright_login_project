const reporter = require('cucumber-html-reporter');
const fs = require('fs');
const path = require('path');

const reportPath = 'reports/cucumber-report.json';
const outputPath = 'reports/cucumber-report.html';

if (!fs.existsSync(reportPath)) {
  console.error(`❌ Report not found at ${reportPath}`);
  console.log('Run "npx cucumber-js" first to generate the JSON report');
  process.exit(1);
}

const options = {
  theme: 'bootstrap',
  jsonFile: reportPath,
  output: outputPath,
  reportSuiteAsScenarios: true,
  scenarioTimestamp: true,
  launchReport: true,
  metadata: {
    'App Version': '1.0.0',
    'Test Environment': 'EventHub',
    'Browser': 'Chromium',
    'Platform': process.platform,
    'Execution Time': new Date().toISOString(),
  }
};

reporter.generate(options);
console.log(`✅ HTML report generated at ${outputPath}`);
