const Url = require('../models/urlModel');
const UrlShortener = require('../utils/urlShortener');

class UrlController {
    static async shortenUrl(req, res) {
        try {
            console.log('Received request to shorten URL:', req.body);
            const { originalUrl } = req.body;
            if (!originalUrl) {
                return res.status(400).json({ error: "URL is required" });
            }

            let shortUrl;
            let urlExists = true;
            let attempts = 0;
            const maxAttempts = 5;

            while (urlExists && attempts < maxAttempts) {
                shortUrl = UrlShortener.generateShortUrl();
                urlExists = await Url.findOne({ shortUrl });
                attempts++;
            }

            if (attempts === maxAttempts) {
                console.error('Failed to generate unique short URL after maximum attempts');
                return res.status(500).json({ error: 'Failed to generate unique short URL' });
            }

            const url = new Url({ originalUrl, shortUrl });
            await url.save();

            console.log('URL shortened successfully:', { originalUrl, shortUrl });
            res.status(201).json({
                originalUrl: url.originalUrl,
                shortUrl: `/api/${url.shortUrl}`
            });
        } catch (err) {
            console.error('Server error:', err);
            res.status(500).json({ error: 'Server error: ' + err.message });
        }
    }

    static async redirectToOriginalUrl(req, res) {
        try {
            const { shortUrl } = req.params;
            console.log('Received request to redirect:', shortUrl);
            const url = await Url.findOne({ shortUrl });

            if (!url) {
                console.log('URL not found:', shortUrl);
                return res.status(404).json({ error: 'URL not found' });
            }

            url.clicks += 1;
            await url.save();

            console.log('Redirecting to:', url.originalUrl);
            res.redirect(url.originalUrl);
        } catch (err) {
            console.error('Server error:', err);
            res.status(500).json({ error: 'Server error: ' + err.message });
        }
    }
}

module.exports = UrlController;
