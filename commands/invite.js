let discord = require('discord.js')

exports.run = (client, msg, args, server_settings) => {
    //Set the embed description
    let embed = new discord.RichEmbed().setDescription("[Bot invite link](https://discordapp.com/oauth2/authorize?client_id=575977933492191232&scope=bot&permissions=8)")
    //Send embed
    return msg.channel.send(embed)
}

exports.info = {
    "name": "invite",
    "description": "Get the invite link for the bot",
    "example": "invite",
    "type": "basic"
}