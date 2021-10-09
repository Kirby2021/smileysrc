module.exports = {
    name: 'ship',
    description: 'c r i n g e',

    async run (bot, message, args) {
			if(message.channel.id !== '891686229979062323' && !message.member.hasPermission('ADMINISTRATOR')) return message.lineReply('Wrong channel, try in <#891686229979062323>');
        const user = message.mentions.members.first();
        if(!user) return message.lineReply('Can you please provide a user, tHaNkS');

        message.lineReply('did you actually think there was a ship command? <:megaJoy:850767631597830165> get a life lmao');
    }
}