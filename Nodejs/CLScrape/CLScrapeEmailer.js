var sendmail = require('sendmail')();

exports.sendEmailAlert = function (newPosts) {
    newPosts = JSON.parse(newPosts);
    var emailBody = "";
    for (var i in newPosts) {
        emailBody += '<a href=' + newPosts[i].url + '> ' + newPosts[i].title + '</a>' +
            ' Price = ' + newPosts[i].price + ' State = ' + newPosts[i].state +
                ' Location = ' +  newPosts[i].location + '<br>';
    }

    sendmail({
            from: 'no-reply@CLScraper.com',
            to: 'maj5004@gmail.com',
            subject: 'New Results Found',
            html: emailBody,
        }, function (err, reply) {
            if (err) {
                console.log('ERROR: ' + err);

            } else if (reply) {
                console.log('INFO: ' + reply);
            }

        }
    );

};

