const express = require('express')
const app = express()
const port = 3000
var compression = require('compression');
var template = require('./lib/template.js');
var db = require('./lib/db')
var topic = require('./lib/topic');


app.use(express.static('public'));
app.use(express.urlencoded({
  extended: false
}));
app.use(compression());

app.get('/', (request, response) => {
  //정리하기
topic.home(response);
})

app.get('/page/:pageId', function (request, response, next) {
 topic.page(request, response);
});

app.get('/create', (request, response) => {
  topic.create(request, response);
});

app.post('/create', (request, response) => {
  topic.create_process(request, response);
});

app.get('/update/:pageId', (request, response) => {
  topic.update_process(request, response);
});

app.post('/update', function (request, response) {
  topic.update(request, response);
});

app.post('/delete', (request, response) => {
  topic.delete(request, response);
});

//error 처리, 밑에서 사용
app.use((request, response, next) => {
  response.status(404).send('Sorry cant find that!');
})
//error handlers
app.use((err, request, response, next) => {
  console.error(err.stack)
  response.status(500).send('Something broke!')
})

app.listen(port, () => {
  console.log(`Start server`);
})