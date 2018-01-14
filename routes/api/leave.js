var router = require('express').Router();
var mongoose = require('mongoose');
var router = require('express').Router();
var Leave = mongoose.model('Leave');
var User = mongoose.model('User');
var auth = require('../auth');

//Add new leaves to the database
router.post('/', auth.required, function (req, res, next) {
  User.findById(req.payload.id).then(function (user) {
    if (!user) { return res.sendStatus(401); }

    if (!req.body.newLeaves) {
      return res.status(422).json({ errors: { newLeaves: "can't be empty" } });
    }

    req.body.newLeaves.forEach(leave => {

      if (!leave.user_id) {
        return res.status(422).json({ errors: { user_id: "can't be blank" } });
      }

      if (!leave.leave_from_date) {
        return res.status(422).json({ errors: { leave_from_date: "can't be blank" } });
      }

      if (!leave.leave_to_date) {
        return res.status(422).json({ errors: { leave_to_date: "can't be blank" } });
      }

      if (!leave.leave_count) {
        return res.status(422).json({ errors: { leave_count: "can't be blank" } });
      }

      if (!leave.leave_type) {
        return res.status(422).json({ errors: { leave_type: "can't be blank" } });
      }

      if (!leave.leave_status) {
        return res.status(422).json({ errors: { leave_status: "can't be blank" } });
      }

      if (!leave.leave_approver_id) {
        return res.status(422).json({ errors: { leave_approver_id: "can't be blank" } });
      }

      leave.leave_id = "LEAVE_" + new Date().getTime();

      console.log("Leave ID : " + leave.leave_id);
      var leave = new Leave(leave);

      return leave.save().then(function () {
      });

    });

    req.body.removeLeaves.forEach(leave => {
      Leave.remove({ leave_id: leave })
        .then(function (status) {

        })
        .catch(next);
    });

    req.body.existLeaves.forEach(leave => {
      Leave.findOne({ leave_id: leave.leave_id })
        .then(function (foundLeave) {
          if (!leave) { return res.sendStatus(404); }
          foundLeave.leave_from_date = leave.leave_from_date;
          foundLeave.leave_to_date = leave.leave_to_date;
          foundLeave.leave_count = leave.leave_count;
          foundLeave.save()
            .then(function (result) {
            }).catch(next);
        }).catch(next);
    });

    return res.json({ status: "SUCCESS" });

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
      setTimeout(()=>{
        Leave.find(
          { user_id: req.params.userId })
          .then(function (leaves) {
            if (!leaves) { return res.sendStatus(404); }
            return res.json({
              leaves: leaves
            });
          }).catch(next);
      },1000);
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

//Update leaves by leave id
router.put('/', auth.required, function (req, res, next) {
  User.findById(req.payload.id).then(function (user) {
    if (!user) { return res.sendStatus(401); }

    if (!req.body.leaves) {
      return res.status(422).json({ errors: { leaves: "can't be empty" } });
    }


    if (req.body.status == 'Delete') {
      User.findById(req.payload.id).then(function (user) {
        if (!user) { return res.sendStatus(401); }


      }).catch(next);
    } else if (req.body.status == 'Update') {

      req.body.leaves.forEach(leave => {
        Leave.findOne({ leave_id: leave.leave_id })
          .then(function (foundLeave) {
            if (!leave) { return res.sendStatus(404); }
            foundLeave.leave_from_date = leave.leave_from_date;
            foundLeave.leave_to_date = leave.leave_to_date;
            foundLeave.leave_count = leave.leave_count;
            foundLeave.save()
              .then(function (result) {
              }).catch(next);
          }).catch(next);
      });

    }


    return res.json({ status: "SUCCESS" });
  }).catch(next);;
});

//Update leave status by leave id
router.put('/status', auth.required, function (req, res, next) {
  User.findById(req.payload.id).then(function (user) {
    if (!user) { return res.sendStatus(401); }

    Leave.findOne({ leave_id: req.body.leave.leave_id })
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

router.post('/test/removeLeaves', auth.required, function (req, res, next) {
  User.findById(req.payload.id).then(function (user) {
    if (!user) { return res.sendStatus(401); }
    req.body.leaves.forEach(leave => {
      Leave.remove({ leave_id: leave })
        .then(function (status) {

        })
        .catch(next);
    });
    return res.json({ status: "SUCCESS" });
  }).catch(next);
});



module.exports = router;