const { afk } = require('../../collection/index');
const afkSchema = require('../../models/afkSchema');
const moment = require('moment');

module.exports = {
    name: 'afk',
    aliases: ['setafk'],

    async run (bot, message, args) {
        let reason = args.splice(0).join(" ");
        if(!reason) reason = "No reason provided";

        message.lineReply(`Now you're AFK - ${reason}`)

        try {
            if(message.member.nickname) {
                const afkInfo = {
                    nickname: message.member.nickname,
                    guildID: message.guild.id,
                    userID: message.author.id,
                    reason: reason,
                }
                new afkSchema(afkInfo).save().then(
                    message.member.setNickname('[AFK] ' + message.member.nickname)
                )
            } else {
                const afkInfo = {
                    nickname: message.author.username,
                    guildID: message.guild.id,
                    userID: message.author.id,
                    reason: reason,
                }
                new afkSchema(afkInfo).save().then(
                    message.member.setNickname('[AFK] ' + message.author.username)
                )
            }
        } catch {
            return;
        }
    }
}