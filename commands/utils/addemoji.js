const Discord = require('discord.js');

module.exports = {
    name: 'addemoji',
    aliases: ['stealemoji', 'emojiadd'],
    description: 'Adds an emoji that you want from another server.',

    async run (bot, message, args) {
        if(!message.member.hasPermission('MANAGE_EMOJIS')) return message.delete();
        if(!args.length) return message.lineReply('Bruh, provide an emoji');

        for (const rawEmoji of args) {
            const parsedEmoji = Discord.Util.parseEmoji(rawEmoji);

            if(parsedEmoji) {
                const extension = parsedEmoji.animated ? '.gif' : '.png';
                const url = `https://cdn.discordapp.com/emojis/${parsedEmoji.id + extension}`;
                message.guild.emojis.create(url, parsedEmoji.name).then((emoji) => message.channel.send(`Added: \`${emoji.url}\``));
            }
        }
    }
}