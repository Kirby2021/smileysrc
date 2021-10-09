module.exports = {
    name: 'nick',
    aliases: ['setnickname', 'nickname'],
    description: 'Change someone\'s nickname.',
    
    async run (bot, message, args) {
        if(!message.member.hasPermission('MANAGE_NICKNAMES')) return message.delete();

        const user = message.mentions.members.first() || message.guild.members.cache.get(args[0]);
        if(message.author.id === message.guild.ownerID && user.id === message.guild.ownerID) return message.lineReply(`gimme admin`)
        if(user.id === message.guild.ownerID) return message.lineReply(`You can't change the server owner's nickname`);
        if(!user) return message.lineReply('You gotta specify a user.');

        const nickname = args.splice(1).join(' ');
        if(!nickname) return message.lineReply('You gotta specify a nickname bruh');

        try {
            user.setNickname(nickname).then(message.channel.send(`Nickname set to \`${nickname}\``))
        } catch(err) {
            message.lineReply('Cannot change nickname of that user.')
            console.log(err)
        }
    }
}