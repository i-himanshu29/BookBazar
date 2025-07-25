import Mailgen from "mailgen";
import nodemailer from "nodemailer";

/**
 * @param {{email:string;
 * subject:string;
 * mailgenContent:Mailgen.Content;
 * }}options
 */

const sendEmail = async (options) => {
   const mailGenerator = new Mailgen({
      theme: "default",
      product: {
         name: "Book Bazar",
         link: "https://bookbazar.com",
      },
   });

   const emailText = mailGenerator.generatePlaintext(options.mailgenContent);

   const emailHtml = mailGenerator.generate(options.mailgenContent);

   const transporter = nodemailer.createTransport({
      host: process.env.MAILTRAP_SMTP_HOST,
      port: process.env.MAILTRAP_SMTP_PORT,
      auth: {
         user: process.env.MAILTRAP_SMTP_USER,
         pass: process.env.MAILTRAP_SMTP_PASS,
      },
   });

   const mail = {
      from: "mail.bookbazar@example.com",
      to: options.email,
      subject: options.subject,
      text: emailText,
      html: emailHtml,
   };

   try {
      await transporter.sendMail(mail);
   } catch (error) {
      console.error(
         "Email service failed silently.Make sure you have your MAILTRAP credentials in the .env file",
      );
      console.error("Error:", error);
   }
};

/**
 *
 * @param {string} username
 * @param {string} verificationUrl
 * @returns {Mailgen.Content}
 */

const emailVerificationMailgenContent = (name, verificationUrl) => {
   return {
      body: {
         name: name,
         intro: "Welcome to our app! We're very excited to have you on board.",
         action: {
            instructions:
               "To verify your email please click on the following button:",
            button: {
               color: "#22BC66", // Optional action button color
               text: "Verify your email",
               link: verificationUrl,
            },
         },
         outro: "Need help, or have questions? Just reply to this email, we'd love to help.",
      },
   };
};

/**
 *
 * @param {string} name
 * @param {string} passwordResetUrl
 * @returns {Mailgen.Content}
 */
const forgotPasswordMailgenContent = (name, passwordResetUrl) => {
   return {
      body: {
         name: name,
         intro: "We got a request to reset the password of our account",
         action: {
            instructions:
               "To reset your password click on the following button or link:",
            button: {
               color: "#21BC66", // Optional action button color
               text: "Reset password",
               link: passwordResetUrl,
            },
         },
         outro: "Need help, or have questions? Just reply to this email, we'd love to help.",
      },
   };
};

export {
   emailVerificationMailgenContent,
   forgotPasswordMailgenContent,
   sendEmail,
};
