let isEnabled = true;
let selectedVoiceName = "";
let selectedVoice = null;
let lastSelection = "";

// Load settings
chrome.storage.sync.get(["enabled", "voiceName"], (result) => {
  isEnabled = result.enabled ?? true;
  selectedVoiceName = result.voiceName ?? "";
  loadVoice();
});

// Update when changed
chrome.storage.onChanged.addListener((changes) => {
  if (changes.enabled) isEnabled = changes.enabled.newValue;
  if (changes.voiceName) {
    selectedVoiceName = changes.voiceName.newValue;
    loadVoice();
  }
});

function loadVoice() {
  const voices = speechSynthesis.getVoices();
  selectedVoice = voices.find(v => v.name === selectedVoiceName) || voices[0];
}

speechSynthesis.onvoiceschanged = loadVoice;
loadVoice();

// Monitor selection
setInterval(() => {
  if (!isEnabled) return;

  const selectedText = window.getSelection()?.toString().trim() || "";

  if (selectedText && selectedText !== lastSelection) {
    speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(selectedText);
    if (selectedVoice) utterance.voice = selectedVoice;
    speechSynthesis.speak(utterance);
    lastSelection = selectedText;
  }

  if (!selectedText && lastSelection) {
    speechSynthesis.cancel();
    lastSelection = "";
  }
}, 200);
