var exec = require("child_process").exec;

var extName = process.argv[process.argv.length - 2];
// prod or dev
var taskReleaseType = process.argv[process.argv.length - 1];
if(!extName || !taskReleaseType) {
  console.error("ExtensionName and ReleaseType must both be passed as argument. Ex: <pullRequestInsights prod>");
  return;
}

const fs = require('fs');
const path = require('path');
console.log(`Current dir: ${__dirname}`);
const extDir = path.resolve(`${__dirname}/../js/${extName}Extension/`);
const taskDir = path.resolve(`${extDir}/${extName}Task/`);
const taskSrcDir = path.resolve(`${__dirname}/../Tasks/${extName}Task/`);

function copyFile(srcDir, fileName, destFolder, destFileName = undefined) {
  destFileName = destFileName == undefined ? fileName : destFileName;
  const srcFile = path.resolve(`${srcDir}/${fileName}`);
  const destFile = path.resolve(`${destFolder}/${destFileName}`);
  console.log(`Copying from ${srcFile} to ${destFile}`);
  fs.copyFileSync(`${srcFile}`, `${destFile}`, (err) => {
    if (err) {
      console.log(`unable to copy '${fileName}' to outdir: '${outDir}'`);
      throw err;    
    } 
    console.log(`${fileName} copied to outdir: '${outDir}'`);
  });
  return destFile;
}

// // *.json
const extJsonFile = copyFile(taskSrcDir, "vss-extension.json", extDir);
copyFile(taskSrcDir, `task.${taskReleaseType}.json`, taskDir, "task.json");
copyFile(taskSrcDir, `README.md`, extDir);
copyFile(path.resolve(`${__dirname}/..`), `LICENSE`, extDir);

// Load existing publisher
var manifest = require(extJsonFile);
var extensionId = manifest.id;

// Package extension only for prod
if(taskReleaseType.toLowerCase() == "prod") {
  var command = `tfx extension create --rev-version --root ${extDir} --output-path dist/ --manifest-globs ${extJsonFile} --extension-id ${extensionId} --no-prompt`;
  console.log(`Running: ${command}`);
  exec(command, function (error) {
    if (error) {
      console.log(`Package create error: ${error}`);
    } else {
      console.log("Package created");
    }
  });
} else {
  console.log(`Navigate to ${taskDir} and run the tfx upload command on the desired azure devops account to upload task directly. Command: 'tfx login && tfx build tasks upload --task-path .'`);
}