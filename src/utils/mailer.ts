import nodemailer from 'nodemailer'

export async function sendLoginEmail({ email, url, token }: { email: string, url: string, token: string }) {

    const testAccount = await nodemailer.createTestAccount()

    const transporter = nodemailer.createTransport({
        host: "smtp.ethereal.email",
        port: 587,
        secure: false,
        auth: {
            user: testAccount.user,
            pass: testAccount.pass
        }
    })

    const info = await transporter.sendMail({
        from: "'John' <j.smith@example.com",
        to: email,
        subject: "Login to account",
        html: `Login by clicking here <a href=${url}/login#token=${token}>here</a>`
    })

    console.log(`message from mailer ${nodemailer.getTestMessageUrl(info)}`)
}