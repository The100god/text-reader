const toggle = document.getElementById("toggle");
const voiceSelect = document.getElementById("voiceSelect");

// Load toggle state and selected voice
chrome.storage.sync.get(["enabled", "voiceName"], (result) => {
  toggle.checked = result.enabled ?? true;
});

// Load available voices
function populateVoices() {
  const voices = speechSynthesis.getVoices();
  voiceSelect.innerHTML = "";

  voices.forEach((voice) => {
    const option = document.createElement("option");
    option.value = voice.name;
    option.textContent = `${voice.name} (${voice.lang})`;
    voiceSelect.appendChild(option);
  });

  // Set current selection
  chrome.storage.sync.get("voiceName", (result) => {
    if (result.voiceName) {
      voiceSelect.value = result.voiceName;
    }
  });
}

toggle.addEventListener("change", () => {
  chrome.storage.sync.set({ enabled: toggle.checked });
});

voiceSelect.addEventListener("change", () => {
  const selectedVoice = voiceSelect.value;
  chrome.storage.sync.set({ voiceName: selectedVoice });
});

speechSynthesis.onvoiceschanged = populateVoices;
populateVoices();
