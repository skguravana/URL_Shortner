import express from 'express';
import { log } from './logger.js'; 
import cors from 'cors';

const app = express();
app.use(express.json());
app.use(cors({ origin: '*' }));

const map = new Map();
let idCounter = 1;

const encodeBase62 = (num) => {
  let str = '';
    for (let i = 0; i < 5; i++) {
        let ind = Math.floor(Math.random() * 62);
        str = base62[ind] + str;
    }
    return str;
};
const base62 = 'qwe1rty2uio3pas4dfg5hjk6lzxc7vbn8mQW9ERTY0UIOPASDFGHJKLZXCVBNM';



app.use((req, res, next) => {
  log('info', `Incoming request: ${req.method} ${req.url}`);
  next();
});


app.post('/shorty/shorten', (req, res) => {
  let { longurl,shortcode, expiryInSeconds } = req.body;

  console.log(longurl,shortcode,expiryInSeconds)
  if (!longurl) {
    log('warn', 'POST /shorten failed: longurl missing');
    return res.status(400).json({ message: "longurl required" });
  }
  if(shortcode && map.has(shortcode)){
    log('warn', 'POST /shorten failed:shortcode already exist');
    return res.status(400).json({ message: "shortcode already in use" });
  }
  if(!shortcode){
     shortcode = encodeBase62(idCounter++);
  }
  console.log(shortcode);
  const ttl = expiryInSeconds || 3600; 
  const expiresAt = Date.now() + ttl * 1000;

  map.set(shortcode, {
    url: longurl,
    clicks: 0,
    createdAt: Date.now(),
    expiresAt,
  });

  log('info', `Shortcode created: ${shortcode} -> ${longurl}`);
  res.status(201).json({
    message: "Shorturl created",
    shorturl: `http://localhost:5000/shorty/${shortcode}`,
    expiresAt: new Date(expiresAt).toISOString(),
  });
});

app.get('/shorty/:shortcode', (req, res) => {
  const { shortcode } = req.params;
  if (!map.has(shortcode)) {
    log('warn', `GET /shorty/${shortcode} failed: shortcode not found`);
    return res.status(404).json({ message: "Shortcode not found" });
  }

  const data = map.get(shortcode);

  if (Date.now() > data.expiresAt) {
    map.delete(shortcode);
    log('warn', `GET /shorty/${shortcode} failed: shortcode expired`);
    return res.status(410).json({ message: "Shorturl expired" });
  }

  data.clicks += 1;
  log('info', `Redirecting shortcode: ${shortcode}, clicks: ${data.clicks}`);
  res.redirect(302, data.url);
});

app.get('/shorty/stats/:shortcode', (req, res) => {
  const { shortcode } = req.params;
  if (!map.has(shortcode)) {
    log('warn', `GET /shorty/stats/${shortcode} failed: shortcode not found`);
    return res.status(404).json({ message: "Shortcode not found" });
  }

  const data = map.get(shortcode);

  if (Date.now() > data.expiresAt) {
    map.delete(shortcode);
    log('warn', `GET /shorty/stats/${shortcode} failed: shortcode expired`);
    return res.status(410).json({ message: "Shorturl expired" });
  }

  log('info', `Stats requested for shortcode: ${shortcode}`);
  res.status(200).json({
    url: data.url,
    clicks: data.clicks,
    createdAt: new Date(data.createdAt).toISOString(),
    expiresAt: new Date(data.expiresAt).toISOString(),
  });
});

app.listen(5000, () => {
  console.log('I am running')
  log('info', 'Server running at http://localhost:5000');
});
