var express = require('express');
var mongoose = require('mongoose'),
    bodyParser = require('body-parser');

var db = mongoose.connect('mongodb://localhost/bookAPI');
var Book = require('./models/bookModel');

var app = express();

var port = process.env.PORT || 3000;

/* body parser has loaded, look at the body and see if any json object is in it,and
 if it does ,it take that json object and added it to req.body  */
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));

var bookRouter = express.Router();

bookRouter.route('/Books')
    .post(function (req, res) {
        var book = new Book(req.body);
        console.log(book);
        res.send(book);
    })
    .get(function (req, res) {
        var query = {};

        if (req.query.genre) {
            query.genre = req.query.genre;
        }

        Book.find(query, function (err, books) {
            if (err) {
                res.status(500).send(err);
            } else {
                res.json(books);
            }
        });
    });

bookRouter.route('/Books/:bookId')
    .get(function (req, res) {
        Book.findById(req.params.bookId, function (err, results) {
            if (err) {
                res.status(500).send(err);
            } else {
                res.json(results);
            }
        });
    });

app.use('/api', bookRouter);

app.get('/', function (req, res) {
    res.send('Welcome to my Api!');
});

app.listen(port, function () {
    console.log('Running on PORT: ' + port);
});