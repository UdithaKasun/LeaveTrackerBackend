var router = require('express').Router();
var mongoose = require('mongoose');
var router = require('express').Router();
var Notification = mongoose.model('Notification');
var User = mongoose.model('User');
var auth = require('../auth');

//Getting Notifications per user id ? status
router.get('/user/:userId', auth.required, function (req, res, next) {

  User.findById(req.payload.id).then(function (user) {
    if (!user) { return res.sendStatus(401); }

    var status = "";

    if (typeof req.query.status !== 'undefined') {
      notiStatus = req.query.status;
      Notification.find(
        { $and: [{ reciever_user_id : req.params.userId }, { status: notiStatus }] })
        .then(function (notifications) {
          if (!notifications) { return res.sendStatus(404); }

          return res.json({
            notifications: notifications
          });
        }).catch(next);
    }
    else {
        Notification.find(
          { reciever_user_id: req.params.userId })
          .then(function (notifications) {
            if (!notifications) { return res.sendStatus(404); }
            return res.json({
              notifications: notifications
            });
          }).catch(next);
      
    }
  });
});

//Update notification status by notification id
router.put('/status', auth.required, function (req, res, next) {
  User.findById(req.payload.id).then(function (user) {
    if (!user) { return res.sendStatus(401); }

    Notification.findOne({ notification_id: req.body.notification.notification_id })
      .then(function (notification) {
        if (!notification) { return res.sendStatus(404); }
        notification.status = req.body.notification.status;
        notification.save()
          .then(function (notification) {
            return res.json({ status: "SUCCESS" });
          }).catch(next);
      }).catch(next);
  }).catch(next);;
});

module.exports = router;