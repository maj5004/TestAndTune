/**
 * Created by maj5004 on 1/22/17.
 */
var CLScrapeEngine = require('./CLScrapeEngine');
var clScrape = new CLScrapeEngine;

clScrape.on('newPost', function (data) {
    console.log(data);
});

clScrape.on('test', function (data) {
    console.log(data);
})

clScrape.startSearch();
clScrape.test();