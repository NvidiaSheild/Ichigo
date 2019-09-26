const discord = require('discord.js');
const cpustat = require('cpu-stat');
const memstat = require('mem-stat');
const os = require('os');

function secondsToDhms(d) {
    d = Number(d);
    var days = Math.floor(d / 86400);
    var hrs = Math.floor((d / 3600) % 24);
    var mins = Math.floor(d % 3600 / 60);
    var secs = Math.floor(d % 60);
    var days_txt = days ? days.toString().padStart(2, "0") : undefined
    var hrs_txt = hrs ? hrs.toString().padStart(2, "0") : undefined
    var mins_txt = mins.toString().padStart(2, "0")
    var secs_txt = secs.toString().padStart(2, "0")

    if (days) {
        return `${days_txt}D ${hrs_txt}H ${mins_txt}M ${secs_txt}S`;
    } else if (hrs) {
        return `${hrs_txt}H ${mins_txt}M ${secs_txt}S`;
    } else {
        return `${mins_txt}M ${secs_txt}S`;
    }

}

let generate_message = (msg, client, shard_ids, guild_sizes, memusagemb, uptimes, players) => {
    return new Promise((resolve, reject) => {
        let output = [];
        shard_ids.forEach(shard_id => {
            output.push({
                "shard": shard_id, "message": `\`\`\`prolog
CURRENT:  ${(msg.guild.shard.id == shard_id).toString().toUpperCase()}
GUILDS:   ${guild_sizes[shard_id]}
RAM:      ${memusagemb[shard_id]}MBs
UPTIME:   ${secondsToDhms(uptimes[shard_id])}
PLAYERS:  ${players[shard_id]} \`\`\``
            })
        });
        resolve(output);
    });
};

exports.run = (client, msg) => {
    client.shard.fetchClientValues("ws.shards").then(shard_ids => {
        shard_ids = shard_ids.map(sh => sh[0].id);
        client.shard.fetchClientValues('queue.size').then(players => {
            client.shard.fetchClientValues('guilds.size').then(guild_sizes => {
                client.shard.broadcastEval('process.memoryUsage()').then(memusage => {
                    client.shard.broadcastEval('Math.floor(process.uptime())').then(uptimes => {
                        memusagemb = memusage.map(mem => (mem.heapUsed / (1024 * 1024)).toFixed(1))
                        generate_message(msg, client, shard_ids, guild_sizes, memusagemb, uptimes, players).then(output => {
                            let lavalinkstats = client.Carrier.getNode().stats
                            let reservableMb = Math.round(lavalinkstats.memory.reservable/1024/1024)
                            let allocatedMb = Math.round(lavalinkstats.memory.allocated/1024/1024)
                            let freeMb = Math.round(lavalinkstats.memory.free/1024/1024)
                            let usedMb = Math.round(lavalinkstats.memory.used/1024/1024)
                            let embed = new discord.MessageEmbed().setColor('#7289da')
                            let mem = memstat.allStats('MiB')
                            let cpu = cpustat.usagePercent({ sampleMs: 200 }, (err, percent, seconds) => {
                                output.map(shard => {
                                    embed.addField(`[Shard ${shard.shard}] Statistics:`, shard.message, inline = false)
                                });
                                embed.addField("System Information:", `\`\`\`xl
System CPU Usage: ${Math.round(percent)}%
System RAM Usage: ${Math.round(mem.total - mem.free)}MB (${Math.round(mem.usedPercent)}%) / ${Math.round(mem.total)}MB (100%)
System Uptime:    ${ secondsToDhms(os.uptime())}\`\`\``)
                                embed.addField("LavaLink Information:", `\`\`\`xl
LavaLink Uptime: ${secondsToDhms(lavalinkstats.uptime / 1000)}
LavaLink Used Ram: ${(usedMb + freeMb + allocatedMb)}MB
LavaLink Usable Ram: ${reservableMb}MB
LavaLink Current Streams: ${lavalinkstats.players} 
\`\`\``)
                                return msg.channel.send({ embed })
                            });
                        }).catch();
                    }).catch();
                }).catch();
            }).catch();
        }).catch()
    }).catch()
};

exports.info = {
    "name": "status",
    "type": "basic",
    "description": "gives the shard statuses of the bot.",
    "example": "status"
}