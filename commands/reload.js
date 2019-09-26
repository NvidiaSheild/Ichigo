const settings = require('../settings')
const discord = require('discord.js')

exports.reload = (command_to_reload) => {
    try {
        require.resolve(`${process.cwd()}/commands/${command_to_reload}.js`)
    } catch (e) {
        return e.message
    }
    return delete require.cache[require.resolve(`${process.cwd()}/commands/${command_to_reload}.js`)];
}

exports.run = (client, msg, args, server_settings) => {
    if (!settings.eval_users.includes(msg.author.id)) return;
        if(!args) return;
        let embed = new discord.MessageEmbed().setColor(0x7289da);
        let command_to_reload = args[0];
        let require_dir = process.cwd().replace("\\", "/").replace("\\", "/");
        client.shard.fetchClientValues("ws.shards").then(shard_ids => {
            try {
            shard_ids = shard_ids.map(sh => sh[0].id);
            client.shard.broadcastEval(`require("${require_dir}/commands/reload").reload("${command_to_reload}")`).then(results => {
                embed.setTitle(`Command [${command_to_reload}] reloaded`)
                let out_txt = shard_ids.forEach(shard => {
                    embed.addField(`[Shard ${shard}]`, `\`${results[shard]}\``, inline=true);
                });
                msg.channel.send(embed);
            })
        } catch (e) {
            client.logs.error(e)
            if (e.code == "MODULE_NOT_FOUND") {
                return msg.channel.send("That command doesn't exist")

            } else {
                reject(e)
            }
        }
    })
}

exports.info = {
    "name": "reload",
    "type": "owner",
    "description": "reload a command on the bot."
}