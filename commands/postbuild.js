const common = require("./common");

common.CopyFile(`${common.TaskSrcDir}/htmlreport/`, "EmailTemplate.xslt", `${common.TaskOutDir}/htmlreport/`);
common.CopyFile(`${common.TaskSrcDir}/images/`, "outlook.png", `${common.ExtensionOutDir}/images/`);
common.CopyFile(`${common.TaskSrcDir}/images/`, "outlook.png", `${common.TaskOutDir}`, "icon.png");