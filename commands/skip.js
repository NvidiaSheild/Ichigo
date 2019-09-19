exports.run = (client, msg, args, server_settings) => {
    if (!msg.member.voice) return msg.channel.send("You must be in a voice channel to use this command");
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