let MessageEmbed = require('discord.js').MessageEmbed

function secondsToYmdhms(d) {
    d = Number(d);
    let years = Math.floor(d / 31556952);  
    let months = Math.floor((d / 2592000) % 12);  
    let days = Math.floor((d / 86400) % 7);
    let hrs = Math.floor((d / 3600) % 24);
    let mins = Math.floor(d % 3600 / 60);
    let secs = Math.floor(d % 60);
    let years_txt = years.toString()
    let months_txt = months.toString().padStart(2, "0")
    let days_txt = days.toString().padStart(2, "0")
    let hrs_txt = hrs.toString().padStart(2, "0")
    let mins_txt = mins.toString().padStart(2, "0");
    let secs_txt = secs.toString().padStart(2, "0");

    return `${years_txt} Year(s), ${months_txt} Month(s), ${days_txt} Day(s),\n${hrs_txt} Hour(s), ${mins_txt} Min(s), ${secs_txt} Second(s)`;
}

exports.run  = (client, msg, args) => {
    let id = "";
    if(!args[0]) {
        id = msg.author.id
    } else {
        id = args[0].replace(/[<@!>]+/g, "");
    }
    client.fetchUser(id).then(user => {
        let embed = new MessageEmbed()
        .setThumbnail(msg.author.avatarURL)
        .addField("User Information:", `
**Username**: \`${user.username}\`
**Descriminator**: \`${user.discriminator}\`

**Account Created**: \`${user.createdAt.toGMTString()}\`
**Account Created (Time)**: 
${secondsToYmdhms(((Date.now() - user.createdAt) / 1000))}
`)
        msg.channel.send({embed})
    }).catch(()=> {
        msg.channel.send("User not found")
    })
}

exports.info = {
    "name": "userinfo",
    "description": "get user infomation",
    "example": "userinfo [id]",
    "type": "basic",
    "votelocked": false 
}