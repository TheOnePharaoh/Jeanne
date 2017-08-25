var reload = require('require-reload'),
    config = reload('../config.json'),
    _Logger = reload('../utils/Logger.js'),
    bannedGuilds = reload('../banned_guilds.json'),
    utils = reload('../utils/utils.js'),
    handleError = require("../utils/utils.js").handleError,
    handleMsgError = require("../utils/utils.js").handleMsgError,
    formatTime = reload('../utils/utils.js').formatTime,
    version = reload('../package.json').version,
    Nf = new Intl.NumberFormat('en-US'),
    logger;
moment = require('../node_modules/moment');
const round = require('../utils/utils.js').round;

module.exports = (bot, _settingsManager, _config, guild, unavailable) => {
    if (config.abalBotsKey) { //Send servercount to Abal's bot list
        if (bot.uptime !== 0)
            utils.updateAbalBots(bot.user.id, config.abalBotsKey, bot.guilds.size);
    }
    if (config.discordbotsorg) { //Send servercount to discordbots.org
        if (bot.uptime !== 0)
            utils.updateDiscordBots(bot.user.id, config.discordbotsorg, bot.guilds.size, bot.shards.size);
    }
    if (unavailable === true) return bot.createMessage('306837434275201025', {
        content: ``,
        embed: {
            color: config.errorColor,
            title: `Left guild:`,
            description: `Just some random guild bruh.`,
        }
    }).catch(err => {
        handleError(err);
    });
    if (logger === undefined) logger = new _Logger(_config.logTimestamp);
    logger.logWithHeader('LEFT GUILD', 'bgRed', 'black', `${guild.name} (${guild.id}) owned by ${guild.members.get(guild.ownerID).user.username}#${guild.members.get(guild.ownerID).user.discriminator}`);
    bot.executeWebhook(config.join_leaveWebhookID, config.join_leaveWebhookToken, {
            embeds: [{
                color: config.errorColor,
                title: `Left guild:`,
                description: `**__${guild.name} (${guild.id})__**`,
                thumbnail: {
                    url: `${guild.iconURL === null ? `` : ''}${guild.iconURL !== null ? guild.iconURL : ''}`
                },
                fields: [{
                        name: `Owner`,
                        value: `${guild.members.get(guild.ownerID).user.username}#${guild.members.get(guild.ownerID).user.discriminator}\n(${guild.ownerID})`,
                        inline: true
                    },
                    {
                        name: `Members`,
                        value: guild.memberCount,
                        inline: true
                    },
                    {
                        name: `Bots`,
                        value: guild.members.filter(user => user.user.bot).length,
                        inline: true
                    },
                    {
                        name: `Humans`,
                        value: guild.memberCount - guild.members.filter(user => user.user.bot).length,
                        inline: true
                    }
                ]
            }],
            username: `${bot.user.username}`,
            avatarURL: `${bot.user.dynamicAvatarURL('png', 2048)}`
        })
        .catch(err => {
            handleError(err);
        });
};