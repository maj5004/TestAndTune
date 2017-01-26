/**
 * Created by maj5004 on 1/22/17.
 */
var CLScrapeEngine = require('./CLScrapeEngine');
var clScrape = new CLScrapeEngine;
var emailer = require('./CLScrapeEmailer.js');


clScrape.on('newPost', function (data) {
    // console.log(data);
    emailer.sendEmailAlert(data);
});

clScrape.on('test', function (data) {
    console.log(data);
});

clScrape.startSearch();
clScrape.test();