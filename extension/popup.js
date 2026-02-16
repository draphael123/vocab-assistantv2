/**
 * Vocab Extender — Popup script
 * - Load daily word (day-of-year % words.length) from words.json + Free Dictionary API
 * - Tabs: Today's Word, Quiz, Saved
 * - Bookmark/save words to chrome.storage.local
 * - Quiz: correct definition + 3 random distractors, streak in storage
 */

const API_BASE = "https://api.dictionaryapi.dev/api/v2/entries/en";
let wordsList = [];
let dailyWord = null;
let dailyWordData = null;

// ── Daily word index (deterministic by date) ──
function getDayOfYear() {
  const now = new Date();
  const start = new Date(now.getFullYear(), 0, 0);
  const diff = now - start;
  const oneDay = 864e5;
  return Math.floor(diff / oneDay);
}

function getDailyWordKey() {
  const doy = getDayOfYear();
  return doy;
}

async function loadWordsList() {
  if (wordsList.length) return wordsList;
  const res = await fetch(chrome.runtime.getURL("words.json"));
  const list = await res.json();
  wordsList = Array.isArray(list) ? list : [];
  return wordsList;
}

function getDailyWordFromList() {
  const list = wordsList;
  if (!list.length) return null;
  const key = getDailyWordKey();
  const index = key % list.length;
  return list[index];
}

async function fetchWordFromAPI(word) {
  try {
    const res = await fetch(`${API_BASE}/${encodeURIComponent(word)}`);
    if (!res.ok) return null;
    const data = await res.json();
    return Array.isArray(data) ? data[0] : data;
  } catch {
    return null;
  }
}

function formatDate() {
  return new Date().toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
  });
}

// ── Render Today's Word panel ──
function renderWordPanel(apiEntry) {
  if (!apiEntry) {
    document.getElementById("wordTitle").textContent = dailyWord || "—";
    document.getElementById("wordTier").textContent = "offline";
    document.getElementById("phonetic").textContent = "No definition available.";
    document.getElementById("definitions").innerHTML = "";
    document.getElementById("audioRow").innerHTML = "";
    document.getElementById("examples").innerHTML = "";
    return;
  }

  const word = apiEntry.word || dailyWord;
  const phonetic = apiEntry.phonetic || apiEntry.phonetics?.find((p) => p.text)?.text || "—";
  const meanings = apiEntry.meanings || [];

  document.getElementById("wordTitle").textContent = word;
  document.getElementById("wordTier").textContent = "advanced";
  document.getElementById("phonetic").textContent = phonetic;

  let defHtml = "";
  meanings.slice(0, 3).forEach((m) => {
    const pos = m.partOfSpeech || "";
    (m.definitions || []).slice(0, 2).forEach((d) => {
      defHtml += `<div class="def-item"><div class="def-pos">${pos}</div><div class="def-text">${escapeHtml(d.definition)}</div></div>`;
    });
  });
  document.getElementById("definitions").innerHTML = defHtml || "<div class='def-item'><div class='def-text'>No definitions found.</div></div>";

  const audioSrc = apiEntry.phonetics?.find((p) => p.audio)?.audio;
  const audioHtml = audioSrc
    ? `<button type="button" class="btn-audio" data-src="${escapeAttr(audioSrc)}">▶ Play pronunciation</button>`
    : "";
  document.getElementById("audioRow").innerHTML = audioHtml;
  document.querySelectorAll(".btn-audio").forEach((btn) => {
    btn.addEventListener("click", () => {
      const a = new Audio(btn.dataset.src);
      a.play();
    });
  });

  let exHtml = "";
  meanings.forEach((m) => {
    (m.definitions || []).forEach((d) => {
      if (d.example) {
        exHtml += `<div class="example">${escapeHtml(d.example)}</div>`;
      }
    });
  });
  if (exHtml) {
    document.getElementById("examples").innerHTML = `<div class="examples-label">Examples</div>${exHtml}`;
  } else {
    document.getElementById("examples").innerHTML = "";
  }
}

function escapeHtml(s) {
  const div = document.createElement("div");
  div.textContent = s;
  return div.innerHTML;
}
function escapeAttr(s) {
  return s.replace(/"/g, "&quot;");
}

// ── Bookmark ──
async function isSaved(word) {
  const { savedWords = [] } = await chrome.storage.local.get("savedWords");
  return savedWords.includes(word?.toLowerCase());
}

async function toggleSaved(word) {
  const { savedWords = [] } = await chrome.storage.local.get("savedWords");
  const w = word?.toLowerCase();
  const next = savedWords.includes(w) ? savedWords.filter((x) => x !== w) : [...savedWords, w];
  await chrome.storage.local.set({ savedWords: next });
  updateBookmarkButton();
}

function updateBookmarkButton() {
  if (!dailyWord) return;
  isSaved(dailyWord).then((saved) => {
    const btn = document.getElementById("btnBookmark");
    btn.classList.toggle("saved", saved);
    btn.setAttribute("aria-label", saved ? "Remove from saved" : "Save word");
  });
}

// ── Tabs ──
function initTabs() {
  document.querySelectorAll(".popup-tab").forEach((tab) => {
    tab.addEventListener("click", () => {
      const name = tab.dataset.tab;
      document.querySelectorAll(".popup-tab").forEach((t) => t.classList.remove("active"));
      document.querySelectorAll(".panel").forEach((p) => p.classList.remove("active"));
      tab.classList.add("active");
      const panel = document.getElementById(`panel-${name}`);
      if (panel) panel.classList.add("active");
      if (name === "quiz") initQuiz();
      if (name === "saved") renderSavedList();
    });
  });
}

// ── Quiz ──
let quizStreak = 0;
async function loadQuizStreak() {
  const { quizStreak: s = 0 } = await chrome.storage.local.get("quizStreak");
  quizStreak = s;
}

async function saveQuizStreak() {
  await chrome.storage.local.set({ quizStreak });
}

function initQuiz() {
  const promptEl = document.getElementById("quizPrompt");
  const wordEl = document.getElementById("quizWord");
  const optionsEl = document.getElementById("quizOptions");
  const feedbackEl = document.getElementById("quizFeedback");
  const streakEl = document.getElementById("quizStreak");

  if (!dailyWord || !dailyWordData) {
    wordEl.textContent = "—";
    optionsEl.innerHTML = "<p>Load today's word first.</p>";
    return;
  }

  const correctDef = dailyWordData?.meanings?.[0]?.definitions?.[0]?.definition || "No definition.";
  const others = wordsList.filter((w) => w !== dailyWord);
  const shuffle = (arr) => arr.slice().sort(() => Math.random() - 0.5);
  const three = shuffle(others).slice(0, 3);
  const options = shuffle([correctDef, ...three.map(() => "Definition for another word.")]);

  wordEl.textContent = dailyWord;
  feedbackEl.textContent = "";
  feedbackEl.className = "quiz-feedback";
  streakEl.textContent = `Streak: ${quizStreak}`;

  optionsEl.innerHTML = options
    .map(
      (text, i) =>
        `<button type="button" class="quiz-option" data-correct="${text === correctDef}">${escapeHtml(text)}</button>`
    )
    .join("");

  optionsEl.querySelectorAll(".quiz-option").forEach((btn) => {
    btn.addEventListener("click", () => {
      if (feedbackEl.textContent) return;
      const correct = btn.dataset.correct === "true";
      btn.classList.add(correct ? "correct" : "incorrect");
      feedbackEl.textContent = correct ? "Correct!" : "Incorrect.";
      feedbackEl.className = "quiz-feedback " + (correct ? "correct" : "incorrect");
      if (correct) {
        quizStreak += 1;
        saveQuizStreak();
      } else {
        quizStreak = 0;
        saveQuizStreak();
      }
      streakEl.textContent = `Streak: ${quizStreak}`;
    });
  });
}

// ── Saved list ──
async function renderSavedList() {
  const { savedWords = [] } = await chrome.storage.local.get("savedWords");
  const query = (document.getElementById("searchSaved")?.value || "").toLowerCase();
  const filtered = query ? savedWords.filter((w) => w.includes(query)) : savedWords;

  const listEl = document.getElementById("savedList");
  listEl.innerHTML = filtered
    .map(
      (w) =>
        `<li><span>${escapeHtml(w)}</span><button type="button" data-word="${escapeAttr(w)}" title="Remove">✕</button></li>`
    )
    .join("");

  listEl.querySelectorAll("button").forEach((btn) => {
    btn.addEventListener("click", async () => {
      const w = btn.dataset.word;
      const { savedWords: list = [] } = await chrome.storage.local.get("savedWords");
      await chrome.storage.local.set({ savedWords: list.filter((x) => x !== w) });
      renderSavedList();
    });
  });
}

// ── Init ──
async function init() {
  document.getElementById("dateLabel").textContent = formatDate();

  await loadWordsList();
  const cached = await chrome.storage.local.get(["dailyWord", "dailyWordDate", "dailyWordData"]);
  const dateKey = getDailyWordKey();
  if (cached.dailyWordDate === dateKey && cached.dailyWordData) {
    dailyWord = cached.dailyWord;
    dailyWordData = cached.dailyWordData;
  } else {
    dailyWord = getDailyWordFromList();
    dailyWordData = dailyWord ? await fetchWordFromAPI(dailyWord) : null;
    await chrome.storage.local.set({
      dailyWord,
      dailyWordDate: dateKey,
      dailyWordData: dailyWordData || undefined,
    });
  }

  renderWordPanel(dailyWordData);
  updateBookmarkButton();
  document.getElementById("btnBookmark").addEventListener("click", () => {
    toggleSaved(dailyWord);
  });

  document.getElementById("searchSaved")?.addEventListener("input", renderSavedList);
  initTabs();
  loadQuizStreak();
}

init();
