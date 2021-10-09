module.exports = {
    name: '8ball',
    description: 'Ask question with this command and the bot replies',

    async run (bot, message, args) {
		if(message.channel.id !== '891686229979062323' && !message.member.hasPermission('ADMINISTRATOR')) return message.lineReply('pls not here.');
			
        const question = args.splice(0).join(' ');
        if(!question) return message.lineReply('You have to do a question.');
    
        const answers = ['whatever yes', 'no lmao', 'nah', 'never', 'no', 'NO!', 'no!!!', 'NOOOOOOOO', 'of course', 'ofc', 'yeah', 'obviously', 'i think', 'maybe', 'idk', `no, that's gay`, 'yes lol'];
        var random = Math.floor((Math.random() * answers.length));
        message.lineReply(answers[random])
    }
}