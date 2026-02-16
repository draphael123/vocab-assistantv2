document.getElementById("theme").addEventListener("change", save);
document.getElementById("wordList").addEventListener("change", save);
document.getElementById("reminder").addEventListener("change", save);
document.getElementById("fontSize").addEventListener("change", save);
document.getElementById("autoPlay").addEventListener("change", save);
document.getElementById("defaultTab").addEventListener("change", save);
document.getElementById("save").addEventListener("click", save);
document.getElementById("clearCache").addEventListener("click", clearCache);
document.getElementById("resetData").addEventListener("click", resetData);

async function load() {
  const stored = await chrome.storage.sync.get(["theme", "reminder", "wordList", "fontSize", "autoPlay", "defaultTab"]);
  document.getElementById("theme").value = stored.theme || "light";
  document.getElementById("reminder").value = stored.reminder || "off";
  document.getElementById("wordList").value = stored.wordList || "full";
  document.getElementById("fontSize").value = stored.fontSize || "medium";
  document.getElementById("autoPlay").value = stored.autoPlay || "off";
  document.getElementById("defaultTab").value = stored.defaultTab || "word";
}

async function save() {
  const theme = document.getElementById("theme").value;
  const reminder = document.getElementById("reminder").value;
  const wordList = document.getElementById("wordList").value;
  const fontSize = document.getElementById("fontSize").value;
  const autoPlay = document.getElementById("autoPlay").value;
  const defaultTab = document.getElementById("defaultTab").value;
  await chrome.storage.sync.set({ theme, reminder, wordList, fontSize, autoPlay, defaultTab });
  showSaved();
}

function showSaved() {
  document.getElementById("savedMsg").style.display = "block";
  setTimeout(() => { document.getElementById("savedMsg").style.display = "none"; }, 2000);
}

async function clearCache() {
  await chrome.storage.local.set({ definitionCache: {} });
  showSaved();
  document.getElementById("savedMsg").textContent = "Cache cleared.";
}

async function resetData() {
  if (!confirm("Reset all data? This will remove saved words, word history, quiz streak, and cached definitions.")) return;
  await chrome.storage.local.clear();
  await chrome.storage.sync.clear();
  showSaved();
  document.getElementById("savedMsg").textContent = "All data reset.";
  load();
}

load();
