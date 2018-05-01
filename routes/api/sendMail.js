const sgMail = require('@sendgrid/mail');
module.exports={
 sendMail:(data)=>{
        // sgMail.setApiKey('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');
        sgMail.setApiKey('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');
           const msg = {
               to:data.to,
               from: data.from,
               subject: data.subject,
               html:data.htmlContent
             };
           sgMail.send(msg, (err) => {
               if (!err)
               console.log("mail sent successfully");
               else
               console.log("error occured");
           });
       }
    }