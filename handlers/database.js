let request = require('request');
const settings = require('../settings');
let couch = require('nano')(`http://${settings.couch_user}:${settings.couch_pass}@192.168.0.250:5984`);

function extend(obj, src) {
    Object.keys(src).forEach(function (key) { obj[key] = src[key]; });
    return obj;
}
let server_database = couch.use(`server_settings_${settings.database}`);
let user_settings = couch.use(`user_settings`);
let user_votes = couch.use(`user_votes`);
let guild_user_levels = couch.use(`guild_user_levels`);


/**
 * @param id server id
 */
exports.getServer = (id) => {
    return new Promise((resolve, reject) => {
        server_database.get(id).then(res => {
            resolve(res)
        }).catch(e => {
            if (e.message == "missing" || e.message == "deleted") {
                let data = {
                    "prefix": settings.default_prefix
                }
                server_database.insert(data, id);
                resolve(data)
            } else {
                console.log(e)
            }
        })
    })
}

/**
 * @param id server id
 * @param new_data data to be pushed to the database
 */
exports.updateServer = (id, new_data) => {
    return new Promise((resolve, reject) => {
        server_database.get(id).then(response => {
            let _rev = response['_rev']
            let obj = response
            delete obj['_rev']
            delete obj['_id']
            let insert = extend(obj, new_data)
            insert['_rev'] = _rev
            insert['_rev'] = response['_rev']
            server_database.insert(insert, id).catch(err => console.log(err));
            resolve(insert)
        }).catch(err => {
            if (err.message == "missing" || err.message == "deleted") {
                let data = extend(new_data, {
                    "prefix": settings.default_prefix
                })
                server_database.insert(data, id);
                resolve(data)
            } else {
                console.log(err)
            }
        })
    })
}

exports.get_user_votes = (id) => {
    return new Promise((resolve, reject) => {
        this.server_data = {}
        user_votes.get(id).then(res => {
            resolve(res)
        })
    })
}

exports.update_user = (id, new_data) => {
    return new Promise((resolve, reject) => {
        user_settings.get(id).then(response => {
            let { _rev, _id } = response;
            let obj = response;
            delete obj._rev;
            delete obj._id;
            let insert = extend(obj, new_data);
            insert['_rev'] = _rev;
            insert['_id'] = _id;
            user_settings.insert(insert, id).catch(err => {
                if (err.message == "missing" || err.message == "deleted") {
                    user_settings.insert({}, id).catch()
                    this.update_user(id, new_data).catch();
                } else {
                    return reject(err.message)
                }
            });
        }).catch(err => {
            if (err.message == "missing" || err.message == "deleted") {
                user_settings.insert({}, id).catch()
                this.update_user(id, new_data).catch();
            } else {
                return reject(err.message)
            }
        })
    })
}


exports.get_user = (id) => {
    return new Promise((resolve, reject) => {
        user_settings.get(id).then(response => {
            resolve(response);
        }).catch(err => {
            if (err.message == "missing" || err.message == "deleted") {
                user_settings.insert({}, id).then(out => {
                    let { rev, id } = out
                    let insert = {
                        _rev: rev,
                        _id: id
                    }
                    resolve(insert);
                }).catch(err => console.log(err));;
            } else {
                return resolve(err.message)
            }
        })
    })
}


exports.user_has_voted = (id) => {
    return new Promise((resolve, reject) => {
        let now = Math.floor(Date.now() / 1000)
        user_votes.get(id).then(user_stats => {
            if ((now - parseInt(user_stats['last_voted'])) < 43200) {
                resolve(true);
            } else {
                resolve(false);
            }
        })
    }).catch(() => {
        resolve(false);
    })
}

/**
 * ADD USER:
 * /server/:id/adduser/:userid
 * 
 * EDIT USER:
 * /server/:id/edituser/:userid
 * 
 * GET USER:
 * /server/:id/user/:userid
 * 
 */

exports.get_user_from_guild = (user_id, guild_id) => {
    return new Promise((resolve, reject) => {
        guild_user_levels.get(guild_id).then(response => {
            let server_data = response;
            if (server_data[user_id]) {
                resolve(server_data[user_id]);
            } else {
                resolve({});
            }
        }).catch(err => {
            if (err.message == "missing" || err.message == "deleted") {
                guild_user_levels.insert({}, guild_id).catch();
                resolve({});
            } else {
                return resolve(err.message)
            }
        })
    })
};

exports.edit_user_on_guild = (user_id, guild_id, new_data) => {
    return new Promise((resolve, reject) => {
        guild_user_levels.get(guild_id).then(response => {
            let server_data = response;
            server_data[user_id] = new_data;
            guild_user_levels.insert(server_data, guild_id);
        }).catch(err => {
            if (err.message == "missing" || err.message == "deleted") {
                guild_user_levels.insert({}, guild_id);
                resolve({});
            } else {
                return resolve(err.message)
            }
        })
    })
};