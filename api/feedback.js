const TelegramBot = require('node-telegram-bot-api');

module.exports = async (req, res) => {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'تەنها ڕێگە بە POST دەدرێت' });
    }

    try {
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
        const botToken = process.env.TELEGRAM_BOT_TOKEN;
        const chatId = process.env.TELEGRAM_CHAT_ID;

        if (!botToken || !chatId) {
            return res.status(500).json({ 
                success: false, 
                error: 'ڕێکخستنی سێرڤەر نادروستە' 
            });
        }

        const bot = new TelegramBot(botToken);
        let telegramMessage = `🔔 پەیامێکی نوێ هات!\n`;
        telegramMessage += `-------------------------\n`;
        
        if (name && name.trim() !== '') {
            telegramMessage += `👤 ناو: ${name}\n`;
        }
        
        if (phone && phone.trim() !== '') {
            telegramMessage += `📞 ژمارە: ${phone}\n`;
        }
        
        telegramMessage += `📝 پەیام: ${message}`;
        await bot.sendMessage(chatId, telegramMessage);
        
        res.status(200).json({ 
            success: true, 
            message: 'پەیامەکەت بە سەرکەوتوویی نێردرا' 
        });

    } catch (error) {
        console.error('❌ هەڵە:', error);
        res.status(500).json({ 
            success: false, 
            error: 'هەڵەیەک ڕوویدا لە ناردنی پەیامەکەتدا' 
        });
    }
};

