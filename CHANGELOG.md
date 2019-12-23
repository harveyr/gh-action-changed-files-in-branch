# Changelog

## v3

### Fixed

- Fixed the order of the refs when diffing via the shell. The old method was
  seeing added files as deleted, since the diff was going the wrong way.

### Added

- `use-api` option, which is the new default. It is much faster than shelling
  out to git for big repos.

### Changed

- Using dashes in inputs for consistency with GitHub examples. (See action.yml.)
