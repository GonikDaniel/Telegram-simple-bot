// Реализация бота, отправляющего случайную цитату с bash.im

var TelegramBot = require('node-telegram-bot-api');
var http = require('http');
var iconv = require('iconv-lite');

var token = 'YOUR_TOKEN';
var botOptions = {
    polling: true
};

var bot = new TelegramBot(token, botOptions);

var options = {
    host: 'bash.im',
    port: 80,
    path: '/forweb/'
};

bot.getMe().then(function(me) {
    console.log('Hello! My name is %s', me.first_name);
    console.log('My id is %s', me.id);
    console.log('And my username is @%s', me.username);
});

bot.on('text', function(msg) {
    var msgChatId = msg.chat.id;
    var msgText = msg.text;
    var msgDate = msg.date;
    var msgUser = msg.from.username;

    if (msgText === '/bash') {
        sendRandomBashImQuote(msgChatId);
    }
});

function sendRandomBashImQuote(chatId) {
    http.get(options, function(res) {
        res.pipe(iconv.decodeStream('win1251').collect(function(err, decodedBody) {
            var content = getQuoteFromContent(decodedBody);
            content = removeAllMarkUp(content[1]);
            sendMessageByBot(chatId, content);
        }));
    });
}

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

function sendMessageByBot(chatId, msg) {
    bot.sendMessage(chatId, msg, {caption: "I'm a cute bot!"});
}

