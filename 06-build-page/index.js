const fs = require('fs');
const path = require('path');

const templatePath = path.join(__dirname, 'template.html');
const componentsPath = path.join(__dirname, 'components');
const projectDistPath = path.join(__dirname, 'project-dist');
const indexPath = path.join(projectDistPath, 'index.html');
const stylesPath = path.join(__dirname, 'styles');
const styleFilePath = path.join(projectDistPath, 'style.css');
const assetsPath = path.join(__dirname, 'assets');
const assetsDistPath = path.join(projectDistPath, 'assets');

//new folder project-dist
fs.rm(projectDistPath, { recursive: true, force: true }, (err) => {
  if (err) console.log(err);
  fs.mkdir(projectDistPath, { recursive: true }, (err) => {
    if (err) console.log(err);
    buildHTML();
    mergeStyles();
    copyAssets(assetsPath, assetsDistPath);
  });
});

//index.html
function buildHTML() {
  fs.readFile(templatePath, 'utf-8', (err, templateData) => {
    if (err) {
      console.log(`Error: ${err.message}`);
      return;
    }
    const tagReg = /{{\s*([\w-]+)\s*}}/g;
    const matches = [...templateData.matchAll(tagReg)];
    const tags = matches.map((match) => match[1]);

    fs.readdir(componentsPath, { withFileTypes: true }, (err, files) => {
      if (err) {
        console.log(`Error: ${err.message}`);
        return;
      }

      const htmlFiles = files.filter(
        (file) => file.isFile() && path.extname(file.name) === '.html',
      );

      let changedTemplate = templateData;

      const readComponent = (index) => {
        if (index === htmlFiles.length) {
          fs.writeFile(indexPath, changedTemplate, (err) => {
            if (err) console.log(`Error: ${err.message}`);
          });
          return;
        }

        const file = htmlFiles[index];
        const componentName = path.parse(file.name).name;

        if (tags.includes(componentName)) {
          fs.readFile(
            path.join(componentsPath, file.name),
            'utf-8',
            (err, content) => {
              if (err) {
                console.log(
                  `Error reading component ${file.name}: ${err.message}`,
                );
                return;
              }
              const tagReg = new RegExp(`{{\\s*${componentName}\\s*}}`, 'g');
              changedTemplate = changedTemplate.replace(tagReg, content);
              readComponent(index + 1);
            },
          );
        } else {
          readComponent(index + 1);
        }
      };

      readComponent(0);
    });
  });
}

//merge styles
function mergeStyles() {
  fs.readdir(stylesPath, { withFileTypes: true }, (err, files) => {
    if (err) console.log(`Error: ${err.message}`);

    const cssFiles = files.filter(
      (file) => file.isFile() && path.extname(file.name) === '.css',
    );

    const writeStream = fs.createWriteStream(styleFilePath);

    cssFiles.forEach((file, index) => {
      const filePath = path.join(stylesPath, file.name);

      fs.readFile(filePath, 'utf-8', (err, data) => {
        if (err) console.log(`Error: ${err.message}`);
        writeStream.write(data + '\n');
        if (index === cssFiles.length - 1) writeStream.end();
      });
    });
  });
}

//copy assets
function copyAssets(src, dest) {
  fs.mkdir(dest, { recursive: true }, (err) => {
    if (err) console.log(err);

    fs.readdir(src, { withFileTypes: true }, (err, files) => {
      if (err) console.log(err);

      files.forEach((file) => {
        const srcPath = path.join(src, file.name);
        const destPath = path.join(dest, file.name);

        if (file.isDirectory()) {
          copyAssets(srcPath, destPath);
        } else {
          fs.copyFile(srcPath, destPath, (err) => {
            if (err) console.log(err);
          });
        }
      });
    });
  });
}
