const chalk = require("chalk");
const gradient = require("gradient-string");

const major = parseInt(process.versions.node.split('.')[0], 10);

if (major < 20) {
  console.log();
  console.log(
    chalk.bold(
      gradient(['#FF0000', '#FFA500'])('   [!] NODE.JS VERSION ERROR [!]   ')
    )
  );
  console.log();
  console.error(
    chalk.red(`   This package requires Node.js 20+ to run reliably.\n`) +
    chalk.yellow(`   You are using Node.js ${process.versions.node}.\n`) +
    chalk.cyan(`   Please upgrade to Node.js 20+ to proceed.\n`)
  );
  process.exit(1);
}
