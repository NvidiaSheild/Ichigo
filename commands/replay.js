exports.run = (client, msg, args, server_settings) => {
    if (!msg.member.voice) return msg.channel.send("You must be in a voice channel to use this command");
    client.Carrier.getPlayer(msg.guild.id).seekTo(1).then(() => {
        return msg.channel.send({
            embed: {
                description: "Track Replayed",
                color: 0x7289da
            }
        })
    })

}

exports.info = {
    "name": "replay",
    "type": "music",
    "description": "replay the current song",
    "example": "replay"
}