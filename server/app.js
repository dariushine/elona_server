const express = require('express')
const morgan = require('morgan')
const { Pool } = require('pg')
const app = express()
const port = 80

const pool = new Pool();

const chat_types = {

  'num': {
    0: 'chat',
    1: 'dead',
    2: 'wish'
  },

  'name': {
    'chat': 0,
    'dead': 1,
    'wish': 2
  }
};

app.use(morgan('dev'));

app.get('/', (req, res) => res.send('Hello Worldes!'))

app.get('/text.txt', function (req, res) {
  response = "<!--START-->\n%\n素敵な異名コンテスト♪1  [１ヶ月で自動リセット]%\nYour favorite alias♪1  [Auto reset every month]%"
  res.set({ 'Content-type': 'text/plain' });
  res.send(response)
})

app.get('/logen.txt', function (req, res) {
  pool.query("select * from chat where lang='en' order by id desc limit 30").then((result) => {
    let response = "";
    let first = result.rowCount > 0 ? result.rows[0]['id'] : 1;
    response += first + "<C>\n<!--START-->\n"
    response += result.rows.reduce(function (text, row) {
      let date = row['time'];

      // Move all of this to a function, dammit
      let dateObj = {
        day: date.getDate().toString(),
        month: date.getMonth().toString(),
        hour: date.getHours().toString(),
        minutes: date.getMinutes().toString()
      };

      for (val in dateObj) {
        dateObj[val] = dateObj[val].padStart(2, 0);
      };

      let dateText = `${dateObj.month}/${dateObj.day}(${dateObj.hour}:${dateObj.minutes})`;

      text += row['id'] + '%' + dateText + '%' + chat_types.num[row['kind']] +
        row['text'] + '%' + row['addr'] + '%\n';
      return text;
    }, "")
    response += "<!--END-->\n<!-- WebTalk v1.6 --><center><small><a href='http://www.kent-web.com/' target='_top'>WebTalk</a></small></center>"
    res.set({ 'Content-type': 'text/plain' });
    res.send(response)
  })
    .catch(e => console.log(e.stack));
})

app.get('/cgi-bin/wtalken/wtalk2.cgi', function (req, res) {
  let mode = req.query.mode;
  let comment = req.query.comment;

  if (comment == undefined || comment.length < 5) {
    res.status(400).send('400 Bad request');
    return
  }

  let chat_name = comment.substr(0, 4);
  if (!chat_types.name.hasOwnProperty(chat_name)) {
    res.status(400).send('400 Bad request');
    return;
  }

  let chat_type = chat_types.name[chat_name];
  let text = comment.substr(4);
  let addr = req.ip;
  let curr_time = new Date() //insert current time here
  let query = {
    name: 'fetch-log-en',
    text: 'INSERT INTO CHAT (time, kind, text, addr, lang) VALUES ($1, $2, $3, $4, $5)',
    values: [curr_time, chat_type, text, addr, "en"]
  };

  pool.query(query).catch(e => console.log(e.stack));
  res.redirect('/logen')
})

app.listen(port, () => console.log(`Example app listening on port ${port}!`)) 