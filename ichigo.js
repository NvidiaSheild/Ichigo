const discord = require('discord.js');
const cpustat = require('cpu-stat');
const memstat = require('mem-stat');
const request = require('request');
const os = require('os');
const database = require('./handlers/database');
const message_handler = require('./handlers/message');
const levelling_handler = require('./handlers/levelling');
const load_all_commands = require('./handlers/command').load_all;
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
    load_all_commands(client)
    //message id -> 610974296323522560
    updateStatus();
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

        return `${days_txt}D ${hrs_txt}H ${mins_txt}M ${secs_txt}S`;
    }
    let generate_message = (client, shard_ids, guild_sizes, memusagemb, uptimes, tab_size) => {
        return new Promise((resolve, reject) => {
            let output = [];
            shard_ids.forEach(shard_id => {
                output.push({
                    "shard": shard_id, "message": `\`\`\`prolog
CURRENT:  ${(client.shard.id == shard_id).toString().toUpperCase()}
GUILDS:   ${guild_sizes[shard_id]}
RAM:      ${memusagemb[shard_id]}MBs
UPTIME:   ${secondsToDhms(uptimes[shard_id])}\`\`\``
                })
            });
            resolve(output);
        });
    };
    function updateStatus() {
        client.shard.fetchClientValues('shard.id').then(shard_ids => {
            client.shard.fetchClientValues('guilds.size').then(guild_sizes => {
                client.shard.broadcastEval('process.memoryUsage()').then(memusage => {
                    client.shard.broadcastEval('Math.floor(process.uptime())').then(uptimes => {
                        memusagemb = memusage.map(mem => (mem.heapUsed / (1024 * 1024)).toFixed(1))
                        generate_message(client, shard_ids, guild_sizes, memusagemb, uptimes, 2).then(output => {
                            let embed = new discord.RichEmbed().setColor('#7289da')
                            let mem = memstat.allStats('MiB')
                            let cpu = cpustat.usagePercent({ sampleMs: 200 }, (err, percent, seconds) => {
                                output.map(shard => {
                                    embed.addField(`[Shard ${shard.shard}] Statistics:`, shard.message, inline = false)
                                });
                                embed.addField("System Information:", `\`\`\`xl
System CPU Usage: ${Math.round(percent)}%
System RAM Usage: ${Math.round(mem.total - mem.free)}MB (${Math.round(mem.usedPercent)}%) / ${Math.round(mem.total)}MB (100%)
System Uptime:    ${ secondsToDhms(os.uptime())}\`\`\``)
                                embed.addField("Time of status update:", Date())
                                return client.guilds.get('556013291378442240').channels.get('610294038704160798').fetchMessage('610974296323522560').then(m => m.edit({embed}));
                            });
                        }).catch();
                    }).catch();
                }).catch();
            }).catch();
        }).catch();
        setInterval(updateStatus, 15000)
    }

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