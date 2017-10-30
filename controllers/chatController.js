const Chat = require("../models/chat")

//if summary functionality is needed, i need to add isRaw param in functions

module.exports = {

    get: function(params) {
        return new Promise(function(resolve, reject) {
            Chat.find(params, function( err, chats) {
                if(err) {
                    reject(err)
                    return
                }
                resolve(chats)
            })
        })
    },

    getById: function(id) {
        return new Promise(function(resolve, reject) {
            Chat.findById(id, function(err, chat) {
                if(err){
                    reject(err)
                    return
                }
                resolve(chat)
            })
        })
    },

    post: function(params) {
        return new Promise(function(resolve, reject) {
            Chat.create(params, function(err, chat) {
                if(err){
                    reject(err)
                    return
                }
                resolve(chat)
            })
        })
    },

    updateById: function(id, params, options) {
        return new Promise(function(resolve, reject) {
            Chat.findByIdAndUpdate(id, params, options, function(err, chat) {
                if(err){
                    reject(err)
                    return
                }
                resolve(chat)
            })
        })
    },

    //options here need to be {upsert: true}
    //the params need to be {$set: {key: val}}
    //the filter was {_id: chatId}
    update: function(filter, params, options) {
        return new Promise(function(resolve, reject) {
            Chat.findOneAndUpdate(filter, params, options, function(err, chat) {
                if(err){
                    reject(err)
                    return
                }
                resolve(chat)
            })
        })
    }

}
