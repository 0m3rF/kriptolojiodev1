
var inputName,inputMessage,messageBox;
var socket = io.connect('https://kriptolojiassignment1.herokuapp.com/'); //https://kriptolojiassignment1.herokuapp.com/

inputName = document.getElementById('inputName');
inputMessage = document.getElementById('inputMessage');
messageBox = document.getElementById('messageBox');
inputKey = document.getElementById('inputKey');

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
	var key = parseInt(inputKey.value) % 26;
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


  return result;
}

socket.on('cipherMessage',function (data){

	if(inputName.value  == data.name)
		return;
	
	messageBox.value += data.name + " : " + decipherText(data.message) +"\n";
	
});

function decipherText(text)
{

	if(inputKey.value == "")
		return text;

	var count = Math.floor(text.length / 6 );
	p = [2,5,0,4,1,3];
	var c = 1;
	var key = parseInt(inputKey.value) % 26;
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
	return result;
}

function mod(n, m) {
        return ((n % m) + m) % m;
}


  socket.on('news', function (data) {
    console.log(data);
    socket.emit('my other event', { my: 'data2' });
  });