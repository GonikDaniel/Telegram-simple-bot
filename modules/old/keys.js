// Бот, работающий с интерактивными кнопками

var TelegramBot = require('node-telegram-bot-api');

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

    if (msgText === '/keys') {
        var opts = {
            reply_to_msg_id: msg.chat.id,
            reply_markup: JSON.stringify({
                keyboard: [
                    ['Yes'],
                    ['No']
                ]
            })
        };
        bot.sendMessage(msgChatId, 'Do you love me?', opts);
    }

    bot.sendMessage(msgChatId, msgText === 'Yes' ? "I'm too love you!" : ":(", { caption: "I'm a cute bot" });
    // if (msgText === 'Yes') {
    //     bot.sendMessage(msgChatId, "I'm too love you!", { caption: "I'm a cute bot" });
    // }

    // if (msgText === 'No') {
    //     bot.sendMessage(msgChatId, ":(", { caption: "I'm a bot" });
    // }
});