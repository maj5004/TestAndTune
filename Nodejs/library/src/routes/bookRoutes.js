var express = require('express');
var bookRouter = express.Router();
var books = [
    {
        title: 'war and peace'
        , genre: 'history'
        , author: 'lev tol'
        , read: false
    }
    , {
        title: 'fear and loathing'
        , genre: 'nonfiction'
        , author: 'hunter thompson'
        , read: true
    }
];
bookRouter.route('/').get(function (req, res) {
    res.render('bookListView', {
        title: 'Books'
        , nav: [{
                Link: '/Books'
                , Text: 'Books'
            }
            , {
                Link: '/Authors'
                , Text: 'Authors'
            }]
        , books: books
    });
});
bookRouter.route('/:id').get(function (req, res) {
    var id = req.params.id;
    res.render('bookView', {
        title: 'Books'
        , nav: [{
                Link: '/Books'
                , Text: 'Books'
            }
            , {
                Link: '/Authors'
                , Text: 'Authors'
            }]
        , book: books[id]
    });
    console.log("fuck" + id);
});
module.exports = bookRouter;