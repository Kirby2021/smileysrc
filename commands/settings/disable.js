const toggleCommandSchema = require('../../models/toggleCommandSchema');

module.exports = {
    name: 'disable',
    description: 'Disable a command.',

    async run (bot, message, args) {
        if(!message.member.hasPermission('MANAGE_GUILD')) return message.delete();

        const command = args[0];

        if(!command) return message.lineReply('Provide a command name dumbass');
        if(command === 'ping' || command === 'help' || command === 'resetprefix' || command === 'setprefix' || command === 'disable' || command === 'enable') return message.lineReply(`That command is not togglable.`);
        if(!!bot.commands.get(command) === false) return message.lineReply('Command not found.');

        toggleCommandSchema.findOne({ guildID: message.guild.id, command: command }, async (err, data) => {
            if(err) throw err;
            if(data) {
                return message.lineReply('That command is already disabled <:megaJoy:850767631597830165>')
            } else {
                data = new toggleCommandSchema({
                    guildID: message.guild.id,
                    command: command,
                })
                data.save().then(message.channel.send(`**${command}** command has been disabled.`))
            }
        })
    }
}