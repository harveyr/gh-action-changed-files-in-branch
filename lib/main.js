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
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const core = __importStar(require("@actions/core"));
const exec_1 = require("./exec");
const util_1 = require("./util");
function run() {
    return __awaiter(this, void 0, void 0, function* () {
        const baseBranch = core.getInput('base-branch');
        const extensions = util_1.parseExtensions(core.getInput('extensions'));
        const parentSha = yield findParentCommitSha(baseBranch);
        const allFiles = yield diffFiles(parentSha);
        const filtered = util_1.filteredFiles(allFiles, extensions).map(f => {
            return util_1.trimPrefix(f, core.getInput('trim-prefix'));
        });
        core.setOutput('files', filtered.join(' '));
    });
}
function diffFiles(parentSha) {
    return __awaiter(this, void 0, void 0, function* () {
        const { stdout } = yield exec_1.captureOutput('git', ['diff', '--name-only', '--diff-filter=ACMRT', parentSha, 'HEAD'], { failOnStderr: true });
        const result = stdout.trim().split('\n');
        result.sort();
        return result;
    });
}
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
run().catch(err => {
    core.setFailed(`${err}`);
});
