// Бот, отправляющий в ответ на команду мультимедийный объект в чат.
// Telegram Bot API позволяет отправлять как локальные мультимедийные 
// объекты и файлы, так и удалённые. Для того, чтобы иметь возможность 
// отправлять удалённые объекты, полученные по URL, требуется подключить 
// пакет request, о котором и говорилось в начале статьи.

var TelegramBot = require('node-telegram-bot-api');
var request = require('request');

var token = 'YOUR_TOKEN';
var botOptions = {
    polling: true
};
var bot = new TelegramBot(token, botOptions);

bot.getMe().then(function(me) {
    console.log('Hello! My name is %s!', me.first_name);
    console.log('My id is %s.', me.id);
    console.log('And my username is @%s.', me.username);
});

bot.on('text', function(msg) {
    var msgChatId = msg.chat.id;
    var msgText = msg.text;

    switch(msgText){
        case '/photo':
            var photo = request('http://www.google.com/images/srpr/logo3w.png');
            bot.sendPhoto(msgChatId, photo, {caption: 'Image: '});
            break;
        case '/audio':
            var audio = __dirname + '/reminder.ogg';
            bot.sendAudio(msgChatId, audio, {caption: 'Audio: '});
            break;
        case '/file':
            var url = 'http://exlmoto.ru/wp-content/Packages/stransball2.mgx';
            var file = request(url);
            bot.sendDocument(msgChatId, file, {caption: 'Document: '});
            break;
        default:
            console.log(msg);
            break;
    }
    console.log(msg);
});