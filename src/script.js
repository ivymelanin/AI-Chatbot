const chatsContainer = document.querySelector(".chats-container");
const promptForm = document.querySelector(".prompt-form");
const promptInput = promptForm.querySelector(".prompt-input");

//API Setup
const API_KEY = "AIzaSyAQC_qO258b5szQoT6suXJ3erJ6GEqSGwc"
const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${API_KEY}`;

let userMessage = "";
const chatHistory = [];

//function to create message elements
const createMsgElement = (content, ...classes) => {
    const div = document.createElement("div");
    div.classList.add("message", ...classes);
    div.innerHTML= content;
    return div;
}
 // Make the API call and generate the bot's response
const generateResponse = async () => {
    //Add user messages to the chat history
    chatHistory.push({
        role: "user",
        parts: [{ text: userMessage }]
    });
    try{
        // Send the chat history to the API to get a response
        const response = await fetch(API_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ contents: chatHistory })
        });

        const data = await response.json();
        if(!response.ok) throw new Error(data.error.message);

        console.log(data);
    } catch (error){
        console.log(error);
    }
}

//Handle the form submission
const handleFormSubmit = (e) => {
    e.preventDefault();
    userMessage = promptInput.value.trim();
    if(!userMessage) return;

    promptInput.value = "";
    // Generate user message HTML and add in the chats container
    const userMsgHTML = `<p class="message-text"></p>`;
    const userMsgDiv = createMsgElement(userMsgHTML, "user-message");

    userMsgDiv.querySelector(".message-text").textContent = userMessage;
    chatsContainer.appendChild(userMsgDiv);

    setTimeout(() => {
        // Generate user message HTML and add in the chats container after 600ms
        const botMsgHTML = `<img src="src/media/loading_icon_small_transparent.png" class="icon"><p class="message-text">Just a sec...</p>`;
        const botMsgDiv = createMsgElement(botMsgHTML, "bot-message", "loading");
        chatsContainer.appendChild(botMsgDiv);
        generateResponse();
    }, 600);
}

promptForm.addEventListener("submit", handleFormSubmit);