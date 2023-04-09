const JwtStrategy =  require('passport-jwt').Strategy
const ExtractJwt = require('passport-jwt').ExtractJwt
const fs = require('fs')
const path = require('path')
const User = require('../models/user')
const publicKey = fs.readFileSync(path.join(__dirname, '..' , '/public_key.pem') , 'utf-8')

//All options we can send for the passport to extract and verify the tokens
// const options = {
//     jwtFromRequest : ExtractJwt.fromAuthHeaderAsBearerToken(),
//     secretOrKey : publicKey,
//     issuer : "jwt.company.com",
//     audience : "Enter audience here",
//     algorithms : ['RS256'],
//     ignoreExpiration : false,
//     passReqToCallback : false,
//     jsonWebTokenOptions : {
//         complete : false,
//         clockTolerance : " ",
//         maxAge : '2d',
//         clockTimestamp :  '100',
//     }

// }
const opts ={
     jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
     secretOrKey: publicKey,
     algorithms: ['RS256']
}
const strategy  = new JwtStrategy(opts , (payload , done)=>{
    User.findById({_id: payload.id}).then((user)=>{
        if(user) done(null, user)
        else done(null ,false)
    }).catch((err)=> {
        console.error(err)
        done(err, false)
    })
})
module.exports = (passport) =>{
    passport.use(strategy)
}
