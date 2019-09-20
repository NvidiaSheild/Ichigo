let { MessageEmbed } = require('discord.js')

exports.run = (client, msg, args, server_settings) => {
    let errorEmbed = {
        embed: {
            title: "Error",
            description: "`You must be in the same voice channel as me to use that command.`",
            color: 0x7289da
        }
    }
    if (!msg.member.voice.channelID) return msg.channel.send(errorEmbed)
    if (msg.member.voice.channelID !== msg.guild.me.voice.channelID) return msg.channel.send(errorEmbed);
    let current = client.queue.get(msg.guild.id).current
    let queue = client.queue.get(msg.guild.id).queue
    if(!current) return msg.channel.send({
        embed: {
            description: "`There is nothing currently playing...`",
            color: 0x7289da
        }
    })
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
    .setColor(0x7289da)
    return msg.channel.send(embed)
}

exports.info = {
    "name": "queue",
    "type": "music",
    "description": "show the current queue",
    "example": "queue"
}