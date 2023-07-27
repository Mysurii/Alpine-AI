import { createTransport } from 'nodemailer'
import type Mail from 'nodemailer/lib/mailer'
import type SMTPTransport from 'nodemailer/lib/smtp-transport'
import { env_variables } from '../config'
import { promises as fs } from 'fs'

const config: SMTPTransport.Options = {
  service: env_variables.EMAIL.service,
  auth: {
    user: env_variables.EMAIL.email,
    pass: env_variables.EMAIL.pass
  }
}

const transporter = createTransport(config)

export type HTMLContent = {
  templatePath: string,
  variables: Array<{ varName: string|RegExp, value: string }>
}

export function sendVerificationMail(name: string, recipient: string, verificationCode: string) {
  const template: HTMLContent = {
    templatePath: `${__dirname}/emailTemplates/verifyAccount.html`,
    variables: [
      { varName: '{{NAME}}' , value: name },
      { varName: '{{VERIFICATION_CODE}}' , value: verificationCode }
    ]
  }

  return sendMail(recipient, 'Verify account', template)
}

export function sendResetPasswordMail(name: string, recipient: string, accessToken: string, verificationCode: string) {
  const template: HTMLContent = {
    templatePath: `${__dirname}/emailTemplates/resetPassword.html`,
    variables: [
      { varName: '{{NAME}}' , value: name },
      { varName: /{{VERIFICATION_LINK}}/g , value: `${env_variables.SITE_BASE_URL}/reset-password?accessToken=${accessToken}&verificationCode=${verificationCode}` }
    ]
  }

  return sendMail(recipient, 'Forgot password', template)
}

async function sendMail(recipients: string | Array<string>, subject: string, content: string | HTMLContent) {
  const mail: Mail.Options = {
    from: env_variables.EMAIL.email,
    to: recipients,
    subject: subject
  }

  if (typeof content === 'string') {
    mail.text = content
  } else {
    // use HTML template
    const template = await fs.readFile(content.templatePath, { encoding: 'utf-8' })

    mail.html = content.variables.reduce((template, variable) => {
      template = template.replace(variable.varName, variable.value)

      return template
    }, template)
  }

  return transporter.sendMail(mail)
}