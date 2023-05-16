var userAgent = navigator.userAgent;

// Check if the user's browser is Google Chrome
if (userAgent.indexOf("Chrome") == -1) {
  // If the user's browser is not Google Chrome, display an error message
  alert(
    "Error: This website is only for for Google Chrome. Please use Google Chrome to access this site."
  );
} else {
  if ("webkitSpeechRecognition" in window) {
    // Initialize webkitSpeechRecognition
    let speechRecognition = new webkitSpeechRecognition();
    const languageSelector = document.getElementById("lang-select");

    // String for the Final Transcript
    let final_transcript = "";
    let isRecognitionStarted = false;
    // Set the properties for the Speech Recognition object
    speechRecognition.continuous = true;
    speechRecognition.interimResults = true;
    speechRecognition.lang = languageSelector.value;

    languageSelector.addEventListener("change", (event) => {
      speechRecognition.stop();
      speechRecognition.lang = event.target.value;
      if (isRecognitionStarted) {
        setTimeout(() => {
          isRecognitionStarted = true;
          speechRecognition.start();
        }, 1000); //We call recognition.start() in a timeout to make sure the abort() function is done
      }
    });
    // Callback Function for the onStart Event
    speechRecognition.onstart = () => {
      console.log("start");
      // Show the Status Element
      document.querySelector("#status").style.display = "block";
    };
    speechRecognition.onerror = () => {
      console.log("error");
      // Hide the Status Element
      document.querySelector("#status").style.display = "none";
    };
    speechRecognition.onend = () => {
      console.log("stopped");
      if (isRecognitionStarted) {
        speechRecognition.start();
      }

      // Hide the Status Element
      document.querySelector("#status").style.display = "none";
    };

    speechRecognition.onresult = (event) => {
      // Create the interim transcript string locally because we don't want it to persist like final transcript
      let interim_transcript = "";

      // Loop through the results from the speech recognition object.
      for (let i = event.resultIndex; i < event.results.length; ++i) {
        // If the result item is Final, add it to Final Transcript, Else add it to Interim transcript
        console.log(event.results[i].isFinal, event.results[i]);
        if (event.results[i].isFinal) {
          final_transcript += `${event.results[i][0].transcript} । `;
          speechRecognition.stop();
          if (isRecognitionStarted) {
            setTimeout(() => {
              speechRecognition.start();
            }, 600);
          }
        } else {
          interim_transcript += event.results[i][0].transcript;
        }
      }

      // Set the Final transcript and Interim transcript.
      document.querySelector("#final").innerHTML = final_transcript;
      document.querySelector("#interim").innerHTML = interim_transcript;
    };

    // let timer = null;

    // Set the onClick property of the start button
    const startButton = document.getElementById("start");
    const stopButton = document.getElementById("stop");
    const transcribeButton = document.querySelector("#transcribe");
    const clearButton = document.querySelector("#clear");

    startButton.onclick = () => {
      speechRecognition.start();
      isRecognitionStarted = true;
      stopButton.disabled = false;
      stopButton.setAttribute("aria-disabled", "false");
      startButton.disabled = true;
      startButton.setAttribute("aria-disabled", "true");
      transcribeButton.disabled = true;
      transcribeButton.setAttribute("aria-disabled", "true");
    };
    // Set the onClick property of the stop button
    stopButton.onclick = () => {
      // Stop the Speech Recognition
      setTimeout(() => {
        speechRecognition.stop();
      }, 320);
      isRecognitionStarted = false;
      stopButton.disabled = true;
      stopButton.setAttribute("aria-disabled", "true");
      startButton.disabled = false;
      startButton.setAttribute("aria-disabled", "false");
      transcribeButton.disabled = false;
      transcribeButton.setAttribute("aria-disabled", "false");
    };
    clearButton.onclick = () => {
      final_transcript = "";
      document.querySelector("#final").innerHTML = final_transcript;
    };
    // Set the onClick property of the transcribe button
    transcribeButton.onclick = async () => {
      try {
        if (final_transcript.length === 0) {
          alert("Not enough text to transcribe");
          return;
        }
        document.querySelector(
          "#transcribed"
        ).innerHTML = `<div class="progress" role="progressbar" aria-label="Animated striped example" aria-valuenow="100" aria-valuemin="0" aria-valuemax="100">
          <div class="progress-bar progress-bar-striped progress-bar-animated" style="width: 100%"></div>
        </div>`;
        startButton.disabled = true;
        startButton.setAttribute("aria-disabled", "true");
        stopButton.disabled = true;
        stopButton.setAttribute("aria-disabled", "true");
        transcribeButton.disabled = true;
        transcribeButton.setAttribute("aria-disabled", "true");
        const response = await fetch(
          `${import.meta.env.VITE_SERVER_URL}/transcribe`,
          {
            method: "post",
            body: JSON.stringify({
              message: final_transcript,
            }),
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        const data = await response.json();
        console.log(data);
        document.querySelector("#transcribed").innerHTML = data.message;
      } catch (error) {
        console.log(error.message);
      }
      transcribeButton.disabled = false;
      transcribeButton.setAttribute("aria-disabled", "false");
      // final_transcript = "";
      startButton.disabled = false;
      startButton.setAttribute("aria-disabled", "false");
    };
  } else {
    console.log("Speech Recognition Not Available");
  }
}
