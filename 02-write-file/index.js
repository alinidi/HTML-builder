const fs = require('fs');
const path = require('path');
const filePath = path.join(__dirname, 'text.txt');
const stdIn = process.stdin;
const stdOut = process.stdout;

fs.writeFile(filePath, '', (err) => {
  if (err) throw err;
});
stdOut.write('Hello! Enter your text, please: ');

stdIn.on('data', (data) => {
  if (data.toString().trim() === 'exit') {
    stdOut.write('Bye!');
    process.exit(0);
  } else {
    fs.appendFile(filePath, data, (err) => {
      if (err) throw err;
    });
  }
});

process.on('SIGINT', () => {
  stdOut.write('Bye!');
  process.exit(0);
});
