exports.run = (client, msg, args, server_settings) => {
    let shards = client.ws.shards
    let ping = (shards.get(msg.guild.shard.id).pings.reduce((previous, current) => current += previous)) / shards.get(msg.guild.shard.id).pings.length;;
    return msg.channel.send(`[Shard ${msg.guild.shard.id}] Ping! \`${Math.round(ping)}ms\``);
}

exports.info = {
    "name": "ping",
    "type": "basic",
    "description": "get the ping of the current shard.",
    "example": "ping"
}