const chatbotCloseBtn = document.querySelector(".close-btn");
const chatInput = document.querySelector(".chat-input textarea");
const sendChatBtn = document.querySelector(".chat-input span");
const chatBox = document.querySelector(".chatbox");
const chatbotToggler = document.querySelector(".chatbot-toggler");
let userMessage;
const API_KEY = "YOUR_API_KEY";
const inputInitHeight = chatInput.scrollHeight;

const createChatli = (message,className) =>{
    const chatLi = document.createElement("li");
    chatLi.classList.add("chat", className); 
    let chatContent = className === "outgoing" ? `<p></p>` : `<span class="material-symbols-outlined">smart_toy</span> <p></p>`;
    chatLi.innerHTML = chatContent;
    chatLi.querySelector("p").textContent = message;
    return chatLi;
}

const generateResponse = (incomingChatLi) => {
    const API_URL = "https://api.openai.com/v1/chat/completions"
    const messageElement = incomingChatLi.querySelector("p")
    const requestOptions = {
        method: "POST",
        headers: {
            "content-type": "application/json",
            "Authorization": `Bearer ${API_KEY}`
        },
        body: JSON.stringify({
            "model": "gpt-3.5-turbo",
            "messages": [
            {
                "role": "user",
                "content": userMessage
            }
            ]
        })

    }

    fetch(API_URL, requestOptions).then(res => res.json()).then(data=>{
        messageElement.textContent = data.choices[0].message.content;
    }).catch((error)=>{
        messageElement.classList.add("error");
        messageElement.textContent = "Oops! Something went wrong. Please try again."
    }).finally(() => chatBox.scrollTo(0,chatBox.scrollHeight));
}

const handelChat = () => {
    userMessage = chatInput.value.trim();
    if (!userMessage) return;
    chatInput.value = "";
    chatInput.style.height = `${inputInitHeight}px`

    chatBox.appendChild(createChatli(userMessage,"outgoing"));
    chatBox.scrollTo(0,chatBox.scrollHeight);
    setTimeout(()=>{
        const incomingChatLi = createChatli("Thinking...","incoming")
        chatBox.appendChild(incomingChatLi);
        chatBox.scrollTo(0,chatBox.scrollHeight);
        generateResponse(incomingChatLi);
    },600)
}


chatInput.addEventListener("input",(e)=>{
    chatInput.style.height = `${inputInitHeight}px`
    chatInput.style.height = `${chatInput.scrollHeight}px`
})

chatInput.addEventListener("keydown",(e)=>{
    if(e.key === "Enter" && !e.shiftKey && window.innerWidth > 800){
        e.preventDefault();
        handelChat();
    }
})

sendChatBtn.addEventListener("click", handelChat);
chatbotToggler.addEventListener("click", () => document.body.classList.toggle("show-chatbot"));
chatbotCloseBtn.addEventListener("click", () => document.body.classList.remove("show-chatbot"));