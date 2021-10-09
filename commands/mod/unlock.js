module.exports = {
    name: 'unlock',

    async run (bot, message, args) {
        if(!message.member.hasPermission('MANAGE_MESSAGES')) return message.delete();
    
        if(args[0] === "-all" || args[0] === "-ALL" || args[0] === "--ALL" || args[0] === "--all" || args[0] === "all" || args[0] === "ALL") {
            message.channel.send('Unlocking server...').then(message.channel.send('The server has been unlocked, you may chat now.'))

            message.guild.channels.cache.filter(channel => channel.name).forEach(async channel => {
                channel.updateOverwrite(message.guild.id, {
                    SEND_MESSAGES: null,
                    CONNECT: null,
                })
            })
        } else {
            let channel = message.mentions.channels.first() || message.channel;
            let permission = channel.permissionsFor(message.guild.roles.everyone).has(["SEND_MESSAGES", "CONNECT"]);

            if(permission) return message.lineReply('That channel is not locked.');

            channel.send('The channel has been unlocked, you may chat now.')
            channel.updateOverwrite(message.guild.roles.everyone, {
                SEND_MESSAGES: null,
            }).then(() => {
                return message.channel.send('Channel unlocked.')
            }).catch(() => {
                console.error;
                return message.lineReply(`For some reason I can't unlock the channel. Maybe because I don't have enough permissions?`)
            })
        }
    }
}