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

const stream=new CommentStream(redditConfig,{
    //subreddit:"testingground4bots",
    subreddit:"all",
    //subreddit:"palindromes",
    //subreddit:"news",
    results:25
})
const palindromeCharLowerLimit=6
const prohibitedSubreddits=['palindrom','wordplay','logophilia','linguist','language']

//deleteAllComments()
//return;

function isProhibitedSubreddit(comment){
    const subreddit=comment.subreddit.display_name.toLowerCase()
    let isProhibited=false
    for(let i=0;i<prohibitedSubreddits.length;i++){
        if(subreddit.includes(prohibitedSubreddits[i])){
            isProhibited=true;
            break;
        }
    }
    return isProhibited;
}

function itemEventHandler(comment){
    if(isProhibitedSubreddit(comment)){
        return;
    }
    const authorName=comment.author.name
    const palindrome_wordOnly=getPalindrome_wordOnly(comment)
    const palindrome_wordOnly_string=charIndexToString(palindrome_wordOnly)
    const unique=duplicate.makeUnique(palindrome_wordOnly_string)
    const numberOnly=/^\d+$/.test(palindrome_wordOnly_string)
    console.log(`palindrome_wordOnly: ${palindrome_wordOnly_string}`)
    console.log(`unique: ${unique}`)
    console.log(`numberOnly: ${numberOnly}`)
    //todo: test whether author query is allowing the same palindrome if written by another user
    if((unique.length>=palindromeCharLowerLimit)&&!numberOnly){
       PalindromeModel.countDocuments({ 
           wordOnly: palindrome_wordOnly_string,
            authorName:authorName
        })
       .then((result)=>{
            if(result===0){
                const index_first=palindrome_wordOnly[0].index
                const index_last=palindrome_wordOnly[palindrome_wordOnly.length-1].index
                const palindrome_reconstruct=comment.body.substring(index_first,index_last+1)

                console.log(`adding to model: \n`
                            +`comment body: ${comment.body}\n`
                            +`unique: ${unique}\n`
                            +`palindrome_wordOnly: ${palindrome_wordOnly_string}\n`
                            +`palindrome_reconstruct: ${palindrome_reconstruct}`)
                addPalindromeToModel(comment,unique,palindrome_wordOnly_string,palindrome_reconstruct)
            }
            else{
                console.log(`${palindrome_wordOnly_string}, written by user ${authorName}, already in database, result ${result}`)
            }

        })    
    }
}

function addPalindromeToModel(comment,unique,palindrome_wordOnly_string,palindrome_reconstruct){
    palindromeDocument=new PalindromeModel({
        body:comment.body,
        unfiltered:palindrome_reconstruct,
        wordOnly:palindrome_wordOnly_string,
        unique:unique,
        commentId:comment.id,
        authorName:comment.author.name
    })
    palindromeDocument.save()
    .then(result=>{
        output= `Your comment has a palindrome with ${palindromeCharLowerLimit} or more unique characters!`
                +` The longest one I found is:\n\n '${palindrome_reconstruct}'  \n\nThat's the first time I've seen you write this one.\n\n`
        comment.reply(output)
        console.log(output)
    })
    .catch(err=>{
        console.log(`error saving to db: ${err}`)
    })
}

function deleteAllComments(){
    redditConfig.getMe()
    .then(me=>{
        me.getComments()
        .then(comments=>{
            comments.forEach(comment=>{
                comment.delete()
            })
        })
    })
}


function getPalindrome_wordOnly(comment){
    //how unique do we want this to be?
    //like should "Madam, I'm Adam!" and 'Madam!  I'm...Adam.' be distinct?
    //no, those are the same sequences of words.
    //but "Madam! I, mad Ambrose, implore you..."
    //would be distinct because "Madam, I, mad Am"
    //is different when all non-word characters are replaced with spaces
    //and multiple spaces are replaced with single space
    //but then what about "Madam!  I, mad Amber, implore you..."
    //nope, sorry, it's been found already.  Boggle rules.
    const comment_wordOnlyWithIndexes=wordOnlyWithIndexes(comment.body)
    const palindrome_wordOnly=palindrome.longestPalindrome(comment_wordOnlyWithIndexes)
    const palindrome_wordOnly_str=charIndexToString(palindrome_wordOnly)
    return palindrome_wordOnly;
}

function charIndexToString(charIndex){
    return charIndex.reduce(function(accumulator,currentValue){
        return accumulator.concat(currentValue.char)
    },'')
}


function wordOnlyWithIndexes(str){
    indexMap=str.split('').map((char,index)=>{
        let charIndex={
            char:char,
            index:index
        }
        return charIndex;
    })
    let output=[];
    indexMap.map(charIndex=>{
        if(/[A-Za-z0-9]/g.test(charIndex.char)){
            output.push(charIndex)
        }
    })
    return output;
}

function getCountOfPalindrome(comment){
    palindrome_wordOnly=getPalindrome_wordOnly(comment)
    unique=duplicate.makeUnique(palindrome_wordOnly)
}

function wordWithCount(word,comment) {
    return PalindromeModel.countDocuments({ wordOnly: word })
      .then((result) => [result,word,comment]);
  }

function dbTester(comment){
    word=getWord(comment)
    wordWithCount(word)
    .then(([result,word,comment])=>{
        if(result===0){
            console.log(`${word} not found in database`)
        }
        else{
            console.log(`${word} already in database, result ${result}`)
        }

    })
}

mongoose.connect(
    process.env.MONGODB_URL,
    {
        useNewUrlParser:true,
        useUnifiedTopology:true
    })
.then(result=>{
    console.log("connected to db")
    stream.on("item",comment=>itemEventHandler(comment))
})
.catch(err=>{
    console.log(`err: ${err}`)
})










