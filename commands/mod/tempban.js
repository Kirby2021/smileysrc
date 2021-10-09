const Discord = require('discord.js');
const ms = require('ms');
const punishmentSchema = require('../../models/punishmentSchema');
const punishmentSchemaAutoMod = require('../../models/punishmentSchemaAutoMod');
const { logs } = require('../../data/channels.json');
const moment = require('moment');

module.exports = {
    name: 'tempban',
    aliases: ['tb'],
    description: 'Tempban a member from the server.',

    async run (bot, message, args) {
        if(!message.member.hasPermission('BAN_MEMBERS')) return message.delete();

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
        if(user.id === message.author.id) return message.lineReply(`There is a leave button.`);
        if(user.id === message.guild.ownerID) return message.lineReply(`You can't ban the owner stupid.`);

        var member;
        try {
            member = await message.guild.members.fetch(user);
        } catch(err) {
            member = null;
        }

        const logChannel = message.guild.channels.cache.get(logs);

        if(member) {
            if(member.hasPermission('MANAGE_MESSAGES')) return message.lineReply(`You can't ban a staff member stupid`);
        }

        const timeMs = args[1];
        if(!timeMs) return message.lineReply(`If you're not gonna specify a time use the \`ban\` command.`);

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

            try {
                await user.send(
                    new Discord.MessageEmbed()
                    .setColor('0xdd5353')
                    .setTitle(`You've been banned from ${message.guild.name}`)
                    .setAuthor(bot.user.username, bot.user.displayAvatarURL({ dynamic: true }))
                    .setFooter(`Punishment ID: ${punishmentID}`)
                    .setTimestamp()
                    .setDescription('You can appeal this ban clicking [here](https://forms.gle/jcsKtzhUD7wV5Gpm7 "Ban appeal").')
                    .addFields(
                        { name: 'Reason', value: reason },
                        { name: 'Expires', value: timeMs },
                    )
                )
            } catch(err) {
                console.log(err)
            }

            const logBanEmbed = new Discord.MessageEmbed()
            .setColor('0x303136')
            .setTitle(`${user.user.tag} has been banned`)
            .setAuthor(bot.user.username, bot.user.displayAvatarURL({ dynamic: true }))
            .setFooter(`Punishment ID: ${punishmentID}`)
            .setTimestamp()
            .addFields(
                { name: 'User ID', value: `\`${userID}\``, inline: true },
                { name: 'Moderator', value: message.author, inline: true },
                { name: 'Reason', value: reason, inline: true },
                { name: 'Expires', value: timeMs },
            )

            logChannel.send(logBanEmbed)
            
            try {
                user.ban({
                    reason: reason
                })
            } catch(err) {
                console.log(err)
            }

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

            setTimeout(async function () {
                await message.guild.fetchBans().then(async bans => {
                    if(bans.size == 0) return;
                    let bannedUser = bans.find(b => b.user.id == user.id);
                    if(!bannedUser) return;
                    await message.guild.members.unban(bannedUser.user, '[Automod] Time has passed').catch(err => console.log(err));
                })

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
                    punishmentType: 'Unban',
                    moderator: bot.user.tag,
                    userID: userID,
                }

                const expires = new Date();
                expires.setHours(expires.getHours() + 504);
    
                const punishmentAData = {
                    time: time,
                    punishmentType: 'Unban',
                    guildName,
                    guildID,
                    userID,
                    punishmentID: punishmentID,
                    expires,
        
                    punishmentInfo: punishmentInfoObject,
                }
                await new punishmentSchemaAutoMod(punishmentAData).save();
            }, ms(timeMs))
        } catch(err) {
            console.log(err);
        }
    }
}