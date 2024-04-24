import nodemailer from 'nodemailer'



const transporter = nodemailer.createTransport({
    host: "smtp.ethereal.email",
    port: 587,
    secure: false, // Use `true` for port 465, `false` for all other ports
    auth: {
      user: "singhnitinkumar145@gmail.com",
      pass: "Rajputsingh7462@",
    },
  });