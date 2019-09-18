let DiscordEmbed = require('discord.js').MessageEmbed

exports.run = (client, msg, args, server_settings) => {
    let embed = new DiscordEmbed()
    .setImage("https://fanaticphoenix.co.uk/server/" + msg.guild.id + "/user_profile/" + msg.author.id + "?cache=" + (Math.random()*2384179847))
    .setFooter("Try command again if profile doesnt show properly", client.avatarURL)
    return msg.channel.send({embed})
}

exports.info = {
    "name": "serverprofile",
    "description": "get your user profile for the guild youre in",
    "example": "serverprofile",
    "type": "basic"
}