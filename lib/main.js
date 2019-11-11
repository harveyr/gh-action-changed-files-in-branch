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
const filters_1 = require("./filters");
const git_1 = require("./git");
const util_1 = require("./util");
function run() {
    return __awaiter(this, void 0, void 0, function* () {
        const baseBranch = core.getInput('base-branch');
        const extensions = util_1.parseExtensions(core.getInput('extensions')).map(util_1.normalizedExtension);
        const parentSha = yield git_1.findParentCommitSha(baseBranch);
        const allFiles = yield git_1.diffFiles(parentSha);
        const filtered = allFiles
            .filter(filters_1.isNotNodeModule)
            .filter(fp => {
            return filters_1.hasExtension(fp, extensions);
        })
            .map(fp => {
            return util_1.trimPrefix(fp, core.getInput('trim-prefix'));
        });
        core.setOutput('files', filtered.join(' '));
    });
}
run().catch(err => {
    core.setFailed(`${err}`);
});
