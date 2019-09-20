const discord = require('discord.js');
const { Node } = require('lavalink');
const request = require('request');
const database = require('./handlers/database');
const message_handler = require('./handlers/message');
const levelling_handler = require('./handlers/levelling');
const load_all_commands = require('./handlers/command').loadAll;
const auto_role = require('./handlers/auto_role');
const settings = require('./settings.js');
const client = new discord.Client({
    "disableEveryone": true
});
const log = require('color-logs')(true, true, "Ichigo");

client.logs = log

String.prototype.capitalize = function () {
    return this.charAt(0).toUpperCase() + this.slice(1);
}

client.on('message', (msg) => {
    if (msg.author.bot) return;
    if (!msg.guild) return;
    if (!msg.guild.member(client.user.id).permissions.has("SEND_MESSAGES")) return;
    levelling_handler.handle_guild(msg, msg.guild, msg.author).then(done => {
        levelling_handler.handle_global(msg.guild, msg.author).then(done => {
            database.getServer(msg.guild.id).then(server_settings => {
                server_settings = server_settings;
                if (!server_settings.prefix) {
                    database.updateServer(msg.guild.id, { "prefix": settings.default_prefix }).finally(server_settings => {
                        message_handler.handle(client, msg, server_settings)
                    }).catch(err => {
                        client.logs.error(err)
                    })
                } else {
                    message_handler.handle(client, msg, server_settings)
                }
            }).catch(err => {
                client.logs.error(err)
            });
        }).catch(e => console.log(e))
    }).catch(e => console.log(e))


})

client.on('ready', () => {
    client.logs.info(`Shard ${client.shard.id} Ready`);
    load_all_commands(client)

    setBotPresence();
    function setBotPresence() {
        client.user.setPresence({
            "game": {
                "name": `${settings.default_prefix} help | Shard ${client.shard.id} [${client.guilds.size}]`
            }
        }).finally(() => {
            setTimeout(setBotPresence, 15000);
        });
    }

    postDblStats();
    function postDblStats() {
        client.shard.fetchClientValues('guilds.size').then(results => {
            let serverCount = results.reduce((prev, val) => prev + val, 0);
            request.post('https://discordbots.org/api/bots/575977933492191232/stats', {
                body: {
                    "shard_count": client.shard.count,
                    "server_count": serverCount
                },
                json: true,
                headers: {
                    "Authorization": settings.dbl_token
                }
            }, (err, res) => {
                if (res.statusCode == 200) {
                    client.logs.debug(`DBL Post Successful [${serverCount} Guilds, ${client.shard.count} Shards]`)
                } else {
                    client.logs.error("Issue with DBL POST.")
                }
                setTimeout(postDblStats, 600000);
            });
        });
    }

});

client.on('guildCreate', (guild) => {
    database.getServer(guild.id).then(data => {
        if (data == "{}" || data == {}) {
            database.updateServer(guild.id, { "prefix": settings.default_prefix }).then(server_settings => {
                client.logs.debug(`${guild.name} added to database`)
            }).catch(err => {
                client.logs.error(err)
            })
        }
    })
    let bots = 0;
    let users = 0;
    guild.members.map(u => {
        if (u.user.bot) {
            bots++
        } else {
            users++
        }
    })
    let embed = new discord.RichEmbed()
        .setThumbnail(guild.iconURL)
        .addField(`Joined Guild:`, `${guild.name}`)
        .addField(`Total Members:`, `${guild.memberCount} Members (${bots} Bots) (${users} Humans)`)
        .addField(`Shard ${client.shard.id}:`, `Currently in ${client.guilds.size}`)
        .setColor('#7289da')
    client.fetchWebhook("576013440150405140", "FzeavqiL0CHcshzTYif2PJOoaBnzToCZaS1wyiUf8YQiWX_h3iouPFna896vI1QzGccd").then(webhook => {
        webhook.send(embed = embed)
    })
    client.fetchWebhook("610042274474229760", "8EJ-FMvlXT48ZwdYeVskraULxTHgQRNKlrtkYOpflcAsWoyrtl___uDNTK7xmQK-TiiY").then(webhook => {
        webhook.send(embed = embed)
    })
})

client.on('guildDelete', guild => {
    let bots = 0;
    let users = 0;
    guild.members.map(u => {
        if (u.user.bot) {
            bots++
        } else {
            users++
        }
    })
    let embed = new discord.RichEmbed()
        .setThumbnail(guild.iconURL)
        .addField(`Left Guild:`, `${guild.name}`)
        .addField(`Total Members:`, `${guild.memberCount} Members (${bots} Bots) (${users} Humans)`)
        .addField(`Shard ${client.shard.id}:`, `Currently in ${client.guilds.size}`)
        .setColor('#7289da')
    client.fetchWebhook("576013440150405140", "FzeavqiL0CHcshzTYif2PJOoaBnzToCZaS1wyiUf8YQiWX_h3iouPFna896vI1QzGccd").then(webhook => {
        webhook.send(embed = embed)
    })
    client.fetchWebhook("610042274474229760", "8EJ-FMvlXT48ZwdYeVskraULxTHgQRNKlrtkYOpflcAsWoyrtl___uDNTK7xmQK-TiiY").then(webhook => {
        webhook.send(embed = embed)
    })
})

client.on('disconnect', () => {
    client.logs.info(`Shard ${client.shard.id} Disconnected`);
});

client.on('reconnecting', () => {
    client.logs.info(`Shard ${client.shard.id} Reconnecting...`);
});

client.on('resume', () => {
    client.logs.info(`Shard ${client.shard.id} Connected`);
});

client.on('guildMemberAdd', member => {
    auto_role.handle(member.user.bot, member.guild, member, client)
})


/**
 * 
 * Handing all User Based events here
 * 
 */

client.on('userUpdate', (user_before, user) => {
    if (user.bot) return;
    user_obj = {
        username: user.username,
        discrim: user.discriminator,
        avatar: user.avatar
    }
    database.get_user(user.id, user_obj).then(user_data => {
        database.update_user(user.id, user_obj)
    }).catch()
})

/**
 * 
 * End Section
 * 
 */

client.on('error', (err) => {
    if (err.name == "ECONNRESET") return client.logs.debug("Ignoring 'Socket Hang up' error");
    else return;
    // client.logs.debug(err.stack);
});

process.on('unhandledRejection', err => {
    if (err.name == "ECONNRESET") return client.logs.debug("Ignoring 'Socket Hang up' error");
    else return;
    // client.logs.debug(err.stack);
});
process.on('uncaughtException', err => {
    if (err.name == "ECONNRESET") return client.logs.debug("Ignoring 'Socket Hang up' error");
    else return;
    // client.logs.debug(err.stack);
})

client.voice = new Node({
    password: settings.LLPass, // your Lavalink password
    userID: '575977933492191232', // the user ID of your bot
    host: 'ws://' + settings.LLHost,
    send(guildID, packet) {
        if (client.guilds.has(guildID)) return client.ws.send(packet);
        throw new Error('attempted to send a packet on the wrong shard');
    }
});

client.on('raw', pk => {
    if (pk.t === 'VOICE_STATE_UPDATE') client.voice.voiceStateUpdate(pk.d);
    if (pk.t === 'VOICE_SERVER_UPDATE') client.voice.voiceServerUpdate(pk.d);
});

client.login();