<!-- markdownlint-configure-file {"MD024": { "siblings_only": true } } -->
# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added

### Changed

### Deprecated

### Fixed

## [0.6.0] - 2024-03-29

### Added

- Buttons in the chat window for quick access to creating and browsing archives
  - A setting to replace the Export Chat Log button with the Create Archive button (right clicking the button opens the Chat Archives menu)
  - A setting to remove the Clear Chat Log button

## [0.5.1] - 2024-03-24

### Fixed

- The module using default Foundry `ChatMessage` and `ChatLog` classes instead of those defined by the system, leading to inaccurate or non-functional messages being rendered
- Being unable to uncheck "Delete Messages" option after checking it true

## [0.5.0] - 2024-03-24

### Added

- Changelogs
- Searchbar in the ChatLog
- Filepath of selected archive in Archives Menu

### Changed

- In an event something modifies the filepath after creating an archive, the module will use the new filepath
