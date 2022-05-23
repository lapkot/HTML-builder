const fsp = require('fs').promises;
const path = require('path');

fsp.readdir(path.join(__dirname, 'styles')).then((files) => {
  if (files) {
    return Promise.all(files
      .filter((file) => file.split('.')[1] === 'css')
      .map((file) => fsp.readFile(path.join(__dirname, 'styles', file))));
  }
})
  .then((filesContent) => {
    const bundle = filesContent.map((content) => content.toString().trim()).join('\n\n');
    fsp.writeFile(path.join(__dirname, 'project-dist', 'bundle.css'), `${bundle}\n`, () => {});
  });
