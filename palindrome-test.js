const palindrome=require('./palindrome.js')

let charIndexMap=function(str){
    str.split('').map((char,index)=>{
        let charIndex={
            char:char,
            index:index
        }
        return charIndex;
    })
}
console.log(palindrome.longestPalindrome("abcdedcba abcdefggfedcba"))
