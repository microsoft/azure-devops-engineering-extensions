"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tl = require("azure-pipelines-task-lib/task");
var Branch = /** @class */ (function () {
    function Branch(name, builds) {
        this.builds = builds;
        this.name = name;
    }
    Branch.prototype.getBuildFailStreak = function () {
        var count = 0;
        for (var numberBuild = 0; numberBuild < this.builds.length; numberBuild++) {
            if (this.builds[numberBuild].failed()) {
                count++;
            }
            else {
                break;
            }
        }
        tl.debug("number builds failing on " + this.name + " is " + count);
        return count;
    };
    Branch.prototype.getMostRecentFailedBuild = function () {
        for (var _i = 0, _a = this.builds; _i < _a.length; _i++) {
            var build = _a[_i];
            tl.debug(build.getId() + " : " + String(build.failed()));
            if (build.failed()) {
                tl.debug("failure: " + build.getId());
                return build;
            }
        }
        return null;
    };
    Branch.prototype.getName = function () {
        return this.name;
    };
    return Branch;
}());
exports.Branch = Branch;
