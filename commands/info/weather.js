const Discord = require('discord.js');
const weather = require('weather-js');

module.exports = {
    name: 'weather',
    description: 'Get information about the weather.',

    async run (bot, message, args) {
			if(message.channel.id !== '891686229979062323') return message.lineReply('W r o n g channel.')
        weather.find({ 
            search: args.join(" "), degreeType: "C"
        }, function (error, result) {
            if(error) return message.lineReply(error);
            if(!args[0]) return message.lineReply('Specify a location dumbass');

            if(result === undefined || result.length === 0) return message.lineReply('wtf is that location');
            
            var current = result[0].current;
            var location = result[0].location;

            const weatherInfo = new Discord.MessageEmbed()
            .setColor('0xb9c3c2')
            .setAuthor('Weather', bot.user.displayAvatarURL({ dynamic: true }))
            .setTitle(current.observationpoint)
            .setThumbnail(current.imageUrl)
            .setDescription(`**${current.skytext}**`)
            .addFields(
                { name: 'Timezone', value: `UTC ${location.timezone}`, inline: true },
                { name: 'Degree type', value: 'Celcius', inline: true },
                { name: 'Temperature', value: `${current.temperature}°`, inline: true },
                { name: 'Wind', value: current.winddisplay, inline: true },
                { name: 'Feels like', value: `${current.feelslike}°`, inline: true },
                { name: 'Humidity', value: `${current.humidity}%`, inline: true }
            )
            message.channel.send(weatherInfo).catch(error => {
                if(error.code == 50006) {
                    return message.lineReply('wtf is that location')
                }
            })
        })
    }
}