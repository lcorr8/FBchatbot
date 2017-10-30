const fbSend = require("../utils/sendRequestFb")


module.exports = {

    sendButtons: (sender, params) => {
        let messageData = {
            attachment: {
                type: "template",
                payload: {
                    template_type: "button",
                    text: params.text,
                    buttons: [
                        {
                            type: "web_url",
                            url: params.url1,
                            title: params.title1
                        },
                        {
                            type: "web_url",
                            url: params.url2,
                            title: params.title2
                        }
                    ]
                }
            }
        }
        fbSend.sendRequest(sender, messageData)
    },

    sendText: (sender, text) => {
        console.log("sendMessage fb controller")
        let messageData = {text: text}
        fbSend.sendRequest(sender, messageData)
    },

    sendButtonMessage: (sender, text) => {
        console.log("I am in fb controller ButtonMessage")
        let messageData = {
            attachment: {
                type: "template",
                payload: {
                    template_type: "button",
                    text: text,
                    buttons: [
                        {
                            type: "postback",
                            title: "Strom",
                            payload: "strom"
                        },
                        {
                            type: "postback",
                            title: "Gas",
                            payload: "gas"
                        }
                    ]
                }
            }
        }
        fbSend.sendRequest(sender, messageData)
    },

    sendGenericMessage: (sender) => {
        let messageData = {
            attachment: {
                type: "template",
                payload: {
                    "template_type": "generic",
                    elements: [
                        {
                            title: "Winter",
                            "image_url": "https://encrypted-tbn2.gstatic.com/images?q=tbn:ANd9GcQpNLFmGvKiS334qSOItcbPy3mSKicFC5ksbdERrGLsRM-vkmar",
                            subtitle: "I love Winter!",
                            buttons: [
                                {
                                    type: "web_url",
                                    url: "https://de.wikipedia.org/wiki/Winter",
                                    title: "More about winter"
                                }
                            ]
                        }
                    ]
                }
            }
        }
        fbSend.sendRequest(sender, messageData)
    },

    sendImageMessage: (sender) => {
        let messageData = {
            attachment: {
                type: "image",
                payload: {
                    url: "https://encrypted-tbn3.gstatic.com/images?q=tbn:ANd9GcQU-lOcrxtqSrvvhgQXM4YBdjT37ff1Wqqw3VvPq2NGPlmf6y7E"
                }
            }
        }
        fbSend.sendRequest(sender, messageData)
    },

    sendListCompact: (sender, params) => {
        let messageData = {
            attachment: {
                type: "template",
                payload: {
                    template_type: "list",
                    top_element_style: "compact",
                    elements: [
                        {
                            title: "Classic White T-Shirt",
                            subtitle: "100% Cotton, 200% Comfortable",
                            "image_url": "http://res.cloudinary.com/ddwi8wf1w/image/upload/v1494497070/menu_logo_zsdrxt.png"

                        },
                        {
                            title: "Classic Blue T-Shirt",
                            subtitle: "100% Cotton, 200% Comfortable"
                        }
                    ],
                     buttons: [
                        {
                            title: "View More",
                            type: "postback",
                            payload: "payload"
                        }
                    ]
                }
            }

        }

        fbSend.sendRequest(sender, messageData)
    }



}
