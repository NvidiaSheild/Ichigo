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
    return client.queue.get(msg.guild.id).onClean()

}

exports.info = {
    "name": "stop",
    "type": "music",
    "description": "stop the music",
    "example": "stop"
}