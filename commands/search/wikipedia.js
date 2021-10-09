const Discord = require('discord.js');
const fetch = require('node-fetch');

module.exports = {
    name: 'wikipedia',
    aliases: ['wiki', 'wikisearch'],
    description: 'Search something from wikipedia with this command.',

    async run (bot, message, args) {
		if(message.channel.id !== '891686229979062323') return message.lineReply('not here');
			
        const search = args.splice(0).join(" ");
        if(!search) return message.lineReply('Provide a query to search stupid');
        
        const wikiUrl = `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(search)}`;

        let response;
        try {
            response = fetch(wikiUrl).then(res => res.json())
        } catch(err) {
            console.log(err)
            return message.lineReply('Something went wrong.')
        }

        try {
            if(response.type === 'disambiguation') {
                const wikiEmbed = new Discord.MessageEmbed()
                .setColor("RANDOM")
                .setTitle(response.title)
                .setURL(reply.content_urls.desktop.page)
                .setDescription([`${response.stract} You also can [click here](${response.content_urls.desktop}).`])
                message.channel.send(wikiEmbed)
            } else {
                const wikiEmbed = new Discord.MessageEmbed()
                .setColor("RANDOM")
                .setTitle(response.title)
                .setThumbnail(response.thumbnail.source)
                .setURL(response.content_urls.desktop.page)
                .setDescription(response.extract)
                message.channel.send(wikiEmbed)
            }
        } catch {
            return message.lineReply('Query not found.');
        }
    }
}