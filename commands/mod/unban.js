const Discord = require('discord.js');
const { logs } = require('../../data/channels.json');
const moment = require('moment');
const punishmentSchema = require('../../models/punishmentSchema');

module.exports = {
    name: 'unban',
    aliases: ['unb'],
    description: 'Unban a member that is banned.',

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

        const userID = args[0];
        let reason = args.splice(1).join(" ");

        if(!reason) reason = 'No reason provided';
        if(!userID) return message.lineReply('Provide a user ID stupid');
        if(isNaN(userID)) return message.lineReply(`Discord's users IDs are not letters.`);

        const guildName = message.guild.name;
        const guildID = message.guild.id;
        const moderator = message.author.id;

        const date = moment().tz("Europe/Paris").format("ddd, DD MMM YYYY");
        const hours = moment().tz("Europe/Paris").format('HH');
		const minutes = moment().tz("Europe/Paris").format('mm');
	    const seconds = moment().tz("Europe/Paris").format('ss');

	    const time = `${date} ${hours}:${minutes}:${seconds} UTC`;

        const punishmentInfoObject = {
            time: time,
            reason: reason,
            punishmentID: punishmentID,
            punishmentType: 'Unban',
            moderator: moderator,
            userID: userID,
        }

        message.guild.fetchBans().then(async bans => {
            if(bans.size === 0) return message.channel.send(`There is no bans in the server.`);
            let bannedUser = bans.find(ban => ban.user.id == userID)
            if(!bannedUser) return message.lineReply('That user is not banned lmao');
            await message.guild.members.unban(bannedUser.user, reason).catch(err => {
                return message.lineReply('Something went wrong.')
            }).then(() => {
                const expires = new Date();
                expires.setHours(expires.getHours() + 504);

                const punishmentData = {
                    time: time,
                    punishmentType: 'Unban',
                    guildName,
                    guildID,
                    userID,
                    punishmentID: punishmentID,
                    expires,
        
                    punishmentInfo: punishmentInfoObject,
                }
                new punishmentSchema(punishmentData).save();

                message.channel.send(
                    new Discord.MessageEmbed()
                    .setColor('0x7cc576')
                    .setDescription(`<@${userID}> has been **unbanned** | \`${punishmentID}\``)
                )
            })
        })
    }
}