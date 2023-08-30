"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DisplayNameHelper = void 0;
class DisplayNameHelper {
    static getPriorityDisplayName(priority) {
        const priorityInt = Number.parseInt(priority);
        if (!isNaN(priorityInt) && priorityInt == 255) {
            return "Priority unspecified";
        }
        return `Priority: ${priority}`;
    }
}
exports.DisplayNameHelper = DisplayNameHelper;
//# sourceMappingURL=DisplayNameHelper.js.map