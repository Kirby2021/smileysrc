const punishmentSchema = require('../../models/punishmentSchema');

module.exports = {
    name: 'clear-all-warns',
    aliases: ['clearwarns', 'clear-all-warnings', 'clearwarnings', 'clearallwarns', 'clearallwarnings'],
    description: 'Clear a user\'s warnings.',

    async run (bot, message, args) {
        if(!message.member.hasPermission("MANAGE_MESSAGES")) return message.delete();

        const user = message.mentions.members.first() || message.guild.members.cache.get(args[0]);
        if(!user) return message.lineReply('Specify a user pls');
        if(user.id === message.author.id && !message.member.hasPermission("ADMINISTRATOR")) return message.lineReply(`You can't clear your own warnings.`);

        const warnings = await punishmentSchema.find({ guildID: message.guild.id, userID: user.id, punishmentType: "Warn" })

        if(!warnings) {
            return message.lineReply(`That user doesn't have any active warnings.`)
        } else {
            punishmentSchema.deleteMany({ guildID: message.guild.id, userID: user.id, punishmentType: "Warn" }).then(
                message.channel.send(`All ${user}'s warnings has been cleared.`)
            )
        }
    } 
}