const levels = require('discord-xp');
const Discord = require('discord.js');
const moment = require('moment-timezone');
const punishmentSchemaAutoMod = require('../models/punishmentSchemaAutoMod');
const ms = require('ms');
const automodToggleSchema = require('../models/automodToggleSchema');
const { prohibitedWords } = require('../data/automod.json');
const afkSchema = require('../models/afkSchema');
const config = require('../config.json');
const lvlToggleSchema = require('../models/lvlToggleSchema');
const muteRole = '888870044690415706';

module.exports = async (bot, message) => {
    if(message.author.bot) return;
    if(message.channel.type === 'dm') return;

    //--------------------------------------------------------------afk--------------------------------------------------------------//

    const mention = message.mentions.members.first();

    if(mention) {
        afkSchema.findOne({ guildID: message.guild.id, userID: mention.id }, async (err, data) => {
            if(err) throw err;
            if(data) {							
				message.lineReply(`**${mention.user.username}** is actually AFK - ${data.reason}`)
			}
        })
    }

    afkSchema.findOne({ guildID: message.guild.id, userID: message.author.id }, async (err, data) => {
        if(!data) {
            return;
        } else {
            message.lineReply(`Welcome back, your AFK has been removed.`).then(data.delete())
            try {
                message.member.setNickname(data.nickname)
            } catch {
                return;
            }
        }
    })
		
    //--------------------------------------------------------------leveling system--------------------------------------------------------------//

    lvlToggleSchema.findOne({ guildID: message.guild.id }, async (err, data) => {
        if(data) {
            if(data.status == 'on') {
                if(message.member.roles.cache.has('888732509066629160')) return;
                const randomAmountOfXp = Math.floor(Math.random() * 29) + 1; //Min 1 xp, max 30 xp
                const hasLeveledUp = await levels.appendXp(message.author.id, message.guild.id, randomAmountOfXp);
                if(hasLeveledUp) {
                    const member = await levels.fetch(message.author.id, message.guild.id);
                    message.channel.send(`Funny guy called ${message.author} has leveled up to level **${member.level}**, epic.`)
            
            
                    if(member.level == '5') {
                        message.member.roles.add('888731830264660018')
                    } else if(member.level == '10') {
                        if(message.member.roles.cache.has('888731830264660018')) {
                            message.member.roles.remove('888731830264660018').then(
                                message.member.roles.add('888731297999114280')
                            )
                        }
                    } else if(member.level == '15') {
                        if(message.member.roles.cache.has('888731297999114280')) {
                            message.member.roles.remove('888731297999114280').then(
                                message.member.roles.add('888730716953788437')
                            )
                        }
                    } else if(member.level == '25') {
                        if(message.member.roles.cache.has('888730716953788437')) {
                            message.member.roles.remove('888730716953788437').then(
                                message.member.roles.add('888728448518995968')
                            )
                        }
                    } else if(member.level == '30') {
                        if(message.member.roles.cache.has('888728448518995968')) {
                            message.member.roles.remove('888728448518995968').then(
                                message.member.roles.add('888726836375330816')
                            )
                        }
                    } else if(member.level == '50') {
                        if(message.member.roles.cache.has('888726836375330816')) {
                            message.member.roles.remove('888726836375330816').then(
                                message.member.roles.add('888726836018835467')
                            )
                        }
                    } else if(member.level == '70') {
                        if(message.member.roles.cache.has('888726836018835467')) {
                            message.member.roles.remove('888726836018835467').then(
                                message.member.roles.add('888725532655636480')
                            )
                        }
                    }
                }
            }
        } else return;
    })

    //--------------------------------------------------------------------------------------------------------------------//

    automodToggleSchema.findOne({ guildID: message.guild.id }, async (err, data) => {
        if(data) {
            if(data.status == 'on') {
                if(message.content.length >= 300) {
                    if(message.member.hasPermission('ADMINISTRATOR')) return;
                    if(message.member.hasPermission('MANAGE_MESSAGES')) return message.delete();
                    message.delete().then(message.reply('<a:animeBonk:850699557494194177> you cannot send "walls" of text here. Not cool bro').then(msg => msg.delete({ timeout: 7000 })));
    
                    function generateRandomID(length) {
                        var random_string = '';
                        var characters = '1234567890';
                        for (var i, i = 0; i < length; i++) {
                            random_string += characters.charAt(Math.floor(Math.random() * characters.length))
                        }
                        return random_string;
                    }
                    
                    const randomChar = generateRandomID(17);
                    const punishmentID = `8${randomChar}`;
    
                    const reason = '[Automod] Sending *"walls"* of text or large text.';
    
                    const warning = new Discord.MessageEmbed()
                    .setColor('0xFBD34D')
                    .setTitle(`You've been warned in ${message.guild.name}`)
                    .setAuthor(bot.user.username, bot.user.displayAvatarURL({ dynamic: true }))
                    .addFields(
                        { name: 'Reason', value: reason },
                        { name: 'Expires', value: '23 hours 59 minutes 59 seconds' },
                    )
                    .setTimestamp()
                    .setFooter(`Punishment ID: ${punishmentID}`)
    
                    try {
                        message.author.send(warning)
                    } catch(err) {
                        console.log(err)
                    }
    
                    const guildName = message.guild.name;
                    const guildID = message.guild.id;
                    const moderator = bot.user.tag;
                    const userID = message.author.id;
            
                    const date = moment().tz("Europe/Paris").format("ddd, DD MMM YYYY");
                    const hours = moment().tz("Europe/Paris").format('HH');
                    const minutes = moment().tz("Europe/Paris").format('mm');
                    const seconds = moment().tz("Europe/Paris").format('ss');
            
                    const time = `${date} ${hours}:${minutes}:${seconds} UTC`;
            
                    const punishmentInfoObject = {
                        time: time,
                        reason: reason,
                        punishmentID: punishmentID,
                        punishmentType: 'Warn',
                        moderator: moderator,
                        userID: userID,
                    }

                    const expires = new Date();
                    expires.setHours(expires.getHours() + 24);
    
                    const punishmentData = {
                        time: time,
                        punishmentType: 'Warn',
                        guildName,
                        guildID,
                        userID,
                        punishmentID: punishmentID,
                        expires,
            
                        punishmentInfo: punishmentInfoObject,
                    }
                    new punishmentSchemaAutoMod(punishmentData).save();
    
                    //-------------autoPunishments-------------//
    
                    let warnings = await punishmentSchemaAutoMod.find({
                        guildID: message.guild.id,
                        userID: message.author.id,
                        punishmentType: "Warn",
                    })

                    if(warnings.length === 3) {
                        message.channel.send(
                            new Discord.MessageEmbed()
                            .setColor('0xdd5353')
                            .setDescription(`${message.author} has been muted for continuous infractions.`)
                        ).then(message.member.roles.add(muteRole))

                        function generateRandomID(length) {
                            var random_string = '';
                            var characters = '1234567890';
                            for (var i, i = 0; i < length; i++) {
                                random_string += characters.charAt(Math.floor(Math.random() * characters.length))
                            }
                            return random_string;
                        }
                        
                        const randomChar = generateRandomID(17);
                        const punishmentID = `8${randomChar}`;

                        let reason = "[Automod] Exceeding **three** automod warnings within 24 hours";

                        try {
                            message.author.send(
                                new Discord.MessageEmbed()
                                .setColor('0xFBD34D')
                                .setAuthor(bot.user.username, bot.user.displayAvatarURL())
                                .setTitle(`You've been muted in ${message.guild.name}`)
                                .setTimestamp()
                                .setFooter(`Punishment ID: ${punishmentID}`)
                                .addFields(
                                    { name: 'Reason', value: reason },
                                    { name: 'Expires', value: '3 hours' },
                                )
                            )
                        } catch(err) {
                            console.log(err)
                        }

                        const guildName = message.guild.name;
                        const guildID = message.guild.id;
                        const moderator = bot.user.tag;
                        const userID = message.author.id;
                
                        const date = moment().tz("Europe/Paris").format("ddd, DD MMM YYYY");
                        const hours = moment().tz("Europe/Paris").format('HH');
                        const minutes = moment().tz("Europe/Paris").format('mm');
                        const seconds = moment().tz("Europe/Paris").format('ss');
                
                        const time = `${date} ${hours}:${minutes}:${seconds} UTC`;
                
                        const punishmentInfoObject = {
                            time: time,
                            reason: reason,
                            punishmentID: punishmentID,
                            punishmentType: 'Mute',
                            moderator: moderator,
                            userID: userID,
                        }

                        const expires = new Date();
                        expires.setHours(expires.getHours() + 504);
        
                        const punishmentData = {
                            time: time,
                            punishmentType: 'Mute',
                            guildName,
                            guildID,
                            userID,
                            punishmentID: punishmentID,
                            expires,
                
                            punishmentInfo: punishmentInfoObject,
                        }
                        new punishmentSchemaAutoMod(punishmentData).save();

                        setTimeout(() => {
                            message.member.roles.remove(muteRole)

                            function generateRandomID(length) {
                                var random_string = '';
                                var characters = '1234567890';
                                for (var i, i = 0; i < length; i++) {
                                    random_string += characters.charAt(Math.floor(Math.random() * characters.length))
                                }
                                return random_string;
                            }
                            
                            const randomChar = generateRandomID(17);
                            const punishmentID = `8${randomChar}`;
    
                            let reason = "[Automod] Mute cleared";

                            try {
                                message.author.send(
                                    new Discord.MessageEmbed()
                                    .setColor('0xA3BD8D')
                                    .setAuthor(bot.user.username, bot.user.displayAvatarURL())
                                    .setTitle(`You've been unmuted in ${message.guild.name}`)
                                    .setTimestamp()
                                    .setFooter(`Punishment ID: ${punishmentID}`)
                                )
                            } catch(err) {
                                console.log(err)
                            }

                            const guildName = message.guild.name;
                            const guildID = message.guild.id;
                            const moderator = bot.user.tag;
                            const userID = message.author.id;
                    
                            const date = moment().tz("Europe/Paris").format("ddd, DD MMM YYYY");
                            const hours = moment().tz("Europe/Paris").format('HH');
                            const minutes = moment().tz("Europe/Paris").format('mm');
                            const seconds = moment().tz("Europe/Paris").format('ss');
                    
                            const time = `${date} ${hours}:${minutes}:${seconds} UTC`;
                    
                            const punishmentInfoObject = {
                                time: time,
                                reason: reason,
                                punishmentID: punishmentID,
                                punishmentType: 'Unmute',
                                moderator: moderator,
                                userID: userID,
                            }

                            const expires = new Date();
                            expires.setHours(expires.getHours() + 504);
            
                            const punishmentData = {
                                time: time,
                                punishmentType: 'Unmute',
                                guildName,
                                guildID,
                                userID,
                                punishmentID: punishmentID,
                                expires,
                    
                                punishmentInfo: punishmentInfoObject,
                            }
                            new punishmentSchemaAutoMod(punishmentData).save();
                        }, ms('3h'))
                    } else if(warnings.length === 4) {
                        message.channel.send(
                            new Discord.MessageEmbed()
                            .setColor('0xdd5353')
                            .setDescription(`${message.author} has been muted for continuous infractions.`)
                        ).then(message.member.roles.add(muteRole))

                        function generateRandomID(length) {
                            var random_string = '';
                            var characters = '1234567890';
                            for (var i, i = 0; i < length; i++) {
                                random_string += characters.charAt(Math.floor(Math.random() * characters.length))
                            }
                            return random_string;
                        }
                        
                        const randomChar = generateRandomID(17);
                        const punishmentID = `8${randomChar}`;

                        let reason = "[Automod] Exceeding **four** automod warnings within 24 hours";

                        try {
                            message.author.send(
                                new Discord.MessageEmbed()
                                .setColor('0xFBD34D')
                                .setAuthor(bot.user.username, bot.user.displayAvatarURL())
                                .setTitle(`You've been muted in ${message.guild.name}`)
                                .setTimestamp()
                                .setFooter(`Punishment ID: ${punishmentID}`)
                                .addFields(
                                    { name: 'Reason', value: reason },
                                    { name: 'Expires', value: '6 hours' },
                                )
                            )
                        } catch(err) {
                            console.log(err)
                        }

                        const guildName = message.guild.name;
                        const guildID = message.guild.id;
                        const moderator = bot.user.tag;
                        const userID = message.author.id;
                
                        const date = moment().tz("Europe/Paris").format("ddd, DD MMM YYYY");
                        const hours = moment().tz("Europe/Paris").format('HH');
                        const minutes = moment().tz("Europe/Paris").format('mm');
                        const seconds = moment().tz("Europe/Paris").format('ss');
                
                        const time = `${date} ${hours}:${minutes}:${seconds} UTC`;
                
                        const punishmentInfoObject = {
                            time: time,
                            reason: reason,
                            punishmentID: punishmentID,
                            punishmentType: 'Mute',
                            moderator: moderator,
                            userID: userID,
                        }

                        const expires = new Date();
                        expires.setHours(expires.getHours() + 504);
        
                        const punishmentData = {
                            time: time,
                            punishmentType: 'Mute',
                            guildName,
                            guildID,
                            userID,
                            punishmentID: punishmentID,
                            expires,
                
                            punishmentInfo: punishmentInfoObject,
                        }
                        new punishmentSchemaAutoMod(punishmentData).save();

                        setTimeout(() => {
                            message.member.roles.remove(muteRole)

                            function generateRandomID(length) {
                                var random_string = '';
                                var characters = '1234567890';
                                for (var i, i = 0; i < length; i++) {
                                    random_string += characters.charAt(Math.floor(Math.random() * characters.length))
                                }
                                return random_string;
                            }
                            
                            const randomChar = generateRandomID(17);
                            const punishmentID = `8${randomChar}`;
    
                            let reason = "[Automod] Mute cleared";

                            try {
                                message.author.send(
                                    new Discord.MessageEmbed()
                                    .setColor('0xA3BD8D')
                                    .setAuthor(bot.user.username, bot.user.displayAvatarURL())
                                    .setTitle(`You've been unmuted in ${message.guild.name}`)
                                    .setTimestamp()
                                    .setFooter(`Punishment ID: ${punishmentID}`)
                                )
                            } catch(err) {
                                console.log(err)
                            }

                            const guildName = message.guild.name;
                            const guildID = message.guild.id;
                            const moderator = bot.user.tag;
                            const userID = message.author.id;
                    
                            const date = moment().tz("Europe/Paris").format("ddd, DD MMM YYYY");
                            const hours = moment().tz("Europe/Paris").format('HH');
                            const minutes = moment().tz("Europe/Paris").format('mm');
                            const seconds = moment().tz("Europe/Paris").format('ss');
                    
                            const time = `${date} ${hours}:${minutes}:${seconds} UTC`;
                    
                            const punishmentInfoObject = {
                                time: time,
                                reason: reason,
                                punishmentID: punishmentID,
                                punishmentType: 'Unmute',
                                moderator: moderator,
                                userID: userID,
                            }

                            const expires = new Date();
                            expires.setHours(expires.getHours() + 504);
            
                            const punishmentData = {
                                time: time,
                                punishmentType: 'Unmute',
                                guildName,
                                guildID,
                                userID,
                                punishmentID: punishmentID,
                                expires,
                    
                                punishmentInfo: punishmentInfoObject,
                            }
                            new punishmentSchemaAutoMod(punishmentData).save();
                        }, ms('3h'))
                    } else if(warnings.length === 6) {
                        function generateRandomID(length) {
                            var random_string = '';
                            var characters = '1234567890';
                            for (var i, i = 0; i < length; i++) {
                                random_string += characters.charAt(Math.floor(Math.random() * characters.length))
                            }
                            return random_string;
                        }
                        
                        const randomChar = generateRandomID(17);
                        const punishmentID = `8${randomChar}`;

                        let reason = '[Automod] Exceeding **six** automod warnings within 24 hours';

                        try {
                            await message.author.send(
                                new Discord.MessageEmbed()
                                .setColor('0xdd5353')
                                .setAuthor(bot.user.username, bot.user.displayAvatarURL())
                                .setTitle(`You've been banned from ${message.guild.name}`)
                                .setTimestamp()
                                .setFooter(`Punishment ID: ${punishmentID}`)
                                .setDescription('You can appeal this ban by clicking [here](https://forms.gle/jcsKtzhUD7wV5Gpm7 "Ban appeal").')
                                .addField("Reason", reason)
                            )
                        } catch(err) {
                            console.log(err)
                        }

                        message.member.ban({ reason: reason + ` [${punishmentID}]` })

                        const guildName = message.guild.name;
                        const guildID = message.guild.id;
                        const moderator = bot.user.tag;
                        const userID = message.author.id;
                
                        const date = moment().tz("Europe/Paris").format("ddd, DD MMM YYYY");
                        const hours = moment().tz("Europe/Paris").format('HH');
                        const minutes = moment().tz("Europe/Paris").format('mm');
                        const seconds = moment().tz("Europe/Paris").format('ss');
                
                        const time = `${date} ${hours}:${minutes}:${seconds} UTC`;
                
                        const punishmentInfoObject = {
                            time: time,
                            reason: reason,
                            punishmentID: punishmentID,
                            punishmentType: 'Ban',
                            moderator: moderator,
                            userID: userID,
                        }

                        const expires = new Date();
                        expires.setHours(expires.getHours() + 720);
        
                        const punishmentData = {
                            time: time,
                            punishmentType: 'Ban',
                            guildName,
                            guildID,
                            userID,
                            punishmentID: punishmentID,
                            expires,
                
                            punishmentInfo: punishmentInfoObject,
                        }
                        new punishmentSchemaAutoMod(punishmentData).save();
                    }
                }
    
                //-----------------------filtered words-----------------------//
    
                if(prohibitedWords.some(w => `${message.content.toLowerCase()}`.includes(`${w}`))) {
                    if(message.member.hasPermission('ADMINISTRATOR')) return;
                    if(message.member.hasPermission('MANAGE_MESSAGES')) return message.delete();
                    message.delete().then(message.reply('<a:animeBonk:850699557494194177> chill out dude, these words are not allowed here.').then(msg => msg.delete({ timeout: 7000 })))
    
                    function generateRandomID(length) {
                        var random_string = '';
                        var characters = '1234567890';
                        for (var i, i = 0; i < length; i++) {
                            random_string += characters.charAt(Math.floor(Math.random() * characters.length))
                        }
                        return random_string;
                    }
                    
                    const randomChar = generateRandomID(17);
                    const punishmentID = `8${randomChar}`;
    
                    const reason = '[Automod] Sending prohibited words.';
    
                    const warning = new Discord.MessageEmbed()
                    .setColor('0xFBD34D')
                    .setTitle(`You've been warned in ${message.guild.name}`)
                    .setAuthor(bot.user.username, bot.user.displayAvatarURL({ dynamic: true }))
                    .addFields(
                        { name: 'Reason', value: reason },
                        { name: 'Expires', value: '23 hours 59 minutes 59 seconds' },
                    )
                    .setTimestamp()
                    .setFooter(`Punishment ID: ${punishmentID}`)
    
                    try {
                        message.author.send(warning)
                    } catch(err) {
                        console.log(err)
                    }
    
                    const guildName = message.guild.name;
                    const guildID = message.guild.id;
                    const moderator = bot.user.tag;
                    const userID = message.author.id;
            
                    const date = moment().tz("Europe/Paris").format("ddd, DD MMM YYYY");
                    const hours = moment().tz("Europe/Paris").format('HH');
                    const minutes = moment().tz("Europe/Paris").format('mm');
                    const seconds = moment().tz("Europe/Paris").format('ss');
            
                    const time = `${date} ${hours}:${minutes}:${seconds} UTC`;

                    const expires = new Date();
                    expires.setHours(expires.getHours() + 24);
            
                    const punishmentInfoObject = {
                        time: time,
                        reason: reason,
                        punishmentID: punishmentID,
                        punishmentType: 'Warn',
                        moderator: moderator,
                        userID: userID,
                    }
    
                    const punishmentData = {
                        time: time,
                        punishmentType: "Warn",
                        guildName,
                        guildID,
                        userID,
                        punishmentID: punishmentID,
                        expires,

                        punishmentInfo: punishmentInfoObject
                    }
                    new punishmentSchemaAutoMod(punishmentData).save();
    
                    //-------------autoPunishments-------------//
    
                    let warnings = await punishmentSchemaAutoMod.find({
                        guildID: message.guild.id,
                        userID: message.author.id,
                        punishmentType: "Warn",
                    })

                    if(warnings.length === 3) {
                        message.channel.send(
                            new Discord.MessageEmbed()
                            .setColor('0xdd5353')
                            .setDescription(`${message.author} has been muted for continuous infractions.`)
                        ).then(message.member.roles.add(muteRole))

                        function generateRandomID(length) {
                            var random_string = '';
                            var characters = '1234567890';
                            for (var i, i = 0; i < length; i++) {
                                random_string += characters.charAt(Math.floor(Math.random() * characters.length))
                            }
                            return random_string;
                        }
                        
                        const randomChar = generateRandomID(17);
                        const punishmentID = `8${randomChar}`;

                        let reason = "[Automod] Exceeding **three** automod warnings within 24 hours";

                        try {
                            message.author.send(
                                new Discord.MessageEmbed()
                                .setColor('0xFBD34D')
                                .setAuthor(bot.user.username, bot.user.displayAvatarURL())
                                .setTitle(`You've been muted in ${message.guild.name}`)
                                .setTimestamp()
                                .setFooter(`Punishment ID: ${punishmentID}`)
                                .addFields(
                                    { name: 'Reason', value: reason },
                                    { name: 'Expires', value: '3 hours' },
                                )
                            )
                        } catch(err) {
                            console.log(err)
                        }

                        const guildName = message.guild.name;
                        const guildID = message.guild.id;
                        const moderator = bot.user.tag;
                        const userID = message.author.id;
                
                        const date = moment().tz("Europe/Paris").format("ddd, DD MMM YYYY");
                        const hours = moment().tz("Europe/Paris").format('HH');
                        const minutes = moment().tz("Europe/Paris").format('mm');
                        const seconds = moment().tz("Europe/Paris").format('ss');
                
                        const time = `${date} ${hours}:${minutes}:${seconds} UTC`;
                
                        const punishmentInfoObject = {
                            time: time,
                            reason: reason,
                            punishmentID: punishmentID,
                            punishmentType: 'Mute',
                            moderator: moderator,
                            userID: userID,
                        }

                        const expires = new Date();
                        expires.setHours(expires.getHours() + 504);
        
                        const punishmentData = {
                            time: time,
                            punishmentType: 'Mute',
                            guildName,
                            guildID,
                            userID,
                            punishmentID: punishmentID,
                            expires,
                
                            punishmentInfo: punishmentInfoObject,
                        }
                        new punishmentSchemaAutoMod(punishmentData).save();

                        setTimeout(() => {
                            message.member.roles.remove(muteRole)

                            function generateRandomID(length) {
                                var random_string = '';
                                var characters = '1234567890';
                                for (var i, i = 0; i < length; i++) {
                                    random_string += characters.charAt(Math.floor(Math.random() * characters.length))
                                }
                                return random_string;
                            }
                            
                            const randomChar = generateRandomID(17);
                            const punishmentID = `8${randomChar}`;
    
                            let reason = "[Automod] Mute cleared";

                            try {
                                message.author.send(
                                    new Discord.MessageEmbed()
                                    .setColor('0xA3BD8D')
                                    .setAuthor(bot.user.username, bot.user.displayAvatarURL())
                                    .setTitle(`You've been unmuted in ${message.guild.name}`)
                                    .setTimestamp()
                                    .setFooter(`Punishment ID: ${punishmentID}`)
                                )
                            } catch(err) {
                                console.log(err)
                            }

                            const guildName = message.guild.name;
                            const guildID = message.guild.id;
                            const moderator = bot.user.tag;
                            const userID = message.author.id;
                    
                            const date = moment().tz("Europe/Paris").format("ddd, DD MMM YYYY");
                            const hours = moment().tz("Europe/Paris").format('HH');
                            const minutes = moment().tz("Europe/Paris").format('mm');
                            const seconds = moment().tz("Europe/Paris").format('ss');
                    
                            const time = `${date} ${hours}:${minutes}:${seconds} UTC`;
                    
                            const punishmentInfoObject = {
                                time: time,
                                reason: reason,
                                punishmentID: punishmentID,
                                punishmentType: 'Unmute',
                                moderator: moderator,
                                userID: userID,
                            }

                            const expires = new Date();
                            expires.setHours(expires.getHours() + 504);
            
                            const punishmentData = {
                                time: time,
                                punishmentType: 'Unmute',
                                guildName,
                                guildID,
                                userID,
                                punishmentID: punishmentID,
                                expires,
                    
                                punishmentInfo: punishmentInfoObject,
                            }
                            new punishmentSchemaAutoMod(punishmentData).save();
                        }, ms('3h'))
                    } else if(warnings.length === 4) {
                        message.channel.send(
                            new Discord.MessageEmbed()
                            .setColor('0xdd5353')
                            .setDescription(`${message.author} has been muted for continuous infractions.`)
                        ).then(message.member.roles.add(muteRole))

                        function generateRandomID(length) {
                            var random_string = '';
                            var characters = '1234567890';
                            for (var i, i = 0; i < length; i++) {
                                random_string += characters.charAt(Math.floor(Math.random() * characters.length))
                            }
                            return random_string;
                        }
                        
                        const randomChar = generateRandomID(17);
                        const punishmentID = `8${randomChar}`;

                        let reason = "[Automod] Exceeding **four** automod warnings within 24 hours";

                        try {
                            message.author.send(
                                new Discord.MessageEmbed()
                                .setColor('0xFBD34D')
                                .setAuthor(bot.user.username, bot.user.displayAvatarURL())
                                .setTitle(`You've been muted in ${message.guild.name}`)
                                .setTimestamp()
                                .setFooter(`Punishment ID: ${punishmentID}`)
                                .addFields(
                                    { name: 'Reason', value: reason },
                                    { name: 'Expires', value: '6 hours' },
                                )
                            )
                        } catch(err) {
                            console.log(err)
                        }

                        const guildName = message.guild.name;
                        const guildID = message.guild.id;
                        const moderator = bot.user.tag;
                        const userID = message.author.id;
                
                        const date = moment().tz("Europe/Paris").format("ddd, DD MMM YYYY");
                        const hours = moment().tz("Europe/Paris").format('HH');
                        const minutes = moment().tz("Europe/Paris").format('mm');
                        const seconds = moment().tz("Europe/Paris").format('ss');
                
                        const time = `${date} ${hours}:${minutes}:${seconds} UTC`;
                
                        const punishmentInfoObject = {
                            time: time,
                            reason: reason,
                            punishmentID: punishmentID,
                            punishmentType: 'Mute',
                            moderator: moderator,
                            userID: userID,
                        }

                        const expires = new Date();
                        expires.setHours(expires.getHours() + 504);
        
                        const punishmentData = {
                            time: time,
                            punishmentType: 'Mute',
                            guildName,
                            guildID,
                            userID,
                            punishmentID: punishmentID,
                            expires,
                
                            punishmentInfo: punishmentInfoObject,
                        }
                        new punishmentSchemaAutoMod(punishmentData).save();

                        setTimeout(() => {
                            message.member.roles.remove(muteRole)

                            function generateRandomID(length) {
                                var random_string = '';
                                var characters = '1234567890';
                                for (var i, i = 0; i < length; i++) {
                                    random_string += characters.charAt(Math.floor(Math.random() * characters.length))
                                }
                                return random_string;
                            }
                            
                            const randomChar = generateRandomID(17);
                            const punishmentID = `8${randomChar}`;
    
                            let reason = "[Automod] Mute cleared";

                            try {
                                message.author.send(
                                    new Discord.MessageEmbed()
                                    .setColor('0xA3BD8D')
                                    .setAuthor(bot.user.username, bot.user.displayAvatarURL())
                                    .setTitle(`You've been unmuted in ${message.guild.name}`)
                                    .setTimestamp()
                                    .setFooter(`Punishment ID: ${punishmentID}`)
                                    .addField('Reason', reason)
                                )
                            } catch(err) {
                                console.log(err)
                            }

                            const guildName = message.guild.name;
                            const guildID = message.guild.id;
                            const moderator = bot.user.tag;
                            const userID = message.author.id;
                    
                            const date = moment().tz("Europe/Paris").format("ddd, DD MMM YYYY");
                            const hours = moment().tz("Europe/Paris").format('HH');
                            const minutes = moment().tz("Europe/Paris").format('mm');
                            const seconds = moment().tz("Europe/Paris").format('ss');
                    
                            const time = `${date} ${hours}:${minutes}:${seconds} UTC`;
                    
                            const punishmentInfoObject = {
                                time: time,
                                reason: reason,
                                punishmentID: punishmentID,
                                punishmentType: 'Unmute',
                                moderator: moderator,
                                userID: userID,
                            }

                            const expires = new Date();
                            expires.setHours(expires.getHours() + 504);
            
                            const punishmentData = {
                                time: time,
                                punishmentType: 'Unmute',
                                guildName,
                                guildID,
                                userID,
                                punishmentID: punishmentID,
                                expires,
                    
                                punishmentInfo: punishmentInfoObject,
                            }
                            new punishmentSchemaAutoMod(punishmentData).save();
                        }, ms('3h'))
                    } else if(warnings.length === 6) {
                        function generateRandomID(length) {
                            var random_string = '';
                            var characters = '1234567890';
                            for (var i, i = 0; i < length; i++) {
                                random_string += characters.charAt(Math.floor(Math.random() * characters.length))
                            }
                            return random_string;
                        }
                        
                        const randomChar = generateRandomID(17);
                        const punishmentID = `8${randomChar}`;

                        let reason = '[Automod] Exceeding **six** automod warnings within 24 hours';

                        try {
                            await message.author.send(
                                new Discord.MessageEmbed()
                                .setColor('0xdd5353')
                                .setAuthor(bot.user.username, bot.user.displayAvatarURL())
                                .setTitle(`You've been banned from ${message.guild.name}`)
                                .setTimestamp()
                                .setFooter(`Punishment ID: ${punishmentID}`)
                                .setDescription('You can appeal this ban by clicking [here](https://forms.gle/jcsKtzhUD7wV5Gpm7 "Ban appeal").')
                                .addField("Reason", reason)
                            )
                        } catch(err) {
                            console.log(err)
                        }

                        message.member.ban({ reason: reason + ` [${punishmentID}]` })

                        const guildName = message.guild.name;
                        const guildID = message.guild.id;
                        const moderator = bot.user.tag;
                        const userID = message.author.id;
                
                        const date = moment().tz("Europe/Paris").format("ddd, DD MMM YYYY");
                        const hours = moment().tz("Europe/Paris").format('HH');
                        const minutes = moment().tz("Europe/Paris").format('mm');
                        const seconds = moment().tz("Europe/Paris").format('ss');
                
                        const time = `${date} ${hours}:${minutes}:${seconds} UTC`;
                
                        const punishmentInfoObject = {
                            time: time,
                            reason: reason,
                            punishmentID: punishmentID,
                            punishmentType: 'Ban',
                            moderator: moderator,
                            userID: userID,
                        }

                        const expires = new Date();
                        expires.setHours(expires.getHours() + 720);
        
                        const punishmentData = {
                            time: time,
                            punishmentType: 'Ban',
                            guildName,
                            guildID,
                            userID,
                            punishmentID: punishmentID,
                            expires,
                
                            punishmentInfo: punishmentInfoObject,
                        }
                        new punishmentSchemaAutoMod(punishmentData).save();
                    }
                }
    
                //-----------------------antiMassMention-----------------------//
    
                if(message.mentions.users.size >= 3) {
                    if(message.member.hasPermission('ADMINISTRATOR')) return;
                    if(message.member.hasPermission('MANAGE_MESSAGES')) return message.delete();
                    message.delete().then(message.reply('<a:animeBonk:850699557494194177> mass mentioning ain\'t cool bro').then(msg => msg.delete({ timeout: 7000 })))
    
                    function generateRandomID(length) {
                        var random_string = '';
                        var characters = '1234567890';
                        for (var i, i = 0; i < length; i++) {
                            random_string += characters.charAt(Math.floor(Math.random() * characters.length))
                        }
                        return random_string;
                    }
                    
                    const randomChar = generateRandomID(17);
                    const punishmentID = `8${randomChar}`;
    
                    const reason = '[Automod] Mass mention more than **three** users.';
    
                    const warning = new Discord.MessageEmbed()
                    .setColor('0xFBD34D')
                    .setTitle(`You've been warned in ${message.guild.name}`)
                    .setAuthor(bot.user.username, bot.user.displayAvatarURL({ dynamic: true }))
                    .addFields(
                        { name: 'Reason', value: reason },
                        { name: 'Expires', value: '23 hours 59 minutes 59 seconds' },
                    )
                    .setTimestamp()
                    .setFooter(`Punishment ID: ${punishmentID}`)
    
                    try {
                        message.author.send(warning)
                    } catch(err) {
                        console.log(err)
                    }
    
                    const guildName = message.guild.name;
                    const guildID = message.guild.id;
                    const moderator = bot.user.tag;
                    const userID = message.author.id;
            
                    const date = moment().tz("Europe/Paris").format("ddd, DD MMM YYYY");
                    const hours = moment().tz("Europe/Paris").format('HH');
                    const minutes = moment().tz("Europe/Paris").format('mm');
                    const seconds = moment().tz("Europe/Paris").format('ss');
            
                    const time = `${date} ${hours}:${minutes}:${seconds} UTC`;

                    const expires = new Date();
                    expires.setHours(expires.getHours() + 24);
            
                    const punishmentInfoObject = {
                        time: time,
                        reason: reason,
                        punishmentID: punishmentID,
                        punishmentType: 'Warn',
                        moderator: moderator,
                        userID: userID,
                    }
    
                    const punishmentData = {
                        time: time,
                        punishmentType: "Warn",
                        guildName,
                        guildID,
                        userID,
                        punishmentID: punishmentID,
                        expires,

                        punishmentInfo: punishmentInfoObject
                    }
                    new punishmentSchemaAutoMod(punishmentData).save();
    
                    //-------------autoPunishments-------------//
    
                    let warnings = await punishmentSchemaAutoMod.find({
                        guildID: message.guild.id,
                        userID: message.author.id,
                        punishmentType: "Warn",
                    })

                    if(warnings.length === 3) {
                        message.channel.send(
                            new Discord.MessageEmbed()
                            .setColor('0xdd5353')
                            .setDescription(`${message.author} has been muted for continuous infractions.`)
                        ).then(message.member.roles.add(muteRole))

                        function generateRandomID(length) {
                            var random_string = '';
                            var characters = '1234567890';
                            for (var i, i = 0; i < length; i++) {
                                random_string += characters.charAt(Math.floor(Math.random() * characters.length))
                            }
                            return random_string;
                        }
                        
                        const randomChar = generateRandomID(17);
                        const punishmentID = `8${randomChar}`;

                        let reason = "[Automod] Exceeding **three** automod warnings within 24 hours";

                        try {
                            message.author.send(
                                new Discord.MessageEmbed()
                                .setColor('0xFBD34D')
                                .setAuthor(bot.user.username, bot.user.displayAvatarURL())
                                .setTitle(`You've been muted in ${message.guild.name}`)
                                .setTimestamp()
                                .setFooter(`Punishment ID: ${punishmentID}`)
                                .addFields(
                                    { name: 'Reason', value: reason },
                                    { name: 'Expires', value: '3 hours' },
                                )
                            )
                        } catch(err) {
                            console.log(err)
                        }

                        const guildName = message.guild.name;
                        const guildID = message.guild.id;
                        const moderator = bot.user.tag;
                        const userID = message.author.id;
                
                        const date = moment().tz("Europe/Paris").format("ddd, DD MMM YYYY");
                        const hours = moment().tz("Europe/Paris").format('HH');
                        const minutes = moment().tz("Europe/Paris").format('mm');
                        const seconds = moment().tz("Europe/Paris").format('ss');
                
                        const time = `${date} ${hours}:${minutes}:${seconds} UTC`;
                
                        const punishmentInfoObject = {
                            time: time,
                            reason: reason,
                            punishmentID: punishmentID,
                            punishmentType: 'Mute',
                            moderator: moderator,
                            userID: userID,
                        }

                        const expires = new Date();
                        expires.setHours(expires.getHours() + 504);
        
                        const punishmentData = {
                            time: time,
                            punishmentType: 'Mute',
                            guildName,
                            guildID,
                            userID,
                            punishmentID: punishmentID,
                            expires,
                
                            punishmentInfo: punishmentInfoObject,
                        }
                        new punishmentSchemaAutoMod(punishmentData).save();

                        setTimeout(() => {
                            message.member.roles.remove(muteRole)

                            function generateRandomID(length) {
                                var random_string = '';
                                var characters = '1234567890';
                                for (var i, i = 0; i < length; i++) {
                                    random_string += characters.charAt(Math.floor(Math.random() * characters.length))
                                }
                                return random_string;
                            }
                            
                            const randomChar = generateRandomID(17);
                            const punishmentID = `8${randomChar}`;
    
                            let reason = "[Automod] Mute cleared";

                            try {
                                message.author.send(
                                    new Discord.MessageEmbed()
                                    .setColor('0xA3BD8D')
                                    .setAuthor(bot.user.username, bot.user.displayAvatarURL())
                                    .setTitle(`You've been unmuted in ${message.guild.name}`)
                                    .setTimestamp()
                                    .setFooter(`Punishment ID: ${punishmentID}`)
                                )
                            } catch(err) {
                                console.log(err)
                            }

                            const guildName = message.guild.name;
                            const guildID = message.guild.id;
                            const moderator = bot.user.tag;
                            const userID = message.author.id;
                    
                            const date = moment().tz("Europe/Paris").format("ddd, DD MMM YYYY");
                            const hours = moment().tz("Europe/Paris").format('HH');
                            const minutes = moment().tz("Europe/Paris").format('mm');
                            const seconds = moment().tz("Europe/Paris").format('ss');
                    
                            const time = `${date} ${hours}:${minutes}:${seconds} UTC`;
                    
                            const punishmentInfoObject = {
                                time: time,
                                reason: reason,
                                punishmentID: punishmentID,
                                punishmentType: 'Unmute',
                                moderator: moderator,
                                userID: userID,
                            }

                            const expires = new Date();
                            expires.setHours(expires.getHours() + 504);
            
                            const punishmentData = {
                                time: time,
                                punishmentType: 'Unmute',
                                guildName,
                                guildID,
                                userID,
                                punishmentID: punishmentID,
                                expires,
                    
                                punishmentInfo: punishmentInfoObject,
                            }
                            new punishmentSchemaAutoMod(punishmentData).save();
                        }, ms('3h'))
                    } else if(warnings.length === 4) {
                        message.channel.send(
                            new Discord.MessageEmbed()
                            .setColor('0xdd5353')
                            .setDescription(`${message.author} has been muted for continuous infractions.`)
                        ).then(message.member.roles.add(muteRole))

                        function generateRandomID(length) {
                            var random_string = '';
                            var characters = '1234567890';
                            for (var i, i = 0; i < length; i++) {
                                random_string += characters.charAt(Math.floor(Math.random() * characters.length))
                            }
                            return random_string;
                        }
                        
                        const randomChar = generateRandomID(17);
                        const punishmentID = `8${randomChar}`;

                        let reason = "[Automod] Exceeding **four** automod warnings within 24 hours";

                        try {
                            message.author.send(
                                new Discord.MessageEmbed()
                                .setColor('0xFBD34D')
                                .setAuthor(bot.user.username, bot.user.displayAvatarURL())
                                .setTitle(`You've been muted in ${message.guild.name}`)
                                .setTimestamp()
                                .setFooter(`Punishment ID: ${punishmentID}`)
                                .addFields(
                                    { name: 'Reason', value: reason },
                                    { name: 'Expires', value: '6 hours' },
                                )
                            )
                        } catch(err) {
                            console.log(err)
                        }

                        const guildName = message.guild.name;
                        const guildID = message.guild.id;
                        const moderator = bot.user.tag;
                        const userID = message.author.id;
                
                        const date = moment().tz("Europe/Paris").format("ddd, DD MMM YYYY");
                        const hours = moment().tz("Europe/Paris").format('HH');
                        const minutes = moment().tz("Europe/Paris").format('mm');
                        const seconds = moment().tz("Europe/Paris").format('ss');
                
                        const time = `${date} ${hours}:${minutes}:${seconds} UTC`;
                
                        const punishmentInfoObject = {
                            time: time,
                            reason: reason,
                            punishmentID: punishmentID,
                            punishmentType: 'Mute',
                            moderator: moderator,
                            userID: userID,
                        }

                        const expires = new Date();
                        expires.setHours(expires.getHours() + 504);
        
                        const punishmentData = {
                            time: time,
                            punishmentType: 'Mute',
                            guildName,
                            guildID,
                            userID,
                            punishmentID: punishmentID,
                            expires,
                
                            punishmentInfo: punishmentInfoObject,
                        }
                        new punishmentSchemaAutoMod(punishmentData).save();

                        setTimeout(() => {
                            message.member.roles.remove(muteRole)

                            function generateRandomID(length) {
                                var random_string = '';
                                var characters = '1234567890';
                                for (var i, i = 0; i < length; i++) {
                                    random_string += characters.charAt(Math.floor(Math.random() * characters.length))
                                }
                                return random_string;
                            }
                            
                            const randomChar = generateRandomID(17);
                            const punishmentID = `8${randomChar}`;
    
                            let reason = "[Automod] Mute cleared";

                            try {
                                message.author.send(
                                    new Discord.MessageEmbed()
                                    .setColor('0xA3BD8D')
                                    .setAuthor(bot.user.username, bot.user.displayAvatarURL())
                                    .setTitle(`You've been unmuted in ${message.guild.name}`)
                                    .setTimestamp()
                                    .setFooter(`Punishment ID: ${punishmentID}`)
                                )
                            } catch(err) {
                                console.log(err)
                            }

                            const guildName = message.guild.name;
                            const guildID = message.guild.id;
                            const moderator = bot.user.tag;
                            const userID = message.author.id;
                    
                            const date = moment().tz("Europe/Paris").format("ddd, DD MMM YYYY");
                            const hours = moment().tz("Europe/Paris").format('HH');
                            const minutes = moment().tz("Europe/Paris").format('mm');
                            const seconds = moment().tz("Europe/Paris").format('ss');
                    
                            const time = `${date} ${hours}:${minutes}:${seconds} UTC`;
                    
                            const punishmentInfoObject = {
                                time: time,
                                reason: reason,
                                punishmentID: punishmentID,
                                punishmentType: 'Unmute',
                                moderator: moderator,
                                userID: userID,
                            }

                            const expires = new Date();
                            expires.setHours(expires.getHours() + 504);
            
                            const punishmentData = {
                                time: time,
                                punishmentType: 'Unmute',
                                guildName,
                                guildID,
                                userID,
                                punishmentID: punishmentID,
                                expires,
                    
                                punishmentInfo: punishmentInfoObject,
                            }
                            new punishmentSchemaAutoMod(punishmentData).save();
                        }, ms('3h'))
                    } else if(warnings.length === 6) {
                        function generateRandomID(length) {
                            var random_string = '';
                            var characters = '1234567890';
                            for (var i, i = 0; i < length; i++) {
                                random_string += characters.charAt(Math.floor(Math.random() * characters.length))
                            }
                            return random_string;
                        }
                        
                        const randomChar = generateRandomID(17);
                        const punishmentID = `8${randomChar}`;

                        let reason = '[Automod] Exceeding **six** automod warnings within 24 hours';

                        try {
                            await message.author.send(
                                new Discord.MessageEmbed()
                                .setColor('0xdd5353')
                                .setAuthor(bot.user.username, bot.user.displayAvatarURL())
                                .setTitle(`You've been banned from ${message.guild.name}`)
                                .setTimestamp()
                                .setFooter(`Punishment ID: ${punishmentID}`)
                                .setDescription('You can appeal this ban by clicking [here](https://forms.gle/jcsKtzhUD7wV5Gpm7 "Ban appeal").')
                                .addField("Reason", reason)
                            )
                        } catch(err) {
                            console.log(err)
                        }

                        message.member.ban({ reason: reason + ` [${punishmentID}]` })

                        const guildName = message.guild.name;
                        const guildID = message.guild.id;
                        const moderator = bot.user.tag;
                        const userID = message.author.id;
                
                        const date = moment().tz("Europe/Paris").format("ddd, DD MMM YYYY");
                        const hours = moment().tz("Europe/Paris").format('HH');
                        const minutes = moment().tz("Europe/Paris").format('mm');
                        const seconds = moment().tz("Europe/Paris").format('ss');
                
                        const time = `${date} ${hours}:${minutes}:${seconds} UTC`;
                
                        const punishmentInfoObject = {
                            time: time,
                            reason: reason,
                            punishmentID: punishmentID,
                            punishmentType: 'Ban',
                            moderator: moderator,
                            userID: userID,
                        }

                        const expires = new Date();
                        expires.setHours(expires.getHours() + 720);
        
                        const punishmentData = {
                            time: time,
                            punishmentType: 'Ban',
                            guildName,
                            guildID,
                            userID,
                            punishmentID: punishmentID,
                            expires,
                
                            punishmentInfo: punishmentInfoObject,
                        }
                        new punishmentSchemaAutoMod(punishmentData).save();
                    }
                }
    
                //-----------------------antiLineSpam-----------------------//
    
                try {
                    try {
                        var number = message.content.match(/\n/g).length
                    } catch {
                        return;
                    }
                    
                    if(number >= 4) {
                        if(message.member.hasPermission('ADMINISTRATOR')) return;
                        if(message.member.hasPermission('MANAGE_MESSAGES')) return message.delete();
                        message.delete().then(message.reply('<a:animeBonk:850699557494194177> you cannot line spam here, that is not cool').then(msg => msg.delete({ timeout: 7000 })))
    
                        function generateRandomID(length) {
                            var random_string = '';
                            var characters = '1234567890';
                            for (var i, i = 0; i < length; i++) {
                                random_string += characters.charAt(Math.floor(Math.random() * characters.length))
                            }
                            return random_string;
                        }
                        
                        const randomChar = generateRandomID(17);
                        const punishmentID = `8${randomChar}`;
        
                        const reason = '[Automod] Line spamming.';
        
                        const warning = new Discord.MessageEmbed()
                        .setColor('0xFBD34D')
                        .setTitle(`You've been warned in ${message.guild.name}`)
                        .setAuthor(bot.user.username, bot.user.displayAvatarURL({ dynamic: true }))
                        .addFields(
                            { name: 'Reason', value: reason },
                            { name: 'Expires', value: '23 hours 59 minutes 59 seconds' },
                        )
                        .setTimestamp()
                        .setFooter(`Punishment ID: ${punishmentID}`)
        
                        try {
                            message.author.send(warning)
                        } catch(err) {
                            console.log(err)
                        }
        
                        const guildName = message.guild.name;
                        const guildID = message.guild.id;
                        const moderator = bot.user.tag;
                        const userID = message.author.id;
                
                        const date = moment().tz("Europe/Paris").format("ddd, DD MMM YYYY");
                        const hours = moment().tz("Europe/Paris").format('HH');
                        const minutes = moment().tz("Europe/Paris").format('mm');
                        const seconds = moment().tz("Europe/Paris").format('ss');
                
                        const time = `${date} ${hours}:${minutes}:${seconds} UTC`;

                        const expires = new Date();
                        expires.setHours(expires.getHours() + 24);
                
                        const punishmentInfoObject = {
                            time: time,
                            reason: reason,
                            punishmentID: punishmentID,
                            punishmentType: 'Warn',
                            moderator: moderator,
                            userID: userID,
                        }
        
                        const punishmentData = {
                            time: time,
                            punishmentType: 'Warn',
                            guildName,
                            guildID,
                            userID,
                            punishmentID: punishmentID,
                            expires,
                
                            punishmentInfo: punishmentInfoObject,
                        }
                        new punishmentSchemaAutoMod(punishmentData).save();
        
                        setTimeout(() => {
                            punishmentSchemaAutoMod.findOne({ guildID: message.guild.id, userID: message.author.id }, async (err, data) => {
                                if(err) throw err;
                                if(!data) {
                                    return
                                } else {
                                    data.delete();
                                }
                            })
                        }, ms('24h'))
    
                        //-------------autoPunishments-------------//
    
                    let warnings = await punishmentSchemaAutoMod.find({
                        guildID: message.guild.id,
                        userID: message.author.id,
                        punishmentType: "Warn",
                    })

                    if(warnings.length === 3) {
                        message.channel.send(
                            new Discord.MessageEmbed()
                            .setColor('0xdd5353')
                            .setDescription(`${message.author} has been muted for continuous infractions.`)
                        ).then(message.member.roles.add(muteRole))

                        function generateRandomID(length) {
                            var random_string = '';
                            var characters = '1234567890';
                            for (var i, i = 0; i < length; i++) {
                                random_string += characters.charAt(Math.floor(Math.random() * characters.length))
                            }
                            return random_string;
                        }
                        
                        const randomChar = generateRandomID(17);
                        const punishmentID = `8${randomChar}`;

                        let reason = "[Automod] Exceeding **three** automod warnings within 24 hours";

                        try {
                            message.author.send(
                                new Discord.MessageEmbed()
                                .setColor('0xFBD34D')
                                .setAuthor(bot.user.username, bot.user.displayAvatarURL())
                                .setTitle(`You've been muted in ${message.guild.name}`)
                                .setTimestamp()
                                .setFooter(`Punishment ID: ${punishmentID}`)
                                .addFields(
                                    { name: 'Reason', value: reason },
                                    { name: 'Expires', value: '3 hours' },
                                )
                            )
                        } catch(err) {
                            console.log(err)
                        }

                        const guildName = message.guild.name;
                        const guildID = message.guild.id;
                        const moderator = bot.user.tag;
                        const userID = message.author.id;
                
                        const date = moment().tz("Europe/Paris").format("ddd, DD MMM YYYY");
                        const hours = moment().tz("Europe/Paris").format('HH');
                        const minutes = moment().tz("Europe/Paris").format('mm');
                        const seconds = moment().tz("Europe/Paris").format('ss');
                
                        const time = `${date} ${hours}:${minutes}:${seconds} UTC`;
                
                        const punishmentInfoObject = {
                            time: time,
                            reason: reason,
                            punishmentID: punishmentID,
                            punishmentType: 'Mute',
                            moderator: moderator,
                            userID: userID,
                        }

                        const expires = new Date();
                        expires.setHours(expires.getHours() + 504);
        
                        const punishmentData = {
                            time: time,
                            punishmentType: 'Mute',
                            guildName,
                            guildID,
                            userID,
                            punishmentID: punishmentID,
                            expires,
                
                            punishmentInfo: punishmentInfoObject,
                        }
                        new punishmentSchemaAutoMod(punishmentData).save();

                        setTimeout(() => {
                            message.member.roles.remove(muteRole)

                            function generateRandomID(length) {
                                var random_string = '';
                                var characters = '1234567890';
                                for (var i, i = 0; i < length; i++) {
                                    random_string += characters.charAt(Math.floor(Math.random() * characters.length))
                                }
                                return random_string;
                            }
                            
                            const randomChar = generateRandomID(17);
                            const punishmentID = `8${randomChar}`;
    
                            let reason = "[Automod] Mute cleared";

                            try {
                                message.author.send(
                                    new Discord.MessageEmbed()
                                    .setColor('0xA3BD8D')
                                    .setAuthor(bot.user.username, bot.user.displayAvatarURL())
                                    .setTitle(`You've been unmuted in ${message.guild.name}`)
                                    .setTimestamp()
                                    .setFooter(`Punishment ID: ${punishmentID}`)
                                )
                            } catch(err) {
                                console.log(err)
                            }

                            const guildName = message.guild.name;
                            const guildID = message.guild.id;
                            const moderator = bot.user.tag;
                            const userID = message.author.id;
                    
                            const date = moment().tz("Europe/Paris").format("ddd, DD MMM YYYY");
                            const hours = moment().tz("Europe/Paris").format('HH');
                            const minutes = moment().tz("Europe/Paris").format('mm');
                            const seconds = moment().tz("Europe/Paris").format('ss');
                    
                            const time = `${date} ${hours}:${minutes}:${seconds} UTC`;
                    
                            const punishmentInfoObject = {
                                time: time,
                                reason: reason,
                                punishmentID: punishmentID,
                                punishmentType: 'Unmute',
                                moderator: moderator,
                                userID: userID,
                            }

                            const expires = new Date();
                            expires.setHours(expires.getHours() + 504);
            
                            const punishmentData = {
                                time: time,
                                punishmentType: 'Unmute',
                                guildName,
                                guildID,
                                userID,
                                punishmentID: punishmentID,
                                expires,
                    
                                punishmentInfo: punishmentInfoObject,
                            }
                            new punishmentSchemaAutoMod(punishmentData).save();
                        }, ms('3h'))
                    } else if(warnings.length === 4) {
                        message.channel.send(
                            new Discord.MessageEmbed()
                            .setColor('0xdd5353')
                            .setDescription(`${message.author} has been muted for continuous infractions.`)
                        ).then(message.member.roles.add(muteRole))

                        function generateRandomID(length) {
                            var random_string = '';
                            var characters = '1234567890';
                            for (var i, i = 0; i < length; i++) {
                                random_string += characters.charAt(Math.floor(Math.random() * characters.length))
                            }
                            return random_string;
                        }
                        
                        const randomChar = generateRandomID(17);
                        const punishmentID = `8${randomChar}`;

                        let reason = "[Automod] Exceeding **four** automod warnings within 24 hours";

                        try {
                            message.author.send(
                                new Discord.MessageEmbed()
                                .setColor('0xFBD34D')
                                .setAuthor(bot.user.username, bot.user.displayAvatarURL())
                                .setTitle(`You've been muted in ${message.guild.name}`)
                                .setTimestamp()
                                .setFooter(`Punishment ID: ${punishmentID}`)
                                .addFields(
                                    { name: 'Reason', value: reason },
                                    { name: 'Expires', value: '6 hours' },
                                )
                            )
                        } catch(err) {
                            console.log(err)
                        }

                        const guildName = message.guild.name;
                        const guildID = message.guild.id;
                        const moderator = bot.user.tag;
                        const userID = message.author.id;
                
                        const date = moment().tz("Europe/Paris").format("ddd, DD MMM YYYY");
                        const hours = moment().tz("Europe/Paris").format('HH');
                        const minutes = moment().tz("Europe/Paris").format('mm');
                        const seconds = moment().tz("Europe/Paris").format('ss');
                
                        const time = `${date} ${hours}:${minutes}:${seconds} UTC`;
                
                        const punishmentInfoObject = {
                            time: time,
                            reason: reason,
                            punishmentID: punishmentID,
                            punishmentType: 'Mute',
                            moderator: moderator,
                            userID: userID,
                        }

                        const expires = new Date();
                        expires.setHours(expires.getHours() + 504);
        
                        const punishmentData = {
                            time: time,
                            punishmentType: 'Mute',
                            guildName,
                            guildID,
                            userID,
                            punishmentID: punishmentID,
                            expires,
                
                            punishmentInfo: punishmentInfoObject,
                        }
                        new punishmentSchemaAutoMod(punishmentData).save();

                        setTimeout(() => {
                            message.member.roles.remove(muteRole)

                            function generateRandomID(length) {
                                var random_string = '';
                                var characters = '1234567890';
                                for (var i, i = 0; i < length; i++) {
                                    random_string += characters.charAt(Math.floor(Math.random() * characters.length))
                                }
                                return random_string;
                            }
                            
                            const randomChar = generateRandomID(17);
                            const punishmentID = `8${randomChar}`;
    
                            let reason = "[Automod] Mute cleared";

                            try {
                                message.author.send(
                                    new Discord.MessageEmbed()
                                    .setColor('0xA3BD8D')
                                    .setAuthor(bot.user.username, bot.user.displayAvatarURL())
                                    .setTitle(`You've been unmuted in ${message.guild.name}`)
                                    .setTimestamp()
                                    .setFooter(`Punishment ID: ${punishmentID}`)
                                )
                            } catch(err) {
                                console.log(err)
                            }

                            const guildName = message.guild.name;
                            const guildID = message.guild.id;
                            const moderator = bot.user.tag;
                            const userID = message.author.id;
                    
                            const date = moment().tz("Europe/Paris").format("ddd, DD MMM YYYY");
                            const hours = moment().tz("Europe/Paris").format('HH');
                            const minutes = moment().tz("Europe/Paris").format('mm');
                            const seconds = moment().tz("Europe/Paris").format('ss');
                    
                            const time = `${date} ${hours}:${minutes}:${seconds} UTC`;
                    
                            const punishmentInfoObject = {
                                time: time,
                                reason: reason,
                                punishmentID: punishmentID,
                                punishmentType: 'Unmute',
                                moderator: moderator,
                                userID: userID,
                            }

                            const expires = new Date();
                            expires.setHours(expires.getHours() + 504);
            
                            const punishmentData = {
                                time: time,
                                punishmentType: 'Unmute',
                                guildName,
                                guildID,
                                userID,
                                punishmentID: punishmentID,
                                expires,
                    
                                punishmentInfo: punishmentInfoObject,
                            }
                            new punishmentSchemaAutoMod(punishmentData).save();
                        }, ms('3h'))
                    } else if(warnings.length === 6) {
                        function generateRandomID(length) {
                            var random_string = '';
                            var characters = '1234567890';
                            for (var i, i = 0; i < length; i++) {
                                random_string += characters.charAt(Math.floor(Math.random() * characters.length))
                            }
                            return random_string;
                        }
                        
                        const randomChar = generateRandomID(17);
                        const punishmentID = `8${randomChar}`;

                        let reason = '[Automod] Exceeding **six** automod warnings within 24 hours';

                        try {
                            await message.author.send(
                                new Discord.MessageEmbed()
                                .setColor('0xdd5353')
                                .setAuthor(bot.user.username, bot.user.displayAvatarURL())
                                .setTitle(`You've been banned from ${message.guild.name}`)
                                .setTimestamp()
                                .setFooter(`Punishment ID: ${punishmentID}`)
                                .setDescription('You can appeal this ban by clicking [here](https://forms.gle/jcsKtzhUD7wV5Gpm7 "Ban appeal").')
                                .addField("Reason", reason)
                            )
                        } catch(err) {
                            console.log(err)
                        }

                        message.member.ban({ reason: reason + ` [${punishmentID}]` })

                        const guildName = message.guild.name;
                        const guildID = message.guild.id;
                        const moderator = bot.user.tag;
                        const userID = message.author.id;
                
                        const date = moment().tz("Europe/Paris").format("ddd, DD MMM YYYY");
                        const hours = moment().tz("Europe/Paris").format('HH');
                        const minutes = moment().tz("Europe/Paris").format('mm');
                        const seconds = moment().tz("Europe/Paris").format('ss');
                
                        const time = `${date} ${hours}:${minutes}:${seconds} UTC`;
                
                        const punishmentInfoObject = {
                            time: time,
                            reason: reason,
                            punishmentID: punishmentID,
                            punishmentType: 'Ban',
                            moderator: moderator,
                            userID: userID,
                        }

                        const expires = new Date();
                        expires.setHours(expires.getHours() + 720);
        
                        const punishmentData = {
                            time: time,
                            punishmentType: 'Ban',
                            guildName,
                            guildID,
                            userID,
                            punishmentID: punishmentID,
                            expires,
                
                            punishmentInfo: punishmentInfoObject,
                        }
                        new punishmentSchemaAutoMod(punishmentData).save();
                    }
                }
            } catch(err) {
                console.log(err)
            }
    
                //-----------------------antiLink-----------------------//
    
                function isValidUrl(string) {
                    var res = string.match(/(http(s)?:\/\/.)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,556}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/g);
                    return (res !== null)
                };
    
                if(isValidUrl(message.content)) {
                    if(message.channel.id === '888746515739328512') return;
                    if(message.member.hasPermission('ADMINISTRATOR')) return;
                    if(message.member.hasPermission('MANAGE_MESSAGES')) return message.delete();
                    message.delete().then(message.reply('<a:animeBonk:850699557494194177> you cannot post links here.').then(msg => msg.delete({ timeout: 7000 })));
    
                    function generateRandomID(length) {
                        var random_string = '';
                        var characters = '1234567890';
                        for (var i, i = 0; i < length; i++) {
                            random_string += characters.charAt(Math.floor(Math.random() * characters.length))
                        }
                        return random_string;
                    }
                    
                    const randomChar = generateRandomID(17);
                    const punishmentID = `8${randomChar}`;
    
                    const reason = '[Automod] Sending links.';
    
                    const warning = new Discord.MessageEmbed()
                    .setColor('0xFBD34D')
                    .setTitle(`You've been warned in ${message.guild.name}`)
                    .setAuthor(bot.user.username, bot.user.displayAvatarURL({ dynamic: true }))
                    .addFields(
                        { name: 'Reason', value: reason },
                        { name: 'Expires', value: '23 hours 59 minutes 59 seconds' },
                    )
    
                    try {
                        message.author.send(warning)
                    } catch(err) {
                        console.log(err)
                    }
    
                    const guildName = message.guild.name;
                    const guildID = message.guild.id;
                    const moderator = bot.user.tag;
                    const userID = message.author.id;
            
                    const date = moment().tz("Europe/Paris").format("ddd, DD MMM YYYY");
                    const hours = moment().tz("Europe/Paris").format('HH');
                    const minutes = moment().tz("Europe/Paris").format('mm');
                    const seconds = moment().tz("Europe/Paris").format('ss');
            
                    const time = `${date} ${hours}:${minutes}:${seconds} UTC`;

                    const expires = new Date();
                    expires.setHours(expires.getHours() + 24);
            
                    const punishmentInfoObject = {
                        time: time,
                        reason: reason,
                        punishmentID: punishmentID,
                        punishmentType: 'Warn',
                        moderator: moderator,
                        userID: userID,
                    }
    
                    const punishmentData = {
                        time: time,
                        punishmentType: 'Warn',
                        guildName,
                        guildID,
                        userID,
                        punishmentID: punishmentID,
                        expires,
            
                        punishmentInfo: punishmentInfoObject,
                    }
                    new punishmentSchemaAutoMod(punishmentData).save();
    
                    //-------------autoPunishments-------------//
    
                    let warnings = await punishmentSchemaAutoMod.find({
                        guildID: message.guild.id,
                        userID: message.author.id,
                        punishmentType: "Warn",
                    })

                    if(warnings.length === 3) {
                        message.channel.send(
                            new Discord.MessageEmbed()
                            .setColor('0xdd5353')
                            .setDescription(`${message.author} has been muted for continuous infractions.`)
                        ).then(message.member.roles.add(muteRole))

                        function generateRandomID(length) {
                            var random_string = '';
                            var characters = '1234567890';
                            for (var i, i = 0; i < length; i++) {
                                random_string += characters.charAt(Math.floor(Math.random() * characters.length))
                            }
                            return random_string;
                        }
                        
                        const randomChar = generateRandomID(17);
                        const punishmentID = `8${randomChar}`;

                        let reason = "[Automod] Exceeding **three** automod warnings within 24 hours";

                        try {
                            message.author.send(
                                new Discord.MessageEmbed()
                                .setColor('0xFBD34D')
                                .setAuthor(bot.user.username, bot.user.displayAvatarURL())
                                .setTitle(`You've been muted in ${message.guild.name}`)
                                .setTimestamp()
                                .setFooter(`Punishment ID: ${punishmentID}`)
                                .addFields(
                                    { name: 'Reason', value: reason },
                                    { name: 'Expires', value: '3 hours' },
                                )
                            )
                        } catch(err) {
                            console.log(err)
                        }

                        const guildName = message.guild.name;
                        const guildID = message.guild.id;
                        const moderator = bot.user.tag;
                        const userID = message.author.id;
                
                        const date = moment().tz("Europe/Paris").format("ddd, DD MMM YYYY");
                        const hours = moment().tz("Europe/Paris").format('HH');
                        const minutes = moment().tz("Europe/Paris").format('mm');
                        const seconds = moment().tz("Europe/Paris").format('ss');
                
                        const time = `${date} ${hours}:${minutes}:${seconds} UTC`;
                
                        const punishmentInfoObject = {
                            time: time,
                            reason: reason,
                            punishmentID: punishmentID,
                            punishmentType: 'Mute',
                            moderator: moderator,
                            userID: userID,
                        }

                        const expires = new Date();
                        expires.setHours(expires.getHours() + 504);
        
                        const punishmentData = {
                            time: time,
                            punishmentType: 'Mute',
                            guildName,
                            guildID,
                            userID,
                            punishmentID: punishmentID,
                            expires,
                
                            punishmentInfo: punishmentInfoObject,
                        }
                        new punishmentSchemaAutoMod(punishmentData).save();

                        setTimeout(() => {
                            message.member.roles.remove(muteRole)

                            function generateRandomID(length) {
                                var random_string = '';
                                var characters = '1234567890';
                                for (var i, i = 0; i < length; i++) {
                                    random_string += characters.charAt(Math.floor(Math.random() * characters.length))
                                }
                                return random_string;
                            }
                            
                            const randomChar = generateRandomID(17);
                            const punishmentID = `8${randomChar}`;
    
                            let reason = "[Automod] Mute cleared";

                            try {
                                message.author.send(
                                    new Discord.MessageEmbed()
                                    .setColor('0xA3BD8D')
                                    .setAuthor(bot.user.username, bot.user.displayAvatarURL())
                                    .setTitle(`You've been unmuted in ${message.guild.name}`)
                                    .setTimestamp()
                                    .setFooter(`Punishment ID: ${punishmentID}`)
                                )
                            } catch(err) {
                                console.log(err)
                            }

                            const guildName = message.guild.name;
                            const guildID = message.guild.id;
                            const moderator = bot.user.tag;
                            const userID = message.author.id;
                    
                            const date = moment().tz("Europe/Paris").format("ddd, DD MMM YYYY");
                            const hours = moment().tz("Europe/Paris").format('HH');
                            const minutes = moment().tz("Europe/Paris").format('mm');
                            const seconds = moment().tz("Europe/Paris").format('ss');
                    
                            const time = `${date} ${hours}:${minutes}:${seconds} UTC`;
                    
                            const punishmentInfoObject = {
                                time: time,
                                reason: reason,
                                punishmentID: punishmentID,
                                punishmentType: 'Unmute',
                                moderator: moderator,
                                userID: userID,
                            }

                            const expires = new Date();
                            expires.setHours(expires.getHours() + 504);
            
                            const punishmentData = {
                                time: time,
                                punishmentType: 'Unmute',
                                guildName,
                                guildID,
                                userID,
                                punishmentID: punishmentID,
                                expires,
                    
                                punishmentInfo: punishmentInfoObject,
                            }
                            new punishmentSchemaAutoMod(punishmentData).save();
                        }, ms('3h'))
                    } else if(warnings.length === 4) {
                        message.channel.send(
                            new Discord.MessageEmbed()
                            .setColor('0xdd5353')
                            .setDescription(`${message.author} has been muted for continuous infractions.`)
                        ).then(message.member.roles.add(muteRole))

                        function generateRandomID(length) {
                            var random_string = '';
                            var characters = '1234567890';
                            for (var i, i = 0; i < length; i++) {
                                random_string += characters.charAt(Math.floor(Math.random() * characters.length))
                            }
                            return random_string;
                        }
                        
                        const randomChar = generateRandomID(17);
                        const punishmentID = `8${randomChar}`;

                        let reason = "[Automod] Exceeding **four** automod warnings within 24 hours";

                        try {
                            message.author.send(
                                new Discord.MessageEmbed()
                                .setColor('0xFBD34D')
                                .setAuthor(bot.user.username, bot.user.displayAvatarURL())
                                .setTitle(`You've been muted in ${message.guild.name}`)
                                .setTimestamp()
                                .setFooter(`Punishment ID: ${punishmentID}`)
                                .addFields(
                                    { name: 'Reason', value: reason },
                                    { name: 'Expires', value: '6 hours' },
                                )
                            )
                        } catch(err) {
                            console.log(err)
                        }

                        const guildName = message.guild.name;
                        const guildID = message.guild.id;
                        const moderator = bot.user.tag;
                        const userID = message.author.id;
                
                        const date = moment().tz("Europe/Paris").format("ddd, DD MMM YYYY");
                        const hours = moment().tz("Europe/Paris").format('HH');
                        const minutes = moment().tz("Europe/Paris").format('mm');
                        const seconds = moment().tz("Europe/Paris").format('ss');
                
                        const time = `${date} ${hours}:${minutes}:${seconds} UTC`;
                
                        const punishmentInfoObject = {
                            time: time,
                            reason: reason,
                            punishmentID: punishmentID,
                            punishmentType: 'Mute',
                            moderator: moderator,
                            userID: userID,
                        }

                        const expires = new Date();
                        expires.setHours(expires.getHours() + 504);
        
                        const punishmentData = {
                            time: time,
                            punishmentType: 'Mute',
                            guildName,
                            guildID,
                            userID,
                            punishmentID: punishmentID,
                            expires,
                
                            punishmentInfo: punishmentInfoObject,
                        }
                        new punishmentSchemaAutoMod(punishmentData).save();

                        setTimeout(() => {
                            message.member.roles.remove(muteRole)

                            function generateRandomID(length) {
                                var random_string = '';
                                var characters = '1234567890';
                                for (var i, i = 0; i < length; i++) {
                                    random_string += characters.charAt(Math.floor(Math.random() * characters.length))
                                }
                                return random_string;
                            }
                            
                            const randomChar = generateRandomID(17);
                            const punishmentID = `8${randomChar}`;
    
                            let reason = "[Automod] Mute cleared";

                            try {
                                message.author.send(
                                    new Discord.MessageEmbed()
                                    .setColor('0xA3BD8D')
                                    .setAuthor(bot.user.username, bot.user.displayAvatarURL())
                                    .setTitle(`You've been unmuted in ${message.guild.name}`)
                                    .setTimestamp()
                                    .setFooter(`Punishment ID: ${punishmentID}`)
                                )
                            } catch(err) {
                                console.log(err)
                            }

                            const guildName = message.guild.name;
                            const guildID = message.guild.id;
                            const moderator = bot.user.tag;
                            const userID = message.author.id;
                    
                            const date = moment().tz("Europe/Paris").format("ddd, DD MMM YYYY");
                            const hours = moment().tz("Europe/Paris").format('HH');
                            const minutes = moment().tz("Europe/Paris").format('mm');
                            const seconds = moment().tz("Europe/Paris").format('ss');
                    
                            const time = `${date} ${hours}:${minutes}:${seconds} UTC`;
                    
                            const punishmentInfoObject = {
                                time: time,
                                reason: reason,
                                punishmentID: punishmentID,
                                punishmentType: 'Unmute',
                                moderator: moderator,
                                userID: userID,
                            }

                            const expires = new Date();
                            expires.setHours(expires.getHours() + 504);
            
                            const punishmentData = {
                                time: time,
                                punishmentType: 'Unmute',
                                guildName,
                                guildID,
                                userID,
                                punishmentID: punishmentID,
                                expires,
                    
                                punishmentInfo: punishmentInfoObject,
                            }
                            new punishmentSchemaAutoMod(punishmentData).save();
                        }, ms('3h'))
                    } else if(warnings.length === 6) {
                        function generateRandomID(length) {
                            var random_string = '';
                            var characters = '1234567890';
                            for (var i, i = 0; i < length; i++) {
                                random_string += characters.charAt(Math.floor(Math.random() * characters.length))
                            }
                            return random_string;
                        }
                        
                        const randomChar = generateRandomID(17);
                        const punishmentID = `8${randomChar}`;

                        let reason = '[Automod] Exceeding **six** automod warnings within 24 hours';

                        try {
                            await message.author.send(
                                new Discord.MessageEmbed()
                                .setColor('0xdd5353')
                                .setAuthor(bot.user.username, bot.user.displayAvatarURL())
                                .setTitle(`You've been banned from ${message.guild.name}`)
                                .setTimestamp()
                                .setFooter(`Punishment ID: ${punishmentID}`)
                                .setDescription('You can appeal this ban by clicking [here](https://forms.gle/jcsKtzhUD7wV5Gpm7 "Ban appeal").')
                                .addField("Reason", reason)
                            )
                        } catch(err) {
                            console.log(err)
                        }

                        message.member.ban({ reason: reason + ` [${punishmentID}]` })

                        const guildName = message.guild.name;
                        const guildID = message.guild.id;
                        const moderator = bot.user.tag;
                        const userID = message.author.id;
                
                        const date = moment().tz("Europe/Paris").format("ddd, DD MMM YYYY");
                        const hours = moment().tz("Europe/Paris").format('HH');
                        const minutes = moment().tz("Europe/Paris").format('mm');
                        const seconds = moment().tz("Europe/Paris").format('ss');
                
                        const time = `${date} ${hours}:${minutes}:${seconds} UTC`;
                
                        const punishmentInfoObject = {
                            time: time,
                            reason: reason,
                            punishmentID: punishmentID,
                            punishmentType: 'Ban',
                            moderator: moderator,
                            userID: userID,
                        }

                        const expires = new Date();
                        expires.setHours(expires.getHours() + 720);
        
                        const punishmentData = {
                            time: time,
                            punishmentType: 'Ban',
                            guildName,
                            guildID,
                            userID,
                            punishmentID: punishmentID,
                            expires,
                
                            punishmentInfo: punishmentInfoObject,
                        }
                        new punishmentSchemaAutoMod(punishmentData).save();
                    }
                }
            }
        } else return;
    })
}