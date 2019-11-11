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
function normalizedExtension(ext) {
    if (!ext) {
        return ext;
    }
    if (ext.indexOf('.') === 0) {
        return ext;
    }
    return `.${ext}`;
}
exports.normalizedExtension = normalizedExtension;
function filteredFiles(files, extensions) {
    if (!extensions.length) {
        return files;
    }
    extensions = extensions.map(normalizedExtension);
    return files.filter(f => {
        return extensions.includes(path.extname(f));
    });
}
exports.filteredFiles = filteredFiles;
function parseExtensions(input) {
    if (!input)
        return [];
    return input
        .trim()
        .split(' ')
        .map(e => {
        return e.trim();
    })
        .filter(e => {
        return e.length > 0;
    })
        .map(normalizedExtension);
}
exports.parseExtensions = parseExtensions;
