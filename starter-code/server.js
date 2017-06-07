'use strict';

// TODO: Install and require the NPM Postgres package 'pg' into your server.js, and ensure that it is then listed as a dependency in your package.json
const fs = require('fs');
const pg = require('pg');
const express = require('express');

// REVIEW: Require in body-parser for post requests in our server. If you want to know more about what this does, read the docs!
const bodyParser = require('body-parser');
const PORT = process.env.PORT || 3000;
const app = express();

// TODO: Complete the connection string for the url that will connect to your local postgres database
// Windows and Linux users; You should have retained the user/pw from the pre-work for this course.
// Your url may require that it's composed of additional information including user and password
// const conString = 'postgres://USER:PASSWORD@HOST:PORT/DBNAME';
// const conString = 'postgres://localhost:5433@postgres';
const conString = 'postgres://postgres:5036403149@localhost:5432/kilovolt';
console.log(conString);

// TODO: Our pg module has a Client constructor that accepts one argument: the conString we just defined.
//       This is how it knows the URL and, for Windows and Linux users, our username and password for our
//       database when client.connect is called on line 26. Thus, we need to pass our conString into our
//       pg.Client() call.
const client = new pg.Client(conString);

// REVIEW: Use the client object to connect to our DB.
client.connect();


// REVIEW: Install the middleware plugins so that our app is aware and can use the body-parser module
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static('./public'));


// REVIEW: Routes for requesting HTML resources
app.get('/new', function(request, response) {
  // COMMENT: What number(s) of the full-stack-diagram.png image correspond to the following line of code? Which method of article.js is interacting with this particular piece of `server.js`? What part of CRUD is being enacted/managed by this particular piece of code?
  // Put your response here...
  //RESPONSE: This is clearly in response to part 5 of our illustrious diagram,
  // for it is the response to the http request sent by the client. The Article.loadALL function handles this.
  // Finally, the R in 'CRUD' is being used. The app.get method is reading from the database, sending that to the client.
  response.sendFile('new.html', {root: './public'});
});


// REVIEW: Routes for making API calls to use CRUD Operations on our database
app.get('/articles', function(request, response) {
  // COMMENT: What number(s) of the full-stack-diagram.png image correspond to the following line of code? Which method of article.js is interacting with this particular piece of `server.js`? What part of CRUD is being enacted/managed by this particular piece of code?
  // Put your response here...
  // Step 3 of the diagram [query], is being done here. The controller is sending a query to the DB and then will eventually return results. This is Reading the data.
  // The portion of article.js that this refers to is Article.fetchAll. It calls loadall, passes in the results and invokes the callback.
  client.query('SELECT * FROM articles')
  .then(function(result) {
    response.send(result.rows);
  })
  .catch(function(err) {
    console.error(err)
  })
});

app.post('/articles', function(request, response) {
  // COMMENT: What number(s) of the full-stack-diagram.png image correspond to the following line of code? Which method of article.js is interacting with this particular piece of `server.js`? What part of CRUD is being enacted/managed by this particular piece of code?
  // Put your response here...
  // Now we are getting into part 4 of the diagram--Update in CRUD.
  // In article.js, we are looking at the Article.prototype.insertRecord method.
  client.query(
    `INSERT INTO
    articles(title, author, "authorUrl", category, "publishedOn", body)
    VALUES ($1, $2, $3, $4, $5, $6);
    `,
    [
      request.body.title,
      request.body.author,
      request.body.authorUrl,
      request.body.category,
      request.body.publishedOn,
      request.body.body
    ]
  )
  .then(function() {
    response.send('insert complete')
  })
  .catch(function(err) {
    console.error(err);
  });
});

app.put('/articles/:id', function(request, response) {
  // COMMENT: What number(s) of the full-stack-diagram.png image correspond to the following line of code? Which method of article.js is interacting with this particular piece of `server.js`? What part of CRUD is being enacted/managed by this particular piece of code?
  // Put your response here...
  // This section also deals exclusively with UPDATE in part 3 of our diagram. And in article.js, Article.prototype.updateRecord is the code section that handles this. 
  client.query(
    `UPDATE articles
    SET
      title=$1, author=$2, "authorUrl"=$3, category=$4, "publishedOn"=$5, body=$6
    WHERE article_id=$7;
    `,
    [
      request.body.title,
      request.body.author,
      request.body.authorUrl,
      request.body.category,
      request.body.publishedOn,
      request.body.body,
      request.params.id
    ]
  )
  .then(function() {
    response.send('update complete')
  })
  .catch(function(err) {
    console.error(err);
  });
});

app.delete('/articles/:id', function(request, response) {
  // COMMENT: What number(s) of the full-stack-diagram.png image correspond to the following line of code? Which method of article.js is interacting with this particular piece of `server.js`? What part of CRUD is being enacted/managed by this particular piece of code?
  // Put your response here...
  // The 'D' in Destroy! Delete works on part 3 (query) of our diagram. The method runs, in article.js, Article.prototype.deleteRecord.
  client.query(
    `DELETE FROM articles WHERE article_id=$1;`,
    [request.params.id]
  )
  .then(function() {
    response.send('Delete complete')
  })
  .catch(function(err) {
    console.error(err);
  });
});

app.delete('/articles', function(request, response) {
  // COMMENT: What number(s) of the full-stack-diagram.png image correspond to the following line of code? Which method of article.js is interacting with this particular piece of `server.js`? What part of CRUD is being enacted/managed by this particular piece of code?
  // Put your response here...
  // Part 3, query, but with the article.js section Article.truncateTable() being called. This deals with the 'D' in destroy.
  client.query(
    'DELETE FROM articles;'
  )
  .then(function() {
    response.send('Delete complete')
  })
  .catch(function(err) {
    console.error(err);
  });
});

// COMMENT: What is this function invocation doing?
// Put your response here...
// This is calling the function on around line 187. It is loading the DB or creating it from scratch.
loadDB();

app.listen(PORT, function() {
  console.log(`Server started on port ${PORT}!`);
});


//////// ** DATABASE LOADER ** ////////
////////////////////////////////////////
function loadArticles() {
  // COMMENT: What number(s) of the full-stack-diagram.png image correspond to the following line of code? Which method of article.js is interacting with this particular piece of `server.js`? What part of CRUD is being enacted/managed by this particular piece of code?
  // Put your response here...
  // John and Meryl say this section corresponds with part 4 of the diagram--result. Also, the 'R' in CRUD. This bloc calls Article.loadAll, as they both use 'rows'. It creates a new instance of Article and pushes it into the correct element.
  client.query('SELECT COUNT(*) FROM articles')
  .then(result => {
    // REVIEW: result.rows is an array of objects that Postgres returns as a response to a query.
    //         If there is nothing on the table, then result.rows[0] will be undefined, which will
    //         make count undefined. parseInt(undefined) returns NaN. !NaN evaluates to true.
    //         Therefore, if there is nothing on the table, line 151 will evaluate to true and
    //         enter into the code block.
    if(!parseInt(result.rows[0].count)) {
      fs.readFile('./public/data/hackerIpsum.json', (err, fd) => {
        JSON.parse(fd.toString()).forEach(ele => {
          client.query(`
            INSERT INTO
            articles(title, author, "authorUrl", category, "publishedOn", body)
            VALUES ($1, $2, $3, $4, $5, $6);
          `,
            [ele.title, ele.author, ele.authorUrl, ele.category, ele.publishedOn, ele.body]
          )
        })
      })
    }
  })
}

function loadDB() {
  // : What number(s) of the full-stack-diagram.png image correspond to the following line of code? Which method of article.js is interacting with this particular piece of `server.js`? What part of CRUD is being enacted/managed by this particular piece of code?
  // Put your response here...
  // This section is 'C' in CRUD and is part 3, query. It checks against the DB to see if the desired information exists and if it doesn't, it creates the table/database for our ease of use.
  client.query(`
    CREATE TABLE IF NOT EXISTS articles (
      article_id SERIAL PRIMARY KEY,
      title VARCHAR(255) NOT NULL,
      author VARCHAR(255) NOT NULL,
      "authorUrl" VARCHAR (255),
      category VARCHAR(20),
      "publishedOn" DATE,
      body TEXT NOT NULL);`
    )
    .then(function() {
      loadArticles();
    })
    .catch(function(err) {
      console.error(err);
    }
  );
}
