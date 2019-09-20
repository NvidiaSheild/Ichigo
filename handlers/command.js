const fs = require('fs')

exports.fetch = (commandname) => {
    return new Promise((resolve, reject) => {
        try {
            let command = require(`${process.cwd()}/commands/${commandname}.js`)
            resolve(command)
        } catch (e) {
            if (e.code == "MODULE_NOT_FOUND")
                reject("Command not found");
            else {
                reject(e);
            }
        }
    })
}

exports.load_all = (client) => {
    files = fs.readdirSync(`${process.cwd()}/commands/`)
    files.forEach(file => {
        require(`../commands/${file}`)
    });
}