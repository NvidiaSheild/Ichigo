exports.run = (client, msg, args, server_settings) => {
    let setVolumeEmbed = (volume) => {
        return {
            embed: {
                title: `Volume set to`,    
                description: `\`${volume}\``,
                color: 0x7289da
            }
        }
    }
    let errorEmbed = (error) => {
        return {
            embed: {
                title: `Error`,    
                description: `\`${error}\``,
                color: 0x7289da
            }
        }
    }
    if (msg.author.id !== "116930717241311236") return msg.channel.send(`in dev`);
    if (!msg.member.voice) return msg.channel.send(errorEmbed("You must be in a voice channel to use this command"));
    if (args.length == 0) return msg.channel.send({
        embed: {
            title: `Current playback volume:`,
            description:`\`${client.Carrier.getPlayer(msg.guild.id).volume}\``
        }
    });
    if (isNaN(args[0])) return msg.channel.send(errorEmbed("Value must be a number [0 -> 200]"));
    if(Number.parseInt(args[0]) > 200) return msg.channel.send(errorEmbed("Value must be a number between 0 -> 200"));
    let num = args[0];
    client.Carrier.getPlayer(msg.guild.id).setVolume(num).then(() => {
        return msg.channel.send(setVolumeEmbed(num))
    })

}

exports.info = {
    "name": "volume",
    "type": "music",
    "description": "set the playback volume",
    "example": "volume [1 -> 200]"
}