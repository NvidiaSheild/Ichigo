let discord = require('discord.js')

exports.run = (client, msg, args, server_settings) => {
    if(!args[0]) return msg.channel.send("Please give someone to boop")
    let boopee = args.join(" ")
    let embed = new discord.MessageEmbed().setDescription(`<@${msg.author.id}> just booped ${boopee} on the nose.`).setImage("https://media1.giphy.com/media/2dnTHovkLt6Yo/giphy.gif")
    return msg.channel.send(embed)
}

exports.info = {
    "name": "boop",
    "description": "boop someone on the nose",
    "example": "boop [person]",
    "type": "basic"
}