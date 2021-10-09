const Discord = require('discord.js');
const moment = require('moment');

module.exports = {
    name: 'whois',
    aliases: ['userinfo', 'info', 'information'],
    description: 'Get information about someone.',

    async run (bot, message, args) {
        if(message.channel.id !== '891686229979062323' && !message.member.hasPermission("MANAGE_MESSAGES")) return message.lineReply('bruh why here');
        
        const user = message.mentions.members.first() || message.guild.members.cache.get(args[0]);

        if(!user || user.id === message.author.id) {
            const dateA = moment(message.author.joinedAt).format('ddd, DD MMM YYYY');
            const hourA = moment(message.author.joinedAt).format('HH');
            const minutesA = moment(message.author.joinedAt).format('mm');
            const secondsA = moment(message.author.joinedAt).format('ss');
            const AMPMA = moment(message.author.joinedAt).format('A');

            const joinedAt = dateA + " at " + hourA + ":" + minutesA + ":" + secondsA + " " + AMPMA;

            const dateC = moment(message.author.createdAt).format('ddd, DD MMM YYYY');
            const hourC = moment(message.author.createdAt).format('HH');
            const minutesC = moment(message.author.createdAt).format('mm');
            const secondsC = moment(message.author.createdAt).format('ss');
            const AMPMC = moment(message.author.createdAt).format('A');

            const createdAt = dateC + " at " + hourC + ":" + minutesC + ":" + secondsC + " " + AMPMC;

            var roles = message.member.roles.cache.filter(r => r.id !== message.guild.id).map(r => r).join(" ")
            if(roles == "") roles = 'No roles';

            const infoEmbed = new Discord.MessageEmbed()
            .setColor('0xb9c3c2')
            .setAuthor(message.author.tag, message.author.displayAvatarURL({ dynamic: true }))
            .setDescription(message.author)
            .setThumbnail(message.author.displayAvatarURL({ dynamic: true }))
            .addFields(
                { name: 'Joined', value: joinedAt, inline: true },
                { name: 'Registered', value: createdAt, inline: true },
                { name: `Roles [${message.member.roles.cache.filter(r => r !== message.guild.roles.everyone).size}]`, value: roles },
            )
            .setFooter(`ID: ${message.author.id}`)
            .setTimestamp()
            message.channel.send(infoEmbed)
        } else if(user) {
            const dateA = moment(user.user.joinedAt).format('ddd, DD MMM YYYY');
            const hourA = moment(user.user.joinedAt).format('HH');
            const minutesA = moment(user.user.joinedAt).format('mm');
            const secondsA = moment(user.user.joinedAt).format('SS');
            const AMPMA = moment(user.user.joinedAt).format('A');

            const joinedAt = dateA + " at " + hourA + ":" + minutesA + ":" + secondsA + " " + AMPMA;

            const dateC = moment(user.user.createdAt).format('ddd, DD MMM YYYY');
            const hourC = moment(user.user.createdAt).format('HH');
            const minutesC = moment(user.user.createdAt).format('mm');
            const secondsC = moment(user.user.createdAt).format('ss');
            const AMPMC = moment(user.user.createdAt).format('A');

            const createdAt = dateC + " at " + hourC + ":" + minutesC + ":" + secondsC + " " + AMPMC;

            var roles = user.roles.cache.filter(r => r.id !== message.guild.id).map(r => r).join(" ")
            if(roles == "") roles = 'No roles';

            const infoEmbed = new Discord.MessageEmbed()
            .setColor('0xb9c3c2')
            .setAuthor(user.user.tag, user.user.displayAvatarURL({ dynamic: true }))
            .setDescription(user)
            .setThumbnail(user.user.displayAvatarURL({ dynamic: true }))
            .addFields(
                { name: 'Joined', value: joinedAt, inline: true },
                { name: 'Registered', value: createdAt, inline: true },
                { name: `Roles [${user.roles.cache.filter(r => r !== message.guild.roles.everyone).size}]`, value: roles },
            )
            .setFooter(`ID: ${user.id}`)
            .setTimestamp()
            message.channel.send(infoEmbed)
        }
    }
}