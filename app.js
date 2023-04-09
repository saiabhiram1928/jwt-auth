const express = require('express');
const app = express();
const mongoose = require('mongoose');
const passport  = require('passport')
const { genPasswd, verifypasswd, issueToken } = require('./lib/utils');
const User = require('./models/user')
const mongo_url = 'mongodb://localhost:27017/Jwt'
const port  = 3000



mongoose.connect(mongo_url , { 
    useNewurlParser: true,
})
mongoose.connection.once('open' ,() =>{
    console.log("Connected to db")
}).on('error',(err) =>{
    console.error(err)
})

app.use(express.json())
app.use(express.urlencoded({extended : true}))

require('./config/passport')(passport)


app.get('/' ,(req,res)=>{
    res.send('home')

})
app.post('/register' , async(req,res)=>{
    const {email , passwd } = req.body
    console.log(email , passwd ,await User.exists({email}))
    let user = await User.exists({email}) 
    if(user) return res.send('<h1>user already exists please login </h1>')
    const encrypt = genPasswd(passwd)
        user = new User({email , passwd : encrypt.hash , salt : encrypt.salt })
        try{
            user.save()
           res.status(200).json({success : true})
        }catch(err){
            console.log(err )
            res.status(400).json({success : false})
        }

   
})
app.post('/login' , async(req,res) =>{
    const {email , passwd} = req.body
    try{
        const user = await User.findOne({email})
        if(!user) return res.status(200).json({login : false, msg  :"user doesnt exist"})
        const verify = verifypasswd(passwd, user.passwd , user.salt)
        if(!verify) return res.status(200).json({login:false , msg : "password doesnt match"})
        const tokenObj = issueToken(user.id)
        res.status(200).json({success : true , token : tokenObj.token , expires : tokenObj.expires})

    }catch(err){
        console.log(err)
        res.status(400).json({msg : "something went wrong"})
    }
   

})
app.get('/p1',passport.authenticate('jwt' , {session :false}) , (req,res) =>{
    res.status(200).json({msg : "sucessfully accesed the route"})
})
app.listen(port , ()=>{
    console.log(`server started on port : ${port}`)
})