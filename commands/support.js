const discord = require('discord.js')

exports.run = (client, msg, args, server_settings) => {
    let embed = new discord.RichEmbed().addField("Support Server Link:", "https://discord.gg/34k4Mk2")
    msg.channel.send(embed)
}

exports.info = {
    "name": "support",
    "description": "invite link for the support server",
    "type": "basic",
    "example": "support"
}