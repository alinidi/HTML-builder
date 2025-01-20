const fs = require('fs');
const path = require('path');

const folderPath = path.join(__dirname, 'files');
const copyFolderPath = path.join(__dirname, 'files-copy');

function copyDir() {
  fs.rm(copyFolderPath, { recursive: true, force: true }, (err) => {
    if (err) {
      console.error(`Error: ${err.message}`);
      return;
    }
    fs.mkdir(copyFolderPath, { recursive: true }, (err) => {
      if (err) {
        console.error(`Error: ${err.message}`);
        return;
      }
      fs.readdir(folderPath, (err, files) => {
        if (err) {
          console.error(`Error: ${err.message}`);
          return;
        }
        files.forEach((file) => {
          const srcPath = path.join(folderPath, file);
          const copyPath = path.join(copyFolderPath, file);
          fs.copyFile(srcPath, copyPath, (err) => {
            if (err) {
              console.error(`Error: ${err.message}`);
              return;
            }
          });
        });
      });
    });
  });
}
copyDir();
