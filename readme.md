# ⚠️ This version of Penfold is deprecated. It is a preservation of what once was. Head over to the [master branch](https://github.com/penfoldium/penfoldbot/tree/master) for the latest release.

### Self-hosting

Here's what you need to self-host Penfold:

- A basic text editor to edit the [configuration](./src/data/config.example.json) file
- A valid Discord bot token (get one from [here](https://discordapp.com/developers/applications))
- [Node.js](https://nodejs.org/en) v10 or newer

### Optional stuff

These offer additional features, but the bot can run without them:

- YouTube Data API v3 key (follow the steps presented [here](https://developers.google.com/youtube/v3/getting-started))
- Genius API client (go [here](https://genius.com/api-clients))
- Spotify API client (go [here](https://developer.spotify.com/dashboard))
- Pokole (go [here](https://github.com/penfoldium/pokole))

### Setup guide

- Edit the `config.example.json` file in `/src/data/` and rename it to `config.json`
- Install the required npm packages using `npm install --no-optional` (if you have [node-gyp](https://github.com/nodejs/node-gyp) then use `npm install` for better performance)
- Run the bot by doing one of the following:
  - `node bot` (in the src folder)
  - `node src/bot` (in the git folder)
  - `npm start` (in the git folder)

_If you want to run the bot in a process manager, we recommend using **[pm2](https://pm2.keymetrics.io)**!_

#### And don't forget:

> A robot could never be like Penfold.
>
> \- [Danger Mouse](#and-dont-forget '(Danger Mouse 2015, Series 1, Episode 25, "Megahurtz Attacks", 04:29)')
