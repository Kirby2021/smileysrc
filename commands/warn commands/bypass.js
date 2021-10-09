const Discord = require('discord.js');
const punishmentSchema = require('../../models/punishmentSchema');
const { logs } = require('../../data/channels.json');
const moment = require('moment-timezone');

module.exports = {
    name: 'bypass',
    description: 'Warn a member for bypassing.',

    async run (bot, message, args) {
        if(!message.member.hasPermission("MANAGE_MESSAGES")) return message.delete();

        function generateRandomID(length) {
            var random_string = '';
            var characters = '1234567890';
            for (var i, i = 0; i < length; i++) {
                random_string += characters.charAt(Math.floor(Math.random() * characters.length))
            }
            return random_string;
        }
        
        const randomChar = generateRandomID(17);
        const punishmentID = `8${randomChar}`;

        const user = message.mentions.members.first() || message.guild.members.cache.get(args[0]);
        if(!user) return message.lineReply('bruh specify a user.');
        if(user.id === message.author.id) return message.lineReply(`You can't warn yourself lmao`);
        if(user.id === message.guild.ownerID) return message.lineReply(`You can't warn the owner lol`);

        let member;
        try {
            member = message.guild.members.cache.fetch(user.id)
        } catch(err) {
            member = null
        }

        if(member) {
            if(member.hasPermission("MANAGE_MESSAGES") && !message.member.hasPermission("ADMINISTRATOR")) return message.lineReply(`You can't warn a staff member.`)
        }

        const reason = "Spelling words differently and/or editing punctuation to bypass the swear filter or sending a message with a bypass via media attachments";

        const guildName = message.guild.name;
        const guildID = message.guild.id;
        const moderator = message.author.id;
        const userID = user.id;

        const date = moment().tz("Europe/Paris").format("ddd, DD MMM YYYY");
        const hours = moment().tz("Europe/Paris").format('HH');
		const minutes = moment().tz("Europe/Paris").format('mm');
	    const seconds = moment().tz("Europe/Paris").format('ss');

	    const time = `${date} ${hours}:${minutes}:${seconds} UTC`;

        const punishmentInfoObject = {
            time: time,
            reason: reason,
            punishmentID: punishmentID,
            punishmentType: 'Warn',
            moderator: moderator,
            userID: userID,
        }

        message.delete().then(message.channel.send(
            new Discord.MessageEmbed()
            .setColor('0xFBD34D')
            .setDescription(`${user} has been **warned** | \`${punishmentID}\``)
        ))

        const warning = new Discord.MessageEmbed()
        .setColor('0xFBD34D')
        .setTitle(`You've been warned in ${guildName}`)
        .setAuthor(bot.user.username, bot.user.displayAvatarURL({ dynamic: true }))
        .addFields(
            { name: 'Reason', value: reason },
            { name: 'Expires', value: '4 weeks 2 days' },
        )
        .setFooter(`Punishment ID: ${punishmentID}`)
        .setTimestamp()

        try {
            user.send(warning)
        } catch(err) {
            console.log(err)
        }

        const logWarnEmbed = new Discord.MessageEmbed()
        .setColor('0x303136')
        .setTitle(`${user.user.tag} has been warned`)
        .setAuthor(bot.user.username, bot.user.displayAvatarURL({ dynamic: true }))
        .addFields(
            { name: 'User ID', value: userID, inline: true },
            { name: 'Moderator', value: message.author, inline: true },
            { name: 'Reason', value: reason },
        )
        .setFooter(`Punishment ID: ${punishmentID}`)
        .setTimestamp()
        logChannel.send(logWarnEmbed)

        const expires = new Date();
        expires.setHours(expires.getHours() + 1008);

        const punishmentData = {
            time: time,
            punishmentType: 'Warn',
            guildName,
            guildID,
            userID,
            punishmentID: punishmentID,
            expires,

            punishmentInfo: punishmentInfoObject,
        }
        new punishmentSchema(punishmentData).save();
    }
}