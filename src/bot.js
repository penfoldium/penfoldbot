const { Client, PermissionLevels } = require('klasa');
const config = require('./data/config.json');

config.permissionLevels = new PermissionLevels()
    .add(0, () => true)
    .add(4, ({ guild, member }) => guild && member.permissions.has('KICK_MEMBERS'), { fetch: true })
    .add(5, ({ guild, member }) => guild && member.permissions.has('BAN_MEMBERS'), { fetch: true })
    .add(6, ({ guild, member }) => guild && member.permissions.has('ADMINISTRATOR'), { fetch: true })
    .add(7, ({ guild, member }) => guild && member === guild.owner, { fetch: true })
    .add(9, ({ author, client }) => config.owners.includes(author.id), { break: true })
    .add(10, ({ author, client }) => config.owners.includes(author.id));

Client.defaultClientSchema.add('fortniteitems', 'string');
Client.defaultUserSchema
    .add('fortniteitems', 'string', { array: true, configurable: false })
    .add('tweaksearch', 'boolean', { default: true });
Client.defaultGuildSchema.add('tweaksearch', 'boolean', { default: true });

new Client({
    config,
    fetchAllMembers: false,
    disableEveryone: true,
    prefix: config.prefix,
    commandEditing: true,
    prefixCaseInsensitive: true,
    permissionLevels: config.permissionLevels,
    readyMessage: (client) => `Successfully initialized as ${client.user.tag}. Ready to serve ${client.guilds.size} guilds with a total of ${client.users.size} users.`
}).login(config.token);