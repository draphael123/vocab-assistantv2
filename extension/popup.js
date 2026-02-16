/**
 * Vocab Extender — Popup script
 * - Daily word from words.json + Free Dictionary API
 * - Quiz with real distractors from other words; keyboard shortcuts
 * - Saved words: view definitions, export, search
 * - Theme aligned with website (cream/teal)
 * - Offline fallback, loading/error states
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
  return getDayOfYear();
}

async function loadWordsList() {
  if (wordsList.length) return wordsList;
  const res = await fetch(chrome.runtime.getURL("words.json"));
  const list = await res.json();
  wordsList = Array.isArray(list) ? list : [];
  return wordsList;
}

function getDailyWordFromList() {
  if (!wordsList.length) return null;
  const index = getDailyWordKey() % wordsList.length;
  return wordsList[index];
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

/** Get definition string for word; uses cache first */
async function getDefinitionForWord(word) {
  const cache = (await chrome.storage.local.get("definitionCache")).definitionCache || {};
  if (cache[word?.toLowerCase()]) return cache[word.toLowerCase()];
  const apiEntry = await fetchWordFromAPI(word);
  const def = apiEntry?.meanings?.[0]?.definitions?.[0]?.definition || null;
  if (def && word) {
    cache[word.toLowerCase()] = def;
    await chrome.storage.local.set({ definitionCache: cache });
  }
  return def;
}

function formatDate() {
  return new Date().toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
  });
}

function escapeHtml(s) {
  const div = document.createElement("div");
  div.textContent = s;
  return div.innerHTML;
}

function escapeAttr(s) {
  return s ? String(s).replace(/"/g, "&quot;").replace(/</g, "&lt;").replace(/>/g, "&gt;") : "";
}

// ── Render Today's Word panel ──
function renderWordPanel(apiEntry) {
  const wordTitle = document.getElementById("wordTitle");
  const wordTier = document.getElementById("wordTier");
  const phonetic = document.getElementById("phonetic");
  const definitions = document.getElementById("definitions");
  const audioRow = document.getElementById("audioRow");
  const examples = document.getElementById("examples");

  if (!apiEntry) {
    wordTitle.textContent = dailyWord || "—";
    wordTier.textContent = dailyWord ? "offline" : "—";
    phonetic.textContent = "Check your connection and try again.";
    definitions.innerHTML = "";
    audioRow.innerHTML = "";
    examples.innerHTML = "";
    return;
  }

  const word = apiEntry.word || dailyWord;
  const phoneticText = apiEntry.phonetic || apiEntry.phonetics?.find((p) => p.text)?.text || "—";
  const meanings = apiEntry.meanings || [];

  wordTitle.textContent = word;
  wordTier.textContent = "advanced";
  phonetic.textContent = phoneticText;

  let defHtml = "";
  meanings.slice(0, 3).forEach((m) => {
    const pos = m.partOfSpeech || "";
    (m.definitions || []).slice(0, 2).forEach((d) => {
      defHtml += `<div class="def-item"><div class="def-pos">${pos}</div><div class="def-text">${escapeHtml(d.definition)}</div></div>`;
    });
  });
  definitions.innerHTML = defHtml || "<div class='def-item'><div class='def-text'>No definitions found.</div></div>";

  const audioSrc = apiEntry.phonetics?.find((p) => p.audio)?.audio;
  audioRow.innerHTML = audioSrc
    ? `<button type="button" class="btn-audio" data-src="${escapeAttr(audioSrc)}">▶ Play pronunciation</button>`
    : "";
  document.querySelectorAll(".btn-audio").forEach((btn) => {
    btn.addEventListener("click", () => {
      const a = new Audio(btn.dataset.src);
      a.play();
    });
  });

  let exHtml = "";
  meanings.forEach((m) => {
    (m.definitions || []).forEach((d) => {
      if (d.example) exHtml += `<div class="example">${escapeHtml(d.example)}</div>`;
    });
  });
  examples.innerHTML = exHtml ? `<div class="examples-label">Examples</div>${exHtml}` : "";
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

// ── Quiz (real distractors, keyboard shortcuts) ──
let quizStreak = 0;
async function loadQuizStreak() {
  const { quizStreak: s = 0 } = await chrome.storage.local.get("quizStreak");
  quizStreak = s;
}

async function saveQuizStreak() {
  await chrome.storage.local.set({ quizStreak });
}

async function initQuiz() {
  const promptEl = document.getElementById("quizPrompt");
  const wordEl = document.getElementById("quizWord");
  const optionsEl = document.getElementById("quizOptions");
  const feedbackEl = document.getElementById("quizFeedback");
  const streakEl = document.getElementById("quizStreak");

  if (!dailyWord || !dailyWordData) {
    wordEl.textContent = "—";
    optionsEl.innerHTML = "<p class='quiz-loading'>Load today's word first.</p>";
    return;
  }

  const correctDef = dailyWordData?.meanings?.[0]?.definitions?.[0]?.definition || "No definition.";
  const others = wordsList.filter((w) => w.toLowerCase() !== dailyWord.toLowerCase());
  const shuffle = (arr) => arr.slice().sort(() => Math.random() - 0.5);
  const threeWords = shuffle(others).slice(0, 3);

  optionsEl.innerHTML = "<p class='quiz-loading'>Loading quiz…</p>";
  const distractorDefs = [];
  for (const w of threeWords) {
    const d = await getDefinitionForWord(w);
    if (d && d !== correctDef && !distractorDefs.includes(d)) distractorDefs.push(d);
  }
  let attempts = 0;
  while (distractorDefs.length < 3 && others.length > 0 && attempts < 20) {
    const fallback = others[Math.floor(Math.random() * others.length)];
    const d = await getDefinitionForWord(fallback);
    if (d && d !== correctDef && !distractorDefs.includes(d)) distractorDefs.push(d);
    attempts++;
  }
  const options = shuffle([correctDef, ...distractorDefs.slice(0, 3)]);

  wordEl.textContent = dailyWord;
  feedbackEl.textContent = "";
  feedbackEl.className = "quiz-feedback";
  streakEl.textContent = `Streak: ${quizStreak}`;

  optionsEl.innerHTML = options
    .map(
      (text, i) =>
        `<button type="button" class="quiz-option" data-index="${i}" data-correct="${text === correctDef}">${i + 1}. ${escapeHtml(text)}</button>`
    )
    .join("");

  const buttons = optionsEl.querySelectorAll(".quiz-option");
  const selectOption = (btn) => {
    if (feedbackEl.textContent) return;
    const correct = btn.dataset.correct === "true";
    btn.classList.add(correct ? "correct" : "incorrect");
    feedbackEl.textContent = correct ? "Correct!" : "Incorrect.";
    feedbackEl.className = "quiz-feedback " + (correct ? "correct" : "incorrect");
    quizStreak = correct ? quizStreak + 1 : 0;
    saveQuizStreak();
    streakEl.textContent = `Streak: ${quizStreak}`;
  };

  buttons.forEach((btn) => {
    btn.addEventListener("click", () => selectOption(btn));
  });

  if (!document._quizKeyHandlerAttached) {
    document.addEventListener("keydown", quizKeyHandler);
    document._quizKeyHandlerAttached = true;
  }
  const hint = document.getElementById("quizShortcutHint");
  if (hint) hint.textContent = "Press 1–4 to select an answer.";
}

function quizKeyHandler(e) {
  const panel = document.getElementById("panel-quiz");
  if (!panel?.classList.contains("active")) return;
  const idx = e.key === "1" ? 0 : e.key === "2" ? 1 : e.key === "3" ? 2 : e.key === "4" ? 3 : -1;
  if (idx >= 0) {
    const btn = document.querySelector(`#quizOptions .quiz-option[data-index="${idx}"]`);
    if (btn && !document.getElementById("quizFeedback").textContent) {
      e.preventDefault();
      btn.click();
    }
  }
}

// ── Saved list: view definitions, export ──
async function renderSavedList() {
  const { savedWords = [] } = await chrome.storage.local.get("savedWords");
  const query = (document.getElementById("searchSaved")?.value || "").toLowerCase();
  const filtered = query ? savedWords.filter((w) => w.includes(query)) : savedWords;
  const listEl = document.getElementById("savedList");
  const exportBtn = document.getElementById("exportSaved");

  listEl.innerHTML = filtered
    .map(
      (w) =>
        `<li data-word="${escapeAttr(w)}"><span class="saved-word">${escapeHtml(w)}</span><span class="saved-actions"><button type="button" class="btn-view" data-word="${escapeAttr(w)}" title="View definition">View</button><button type="button" class="btn-remove" data-word="${escapeAttr(w)}" title="Remove">✕</button></span></li>`
    )
    .join("");

  listEl.querySelectorAll(".btn-remove").forEach((btn) => {
    btn.addEventListener("click", async (e) => {
      e.stopPropagation();
      const w = btn.dataset.word;
      const { savedWords: list = [] } = await chrome.storage.local.get("savedWords");
      await chrome.storage.local.set({ savedWords: list.filter((x) => x !== w) });
      renderSavedList();
    });
  });

  listEl.querySelectorAll(".btn-view").forEach((btn) => {
    btn.addEventListener("click", async (e) => {
      e.stopPropagation();
      const w = btn.dataset.word;
      showSavedWordDefinition(w);
    });
  });

  const exportBtn = document.getElementById("exportSaved");
  if (exportBtn) exportBtn.style.display = filtered.length ? "inline-flex" : "none";
}

async function showSavedWordDefinition(word) {
  const modal = document.getElementById("savedWordModal");
  const content = document.getElementById("savedWordContent");
  const closeBtn = document.getElementById("savedWordClose");
  if (!modal || !content) return;
  modal.classList.add("active");
  content.innerHTML = "<p class='modal-loading'>Loading…</p>";
  const apiEntry = await fetchWordFromAPI(word);
  if (!apiEntry) {
    content.innerHTML = "<p class='modal-error'>Could not load definition. Check your connection.</p>";
  } else {
    const w = apiEntry.word || word;
    const phonetic = apiEntry.phonetic || apiEntry.phonetics?.find((p) => p.text)?.text || "—";
    const meanings = apiEntry.meanings || [];
    let defHtml = "";
    meanings.slice(0, 3).forEach((m) => {
      const pos = m.partOfSpeech || "";
      (m.definitions || []).slice(0, 2).forEach((d) => {
        defHtml += `<div class="def-item"><div class="def-pos">${pos}</div><div class="def-text">${escapeHtml(d.definition)}</div></div>`;
      });
    });
    const audioSrc = apiEntry.phonetics?.find((p) => p.audio)?.audio;
    const audioHtml = audioSrc ? `<button type="button" class="btn-audio modal-audio" data-src="${escapeAttr(audioSrc)}">▶ Play</button>` : "";
    content.innerHTML = `<h2 class="modal-word">${escapeHtml(w)}</h2><p class="phonetic">${escapeHtml(phonetic)}</p>${audioHtml}<div class="definitions">${defHtml || "<p>No definitions.</p>"}</div>`;
    content.querySelectorAll(".btn-audio").forEach((btn) => {
      btn.addEventListener("click", () => new Audio(btn.dataset.src).play());
    });
  }
  closeBtn.onclick = () => modal.classList.remove("active");
  modal.onclick = (e) => { if (e.target === modal) modal.classList.remove("active"); };
}

function exportSavedWords() {
  chrome.storage.local.get("savedWords", ({ savedWords = [] }) => {
    const text = savedWords.join("\n");
    const blob = new Blob([text], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "vocab-extender-saved-words.txt";
    a.click();
    URL.revokeObjectURL(url);
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
    if (!dailyWordData && dailyWord && cached.dailyWordDate === dateKey - 1 && cached.dailyWordData) {
      dailyWordData = cached.dailyWordData;
    }
    await chrome.storage.local.set({
      dailyWord,
      dailyWordDate: dateKey,
      dailyWordData: dailyWordData || undefined,
    });
  }

  renderWordPanel(dailyWordData);
  updateBookmarkButton();
  document.getElementById("btnBookmark").addEventListener("click", () => toggleSaved(dailyWord));

  document.getElementById("searchSaved")?.addEventListener("input", renderSavedList);
  document.getElementById("exportSaved")?.addEventListener("click", exportSavedWords);
  initTabs();
  await loadQuizStreak();

  chrome.storage.sync.get("theme", ({ theme = "light" }) => {
    document.body.classList.toggle("theme-dark", theme === "dark");
  });
}

init();
