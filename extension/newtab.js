(async () => {
  const optUrl = chrome.runtime.getURL("options.html");
  document.getElementById("openExt").href = optUrl;
  document.getElementById("openExt").onclick = (e) => {
    e.preventDefault();
    chrome.tabs.create({ url: optUrl });
  };
  const { dailyWord, dailyWordData } = (await chrome.storage.local.get(["dailyWord", "dailyWordData"])) || {};
  const wordEl = document.getElementById("word");
  const phoneticEl = document.getElementById("phonetic");
  const defEl = document.getElementById("def");
  if (dailyWord && dailyWordData) {
    wordEl.textContent = dailyWordData.word || dailyWord;
    phoneticEl.textContent = dailyWordData.phonetic || dailyWordData.phonetics?.find((p) => p.text)?.text || "";
    const def = dailyWordData.meanings?.[0]?.definitions?.[0]?.definition || "—";
    defEl.textContent = def;
  } else {
    wordEl.textContent = "Loading…";
    wordEl.classList.add("loading");
  }
})();
