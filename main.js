const express = require('express')
const app = express()
const port = 3000
var fs = require('fs');
var path = require('path');
const sanitizeHtml = require('sanitize-html');
var compression = require('compression');
var template = require('./lib/template.js');
var mysql = require('mysql');
var db = mysql.createConnection({
  host : 'localhost',
  user :'root',
  password : 'tmdgns0070',
  database : 'testlsh'
});
db.connect();


app.use(express.static('public'));
app.use(express.urlencoded({
  extended: false
}));
app.use(compression());
app.get('*', (request, response, next) => {
  fs.readdir('./data', function (err, filelist) {
    request.list = filelist;
    next();
  })
})

app.get('/', (request, response) => {
  var title = 'Welcome'
  var desciption = 'Hello, Nodejs'
  var list = template.list(request.list);
  var html = template.html(title, list,
    `
      <h2>${title}</h2>
      ${desciption}
      <img src = "/images/notebook.jpeg" style = "width:400px; display:block; margin-top:10px;">
      `,
    `<a href ="/create">create</a> `);

  response.send(html);
})

app.get('/page/:pageId', function (request, response, next) {
  var filteredId = path.parse(request.params.pageId).base;
  fs.readFile(`data/${filteredId}`, 'utf8', function (err, description) {
    if (err) {
      next(err);
    } else {
      var title = request.params.pageId;
      var sanitizedTitle = sanitizeHtml(title);
      var sanitizedDescription = sanitizeHtml(description, {
        allowedTags: ['h1']
      });
      var list = template.list(request.list);
      var html = template.html(sanitizedTitle, list,
        `<h2>${sanitizedTitle}</h2>${sanitizedDescription}`,
        ` <a href="/create">create</a>
            <a href="/update/${sanitizedTitle}">update</a>
            <form action="/delete" method="post">
              <input type="hidden" name="id" value="${sanitizedTitle}">
              <input type="submit" value="delete">
            </form>`
      );
      response.send(html);
    }
  });
});

app.get('/create', (request, response) => { //get 방식
  var title = 'WEB - create'
  var list = template.list(request.list);
  var html = template.html(title, list, `
    <form action="/create" method="post">
      <p><input type="text" name="title" placeholder="title"></p>
      <p>
        <textarea name = "description" placeholder="description"></textarea>
      </p>
      <p>
        <input type="submit" value="Submit">
      </p>
    </form>
    `, '');

  response.send(html);
});

app.post('/create', (request, response) => { //post방식
  var post = request.body;
  var title = post.title;
  var description = post.description;
  fs.writeFile(`data/${title}`, description, 'utf8', function (err) {
    response.redirect(`/page/${title}`);
  })
});

app.get('/update/:pageId', (request, response) => {
  var filteredId = path.parse(request.params.pageId).base;
  fs.readFile(`data/${filteredId}`, 'utf8', function (err, desciption) {
    var title = request.params.pageId;
    var list = template.list(request.list);
    var html = template.html(title, list,
      `
         <form action="/update" method="post">
         <input type="hidden" name="id" value="${title}">
      <p><input type="text" name="title" placeholder="title" value ="${title}"></p>
      <p>
        <textarea name = "description" placeholder="description">${desciption}</textarea>
      </p>
      <p>
        <input type="submit" value="Submit">
      </p>
    </form>
         `,
      `<a href ="/create">create</a> <a href="/update/${title}">update</a>`);
    response.send(html);
  });
})

app.post('/update', function (request, response) {
  var post = request.body;
  var id = post.id;
  var title = post.title;
  var description = post.description;
  fs.rename(`data/${id}`, `data/${title}`, function (error) {
    fs.writeFile(`data/${title}`, description, 'utf8', function (err) {
      response.redirect(`/${title}`);
    })
  });
});

app.post('/delete', (request, response) => {
  var post = request.body;
  var id = post.id;
  var filteredId = path.parse(id).base; //보안
  fs.unlink(`data/${filteredId}`, function (err) {
    response.redirect('/'); //express에서 리다이렉트

  })
});

//error 처리, 밑에서 사용
app.use((request, response, next) => {
  response.status(404).send('Sorry cant find that!');
})
//error handlers
app.use((err, request, response, next)=>{
  console.error(err.stack)
  response.status(500).send('Something broke!')
})

app.listen(port, () => {
  console.log(`Start server`);
})