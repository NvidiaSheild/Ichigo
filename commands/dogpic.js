const request = require('request');
const discord = require('discord.js');


exports.run = (client, msg) => {
    request("https://random.dog/woof.json", {}, (err, resp, res) => {
        const embed = new discord.MessageEmbed()
        .setImage(JSON.parse(res).url)
        .setDescription(`[Image URL](${JSON.parse(res).url})`)
        .setFooter('http://www.random.dog ©', 'https://random.dog/3f62f2c1-e0cb-4077-8cd9-1ca76bfe98d5.jpg')
        .setColor('#71A3BE');
        return msg.channel.send({ embed });
    })
}

exports.info = {
    "name": "dogpic",
    "type": "basic",
    "description": "get picture of a dog",
    "example": "dogpic",
    "votelocked": true
}