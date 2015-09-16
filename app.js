//Declare Dependencies
var express = require('express');
var exphbs = require('express-handlebars');
var bodyParser = require('body-parser');
var methodOverride = require('method-override');
var request = require('request');
var session = require('cookie-session');
var mongoose = require('mongoose');
//TODO: Middleware
var db = require('./models');
var app = express();

app.engine('handlebars', exphbs({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');
app.use(express.static(__dirname + '/public'));
app.set('views', __dirname + '/views');
app.use(bodyParser.urlencoded({extended: true}));
app.use(methodOverride('_method'));

//Set up Cookie Session
app.use(session({
  maxAge: 3600000,
  secret: 'koalafication',
  name: 'zoo'
}));


/************* ZOO ROUTES ***********/
//HOMEPAGE
app.get('/', function(req, res) {
  res.redirect('/zoos');
});

app.get('/zoos', function(req, res) {
  db.Zoo.find({}, function(err, data) {
    console.log()
    if(err) {
      res.redirect('/404');
    } else {
      res.render('zoo', {zoo: data});
    }
  })
});

//CREATE
app.get('/zoos/new', function(req, res) {
  res.render('newZoo');
});

app.post('/zoos', function(req, res) {
  db.Zoo.create(req.body.zoo, function(err, data) {
    res.redirect('/zoo');
  })
})

//EDIT
app.get('/zoos/:id/edit', function(req, res) {
  db.Zoo.findById(req.params.id, function(err, data) {
    res.render('editZoo', data);
  })
});

app.put('/zoos/:id', function(req, res) {
  db.Zoo.findByIdAndUpdate(req.params.id, req.body.zoo,
    function(err, zoo) {
    if(err) {
      console.log(err);
      res.redirect('/404');
    } else {
      res.redirect('/zoos');
    }
  });
});

//SHOW
app.get('/zoos/:id', function(req, res) {
  db.Zoo.findById(req.params.id,
    function(err, zoo) {
      db.Animal.find({
        _id: {$in: zoo.animals}
      },
      function(err, animals){
        res.render('showZoo', {zoo: zoo, animals: animals});
      });
  });
});

//DELETE
app.delete('/zoos/:id', function(req, res) {
  db.Zoo.findById(req.params.id, function(err, data) {
    if(err) {
      res.redirect('/404');
    } else {
      data.remove();
      res.redirect('/zoos');
    }
  })
})

/***********ANIMALS ROUTE****************/

// Animals Homepage
app.get('/zoos/:zoo_id/animals/index', function(req, res) {
  db.Zoo.findById(req.params.zoo_id).populate('animals').exec(function(err, data) {
    console.log('index data is ', data);
    res.render('animals/index', {zoo: data});
  });
});

// CREATE
app.get('/zoos/:zoo_id/animals/new', function(req, res) {
  db.Zoo.findById(req.params.zoo_id, function(err, zoo) {
    res.render('animals/new', {zoo: zoo})
  })
})
app.post('/zoos/:zoo_id/animals/index', function(req, res) {
  db.Animal.create(req.body.animal, function(err, animal) {
    if(err) {
      res.redirect('404');
    } else {
      db.Zoo.findById(req.params.zoo_id, function(err, zoo) {

        zoo.animals.push(animal);
        animal.zoo = zoo._id;
        animal.save();
        zoo.save();
        res.redirect('/zoos' + req.params.zoo_id + '/animals');

      })
    }
  })
})

// EDIT

app.get('zoos/:zoo_id/animals/edit', function(req, res) {
  db.Zoo.findById(req.params.zoo_id, function(err, zoo) {

  })
})
//SHOW

//DELETE

// CATCH ALL

app.get('*', function(req, res) {
  res.send('Wrong Page <a href="/zoo">Go Back</a>');
});

app.listen(3000, function() {
  console.log('Server started on port 3000');
});
