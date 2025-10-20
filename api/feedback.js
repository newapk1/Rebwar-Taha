const https = require('https' );

// نهێنییەکان لە Vercel Environment Variables وەردەگیرێن
const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const CHAT_ID = process.env.TELEGRAM_CHAT_ID;

module.exports = (req, res) => {
    // تەنها ڕێگە بە POST بدە
    if (req.method !== 'POST') {
        res.setHeader('Allow', 'POST');
        return res.status(405).json({ error: 'Method Not Allowed' });
    }

    const { message } = req.body;

    if (!message || !message.trim()) {
        return res.status(400).json({ error: 'پەیام بەتاڵە' });
    }

    const text = `🔔 **پەیامێکی نوێ هات!**\n-------------------------\n${message}`;

    const data = JSON.stringify({
        chat_id: CHAT_ID,
        text: text,
        parse_mode: 'Markdown'
    });

    const options = {
        hostname: 'api.telegram.org',
        port: 443,
        path: `/bot${BOT_TOKEN}/sendMessage`,
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Content-Length': data.length
        }
    };

    const request = https.request(options, (response ) => {
        if (response.statusCode === 200) {
            res.status(200).json({ success: true });
        } else {
            res.status(response.statusCode).json({ error: 'هەڵەیەک لە ناردنی پەیام بۆ تێلیگرام ڕوویدا' });
        }
    });

    request.on('error', (error) => {
        res.status(500).json({ error: 'Internal Server Error' });
    });

    request.write(data);
    request.end();
};
