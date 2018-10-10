    //Credit : https://codepen.io/brandonisgreen/pen/Khibx?editors=0010
var firstLetter = "ABCDEFGHIJKLMNOPQRSTUVWXYZABCDEFGHIJKLMNOPQRSTUVWXYZ"; // Most words(17%) start with T. Few start with K. Multiples of the same letter increases the odds of being chosen. 
    var cDiagraphs = "thhereedndhantledertvetito"; // letter pairs
    var vDiagraphs = "anineronatenesofeaioisouaras"; // letter pairs
    var endL = "estdnryfloghakmpuw";
    var cons = "ttttttttttnnnnnnnnsssssshhhhhhrrrrrdddddllllcccmmmwfffggyppbbvkjxz";
    var vowel = "eeeeeeeeeeeeeeaaaaaaaaooooooooiiiiiiiuuuy"; // Y is sometimes a vowel

       
    function word(len)
  {
				var theword = "";
				while(theword.length < (len)){ // word length
            if (theword.length === 0){ 
              var fLetterPos = Math.round(randomRange(0, firstLetter.length - 1));
                theword = theword + firstLetter.substr(fLetterPos,1);
              if (fLetterPos > 31){
                theword = theword+vowel.substr((Math.random())*vowel.length,1);
              }
            }//end first letter
            // Get a diagraph
            var llet = theword.substr(theword.length-1,1);
            // if word is good 'as-is'
            if(theword.length > 4){
            if ( goodEnd(llet) == true){
                  theword = theword+endL.substr((Math.random())*endL.length,1);//extra spaces to stop the loop(which goes by word length)
                  
                  break;
            }
            }
            var getDG = Math.floor(Math.random()*20);
            var newRan = Math.floor(Math.random()*5);
            // Use diagraph if vowel
            if (getDG > 15){
                //get last letter
                var llet = theword.substr(theword.length-1,1);
                if (isVowel(llet) == true){
                  theword = theword + cDiagraphs.substr(Math.floor(Math.random() * (cDiagraphs.length /2))*2, 2);
                }
              // roll a dice for diagraphs first letter (vowel vs const)
              var d3 = Math.floor(Math.random() * 3);
              if (d3 == 1){
                theword = theword + cDiagraphs.substr(Math.floor(Math.random() * (cDiagraphs.length /2))*2, 2);
              }
              else{
                theword = theword + vDiagraphs.substr(Math.floor(Math.random() * (vDiagraphs.length /2))*2, 2);
              }
            }
            if(newRan < 1){ // odds of vowel
                
                theword = theword+vowel.substr((Math.random())*vowel.length,1);
              } else {
					
					theword = theword +cons.substr((Math.random())*cons.length,1);
             }
				}
        
				return theword;
        }
  
function goodEnd (letter)
 {
    var chars = ["e", "s", "t", "d", "n", "r", "y", "f", "l", "o", "g", "h", "a", "k", "m", "p", "u", "w"];
    for(var i = 0; i < chars.length; i++){
        if(letter === chars[i]){
            return true;
         }
    }
    return false;
};

function isVowel (letter) {
    var vowels = ["a","e","i","o","u"];
    for(var i = 0; i < vowels.length; i++){
        if(letter === vowels[i]){
            return true;
         }
    }
    return false;
};