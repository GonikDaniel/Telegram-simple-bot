// Бот, отправляющий в ответ на стикер свой стикер

var TelegramBot = require('node-telegram-bot-api');

var token = 'YOUR_TOKEN';
var botOptions = {
    polling: true
};
var bot = new TelegramBot(token, botOptions);

var stickersList = [
    'BQADAgADfgADEag0Bb5mxH0gvtktAg',
    'BQADAgADowADEag0BQs_xQSkcIFKAg',
    'BQADAgAD1wADEag0BTEYGb09JERjAg',
    'BQADAgAD5wADEag0BZAwDWvpwGrtAg',
    'BQADAgADxQADEag0BRBpCE1JOT4sAg',
    'BQADAgADwwADEag0BbGlUZ12nxZ8Ag',
    'BQADAgADvwADEag0Bf5nBjEjQyUYAg',
    'BQADAgADyQADEag0BYauZXVnHFqOAg'
];

bot.getMe().then(function(me) {
   console.log('Hello! My name is %s!', me.first_name);
   console.log('My id is %s.', me.id);
   console.log('And my username is @%s.', me.username); 
});

bot.on('sticker', function(msg) {
    var msgChatId = msg.chat.id;
    var msgStickerId = msg.sticker.file_id;
    var msgDate = msg.date;
    var msgUsr = msg.from.username;

    sendStickerByBot(msgChatId, stickersList[getRandomInt(0, stickersList.length)]);
    console.log(msg);
});

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function sendStickerByBot (chatId, stickerId) {
    bot.sendSticker(chatId, stickerId, {caption: "I'm a cute bot"});
}