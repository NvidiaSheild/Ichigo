let settings = require('../settings')
let database = require('../handlers/database')

exports.run = (client, msg, args, server_settings) => {
    if(!settings.eval_users.includes(msg.author.id)) return;
    if(args.length == 0) return msg.channel.send({
        embed: {
            title: "Error",
            description: "Please provide a user to blacklist.",
            color: 0x7289da
        }
    })
    let id = args[0].replace(/[<@!>]+/gm, "")
    let user_obj = client.users.get(id);
    let reason = args.splice(1).join(" ")
    if(reason == "") { reason = "No reason specified" }
    if(!user_obj) return msg.channel.send({
        embed: {
            title: "Error",
            description: "User not found.",
            color: 0x7289da
        }
    })
    database.is_blacklisted(id).then(out => {
        if (out.active) {
            return msg.channel.send({
                embed: {
                    title: "Error",
                    description: "User already blacklisted!",
                    color: 0x7289da
                }
            })
        } else {
            database.blacklist_user(id, reason).then(out => {
                let embed = {
                    embed: {
                        title: "User blacklisted",
                        description: `User \`${user_obj.tag}\` has been blacklisted for: \`${reason}\``,
                        color: 0x7289da
                    }
                }
                client.guilds.get("556013291378442240").channels.get("626781617163075614").send(embed)
                msg.channel.send(embed)
            }).catch()
        }
    })

}

exports.info = {
  "name": "blacklist",
  "type": "owner",
  "description": "Blacklist a user from the bot."
}