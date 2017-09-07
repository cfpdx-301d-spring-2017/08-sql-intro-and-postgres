'use strict'

// TODO-done: Install and require the NPM Postgres package 'pg' into your server.js, and ensure that it is then listed as a dependency in your package.jsonn
const fs = require('fs')
const express = require('express')

// REVIEW: Require in body-parser for post requests in our server. If you want to know more about what this does, read the docs!
const bodyParser = require('body-parser')
const PORT = process.env.PORT || 3000
const app = express()

// TODO-done: Complete the connection string for the url that will connect to your local postgres database
// Windows and Linux users; You should have retained the user/pw from the pre-work for this course.
// Your url may require that it's composed of additional information including user and password
// const conString = 'postgres://USER:PASSWORD@HOST:PORT/DBNAME';
const conString = 'postgres://localhost:5432/kilovolt'

// TODO-done: Our pg module has a Client constructor that accepts one argument: the conString we just defined.
//       This is how it knows the URL and, for Windows and Linux users, our username and password for our
//       database when client.connect is called on line 26. Thus, we need to pass our conString into our
//       pg.Client() call.
const pg = require ("pg");
const client = new pg.Client(conString)

// REVIEW: Use the client object to connect to our DB.
client.connect()

// REVIEW: Install the middleware plugins so that our app is aware and can use the body-parser module
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: true}))
app.use(express.static('./public'))

// REVIEW: Routes for requesting HTML resources
app.get('/new', function (request, response) {
  // COMMENT - done: What number(s) of the full-stack-diagram.png image correspond to the following line of code? Which method of article.js is interacting with this particular piece of `server.js`? What part of CRUD is being enacted/managed by this particular piece of code?
  // Put your response here...
  // Number 5 on the full-stack diagram corresponds to the following line of code. Trick question for the second two questions, because its loading new.html rather than index.html, and CRUD is a feature of SQL.
  response.sendFile('new.html', {root: './public'})
})

// REVIEW: Routes for making API calls to use CRUD Operations on our database
app.get('/articles', function (request, response) {
  // COMMENT - done: What number(s) of the full-stack-diagram.png image correspond to the following line of code? Which method of article.js is interacting with this particular piece of `server.js`? What part of CRUD is being enacted/managed by this particular piece of code?
  // Put your response here...
  // Number 3 on the full-stack diagram corrsponds to the following line of code. The article.fetchAll method is interacting with thid piece of 'server.js'. READ is the part of CRUD being enacted.
  client.query('SELECT * FROM articles')
  .then(function (result) {
    response.send(result.rows)
  })
  .catch(function (err) {
    console.error(err)
  })
})

app.post('/articles', function (request, response) {
  // COMMENT - done: What number(s) of the full-stack-diagram.png image correspond to the following line of code? Which method of article.js is interacting with this particular piece of `server.js`? What part of CRUD is being enacted/managed by this particular piece of code?
  // Put your response here...
  // Number 3 on the full-stack diagram corresponds to the following line of code. The article.fetchAll method is interacting with this piece of 'server.js'. CREATE is the part of CRUD being enacted.
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
  .then(function () {
    response.send('insert complete')
  })
  .catch(function (err) {
    console.error(err)
  })
})

app.put('/articles/:id', function (request, response) {
  // COMMENT - done: What number(s) of the full-stack-diagram.png image correspond to the following line of code? Which method of article.js is interacting with this particular piece of `server.js`? What part of CRUD is being enacted/managed by this particular piece of code?
  // Put your response here...
  //This is number 3 of the FS diagram that corresponds to the following line of code.  insertRecord() is the method of article.js that is interacting with this piece of server.js.  This is updating the article, so it would be the U of CRUD.
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
  .then(function () {
    response.send('update complete')
  })
  .catch(function (err) {
    console.error(err)
  })
})

app.delete('/articles/:id', function (request, response) {
  // COMMENT-DONE: What number(s) of the full-stack-diagram.png image correspond to the following line of code? Which method of article.js is interacting with this particular piece of `server.js`? What part of CRUD is being enacted/managed by this particular piece of code?
  // Put your response here...
  // This is number 3 of the FS diagram that corresponds to the following line of code.  deleteRecord() is the method of article.js that is interacting with this piece of server.js.  This is deleting the article, so it would be the D of CRUD.
  client.query(
    `DELETE FROM articles WHERE article_id=$1;`,
    [request.params.id]
  )
  .then(function () {
    response.send('Delete complete')
  })
  .catch(function (err) {
    console.error(err)
  })
})

app.delete('/articles', function (request, response) {
  // COMMENT-DONE: What number(s) of the full-stack-diagram.png image correspond to the following line of code? Which method of article.js) is interacting with this particular piece of `server.js`? What part of CRUD is being enacted/managed by this particular piece of code?
  // Put your response here...
  // This is number 3 of the FS diagram that corresponds to the following line of code.  deleteRecord() is the method of article.js that is interacting with this piece of server.js.  This is deleting the article, so it would be the D of CRUD.
  client.query(
    'DELETE FROM articles;'
  )
  .then(function () {
    response.send('Delete complete')
  })
  .catch(function (err) {
    console.error(err)
  })
})

// COMMENT-DONE: What is this function invocation doing?
// Put your response here... loadDB creates and populates the table "articles" if it doesn't already exist. 
loadDB()

app.listen(PORT, function () {
  console.log(`Server started on port ${PORT}!`)
})

/// ///// ** DATABASE LOADER ** ////////
/// /////////////////////////////////////
function loadArticles () {
  // COMMENT-DONE: What number(s) of the full-stack-diagram.png image correspond to the following line of code? Which method of article.js is interacting with this particular piece of `server.js`? What part of CRUD is being enacted/managed by this particular piece of code?
  // Put your response here...
  // This is number 3 of the FS diagram that corresponds to the following line of code. fetchAll() (If wrong blame Meryl)  is the method of article.js that is interacting with this piece of server.js.  This is updating the articles table, so it would be the U of CRUD.
  client.query('SELECT COUNT(*) FROM articles')
  .then(result => {
    // REVIEW: result.rows is an array of objects that Postgres returns as a response to a query.
    //         If there is nothing on the table, then result.rows[0] will be undefined, which will
    //         make count undefined. parseInt(undefined) returns NaN. !NaN evaluates to true.
    //         Therefore, if there is nothing on the table, line 151 will evaluate to true and
    //         enter into the code block.
    if (!parseInt(result.rows[0].count)) {
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

function loadDB () {
  // COMMENT -DONE: What number(s) of the full-stack-diagram.png image correspond to the following line of code? Which method of article.js is interacting with this particular piece of `server.js`? What part of CRUD is being enacted/managed by this particular piece of code?
  // Put your response here...
  // This is number 3 of the FS diagram that corresponds to the following line of code. fetchAll() (If wrong blame Meryl (kick her out!))  is the method of article.js that is interacting with this piece of server.js. This is creating the articles table, so it would be the C of CRUD.
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
    .then(function () {
      loadArticles()
    })
    .catch(function (err) {
      console.error(err)
    }
  )
}
