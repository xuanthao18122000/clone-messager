
// Yêu cầu server kết nối với client
const socket = io();
const name = prompt('Tên bạn là gì ?');
let heightScroll = 1000;
socket.on("Send messenger old Client to Server", (payload) => {
    const messengers = Object.entries(payload.Data);
    for(const item of messengers){
        // clone element
        let chatItem;
        let setMessenger;
        if(item[1].name === name){
            chatItem = document.getElementById("messenger-myself").cloneNode(true);
            chatItem.style.display = "flex";
            setMessenger = chatItem.querySelector('#text-messenger-myself')
        }else{
            chatItem = document.getElementById("messenger").cloneNode(true);
            setMessenger = chatItem.querySelector('#text-messenger')
        }


        // const firstCharName = chatItem.querySelector('#name-user')
        // const fullName = chatItem.querySelector('#fullName')
        setMessenger.innerHTML = item[1].messengerText;
        // firstCharName.innerHTML = wordFirst;
        // fullName.innerHTML = messenger.name;
        // Set name
        messengerList.appendChild(chatItem);
    }
    document.getElementById('messengers').scrollTo(0, heightScroll+=100);
})
// Click submit send messenger from Client to Server
document.getElementById('btn-send-messenger').addEventListener("click", () => {
    const messengerText = document.getElementById('input-messenger').value;
    document.getElementById('input-messenger').value = "";
    // Send event from client to server
    if(messengerText){
        socket.emit("Send messenger Client to Server", {
            name,
            messengerText
        })
    }
})

// Camcel sumbit form load page
const element = document.querySelector('form');
element.addEventListener('submit', event => {
    event.preventDefault();
});

// Click submit send messenger from Server to Client
const messengerList = document.getElementById('messengers');
socket.on("Send messenger Server to Client", (messenger) => {
    if(messenger.name === name){
        // clone element
        const chatItem = document.getElementById("messenger-myself").cloneNode(true);
        chatItem.style.display = "flex";
        // Set messenger
        let wordFirst = messenger.name.charAt(0).toUpperCase();
        const b = chatItem.querySelector('#text-messenger-myself')
        // const firstCharName = chatItem.querySelector('#name-user')
        // const fullName = chatItem.querySelector('#fullName')
        b.innerHTML = messenger.messenger;
        // firstCharName.innerHTML = wordFirst;
        // fullName.innerHTML = messenger.name;
        // Set name
        messengerList.appendChild(chatItem);
    }else{
        const chatItem = document.getElementById("messenger").cloneNode(true);
        // chatItem.style.display = "flex";
        // Set messenger
        let wordFirst = messenger.name.charAt(0).toUpperCase();
        const b = chatItem.querySelector('#text-messenger')
        // const firstCharName = chatItem.querySelector('#name-user')
        // const fullName = chatItem.querySelector('#fullName')
        b.innerHTML = messenger.messenger;
        // firstCharName.innerHTML = wordFirst;
        // fullName.innerHTML = messenger.name;
        // Set name
        messengerList.appendChild(chatItem);
    }
    document.getElementById('messengers').scrollTo(0, heightScroll+=100);


})
//Share location
document.getElementById("btn-share-location").addEventListener("click", () => {
    if(!navigator.geolocation){
        return alert("Browser is looking for location!" )
    }
    navigator.geolocation.getCurrentPosition((position) => {
        console.log({position});
        const { latitude, longitude } = position.coords;
        socket.emit("Share location from client to server", { latitude, longitude })
    })
})

socket.on("Share location from server to client", (data) => {
    console.log({data})
    const messagesElement  = `<a id="text-messenger" href="${data}" target="_blank" class="text"> Click here to show locaiton </a>`;
    const messengerList = document.getElementById('messengers');
    messengerList.appendChild(messagesElement);
})
