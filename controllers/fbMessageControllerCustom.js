const fbSend = require("../utils/sendRequestFb")


module.exports = {
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
                            default_action: {
                                type: "web_url",
                                url: "https://peterssendreceiveapp.ngrok.io/shop_collection",
                                messenger_extensions: true,
                                webview_height_ratio: "tall",
                                "fallback_url": "https://peterssendreceiveapp.ngrok.io/"
                            }

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
    },


    sendConsumption: (sender) => {
        let messageData = {
            text: "Wie groß ist dein Haushalt",
            quick_replies: [
                {
                    content_type: "text",
                    title: "1 Person",
                    payload: "tests tests tetst"
                },
                {
                    content_type: "text",
                    title: "2 Personen",
                    payload: "HH_CONSUMPTION_1_"
                },
                {
                    content_type: "text",
                    title: "3 Personen",
                    payload: "HH_CONSUMPTION_3_"
                },
                {
                    content_type: "text",
                    title: "4 Personen",
                    payload: "HH_CONSUMPTION_4_"
                }
            ]
        }
        fbSend.sendRequest(sender, messageData)
    },
    sendMenuList: (sender) => {
        let messageData = {
            attachment: {
                type: "template",
                payload: {
                    template_type: "list",
                    top_element_style: "large",
                    elements: [
                        {
                            title: "chatt dich watt",
                            image_url: "http://res.cloudinary.com/ddwi8wf1w/image/upload/v1494588808/logo_2_qckywk.png",
                            subtitle: "? öffnet das Menü ---  ! hilft dir wenn du verwirrt bist"

                        },
                        {
                            title: "Stromtarife",
                            subtitle: "Alle Infos hier",
                            buttons: [
                               {
                                   title: "Start    " +String.fromCodePoint(9889),
                                   type: "postback",
                                   payload: "strom"
                               }
                           ]

                        },
                        {
                            title: "Gastarife",
                            subtitle: "Alle Infos hier",
                            buttons: [
                               {
                                   title: "Start   " +String.fromCodePoint(128293),
                                   type: "postback",
                                   payload: "gas"
                               }
                           ]
                       },
                       {
                           title: "Solar",
                           subtitle: "Alle Infos hier",
                           buttons: [
                              {
                                  title: "Start   " +String.fromCodePoint(127774),
                                  type: "postback",
                                  payload: "solar"
                              }
                          ]
                      }
                    ]
                }
            }

        }

        fbSend.sendRequest(sender, messageData)
    }
}
