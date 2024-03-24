# Vauxs' Archives

![All Downloads](https://img.shields.io/github/downloads/MrVauxs/vauxs-archives/total?color=purple&label=All%20Downloads)
![Latest Version Downloads](https://img.shields.io/github/downloads/MrVauxs/vauxs-archives/latest/total?color=purple&label=Latest%20Version%20Downloads&sort=semver)
[![Forge Installs](https://img.shields.io/badge/dynamic/json?label=Forge%20Installs&query=package.installs&suffix=%25&url=https%3A%2F%2Fforge-vtt.com%2Fapi%2Fbazaar%2Fpackage%2Fvauxs-archives&colorB=4aa94a)](https://forge-vtt.com/bazaar#package=vauxs-archives)
[![Foundry Hub Endorsements](https://img.shields.io/endpoint?logoColor=white&url=https%3A%2F%2Fwww.foundryvtt-hub.com%2Fwp-json%2Fhubapi%2Fv1%2Fpackage%2Fvauxs-archives%2Fshield%2Fendorsements)](https://www.foundryvtt-hub.com/package/vauxs-archives/)

Previously Vauxs Chat Enhancements, this module is just the archives feature.

Why did I make the module much smaller in scope? For sake of finishing it and preserving my sanity.

## TODO for 1.0.0

- [x] Chat Archives - Create archives of the chat log and browse them in-game.
  - [x] Quick Search - Be able to search the archives for specific messages.
  - [ ] Quick Archive - Replace the "Export Chat Log" button with a Vauxs' Archives button.
  - [ ] Edit Archive - Edit the name, description, and date of a given archive.
  - [x] Render 1:1 - The archive is an accurate recreation of how the chatlog was rendered at the time.
  - [x] Foundry to Discord integration - ~~Allow the messages to not be deleted on Discord when archiving them.~~ If your message count is higher than 10, FtD won't delete the messages anyway.
  - [x] DFCE integration - Be able to read DFCE archives. Likely to be achieved by manually pointing at the JSON file.

## Maybe

- [ ] 'Cron' Archive - Archive (and opt. prune) the chat automatically once the oldest message passes the threshold of ex. a week.
- [ ] Rolls Summary - See the rolls of a given archive summarized, per user.

## Preview (0.4.0)

![chrome_mc4F1Huyrd](https://github.com/MrVauxs/vauxs-archives/assets/32039708/e7cf5272-0d5c-4ea3-8daa-3183ebfa1e61)
