# gh-action-changed-files-in-branch

Github Action that outputs files that have changed in this branch.

**Requires use of [actions/checkout](https://github.com/actions/checkout) v2+.**
That versions checks out a branch instead of a detached head.

## Using the output

Since the files are output as a single string, you must (I think) use `xargs` to
pass them into a CLI tool.

For example::

```yaml
- name: ESLint changed files
  run: echo ${{ steps.changed-files-ui.outputs.files }} | xargs -t node node_modules/.bin/eslint
  if: steps.changed-files-ui.outputs.files
```
