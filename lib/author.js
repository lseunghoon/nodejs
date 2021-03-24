var db = require('./db')
var template = require('./template.js');

exports.home = function (request, response) {
    db.query('select * from topic_test', (err, topics) => {
        db.query('select * from author', (err2, authors) => {
            var tag = template.authorTable(authors);
            var title = 'author';
            var list = template.list(topics);
            var html = template.html(title, list,
                `
                ${tag}
                <form action="/author/create_author_process" method="post">
                    <p>
                    <input type="text" name="name" placeholder="name">
                    </p>
                    <p>
                    <textarea name="profile" placeholder="description"></textarea>
                    </p>
                    <p>
                    <input type="submit" value="create">
                    </p>
            <style>
            table{
                border-collapse: collapse;
            }
            td{
                border:1px solid black;
            }
            </style>
            `,
                `
                `);
            response.send(html);
        })
    })
}

exports.create_process = function (request, response) {
    var post = request.body;
    db.query(`insert into author (name, profile) values(?,?)`, [post.name, post.profile], (err, result) => {
        if (err) {
            throw err;
        }
        response.redirect(`/author`);
    })
}

exports.update = function (request, response) {
    db.query('select * from topic_test', (err, topics) => {
        db.query('select * from author', (err2, authors) => {
            db.query('select * from author where id = ?', [request.params.pageId], (err3, author) => {
                var tag = template.authorTable(authors);
                var title = 'author';
                var list = template.list(topics);
                var html = template.html(title, list,
                    `
                    ${tag}
                    <form action="/author/update_process" method="post">
                        <p>
                            <input type="hidden" name="id" value="${request.params.pageId}">
                        </p>
                        <p>
                            <input type="text" name="name" placeholder="name" value="${author[0].name}">
                        </p>
                        <p>
                            <textarea name="profile" placeholder="description">${author[0].profile}</textarea>
                        </p>
                        <p>
                            <input type="submit" value="update">
                        </p>
                <style>
                table{
                    border-collapse: collapse;
                }
                td{
                    border:1px solid black;
                }
                </style>
                `,
                    `
                    `);
                response.send(html);

            })
        })
    })
}

exports.update_process = function (request, response) {
    var post = request.body;
    db.query(`update author set name = ?,profile=? where id =?`, [post.name, post.profile, post.id], (err, result) => {
        if (err) {
            throw err;
        }
        response.redirect(`/author`);
    })
}

exports.delete_process = function (request, response) {
    var post = request.body;
    db.query(`delete from topic_test where author_id =?`, Object.keys(post), (error, result1) => {
        if (error) {
            throw error
        }
        db.query(`delete from author where id =?`, Object.keys(post), (err, result) => {
            if (err) {
                throw err;
            }
            response.redirect(`/author`);
        })
    })

}