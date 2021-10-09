const punishmentSchema = require('../../models/punishmentSchema');

module.exports = {
    name: 'clearwarn',
    aliases: ['deletewarn'],
    description: 'Clear a warning ',

    async run (bot, message, args) {
        if(!message.member.hasPermission('MANAGE_MESSAGES')) return message.delete();

        if(!args[0]) return message.lineReply('Provide a punishment ID stupid.');
        if(args[0].length !== 18 || isNaN(args[0]) || !args[0].startsWith('8')) return message.lineReply('Invalid ID.');
        
        punishmentSchema.findOne({ guildID: message.guild.id, punishmentID: args[0] }, async (err, data) => {
            if(err) throw err;
            if(data) {
                if(data.punishmentType !== "Warn") return message.lineReply(`That's not a warning.`)
                data.delete().then(message.channel.send('Warning cleared.'))
            } else return message.lineReply('Punishment not found.')
        })
    }
}