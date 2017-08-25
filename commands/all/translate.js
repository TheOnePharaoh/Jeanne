const reload = require('require-reload'),
    config = reload('../../config.json'),
    handleError = require('../../utils/utils.js').handleError,
    handleMsgError = require('../../utils/utils.js').handleMsgError,
    translate = require('google-translate-api');

module.exports = {
    desc: "Translate words/sentences.",
    usage: "<word(s)/sentance> | <from lang> | <to lang> \` (Make sure to seperate them with a \`|\`)\n\`Example: j:translate I'm feeling sick | en | nl",
    aliases: ['tl', 'trans'],
    cooldown: 10,
    guildOnly: true,
    task(bot, msg, args) {
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
                handleError(bot, err);
            });
        if (!args) return 'wrong usage';
        translateTimesUsed++
        const str = args + "";
        const array = str.split(/ ?\| ?/);
        let text = array[0],
            fromLang = array[1],
            toLang = array[2];
        if (!text) return 'wrong usage';
        if (!fromLang) return 'wrong usage';
        if (!toLang) return 'wrong usage';
        const query = text.replace(/'/g, "");
        translate(query, { from: fromLang, to: toLang })
            .then(res => {
                let answer = res.text;
                answer = answer.replace(/&#39;/, "'");
                msg.channel.createMessage({
                        content: ``,
                        embed: {
                            color: config.defaultColor,
                            author: {
                                name: `${msg.author.username}`,
                                url: ``,
                                icon_url: `${msg.author.avatarURL}`
                            },
                            description: `${fromLang}: ${text}\n${toLang}: ${answer}`
                        }
                    })
                    .catch(err => {
                        handleError(bot, err);
                    });
            })
            .catch(err => {
                handleMsgError(bot, msg.channel, err);
            });
    }
};