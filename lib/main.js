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
const exec = __importStar(require("@actions/exec"));
const util_1 = require("./util");
function run() {
    return __awaiter(this, void 0, void 0, function* () {
        const baseBranch = core.getInput('base-branch');
        const extensions = util_1.parseExtensions(core.getInput('extensions'));
        let stdout = '';
        let stderr = '';
        yield exec.exec('git', ['diff', '--name-only', '--diff-filter=ACMRT', `origin/${baseBranch}`], {
            listeners: {
                stdout: (data) => {
                    stdout += data.toString();
                },
                stderr: (data) => {
                    stderr += data.toString();
                },
            },
        });
        if (stderr.trim()) {
            return core.setFailed('stderr was not empty');
        }
        const allFiles = stdout.trim().split('\n');
        allFiles.sort();
        const filtered = util_1.filteredFiles(allFiles, extensions);
        core.setOutput('files', filtered.join(' '));
    });
}
run().catch(err => {
    core.setFailed(`${err}`);
});
