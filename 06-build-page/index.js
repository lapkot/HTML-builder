const fs = require('fs');
const fsp = fs.promises;
const path = require('path');

const dir = path.join(__dirname, 'assets');
const newDir = path.join(__dirname, 'project-dist');

fsp.mkdir(newDir, { recursive: true })
  .then(() => fsp.readFile(path.join(__dirname, 'template.html'))).catch(e => console.log(e))
  .then((data) => {
    let template = data.toString();
    return fsp.readdir(path.join(__dirname, 'components'))
      .then((files) =>
        Promise.all(files.map((file) => 
          fsp.readFile(path.join(__dirname, 'components', file))
            .then((content) => {
              template = template.replace(`{{${file.split('.')[0]}}}`, content.toString());
            })
        ))
      )
      .then(() => fsp.writeFile(path.join(__dirname, 'project-dist', 'index.html'), template));
  })
  .then(() => 
    fsp.readdir(path.join(__dirname, 'styles')).then((files) => {
      if (files) {
        return Promise.all(files
          .filter((file) => file.split('.')[1] === 'css')
          .map((file) => fsp.readFile(path.join(__dirname, 'styles', file))));
      }
    })
      .then((filesContent) => {
        const bundle = filesContent.map((content) => content.toString().trim()).join('\n\n');
        fsp.writeFile(path.join(__dirname, 'project-dist', 'style.css'), `${bundle}\n`, () => {});
      })
  )
  .then(() => fs.readdir(dir, (err, assets) => {
    assets.forEach(asset => {
      fs.readdir(path.join(dir, asset), (err, files) => {
        fs.mkdir(path.join(newDir, 'assets', asset), { recursive: true }, () => {
          files.forEach(file => {
            fs.copyFile(path.join(dir, asset, file), path.join(newDir, 'assets', asset, file), () => {});
          });
        });
      });
    });
  }));
