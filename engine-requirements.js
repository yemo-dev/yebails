const major = parseInt(process.versions.node.split('.')[0], 10);

if (major < 20) {
  console.log('\x1b[1m\x1b[31m   [!] NODE.JS VERSION ERROR [!]   \x1b[0m');
  console.log();
  console.error(
    `   This package requires Node.js 20+ to run reliably.\n` +
    `   You are using Node.js ${process.versions.node}.\n` +
    `   Please upgrade to Node.js 20+ to proceed.\n`
  );
  process.exit(1);
}
