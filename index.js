const connection = require('./conn');
const express = require('express');
const bodyParser = require('body-parser');

const app = express();

app.set("view engine", "ejs");

app.use(bodyParser.urlencoded({extended: true}));

app.use(express.static("public"));

app.get("/", function (req, res) {
    connection.query(' select title, genre_name, country_name, language_name, DATE_FORMAT(release_year, "%d-%m-%Y") AS date_only, rating from movie inner join genre on movie.genre_id = genre.genre_id inner join language on movie.language_id = language.language_id inner join country on movie.country_id = country.country_id order by cast(rating as decimal(10,2)) desc;', (err, data)=>{
        if(err){
            throw err;
        }
        else{
            // console.log(data);
            res.render("index", {title: "Moive's", action:'list', sampleData:data});
        }
    });
    
});

app.get("/all", function (req, res) {
    connection.query('select movie_id, title, genre_name, country_name, language_name, DATE_FORMAT(release_year, "%d-%m-%Y") AS date_only, rating from movie inner join genre on movie.genre_id = genre.genre_id inner join language on movie.language_id = language.language_id inner join country on movie.country_id = country.country_id;', (err, data)=>{
        if(err){
            throw err;
        }
        else{
            // console.log(data);
            res.render("all", {title: "Moive's", action:'list', sampleData:data});
        }
    });
    
});

app.get("/add", function(req,res){
    connection.query('select * from genre', (err, gresult)=>{
        if(err){
            console.log(err);
        }
        else{
            connection.query('select * from language', (err, lresult)=>{
                if(err){
                    console.log(err);
                }
                else{
                    connection.query('select * from country', (err, cresult)=>{
                        if(err){
                            console.log(err);
                        }
                        else{
                            res.render("add",{gdata:gresult, ldata:lresult, cdata:cresult});
                        }
                    })
                }
            })
        }
    })
});

app.post('/add', (req,res)=>{
    const name = req.body.mname;
    const genre = req.body.genre;
    const country = req.body.country;
    const language = req.body.language;
    const date = req.body.release;
    const rating = req.body.rating;
    connection.query('insert into movie(title, genre_id, country_id, language_id, release_year, rating) values(?,?,?,?,?,?)',[name,genre,country,language,date,rating],(err,result)=>{
        if(err){
            console.log(err);
        }
        else{
            res.redirect("/");
        }
    })
});

app.get("/update", function(req,res){
    connection.query('select * from genre', (err, gresult)=>{
        if(err){
            console.log(err);
        }
        else{
            connection.query('select * from language', (err, lresult)=>{
                if(err){
                    console.log(err);
                }
                else{
                    connection.query('select * from country', (err, cresult)=>{
                        if(err){
                            console.log(err);
                        }
                        else{
                            res.render("update",{gdata:gresult, ldata:lresult, cdata:cresult});
                        }
                    })
                }
            })
        }
    })
});

app.post('/update', (req, res) => {
    const id = req.body.mid;
    const title = req.body.mname;
    const language_id = req.body.language;
    const country_id = req.body.country;
    const genre_id = req.body.genre;
    const release_year = req.body.release;
    const rating = req.body.rating;

    connection.query('update movie set title=?, genre_id=?, country_id=?, language_id=?, release_year=?, rating=? where movie_id=?', [title, genre_id, country_id, language_id, release_year, rating, id], (err, result)=>{
        if(err){
            console.log(err);
        }
        else{
            res.redirect('/');
        }
    })

});

app.get('/delete', (req,res)=> {
    res.render("delete");
});

app.post('/delete', (req,res)=> {
    const name = req.body.mname;
    connection.query('delete from movie where title=?',[name],(err,result)=>{
        if(err){
            console.log(err);
        }
        else{
            res.redirect("/");
        }
    })
})

app.get('/search', (req, res)=>{
    res.render("search", {Md:0});
})

app.post('/search', (req, res)=>{
    const name = req.body.mname;
    connection.query('select title, genre_name, country_name, language_name, DATE_FORMAT(release_year, "%d-%m-%Y") AS date_only, rating from movie inner join genre on movie.genre_id = genre.genre_id inner join language on movie.language_id = language.language_id inner join country on movie.country_id = country.country_id where title=?',[name], (err, data)=>{
        if(err){
            throw err;
        }
        else{
           res.render("search", {Md:data});
        }
    })
});

app.get('/reviews', (req, res)=>{

    connection.query("select * from reviews", (err, data)=>{
        if(err){
            throw err;
        }
        else{
            res.render("reviews", {reviews:data});
        }
    })
});

app.post('/reviews', (req,res) => {
    const name = req.body.username;
    const movie = req.body.mname;
    const review = req.body.review;
    const rating = req.body.rating;

    connection.query('insert into reviews(userName, title, review, rating) values(?,?,?,?)', [name, movie, review, rating], (err, result)=>{
        if(err){
            throw err;
        }
        else{
            res.redirect("/reviews");
        }
    })
})

app.get('/nowStm', (req, res)=>{
    connection.query('select * from bookings', (err, data) => {
        if(err){
            throw err;
        }
        else{
            const a = [];
            for(var i = 0; i<data.length; i++){
                a[i] = data[i].seatNo;
            }
            res.render("nowStm", {seat: a});
        }
    })
    
});

app.post('/nowStm', (req, res) => {
    const mname = req.body.mname;
    const date = req.body.dob;
    const timeSlot = req.body.timeSlot;
    const seatNo = req.body.seatNo;

    connection.query('insert into bookings(movieTitle, bookingDate, timeSlot, seatNo) values(?,?,?,?)', [mname, date, timeSlot, seatNo], (err, result) => {
        if(err){
            res.redirect('/nowStm');
        }
        else{
            res.redirect('/nowStm');
        }
    } )
});

app.get('/admin', (req, res) => {
    connection.query('select count(seatNo) as seatCount from bookings', (err, data) => {
        if(err){
            console.log(err);
        }
        else{
            connection.query('select seatNo from bookings', (err, sdata) => {
                if(err){
                    console.log(err);
                }
                else{
                    const all = [];
                    let a = 0;
                    let b = 0;
                    let c = 0;
                    for(var i = 0; i<sdata.length; i++){
                        all[i] = sdata[i].seatNo;
                    }
                    for(var i = 1; i<=20; i++){
                        if(all.includes(i)){
                            a++;
                        }
                    }
                    for(var i = 21; i<=40; i++){
                        if(all.includes(i)){
                            b++;
                        }
                    }
                    for(var i = 41; i<=60; i++){
                        if(all.includes(i)){
                            c++;
                        }
                    }
                    var totalProfite = a*150+b*300+c*500;
                    res.render('admin', {sc: data, exective:a, club:b, royal: c, tp:totalProfite});
                }
            })
            
        }
    })
});

app.post('/admin', (req, res) => {
    connection.query('delete from bookings', (err, result) => {
        if(err){
            console.log(err);
        }
        else{
            res.redirect('/admin');
        }
    })
})

app.listen(3000, ()=> {
    console.log("Express server is running on port 3000");
});