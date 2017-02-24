
var inputName,inputMessage,messageBox;
var socket = io.connect('http://localhost:3000');

inputName = document.getElementById('inputName');
inputMessage = document.getElementById('inputMessage');
messageBox = document.getElementById('messageBox');


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
  return text + "* Buraya Şifrelenmiş hali dönecek!";
}

socket.on('cipherMessage',function (data){

	if(inputName.value  == data.name)
		return;
	
	messageBox.value += data.name + " : " + decipherText(data.message) +"\n";
	
});

function decipherText(text)
{
	return text.split("*")[0];
}


  socket.on('news', function (data) {
    console.log(data);
    socket.emit('my other event', { my: 'data2' });
  });