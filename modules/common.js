var TelegramBot = require('node-telegram-bot-api');
var http = require('http');
var iconv = require('iconv-lite');
var parseString = require('xml2js').parseString;
var request = require('request');

var token = 'YOUR_TOKEN';
var botOptions = {
    polling: true
};
var bot = new TelegramBot(token, botOptions);

module.exports = {
    sendMessageByBot : function(chatId, msg) {
        bot.sendMessage(chatId, msg, { caption: 'I\'m a cute bot!' });
    },

    getCurrencyList : function(chatId) {
        var self = this;
        var httpOptions = {
            host: "www.cbr.ru",
            port: 80,
            path: '/scripts/XML_daily.asp?'
        };

        var content = "";

        var req = http.request(httpOptions, function(res) {
            res.setEncoding("utf8");
            res.on('data', function(chunk) {
                content += chunk;
            });
            res.on('end', function() {
                self.sendMessageByBot(chatId, parsedXML(content));
            });
        });
        req.end();

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
    },

    getBashQuote : function(chatId) {
        var self = this;
        var options = {
            host: 'bash.im',
            port: 80,
            path: '/forweb/'
        };

        http.get(options, function(res) {
            res.pipe(iconv.decodeStream('win1251').collect(function(err, decodedBody) {
                var content = getQuoteFromContent(decodedBody);
                content = removeAllMarkUp(content[1]);
                self.sendMessageByBot(chatId, content);
            }));
        });

        function removeAllMarkUp(str) {
            var cleanQuote = replaceAll(str, "<' + 'br>", '\n');
            cleanQuote = replaceAll(cleanQuote, "<' + 'br />", '\n');
            cleanQuote = replaceAll(cleanQuote, "&quot;", '\"');
            cleanQuote = replaceAll(cleanQuote, "&lt;", '>');
            cleanQuote = replaceAll(cleanQuote, "&gt;", '<');
            return cleanQuote;
        }

        function replaceAll (str, separatorStr, replaceStr) {
            return str.split(separatorStr).join(replaceStr);
        }

        function getQuoteFromContent(str) {
            var quoteBlock = str.replace('<\' + \'div id="b_q_t" style="padding: 1em 0;">', '__the_separator__');
            quoteBlock = quoteBlock.replace('<\' + \'/div><\' + \'small>', '__the_separator__');
            return quoteBlock.split('__the_separator__');
        }
    },

    vote : function(chatId) {
        var opts = {
            reply_to_msg_id: msg.chat.id,
            reply_markup: JSON.stringify({
                keyboard: [
                    ['Yes'],
                    ['No']
                ]
            })
        };
        bot.sendMessage(chatId, 'Do you love me?', opts);

        bot.sendMessage(chatId, msgText === 'Yes' ? "I'm too love you!" : ":(", { caption: "I'm a cute bot" });
    },

    getCatImage : function(chatId) {
        var photoUrl, photo;
        var url = request({ 
            method: 'GET',
            uri: "http://thecatapi.com/api/images/get?format=src&type=jpg,png",
        }, function (error, response, body) {
            if (!error && response.statusCode == 200) {
                photoUrl = response.request.uri.href;
                console.log(photoUrl);
                photo = request(photoUrl);
                bot.sendPhoto(chatId, photo, { caption: 'Pretty, cute cat is here! Enjoy' });
            }
        });
    }
    
};