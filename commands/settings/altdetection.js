const altSchema = require('../../models/altSchema');

module.exports = {
    name: 'altdetection',
    aliases: ['altdetectiontoggle'],

    async run (bot, message, args) {
        if(!message.member.hasPermission('MANAGE_GUILD')) return message.delete();

        const action = args[0];
        if(!action) return message.lineReply('You gotta specify what are you gonna do. **on** or **off**');

        if(!['on', 'off'].includes(action)) return;

        if(action === 'off') {
            altSchema.findOne({ guildID: message.guild.id }, async (err, data) => {
                if(err) throw err;
                if(data) {
                    data.delete().then(message.channel.send('The alt detection system has been disabled.'))
                } else return message.lineReply('The alt detection system is already disabled.')
            })
        } else if(action === 'on') {
            altSchema.findOne({ guildID: message.guild.id }, async (err, data) => {
                if(err) throw err;
                if(!data) {
                    new altSchema({
                        guildID: message.guild.id,
                        status: 'on',
                    }).save()
                    message.channel.send('The alt detection system has been enabled.')
                } else return message.lineReply('The alt detection system is already enabled.')
            })
        }
    }
}