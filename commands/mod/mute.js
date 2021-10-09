const Discord = require('discord.js');
const moment = require('moment');
const { logs } = require('../../data/channels.json');
const punishmentSchema = require('../../models/punishmentSchema');

module.exports = {
    name: 'mute',
    aliases: ['m'],
    description: 'Mute a member in the server.',

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
         
        const id = generateRandomString(16);
        const punishmentID = `8${id}1`;

        const user = message.mentions.members.first() || message.guild.members.cache.get(args[0]);

        if(!user) return message.lineReply('Provide a user dumbass');
        if(user.id === message.author.id) return message.lineReply(`why tf you want to mute yourself weirdo`);
        if(user.id === message.guild.ownerID) return message.lineReply(`You can't mute the owner stupid.`);

        var member;
        try {
            member = await message.guild.members.fetch(user);
        } catch(err) {
            member = null;
        }

        const logChannel = message.guild.channels.cache.get(logs);

        if(member) {
            if(member.hasPermission('MANAGE_MESSAGES')) return message.lineReply(`You can't mute a staff member stupid`);
        }

        const reason = args.splice(1).join(" ");
        if(!reason) return message.lineReply('The reason is obligatory.');
        if(reason.length > 300) return message.lineReply('geez, that reason is too long');

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
            punishmentType: 'Mute',
            moderator: moderator,
            userID: userID,
        }

        try {
            message.delete().then(message.channel.send(
                new Discord.MessageEmbed()
                .setColor('0xFBD34D')
                .setDescription(`${user} has been **muted** | \`${punishmentID}\``)
            ))

            const muteMessage = new Discord.MessageEmbed()
            .setColor('0xFBD34D')
            .setTitle(`You've been muted in ${message.guild.name}`)
            .setAuthor(bot.user.username, bot.user.displayAvatarURL({ dynamic: true }))
            .addField('Reason', reason)
            .setFooter(`Punishment ID: ${punishmentID}`)
            .setTimestamp()

            const logMuteEmbed = new Discord.MessageEmbed()
            .setColor('0x303136')
            .setTitle(`${user.user.tag} has been muted`)
            .setAuthor(bot.user.username, bot.user.displayAvatarURL({ dynamic: true }))
            .setFooter(`Punishment ID: ${punishmentID}`)
            .setTimestamp()
            .addFields(
                { name: 'User ID', value: `\`${userID}\``, inline: true },
                { name: 'Moderator', value: message.author, inline: true },
                { name: 'Reason', value: reason },
            )

            user.roles.add('848487932142288916');

            try {
                user.send(muteMessage)
            } catch(err) {
                console.log(err)
            }

            logChannel.send(logMuteEmbed)

            const expires = new Date();
            expires.setHours(expires.getHours() + 504);

            const punishmentData = {
                time: time,
                punishmentType: 'Mute',
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