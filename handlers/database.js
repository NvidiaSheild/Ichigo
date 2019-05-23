let request = require('request');
const settings = require('../settings');

/**
 * @param id server id
 */
exports.getServer = (id) => {
    return new Promise((resolve, reject) => {
        request.get(`http://192.168.0.250:9090/server/${id}`, (err, res, body) => {
            if (err) {
                reject(err);
            } else if (res.statusCode == 404 || res.statusCode == 500) {
                request.post(`http://192.168.0.250:9090/server/add/${id}`, {
                    headers: {
                        "authorization": settings.token
                    }
                });
                exports.getServer(id).then(out => {
                    resolve(out)
                }).catch(err => reject(err))
            } else if (res.statusCode == 200) {
                resolve(body);
            }
        });
    })
}

/**
 * @param id server id
 * @param new_data data to be pushed to the database
 */
exports.updateServer = (id, new_data) => {
    return new Promise((resolve, reject) => {
        this.server_data = {}
        request.post(`http://192.168.0.250:9090/server/edit/${id}`, {
                json: new_data,
                headers: {
                "authorization": settings.token
            }
        }, (err, res, body) => {
            if (res.statusCode == 404) {
                reject(Error("Server doesnt exist."))
            } else if (res.statusCode == 200) {
                resolve(body)
            }
        });
    })
}

exports.get_user_votes = (id) => {
    return new Promise((resolve, reject) => {
        this.server_data = {}
        request.get(`http://192.168.0.250:8080/stats/${id}`, (err, res, body) => {
            if (res.statusCode == 404) {
                reject(Error("User doesnt exist."))
            } else if (res.statusCode == 200) {
                resolve(body)
            }
        });
    })
}


exports.user_has_voted = (id) => {
    return new Promise((resolve, reject) => {
        this.server_data = {}
        request.get(`http://192.168.0.250:8080/hasVoted/${id}`, (err, res, body) => {
            if (res.statusCode == 404) {
                resolve("false")
            } else if (res.statusCode == 200) {
                resolve(body)
            }
        });
    })
}