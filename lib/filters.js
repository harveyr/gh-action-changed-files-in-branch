"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const path = __importStar(require("path"));
function isNotNodeModule(path) {
    return Boolean(path &&
        path.indexOf('node_modules/') !== 0 &&
        path.indexOf('/node_modules/') === -1);
}
exports.isNotNodeModule = isNotNodeModule;
function hasExtension(fp, extensions) {
    if (!extensions.length) {
        return true;
    }
    if (!fp) {
        return false;
    }
    return extensions.includes(path.extname(fp));
}
exports.hasExtension = hasExtension;
