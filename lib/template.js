module.exports = {
    html: function (title, list, body, control) {
      return `
      <!doctype html>
    <html>
    <head>
    <title>WEB1 - ${title}</title>
    <meta charset="utf-8">
    </head>
    <body>
    <h1><a href="/">WEB</a></h1>
    ${list}
    ${control}
    ${body}
    </body>
    </html>
    `;
    },
    list: function (topics) {
      var list = '<ul>';
  
      for (let i = 0; i < topics.length; i++) {
        list = list + `<li><a href="/page/${topics[i].id}">${topics[i].title}</a></li>`
      }
      list = list + '</ul>';
      return list;
    },
    authorSelect : function(authors, author_id){
      var tag = '';
      for(i=0; i<authors.length; i++){
        var selected ='';
        if(authors[i].id == author_id){
          selected = ' selected';
        }
        tag = tag+`<option value="${authors[i].id}"${selected}>${authors[i].name}</option>`
      }
      return `
      <select name="author">
      ${tag}
      </select>`
    }
  }

  