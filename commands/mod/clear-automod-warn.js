const punishmentSchemaAutoMod = require('../../models/punishmentSchemaAutoMod');

module.exports = {
    name: 'clear-automod-warn',
    aliases: ['clearautomodwarn', 'clearawarn'],
    description: 'Clear an automod warning via punishment ID.',

    async run (bot, message, args) {
        if(!message.member.hasPermission('MANAGE_MESSAGES')) return message.delete();

        const punishmentID = args[0];
        if(isNaN(punishmentID) || !punishmentID.startsWith('8') || punishmentID.length !== 18) return message.lineReply('Invalid ID');

        punishmentSchemaAutoMod.findOne({ guildID: message.guild.id, punishmentID: punishmentID }, async (err, data) => {
            if(err) throw err;
            if(data) {
                if(data.punishmentType !== "Warn") return message.lineReply('That is not a warning.');
                data.delete().then(message.channel.send('Warning cleared.'))
            } else return message.lineReply('Punishment not found.')
        })
    }
}