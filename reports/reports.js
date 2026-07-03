const reporter = require("cucumber-html-reporter");

const options = {
  theme: "bootstrap",
  jsonFile: "reports/cucumber-report.json",
  output: "reports/cucumber-report.html",
  reportSuiteAsScenarios: true,
  launchReport: false,
  metadata: {
    Application: "Playwright Automation",
    Framework: "Playwright + Cucumber",
    Browser: "Chromium",
    Platform: "GitHub Actions"
  }
};

reporter.generate(options);

console.log("Cucumber HTML Report generated successfully.");