const Discord = require('discord.js');

module.exports = {
    name: 'pfp',
    aliases: ['av', 'avatar'],
    description: 'Get someone\'s picture profile.',
    
    async run (bot, message, args) {
        if(message.channel.id !== '891686229979062323') return lineReplyge.reply('not here pls');

        const user = message.mentions.members.first() || message.guild.members.cache.get(args[0]);

        if(!user || user.id === message.author.id) {
            const pfpAuthorEmbed = new Discord.MessageEmbed()
            .setTitle('Picture for profile')
            .setAuthor(message.author.tag, message.author.displayAvatarURL({ dynamic: true }))
            .setImage(message.author.displayAvatarURL({ dynamic: true, size: 512 }))
            message.lineReplyNoMention(pfpAuthorEmbed)
        } else if(user) {
            const pfpUserEmbed = new Discord.MessageEmbed()
            .setTitle('Picture for profile')
            .setAuthor(user.user.tag, user.user.displayAvatarURL({ dynamic: true }))
            .setImage(user.user.displayAvatarURL({ dynamic: true, size: 512 }))
            .setFooter(`imagine getting someone's pfp lol`)
            message.lineReplyNoMention(pfpUserEmbed)
        }
    }
}