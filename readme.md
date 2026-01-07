![Penfoldbot - Your faithful personal assistant on Discord!](./assets/penfoldbot.png) made with :heart: by Penfoldium in Romania :romania:

# Penfold - the Discord bot :hamster::robot:

[![Crowdin](https://badges.crowdin.net/penfold/localized.svg)](https://crowdin.com/project/penfold)
[![License](https://img.shields.io/github/license/penfoldium/penfoldbot.svg)](https://github.com/penfoldium/penfoldbot/blob/master/LICENSE)
[![Repository size](https://img.shields.io/github/repo-size/penfoldium/penfoldbot.svg)]()
[![Commit activity](https://img.shields.io/github/commit-activity/w/penfoldium/penfoldbot.svg)](https://github.com/penfoldium/penfoldbot/commits/master)
[![Discord](https://img.shields.io/discord/564903050590945310.svg)](https://discord.gg/uaRkbEH)

⌛ Looking for the legacy version of Penfold? Head over to the [legacy branch](https://github.com/penfoldium/penfoldbot/tree/legacy)

### Self-hosting

Here's what you need to self-host Penfold:

- A basic text editor to edit the [configuration](./example.env) file
- A valid Discord bot token (get one from [here](https://discord.com/developers/applications))
- [Node.js](https://nodejs.org/en) LTS or newer

### Setup guide

- Edit the `example.env` file and rename it to `.env`
- Install the required npm packages using `npm install`
- Generate the database and Prisma Client `DATABASE_URL=file:./db/penfold.sqlite npm run prisma:init` (replace `DATABASE_URL` with whichever path you set in the `.env` file)
- Build the bot using `npm run build`
- Run the bot using either commands:
  - `node --env-file src/data/.env dist/src/Penfold`
  - `npm run start` (assumes that the env file is called `.env` - builds automatically)

_If you want to run the bot in a process manager, we recommend using **[pm2](https://pm2.keymetrics.io)**!_

#### And don't forget:

> A robot could never be like Penfold.
>
> \- [Danger Mouse](#and-dont-forget '(Danger Mouse 2015, Series 1, Episode 25, "Megahurtz Attacks", 04:29)')
