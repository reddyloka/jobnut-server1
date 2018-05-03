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
//         from:'chintareddy.sudhakarreddy@gmail.com',
//         subject:'Hello user',
//         html:'<h1>welcome to JobNut</h1><strong>Your are at right place where you can get good job offers</strong>'
//       };
//     sgMail.send(msg, (err) => {
//         if (err)
//         console.log("error occurred");
//         res.send("mail  sent successfully")
//         // console.log("mail sent successfully");
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
        console.log("signup mail sent successfully");
        else
        console.log("error occured");
    });
return true;
}

jobNotification = async function(req){
    console.log('function',req);
    let mailArray= await Applicant.findById({_id:req},['email']);
    console.log('mail',mailArray);
    sgMail.setApiKey('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');
    const msg = {
        to:mailArray,
        from: 'chintareddy.sudhakarreddy@gmail.com',
        subject: 'Hello user',
        html:'<h1>welcome to JobNut</h1><strong>Your are at right place where you can get good job opporunities</strong>'
      };
    sgMail.send(msg, (err) => {
        if (!err)
        console.log("job mail sent successfully");
        else
        console.log("error occurred");
    });
return true;
}

 module.exports = {
     jobNotification,
     signupNotification
 }