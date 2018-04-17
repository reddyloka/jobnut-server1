var mongoose=require('mongoose');
var router = require('express').Router();
const sgMail = require('@sendgrid/mail');
var Applicant = mongoose.model('applicantModel');
let mailArray=[];

router.get('/mail',  async (req, res)=> {

    let mailArray= await Applicant.find({},['email']);
    console.log(mailArray);
    sgMail.setApiKey('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');
    const msg = {
        to:'lokaanvesh2@gmail.com',
        from: 'lokaanvesh2@gmail.com',
        subject: 'Hello user',
        html:'<h1>welcome to JobNut</h1><strong>Your r at right place where you can get good job offers</strong>'
      };
    sgMail.send(msg, (err) => {
        if (err)
            res.send("error occurred")
        res.send("mail sent successfully")

    });

});
module.exports = router;