const Discord = require('discord.js');

module.exports = {
    name: 'lock',

    async run (bot, message, args) {
        if(!message.member.hasPermission('MANAGE_MESSAGES')) return message.delete();

        //const roles = ['888736820718870549', '888884528507146261', '888884272163880960', '888731830264660018', '888731297999114280', '888730716953788437', '888728448518995968', '888726836375330816', '888726836018835467', '888725532655636480', '888535551093907537', '888535357723930666', '888532575524651098', '888736220652384277'];

        // const content = args.join(" ")

        let reason = args.join(" ").slice(args[0].length);

        if(args[0] === "-all" || args[0] === "-ALL" || args[0] === "--ALL" || args[0] === "--all" || args[0] === "all" || args[0] === "ALL") {

            message.channel.send('Starting lockdown...');

            message.channel.send(
                new Discord.MessageEmbed()
                .setColor('0xFBD34D')
                .setTitle('Server Locked')
                .setDescription(`The server has been locked so don't ask a staff member\nto unmute you, __no one can talk__.`)
                .addField("Reason", reason)
                .setTimestamp()
            ).then(
                message.channel.send('Lockdown started.')
            )

            message.guild.channels.cache.filter(channel => channel.name).forEach(async channel => {
                channel.updateOverwrite(message.guild.id, {
                    SEND_MESSAGES: false,
                    CONNECT: false,
                })
            })
        } else {
            let channel = message.mentions.channels.first() || message.channel;
            let permission = channel.permissionsFor(message.guild.roles.everyone).has(["SEND_MESSAGES", "CONNECT"]);

            if(!permission) return message.lineReply(`That channel is already locked.`);

            channel.updateOverwrite(message.guild.roles.everyone, {
                SEND_MESSAGES: false,
                CONNECT: false,
            }).then(() => {
                channel.send(
                    new Discord.MessageEmbed()
                    .setColor('0xFBD34D')
                    .setTitle('Channel locked')
                    .setDescription(`The channel has been locked so don't ask a staff member\nto unmute you, __no one can talk__.`)
                    .addField("Reason", reason)
                    .setTimestamp()
                )
                return message.channel.send('Channel locked.');
            }).catch(() => {
                console.error;
                return message.lineReply(`For some reason I can't lock that channel. Maybe because I don't have enough permissions?`)
            })
        }
    }
}