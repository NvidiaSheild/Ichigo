let { MessageEmbed } = require('discord.js');
let moment = require('moment');

exports.run = (client, msg, args, server_settings) => {
    client.embedColor = '#71A3BE';
    if (msg.author.id !== "116930717241311236") return msg.channel.send(`in dev`);
    if (!msg.member.voice) return msg.channel.send("You must be in a voice channel to use this command");
    if (!args[0]) return msg.channel.send("Please provide a link or search term")
    const node = client.Carrier.getNode();
    node.rest.resolve(args[0]).then(data => {
        if (!data) {
            return node.rest.resolve(args, 'youtube').then(searchData => {
                let track = searchData.tracks[0];
                client.queue.handle(node, track, msg).then(res => {
                    if (res) res.play();
                    else {
                        const embed = new MessageEmbed()
                            .setColor(client.embedColor)
                            .setTitle("Queued")
                            .setDescription(`**[${track.info.title}](${track.info.uri}) [${moment(track.info.length - 3600000).format("H[h] m[m] s[s]")}]**`)
                        msg.channel.send(embed).catch(() => null);
                    }
                })
            })
        } else {
            if (Array.isArray(data)) data = data[0];
            client.queue.handle(node, data, msg).then(res => {
                if (res) res.play();
                else {
                    const embed = new MessageEmbed()
                        .setColor(client.embedColor)
                        .setTitle("Queued")
                        .setDescription(`**[${data.info.title}](${data.info.uri}) [${moment(data.info.length - 3600000).format("H[h] m[m] s[s]")}]**`)
                    msg.channel.send(embed).catch(() => null);
                }
            })
        }
    });

}

exports.info = {
    "name": "play",
    "type": "music",
    "description": "play a song",
    "example": "play [youtube/soundcloud link]"
}