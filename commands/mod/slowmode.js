module.exports = {
	name: 'slowmode',
	aliases: ['sm'],
	
	async run (bot, message, args) {
		if(!message.member.hasPermission('MANAGE_MESSAGES')) return message.delete();

		if(!args[0]) return message.channel.send(`The current slowmode is **${message.channel.rateLimitPerUser}** seconds.`);

		let current = message.channel.rateLimitPerUser;
		let full = args[0].split('');
		let final = 0;
		let todo = full.shift();
		if(isNaN(todo)) {
			let time = parseInt(full.join(''));

			if(isNaN(time)) return message.lineReply('Numbers only pls');
			if(todo != '+' && todo != '-') return message.lineReply('You gotta specify "+" or "-".');

			if(todo === '+') {
				final = current + time;
			} else {
				final = current - time;
			}

			if(final < 0) return message.lineReply('bruh, specify a positive number plz');
			if(final > 21600) return message.lineReply('dude, the max of time is 6 hours (21,600 seconds).');
		} else {
			final = parseInt(args[0]);
		}

		message.channel.setRateLimitPerUser(final).catch(console.error);

		message.channel.send(`Slowmode set to \`${final}\` seconds.`).catch(console.error);
	}
}