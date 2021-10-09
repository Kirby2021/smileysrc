const Discord = require('discord.js');
const punishmentSchema = require('../../models/punishmentSchema');

module.exports = {
    name: 'warnings',
    aliases: ['warns', 'punishments', 'infractions'],
    description: 'Check your or someone\'s punishments.',

    async run (bot, message, args) {
        if(message.channel.id !== '891686229979062323' && !message.member.hasPermission('MANAGE_MESSAGES')) return message.lineReply('Wrong channel.');

        const user = message.mentions.members.first() || message.guild.members.cache.get(args[0]);
        
        if(!message.member.hasPermission('MANAGE_MESSAGES')) {
            if(!user || user.id === message.author.id) {

                var results = await punishmentSchema.find({
                    guildID: message.guild.id,
                    userID: message.author.id,
                })

                var Array2 = [];

                var num = results.length + 1;
                for(let i = 1; i < num; i++) {

                    Array2.push({
                        punishmentType: results[i - 1]["punishmentInfo"][0]["punishmentType"],
                        reason: results[i - 1]["punishmentInfo"][0]["reason"],
                        punishmentID: results[i - 1]["punishmentInfo"][0]["punishmentID"],
                        moderator: results[i - 1]["punishmentInfo"][0]["moderator"],
                        time: results[i - 1]["punishmentInfo"][0]["time"],
                    })
                }

                let punishmentInformation = `All punishments for ${message.author}\n\n`;

                for(const punishmentObject of Array2) {
                    const { punishmentType, reason, punishmentID, moderator, time } = punishmentObject;

                    punishmentInformation += `**ID: ${punishmentID} | Moderator: Hidden**\n**${punishmentType}** - ${reason} - ${time}\n\n`;

                    var punishments = new Discord.MessageEmbed()
                    .setColor('0x303136')
                    .setAuthor(message.author.tag, message.author.displayAvatarURL({ dynamic: true }))
                    .setDescription(punishmentInformation)
                    .setFooter('imagine having punishments lol')
                }

                message.channel.send(punishments).catch(error => {
                    if(error.code == 50006) {
                        return message.lineReply(`You don't have active punishments.`)
                    }
                })
            } else if(user) {
                var results = await punishmentSchema.find({
                    guildID: message.guild.id,
                    userID: message.author.id,
                })

                var Array2 = [];

                var num = results.length + 1;
                for(let i = 1; i < num; i++) {

                    Array2.push({
                        punishmentType: results[i - 1]["punishmentInfo"][0]["punishmentType"],
                        reason: results[i - 1]["punishmentInfo"][0]["reason"],
                        punishmentID: results[i - 1]["punishmentInfo"][0]["punishmentID"],
                        moderator: results[i - 1]["punishmentInfo"][0]["moderator"],
                        time: results[i - 1]["punishmentInfo"][0]["time"],
                    })
                }

                let punishmentInformation = `All punishments for ${message.author}\n\n`;

                for(const punishmentObject of Array2) {
                    const { punishmentType, reason, punishmentID, moderator, time } = punishmentObject;

                    punishmentInformation += `**ID: ${punishmentID} | Moderator: Hidden**\n**${punishmentType}** - ${reason} - ${time}\n\n`;

                    var punishments = new Discord.MessageEmbed()
                    .setColor('0x303136')
                    .setAuthor(message.author.tag, message.author.displayAvatarURL({ dynamic: true }))
                    .setDescription(punishmentInformation)
                    .setFooter('imagine having punishments lol')
                }

                message.channel.send(punishments).catch(error => {
                    if(error.code == 50006) {
                        return message.lineReply(`You don't have active punishments.`)
                    }
                })
            }
        } else {
            if(!user || user.id === message.author.id) {

                var results = await punishmentSchema.find({
                    guildID: message.guild.id,
                    userID: message.author.id,
                })

                var Array2 = [];

                var num = results.length + 1;
                for(let i = 1; i < num; i++) {

                    Array2.push({
                        punishmentType: results[i - 1]["punishmentInfo"][0]["punishmentType"],
                        reason: results[i - 1]["punishmentInfo"][0]["reason"],
                        punishmentID: results[i - 1]["punishmentInfo"][0]["punishmentID"],
                        moderator: results[i - 1]["punishmentInfo"][0]["moderator"],
                        time: results[i - 1]["punishmentInfo"][0]["time"],
                    })
                }

                let punishmentInformation = `All punishments for ${message.author}\n\n`;

                for(const punishmentObject of Array2) {
                    const { punishmentType, reason, punishmentID, moderator, time } = punishmentObject;

                    punishmentInformation += `**ID: ${punishmentID} | Moderator:** ${message.guild.members.cache.get(moderator).user.tag}\n**${punishmentType}** - ${reason} - ${time}\n\n`;

                    var punishments = new Discord.MessageEmbed()
                    .setColor('0x303136')
                    .setAuthor(message.author.tag, message.author.displayAvatarURL({ dynamic: true }))
                    .setDescription(punishmentInformation)
                    .setFooter('imagine having punishments lol')
                }

                message.channel.send(punishments).catch(error => {
                    if(error.code == 50006) {
                        return message.lineReply(`You don't have active punishments.`)
                    }
                })
            } else if(user) {
                var results = await punishmentSchema.find({
                    guildID: message.guild.id,
                    userID: user.id,
                })

                var Array2 = [];

                var num = results.length + 1;
                for(let i = 1; i < num; i++) {

                    Array2.push({
                        punishmentType: results[i - 1]["punishmentInfo"][0]["punishmentType"],
                        reason: results[i - 1]["punishmentInfo"][0]["reason"],
                        punishmentID: results[i - 1]["punishmentInfo"][0]["punishmentID"],
                        moderator: results[i - 1]["punishmentInfo"][0]["moderator"],
                        time: results[i - 1]["punishmentInfo"][0]["time"],
                    })
                }

                let punishmentInformation = `All punishments for ${user}\n\n`;

                for(const punishmentObject of Array2) {
                    const { punishmentType, reason, punishmentID, moderator, time } = punishmentObject;

                    punishmentInformation += `**ID: ${punishmentID} | Moderator:** ${message.guild.members.cache.get(moderator).user.tag}\n**${punishmentType}** - ${reason} - ${time}\n\n`;

                    var punishments = new Discord.MessageEmbed()
                    .setColor('0x303136')
                    .setAuthor(user.user.tag, user.user.displayAvatarURL({ dynamic: true }))
                    .setDescription(punishmentInformation)
                }

                message.channel.send(punishments).catch(error => {
                    if(error.code == 50006) {
                        return message.lineReply(`That user doesn't have active punishments.`)
                    }
                })
            }
        }
    }
}