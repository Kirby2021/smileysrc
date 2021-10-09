const lvlToggleSchema = require('../../models/lvlToggleSchema');

module.exports = {
    name: 'leveltoggle',
    aliases: ['lvltoggle'],
    description: 'Toggle the leveling system.',

    async run (bot, message, args) {
        if(!message.member.hasPermission('MANAGE_GUILD')) return message.delete();

        const action = args[0];
        if(!action) return message.lineReply('Please specify what are you going to do. **On** or **off**.');
        if(!['on', 'off'].includes(action)) return;

        if(action === 'on') {
            lvlToggleSchema.findOne({ guildID: message.guild.id }, async (err, data) => {
                if(err) throw err;
                if(data) {
                    if(data.status == 'on') {
                        return message.lineReply('The leveling system is already on.')
                    }
                } else {
                    new lvlToggleSchema({
                        guildID: message.guild.id,
                        status: "on"
                    }).save().then(message.channel.send('The leveling system has been enabled.'))
                }
            })
        } else if(action === 'off') {
            lvlToggleSchema.findOne({ guildID: message.guild.id }, async (err, data) => {
                if(err) throw err;
                if(data) {
                    if(data.status == 'on') {
                        data.delete().then(message.channel.send('The leveling system has been disabled.'))
                    }
                } else return message.lineReply('The leveling system is already disabled.')
            })
        }
    }
}