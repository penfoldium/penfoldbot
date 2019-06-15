![Penfoldbot - Your faithful personal assistant on Discord!](./assets/penfoldbot.png) made with :heart: by Penfoldium in Romania :romania:

# Penfold - the Discord bot :hamster::robot:

[![Dependencies](https://img.shields.io/david/penfoldium/penfoldbot.svg)](https://github.com/penfoldium/penfoldbot/blob/master/package.json#L19)
[![License](https://img.shields.io/github/license/penfoldium/penfoldbot.svg)](https://github.com/penfoldium/penfoldbot/blob/master/LICENSE)
[![Repository size](https://img.shields.io/github/repo-size/penfoldium/penfoldbot.svg)]()
[![Last commit](https://img.shields.io/github/last-commit/penfoldium/penfoldbot.svg)](https://github.com/penfoldium/penfoldbot/commits/master)
[![Commit activity](https://img.shields.io/github/commit-activity/w/penfoldium/penfoldbot.svg)](https://github.com/penfoldium/penfoldbot/commits/master)
[![Discord](https://img.shields.io/discord/564903050590945310.svg)](https://discord.gg/uaRkbEH)
[![Open Source Love](https://badges.frapsoft.com/os/v1/open-source.svg?v=103)]()

### Self hosting
Here's what you need to self host Penfold:
- A basic text editor to edit the [configuration](./src/data/config.example.json) file
- A valid Discord bot token (get one from [here](https://discordapp.com/developers/applications))
- [Node.js](https://nodejs.org/en) v10 or newer

### Optional stuff
These offer additional features, but the bot can run without them:
- YouTube Data API v3 key (follow the steps presented [here](https://developers.google.com/youtube/v3/getting-started))
- Genius API client (go [here](https://genius.com/api-clients))
- Spotify API client (go [here](https://developer.spotify.com/dashboard))

### Setup guide
- Edit the `config.example.json` file in `/src/data/` and rename it to `config.json`
- Install the required npm packages using `npm install`
- Run the bot by doing one of the following:
    * `node bot` (in the src folder)
    * `node src/bot` (in the git folder)
    * `npm start` (in the git folder)

*If you want to run the bot in a process manager, we recommend using **[pm2](https://pm2.keymetrics.io)**!*


#### And don't forget:
> A robot could never be like Penfold.
>
> \- [Danger Mouse](#and-dont-forget "(Danger Mouse 2015, Series 1, Episode 25, \"Megahurtz Attacks\", 04:29)")
