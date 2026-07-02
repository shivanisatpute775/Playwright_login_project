module.exports = {
  default: [
    '--require-module ts-node/register',
    '--require src/tests/steps/**/*.ts',
    '--require src/tests/support/**/*.ts',
    '--format progress',
    '--format json:reports/cucumber-report.json',
    'src/tests/features/**/*.feature'
  ].join(' ')
};