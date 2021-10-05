const {CommentStream}=require("snoostorm")

require('dotenv').config()
const Snoowrap=require('snoowrap')
const Snoostorm=require('snoostorm')
const mongoose=require('mongoose')

const palindrome=require('./palindrome')
const duplicate=require('./duplicate')
const PalindromeModel=require('./models/palindrome-model')

const redditConfig=new Snoowrap({
    userAgent: 'palindroming-beacon',
    clientId:process.env.CLIENT_ID,
    clientSecret:process.env.CLIENT_SECRET,
    username:process.env.REDDIT_USER,
    password:process.env.REDDIT_PASS
})

const subreddit = redditConfig.getSubreddit('realEstate')
subreddit.description.then(result=>console.log(result))
