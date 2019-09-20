const { MessageEmbed } = require('discord.js');
const moment = require('moment');

class EventHandlers {
    static onEnd() {
        this.queue.shift()
        this.play()
            .catch((error) => {
                console.error(error);
                this.queue.length = 0;
                this.leave();
            })
    }

    static onClean(param) {
        //console.error(param instanceof Error || param instanceof Object ? param : `Disconnected Node: ${param}`);
        this.queue.length = 0;
        this.leave();
    }
}

class IchigoDispatcher {
    constructor(options) {

        this.client = options.client;
        this.guild = options.guild;
        this.text = options.text;
        this.player = options.player;
        this.queue = [];
        this.current = null;

        this.onEnd = EventHandlers.onEnd.bind(this);
        this.onClean = EventHandlers.onClean.bind(this);

        this.player.on('end', this.onEnd);
        this.player.on('closed', this.onClean);
        this.player.on('error', this.onClean);
        this.player.on('nodeDisconnect', this.onClean);
    }

    get exists() {
        return this.client.queue.has(this.guild.id);
    }
    play() {
        return new Promise((resolve, reject) => {
            if (!this.exists || !this.queue.length) return this.leave();
            this.current = this.queue[0]
            this.player.playTrack(this.current.track).then(() => {
                if (this.current.info.isStream) {
                    const embed = new MessageEmbed()
                        .setColor(this.client.embedColor)
                        .setTitle("Now playing")
                        .setDescription(`**[${this.current.info.title}](${this.current.info.uri}) [live]**`)
                    this.text.send(embed).catch(() => null);
                } else {
                    const embed = new MessageEmbed()
                        .setColor(this.client.embedColor)
                        .setTitle("Now playing")
                        .setDescription(`**[${this.current.info.title}](${this.current.info.uri}) [${moment(this.current.info.length - 3600000).format("H[h] m[m] s[s]")}]**`)
                    this.text.send(embed).catch(() => null);
                }
            });
        })
    }

    leave(log) {
        this.queue.length = 0;
        this.player.disconnect();
        this.client.queue.delete(this.guild.id);
        const embed = new MessageEmbed()
            .setColor(this.client.embedColor)
            .setDescription('**The queue has ended and I have left the voice channel**')
        this.text.send(embed).catch(() => null);
    }
}
module.exports = IchigoDispatcher;

// Full Credit to: (310853886191599616) Timo Aardappel#6163