var express = require('express');
var request = require('request');
var urlParse = require('url');
var router = express.Router();
var newsModel = require('../models/news');
var fixturesModel = require('../models/fixtures');
var tableModel = require('../models/table');

router.get('/home', function(req, res) {
  var response = {
    news: {},
    next_game: {},
  }

  newsModel.list(0, 1, function(news){
    response.news = news[0];

    fixturesModel.nextGame( function(game){
      response.next_game  = game;


      res.json({
  		  success: true,
  			data: response
  	  });
    });
  });


});

router.get('/news', function(req, res) {
  newsModel.list(0, 10, function(news){
    res.json({
		  success: true,
			data: news
	  });
  });
});

router.get('/news/:id', function(req, res) {
  var id = req.params.id;
  newsModel.item(id, function(news){
    res.json({
		  success: true,
			data: news
	  });
  });
});

router.get('/games', function(req, res) {
  fixturesModel.list(function(games){
    res.json({
		  success: true,
			data: games
	  });
  });
});

router.get('/games/:id', function(req, res) {
  var id = req.params.id;
  fixturesModel.item(id, function(game){
    res.json({
		  success: true,
			data: game
	  });
  });
});

router.get('/table', function(req, res) {
  tableModel.list( function(table){
    res.json({
		  success: true,
			data: table
	  });
  })
});

router.get('/sponsors', function(req, res) {
  var url = 'https://spreadsheets.google.com/feeds/list/1iHrHLPHJcyeCxGha5Qj-KvgY6c3qxQa6erIVyX4-ioI/od6/public/values?alt=json';
  request(url, function (error, response, body) {
    if (!error && response.statusCode == 200) {
      var data = JSON.parse(body);

      var formatedData = [];
      data.feed.entry.forEach( function(item) {
        var row = {
          name: item['gsx$name']['$t'],
          banner: item['gsx$banner']['$t'],
          link: item['gsx$link']['$t'],
        }
        formatedData.push(row);
      });

      res.json({
  		  success: true,
  			data: formatedData
  	  });
    }
  });
});

router.get('/videos', function(req, res) {
  var url = 'https://spreadsheets.google.com/feeds/list/1UEa5Oto7Ykg5h8_8zEj-GX3UOEK48mJEZYci7EGtc4M/od6/public/values?alt=json';
  request(url, function (error, response, body) {
    if (!error && response.statusCode == 200) {
      var data = JSON.parse(body);

      var formatedData = [];
      data.feed.entry.forEach( function(item) {
        var videoURL = item['gsx$url']['$t'];
        var queryData = urlParse.parse(videoURL, true).query;

        var row = {
          title: item['gsx$title']['$t'],
          url: url,
          image: 'http://img.youtube.com/vi/' + queryData.v + '/hqdefault.jpg',
        }
        formatedData.push(row);
      });

      res.json({
  		  success: true,
  			data: formatedData
  	  });
    }
  });
});






module.exports = router;
