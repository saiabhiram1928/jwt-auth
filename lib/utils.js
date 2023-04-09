const crypto = require('crypto');
const jwt  =  require('jsonwebtoken');
const fs = require('fs')
const path = require('path')

const privateKey = fs.readFileSync(path.join(__dirname, '..', '/private_key.pem' ) , 'utf-8')


const genPasswd = (passwd)=>{
    const salt = crypto.randomBytes(64).toString('hex')
    const hash = crypto.pbkdf2Sync(passwd , salt, 10000,64,'sha256').toString('hex');
    return { hash , salt}
}

const verifypasswd = (passwd, hash ,salt)=>{
    const verifyHash =  crypto.pbkdf2Sync(passwd ,salt, 10000 ,64 , 'sha256').toString('hex');
    return hash===verifyHash
}
const issueToken = (id)=>{
    const payload = {
        id ,
        iat : Date.now(),
    }
    const token = jwt.sign(payload , privateKey , { algorithm: 'RS256' , expiresIn : '1d'})
    return {
        token : "Bearer " +token,
        expires : '1d'
    }
}

module.exports.genPasswd= genPasswd
module.exports.verifypasswd = verifypasswd
module.exports.issueToken = issueToken
