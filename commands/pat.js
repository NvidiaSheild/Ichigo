let discord = require('discord.js')

exports.run = (client, msg, args, server_settings) => {
    if(!args[0]) return msg.channel.send("Please give someone to pat")
    let patee = args.join(" ")
    let embed = new discord.RichEmbed().setDescription(`<@${msg.author.id}> just pat ${patee} on the head.`).setImage("https://media.giphy.com/media/xUA7bahIfcCqC7S4qA/giphy.gif")
    return msg.channel.send(embed)
}

exports.info = {
    "name": "pat",
    "description": "pat someone on the nose",
    "example": "pat [person]",
    "type": "basic",
    "votelocked": true
}