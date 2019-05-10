const discord = require('discord.js');
const settings = require('./settings');
const fs = require('fs');
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

app.get('/commands', (req, res) => {
    let commands = {}
    files = fs.readdirSync(`${process.cwd()}/commands/`)
    files.forEach(file => {
        let cmd = require(`../commands/${file}`).info
        commands[file.split(".")[0]] = {
            name: cmd.name,
            desc: cmd.description,
            example: cmd.example,
            type: cmd.type
        }
    });
    res.header({"Content-Type": "application/json"}).status(200).send(commands)
})

app.listen(17002, () => {
    console.log("Ichigo Web API running.")
})