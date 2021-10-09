const punishmentSchemaAutoMod = require('../../models/punishmentSchemaAutoMod');

module.exports = {
    name: 'clear-automod-warns',
    aliases: ['clear-automod-warnings', 'clear-all-automod-warns', 'clear-all-automod-warnings', 'clearawarns', 'clearawarnings', 'clearautomodwarnings', 'clearallautomodwarn'],
    description: 'Clear someone\'s automod warnings.',

    async run (bot, message, args) {
        if(!message.member.hasPermission("MANAGE_MESSAGES")) return message.delete();

        const user = message.mentions.members.first() || message.guild.members.cache.get(args[0]);
        if(!user) return message.lineReply('Specify a user pls');
        if(user.id === message.author.id && !message.member.hasPermission("ADMINISTRATOR")) return message.lineReply(`You can't clear your own warnings.`);

        const warnings = await punishmentSchemaAutoMod.find({ guildID: message.guild.id, userID: user.id, punishmentType: "Warn" })

        if(!warnings) {
            return message.lineReply(`That user doesn't have any active warnings.`)
        } else {
            punishmentSchemaAutoMod.deleteMany({ guildID: message.guild.id, userID: user.id, punishmentType: "Warn" }).then(
                message.channel.send(`All ${user}'s automod warnings has been cleared.`)
            )
        }
    }
}