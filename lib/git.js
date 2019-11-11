"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const exec_1 = require("./exec");
function findParentCommitSha(baseBranch) {
    return __awaiter(this, void 0, void 0, function* () {
        const { stdout, stderr } = yield exec_1.captureOutput('git', [
            'merge-base',
            `origin/${baseBranch}`,
            `HEAD`,
        ]);
        if (stderr) {
            throw new Error('command failed (stderr not empty)');
        }
        return stdout;
    });
}
exports.findParentCommitSha = findParentCommitSha;
function diffFiles(parentSha) {
    return __awaiter(this, void 0, void 0, function* () {
        const { stdout } = yield exec_1.captureOutput('git', ['diff', '--name-only', '--diff-filter=ACMRT', parentSha, 'HEAD'], { failOnStderr: true });
        const result = stdout.trim().split('\n');
        result.sort();
        return result;
    });
}
exports.diffFiles = diffFiles;
