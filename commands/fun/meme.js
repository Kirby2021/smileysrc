const Discord = require('discord.js');
const got = require('got');

module.exports = {
    name: 'meme',

    async run (bot, message, args) {
		if(message.channel.id !== '891686229979062323' && !message.member.hasPermission('ADMINISTRATOR')) return message.lineReply('"No memes here"');
			
        const memeEmbed = new Discord.MessageEmbed()
        got('https://www.reddit.com/r/memes/random/.json').then(response => {
            let content = JSON.parse(response.body);
            let permalink = content[0].data.children[0].data.permalink;
            let memeUrl = `https://reddit.com${permalink}`;
            let memeImage = content[0].data.children[0].data.url;
            let memeTitle = content[0].data.children[0].data.title;
            let memeUpvotes = content[0].data.children[0].data.ups;
            let memeDownvotes = content[0].data.children[0].data.downs;
            let memeNumComments = content[0].data.children[0].data.num_comments;

            memeEmbed.setColor('0x303136')
            memeEmbed.setTitle(memeTitle)
            memeEmbed.setURL(memeUrl)
            memeEmbed.setImage(memeImage)
            memeEmbed.setFooter(`👍 ${memeUpvotes} 👎 ${memeDownvotes} | 💬 ${memeNumComments}`)
            message.channel.send(memeEmbed)
        })
    }
}