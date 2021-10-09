const Discord = require('discord.js');
const moment = require('moment');
const punishmentSchema = require('../../models/punishmentSchema');
const { logs } = require('../../data/channels.json');

module.exports = {
    name: 'unmute',
    aliases: ['unm'],
    description: 'Unmute a member in the server.',

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

        const logChannel = message.guild.channels.cache.get(logs);

        const user = message.mentions.members.first() || message.guild.members.cache.get(args[0]);
        if(!user) return message.lineReply('You gotta specify a user asshole');

        var member;
        try {
            member = await message.guild.members.fetch(user)
        } catch(err) {
            member = null;
        }

        if(member) {
            if(member.hasPermission('MANAGE_MESSAGES')) return message.lineReply('How tf is a staff member muted.');
        }

        if(user.user.bot) return message.lineReply('Bots are not muted stupid');
        if(user.id === message.author.id) return message.lineReply('How are you muted if you just sent a message.');
        if(user.id === message.guild.ownerID) return message.lineReply('The owner is not muted -_-');

        let reason = args.splice(1).join(" ");
        if(!reason) {
            reason = 'No reason provided';
        }
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
            punishmentType: 'Unmute',
            moderator: moderator,
            userID: userID,
        }

        try {
            message.delete().then(message.channel.send(
                new Discord.MessageEmbed()
                .setColor('0x7cc576')
                .setDescription(`${user} has been **unmuted** | \`${punishmentID}\``)
            ))

            const UnmuteMessage = new Discord.MessageEmbed()
            .setColor('0x7cc576')
            .setTitle(`You've been unmuted in ${message.guild.name}`)
            .setAuthor(bot.user.username, bot.user.displayAvatarURL({ dynamic: true }))
            .addField('Reason', reason)
            .setFooter(`Punishment ID: ${punishmentID}`)
            .setTimestamp()

            const logUnMuteEmbed = new Discord.MessageEmbed()
            .setColor('0x303136')
            .setTitle(`${user.user.tag} has been unmuted`)
            .setAuthor(bot.user.username, bot.user.displayAvatarURL({ dynamic: true }))
            .setFooter(`Punishment ID: ${punishmentID}`)
            .setTimestamp()
            .addFields(
                { name: 'User ID', value: `\`${userID}\``, inline: true },
                { name: 'Moderator', value: message.author, inline: true },
                { name: 'Reason', value: reason },
            )

            const member = message.guild.members.cache.get(user.id);
            if(!member.roles.cache.has('888870044690415706')) return message.lineReply('That user is not muted stupid');
            user.roles.remove('888870044690415706');

            try {
                user.send(UnmuteMessage)
            } catch(err) {
                console.log(err)
            }

            logChannel.send(logUnMuteEmbed);

            const expires = new Date();
            expires.setHours(expires.getHours() + 504);

            const punishmentData = {
                time: time,
                punishmentType: 'Unmute',
                guildName,
                guildID,
                userID,
                punishmentID: punishmentID,
                expires,
    
                punishmentInfo: punishmentInfoObject,
            }
            await new punishmentSchema(punishmentData).save();
        } catch(err) {
            console.log(err);
        }
    }
}