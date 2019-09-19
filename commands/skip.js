exports.run = (client, msg, args, server_settings) => {
    if (msg.author.id !== "116930717241311236") return msg.channel.send(`in dev`);
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