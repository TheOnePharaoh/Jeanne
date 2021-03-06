const reload = require('require-reload'),
    config = reload('../../config.json'),
    handleError = require('../../utils/utils.js').handleError;

module.exports = {
    desc: "Echo and deletes the command message.",
    usage: "<text>",
    aliases: ['echod'],
    guildOnly: true,
    task(bot, msg, suffix) {
        /**
         * perm checks
         * @param {boolean} sendMessages - Checks if the bots permissions has sendMessages
         * @param {boolean} embedLinks - Checks if the bots permissions has embedLinks
         */
        const sendMessages = msg.channel.permissionsOf(bot.user.id).has('sendMessages');
        const embedLinks = msg.channel.permissionsOf(bot.user.id).has('embedLinks');
        if (sendMessages === false) return;
        if (embedLinks === false) return msg.channel.createMessage(`\\❌ I'm missing the \`embedLinks\` permission, which is required for this command to work.`)
            .catch(err => {
                handleError(bot, __filename, msg.channel, err);
            });
        saydTimesUsed++
        bot.createMessage(msg.channel.id, {
            content: ``,
            embed: {
                color: config.defaultColor,
                author: {
                    name: ``,
                    url: ``,
                    icon_url: ``
                },
                description: `:speech_balloon: ${suffix}` || 'echo'
            }
        }).then(sentMsg => {
            bot.deleteMessage(sentMsg.channel.id, msg.id)
                .catch(err => {
                    handleError(bot, __filename, msg.channel, err);
                });
        }).catch(err => {
            handleError(bot, __filename, msg.channel, err);
        });
    }
};