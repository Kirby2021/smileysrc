const Discord = require('discord.js');
const levels = require('discord-xp');
const lvlToggleSchema = require('../../models/lvlToggleSchema');

module.exports = {
    name: 'set-xp',
    aliases: ['setxp'],
    description: 'Give someone XP.',

    async run (bot, message, args) {
        if(!message.member.hasPermission("MANAGE_MESSAGES")) return message.delete();

        lvlToggleSchema.findOne({ guildID: message.guild.id }, async (err, data) => {
            if(!data) {
                return message.lineReply('To set XP/level the leveling system must be enabled.') 
            } else {
                if(data.status === "on") {
                    const target = message.mentions.members.first() || message.guild.members.cache.get(args[0]);
                    if(!target) return message.lineReply('Provide a user.');
                    if(target.id === message.author.id && !message.member.hasPermission("ADMINISTRATOR")) return message.lineReply('You cannot give yourself XP.');
                    
                    let member;
                    try {
                        member = message.guild.members.cache.fetch(target.id)
                    } catch(err) {
                        member = null
                    }
            
                    if(member) {
                        if(member.hasPermission("MANAGE_MESSAGES") && !message.member.hasPermission('ADMINISTRATOR')) return message.lineReply('You cannot give XP to a staff member.');
                    }
            
                    const amountOfXp = args[1];
                    if(isNaN(amountOfXp)) return message.lineReply('Numbers only pls');
                    if(amountOfXp > 10000) return message.lineReply(`That's too much XP, the max is **10,000** XP.`);
            
                    levels.setXp(target.id, message.guild.id, amountOfXp).then(
                        message.channel.send(
                            new Discord.MessageEmbed()
                            .setColor('0x7cc576')
                            .setDescription(`Set ${amountOfXp} XP to ${target}`)
                        )
                    )
                }
            }
        })
    }
}