module.exports = async (bot, message) => {
    bot.editsnipes.set(message.channel.id, {
        content: message.content,
        author: message.author.tag,
        member: message.member,
        image: message.attachments.first() ? message.attachments.first().proxyURL : null
    })
}