var router = require('express').Router();
var mongoose = require('mongoose');
var router = require('express').Router();
var Leave = mongoose.model('Leave');
var User = mongoose.model('User');
var auth = require('../auth');

//Add a new leave to the database
router.post('/', auth.required, function (req, res, next) {
  User.findById(req.payload.id).then(function (user) {
    if (!user) { return res.sendStatus(401); }

    if (!req.body.leave.user_id) {
      return res.status(422).json({ errors: { user_id: "can't be blank" } });
    }

    if (!req.body.leave.leave_from_date) {
      return res.status(422).json({ errors: { leave_from_date: "can't be blank" } });
    }

    if (!req.body.leave.leave_to_date) {
      return res.status(422).json({ errors: { leave_to_date: "can't be blank" } });
    }

    if (!req.body.leave.leave_count) {
      return res.status(422).json({ errors: { leave_count: "can't be blank" } });
    }

    if (!req.body.leave.leave_type) {
      return res.status(422).json({ errors: { leave_type: "can't be blank" } });
    }

    if (!req.body.leave.leave_status) {
      return res.status(422).json({ errors: { leave_status: "can't be blank" } });
    }

    if (!req.body.leave.leave_approver_id) {
      return res.status(422).json({ errors: { leave_approver_id: "can't be blank" } });
    }

    req.body.leave.leave_id = "LEAVE_" + new Date().getTime();
    var leave = new Leave(req.body.leave);

    return leave.save().then(function () {
      return res.json({ status: "SUCCESS" });
    });
  }).catch(next);
});

//Getting leaves per user id ? status
router.get('/user/:userId', auth.required, function (req, res, next) {

  User.findById(req.payload.id).then(function (user) {
    if (!user) { return res.sendStatus(401); }


    var status = "";

    if (typeof req.query.status !== 'undefined') {
      status = req.query.status;
      Leave.find(
        { $and: [{ user_id: req.params.userId }, { leave_status: status }] })
        .then(function (leaves) {
          if (!leaves) { return res.sendStatus(404); }
          return res.json({
            leaves: leaves
          });
        }).catch(next);
    }
    else {
      Leave.find(
        { user_id: req.params.userId })
        .then(function (leaves) {
          if (!leaves) { return res.sendStatus(404); }
          return res.json({
            leaves: leaves
          });
        }).catch(next);
    }


  });
});

//Get leaves assigned for leader ? status
router.get('/leader/:leaderId', auth.required, function (req, res, next) {

  User.findById(req.payload.id).then(function (user) {
    if (!user) { return res.sendStatus(401); }

    var status = "";

    if (typeof req.query.status !== 'undefined') {
      status = req.query.status;
      Leave.find({ $and: [{ leave_status: status }, { leave_approver_id: req.params.leaderId }] })
        .then(function (leaves) {
          if (!leaves) { return res.sendStatus(404); }
          return res.json({
            leaves: leaves
          });
        }).catch(next);
    }
    else {
      Leave.find(
        { leave_approver_id: req.params.leaderId })
        .then(function (leaves) {
          if (!leaves) { return res.sendStatus(404); }
          return res.json({
            leaves: leaves
          });
        }).catch(next);
    }
  });
});

//Update leave by leave id
router.put('/', auth.required, function (req, res, next) {
  User.findById(req.payload.id).then(function (user) {
    if (!user) { return res.sendStatus(401); }

    Leave.findOne({ leave_id : req.body.leave.leave_id } )
      .then(function (leave) {
        if (!leave) { return res.sendStatus(404); }
        leave.leave_from_date = req.body.leave.leave_from_date;
        leave.leave_to_date = req.body.leave.leave_to_date;
        leave.leave_count = req.body.leave.leave_count;
        leave.save()
          .then(function (leave) {
            return res.json({ status: "SUCCESS" });
          }).catch(next);
      }).catch(next);
  }).catch(next);;
});

//Update leave status by leave id
router.put('/status', auth.required, function (req, res, next) {
  User.findById(req.payload.id).then(function (user) {
    if (!user) { return res.sendStatus(401); }

    Leave.findOne({ leave_id : req.body.leave.leave_id } )
      .then(function (leave) {
        if (!leave) { return res.sendStatus(404); }
        leave.leave_status = req.body.leave.leave_status;
        leave.save()
          .then(function (leave) {
            return res.json({ status: "SUCCESS" });
          }).catch(next);
      }).catch(next);
  }).catch(next);;
});



module.exports = router;