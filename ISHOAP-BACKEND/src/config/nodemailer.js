
import nodemailer from 'nodemailer';


//transporter object using smtp 
const transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
        user: 'singhnitinkumar145@gmail.com',
        pass: process.env.ADMIN_GMAIL_APP_PASSWORD
    },
})


export const sendWelcomeEmail = (from, to, subject, text) => {
    const mailOptions = {
        from: `IShoap <${from}>`,
        to: to,
        subject: subject,
        text: text
    };

    transporter.sendMail(mailOptions);
};