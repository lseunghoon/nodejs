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
    <a href="/author">author</a>
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
    },
    authorTable : function(authors){
      var tag = '<table>';
            
            for(i=0; i<authors.length; i++){
                tag = tag + `
                <tr>
                    <td>${authors[i].name}</td>
                    <td>${authors[i].profile}</td>
                    <td><a href="/author/update/${authors[i].id}">update</a></td>
                    <td>
                    <form action="/author/delete" method="post">
                      <input type="hidden" name="${authors[i].id}" value="">
                      <input type="submit" value="delete">
                    </form>
                    </td>
                </tr>
                `
            }
            tag+='</table>'
            return tag;
    }
  }

  