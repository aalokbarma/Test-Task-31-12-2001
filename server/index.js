const express = require("express");
const mysql = require("mysql");
const cors = require("cors");
const bodyParser = require('body-parser');

const app = express()
const corsOptions = {
    origin: ["http://localhost:3000"],
    credentials: true,
    optionSuccessStatus: 200,
    methods: ["GET", "POST", "PUT", "DELETE"],
}

const db = mysql.createConnection({
    user: "root",
    host: "localhost",
    password: "",
    database: "test",
});

app.use(bodyParser.json())
app.use(cors(corsOptions));
app.use(express.json());

app.post("/api/addMovies", (req, res) => {
    const {url, name , rating} = req.body


    let sqlCheck = "SELECT * FROM movies"

    db.query(sqlCheck, (err, result) => {
        if(err){
            res.send(err)
        }
        const status = result?.filter(function(item){
            return item.name.toLowerCase() === name.toLowerCase()
        })

        console.log(status)

        if (status[0]?.id){
            console.log("chal raha hai")

            let updateSql = "UPDATE movies SET url=" +"'" + url + "'" + "," + "rating=" + rating + " "+ "WHERE id=" + status[0]?.id + ";" 


            // UPDATE movies SET url=https://cdn.bollywoodmdb.com/movies/largethumb/2020/the-big-bull-an-unreal-story/poster.jpg rating=8.1 WHERE name=BigBull;

            db.query(updateSql, (err, result) => {
                if (err) console.log(err)
                res.send(result)
            })
        }
        else{
            // if(status == []){
                console.log("Insert Running")
                let sql = "INSERT INTO movies (name, url, rating) VALUES (?,?,?)"
            
                db.query(sql,[name, url, rating], (err, result) => {
                    if(err){
                        res.send(err)
                    }
                    res.send({message: "Movie Has Been Added"})
                })
            // } 
            // else{
            //     console.log("Else Running");
            // }
        }

    })
})
app.get("/api/movies", (req, res) => {

    let sql = "SELECT * FROM movies"

    db.query(sql, (err, result) => {
        if(err){
            res.send(err)
        }
        res.send(result)
    })
})


app.listen(3001, () => {
    console.log("Yey, your server is running on port 3001");
});