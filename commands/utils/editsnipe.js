const Discord = require('discord.js');

module.exports = {
    name: 'editsnipe',
    aliases: ['lasteditedmsg', 'lasteditedmessage'],
    cooldown: 1000 * 0,
    description: 'Get the last edited message.',
    async run (bot, message, args) {
        const msg = bot.editsnipe(message.channel.id)

		if(!msg) return message.channel.send('There is nothing to snipe for the moment.');

        var editsnipeEmbed = new Discord.MessageEmbed()
        .setColor('0xffe182')
        .setAuthor(msg.author, msg.member.user.displayAvatarURL({ dynamic: true }))
        .setDescription(msg.content)
        .setFooter('imagine editsniping bru')
        message.channel.send(editsnipeEmbed)
    }
}