const Discord = require('discord.js');

module.exports = {
    name: 'rickroll',
    description: 'Rickroll someone.',

    async run (bot, message, args) {
        const user = message.mentions.members.first() || message.guild.members.cache.get(args[0]);

        if(!user) return message.lineReply('Please specify a user to rickroll stupid');
        if(user.id === message.author.id) return message.lineReply(`You can't rickroll yourself, it wouldn't be a rickroll.`);

        const rickrollMessage = new Discord.MessageEmbed()
        .setColor('0xFFBBBC')
        .setTitle(`You've been reported`)
        .setDescription(`Hello, you've been reported by so many people saying that you weren't using ${bot.user.username} property. This is a warning, and if it's done again you'll get blacklisted and banned from all mutual servers with ${bot.user.username}. If this was an error and you didn't do anything please click [here](https://www.youtube.com/watch?v=xvFZjo5PgG0) and provide why you shouldn't get blacklisted and banned from all mutual servers with ${bot.user.username}.`)
        .setTimestamp()
        .setAuthor(`Bot Report System`, bot.user.displayAvatarURL())

        try {
            user.send(rickrollMessage).then(
                message.delete().then(message.channel.send(`Sent the rickroll to ${user.user.username}`).then(
                    msg => msg.delete({ timeout: 2000 })
                ))
            )
        } catch(err) {
            return message.lineReply(`Cannot send messages to that user.`).then(
                setTimeout(() => {
                    message.channel.messages.cache.get(message.id).delete()
                    msg => msg.delete()
                }, 2000)
            )
        }
    }
}