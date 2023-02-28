const TelegramApi = require('node-telegram-bot-api')
const {gameOptions, againOptions} = require('./options.js')
const token = '6286060847:AAEM1ujoEW8XSZj0DefPi5zZRQ-I9tEyL8o'

const bot = new TelegramApi(token, {polling: true})

const chats = {}

const startGame = async (chatId) => {
    await bot.sendMessage(chatId, `Сейчас я загадаю цифру от 0 до 9 а ты должен ее угадать`)
    const randomNum = Math.floor(Math.random() * 10)
    chats[chatId] = randomNum;
    await bot.sendMessage(chatId, `Отгадывай`, gameOptions)
}

const start = () => {
    bot.setMyCommands([
        {command: '/start', description: 'Старт'},
        {command: '/info', description: 'Информация'},
        {command: '/game', description: 'Игра угадай цифру'}
    ])

    bot.on('message', async msg => {
        const text = msg.text;
        const chatId = msg.chat.id;
        const user = msg.chat.first_name;
        if(text === '/start') {
            await bot.sendSticker(chatId, `https://tlgrm.ru/_/stickers/fa6/f0b/fa6f0bf1-de77-497b-8e4d-50262c8ef05e/4.webp`)
            return bot.sendMessage(chatId, `Добро пожаловать в телеграм бот Project XV Bot`)
        }
        if(text === '/info') {
            return bot.sendMessage(chatId, `Тебя зовут ${user}`)
        }
        if(text === '/game') {
            return startGame(chatId)
        }
        return bot.sendMessage(chatId, `Ты написал(а) мне "${text}" ай ${user}, я тебя не понимаю, попробуй еще раз!`)
    })
    bot.on('callback_query', async msg => {
        const data = msg.data;
        const chatId = msg.message.chat.id
        if(data === '/again') {
            return startGame(chatId)
        }
        if(data === chats[chatId]) {
            return bot.sendMessage(chatId, `Поздравлаю. ты отгадал цифру ${chats[chatId]}`, againOptions)
        } else {
            return bot.sendMessage(chatId, `К сожалению ты не угадал бот загадал цифру ${chats[chatId]}`, againOptions)
        }
        bot.sendMessage(chatId, `Ты выбрал цифру ${data}`)
        console.log(msg)
    })
}

start()