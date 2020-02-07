var exec = require("child_process").exec;
const path = require('path');
const common = require("./common");
var process = require('process');
const fs = require("fs");

// // *.json
const extJsonFile = common.CopyFile(common.TaskSrcDir, "vss-extension.json", common.ExtensionOutDir);
common.CopyFile(common.TaskSrcDir, `task.${common.ReleaseType}.json`, common.TaskOutDir, "task.json");
common.CopyFile(common.TaskSrcDir, `package.json`, common.TaskOutDir);
common.CopyFile(common.TaskSrcDir, `README.md`, common.ExtensionOutDir);
common.CopyFile(path.resolve(`${__dirname}/..`), `LICENSE`, common.ExtensionOutDir);

// Load existing publisher
var manifest = require(extJsonFile);
var extensionId = manifest.id;

const cwd = process.cwd();
process.chdir(common.TaskOutDir);

var npmInstallCommand = "npm install"
console.log(`Running: ${npmInstallCommand}`);
exec(npmInstallCommand, function (error) {
  if (error) {
    console.log(`NPM Install Error: ${error}`);
  } else {
    console.log("NPM Install Done");
    
    var imagesDir = path.resolve(common.TaskSrcDir, "images");
    if (fs.existsSync(imagesDir)) {
      var files = fs.readdirSync(imagesDir);
      //listing all files using forEach
      files.forEach(function (file) {
        // Do whatever you want to do with the file
        if (file.endsWith(".png")) {
          common.CopyFile(imagesDir, file, `${common.ExtensionOutDir}/images/`);
        }
      });

      if(fs.existsSync(path.resolve(imagesDir, "icon.png"))) {
        common.CopyFile(imagesDir, "icon.png", `${common.TaskOutDir}`);
      }
    }
    // Package extension only for prod
    if (common.ReleaseType.toLowerCase() == "prod") {
      console.log(`Run command in ${common.ExtensionOutDir}: tfx extension create --root . --extension-id ${extensionId} --no-prompt`);
      process.chdir(common.ExtensionOutDir);
      var command = `tfx extension create --root . --extension-id ${extensionId} --no-prompt`;
      console.log(`Running: ${command}`);
      exec(command, function (error) {
        if (error) {
          console.log(`Package create error: ${error}`);
        } else {
          console.log("Package created. Upload the VSIX to Visual Studio Marketplace if you wish to publish the extension.");
          console.log(`If you want to upload to AzureDevOps account directly, then Navigate to ${common.TaskOutDir} and run the tfx upload command on the desired azure devops account to upload task directly. Command: 'tfx login && tfx build tasks upload --task-path .'`);
          process.chdir(cwd);      
        }
      });
    }
  }
});
