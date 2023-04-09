const crypto = require('node:crypto');
const fs= require('node:fs')
const genKeys= ()=>{
    const {publicKey, privateKey} = crypto.generateKeyPairSync('rsa' , {
        modulusLength: 4096,
    publicKeyEncoding: {
    type: 'spki',
    format: 'pem'
  },
    privateKeyEncoding: {
    type: 'pkcs8',
    format: 'pem',
  }
    })
    fs.writeFileSync(__dirname+'/private_key.pem', privateKey)
    fs.writeFileSync(__dirname+'/public_key.pem', publicKey)
}
genKeys()