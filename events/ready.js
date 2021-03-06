var Nf = new Intl.NumberFormat('en-US'),
    reload = require('require-reload'),
    _Logger = reload('../utils/Logger.js'),
    logger;

module.exports = (bot, config, games, utils) => {
    if (logger === undefined)
        logger = new _Logger(config.logTimestamp);
    utils.checkForUpdates();
    bot.shards.forEach(shard => {
        let name = games[~~(Math.random() * games.length)];
        name = name.replace(/\$\{GUILDSIZE\}/gi, bot.guilds.size);
        name = name.replace(/\$\{USERSIZE\}/gi, bot.users.size);
        shard.editStatus(null, { name: name, type: 0 });
    });
    logger.logWithHeader('READY', 'bgGreen', 'black', `S:${Nf.format(bot.guilds.size)} U:${Nf.format(bot.users.size)} AVG:${Nf.format((bot.users.size / bot.guilds.size).toFixed(2))}`);
}