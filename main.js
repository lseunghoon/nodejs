const express = require('express')
const app = express()
const port = 3000
var compression = require('compression');
var template = require('./lib/template.js');
var db = require('./lib/db')


app.use(express.static('public'));
app.use(express.urlencoded({
  extended: false
}));
app.use(compression());

app.get('/', (request, response) => {
  db.query('select * from topic_test', (err, topics) => {
    var title = 'Welcome'
    var desciption = 'Hello, Nodejs'
    var list = template.list(topics);
    var html = template.html(title, list,
      `
        <h2>${title}</h2>
        ${desciption}
        <img src = "/images/notebook.jpeg" style = "width:400px; display:block; margin-top:10px;">
        `,
      `<a href ="/create">create</a> `);

    response.send(html);
  })
})

app.get('/page/:pageId', function (request, response, next) {
  db.query('select * from topic_test', (err, topics) => {
    if (err) {
      throw err;
    }
    //해당 id의 데이터만 읽기
    db.query(`select * from topic_test left join author on topic_test.author_id = author.id where topic_test.id = ?`, [request.params.pageId], (err2, topic) => {
      if (err2) {
        throw err2;
      }
      //불러온 sql 데이터는 객체이므로 [0]을 해줌
      var title = topic[0].title
      var desciption = topic[0].description
      var list = template.list(topics); //전체 topic 리스트
      var html = template.html(title, list,
        `
          <h2>${title}</h2>
          ${desciption}
          <p>by ${topic[0].name}</p>
          `,
        `<a href="/create">create</a>
          <a href="/update/${request.params.pageId}">update</a>
          <form action="/delete" method="post">
            <input type="hidden" name="id" value="${request.params.pageId}">
            <input type="submit" value="delete">
          </form>`);

      response.send(html);
    })
  })
});

app.get('/create', (request, response) => {
  //author 테이블에서 데이터 가져와서 author select 만들기
  db.query('select * from topic_test', (err, topics) => {
    db.query('select * from author', (err, authors) => {
      var title = 'Create';
      var list = template.list(topics);
      var html = template.html(title, list,
        `
      <form action="/create" method="post">
        <p><input type="text" name="title" placeholder="title"></p>
        <p>
          <textarea name = "description" placeholder="description"></textarea>
        </p>
        <p>
          ${template.authorSelect(authors)}
        </p>
        <p>
          <input type="submit" value="Submit">
        </p>
      </form>
      `, `<a href="/create">create</a>`);

      response.send(html);
    })
  })
});

app.post('/create', (request, response) => {
  var post = request.body;
  //데이터베이스에 데이터 추가하기
  db.query(`insert into topic_test (title, description, created, author_id) values(?,?,now(), ?)`, [post.title, post.description, post.author /* author_id는 select 태그에서 name속성 */ ], (err, result) => {
    if (err) {
      throw err;
    } else {
      //result.insertId 삽입한 행의 id값으로 리다이렉트
      response.redirect(`/page/${result.insertId}`);
    }
  })
});

app.get('/update/:pageId', (request, response) => {
  db.query('select * from topic_test', (err, topics) => {
    if (err) {
      throw err;
    }
    db.query(`select * from topic_test where id = ?`, [request.params.pageId], (err2, topic) => {
      if (err2) {
        throw err2;
      }
      db.query('select * from author', (err, authors) => {
        var title = topic[0].title
        var desciption = topic[0].description
        var list = template.list(topics);
        var html = template.html(title, list,
          `
           <form action="/update" method="post">
           <input type="hidden" name="id" value="${topic[0].id}">
        <p><input type="text" name="title" placeholder="title" value ="${title}"></p>
        <p>
          <textarea name = "description" placeholder="description">${desciption}</textarea>
        </p>
        <p>
        ${template.authorSelect(authors, topic[0].author_id)}
        </p>
        <p>
          <input type="submit" value="Submit">
        </p>
      </form>
           `,
          `<a href ="/create">create</a> <a href="/update/${topic[0].id}">update</a>`);

        response.send(html);
      })
    })
  })
});

app.post('/update', function (request, response) {
  var post = request.body;
  //데이터베이스 데이터 업데이트
  db.query(`update topic_test set title = ?, description =?,author_id=? where id = ?`, [post.title, post.description, post.author, post.id], (err, result) => {
    if (err) {
      throw err;
    } else {
      response.redirect(`/page/${post.id}`);
    }
  })
});

app.post('/delete', (request, response) => {
  //데이터베이스 해당 id 행 삭제
  var post = request.body;
  db.query(`DELETE FROM topic_test WHERE id = ?`, [post.id], (err, result) => {
    if (err) {
      throw err;
    } else {
      response.redirect('/');
    }
  })
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