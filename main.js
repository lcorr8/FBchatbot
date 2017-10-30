const express = require("express")
const bodyParser = require("body-parser")
const request = require("request")
const mongoose = require("mongoose")
const fbMessageC = require("./controllers/fbMessageController")
const fbMessageCC = require("./controllers/fbMessageControllerCustom")
const userC = require("./controllers/userController")
const chatC = require("./controllers/chatController")
const emoji = require("node-emoji")
const utf8 = require("utf8")


require("dotenv").config()
const app = express()
const port = process.env.PORT || 8080

mongoose.Promise = global.Promise
mongoose.connect(process.env.DB_URL)

const FB_PAGE_TOKEN = process.env.FB_PAGE_TOKEN
if (!FB_PAGE_TOKEN) {
    throw new Error('missing FB_PAGE_TOKEN')
}

const FB_VERIFY_TOKEN = process.env.FB_VERIFY_TOKEN

//this is to translate hh site to average consumption
let consumption = {
    strom: {
        1: 2000,
        2: 3500,
        3: 4250,
        4: 5000
    },
    gas: {
        1: 3800,
        2: 5000,
        3: 12000,
        4: 18000
    }
}



//needed for building links to relevant landing page for tarifs
let urlCheck24 = "https://www.check24.de/"
let params1Check24 = "/result/?c24api_zipcode="
let params2Check24 = "&c24api_totalconsumption="
let params3Check24 = "&c24api_customertype=private&c24api_eco=no&c24api_considerdiscounts=yes&c24api_maxbonusshare=yes&c24api_companyevaluation_positive=75&c24api_guidelinematch=yes&c24api_contractextension=12&c24api_cancellationperiod=42&c24api_contractperiod=12&c24api_paymentperiod=month&c24api_onlinesubscription=no&c24api_priceguarantee=fixed_price&c24_priceguarantee_months=12&c24api_eco_type=normal&pid=24&c24_from_result_page=1"

let urlVerivox = "http://www.verivox.de/strompreisvergleich/vergleich/v2/#?plz="
let paramsVerivox = "&source=1&q=WzIsMCwwLDEsMCwwLDAsMSwyMCwxLDEsNTExNzcxLCIwIiwxLDEyLDEyLDM1MDAsMCwwLDEyLDEsNiwtMSwxLDAsMF0"


let urlToptarif = "https://www.toptarif.de/rechner-"
let params1Toptarif = "/?vxcp_PostCode="
let params2Toptarif = "&vxcp_TotalUsage="

//middleware
app.use(bodyParser.urlencoded({extended: false}))
app.use(bodyParser.json())

app.get("/", function(req, res) {
    res.send("I am a chatbot")
})

// webhook setup
app.get("/webhook/", function(req, res) {
    if (req.query["hub.verify_token"] === FB_VERIFY_TOKEN) {
        res.send(req.query["hub.challenge"])
        return
    }
    res.send("Wrong token")
})

app.post("/webhook/", function(req, res) {   //this is my entry point
    var messaging_events = req.body.entry[0].messaging
    var event = messaging_events[0]
    var sender = event.sender.id

    userC.update({userId: sender}, {$set: {userId: sender}}, {upsert: true})
    .then(function(result) {
        return chatC.update({userId: sender, createdAt: {$gt: Date.now()-1000*60*60*2}},
                            {$set: {userId: sender}},
                            {upsert: true})
    })
    .then(function(chat) {
        // console.log("This is the most recent chat: ", chat)
    })
    .catch(function(err) {
        console.log("ERROR in saving user after post: ", err)
    })



    if(event.message && event.message.text) {
        var text = event.message.text
        decideMessage(sender, text)


    } else if(event.postback) { //this is triggered when gas or strom is send
        let text = JSON.stringify(event.postback)
        console.log("this is the postback: ", text)
        decideMessage(sender, text)

    }

    res.sendStatus(200)
})


//hard coded logic for a conversation
function decideMessage(sender, text1) {
    var text = text1.toLowerCase()
    // console.log("first text: ", text.codePointAt(0))
    console.log("Im in text: ", text)
    //heart 10084
    //fire 128293
    //blitz 9889

    if(text == "?"){
        //here show what the menu options are
        // fbMessageC.sendListCompact(sender, null)
        fbMessageCC.sendMenuList(sender)
    } else if(text.includes("strom") || text.codePointAt(0) === 9889) {
        chatC.update({userId: sender}, {"tariff.source": "strom"}, {upsert: true})
        .then(function(chat) {
            console.log("this is the chat after strom: ", chat)
            fbMessageCC.sendConsumption(sender, {type: "power"})
        })
        .catch(function(err) {
            console.log("ERROR in save energy source: ", err)
            fbMessageC.sendText(sender, "Oooops, etwas ist schiefgegangen. Ich verstehe dich nicht.")
        })

    } else if(text.includes("gas") || text.codePointAt(0) === 128293) {
        chatC.update({userId: sender}, {"tariff.source": "gas"}, {upsert: true})
        .then(function(chat) {
            fbMessageCC.sendConsumption(sender, {type: "gas"})
        })
        .catch(function(err) {
            console.log("ERROR in save energy source: ", err)
            fbMessageC.sendText(sender, "Oooops, etwas ist schiefgegangen. Ich verstehe dich nicht.")
        })

    } else if(text === "1 person" || text === "2 personen" || text === "3 personen" || text === "4 personen"){
        console.log("Im in the consuption check stage")
        let newText = text.substring(0, 1)
        chatC.update({userId: sender}, {"tariff.size": newText}, {upsert: true})
        .then(function(user) {
            fbMessageC.sendText(sender, "OK. Jetzt bauche ich nocht deinen Wohnort (PLZ)")
        })
        .catch(function(err) {
            console.log("ERROR in saving hh size: ", err)
            fbMessageC.sendText(sender, "Oooops, etwas ist schiefgegangen. Ich verstehe dich nicht.")
        })

    } else if(text.codePointAt(0) === 10084 || text.codePointAt(0) === 128516 || text.codePointAt(0) ===  128512) { //heart , happy , smile
        //here todo some randomnes on the emojies
        fbMessageC.sendText(sender, emoji.get("unicorn_face"))
    } else if(text.match(/\b\d{5}\b/g)) {
        //here additional check zip code needed

        chatC.update({userId: sender}, {"tariff.zipCode": text}, {upsert: true})
        .then(function(chat) {
            return chatC.getById(chat._id)
        })
        .then(function(updatedChat) {
            console.log("im in step before links composition with updatedchat: ", updatedChat)
            // let hhSize = updatedChat.tariff.size
            let hhConsumption = consumption[updatedChat.tariff.source][updatedChat.tariff.size]

            let url1 = urlCheck24 + updatedChat.tariff.source + params1Check24 + updatedChat.tariff.zipCode +
                        params2Check24 + hhConsumption + params3Check24

            let url2 = urlToptarif + updatedChat.tariff.source + params1Toptarif + updatedChat.tariff.zipCode + params2Toptarif + hhConsumption

            fbMessageC.sendButtons(sender, {text: "Ich habe dir was passendes rausgesucht!",
                                    url1: url1, title1: "check24 Ergebnisse", url2: url2, title2: "toptarif Ergebnisse"})
        })
        .catch(function(err) {
            console.log("ERROR in zip code update: ", err)
            fbMessageC.sendText(sender, "Oooops, etwas ist schiefgegangen. Ich verstehe dich nicht. Hast du vielleicht vergessen mir zu sagen ob du Strom oder Gas willst?")
        })
    } else if(text.includes("solar")){
        fbMessageC.sendText(sender, "coming soon.....")

    } else if(text.includes("wer") && text.includes("du")){
        fbMessageC.sendText(sender, "Ich bin ein Chat Bot. Meine Spezialität ist Energie. Ich bin 5 Tage alt und lerne jeden Tag dazu :-)")

    } else {
        // console.log("decide message hi")
        fbMessageC.sendText(sender, "Hi, ich bin wattmii. Ich bin ein " + emoji.get("robot_face"))

    }
}



app.listen(port, function() {
    console.log("server is listening...")
})
