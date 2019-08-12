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
    if (!msg.guild) {
        if (msg.author.bot) {
            client.logs.debug(`${msg.author.tag} responds to other bots, in dms`)
        }
    };
    if (!msg.guild.member(client.user.id).permissions.has("SEND_MESSAGES")) return;
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

    client.shard.fetchClientValues('guilds.size').then(shardguilds => {
        let shards = [];
        shardguilds.map(s => shards.push(s))
        request.post('https://discordbots.org/api/bots/575977933492191232/stats', {
            body: {
                "shards": shards
            },
            json: true,
            headers: {
                "Authorization": settings.dbl_token
            }
        }, (err, res, body) => {
            if (res.statusCode == 200) {
                client.logs.debug(`DBL Post Successful [${shards} Guilds, ${client.shard.count} Shards]`)
            } else {
                client.logs.error("Issue with DBL POST:\n")
            }
        })
    })

    setInterval(() => {
        client.shard.fetchClientValues('guilds.size').then(shardguilds => {
            let shards = [];
            shardguilds.map(s => shards.push(s))
            request.post('https://discordbots.org/api/bots/575977933492191232/stats', {
                body: {
                    "shards": shards
                },
                json: true,
                headers: {
                    "Authorization": settings.dbl_token
                }
            }, (err, res, body) => {
                if (res.statusCode == 200) {
                    client.logs.debug(`DBL Post Successful [${shards} Guilds, ${client.shard.count} Shards]`)
                } else {
                    client.logs.error("Issue with DBL POST:\n")
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
    if(err.name == "ECONNRESET") return client.logs.debug("Ignoring 'Socket Hang up' error");
    client.logs.debug(err);
});

process.on('unhandledRejection', err => {
    if (err.name == "ECONNRESET") return client.logs.debug("Ignoring 'Socket Hang up' error");
    client.logs.debug(err)
});
process.on('uncaughtException', err => {
    if (err.name == "ECONNRESET") return client.logs.debug("Ignoring 'Socket Hang up' error");
    client.logs.debug(err)
})

client.login();