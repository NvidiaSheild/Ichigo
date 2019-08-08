let discord = require('discord.js')
let settings = require('../settings')

exports.run = (client, msg, args, server_settings) => {
    if(settings.say_users.includes(msg.author.id)) {
    return msg.channel.send(text=args.join(" "))
    } else return;
}

exports.info = {
    "name": "say",
    "description": "Say something through the mod",
    "example": "say [text]",
    "type": "owner"
}