var express = require('express');
var router = express.Router();
var cheerio = require('cheerio');
var request = require('request');
var newsModel = require('../models/news');
var fixturesModel = require('../models/fixtures');
var tableModel = require('../models/table');


router.get('/news', function(req, res) {
  request('http://neftochimic.com/category/%D0%B2%D1%81%D0%B8%D1%87%D0%BA%D0%B8/', function (error, response, body) {
    if (!error && response.statusCode == 200) {
      $ = cheerio.load( body );
      var linksData = $('.bp-entry h2 a');
      var news = [];
      linksData.each( function(index){
        var link = $(this).attr('href');
        request(link, function (error, response, body) {
          if (!error && response.statusCode == 200) {
            $ = cheerio.load( body );
            var news = {
              link: link,
              image: $('.feature-img img').attr('src'),
              title: $('h1.post-tile').text(),
              time: $('time.updated').attr('datetime'),
              text: $('.entry-content p').text(),
            };
            newsModel.insert(news, function(){
              console.log('success insert news...');
            });
          }
        });
      });
    }
  });
  res.send('News...');
});



router.get('/fixtures', function(req, res){
  request('http://www.sportal.bg/statistics_team.php?champ=26&season=146&team=402', function (error, response, body) {
    if (!error && response.statusCode == 200) {
      $ = cheerio.load( body );
      var next = getFixture($, 0);
      var past = getFixture($, 1);
      var fixtures = past.concat(next);

      fixturesModel.deleteAll( function(){
        fixtures.forEach( function(item){
          fixturesModel.insert(item, function(){
            console.log('success insert game...');
          });
        })
      });
    }
  });
  res.send('Fixtures...');

});




router.get('/table', function(req, res) {
  request('http://www.sportal.bg/statistics_ranking.php?champ=26', function (error, response, body) {
    if (!error && response.statusCode == 200) {
      $ = cheerio.load( body );
      var teams = $('.auto_width').map( function(){
        return $(this).text();
      }).get();
      var points = $('.light_bg').map( function(){
        return $(this).text();
      }).get();
      var ga = $('.light_bg').prev('td').map( function(){
        return $(this).text();
      }).get();
      var games = $('td.cb').next().map( function(){
        return $(this).text();
      }).get();

      tableModel.deleteAll( function(){
        for( var i = 0; i < teams.length; i++ ) {
          var row = {
            position: i + 1,
            team: teams[i].trim(),
            games: games[i],
            points: points[i],
            ga: ga[i],
          };
          tableModel.insert(row, function(){
            console.log('success insert table...');
          });
        }
      });

    }
  });
  res.send('Table...');
});




module.exports = router;






function getFixture($, id) {
  var dateTime = $('#tabs_moveble_content_3_' + id + ' tr td.stats_game_date').map( function(){
    var date = $(this).text();
    date = date.replace('януари', 'January');
    date = date.replace('февруари', 'February');
    date = date.replace('март', 'March');
    date = date.replace('април', 'April');
    date = date.replace('май', 'May')
    date = date.replace('юни', 'June')
    date = date.replace('юли', 'July')
    date = date.replace('август', 'August')
    date = date.replace('септември', 'September')
    date = date.replace('октомври', 'October')
    date = date.replace('ноември', 'November')
    date = date.replace('декември', 'December')
    return date;
  }).get();
  var host = $('#tabs_moveble_content_3_' + id + ' tr td.stats_game_host a').map( function(){
    return $(this).text();
  }).get();
  var guest = $('#tabs_moveble_content_3_' + id + ' tr td.stats_game_guest a').map( function(){
    return $(this).text();
  }).get();
  var result = $('#tabs_moveble_content_3_' + id + ' tr td.stats_game_result').map( function(){
    return $(this).text();
  }).get();
  var logos = $('#tabs_moveble_content_3_' + id + ' tr td.stats_game_logo img').map( function(){
    var src = $(this).attr('src');
    if ( src != 'uploads/statistics/team_logo_png/00000402.png') {
      return src;
    }
  }).get();

  var fixtures = [];
  for(var i = 0; i < dateTime.length; i++ ) {
    var isHome = host[i].indexOf('Нефтохимик') >= 0 ? true : false;
    var row = {
      team: isHome ? guest[i] : host[i],
      datetime: dateTime[i],
      result: result[i].trim(),
      home: isHome,
      logo: 'http://www.sportal.bg/' + logos[i]
    }
    fixtures.push( row );
  }
  return fixtures;
}
