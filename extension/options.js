document.getElementById("theme").addEventListener("change", save);
document.getElementById("wordList").addEventListener("change", save);
document.getElementById("reminder").addEventListener("change", save);
document.getElementById("save").addEventListener("click", save);

async function load() {
  const { theme = "light", reminder = "off", wordList = "full" } = await chrome.storage.sync.get(["theme", "reminder", "wordList"]);
  document.getElementById("theme").value = theme;
  document.getElementById("reminder").value = reminder;
  document.getElementById("wordList").value = wordList;
}

async function save() {
  const theme = document.getElementById("theme").value;
  const reminder = document.getElementById("reminder").value;
  const wordList = document.getElementById("wordList").value;
  await chrome.storage.sync.set({ theme, reminder, wordList });
  document.getElementById("savedMsg").style.display = "block";
  setTimeout(() => { document.getElementById("savedMsg").style.display = "none"; }, 2000);
}

load();
