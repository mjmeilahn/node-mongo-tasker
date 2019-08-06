const sgMail = require('@sendgrid/mail')

const sendgridAPIKey = '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'

sgMail.setApiKey(sendgridAPIKey)

sgMail.send({
    to: 'xxxxxxx',
    from: 'xxxxx',
    subject: 'This is a test',
    text: 'I am a test!'
})