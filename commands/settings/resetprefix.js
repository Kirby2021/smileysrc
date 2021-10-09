const prefixSchema = require('../../models/prefixSchema');
const prefix = require('../../config.json').prefix;

module.exports = {
    name: 'resetprefix',
    aliases: ['rp'],
    description: 'Reset the prefix in your server.',

    async run (bot, message, args) {
        if(!message.member.hasPermission('MANAGE_GUILD')) return message.delete();
        await prefixSchema.findOne({ guildID: message.guild.id }, async (err, data) => {
            if(!data) return message.lineReply('The prefix is already the default one.');

            data.delete();
            message.channel.send(`Prefix reseted to **${prefix}**`);
        });
    }
}