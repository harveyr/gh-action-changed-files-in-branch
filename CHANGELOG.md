# Changelog

## v4

### Changed

- Changed the `extensions` input to `globs`. Uses the
  [minimatch](https://www.npmjs.com/package/minimatch) library to match changed
  files against globs.

## v3

### Fixed

- Fixed the order of the refs when diffing via the shell. The old method was
  seeing added files as deleted, since the diff was going the wrong way.

### Added

- `use-api` option to use the GitHub API instead of shelling out to git to do
  the diffing. The API can be much faster for big repos, but requires your
  GitHub token.

### Changed

- Using dashes in inputs for consistency with GitHub examples. (See action.yml.)
