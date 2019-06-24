let discord = require('discord.js');

exports.run = (client, msg, args, server_settings) => {
    let channels = msg.guild.channels.filter(ch => ch.type == 'voice');
    let embed = new discord.RichEmbed()
    let output = "";
    channels.forEach(chan => {
        output += `[${chan.name}](https://discordapp.com/channels/${msg.guild.id}/${chan.id})\n`
    });
    embed.addField("All voice channel links", output)
    msg.channel.send({embed})

}


exports.info = {
    "name": "servervoice",
    "type": "basic",
    "description": "list all voice channels with a link to their screensharing section",
    "example": "servervoice",
    "votelocked": true
}