const Discord = require('discord.js');
const punishmentSchema = require('../../models/punishmentSchema');
const moment = require('moment');
const { logs } = require('../../data/channels.json');
const ms = require('ms');

module.exports = {
    name: 'warn',
    aliases: ['w', 'warning'],
    description: 'Warn a member in the server.',

    async run (bot, message, args) {
        if(!message.member.hasPermission('MANAGE_MESSAGES')) return message.delete();

        function generateRandomString(length){
            var chars = '0123456789';
            var random_string = '';
            if(length > 0) {
               for(var i = 0; i < length; i++) {
                   random_string += chars.charAt(Math.floor(Math.random() * chars.length));
                }   
            }
            return random_string  
        }
         
        const id = generateRandomString(17);
        const punishmentID = `8${id}`;

        const user = message.mentions.members.first() || message.guild.members.cache.get(args[0]);
        if(!user) return message.lineReply('Specify a user asshole');
        
        let member;
        try {
            member = await message.guild.members.fetch(user);
        } catch(err) {
            member = null
        }

        if(member) {
            if(member.hasPermission('MANAGE_MESSAGES')) return message.lineReply(`You can't warn a staff member.`)
        }

        const logChannel = message.guild.channels.cache.get(logs);

        if(user.user.bot) return message.lineReply(`Poor dumb human. You can't warn bots.`);
        if(user.id === message.author.id) return message.lineReply('Why you want to warn yourself? weirdo');
        if(user.id === message.guild.ownerID) return message.lineReply(`Imagine trying to warn the owner of the server lol`);

        const reason = args.splice(1).join(" ");
        if(!reason) return message.lineReply('The reason is obligatory.');
        if(reason.length > 300) return message.lineReply('That reason is too long. The max of characters are *300* characters.');

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
        expires.setHours(expires.getHours() + 720);

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
        await new punishmentSchema(punishmentData).save();
    }
}