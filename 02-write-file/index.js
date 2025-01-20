const fs = require('fs');
const path = require('path');
const readline = require('readline');

const filePath = path.join(__dirname, 'text.txt');
const writableStream = fs.createWriteStream(filePath);

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
  prompt: 'Hello! Enter the text, please: ',
});

rl.prompt();

rl.on('line', (line) => {
  if (line.trim().toLowerCase() === 'exit') {
    rl.close();
    console.log('Bye!');
  } else {
    writableStream.write(`${line}\n`);
    rl.prompt();
  }
});

rl.on('error', (error) => {
  console.log(`Error: ${error.message}`);
  rl.close();
});

writableStream.on('error', (error) => {
  console.log(`Error: ${error.message}`);
});
