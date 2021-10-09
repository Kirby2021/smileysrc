const automodToggleSchema = require('../../models/automodToggleSchema');

module.exports = {
    name: 'automodtoggle',
    aliases: ['toggleautomod'],

    async run (bot, message, args) {
        if(!message.member.hasPermission('MANAGE_GUILD')) return message.delete();

        const action = args[0];
        if(!action) return message.lineReply('You gotta specify what are you gonna do. **on** or **off**');
        if(!["on", "off"].includes(action)) return;

        if(action === 'off') {
            automodToggleSchema.findOne({ guildID: message.guild.id }, async (err, data) => {
                if(err) throw err;

                if(data) {
                    data.delete().then(message.channel.send('The automod system has been disabled.'))
                } else return message.lineReply('The automod system is already disabled.');
            })
        } else if(action === 'on') {
            automodToggleSchema.findOne({ guildID: message.guild.id }, async (err, data) => {
                if(err) throw err;

                if(!data) {
                    new automodToggleSchema({
                        guildID: message.guild.id,
                        status: 'on'
                    }).save().then(message.channel.send('The automod system has been enabled.'))
                } else if(data && data.status == 'on') {
                    return message.lineReply('The automod system is already enabled.')
                }
            })
        }
    }
}