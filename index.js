const express = require('express');
const axios = require('axios');
const app = express();
const path = require('path');
const mongoose = require('mongoose');
mongoose.connect('mongodb://127.0.0.1:27017/users')
.then(() => {
    console.log('CONNECTION OPEN!!!');
})
.catch(err => {
    console.log("MISSION FAILED، WE'LL GET THEM NEXT TIME!");
    console.log(err);
})

const showSchema = new mongoose.Schema({
    _id: Number,
    name: String,
    image: String,
    premiereDate: String,
    rating: Number
})
const Show = mongoose.model('Show', showSchema);


app.use(express.static('public'))
app.use(express.json());

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '/views'));

app.get('/', (req, res) => {
    res.render('home.ejs');
})

app.get('/list', async (req, res) => {
    const shows = await Show.find();
    res.render('list.ejs', { shows, preview: false });
})

app.post('/list', async (req, res) => {
    const show = new Show(req.body.show);
    await show.save();
    res.send(show);
})

app.delete('/list', async (req, res) => {
    await Show.findByIdAndDelete(req.body._id);
    res.send('response');
})

app.get('/search', async (req, res) => {
    const { q } = req.query;
    const config = { params: { q } };
    const showResults = await axios.get('https://api.tvmaze.com/search/shows', config);
    res.render('search.ejs', { q, preview: true, showResults: showResults.data });
})

app.use((req, res) => {
    res.status(404).render('notfound.ejs');
})


app.listen(8080, () => {
    console.log('listening on port 8080');
})