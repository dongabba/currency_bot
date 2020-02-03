const TelegramBot = require('node-telegram-bot-api');
const request = require('request');

// replace the value below with the Telegram token you receive from @BotFather
const token = '1093954762:AAFk1n53QvIVTB9seTPopgHYcRGWeav0T3o';

// Create a bot that uses 'polling' to fetch new updates
const bot = new TelegramBot(token, {polling: true});

// Matches "/echo [whatever]"
bot.onText(/\/curse (.+)/, (msg, match) => {


  const chatId = msg.chat.id;
  bot.sendMessage(chatId, 'Выберите какая валюта вас интересует?', {
      reply_markup:{
          inline_keyboard:[
              {
                  text: '€ - EUR',
                  callback_data: 'EUR'
              },
              {
                text: '$ - USD',
                callback_data: 'USD'
            },
            {
                text: '₽ - RUR',
                callback_data: 'RUR'
            },
            {
                text: 'Br - BYN',
                callback_data: 'BYN'
            },
            {
                text: '฿ - BTC',
                callback_data: 'BTC'
            }, 
          ]
      }
  });
});

bot.on("callback_query", query =>{
    const id = query.message.chat.id;
    request('https://api.privatbank.ua/p24api/pubinfo?json&exchange&coursid=5', function(error, response, body){
        const data = JSON.parse(body);
        const result = data.filter(item => item.ccy === query.data)[0];
        let md = `
            *${result.ccy} => ${result.base_ccy}*
            Buy: _${result.buy}_
            Sale: _${result.sale}_
            `;
        bot.sendMessage(id, md, {parse_mode: 'Markdown'});
    });
});
bot.on('message', (msg) => {
  const chatId = msg.chat.id;

  // send a message to the chat acknowledging receipt of their message
  bot.sendMessage(chatId, 'Received your message');
});