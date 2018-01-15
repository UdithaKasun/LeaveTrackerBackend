var mongoose = require('mongoose');
mongoose.promise = global.promise
var Schema = mongoose.Schema;

var notificationSchema = new Schema({
    notification_id : String,
    reciever_user_id : String,
    message : String,
    type : String,
    status : String
});

mongoose.model('Notification',notificationSchema,'emp_notification');
