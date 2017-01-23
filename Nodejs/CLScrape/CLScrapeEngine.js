var request = require('request');
var cheerio = require('cheerio');
var fs = require('fs');
var diff = require('deep-diff').diff;
var util = require('util');
var EventEmitter = require('events').EventEmitter;

//Constructor
function CLScrapeEngine() {
    EventEmitter.call(this)
}
util.inherits(CLScrapeEngine, EventEmitter);

var host = 'https://nh.craigslist.org';
var section = '/search/cto';
var searchString = 'cherokee -grand';
searchString = encodeURIComponent(searchString);
searchString = '?query=' + searchString;
var sortBy = '&sort=date';
var minPrice = '';
minPrice = '&min_price=' + minPrice;
var maxPrice = '';
maxPrice = '&max_price=' + maxPrice;
var minYear = '';
minYear = '&min_auto_year=' + minYear;
//var maxYear = '1999';
var maxYear = '';
maxYear = '&max_auto_year=' + maxYear;
var minMiles = '';
minMiles = '&min_auto_miles=' + minMiles;
var maxMiles = '';
maxMiles = '&max_auto_miles=' + maxMiles;

var url = host + section + searchString + sortBy + minPrice + maxPrice +
    minYear + maxPrice + minYear + maxYear + minMiles + maxMiles;


var runSearch = function (callback) {
    var previousResult = {};
    var justNewResults = {};
    request(url, function (error, response, html) {
        if (!error) {
            var newResult = {};
            var $ = cheerio.load(html);

            $('.result-row').each(function (index) {
                var newResultDetails = {};

                //PID
                var pid = getPid(this);
                //HREF
                var href = getHref(this);
                //PRICE
                var price = getPrice(this);
                //STATE
                var state = getState(href);
                //LOCATION
                var location = getLocation(this);
                //PIC
                //var pic = getPic(this);


                //Create Object with results
                newResultDetails.url = href;
                newResultDetails.price = price;
                newResultDetails.state = state;
                newResultDetails.location = location;
                newResult[pid] = newResultDetails;

            });

            //Read in previous results and compare to new Results
            fs.readFile('previousResult.json', function (err, data) {
                var previousResult = JSON.parse(data);
                var differences = diff(previousResult, newResult);

                //parse through differences and if they are 'new' posts, add them to object
                for (var i in differences) {
                    if (differences[i].kind == 'N') {
                        var newPid = differences[i].path.toString();
                        justNewResults[newPid] = newResult[newPid];
                    }
                }
                //console.log(JSON.stringify(justNewResults));
                callback(justNewResults);
            });
        }
    });

    //Call Write
    // writeBackToFile();
};

////Event Emitters and kick of functions
CLScrapeEngine.prototype.startSearch = function () {
    setInterval(function () {
        runSearch(function (newPosts) {
            this.emit('newPost', JSON.stringify(newPosts));
        }.bind(this));
    }.bind(this), 1 * 60000);
};

CLScrapeEngine.prototype.test = function () {
    this.emit('test', 'tested');
};


////Helper functions
//PID = Get Pid from html block
var getPid = function (html) {
    var $ = cheerio.load(html);
    var pid = $(html).data('pid');
    return pid;
};

//HREF = If no host in url, then its local and add the 'host' var
//  from above.
var getHref = function (html) {
    var $ = cheerio.load(html);
    var href = $(html).children('a').attr('href');
    if (href.search('craigslist.org') == -1) {
        href = host + href;
    } else {
        href = 'https:' + href;
    }
    return href;
};

//PRICE = Get price from html block
var getPrice = function (html) {
    var $ = cheerio.load(html);
    var price = $(html).find("span.result-price").html();
    return price;
};

//STATE = Get from begining of url
var getState = function (href) {
    var state = href.slice(8);
    var tmpEnd = state.indexOf('.');
    state = state.slice(0, tmpEnd);
    return state;
};

//LOCATION = If null, see if its a 'nearby' find. If it is,
// get location from 'nearby' tag
//  If not null, get rid of '()' from the location.
var getLocation = function (html) {
    var $ = cheerio.load(html);
    var location = $(html).find("span.result-hood").html();
    if (location == null) {
        location = $(html).find("span.nearby").html();
        if (location != null) {
            location = location.slice(9, -1);
        }
    } else {
        location = location.slice(location.indexOf('(') + 1);
        location = location.slice(0, location.indexOf(')'));
    }
    return location;
};

//PIC = Gets url of display pic (not working)
var getPic = function (html) {
    var $ = cheerio.load(html);
    var pic = $(html).find("img").innerHTML;
    //var pic = $(this).children["a"].children["div"].children["div"].children["div"].innerHTML;
    return pic;
};

//Write new results to file, so they can be compared in next run
var writeBackToFile = function () {
    fs.writeFile('previousResult.json', JSON.stringify(newResult), function (err) {
        if (err) {
            console.log('ERROR: ' + err);
        }
        console.log('INFO: File saved');
    });
};

module.exports = CLScrapeEngine;