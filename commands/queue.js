let { MessageEmbed } = require('discord.js')

exports.run = (client, msg, args, server_settings) => {
    if (!msg.member.voice) return msg.channel.send("You must be in a voice channel to use this command");
    let current = client.queue.get(msg.guild.id).current
    let queue = client.queue.get(msg.guild.id).queue
    function queueOutput() {
        let number = 1
        let output = "";
        if(queue.length == 1) return "`Nothing is queued...`"
        queue.map(track => {
            if(track.track == current.track) return;
            output += `**${number}**. [${track.info.title}](${track.info.uri})\n`
            number++
        })
        return output;
    } 
    let embed = new MessageEmbed()
    .addField("Currently Playing:", `[${current.info.title}](${current.info.uri})`)
    .addField("In Queue:", queueOutput())
    return msg.channel.send(embed)
}

exports.info = {
    "name": "queue",
    "type": "music",
    "description": "show the current queue",
    "example": "queue"
}