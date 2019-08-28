const common = require("./common");
const fs = require("fs");

const path = require('path');
var directoryPath = path.resolve(__dirname, '../Tasks/EmailReportTask/images/');
var files = fs.readdirSync(directoryPath);

//listing all files using forEach
files.forEach(function (file) {
    // Do whatever you want to do with the file
    if(file.endsWith(".png")) {
      common.CopyFile(`${common.TaskSrcDir}/images/`, file, `${common.ExtensionOutDir}/images/`);
    }
});


common.CopyFile(`${common.TaskSrcDir}/htmlreport/`, "EmailTemplate.xslt", `${common.TaskOutDir}/htmlreport/`);
common.CopyFile(`${common.TaskSrcDir}/images/`, "outlook.png", `${common.TaskOutDir}`, "icon.png");