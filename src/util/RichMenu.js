const { RichMenu, RichDisplay } = require('klasa');

/* Note: this has been modified to go from one to ten instead of zero to nine */

module.exports = class extends RichMenu {
    constructor(embed) {
        super(embed);

        Object.assign(this.emojis, {
            zero: '1️⃣',
            one: '2️⃣',
            two: '3️⃣',
            three: '4️⃣',
            four: '5️⃣',
            five: '6️⃣',
            six: '7️⃣',
            seven: '8️⃣',
            eight: '9️⃣',
            nine: '🔟'
        });
    }

    _paginate() {
        const page = this.pages.length;
        if (this.paginated) return null;
        RichDisplay.prototype.addPage.call(this, embed => {
            for (let i = 0, option = this.options[i + (page * 10)]; i + (page * 10) < this.options.length && i < 10; i++ , option = this.options[i + (page * 10)]) {
                embed.addField(`(${i + 1}) ${option.name}`, option.body, option.inline);
            }
            return embed;
        });
        if (this.options.length > (page + 1) * 10) return this._paginate();
        this.paginated = true;
        return null;
    }

}
