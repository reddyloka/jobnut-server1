var mongoose=require('mongoose');
var router = require('express').Router();
const sgMail = require('@sendgrid/mail');
var Applicant = mongoose.model('applicantModel');
let mailArray=[];

// router.get('/mail',  async (req, res)=> {
//     let mailArray= await Applicant.find({},['email']);
//     console.log(mailArray);
//     sgMail.setApiKey('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');
//     const msg = {
//         to:mailArray,
//         from: 'lokaanvesh2@gmail.com',
//         subject: 'Hello user',
//         html:'<h1>welcome to JobNut</h1><strong>Your are at right place where you can get good job offers</strong>'
//       };
//     sgMail.send(msg, (err) => {
//         if (err)
//         console.log("error occurred");
//         console.log("mail sent successfully");
//     });
// });

signupNotification = async function (req){
 sgMail.setApiKey('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');
    const msg = {
        to:req,
        from: 'chintareddy.sudhakarreddy@gmail.com',
        subject: 'JobNut signup notification',
        html:'<h1>Welcome to jobnut Portal your are successfully registered with us.</h1><p>we provide great opportunities</p>'
      };
    sgMail.send(msg, (err) => {
        if (!err)
        console.log("mail sent successfully");
        else
        console.log("error occured");

    });
return true;
}

jobNotification = async function(req){
    console.log('function',req);
    let mailArray= await Applicant.findById({_id:req},['email']);
    console.log('mails array',mailArray);
    sgMail.setApiKey('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');
    const msg = {
        to:mailArray,
        from: 'lokaanvesh2@gmail.com',
        subject: 'Hello user',
        html:'<h1>welcome to JobNut</h1><strong>Your are at right place where you can get good job opporunities</strong>'
      };
    sgMail.send(msg, (err) => {
        if (!err)
        console.log("mail sent successfully");
        else
        console.log("error occurred");

    });
return true;
}

 module.exports ={
     jobNotification,
     signupNotification
 }