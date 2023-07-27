import crypto from 'crypto'
import fs from 'fs'

const requiredConfig = [ 'env_path' ] as const

type Config = Record<typeof requiredConfig[number], string>

const config = requiredConfig.reduce<Partial<Config>>((accumulator, requiredArgument) => {
  const found = process.argv.find(argument => {
    return argument.includes(requiredArgument) && argument.includes('=')
  })

  if (typeof found === 'undefined') {
    throw Error(`Argument '${requiredArgument}' is required!`)
  }
  

  const split = found.split('=')

  accumulator[requiredArgument] = split[1]

  return accumulator
}, { }) as Config 

const file = fs.readFileSync(config.env_path)

let envContents = file.toString()

if (envContents.includes('PUBLIC_KEY') || envContents.includes('PRIVATE_KEY')) {
  console.log(
    `Public and or private key are already set in the '${config.env_path}' file, remove these first.\
    \nBeware, previously encrypted data won't work again since new keys will be generated`
  )
} else {
  // add keys

  const { privateKey, publicKey } = crypto.generateKeyPairSync('rsa', {
    // The standard secure default length for RSA keys is 2048 bits
    modulusLength: 2048,
    publicKeyEncoding: {
      type: 'spki', // recommended to be 'spki' by the Node.js docs
      format: 'pem'   
    },   
    privateKeyEncoding: {
      type: 'pkcs8',// recommended to be 'pkcs8' by the Node.js docs
      format: 'pem'
    }
  })

  const toAppend = `PUBLIC_KEY="${publicKey}"\nPRIVATE_KEY="${privateKey}"`

  envContents = `${envContents}\n${toAppend}`

  fs.writeFileSync(config.env_path, envContents)
  console.log(`Successfully created public private keypair in file '${config.env_path}'`)
}

process.exit(0)