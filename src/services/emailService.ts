const nodemailer = require("nodemailer");

export default async function sendEmail(toEmail: string,
  subject: string,
  content: string,
  htmlContent: string,
): Promise<string> {

  try{
    const transporter = nodemailer.createTransport({
      host:  process.env.SMTP_SERVER,
      port:  process.env.SMTP_PORT,
      secure:  true,//process.env.SMTP_SEC, // Use `true` for port 465, `false` for all other ports
      auth: {
        user:  process.env.SMTP_USER,
        pass:  process.env.SMTP_PASS,
      },
      tls: {
        // do not fail on invalid certs
        rejectUnauthorized: false,
      },
    });

    console.log('transporter',transporter)
    // send mail with defined transport object
    const info = await transporter.sendMail({
      from: `"Web3 Epoch Order" <${process.env.SMTP_USER}>`, // sender address
      to: toEmail, // list of receivers
      subject: subject, // Subject line
      text: content, // plain text body
      html: htmlContent, // html body
    });

    console.log("Message sent: %s", info.messageId);
    return info.messageId;
  }catch(error:any){
    console.log(error.message)
    return "";
  }
}
