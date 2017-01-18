var request = require('request');
var cheerio = require('cheerio');

var host = 'https://nh.craigslist.org';
var section = '/search/cto';
var searchString = 'cherokee -grand';
searchString = encodeURIComponent(searchString);
searchString = '?query=' + searchString;
const sortBy = '&sort=date';
var minPrice = '';
minPrice = '&min_price=' + minPrice;
var maxPrice = '';
maxPrice = '&max_price=' + maxPrice;
var minYear = '';
minYear = '&min_auto_year=' + minYear;
var maxYear = '1999';
maxYear = '&max_auto_year=' + maxYear;
var minMiles = '';
minMiles = '&min_auto_miles=' + minMiles;
var maxMiles = '';
maxMiles = '&max_auto_miles=' + maxMiles;

var url = host + section + searchString + sortBy + minPrice + maxPrice + 
    minYear + maxPrice + minYear + maxYear + minMiles + maxMiles;    


var oldResult = {};

request(url, function(error, response, html){
    if(!error){
        var $ = cheerio.load(html);
        var pid, price;
        
        var newResult = {};

        $('.result-row').each(function(index){
            //PID
            var pid = $(this).data('pid');
            
            //HREF
            //If no host in url, then its local and add the 'host' var
            //  from above.
            var href = $(this).children('a').attr('href');
            if(href.search('craigslist.org') == -1){
                href = host + href;
            } else{
                href = 'https:' + href;
            }
            
            //PRICE
            var price = $(this).find("span.result-price").html();
            
            //STATE
            //Get from begining of url
            var state = href.slice(8);
            var tmpEnd = state.indexOf('.');
            state = state.slice(0, tmpEnd);
            
            //LOCATION
            //If null, see if its a 'nearby' find. If it is, 
            // get location from 'nearby' tag
            //If not null, get rid of '()' from the location.
            var location = $(this).find("span.result-hood").html();
            if(location == null){
                location = $(this).find("span.nearby").html();
                if(location != null){
                    location = location.slice(9, -1);
                }
            }else{
                location = location.slice(location.indexOf('(')+1);
                location = location.slice(0, location.indexOf(')'));
            }
            
            //PIC
            var pic = $(this).find("img").innerHTML;
            //var pic = $(this).children["a"].children["div"].children["div"].children["div"].innerHTML;
            console.log(pic);
            //console.log(pid + ' ' + href + ' ' + price + ' ' + location + ' ' + state + ' ' + pic );
            
        });
        
        
        for(var i in newResult){
            console.log(i);
        }
        
    }
});