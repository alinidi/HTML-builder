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
      fs.readdir(folderPath, { withFileTypes: true }, (err, files) => {
        if (err) {
          console.error(`Error: ${err.message}`);
          return;
        }

        let pendingFiles = files.filter((file) => file.isFile()).length;

        if (pendingFiles === 0) {
          console.log('No files to copy.');
          return;
        }

        files.forEach((file) => {
          if (file.isFile()) {
            const srcPath = path.join(folderPath, file.name);
            const copyPath = path.join(copyFolderPath, file.name);
            fs.copyFile(srcPath, copyPath, (err) => {
              if (err) {
                console.error(
                  `Error copying file: ${file.name}: ${err.message}`,
                );
              }
              pendingFiles -= 1;
              if (pendingFiles === 0) {
                console.log('All files copied successfully.');
              }
            });
          }
        });
      });
    });
  });
}
copyDir();
