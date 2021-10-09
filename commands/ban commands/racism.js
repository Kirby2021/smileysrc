const Discord = require('discord.js');
const punishmentSchema = require('../../models/punishmentSchema');
const moment = require('moment-timezone');
const { logs } = require('../../data/channels.json');

module.exports = {
    name: 'racism',
    aliases: ['r'],
    description: 'Ban a member for racism.',

    async run (bot, message, args) {
        if(!message.member.hasPermission("BAN_MEMBERS")) return message.delete();

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
        if(!user) return message.lineReply(`If you didn't know you gotta specify a user to ban.`);
        if(user.id === message.author.id) return message.lineReply('Leave.');

        let member;
        try {
            member = message.guild.members.cache.fetch(user.id)
        } catch(err) {
            member = null
        }

        if(member) {
            if(member.hasPermission("MANAGE_MESSAGES")) return message.lineReply(`You can't ban a staff member.`);
        }

        const logChannel = message.guild.channels.cache.get(logs);

        const reason = "Racism";

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
            punishmentType: 'Ban',
            moderator: moderator,
            userID: userID,
        }

        try {
            message.delete().then(message.channel.send(
                new Discord.MessageEmbed()
                .setColor('0xdd5353')
                .setDescription(`${user} has been **banned** | \`${punishmentID}\``)
            ))

            const banMessage = new Discord.MessageEmbed()
            .setColor('0xdd5353')
            .setTitle(`You've been banned from ${message.guild.name}`)
            .setAuthor(bot.user.username, bot.user.displayAvatarURL({ dynamic: true }))
            .setDescription('You can appeal this ban clicking [here](https://www.youtube.com/watch?v=xvFZjo5PgG0 "Ban appeal").')
            .addField('Reason', reason)
            .setFooter(`Punishment ID: ${punishmentID}`)
            .setTimestamp()

            const logBanEmbed = new Discord.MessageEmbed()
            .setColor('0x303136')
            .setTitle(`${user.user.tag} has been banned`)
            .setAuthor(bot.user.username, bot.user.displayAvatarURL({ dynamic: true }))
            .setFooter(`Punishment ID: ${punishmentID}`)
            .setTimestamp()
            .addFields(
                { name: 'User ID', value: `\`${userID}\``, inline: true },
                { name: 'Moderator', value: message.author, inline: true },
                { name: 'Reason', value: reason },
            )

            try {
                await user.send(banMessage)
            } catch(err) {
                console.log(err)
            }

            user.ban({ reason: `Punishment ID: ${punishmentID}` })
            logChannel.send(logBanEmbed)

            const expires = new Date();
            expires.setHours(expires.getHours() + 1008);

            const punishmentData = {
                time: time,
                punishmentType: 'Ban',
                guildName,
                guildID,
                userID,
                punishmentID: punishmentID,
                expires,
    
                punishmentInfo: punishmentInfoObject,
            }
            await new punishmentSchema(punishmentData).save();
        } catch(err) {
            console.log(err)
            return message.lineReply('Something went wrong.')
        }
    }
}