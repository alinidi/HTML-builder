const path = require('path');
const fs = require('fs');

const folderPath = path.join(__dirname, 'secret-folder');

fs.readdir(folderPath, { withFileTypes: true }, (err, files) => {
  if (err) {
    console.log(`Error: ${err.message}`);
    return;
  }

  files.forEach((file) => {
    if (file.isFile()) {
      const filePath = path.join(folderPath, file.name);

      fs.stat(filePath, (err, stats) => {
        if (err) {
          console.log(`Error: ${err.message}`);
          return;
        }

        const fileName = path.parse(file.name).name;
        const fileExtension = path.parse(file.name).ext.slice(1);
        const fileSize = (stats.size / 1024).toFixed(3);

        console.log(`${fileName}-${fileExtension}-${fileSize}kb`);
      });
    }
  });
});
