require('dotenv').config()
const mongoose=require('mongoose')

mongoose.connect(
    process.env.MONGODB_URL,
    {
        useNewUrlParser:true,
        useUnifiedTopology:true
    })
.then(result=>{
    console.log("connected to db")
})
.catch(err=>{
    console.log(`err: ${err}`)
})


/*
var MongoClient=require('mongodb').MongoClient
var url="mongodb://localhost:27107/palindromedb"




MongoClient.connect(process.env.MONGODB_URL,function(err,db){
    if(err) throw err;
    console.log("Database constructed.")
    db.close()
})
*/