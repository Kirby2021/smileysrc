const Discord = require('discord.js');
const levels = require('discord-xp');
const lvlToggleSchema = require('../../models/lvlToggleSchema');

module.exports = {
    name: 'set-level',
    aliases: ['setlevel', 'setlvl', 'set-lvl'],
    description: 'Give level to a user.',

    async run (bot, message, args) {
        if(!message.member.hasPermission("MANAGE_MESSAGES")) return message.delete();

        lvlToggleSchema.findOne({ guildID: message.guild.id }, async (err, data) => {
            if(!data) {
                return message.lineReply('To set XP/level the leveling system must be enabled.') 
            } else {
                if(data.status === "on") {
                    const target = message.mentions.members.first() || message.guild.members.cache.get(args[0]);
                    if(!target) return message.lineReply('Provide a user.');
                    if(target.id === message.author.id && !message.member.hasPermission("ADMINISTRATOR")) return message.lineReply('You cannot set level to yourself.');
                    
                    let member;
                    try {
                        member = message.guild.members.cache.fetch(target.id)
                    } catch(err) {
                        member = null
                    }
            
                    if(member) {
                        if(member.hasPermission("MANAGE_MESSAGES") && !message.member.hasPermission('ADMINISTRATOR')) return message.lineReply('You cannot set level to a staff member.');
                    }
            
                    const level = args[1];
                    if(isNaN(level)) return message.lineReply('Numbers only pls');
                    if(level > 50) return message.lineReply(`That level is too high, the max is level 50.`);
            
                    levels.setLevel(target.id, message.guild.id, level).then(
                        message.channel.send(
                            new Discord.MessageEmbed()
                            .setColor('0x7cc576')
                            .setDescription(`Set level ${level} to ${target}`)
                        )
                    )
                }
            }
        })
    }
}