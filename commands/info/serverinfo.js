const Discord = require('discord.js');
const moment = require('moment');

module.exports = {
    name: 'serverinfo',
    aliases: ['guildinfo'],
    description: 'Get information about the server.',

    async run (bot, message, args) {
			if(message.channel.id !== '891686229979062323') return message.lineReply('Wrong channel.');
			
        const date = moment(message.guild.createdAt).format('ddd, DD MMM YYYY');
        const hour = moment(message.guild.createdAt).format('HH');
        const minutes = moment(message.guild.createdAt).format('MM');
        const seconds = moment(message.guild.createdAt).format('SS');
        const AMPM = moment(message.guild.createdAt).format('A');

        const createdAt = date + "\n" + "at " + hour + ":" + minutes + ":" + seconds + " " + AMPM;

        var roles = message.guild.roles.cache.filter(r => r.id !== message.guild.id).map(r => r).join(" ");
        if(roles == "") roles = 'No roles'

        const infoEmbed = new Discord.MessageEmbed()
        .setColor('0xb9c3c2')
        .setAuthor('Server info', message.guild.iconURL({ dynamic: true }))
        .setThumbnail(message.guild.iconURL({ dynamic: true }))
        .addFields(
            { name: 'Created', value: createdAt, inline: true },
            { name: 'Members', value: `${message.guild.members.cache.size} users.`, inline: true },
            { name: `Roles [${message.guild.roles.cache.filter(r => r !== message.guild.roles.everyone).size}]`, value: roles},
        )
        .setTimestamp()
        .setFooter(`ID: ${message.guild.id}`)
        .setDescription(`\`${message.guild.name}\``)
        message.channel.send(infoEmbed)
    }
}