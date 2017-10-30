const User = require("../models/user")

//find and create methods for user

module.exports = {
    get: function(params) {
        return new Promise(function(resolve, reject) {
            User.find(params, function(err, user) {
                if(err) {
                    reject(err)
                }
                resolve(user)
            })
        })
    },

    post: function(params) {
        return new Promise(function(resolve, reject) {
            User.create(params, function(err, user) {
                if(err){
                    reject(err)
                    return
                }
                resolve(user)
            })
        })
    },

    updateById: function(id, params, options) {
        return new Promise(function(resolve, reject) {
            User.findByIdAndUpdate(id, params, options, function(err, user) {
                if(err){
                    reject(err)
                    return
                }
                resolve(user)
            })
        })
    },


    //filter {userId: sender}
    //options same as chat
    update: function(filter, params, options) {
        return new Promise(function(resolve, reject) {
            User.findOneAndUpdate(filter, params, options, function(err, user) {
                if(err){
                    reject(err)
                    return
                }
                resolve(user)
            })
        })
    }

}
