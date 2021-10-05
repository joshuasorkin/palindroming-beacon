function makeUnique(str) {
    return String.prototype.concat(...new Set(str.toLowerCase()))
  }

function hasNonDuplicate(s){
    if(s.length===1){
        return false
    }
    sFirst=s[0]
    for(i=1;i<s.length;i++){
        sChar=s[i]
        if(sChar!==sFirst){
            return true
        }
    }
    return false

}

exports.hasNonDuplicate=hasNonDuplicate
exports.makeUnique=makeUnique