const toggleCommandSchema = require('../../models/toggleCommandSchema');

module.exports = {
    name: 'enable',
    description: 'Enable a command.',

    async run (bot, message, args) {
        if(!message.member.hasPermission('MANAGE_GUILD')) return message.delete();

        const command = args[0];

        if(!command) return message.lineReply('u dumb or what? provide a command name stupid');
        if(command === 'ping' || command === 'help' || command === 'resetprefix' || command === 'setprefix' || command === 'disable' || command === 'enable') return message.lineReply(`That command is not togglable.`);
        if(!!bot.commands.get(command) === false) return message.lineReply('Command not found.');

        toggleCommandSchema.findOne({ guildID: message.guild.id, command: command }, async (err, data) => {
            if(err) throw err;
            if(data) {
                data.delete().then(message.channel.send(`**${command}** command has been enabled.`));
            } else return message.lineReply('That command is not disabled.');
        })
    }
}