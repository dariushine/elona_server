const express = require('express');
const rateLimit = require('express-rate-limit');
const morgan = require('morgan');
const { Pool } = require('pg');
const app = express();
const port = 80;

const pool = new Pool();

const limiter = rateLimit({
  windowMs: 10 * 60 * 1000, // 10 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});

// elona chat types
const chat_types = {
  // num to text
  'num': {
    0: 'chat',
    1: 'dead',
    2: 'wish'
  },
  // text to num
  'name': {
    'chat': 0,
    'dead': 1,
    'wish': 2
  }
};

app.use([morgan('dev'), limiter]);
app.disable('x-powered-by');

app.get('/', (req, res) => res.send('Welcome to this Elona Chat server. Instructions will be available at the Elona wiki.'));

// not sure what it does. is it like a motd? is it the message for the voting board?
app.get('/text.txt', function (req, res) {
  response = "<!--START-->\n%\n素敵な異名コンテスト♪1  [１ヶ月で自動リセット]%\nYour favorite alias♪1  [Auto reset every month]%";
  res.set({ 'Content-type': 'text/plain' });
  res.send(response);
});

app.get('/log(en)?.txt', function (req, res) {
  // set language
  let language = (req.path == '/log.txt' ? 'jp' : 'en')

  // make query object
  let query = {
    name: 'fetch-log',
    text: 'select * from chat where lang=$1 order by id desc limit 30',
    values: [language]
  }

  // send query and process everything
  pool.query(query).then((result) => {
    let response = "";
    let first = result.rowCount > 0 ? result.rows[0]['id'] : 1;
    response += first + "<C>\n<!--START-->\n";
    response += result.rows.reduce(function (text, row) {
      let date = row['time'];

      // format date
      let dateObj = {
        day: date.getDate().toString(),
        month: date.getMonth().toString(),
        hour: date.getHours().toString(),
        minutes: date.getMinutes().toString()
      };

      // padstart time variables
      for (val in dateObj) {
        dateObj[val] = dateObj[val].padStart(2, 0);
      };

      // put everything in elona time format
      let dateText = `${dateObj.month}/${dateObj.day}(${dateObj.hour}:${dateObj.minutes})`;
      
      // format entire line
      text += row['id'] + '%' + dateText + '%' + chat_types.num[row['kind']] +
        row['text'] + '%' + '127.0.0.1' + '%\n';
      return text;
    }, "");
    response += "<!--END-->\n<!-- WebTalk v1.6 --><center><small><a href='http://www.kent-web.com/' target='_top'>WebTalk</a></small></center>";
    res.set({ 'Content-type': 'text/plain' });
    res.send(response);
  })
    .catch(e => console.log(e.stack));
});

app.get('/cgi-bin/wtalk(en)?/wtalk2.cgi', function (req, res) {
  console.log(req.path)
  let language = (req.path == '/cgi-bin/wtalk/wtalk2.cgi' ? 'jp' : 'en')
  let mode = req.query.mode;
  let comment = req.query.comment;

  // check if the message is at least 1 character long (the first 4 are the type)
  if (comment == undefined || comment.length < 5) {
    res.status(400).send('400 Bad request');
    return;
  }
  // check if the message has a valid type
  let chat_name = comment.substr(0, 4);
  if (!chat_types.name.hasOwnProperty(chat_name)) {
    res.status(400).send('400 Bad request');
    return;
  }

  // format data
  let chat_type = chat_types.name[chat_name];
  let text = comment.substr(4);
  let addr = req.ip;
  let curr_time = new Date();

  let query = {
    name: 'insert-log',
    text: 'INSERT INTO CHAT (time, kind, text, addr, lang) VALUES ($1, $2, $3, $4, $5)',
    values: [curr_time, chat_type, text, addr, language]
  };

  // send query
  pool.query(query).catch(e => console.log(e.stack));

  // redirect depending on language
  let logurl = (language == 'jp' ? '/log.txt' : '/logen.txt');
  res.redirect(logurl);
});

// start app
app.listen(port, () => console.log(`Elona Chat listening on port ${port}!`));