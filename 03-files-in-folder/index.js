const fs = require('fs');
const path = require('path');

const dir = path.join(__dirname, 'secret-folder');

fs.readdir(dir, (err, files) => {
  files.forEach(file => {
    let name = path.basename(file, path.extname(file));
    let extname = path.extname(file).replace(/./, '');
    fs.stat(path.join(dir, file),(err, stats) => {
      if (err) {
        console.error(err);
        return;
      }
      if (stats.isDirectory()) return;
      let size = stats.size / 1000;
      console.log(`${name} - ${extname} - ${size}kb`);
    });
  });
});