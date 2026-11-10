    let speech = new SpeechSynthesisUtterance();

    let voices = []

    let voiceSelect = document.querySelector("select")

    window.speechSynthesis.onvoiceschanged = () =>{
        voices = window.speechSynthesis.getVoices();
        speech.voice = voices[0];

        voices.forEach((voice,i) => {
            const option = new Option(voice.name,i)
            voiceSelect.add(option)
        })
    };

    voiceSelect.addEventListener("change",() =>{
        speech.voice =voices[voiceSelect.value]
    })

    document.querySelector("button").addEventListener("click",() =>{
        const query = document.querySelector("textarea").value
        sendMessage(query)
    });

    async function sendMessage(message){
        try{
            const replyElement = document.getElementById("reply");
            replyElement.innerHTML = "Generating..."
            const response = await fetch("http://127.0.0.1:8000/chat", 
                {method : "POST", headers: {"Content-Type": "application/json"},
                body: JSON.stringify({message: message})
            });

            if(!response.ok){
                throw new Error(`HTTP ERROR : ${response.status}`);
            }
            const data = await response.json();
            replyElement.innerHTML= data.reply;

            speech.text = data.reply
            window.speechSynthesis.speak(speech)

        }
        catch(error){
            console.error('failed to fetch data', error);
        }
    }
