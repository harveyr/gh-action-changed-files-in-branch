"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
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
function trimPrefix(path, prefix) {
    if (path && prefix && path.indexOf(prefix) === 0)
        return path.slice(prefix.length);
    return path;
}
exports.trimPrefix = trimPrefix;
