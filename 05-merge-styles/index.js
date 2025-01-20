const fs = require('fs');
const path = require('path');

const stylesPath = path.join(__dirname, 'styles');
const bundlePath = path.join(__dirname, 'project-dist', 'bundle.css');

fs.rm(bundlePath, { recursive: true, force: true }, (err) => {
  if (err) {
    console.error(`Error: ${err.message}`);
    return;
  }

  let styles = [];

  fs.readdir(stylesPath, { withFileTypes: true }, (err, files) => {
    if (err) {
      console.error(`Error: ${err.message}`);
      return;
    }

    files.forEach((file) => {
      if (file.isFile() && path.extname(file.name) === '.css') {
        const filePath = path.join(stylesPath, file.name);

        fs.readFile(filePath, 'utf-8', (err, data) => {
          if (err) {
            console.error(`Error: ${err.message}`);
            return;
          }

          styles.push(data);

          if (
            styles.length ===
            files.filter((f) => path.extname(f.name) === '.css').length
          ) {
            fs.writeFile(bundlePath, styles.join('\n'), (err) => {
              if (err) {
                console.error(`Error: ${err.message}`);
                return;
              }
            });
          }
        });
      }
    });
  });
});
