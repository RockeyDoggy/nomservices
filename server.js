const express = require('express');
const fetch = require('node-fetch');
const cheerio = require('cheerio');

const app = express();

app.use((req, res, next) =>{
  res.header('Access-Control-Allow-Origin', '*');
  next();
});

app.get('/metadata/', async (req, res) => {
  try {
    const {url} = req.query;
    const result = await fetch (url);
    const html = await result.text();
    const $ = cheerio.load(html);

    res.json({
      title: $('meta[property="og:title"]').attr('content') || $('title').text(),
      desc: $('meta[property="og:description"]').attr('content'),
      thumb: $('meta[property="og:image"]').attr('content'),
      icon: $('meta[property="og:logo"]').attr('content'),
      site: $('meta[property="og:site_name"]').attr('content') || new URL(url).hostname,
    });
  } catch(e){
    res.status(500).json({error: 'Deu Ruim :('});
  }
});

app.listen(3000, ()=> console.log('Servidor On!'))
