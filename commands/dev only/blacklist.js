const blacklistSchema = require('../../models/blacklistSchema');
const Discord = require('discord.js');

module.exports = {
    name: 'blacklist',
    aliases: ['blacklistuser', 'bl', 'blu'],
    devOnly: true,
    description: 'Blacklist a user from using commands.',

    async run (bot, message, args) {
        const user = message.mentions.members.first() || message.guild.members.cache.get(args[0]) || args[0];

        if(!user) return message.lineReply('Provide a user pls');
        if(user.id === message.author.id) return message.lineReply(`You can't blacklist yourself <:megaJoy:850767631597830165>`);

        let reason = args.splice(1).join(' ');

        if(!reason) reason = 'No reason provided';

        blacklistSchema.findOne({
            userID: user.id,
        }, async (err, data) => {
            if(err) throw err;
            if(data) {
               return message.lineReply('That user is already blacklisted.'); 
            } else {
                data = new blacklistSchema({
                    userID: user.id,
                    reason: reason,
                })
                data.save().then(message.channel.send('User blacklisted.'))

                try {
                    user.send(
                        new Discord.MessageEmbed()
                        .setColor('0xdd5353')
                        .setTitle(`You've been blacklisted`)
                        .setAuthor(bot.user.username, bot.user.displayAvatarURL({ dynamic: true }))
                        .setTimestamp()
                        .setDescription('**What does this mean?**\nThis means that are not able to use my command anymore unless the developer unblacklists you. You can appeal this by clicking [here](https://www.youtube.com/watch?v=xvFZjo5PgG0 "Appeal form").')
                        .addField('Reason', reason)
                    )
                } catch(err) {
                    return;
                }
            }
        });
    }
}