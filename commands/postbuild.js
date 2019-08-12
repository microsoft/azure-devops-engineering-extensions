const common = require("./common");
//const { CopyFile } = common;

common.CopyFile(`${common.TaskSrcDir}/htmlreport/`, "EmailTemplate.xslt", `${common.TaskOutDir}/htmlreport/`);
common.CopyFile(`${common.TaskSrcDir}/images/`, "outlook.png", `${common.ExtensionOutDir}/images/`);