"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StringUtils = void 0;
class StringUtils {
    static isNullOrWhiteSpace(input) {
        if (typeof input === 'undefined' || input == null)
            return true;
        return input.replace("/\s/g", '').length < 1;
    }
    static CompressNewLines(content) {
        if (content != null) {
            const lines = this.getNonEmptyLines(content);
            content = lines.join("\n");
        }
        return content;
    }
    static getNonEmptyLines(s) {
        s = s.replace("\r", "");
        return s.split('\n')
            .filter(str => !this.isNullOrWhiteSpace(str))
            .map(str => str.trim());
    }
    static ReplaceNewlineWithBrTag(content) {
        if (content == null) {
            return null;
        }
        const lines = this.getNonEmptyLines(content);
        return lines.join("<br/>");
    }
    static getFirstNLines(content, lineCount) {
        if (content != null) {
            var lines = this.getNonEmptyLines(content);
            return lines.slice(0, lineCount).join("\n");
        }
        return null;
    }
}
exports.StringUtils = StringUtils;
//# sourceMappingURL=StringUtils.js.map