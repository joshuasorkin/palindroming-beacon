const mongoose=require('mongoose')
const Schema = mongoose.Schema
const palindromeSchema=new Schema({
    body:{
        type:String,
        required:true
    },
    unfiltered:{
        type:String,
        required:true
    },
    wordOnly:{
        type:String,
        required:true
    },
    unique:{
        type:String,
        required:true
    },
    commentId:{
        type:String,
        required:true
    },
    authorName:{
        type:String,
        required:true
    }
},{timestamps:true})

const PalindromeModel=mongoose.model('palindrome',palindromeSchema)

module.exports=PalindromeModel