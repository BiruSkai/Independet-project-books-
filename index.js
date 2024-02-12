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

app.get("/", async(req, res) => {
        const {sort} = req.query;
        console.log("sort: ", sort)
        // let fetchImage = axios.get(`https://covers.openlibrary.org/b/${key}/${value}-L.jpg`)

        let fetchBooksDb;

        switch (sort) {
                case sort === "title":
                        fetchBooksDb = await db.query("SELECT * FROM books ORDER BY title ASC");
                        break;
                case sort === "time":
                        fetchBooksDb = await db.query("SELECT * FROM books ORDER BY time DESC");
                        break;
                default:
                        fetchBooksDb = await db.query("SELECT * FROM books ORDER BY rating DESC");
        }
        
        let dataBooks = fetchBooksDb.rows;
        console.log("dataBooks: ", dataBooks);
        
        res.render("index.ejs", {dataBooks});
})

app.get("/notes", async(req, res) => {
        const {id} = parseInt(req.params);

        const fetchBookId = await db.query("SELECT * FROM books WHERE id = $1", [id]);
        let dataBookId = fetchBookId.rows[0];
        console.log("dataBookId: ", dataBookId);

        res.render("notes.ejs", {dataBookId});
})

app.listen(port, () => {
        console.log("Server listening to port: ", port);
})