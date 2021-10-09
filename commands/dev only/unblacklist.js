const blacklistSchema = require('../../models/blacklistSchema');
const Discord = require('discord.js');

module.exports = {
    name: 'unblacklist',
    aliases: ['ubl'],
    devOnly: true,
    description: 'Unblacklist a user',

    async run (bot, message, args) {
        const user = message.mentions.members.first() || message.guild.members.cache.get(args[0]) || args[0];

        if(!user) return message.lineReply('You gotta specify a user.');
        if(user.id === message.author.id) return message.lineReply(`You're not blacklisted -_-`);

        blacklistSchema.findOne({ userID: user.id }, async (err, data) => {
            if(err) throw err;
            if(!data) {
                return message.lineReply(`That user is not blacklisted.`)
            } else {
                data.delete().then(message.channel.send('User unblacklisted.'))

                try {
                    user.send(
                        new Discord.MessageEmbed()
                        .setColor('0x7cc576')
                        .setTitle('Hey buddy, I gotta tell you something')
                        .setAuthor(bot.user.username, bot.user.displayAvatarURL({ dynamic: true }))
                        .setFooter('haha yes')
                        .setDescription(`You've been unblacklisted, this means that now you're able to use my commands again.`)
                    )
                } catch(err) {
                    return;
                }
            }
        })
    }
}