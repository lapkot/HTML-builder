const fs = require('fs');
const readline = require('readline');
const path = require('path');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

fs.writeFile(path.join(__dirname, 'text.txt'), '', err => {
  if (err) {
    console.error(err);
  }
});

console.log('Let\'s write some text');

rl.on('line', (input) => {

  const content = input;
  fs.appendFile(path.join(__dirname, 'text.txt'), content, err => {
    if (err) {
      console.error(err);
    }
  });
  if (content === 'exit') {
    rl.close();
  }
});

rl.on('close', () => {
  console.log('Have a great day!');
  process.exit(0);
});
