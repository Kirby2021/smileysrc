module.exports = {
    name: 'xd',
    description: 'xd',

    async run (bot, message, args) {
        message.delete().then(message.channel.send('xd'))
    }
}