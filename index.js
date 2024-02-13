import express from "express";
import pg from "pg";
import axios from "axios";

const app = express();
const port = 3000;
const db = new pg.Client({
        user:"postgres",
        password:"postgres",
        database:"Books",
        host:"localhost",
        post:5432
});

db.connect();
app.use(express.urlencoded({extended:true}));
app.use(express.static("public"));

let bookListLength;

app.get("/", async(req, res) => {
        const {sort} = req.query;
        console.log("sort: ", sort)

        let fetchBooksDb;

        switch (sort) {
                case "title":
                        try {
                                fetchBooksDb = await db.query("SELECT * FROM books ORDER BY title ASC");
                        } catch (error) {
                                console.log(error)
                        }
                        break;
                case "newest":
                        try {
                                fetchBooksDb = await db.query("SELECT * FROM books ORDER BY time DESC");
                        } catch (error) {
                                console.log(error)
                        }
                        break;
                default:
                        try {
                                fetchBooksDb = await db.query("SELECT * FROM books ORDER BY rating DESC");
                        } catch (error) {
                                console.log(error)
                        }
        }
        
        let dataBooks = fetchBooksDb.rows;
        console.log("dataBooks sort: ", dataBooks.map(book => book.time))

        bookListLength = dataBooks.length;
        // console.log("dataBooks, bookListLength: ", dataBooks, bookListLength);
        
        res.render("index.ejs", {dataBooks});
})

app.get("/notes/:id", async(req, res) => {
        const id = parseInt(req.params.id);
        console.log("id: ", id)

        try {
                const fetchBookId = await db.query("SELECT * FROM books WHERE id = $1", [id]);
                let dataBookId = fetchBookId.rows[0];
                console.log("dataBookId: ", dataBookId);

                res.render("notes.ejs", {dataBookId, bookListLength});
        } catch (error) {
                console.log(error)
        }
        
})

app.get("/add", (req, res) => {
        const queries= ["title", "author", "website", "isbn"];

        res.render("add.ejs", {queries});
})

app.get("/update/:id", async (req, res) => {
        const id = parseInt(req.params.id);
        console.log("get update id: ", id);

        try {
                const queries= ["title", "author", "website", "isbn"];

                const fetchBookId = await db.query("SELECT * FROM books WHERE id = $1", [id]);
                let dataBookId = fetchBookId.rows[0];
                console.log("get update dataBookId: ", dataBookId);

                res.render("add.ejs", {queries, dataBookId})
        } catch (error) {
                console.log(error)

                const queries= ["title", "author", "website", "isbn"];
                res.render("add.ejs", {error:"Can not fetch this boook data to upate. Try again.", queries})
        }
        
})

app.post("/add", async (req, res) => {
        let {title, author, website, isbn, rating, summary, notes} = req.body;

        rating = parseInt(rating);
        console.log("title, author, website, isbn, rating: ", title, author, website, isbn, rating);
        // console.log("summary: ", summary);
        // console.log("notes: ", notes);

        try {
                await db.query("INSERT INTO books(title,author,website,isbn,rating,summary,notes) VALUES ($1,$2,$3,$4,$5,$6,$7)", [title, author, website, isbn, rating, summary, notes]);
                
                res.redirect("/");
        } catch (error) {
                console.log(error);

                const queries= ["title", "author", "website", "isbn"];
                res.render("add.ejs", {error:"Problem occured in saving your new book. Try again.", queries})
        }
        
})

app.post("/delete/:id", async(req, res) => {
        const id = parseInt(req.params.id);
        console.log("/delete id: ", id);

        try {
                await db.query("DELETE FROM books WHERE id = $1", [id]);
                res.redirect("/");
        } catch (error) {
                console.log(error)

                const queries= ["title", "author", "website", "isbn"];
                res.render("add.ejs", {error:`Can not delete the book.`, queries})
        }
})

app.listen(port, () => {
        console.log("Server listening to port: ", port);
})