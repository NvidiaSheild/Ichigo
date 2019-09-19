function secondsToDhms(d) {
    d = Number(d);
    var days = Math.floor(d / 86400);
    var hrs = Math.floor((d / 3600) % 24);
    var mins = Math.floor(d % 3600 / 60);
    var secs = Math.floor(d % 60);
    var days_txt = days.toString().padStart(2, "0")
    var hrs_txt = hrs.toString().padStart(2, "0")
    var mins_txt = mins.toString().padStart(2, "0");
    var secs_txt = secs.toString().padStart(2, "0");
    output = "";
    if(days > 0) {
        output += `${days_txt} days `
    }
    if (hrs > 0) {
        output += `${hrs_txt} hrs `
    }
    if (mins > 0) {
        output += `${mins_txt} mins `
    }
    if (secs > 0) {
        output += `${secs_txt} secs `
    }
    return output;
}

exports.run = (client, msg, args, server_settings) => {
    if (!msg.member.voice) return msg.channel.send("You must be in a voice channel to use this command");
    return msg.channel.send({
        embed: {
            title: "Currently Playing:",
            description: `Title: [**${client.queue.get(msg.guild.id).current.info.title}**](${client.queue.get(msg.guild.id).current.info.uri})
Author: **${client.queue.get(msg.guild.id).current.info.author}**
Current Playing Position: **${secondsToDhms(client.Carrier.getPlayer(msg.guild.id).position/1000)}** / **${secondsToDhms(client.queue.get(msg.guild.id).current.info.length/1000)}**`,
            color: 0x7289da
        }
    })
}

exports.info = {
    "name": "nowplaying",
    "type": "music",
    "description": "show the currently playing ",
    "example": "skip"
}