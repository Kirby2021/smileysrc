const Discord = require('discord.js');
const punishmentSchemaAutoMod = require('../../models/punishmentSchemaAutoMod');

module.exports = {
    name: 'automodwarninfo',
    aliases: ['automodpunishmentinfo', 'automodwarninginfo', 'warnainfo'],
    description: 'Get information about a punishment with the punishment ID.',

    async run (bot, message, args) {
        if(!message.member.hasPermission('MANAGE_MESSAGES')) return message.delete();

        if(!args[0]) return message.lineReply('Provide a punishment ID stupid.')
        if(args[0].length !== 18 || isNaN(args[0]) || !args[0].startsWith('8')) return message.lineReply('Invalid ID.');

        punishmentSchemaAutoMod.findOne({ guildID: message.guild.id, punishmentID: args[0] }, async (err, data) => {
            if(err) throw err;
            if(!data) return message.lineReply('Punishment not found.');
            if(data.punishmentInfo.length) {
                message.channel.send(
                    new Discord.MessageEmbed()
                    .setColor('0x303136')
                    .setTitle('Punishment information')
                    .setDescription(data.punishmentInfo.map(
                        (w) =>
                        `**ID**: ${w.punishmentID} | **Punishment type**: ${w.punishmentType}\n**User ID**: \`${w.userID}\`\n**Moderator**: ${w.moderator} - **Date**: ${w.time} - **Reason**: ${w.reason}`
                    ))
                )
            }
        })
    }
}