![Penfoldbot - Your faithful personal assistant on Discord!](./assets/penfoldbot.png) made with :heart: by Penfoldium in Romania :romania:

# Penfold - the Discord bot :hamster::robot:

[![License](https://img.shields.io/github/license/penfoldium/penfoldbot.svg)](https://github.com/penfoldium/penfoldbot/blob/master/LICENSE)
[![Repository size](https://img.shields.io/github/repo-size/penfoldium/penfoldbot.svg)]()
[![Commit activity](https://img.shields.io/github/commit-activity/w/penfoldium/penfoldbot.svg)](https://github.com/penfoldium/penfoldbot/commits/master)
[![Discord](https://img.shields.io/discord/564903050590945310.svg)](https://discord.gg/uaRkbEH)

### Self-hosting

Here's what you need to self-host Penfold:

- A basic text editor to edit the [configuration](./example.env) file
- A valid Discord bot token (get one from [here](https://discord.com/developers/applications))
- [Node.js](https://nodejs.org/en) LTS or newer

### Optional stuff

These offer additional features, but the bot can run without them:

- YouTube Data API v3 key (follow the steps presented [here](https://developers.google.com/youtube/v3/getting-started))
- Genius API client (go [here](https://genius.com/api-clients))
- Spotify API client (go [here](https://developer.spotify.com/dashboard))
- Pokole (go [here](https://github.com/penfoldium/pokole))

### Setup guide

- Edit the `example.env` file and rename it to `.env`
- Install the required npm packages using `npm install`
- Build the bot using `npm run build`
- Generate the database and prisma client `DATABASE_URL=file:./db/penfold.sqlite npx prisma migrate deploy && DATABASE_URL=file:./db/penfold.sqlite npx prisma generate` (replace `DATABASE_URL` with whichever path you set in the `.env` file)
- Run the bot using either commands:
  - `node --env-file src/data/.env dist/src/Penfold`
  - `npm run start` (assumes that the env file is called `.env` - builds automatically)

_If you want to run the bot in a process manager, we recommend using **[pm2](https://pm2.keymetrics.io)**!_

#### And don't forget:

> A robot could never be like Penfold.
>
> \- [Danger Mouse](#and-dont-forget '(Danger Mouse 2015, Series 1, Episode 25, "Megahurtz Attacks", 04:29)')
