const discord = require('discord.js')

let generate_message = (client, shard_ids, guild_sizes, memusagemb, uptimes, tab_size) => {
    return new Promise((resolve, reject) => {
        let output = [];
        shard_ids.forEach(shard_id => {
            function secondsToDhms(d) {
                d = Number(d);
                var days = Math.floor(d / 86400);
                var hrs = Math.floor(d / 3600);
                var mins = Math.floor(d % 3600 / 60);
                var secs = Math.floor(d % 60);
                var days_txt = days.toString().padStart(2, "0")
                var hrs_txt = hrs.toString().padStart(2, "0")
                var mins_txt = mins.toString().padStart(2, "0");
                var secs_txt = secs.toString().padStart(2, "0");

                return `${days_txt}D ${hrs_txt}H ${mins_txt}M ${secs_txt}S`;
            }
            if (client.shard.id == shard_id) {
                output.push(`> [Shard ${shard_id}]${" ".repeat(tab_size)}| GUILDS: ${guild_sizes[shard_id]} | RAM: ${memusagemb[shard_id]}MBs | UPTIME: ${secondsToDhms(uptimes[shard_id])}`);
            } else {
                output.push(`  [Shard ${shard_id}]${" ".repeat(tab_size)}| GUILDS: ${guild_sizes[shard_id]} | RAM: ${memusagemb[shard_id]}MBs | UPTIME: ${secondsToDhms(uptimes[shard_id])}`);
            }
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
                        let text = "";
                        let out_txt = output.forEach(shardstat => {
                            text += shardstat + "\n";
                        });
                        return msg.channel.send(text, {code: 'prolog'})
                    });
                });
            });
        });
    });
};

exports.info = {
    "name": "status",
    "type": "basic",
    "description": "gives the shard statuses of the bot."
}