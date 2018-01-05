var mongoose = require('mongoose');
mongoose.promise = global.promise
var Schema = mongoose.Schema;

var leaveSchema = new Schema({
    leave_id : String,
    user_id : String,
    leave_from_date : Date,
    leave_to_date : Date,
    leave_count : Number,
    leave_type : String,
    leave_status : String,
    leave_approver_id : String
});

mongoose.model('Leave',leaveSchema,'emp_leave');
