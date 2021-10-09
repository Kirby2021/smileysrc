const Discord = require('discord.js');
const fetch = require('node-fetch');

module.exports = {
    name: 'npm',
    aliases: ['npmsearch'],
    description: 'Get information about an NPM package.',

    async run (bot, message, args) {
		if(message.channel.id !== '891686229979062323') return message.lineReply('Not in this channel please');
        
        const package = args[0];
        if(!package) return message.lineReply('bruh provide a package name.');

        let results;
        try {
            results = await fetch('https://api.npms.io/v2/search?q=' + args[0]).then(res => res.json())
        } catch(err) {
            return message.lineReply('Something went wrong.')
        }

        try {
            const pkg = results.results[0].package;
            const npmEmbed = new Discord.MessageEmbed()
            .setColor('0xb9c3c2')
            .setTitle(pkg.name)
            .setThumbnail('https://cdn.discordapp.com/attachments/827545205611036692/887351109029621891/npm.png')
            .addFields(
                { name: 'Author', value: pkg.author ? pkg.author.name : 'None', inline: true },
                { name: 'Version', value: pkg.version, inline: true },
                { name: 'Repository', value: pkg.links.repository ? pkg.links.repository : 'None', inline: true },
                { name: 'Maintainers', value: pkg.maintainers ? pkg.maintainers.map(u => u.username).join(', ') : 'None' },
                { name: 'Keywords', value: pkg.keywords ? pkg.keywords.join(', ') : 'None' },
            )
            .setURL(`https://npmjs.com/${package}`)
            .setTimestamp()
            message.channel.send(npmEmbed)
        } catch(err) {
            console.log(err)
            message.lineReply('Package not found.')
        }
    }
}