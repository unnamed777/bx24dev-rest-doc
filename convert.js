const jsdom = require('jsdom');
const { JSDOM } = jsdom;
const fs = require('fs');
const util = require('util');

const loadLinks = () => {
    const content = fs.readFileSync('links.txt', { encoding: 'utf8'});
    const result = {};

    for (let line of content.split("\n")) {
        const data = line.split(',');
        result[data[0]] = data[1];
    }

    return result;
};

const links = loadLinks();

// https://github.com/jsdom/jsdom/issues/1665
const waitImmediate = util.promisify(setImmediate);

(async () => {
    for (let filename of fs.readdirSync('./raw_html')) {
        if (filename.endsWith('.html') === false) {
            continue;
        }

        let methodName = filename.slice(0, -5);
        const data = fs.readFileSync(`./raw_html/${filename}`, { encoding: 'utf8' });
        let dom = new JSDOM(data);

        const title = dom.window.document.querySelector('h1').textContent.trim();
        const content = dom.window.document.querySelector('.content-text .detail-text').innerHTML;

        dom.window.close();
        await waitImmediate();

        console.log(title);

        const html = `<html>
        <head>
            <title>${title}</title>
            <link href="style.css" type="text/css" rel="stylesheet"/>
        </head>
        <body>
        <h1 class="title">${title} <a class="original-doc-link" href="${links[methodName]}" target="_blank">↗︎</a></h1>
        <div class="content">
            ${content}
        </div>
        </body>
        </html>`;

        fs.writeFileSync(`./docs/${filename}`, html);
    }
})();
