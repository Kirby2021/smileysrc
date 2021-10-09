module.exports = {
    name: 'clear',
    aliases: ['delete', 'p', 'purge', 'd', 'c'],
    description: 'Delete messages in a channel.',

    async run (bot, message, args) {
        if(!message.member.hasPermission('MANAGE_MESSAGES')) return message.delete();

        if(!args[0]) return message.lineReply('Provide an amount stupid');
        const messages = Number(args[0], 10);

        if(isNaN(messages)) return message.lineReply('Numbers pls');
        if(!messages) return message.lineReply('Provide an amount stupid');
        if(messages > 100) return message.lineReply('The limit is 100 messages.');

        const fetchedMessages = await message.channel.messages.fetch({
            limit: messages
        });

        try {
            await message.channel.bulkDelete(fetchedMessages)
            .then(msgs => message.channel.send(`${msgs.size} messages has been deleted <:troll:868797951458279424>`).then(m => m.delete({ timeout: 10000 })))
        } catch(err) {
            console.log(err);
        }
    }
}