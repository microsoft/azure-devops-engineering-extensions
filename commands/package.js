var exec = require("child_process").exec;
const path = require('path');
const common = require("./common");

// // *.json
const extJsonFile = common.CopyFile(common.TaskSrcDir, "vss-extension.json", common.ExtensionOutDir);
common.CopyFile(common.TaskSrcDir, `task.${common.ReleaseType}.json`, common.TaskOutDir, "task.json");
common.CopyFile(common.TaskSrcDir, `package.json`, common.TaskOutDir);
common.CopyFile(common.TaskSrcDir, `README.md`, common.ExtensionOutDir);
common.CopyFile(path.resolve(`${__dirname}/..`), `LICENSE`, common.ExtensionOutDir);

// Load existing publisher
var manifest = require(extJsonFile);
var extensionId = manifest.id;

// Package extension only for prod
if(common.ReleaseType.toLowerCase() == "prod") {
  var command = `tfx extension create --rev-version --root ${common.ExtensionOutDir} --output-path dist/ --manifest-globs ${extJsonFile} --extension-id ${extensionId} --no-prompt`;
  console.log(`Running: ${command}`);
  exec(command, function (error) {
    if (error) {
      console.log(`Package create error: ${error}`);
    } else {
      console.log("Package created");
    }
  });
} else {
  console.log(`Navigate to ${common.TaskOutDir} and run the tfx upload command on the desired azure devops account to upload task directly. Command: 'tfx login && tfx build tasks upload --task-path .'`);
}