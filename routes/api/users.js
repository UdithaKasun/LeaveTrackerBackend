var mongoose = require('mongoose');
var router = require('express').Router();
var passport = require('passport');
var User = mongoose.model('User');
var auth = require('../auth');
var mailsender = require('.././../mailhub/mailer');
var generatePassword = require('password-generator');

router.get('/user', auth.required, function(req, res, next){
  User.findById(req.payload.id).then(function(user){
    if(!user){ return res.sendStatus(401); }

    return res.json({user: user.toAuthJSON()});
  }).catch(next);
});

router.get('/leaders', auth.required, function(req, res, next){
  User.findById(req.payload.id).then(function(user){
    if(!user){ return res.sendStatus(401); }

    User.find(   
      { userrole : "Leader" })
      .then(function (users) {
        if (!users) { return res.sendStatus(404); }
        var filteredLeads = users.map(item => {
          return item.username;
        })
        return res.json(filteredLeads);
      }).catch(next);

  }).catch(next);
});

router.get('/user/:leaderid', auth.required, function(req, res, next){
   User.findById(req.payload.id).then(function(user){
    if(!user){ return res.sendStatus(401); }

    User.find(   
      { leaderId: req.params.leaderid },{username : 1})
      .then(function (users) {
        if (!users) { return res.sendStatus(404); }
        return res.json({
          users: users
        });
      }).catch(next);
  }).catch(next);
});


router.put('/user', auth.required, function(req, res, next){
  User.findById(req.payload.id).then(function(user){
    if(!user){ return res.sendStatus(401); }

    // only update fields that were actually passed...
    if(typeof req.body.user.username !== 'undefined'){
      user.username = req.body.user.username;
    }
    if(typeof req.body.user.leaderId !== 'undefined'){
      user.leaderId = req.body.user.leaderId;
    }
    if(typeof req.body.user.userrole !== 'undefined'){
      user.userrole = req.body.user.userrole;
    }
   
    return user.save().then(function(){
      return res.json({user: user.toAuthJSON()});
    });
  }).catch(next);
});

router.post('/users/login', function(req, res, next){

 
  if(!req.body.user.username){
    return res.status(422).json({errors: {username: "can't be blank"}});
  }

  if(!req.body.user.password){
    return res.status(422).json({errors: {password: "can't be blank"}});
  }

  passport.authenticate('local', {session: false}, function(err, user, info){
    if(err){ return next(err); }

    if(user){
      user.token = user.generateJWT();
      console.log(user);
      return res.json({user: user.toAuthJSON() ,leaderid : user.leaderId });
    } else {
      return res.status(422).json(info);
    }
  })(req, res, next);
});
 

router.post('/users', function(req, res, next){
  var user = new User();

  user.username = req.body.user.username;
  user.userrole = req.body.user.userrole;
  var password = generatePassword(10,false);
  user.setPassword(password);

  user.save().then(function(){
    mailsender.sendNewAccountCreated(user.username,user.username,password)
    .then(sendStatus => {
      return res.json({user: user.toAuthJSON()});
    })
    .catch(err => {
      return status(500);
    })
    
  }).catch(next);
});

module.exports = router;
