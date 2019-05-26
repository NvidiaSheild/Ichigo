let discord = require('discord.js')

exports.run = (client, msg, args, server_settings) => {
    //Set the embed description
    let embed = new discord.RichEmbed().setDescription("[Patreon Link](https://www.patreon.com/Discord_Ichigo)")
    //Send embed
    return msg.channel.send(embed)
}

exports.info = {
    "name": "patreon",
    "description": "Get the patreon link to support the bot",
    "example": "patreon",
    "type": "basic"
}