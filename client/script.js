
var inputName,inputMessage,messageBox,inputKey,inputPrivateKey,labelPublicKey;
//var socket = io.connect('localhost:3000');
var socket = io.connect('https://kriptolojiassignment1.herokuapp.com/');	

inputName = document.getElementById('inputName');
inputMessage = document.getElementById('inputMessage');
messageBox = document.getElementById('messageBox');
inputKey = document.getElementById('inputKey');
labelPublicKey = document.getElementById('labelPublicKey');
inputPrivateKey = document.getElementById('inputPrivateKey');

var p2 = 11;
var alfa = 2;
var myPublicKey = -1;
var otherPublicKey = -1;
var privateKey = -1;
var commonKey = -1;
var key = -1;
inputMessage.addEventListener("keyup", function(event) {
event.preventDefault();
if (event.keyCode == 13) {
    document.getElementById("sendButton").click();
}
});

function sendMessage()
{
	socket.emit('sendMessage',{name:inputName.value, message: cipherText(inputMessage.value)});

	messageBox.value += inputName.value + " : " + inputMessage.value + " /|\\ (C):" + cipherText(inputMessage.value) + "\n";
	inputMessage.value = "";
}

function cipherText(text)
{

	if(inputKey.value == "")
		return text;


	var count = Math.floor(text.length / 6 );
	p = [2,4,0,5,3,1];
	var c = 1;
	key = parseInt(inputKey.value) % 26;
	result = "";
	while(count > 0)
	{
		x = text.substring( (6*c) - 6 , 6*c );
		temp = [];
		for (i=0;i<6;i++)
		{
			temp[i] = x[p[i]];
		
			if(i == 0)
			{
				temp[i] = String.fromCharCode(((temp[i].charCodeAt(0)-97 + key) % 26) +97);
			}
			else
			{
				temp[i] = String.fromCharCode(((temp[i].charCodeAt(0)-97 + temp[i-1].charCodeAt(0)-97 ) % 26)+97);
			}
		}			
		result += temp.join('');
		c++;
		count--;
	}

	if(text.length % 6 > 0)
		result += text.substring( (6*c) - 6 , 6*c );

	messageBox.scrollTop = messageBox.scrollHeight;
	return result;
}

socket.on('cipherMessage',function (data){

	if(inputName.value  == data.name)
		return;
	
	messageBox.value += data.name + " : " + decipherText(data.message) +"\n";
	messageBox.scrollTop = messageBox.scrollHeight;

});

function decipherText(text)
{

	if(inputKey.value == "")
		return text;

	var count = Math.floor(text.length / 6 );
	p = [2,5,0,4,1,3];
	var c = 1;
	key = parseInt(inputKey.value) % 26;
	result = "";

	while(count > 0)
	{
		x = text.substring( (6*c) - 6 , 6*c );
		temp = [];

		for(i=0;i<6;i++)
		{
		   	temp[i] = x[p[i]];
		  	if(p[i] == 0)
		       temp[i] = String.fromCharCode( ( mod((x[p[i]].charCodeAt(0)-97 - key),26) ) +97);
		  	else
		       temp[i] = String.fromCharCode(( mod(x[p[i]].charCodeAt(0)-97 - (x[p[i]-1].charCodeAt(0)-97 ) , 26))+97); 
		}
		result += temp.join('');
		c++;
		count--;
	}

	if(text.length % 6 > 0)
		result += text.substring( (6*c) - 6 , 6*c );
	messageBox.scrollTop = messageBox.scrollHeight;
	return result;
}

function mod(n, m)
{
    return ((n % m) + m) % m;
}

function generatePublicKey()
{
	privateKey = parseInt(inputPrivateKey.value);

	if(0 <= privateKey && privateKey <= p2-2)
	{
	
		myPublicKey = Math.pow(alfa,privateKey) % p2;
		labelPublicKey.textContent = "Your Public Key Is : " + myPublicKey;

	}
	else
	{
		labelPublicKey.textContent = "Your private key must be between 0 and " + (p2-2)  + "  !";
		return;
	}


}

function calculateCommonKey() 
{
	otherPublicKey = parseInt(document.getElementById('inputPublicKey').value);

	commonKey = Math.pow(otherPublicKey,privateKey) % p2;

	inputKey.value = commonKey;

}

function sendPublicKey() {
	if(myPublicKey < 0)
	{
		labelPublicKey.textContent = "First Create Public Key Here !";
	}
	else
	{
		socket.emit('sendMessage',{name:inputName.value, message: "My Public key is " + myPublicKey});
		document.getElementById('inputKey').value ="";
	messageBox.value += inputName.value + " : My Public key is " + myPublicKey + "\n";
		labelPublicKey.textContent = "Public key : " + myPublicKey + " shared!";
	}
}

function power(a, b, prime) {
	if (b <= 0) {
	    return 1;
	} else if (b === 1) {
	    return a % prime;
	} else if (b % 2 === 0) {
	    return power(a * a, b / 2 | 0, prime) % prime;
	} else {
	    return power(a * a, b / 2 | 0, prime) * a % prime;
	}
}