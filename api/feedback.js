const express = require('express');
const TelegramBot = require('node-telegram-bot-api');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();
const port = 3000;
const botToken = 'YOUR_TELEGRAM_BOT_TOKEN';
const chatId = 'YOUR_CHAT_ID';

const bot = new TelegramBot(botToken);

app.use(bodyParser.json());
app.use(express.static(path.join(__dirname)));
app.post('/send-feedback', (req, res) => {
    const { name, phone, message } = req.body;
    if (!message || message.trim() === '') {
        return res.status(400).json({ 
            success: false, 
            error: 'پەیام بەتاڵە' 
        });
    }

    if (phone && phone.trim() !== '') {
        const phoneRegex = /^[0-9]{10,15}$/;
        if (!phoneRegex.test(phone.trim())) {
            return res.status(400).json({ 
                success: false, 
                error: 'ژمارەی مۆبایل نادروستە' 
            });
        }
    }

    let telegramMessage = `🔔 پەیامێکی نوێ هات!\n`;
    telegramMessage += `-------------------------\n`;
    
    if (name && name.trim() !== '') {
        telegramMessage += `👤 ناو: ${name}\n`;
    }
    
    if (phone && phone.trim() !== '') {
        telegramMessage += `📞 ژمارە: ${phone}\n`;
    }
    
    telegramMessage += `📝 پەیام: ${message}`;
    bot.sendMessage(chatId, telegramMessage)
        .then(() => {
            console.log('✅ پەیام بە سەرکەوتوویی نێردرا بۆ تێلیگرام');
            res.json({ 
                success: true, 
                message: 'پەیام بە سەرکەوتوویی نێردرا' 
            });
        })
        .catch((error) => {
            console.error('❌ هەڵە لە ناردنی پەیام:', error);
            res.status(500).json({ 
                success: false, 
                error: 'هەڵەیەک لە سێرڤەری بۆت ڕوویدا' 
            });
        });
});

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(port, () => {
    console.log(`🚀 سێرڤەری Node.js لەسەر پۆرتی ${port} کار دەکات`);
    console.log('📝 چاوەڕێی وەرگرتنی فیدباکە...');
    console.log('🌐 پەڕەکە لە ئەدرێسی: http://localhost:' + port);
});
 
process.on('unhandledRejection', (reason, promise) => {
    console.error('❌ هەڵەی نەناسراوی Promise:', reason);
});

process.on('uncaughtException', (error) => {
    console.error('❌ هەڵەی نەناسراوی:', error);
    process.exit(1);
});
