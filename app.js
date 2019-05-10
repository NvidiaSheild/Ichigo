const discord = require('discord.js');
const settings = require('./settings');
const Shards = new discord.ShardingManager('./ichigo.js', options={
    totalShards: 'auto',
    respawn: true,
    token: settings.token
})
Shards.spawn()