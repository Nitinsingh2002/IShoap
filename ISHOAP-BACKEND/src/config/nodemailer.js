
import nodemailer from 'nodemailer';
import path from 'path';

//transporter object using smtp 
const transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
        user: 'singhnitinkumar145@gmail.com',
        pass: process.env.ADMIN_GMAIL_APP_PASSWORD
    },
})


export const sendWelcomeEmail = (from, to, subject, text, pdfPath) => {
    let mailOptions;
    if (pdfPath === undefined) {
        mailOptions = {
            from: `IShoap <${from}>`,
            to: to,
            subject: subject,
            text: text,
        };
    } else {
        mailOptions = {
            from: `IShoap <${from}>`,
            to: to,
            subject: subject,
            text: text,
            attachments: [
                {
                    filename: path.basename(pdfPath),
                    path: pdfPath,
                    contentType: 'application/pdf'
                }
            ]
        };
    }


    transporter.sendMail(mailOptions);
};