var mongoose=require('mongoose');
var router = require('express').Router();
var Applicant = mongoose.model('applicantModel');
var mail=require('./sendMail');
const sgMail = require('@sendgrid/mail');
// var template=require('../../templates/signup');
// module.exports={
//        signupApplicantNotification:(req)=>{
//         let emailData={
//             to:req,
//             from:'lokaanvesh2@gmail.com',
//             subject:'welcome JobSeeker',
//             htmlContent:'../../templates/signup.html'
//         };
//          mail.sendMail(emailData);
//         },
//         signupHrNotification:(req)=>{
//             let emailData={
//                 to:req,
//                 from:'chintareddy.sudhakarreddy@gmail.com',
//                 subject:'welcome HR ',
//                 htmlContent:'../../templates/signup.html'
//             };
//              mail.sendMail(emailData);
//             }

// }


// router.get('/forget',(req,res)=>{
//     sgMail.setApiKey('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');
//     const msg = {
//         to:'lokaanvesh2@gmail.com',
//         from: 'chintareddy.sudhakarreddy@gmail.com',
//         subject: 'Hello user',
//         html:'../../templates/signup.html'
//       };
//     sgMail.send(msg, (err) => {
//         if (!err)
//         res.send('mail sent successfully');
//         else
//         res.send('error');
//     });
// return true;
// });

// module.exports=router;
