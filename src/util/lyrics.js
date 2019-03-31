const cheerio = require('cheerio');
const fetch = require('node-fetch');

module.exports = class Lyrics {

    /**
     * @param {string} token Genius API Access Token
     */
    constructor(token) {
        if (!token) throw new Error('You must provide a Genius Access Token to use this!');
        this.token = token;
    };

    async getLyrics(song) {
        if (!song) return;
        const query = await this._search(song);
        if (!query[0]) reject('Nothing found.');
        const q = query[0].result;
        const lyrics = await this._scrape(q.url);
        return { lyrics, title: q.full_title, url: q.url, header: q.header_image_url };
    }

    async _search(query) {
        let res = await fetch(`https://api.genius.com/search?q=${query}`, {
            headers: {
                "Authorization": `Bearer ${this.token}`
            }
        });
        if (res.status !== 200) return;
        res = await res.json();
        return res.response.hits;
    }

    async _scrape(url) {
        let res = await fetch(url);
        if (res.status !== 200) reject();
        res = await res.text();
        const $ = cheerio.load(res);
        return $('.lyrics').text().trim();
    }
}