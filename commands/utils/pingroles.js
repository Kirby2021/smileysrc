const { MessageActionRow, MessageMenu, MessageMenuOption } = require('discord-buttons');

module.exports = {
    name: 'pingroles',
    cooldown: 1000 * 10,
    description: 'Get some ping roles.',

    async run (bot, message, args) {
        if(message.channel.id !== '891686229979062323') return message.lineReply('bruh wrong channel.');
        
        const smileyUpdates = new MessageMenuOption()
        .setLabel('Smiley Updates')
        .setDescription('Click to get/remove Smiley Updates ping.')
        .setValue('su')

        const announcements = new MessageMenuOption()
        .setLabel('Announcements')
        .setDescription('Click to get/remove Announcements ping.')
        .setValue('an')

        const menu = new MessageMenu()
        .setPlaceholder('Click to select a ping role')
        .setID('PR')
        .addOption(smileyUpdates)
        .addOption(announcements)

        const pingRow = new MessageActionRow()
        .addComponent(menu)

        message.channel.send('https://cdn.discordapp.com/attachments/827545205611036692/889552450955137124/ping_roles.jpg', { components: pingRow })

        bot.on('clickMenu', async menu => {
            const clicker = menu.clicker.member;

            if(menu.values[0] === "an") {
                if(clicker.roles.cache.has('888884528507146261')) {
                    clicker.roles.remove('888884528507146261').then(
                        menu.reply.send(`I've removed the \`Announcements\` role from you.`, true)
                    )
                } else {
                    clicker.roles.add('888884528507146261').then(
                        menu.reply.send(`I've added you the \`Announcements\` role.`, true)
                    )
                }
            } else if(menu.values[0] === "su") {
                if(clicker.roles.cache.has('888884272163880960')) {
                    clicker.roles.remove('888884272163880960').then(
                        menu.reply.send(`I've removed the \`Smiley Updates\` role from you.`, true)
                    )
                } else {
                    clicker.roles.add('888884272163880960').then(
                        menu.reply.send(`I've added you the \`Smiley Updates\` role.`, true)
                    )
                }
            }
        })
    }
}