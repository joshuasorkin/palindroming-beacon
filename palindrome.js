//code taken from:
//https://leetcode.com/problems/longest-palindromic-substring/discuss/1487875/JavaScript-faster-than-90


//note that this works with the [{char,index}] array produced by app.wordOnlyWithIndexes()
function longestPalindrome(s) {
    let longest = [0, 1];
    for (let i = 1; i < s.length; i++) {
        const odd = getPalindrome(s, i - 1, i + 1);
        const even = getPalindrome(s, i - 1, i);
        const current = diff(odd) > diff(even) ? odd : even;
        if (diff(current) > diff(longest))
            longest = current;
    }        
    //return s.substring(longest[0], longest[1]);
    return s.slice(longest[0],longest[1])
};

function diff(tuple) {
    return tuple[1] - tuple[0];
}

function getPalindrome(s, left, right) {
    while (left >= 0 && right < s.length) {
        if (s[left].char.toLowerCase() !== s[right].char.toLowerCase())
            break;
        left--;
        right++;
    }
    return [left + 1, right];
}

exports.longestPalindrome=longestPalindrome
