

const express = require ('express');

const bodyParser = require('body-parser')

const pool = require('./db')

const app = express();

app.set('view engine', 'ejs');

app.listen(7000,()=>{ console.log('server is running on port 7000') });

app.use(express.static('public'));

app.use(express.json());
app.use(express.urlencoded({extended:false}));

//ROUTE

app.get('/',(req,res)=>{

  res.render('home',{title:'Home Page'})
});


app.get('/about', (req,res)=>{

  res.render('about',{title:'About'})
})


//get all books
app.get('/books', async (req,res)=>{

  try{

    const sql = "SELECT * FROM book_table ORDER BY book_id ASC";

    const allBooks =  await pool.query(sql, [], (err, result) => {
      if (err) {
        return console.log(`Something went wrong :${err.message}`);
      } else {
        res.render('books', { title: 'Book', model: result.rows });
      }
    });

  } catch (err){
    console.log(err.message)
  }
});


//edit a single book 
app.get("/edit/:id", async (req,res)=>{

  try{  

    const book_id = req.params.id;
    const sql = "SELECT * FROM book_table WHERE book_id= $1 "
  
    const editBook = pool.query(sql, [book_id], (err,result)=>{
      if(err){
        console.log(`Something went wrong :${err.message}`)
      } else {
        console.log(req.params)
        res.render("edit", {title: 'edit', model: result.rows[0]})
      }
    });

  } catch (err){
    console.log(err.message)
  }
});


//update book
app.post("/edit/:id", async (req,res)=>{

  try{

    const id = req.params.id;
    const inputData = [req.body.author, req.body.title, req.body.comment, id];
    const sql = "UPDATE book_table SET author = $1, title = $2, comment = $3 WHERE (book_id = $4)";
  
    const updateBook = await pool.query(sql, inputData, (err,result)=>{
      if (err) {
        console.log(`Something went wrong :${err.message}`)
      } else {
        res.redirect("/books");
      };
  
    });

  } catch  (err){
    console.log(err.message)
  }

});


//render add new book input form
app.get("/create", (req, res) => {
  res.render("create", { model: {}, title:'Create new book' }); //don't foget the {model} <==
});


//create a new book
app.post('/create', async (req,res)=>{

  try{

    const sql = "INSERT INTO book_table (author, title, comment) VALUES ($1, $2, $3)" ;
    const inputData = [req.body.author, req.body.title, req.body.comment];
  
    const newBook = await pool.query(sql, inputData, (err,result)=>{
      if (err) {
        console.log(`Something went wrong :${err.message}`)
      } else {
        res.redirect("/books");
      };
    });

  } catch (err){
    console.log(err.message)
  }

});


//render the delete form
app.get("/delete/:id", async (req, res) => {

  try{

    const id = req.params.id;
    const sql = "SELECT * FROM book_table WHERE book_id = $1";
  
    const deleteBook = await pool.query(sql, [id], (err, result) => {
      if (err){
        console.log(`Something went wrong :${err.message}`)
      } else {
        res.render("delete", {title :'Delete book', model: result.rows[0]}); 
      }
    });

  } catch(err){
    console.log(err.message)
  }
});

//delete route

app.post("/delete/:id", async (req,res)=>{

  try{

    const id = req.params.id;
    const sql = "DELETE FROM book_table WHERE book_id = $1";
    const deleteBook = await pool.query(sql, [id], (err, result) => {
      
      if (err){
        console.log(`Something went wrong :${err.message}`)
      } else{
        res.redirect("/books");
      }
    });

  } catch (err){
    console.log(err.message)
  }
});

