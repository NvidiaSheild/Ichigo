const discord = require('discord.js');
const request = require('request');
const database = require('./handlers/database');
const message_handler = require('./handlers/message');
const levelling_handler = require('./handlers/levelling');
const load_all_commands = require('./handlers/command').load_all;
const auto_role = require('./handlers/auto_role');
const settings = require('./settings.js');
const client = new discord.Client();
const log = require('color-logs')(true, true, "Ichigo");

client.logs = log

String.prototype.capitalize = function () {
    return this.charAt(0).toUpperCase() + this.slice(1);
}

client.on('message', (msg) => {
    if (msg.author.bot) return;
    if (!msg.guild) return;
    database.getServer(msg.guild.id).then(server_settings => {
        server_settings = JSON.parse(server_settings)
        if (!server_settings.prefix) {
            database.updateServer(msg.guild.id, { "prefix": settings.default_prefix }).then(server_settings => {
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
    setTimeout(() => {
        levelling_handler.handle_guild(msg, msg.guild, msg.author)
        levelling_handler.handle_global(msg.guild, msg.author)
    }, 200)
})

client.on('ready', () => {
    const dbl = require('discord-bot-list');
    const dblc = new dbl({ token: settings.dbl_token, id: "575977933492191232" })
    client.logs.info(`Shard ${client.shard.id} Ready`);
    client.options.disableEveryone = true
    load_all_commands(client)
    client.user.setStatus("online")
    client.logs.debug(`Shard ${client.shard.id} | Presence set`)
    client.user.setPresence({ game: { name: `${settings.default_prefix} help | Shard ${client.shard.id} [${client.guilds.size}]` } }).then().catch()
    setInterval(() => {
        client.user.setStatus("online")
        client.user.setPresence({ game: { name: `${settings.default_prefix} help | Shard ${client.shard.id} [${client.guilds.size}]` } }).then().catch()
    }, 15000);

    let guilds = 0;
    let shards = client.shard.count;
    client.shard.fetchClientValues('guilds.size').then(shardguilds => {
        shardguilds.map(g => guilds += g)
    }).then(() => {
        request.post('https://discordbots.org/api/bots/575977933492191232/stats', {
            form: {
                "server_count": guilds,
                "shard_count": shards
            },
            json: true,
            headers: {
                "Authorization": settings.dbl_token
            }
        }, (err, res, body) => {
            if (res.statusCode == 200) {
                client.logs.debug(`DBL Post Successful [${guilds} Guilds, ${shards} Shard]`)
            } else {
                client.logs.error("Issue with DBL POST")
            }
        })
    })

    setInterval(() => {
        let guilds = 0;
        client.shard.fetchClientValues('guilds.size').then(shardguilds => {
            shardguilds.map(g => guilds += g)
        }).then(() => {
            request.post('https://discordbots.org/api/bots/575977933492191232/stats', {
                form: {
                    "server_count": guilds,
                    "shard_count": shards
                },
                json: true,
                headers: {
                    "Authorization": settings.dbl_token
                }
            }, (err, res, body) => {
                if (res.statusCode == 200) {
                    client.logs.debug(`DBL Post Successful [${guilds} Guilds, ${shards} Shard]`)
                } else {
                    client.logs.error("Issue with DBL POST")
                }
            })
        })
    
    }, 600000);
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
    client.fetchWebhook("576013440150405140", "FzeavqiL0CHcshzTYif2PJOoaBnzToCZaS1wyiUf8YQiWX_h3iouPFna896vI1QzGccd").then(webhook => {
        webhook.send(`Ichigo just joined **${guild.name}** (${guild.memberCount} Members) [Shard ${client.shard.id} now in ${client.guilds.size} guilds]`)
    })
})

client.on('guildDelete', guild => {
    client.fetchWebhook("576013440150405140", "FzeavqiL0CHcshzTYif2PJOoaBnzToCZaS1wyiUf8YQiWX_h3iouPFna896vI1QzGccd").then(webhook => {
        webhook.send(`Ichigo just left **${guild.name}** (${guild.memberCount} Members) [Shard ${client.shard.id} now in ${client.guilds.size} guilds]`)
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

client.on('error', (err) => { return });

client.login();