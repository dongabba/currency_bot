const TelegramBot = require('node-telegram-bot-api');
const request = require('request');

// replace the value below with the Telegram token you receive from @BotFather
const token = '1093954762:AAFk1n53QvIVTB9seTPopgHYcRGWeav0T3o';

// Create a bot that uses 'polling' to fetch new updates
const bot = new TelegramBot(token, {polling: true});

// Matches "/echo [whatever]"
bot.onText(/\/curse/, (msg, match) => {


  const chatId = msg.chat.id;
  bot.sendMessage(chatId, 'Выберите какая валюта вас интересует?', {
      reply_markup:{
          inline_keyboard:[
              [
              {
                  text: '€ - EUR',
                  callback_data: 'EUR'
              },
              {
                text: '$ - USD',
                callback_data: 'USD'
            },
            {
                text: '₽ - RUB',
                callback_data: 'RUB'
            },
            {
                text: '₴ - UAH',
                callback_data: 'UAH'
            },
            {
                text: '元 - CNY',
                callback_data: 'CNY'
            }, 
          ]
        ]
      }
  });
});

bot.on("callback_query", query =>{
    const id = query.message.chat.id;
    request('http://www.nbrb.by/api/exrates/rates?periodicity=0', function(error, response, body){
        const data = JSON.parse(body);
        const result = data.filter(item => item.Cur_Abbreviation === query.data)[0];
        let md = `
            *${result.Cur_Scale} ${result.Cur_Name} = ${result.Cur_OfficialRate} BYN*`;
        bot.sendMessage(id, md, {parse_mode: 'Markdown'});
    });
});