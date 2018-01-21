var nodemailer = require('nodemailer');
var mailsender = {};

//Sender Config
var emailConfig = {
    host: 'smtp.office365.com', // Office 365 server
    port: 587,     // secure SMTP
    secure: false, // false for TLS - as a boolean not string - but the default is false so just remove this completely
    auth: {
        user: "",
        pass: ""
    },
    requireTLS: true,
    tls: {
        ciphers: 'SSLv3'
    }
};

var transporter = nodemailer.createTransport(emailConfig);

mailsender.sendNewAccountCreated = function(reciever,username,password){
    // setup e-mail data
var mailOptions = {
    from: emailConfig.auth.user, // sender address (who sends)
    to: reciever, // list of receivers (who receives)
    subject: 'Leave Tracker Account Creation', // Subject line
    text: 'Hello world ', // plaintext body
    html: `
    <h4>Leave Tracker Account Creation</h4>
			<p>A New Account is Created for you for Leave Tracker Application</p>
			<p>
				<b>User Name :  ${username} </b>
			</p>
			<p>
				<b>Password : ${password} </b>
			</p>`
};

return transporter.sendMail(mailOptions);
}

mailsender.sendAccountReset = function(reciever,username,password){
    // setup e-mail data
var mailOptions = {
    from: emailConfig.auth.user, // sender address (who sends)
    to: reciever, // list of receivers (who receives)
    subject: 'Leave Tracker Account Reset', // Subject line
    text: 'Hello world ', // plaintext body
    html: `
    <h4>Leave Tracker Account Reset</h4>
			<p>Password for your Leave Tracker Application has been reset as following</p>
			<p>
				<b>User Name :  ${username} </b>
			</p>
			<p>
				<b>Password : ${password} </b>
			</p>`
};

return transporter.sendMail(mailOptions);
}





// send mail with defined transport object

module.exports = mailsender;