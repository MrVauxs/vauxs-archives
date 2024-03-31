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

## [1.0.5] - 2024-03-31

### Added

- An additional warning to the user about having DFCE enabled when trying to read an archive, instead of doing so only on load where its more easily dismissed.

## [1.0.4] - 2024-03-30

### Fixed

- Lack of a CSS class resulting in Archive menu stylistically collapsing ([#5](https://github.com/MrVauxs/vauxs-archives/issues/6))

## [1.0.3] - 2024-03-29

### Fixed

- CSS Clashes with other modules in regards to chat button modifications ([#4](https://github.com/MrVauxs/vauxs-archives/issues/4))
- ID Clashes with Foundry / itself in regards to rendering chat log ([#5](https://github.com/MrVauxs/vauxs-archives/issues/5))

## [1.0.2] - 2024-03-29

### Fixed

- The selected archive becoming visually unselected after editing the archive
- The description having italics forced upon it

## [1.0.1] - 2024-03-29

### Fixed

- The styling of the "Description" to not intersect with the actual text

## [1.0.0] - 2024-03-29

### Added

- Sorting the archives by date or name
- Editing the archives description and name

## [0.6.1] - 2024-03-29

### Fixed

- Apparently right clicking not opening the menu

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
