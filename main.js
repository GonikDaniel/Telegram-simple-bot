//https://github.com/yagop/node-telegram-bot-api - documentation

//Events
// Every time TelegramBot receives a message, it emits a message. 
// Depending on which message was received, emits an event from this ones: 
// text, audio, document, photo, sticker, video, voice, contact, location, 
// new_chat_participant, left_chat_participant, new_chat_title, new_chat_photo, 
// delete_chat_photo, group_chat_created. 
// Its much better to listen a specific event rather than 
// a message in order to stay safe from the content.

var TelegramBot = require('node-telegram-bot-api');
var request = require('request');
var API = require('./modules/common');

var token = 'YOUR_TOKEN';
var botOptions = {
    polling: true
};
var bot = new TelegramBot(token, botOptions);
// bot.setWebHook(url, 'public-crt-for-telegram.pem');

bot.getMe().then(function(me) {
    console.log('Hello! My name is %s', me.first_name);
    console.log('My id is %s', me.id);
    console.log('And my username is @%s', me.username);
});

bot.on('text', function(msg) {
    var chatId = msg.chat.id,
        msgText = msg.text,
        msgDate = msg.date,
        msgUser = msg.from.username;

    switch(msgText){
        case '/say':
            API.sendMessageByBot(chatId, 'Hello ' + msg.from.first_name + ' !');
            break;
        case '/currency':
            API.getCurrencyList(chatId);
            break;
        case '/bash':
            API.getBashQuote(chatId);
            break;
        case '/vote':
            API.vote(chatId);
            break;
        case '/cat':
            API.getCatImage(chatId);
            break;
        case '/action':
            bot.sendChatAction(chatId, 'typing');
            break;
        case '/location':
            // bot.sendLocation(chatId, latitude, longitude, [options]);
            break;
        case '/file':
            // Get file. Use this method to get basic info about a file and prepare it for downloading. Attention: link will be valid for 1 hour.
            bot.getFile(fileId);
            break;
        case '/download':
            // Downloads file in the specified folder. This is just a sugar for (getFile)[#getfilefiled] method
            bot.downloadFile(fileId, downloadDir);
            break;
        default:
            console.log(msg);
    }

    console.log(msg);
});

//Используй регулярки!!! =)
bot.onText(/\/echo (.+)/, function (msg, match) {
  var fromId = msg.from.id;
  var resp = match[1];
  bot.sendMessage(fromId, resp);
});
