let IchigoDispatcher = require('./ichigoDispatcher')
const {MessageEmbed} = require('discord.js')

class Queue extends Map {
    constructor(client, iterable) {
        super(iterable);

        this.client = client;
    }

    handle(node, track, msg) {
        return new Promise((resolve, reject) => {
            const existing = this.get(msg.guild.id)
            if (!existing) {
                node.joinVoiceChannel({
                    guildID: msg.guild.id,
                    voiceChannelID: msg.member.voice.channelID
                }).then(player => {
                    const dispatcher = new IchigoDispatcher({
                        client: this.client,
                        guild: msg.guild,
                        text: msg.channel,
                        player
                    });
                    dispatcher.queue.push(track);
                    this.set(msg.guild.id, dispatcher);
                    resolve(dispatcher);
                });
            } else {
                existing.queue.push(track);
                resolve(null)
            }
        })
    }
}
module.exports = Queue;