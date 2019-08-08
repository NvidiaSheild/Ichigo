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
            output.push({ "shard": shard_id, "message": `\`\`\`prolog
            CURRENT: ${(client.shard.id == shard_id).toString().toUpperCase()}\n
            GUILDS: ${guild_sizes[shard_id]}
            RAM: ${memusagemb[shard_id]}MBs
            UPTIME: ${secondsToDhms(uptimes[shard_id])}\`\`\`` });
        });
        resolve(output);
    });
};

exports.run = (client, msg) => {
    client.shard.fetchClientValues('shard.id').then(shard_ids => {
        client.shard.fetchClientValues('guilds.size').then(guild_sizes => {
            client.shard.broadcastEval('process.memoryUsage()').then(memusage => {
                client.shard.broadcastEval('Math.floor(process.uptime())').then(uptimes => {
                    memusagemb = memusage.map(mem => (mem.heapUsed / (1024 * 1024)).toFixed(1))
                    generate_message(client, shard_ids, guild_sizes, memusagemb, uptimes, 2).then(output => {
                        let embed = new discord.RichEmbed().setColor('#7289da')
                        let mem = memstat.allStats('MiB')
                        let cpu = cpustat.usagePercent({sampleMs: 200}, (err, percent, seconds) => {
                            output.map(shard => {
                                embed.addField(`[Shard ${shard.shard}] Statistics:`, shard.message, inline = false)
                            });
                            embed.addField("System Information:", `
                            **System CPU Usage**:   ${Math.round(percent)}%
                            **System RAM Usage**:   ${Math.round(mem.total - mem.free)}MB (${Math.round(mem.usedPercent)}%) / ${Math.round(mem.total)}MB (100%)
                            **System Uptime**:      ${ secondsToDhms(os.uptime())}
                            `)
                            return msg.channel.send({ embed })
                        });
                    }).catch();
                }).catch();
            }).catch();
        }).catch();
    }).catch();
};

exports.info = {
    "name": "status",
    "type": "basic",
    "description": "gives the shard statuses of the bot.",
    "example": "status"
}