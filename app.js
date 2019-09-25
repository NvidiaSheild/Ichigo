const discord = require('discord.js');
const settings = require('./settings');
const fs = require('fs');
const app = require('express')();
const ShardingManager = new discord.ShardingManager('./ichigo.js', options = {
    totalShards: 2,
    respawn: true,
    token: settings.token
})
const request = require('request')
ShardingManager.spawn()

app.get('/', (req, res) => {
    res.status(403).send("Not allowed here.")
})

app.get('/shards', (req, res) => {
    let shards = {}
    shardids = ShardingManager.shards.map(s => s.id)
    ShardingManager.fetchClientValues('guilds.size').then(shardguilds => {
        shardids.forEach((id, val) => {
            shards[id] = { "guilds": shardguilds[id] };
        })
        res.header({ "Content-Type": "application/json" })
        res.status(200).send(shards)
    })

})

app.get('/commands', (req, res) => {
    let commands = {}
    files = fs.readdirSync(`${process.cwd()}/commands/`)
    files.forEach(file => {
        let cmd = require(`./commands/${file}`).info
        commands[file.split(".")[0]] = {
            name: cmd.name,
            desc: cmd.description,
            example: cmd.example,
            type: cmd.type
        }
        delete require.cache[require.resolve(`./commands/${file}`)]
    });
    res.header({ "Content-Type": "application/json" }).status(200).send(commands)
})

app.listen(17002, () => {
    console.log("Ichigo Web API running.")
})

