var mongoose=require('mongoose');
var router = require('express').Router();
var Applicant = mongoose.model('applicantModel');
const sgMail = require('@sendgrid/mail');

    signupNotification=function (req,res){
        console.log('email to sender',req);
        sgMail.setApiKey('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');        const msg = {
            to:req,
            from: 'chintareddy.sudhakarreddy@gmail.com',
            subject: 'Jobnut signup greetings',
            html:`<h1>Hi user,</h1>
                   <h2>You are at right place we will provide good job offers</h2>`
          };
        sgMail.send(msg, (err) => {
            if (!err)
            console.log('mail sent successfully');
            else
            console.log('error');
        });
    }
    jobApplyNotification=function (req,res){
        console.log('email to sender',req);
        sgMail.setApiKey('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');        const msg = {
            to:req,
            from: 'chintareddy.sudhakarreddy@gmail.com',
            subject: 'Jobnut apply notification',
            html:`<h1>Hi user,</h1>
                   <h2> user application was submitted successfully job provider will contact user for further process.</h2>`
          };
        sgMail.send(msg, (err) => {
            if (!err)
            console.log('mail sent successfully');
            else
            console.log('error');
        });
    }
    signupHrNotification=function (req,res){
        console.log('email to sender',req);
        sgMail.setApiKey('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');        const msg = {
            to:req,
            from: 'chintareddy.sudhakarreddy@gmail.com',
            subject: 'Jobnut signup grettings for HR',
            html:`<h1>Hi Job Provider,</h1>
                   <h2>Please upload some job offers in your account where user will apply for it</h2>`
          };
        sgMail.send(msg, (err) => {
            if (!err)
            console.log('mail sent successfully');
            else
            console.log('error');
        });
    }
    passwordUpdateNotification=function (req,res){
        console.log('email to sender',req);
        sgMail.setApiKey('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');        const msg = {
            to:req,
            from: 'krishnasai511@gmail.com',
            subject: 'Jobnut password updated',
            html:`<h1>Hello user,</h1>
                   <h2>As per your request your password was updated successfuly</h2>`
          };
        sgMail.send(msg, (err) => {
            if (!err)
            console.log('mail sent successfully');
            else
            console.log('error');
        });
    }
    module.exports={
        passwordUpdateNotification,
        signupHrNotification,
        jobApplyNotification,
        signupNotification

    };
