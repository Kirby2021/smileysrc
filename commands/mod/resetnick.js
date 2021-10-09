module.exports = {
    name: 'resetnick',
    aliases: ['resetnickname', 'rn'],
    description: 'Reset someone\'s nickname',
    
    async run (bot, message, args) {
        if(!message.member.hasPermission('MANAGE_NICKNAMES')) return message.delete();

        const user = message.mentions.members.first() || message.guild.members.cache.get(args[0]);

        if(!user) return message.lineReply('You gotta specify a user bruh.');
        if(user.id === message.guild.ownerID) return message.lineReply(`You can't reset the server owner's nickname.`);

        try {
            user.setNickname(user.user.username)
            message.channel.send('Nickname reseted.')
        } catch(err) {
            message.lineReply('Cannot change nickname of that user.')
            console.log(err)
        }
    }
}