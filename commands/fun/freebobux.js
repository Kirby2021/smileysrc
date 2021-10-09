const { MessageButton } = require('discord-buttons');

module.exports = {
    name: 'freebobux',
    aliases: ['bobux'],
    cooldown: 1000 * 5,
    description: 'Get free bobux.',

    async run (bot, message, args) {
        const freeBobuxButton = new MessageButton()
        .setStyle("green")
        .setLabel('Click for bobux')
        .setID('bobux')

        message.channel.send("** **", freeBobuxButton)

        bot.on('clickButton', async button => {
            if(button.id === 'bobux') {
                button.reply.send('Alright sir, to get your *free* you gotta click [here](<https://youtu.be/xvFZjo5PgG0> "bobux").', true)
            }
        })
    }
}