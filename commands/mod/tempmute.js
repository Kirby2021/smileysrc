const Discord = require('discord.js');
const moment = require('moment');
const { logs } = require('../../data/channels.json');
const punishmentSchema = require('../../models/punishmentSchema');
const punishmentSchemaAutoMod = require('../../models/punishmentSchemaAutoMod');
const ms = require('ms');

module.exports = {
    name: 'tempmute',
    aliases: ['tm'],
    description: 'Tempmute a member in the server.',

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

        const timeMs = args[1];
        if(!timeMs) return message.lineReply(`If you're not gonna specify a time use the \`mute\` command.`);

        const reason = args.splice(2).join(" ");
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
            .addFields(
                { name: 'Reason', value: reason },
                { name: 'Expires', value: timeMs }
            )
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
                { name: 'Reason', value: reason, inline: true },
                { name: 'Expires', value: timeMs }
            )

            user.roles.add('888870044690415706');

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

            setTimeout(() => {
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

                const guildName = message.guild.name;
                const guildID = message.guild.id;
                const userID = user.id;
        
                const date = moment().format("ddd, DD MMM YYYY");
                const hour = moment().format("HH");
                const minutes = moment().format("mm");
                const seconds = moment().format("ss");
                const AMPM = moment().format("A");
        
                const time = date + " at " + hour + ':' + minutes + ':' + seconds + ' ' + AMPM;

                const reason = '[Automod] Time has passed';
        
                const punishmentInfoObject = {
                    time: time,
                    reason: reason,
                    punishmentID: punishmentID,
                    punishmentType: 'Unmute',
                    moderator: bot.user.tag,
                    userID: userID,
                }

                user.roles.remove('848487932142288916');
                try {
                    user.send(
                        new Discord.MessageEmbed()
                        .setColor('0x7cc576')
                        .setTitle(`You've been unmuted in ${message.guild.name}`)
                        .setAuthor(bot.user.username, bot.user.displayAvatarURL({ dynamic: true }))
                        .setTimestamp()
                        .setFooter(`Punishment ID: ${punishmentID}`)
                        .addField('Reason', reason)
                    )
                } catch(err) {
                    console.log(err);
                }

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
                new punishmentSchemaAutoMod(punishmentData).save();
            }, ms(timeMs))
        } catch(err) {
            console.log(err);
        }
    }
}