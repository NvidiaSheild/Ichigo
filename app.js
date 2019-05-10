const discord = require('discord.js');
const settings = require('./settings');
const app = require('express')();
const ShardingManager = new discord.ShardingManager('./ichigo.js', options={
    totalShards: 'auto',
    respawn: true,
    token: settings.token
})
ShardingManager.spawn()

app.get('/', (req, res) => {
    res.status(403).send("Not allowed here.")
})

app.get('/shards', (req, res) => {
    let shards={}
    ShardingManager.fetchClientValues('shard.id').then(shardids => {
        ShardingManager.fetchClientValues('guilds.size').then(shardguilds => {
            shardids.forEach(id => {
                shards[id] = {"guilds": shardguilds[id]};
            })
            res.header({"Content-Type":"application/json"})
            res.status(200).send(shards)
        })
    })
})

app.get('/shard/:shardid', (req, res) => {
    let shard_id_given = parseInt(req.params.shardid)
    ShardingManager.fetchClientValues('shard.id').then(shardids => {
        if(!shardids[shard_id_given]) return res.header({"Content-Type": "application/json"}).status(404).send({"message": "shard not found"})
        ShardingManager.fetchClientValues('guilds.size').then(shardguilds => {
            shardids.forEach(id => {
                shard = {"guilds": shardguilds[id]};
            })
            res.header({"Content-Type":"application/json"})
            res.status(200).send(shard)
        })
    })
})

app.listen(17002, () => {
    console.log("Ichigo Web API running.")
})