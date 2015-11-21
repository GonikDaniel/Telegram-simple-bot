var TelegramBot = require('node-telegram-bot-api');
var http = require('http');
var parseString = require('xml2js').parseString;


var token = 'YOUR_TOKEN';
var botOptions = {
    polling: true
};

var bot = new TelegramBot(token, botOptions);

var httpOptions = {
    host: "www.cbr.ru",
    port: 80,
    path: '/scripts/XML_daily.asp?'
};

var content = "";

bot.getMe().then(function(me) {
    console.log('Hello! My name is %s!', me.first_name);
    console.log('My id is %s.', me.id);
    console.log('And my username is @%s.', me.username);
});


bot.on('text', function(msg) {
    var msgChatId = msg.chat.id;
    var msgText = msg.text;
    var msgDate = msg.date;
    var msgUser = msg.from.username;

    if (msgText === '/currency') updateGlobalCurrencyList(msgChatId);
});

function sendMessageByBot(chatId, msg) {
    bot.sendMessage(chatId, msg, {caption: "I'm a cute bot!"});
}

function updateGlobalCurrencyList(chatId) {
    var req = http.request(httpOptions, function(res) {
        res.setEncoding("utf8");
        res.on('data', function(chunk) {
            content += chunk;
        });
        res.on('end', function() {
            sendMessageByBot(chatId, parsedXML(content));
        });
    });
    req.end();
}

function parsedXML(xml) {
    var currencyList = {
        'USD': 0.0,
        'EUR': 0.0,
        'UAH': 0.0,
        'KZT': 0.0,
        'BYR': 0.0,
        'GBP': 0.0
    };
    var parsed;
    parseString(xml, function (err, result) {
        if (err) parsed = err;
        parsed = result;
    });
    for(var currency in currencyList){
        currencyList[currency] = getCurrentValue(currency, parsed);
    }
    return generateStringForAnswer(currencyList);
}

function getCurrentValue(currency, parsedObj) {
    var currencyList = parsedObj.ValCurs.Valute;
    for (var i = 0; i < currencyList.length; i++) {
        if (currencyList[i].CharCode[0] === currency) {
            var value = parseFloat(currencyList[i].Value[0].replace(/,/, '.'));
            var nominal = parseFloat(currencyList[i].Nominal[0].replace(/,/, '.'));
            return (value / nominal).toFixed(4);
        }
    }
}

function generateStringForAnswer(list) {
    var finalList = 'CURRENCY:\n';
    for(var currency in list){
        finalList += '1 ' + currency + ' = ' + list[currency] + ' ' + 'RUB' + ';\n';
    }
    return finalList;
}