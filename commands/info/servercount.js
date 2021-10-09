const Discord = require('discord.js');

module.exports = {
    name: 'servercount',
    aliases: ['membercount'],
    description: 'Check the server count.',

    async run (bot, message, args) {
			if(message.channel.id !== '891686229979062323') return message.lineReply('Try in <#891686229979062323>. Don\'t try here.')
			
        message.channel.send(
            new Discord.MessageEmbed()
            .setColor('0xb9c3c2')
            .setAuthor('Server count', bot.user.displayAvatarURL({ dynamic: true }))
            .setDescription(`There are **${message.guild.memberCount}** members in the server.\n**Humans:** ${message.guild.members.cache.filter(b => !b.user.bot).size}\n**Bots:** ${message.guild.members.cache.filter(b => b.user.bot).size}`)
        )
    }
}