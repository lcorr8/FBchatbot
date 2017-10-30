const bodyParser = require("body-parser")
const request = require("request")
require("dotenv").config()

const FB_PAGE_TOKEN = process.env.FB_PAGE_TOKEN
if (!FB_PAGE_TOKEN) {
    throw new Error('missing FB_PAGE_TOKEN')
}

module.exports = {
    sendRequest: function(sender, messageData) {
        request({
            url: "https://graph.facebook.com/v2.6/me/messages",
            qs: {access_token: FB_PAGE_TOKEN},
            method: "POST",
            json: {
                recipient: {id: sender},
                message: messageData
            }
        }, function(error, response, body) {
            if(error) {
                console.log("sending error")
            } else if(response.body.error) {
                console.log(response.body.error)
                console.log("response body error")
            }
        })
    }
}
