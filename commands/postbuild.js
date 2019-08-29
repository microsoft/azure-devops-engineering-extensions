const common = require("./common");

common.CopyFile(`${common.TaskSrcDir}/htmlreport/`, "EmailTemplate.xslt", `${common.TaskOutDir}/htmlreport/`);