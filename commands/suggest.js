let database = require('../handlers/database')
let discord = require('discord.js')

exports.run = (client, msg, args) => {
    let suggestion = args.join(" ");
    let embed = new discord.MessageEmbed()
    .setTitle("New Suggestion")
    .setDescription(`${msg.author.tag} (${msg.author.id}) made a suggestion`)
    .addField("Suggestion:", suggestion, inline=false)
    client.guilds.get('556013291378442240').channels.get('556880171672535043').send({embed})
}

exports.info = {
    "name": "suggest",
    "description": "Suggest something to the bot author.",
    "example": "suggest [text]",
    "type": "basic",
    "votelocked": true
}