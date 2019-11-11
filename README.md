# gh-action-changed-files-in-branch

Github Action that outputs files that have changed in this branch.

## Caveats

Note that, at this time, you cannot simply use this ouput as an argument to a
CLI tool.

For example, this step won't work:

```yaml
- name: ESLint changed files
  run: npx eslint "${{ steps.run.outputs.files }}"
  if: steps.run.outputs.files
```

because `eslint` will see all the changed files as a single argument:

```bash
npx eslint "__tests__/util.test.ts src/main.ts src/util.ts"
```

and you'll get an error like:

```
No files matching '__tests__/util.test.ts src/main.ts src/util.ts' were found.
```

Instead, the output should be consumed by another action that can parse it
properly.
