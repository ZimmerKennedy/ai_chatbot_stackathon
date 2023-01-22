import bot from "./assets/bot.svg";
import user from "./assets/user.svg";

const form = document.querySelector("form");
const chatContainer = document.querySelector("#chat_container");

let loadInterval;
// loader(element) - This function takes in an element as an argument and sets the textContent of that element to an empty string. 
// sets an interval to add a period to the element's text content every 300ms. If the text content becomes 4 periods long, it will reset to an empty string.
const loader = (element) => {
  element.textContent = "";
  loadInterval = setInterval(() => {
    element.textContent += ".";
    if (element.textContent === '....'){
        element.textContent = '';
    }
  }, 300);
};
// typeText(element, text) - This function takes in an element and a text as arguments.
// It creates an interval that types out the text passed as an argument to the element passed as an argument, one character at a time, at a rate of 20ms per character.
const typeText = (element,text) => {
    let index = 0;
    let interval = setInterval(() => {
        if(index < text.length){
            element.innerHTML += text.charAt(index);
            index++;
        } else {
            clearInterval(interval)
        }
    }, 20)
}
// generateUniqueId() - This function creates a unique id by combining the current timestamp, a random number, and a hexadecimal string representation of that random number.
// It returns the combined string in the format "id-timestamp-hexadecimalString".
const generateUniqueId = () =>{
    const timestamp = Date.now();
    const randomNumber = Math.random();
    const hexadecimalString = randomNumber.toString(16);
    return `id-${timestamp}-${hexadecimalString}`
}
// create an HTML string that represents a chat message stripe with a profile picture, message text, and unique ID, depending on whether the message is from the AI or the user.
const chatStripe = (isAi, value, uniqueId) => {
    return (
        `
        <div class="wrapper ${isAi && 'ai'}">
            <div class="chat"> 
                <div classname="profile">
                    <img 
                        src="${isAi ? bot : user}"
                        alt="${isAi ? 'bot' : 'user'}"
                    />
                </div>
                    <div class="message" id=${uniqueId}>${value}</div>
            </div>
        </div>
        `
    )
}

const handleSubmit = async(e) =>{
    e.preventDefault();
    
    const data = new FormData(form);
        // users chatStripe
    chatContainer.innerHTML += chatStripe(false, data.get('prompt'));
    form.reset();

        // bots chatstripe
    const uniqueId = generateUniqueId();
    chatContainer.innerHTML += chatStripe(true, " ", uniqueId);
        // everytime a chat make it view height
    chatContainer.scrollTop = chatContainer.scrollHeight;
    const messageDiv = document.getElementById(uniqueId);
    loader(messageDiv);

    // fetch data from server => bot's response
    const response = await fetch('https://arti-the-chatbot.onrender.com/',{
        method: 'POST',
        headers:{
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            prompt: data.get('prompt')
        })
    })
    clearInterval(loadInterval)
    messageDiv.innerHTML = '';
    if(response.ok){
        const data = await response.json();
        const parsedData = data.bot.trim();
        typeText(messageDiv, parsedData);
    } else {
        const err = await response.text();
        messageDiv.innerHTML = "Try Again Later"
        alert(err)
    }
}
// handles submit
form.addEventListener('submit', handleSubmit);
// submit using the enter key
form.addEventListener('keydown',(e) =>{
    if(e.keyCode === 13){
        handleSubmit(e)
    }
})