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
    client.Carrier.getPlayer(msg.guild.id).stopTrack().then(() => {
        return msg.channel.send({
            embed: {
                description: "Track has been skipped",
                color: 0x7289da
            }
        })
    })

}

exports.info = {
    "name": "skip",
    "type": "music",
    "description": "skip a song",
    "example": "skip"
}