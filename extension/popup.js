/**
 * Vocab Extender — Popup script
 * - Daily word from words.json + Free Dictionary API
 * - Quiz with real distractors from other words; keyboard shortcuts
 * - Saved words: view definitions, export, search
 * - Theme aligned with website (cream/teal)
 * - Offline fallback, loading/error states
 */
(function () {
  const t = document.getElementById("wordTitle");
  if (t) t.textContent = "…";
})();

const API_BASE = "https://api.dictionaryapi.dev/api/v2/entries/en";
const WEBSITE_BASE = "https://vocab-assistantv2.vercel.app";
const EXT_VERSION = chrome.runtime.getManifest().version;
let wordsList = [];
let currentWordList = "full";
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

function withTimeout(promise, ms, fallback) {
  return Promise.race([
    promise,
    new Promise((_, reject) => setTimeout(() => reject(new Error("timeout")), ms)),
  ]).catch(() => fallback);
}

const FALLBACK_WORDS = ["ephemeral", "serendipity", "ubiquitous", "eloquent", "resilient", "pragmatic", "meticulous", "juxtapose", "magnanimous", "sanguine", "alacrity", "aberration", "vociferous", "ameliorate", "assiduous"];

async function loadWordsList() {
  let wordList = "full";
  try {
    const stored = await withTimeout(chrome.storage.sync.get("wordList"), 3000, {});
    wordList = stored?.wordList || "full";
    currentWordList = wordList;
  } catch {
    wordList = "full";
    currentWordList = "full";
  }
  const file = wordList === "sat" ? "words-sat.json" : "words.json";
  try {
    const res = await withTimeout(
      fetch(chrome.runtime.getURL(file)).then((r) => r.json()),
      5000,
      []
    );
    wordsList = Array.isArray(res) && res.length > 0 ? res : FALLBACK_WORDS;
  } catch {
    wordsList = FALLBACK_WORDS;
  }
  return wordsList;
}

function getDailyWordFromList() {
  if (!wordsList.length) return null;
  const index = getDailyWordKey() % wordsList.length;
  return wordsList[index];
}

function fetchWithTimeout(url, ms = 8000) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), ms);
  return fetch(url, { signal: controller.signal })
    .finally(() => clearTimeout(timeout));
}

async function fetchWordFromAPI(word) {
  try {
    const res = await fetchWithTimeout(`${API_BASE}/${encodeURIComponent(word)}`);
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
    const synonymsRow = document.getElementById("synonymsRow");
    if (synonymsRow) synonymsRow.innerHTML = "";
    examples.innerHTML = "";
    return;
  }

  const word = apiEntry.word || dailyWord;
  const phoneticText = apiEntry.phonetic || apiEntry.phonetics?.find((p) => p.text)?.text || "—";
  const meanings = apiEntry.meanings || [];

  wordTitle.textContent = word;
  wordTier.textContent = currentWordList === "sat" ? "SAT" : currentWordList === "gre" ? "GRE" : "advanced";
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
  chrome.storage.sync.get("autoPlay", ({ autoPlay = "off" }) => {
    if (autoPlay === "on" && audioSrc) new Audio(audioSrc).play();
  });

  let exHtml = "";
  meanings.forEach((m) => {
    (m.definitions || []).forEach((d) => {
      if (d.example) exHtml += `<div class="example">${escapeHtml(d.example)}</div>`;
    });
  });
  if (!exHtml && window.exampleFallbacks?.[word?.toLowerCase()]) {
    exHtml = `<div class="example">${escapeHtml(window.exampleFallbacks[word.toLowerCase()])}</div>`;
  }
  examples.innerHTML = exHtml ? `<div class="examples-label">Examples</div>${exHtml}` : "";

  const synonymsRow = document.getElementById("synonymsRow");
  if (synonymsRow) {
    const syns = [];
    const ants = [];
    meanings.forEach((m) => {
      (m.definitions || []).forEach((d) => {
        (d.synonyms || []).slice(0, 3).forEach((s) => syns.push(s));
        (d.antonyms || []).slice(0, 2).forEach((a) => ants.push(a));
      });
    });
    const uniq = (arr) => [...new Set(arr)];
    let synAntHtml = "";
    if (uniq(syns).length) synAntHtml += `<span class="syn-ant"><strong>Synonyms:</strong> ${uniq(syns).slice(0, 5).join(", ")}</span>`;
    if (uniq(ants).length) synAntHtml += `<span class="syn-ant"><strong>Antonyms:</strong> ${uniq(ants).slice(0, 3).join(", ")}</span>`;
    synonymsRow.innerHTML = synAntHtml || "";
  }
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

// ── Update check ──
async function checkForUpdate() {
  const banner = document.getElementById("updateBanner");
  const downloadLink = document.getElementById("updateDownload");
  const dismissBtn = document.getElementById("updateDismiss");
  if (!banner || !downloadLink) return;
  const { updateDismissed } = await chrome.storage.local.get("updateDismissed");
  try {
    const res = await fetchWithTimeout(`${WEBSITE_BASE}/version.json`, 3000);
    if (!res?.ok) return;
    const { version } = await res.json();
    if (!version) return;
    if (compareVersions(version, EXT_VERSION) > 0 && updateDismissed !== version) {
      downloadLink.href = `${WEBSITE_BASE}/vocab-extender.zip`;
      downloadLink.download = "vocab-extender.zip";
      banner.style.display = "flex";
      dismissBtn?.addEventListener("click", () => {
        banner.style.display = "none";
        chrome.storage.local.set({ updateDismissed: version });
      });
    }
  } catch {}
}

function compareVersions(a, b) {
  const pa = a.split(".").map(Number);
  const pb = b.split(".").map(Number);
  for (let i = 0; i < Math.max(pa.length, pb.length); i++) {
    const va = pa[i] || 0;
    const vb = pb[i] || 0;
    if (va > vb) return 1;
    if (va < vb) return -1;
  }
  return 0;
}

// ── Tabs ──
function switchToTab(name) {
  document.querySelectorAll(".popup-tab").forEach((t) => t.classList.remove("active"));
  document.querySelectorAll(".panel").forEach((p) => p.classList.remove("active"));
  const tab = document.querySelector(`.popup-tab[data-tab="${name}"]`);
  const panel = document.getElementById(`panel-${name}`);
  if (tab) tab.classList.add("active");
  if (panel) panel.classList.add("active");
  if (name === "quiz") initQuiz();
  if (name === "saved") renderSavedList();
  if (name === "past") renderPastList();
  if (name === "search") initSearch();
  if (name === "flashcards") initFlashcards();
  chrome.storage.local.set({ lastTab: name });
}

function initTabs() {
  document.querySelectorAll(".popup-tab").forEach((tab) => {
    tab.addEventListener("click", () => switchToTab(tab.dataset.tab));
  });
}

// ── Share ──
async function shareWord() {
  if (!dailyWordData || !dailyWord) return;
  const word = dailyWordData.word || dailyWord;
  const defs = [];
  (dailyWordData.meanings || []).slice(0, 2).forEach((m) => {
    const d = (m.definitions || [])[0];
    if (d?.definition) defs.push(d.definition);
  });
  const text = `${word}\n${defs.join("\n")}`;
  if (navigator.share) {
    try {
      await navigator.share({ title: word, text });
    } catch {
      navigator.clipboard.writeText(text);
    }
  } else {
    navigator.clipboard.writeText(text);
  }
}

// ── Copy word & definition ──
function copyWordAndDefinition() {
  if (!dailyWordData || !dailyWord) return;
  const word = dailyWordData.word || dailyWord;
  const phonetic = dailyWordData.phonetic || dailyWordData.phonetics?.find((p) => p.text)?.text || "";
  const defs = [];
  (dailyWordData.meanings || []).slice(0, 3).forEach((m) => {
    (m.definitions || []).slice(0, 2).forEach((d) => defs.push(`• ${d.definition}`));
  });
  const text = `${word} ${phonetic ? `(${phonetic})` : ""}\n\n${defs.join("\n")}`;
  navigator.clipboard.writeText(text).then(() => {
    const btn = document.getElementById("btnCopy");
    if (btn) { btn.textContent = "Copied!"; setTimeout(() => { btn.textContent = "Copy"; }, 1500); }
  });
}

// ── Random word ──
async function loadRandomWord() {
  await loadWordsList();
  if (!wordsList.length) return;
  const idx = Math.floor(Math.random() * wordsList.length);
  const w = wordsList[idx];
  dailyWord = w;
  dailyWordData = await fetchWordFromAPI(w);
  renderWordPanel(dailyWordData);
  updateBookmarkButton();
}

// ── Word history & Past tab ──
async function addToWordHistory(word, data) {
  const { wordHistory = [] } = await chrome.storage.local.get("wordHistory");
  const dateStr = new Date().toDateString();
  const entry = { date: dateStr, word, data };
  const filtered = wordHistory.filter((e) => !(e.date === dateStr && e.word === word));
  const next = [entry, ...filtered].slice(0, 30);
  await chrome.storage.local.set({ wordHistory: next });
}

async function renderPastList() {
  const { wordHistory = [] } = await chrome.storage.local.get("wordHistory");
  const listEl = document.getElementById("pastList");
  listEl.innerHTML = wordHistory
    .map(
      (e) =>
        `<li data-word="${escapeAttr(e.word)}"><span class="past-date">${escapeHtml(e.date)}</span><span class="past-word">${escapeHtml(e.word)}</span><button type="button" class="btn-view-past" data-word="${escapeAttr(e.word)}">View</button></li>`
    )
    .join("");
  listEl.querySelectorAll(".btn-view-past").forEach((btn) => {
    btn.addEventListener("click", async () => {
      const w = btn.dataset.word;
      const entry = wordHistory.find((e) => e.word === w);
      if (entry?.data) {
        dailyWord = w;
        dailyWordData = entry.data;
        document.querySelector('[data-tab="word"]')?.click();
        renderWordPanel(dailyWordData);
      } else {
        showSavedWordDefinition(w);
      }
    });
  });
}

// ── Search all words ──
function initSearch() {
  const input = document.getElementById("searchAll");
  const results = document.getElementById("searchResults");
  if (!input || !results) return;
  const doSearch = async () => {
    const q = (input.value || "").toLowerCase().trim();
    await loadWordsList();
    if (!q) {
      results.innerHTML = "<p class='search-hint'>Type to search words.</p>";
      return;
    }
    const matches = wordsList.filter((w) => w.toLowerCase().includes(q)).slice(0, 30);
    results.innerHTML = matches
      .map(
        (w) =>
          `<li data-word="${escapeAttr(w)}"><span>${escapeHtml(w)}</span><button type="button" class="btn-view-search" data-word="${escapeAttr(w)}">View</button></li>`
      )
      .join("");
    results.querySelectorAll(".btn-view-search").forEach((btn) => {
      btn.addEventListener("click", async () => {
        const w = btn.dataset.word;
        const apiEntry = await fetchWordFromAPI(w);
        dailyWord = w;
        dailyWordData = apiEntry;
        document.querySelector('[data-tab="word"]')?.click();
        renderWordPanel(dailyWordData);
      });
    });
  };
  input.oninput = doSearch;
  doSearch();
}

// ── Stats ──
async function renderStats() {
  const { quizStreak = 0, totalCorrect = 0, savedWords = [], wordHistory = [] } = await chrome.storage.local.get(["quizStreak", "totalCorrect", "savedWords", "wordHistory"]);
  const uniqueWords = new Set(wordHistory.map((e) => e.word)).size;
  const el = document.getElementById("statsRow");
  if (!el) return;
  el.innerHTML = `<span class="stat">Streak: ${quizStreak}</span><span class="stat">Saved: ${savedWords.length}</span><span class="stat">Correct: ${totalCorrect}</span><span class="stat">Words: ${uniqueWords}</span>`;
}

// ── Add to calendar (.ics) ──
function addToCalendar() {
  chrome.storage.local.get("savedWords", ({ savedWords = [] }) => {
    const start = new Date();
    start.setDate(start.getDate() + 1);
    start.setHours(10, 0, 0, 0);
    const end = new Date(start);
    end.setMinutes(30, 0, 0);
    const fmt = (d) => d.toISOString().replace(/[-:]/g, "").split(".")[0] + "Z";
    const desc = `Review ${savedWords.length} saved words: ${savedWords.slice(0, 10).join(", ")}${savedWords.length > 10 ? "…" : ""}`;
    const ics = `BEGIN:VCALENDAR
VERSION:2.0
BEGIN:VEVENT
DTSTART:${fmt(start)}
DTEND:${fmt(end)}
SUMMARY:Review Vocab Extender saved words
DESCRIPTION:${desc.replace(/\n/g, "\\n")}
END:VEVENT
END:VCALENDAR`;
    const blob = new Blob([ics], { type: "text/calendar" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "vocab-extender-review.ics";
    a.click();
    URL.revokeObjectURL(url);
  });
}

// ── Streak freeze ──
async function canUseStreakFreeze() {
  const { freezeUsedWeek = 0 } = await chrome.storage.local.get("freezeUsedWeek");
  const now = new Date();
  const weekStart = new Date(now);
  weekStart.setDate(now.getDate() - now.getDay());
  const weekKey = weekStart.toDateString();
  return freezeUsedWeek !== weekKey;
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

  const savedLink = document.getElementById("quizSavedLink");
  const { savedWords = [] } = await chrome.storage.local.get("savedWords");
  if (savedLink) {
    savedLink.style.display = savedWords.length ? "block" : "none";
    const btn = savedLink.querySelector("button");
    if (btn) {
      btn.onclick = () => quizSavedWord(savedWords);
    }
  }

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
    if (correct) {
      chrome.storage.local.get("totalCorrect", ({ totalCorrect = 0 }) => {
        chrome.storage.local.set({ totalCorrect: totalCorrect + 1 });
      });
    }
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

async function quizSavedWord(savedWords) {
  if (!savedWords?.length) return;
  const w = savedWords[Math.floor(Math.random() * savedWords.length)];
  dailyWord = w;
  dailyWordData = await fetchWordFromAPI(w);
  if (!dailyWordData) {
    dailyWordData = { word: w, meanings: [{ definitions: [{ definition: "Definition unavailable." }] }] };
  }
  initQuiz();
}

// ── Flashcards ──
let flashcardIndex = 0;
let flashcardWords = [];
let flashcardData = [];

async function initFlashcards() {
  await loadWordsList();
  const { wordHistory = [] } = await chrome.storage.local.get("wordHistory");
  const { savedWords = [] } = await chrome.storage.local.get("savedWords");
  const combined = [...new Set([...wordHistory.map((e) => e.word), ...savedWords])];
  if (!combined.length && dailyWord) combined.push(dailyWord);
  if (!combined.length) {
    document.getElementById("flashcardFront").textContent = "No words yet";
    document.getElementById("flashcardBack").textContent = "Add words via Today or Saved.";
    document.getElementById("flashcardIndex").textContent = "0 / 0";
    return;
  }
  flashcardWords = combined;
  flashcardData = [];
  for (const w of flashcardWords) {
    const entry = wordHistory.find((e) => e.word === w)?.data;
    const def = entry?.meanings?.[0]?.definitions?.[0]?.definition || (await getDefinitionForWord(w)) || "—";
    flashcardData.push({ word: w, def });
  }
  flashcardIndex = 0;
  renderFlashcard();
  document.getElementById("btnFlashcardPrev").onclick = () => { flashcardIndex = Math.max(0, flashcardIndex - 1); renderFlashcard(); };
  document.getElementById("btnFlashcardNext").onclick = () => { flashcardIndex = Math.min(flashcardData.length - 1, flashcardIndex + 1); renderFlashcard(); };
  const card = document.getElementById("flashcard");
  if (card) card.onclick = () => card.classList.toggle("flipped");
}

function renderFlashcard() {
  const front = document.getElementById("flashcardFront");
  const back = document.getElementById("flashcardBack");
  const idxEl = document.getElementById("flashcardIndex");
  const card = document.getElementById("flashcard");
  if (!flashcardData.length) return;
  const d = flashcardData[flashcardIndex];
  front.textContent = d.word;
  back.textContent = d.def;
  idxEl.textContent = `${flashcardIndex + 1} / ${flashcardData.length}`;
  if (card) card.classList.remove("flipped");
}

function quizKeyHandler(e) {
  if (document.activeElement?.tagName === "INPUT" || document.activeElement?.tagName === "TEXTAREA") return;
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

  if (exportBtn) exportBtn.style.display = filtered.length ? "inline-flex" : "none";
  const ankiBtn = document.getElementById("exportAnki");
  if (ankiBtn) { ankiBtn.style.display = filtered.length ? "inline-flex" : "none"; ankiBtn.onclick = exportAnki; }
  const calendarBtn = document.getElementById("btnCalendar");
  if (calendarBtn) calendarBtn.style.display = filtered.length ? "inline-flex" : "none";
  renderStats();
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

// ── Anki export (tab-separated for import) ──
async function exportAnki() {
  const { savedWords = [] } = await chrome.storage.local.get("savedWords");
  const cache = (await chrome.storage.local.get("definitionCache")).definitionCache || {};
  const lines = ["Front\tBack"];
  for (const w of savedWords) {
    const def = cache[w] || "—";
    lines.push(`${w}\t${def.replace(/\t/g, " ").replace(/\n/g, " ")}`);
  }
  const blob = new Blob([lines.join("\n")], { type: "text/tab-separated-values" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "vocab-extender-anki.txt";
  a.click();
  URL.revokeObjectURL(url);
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
  const wordTitleEl = document.getElementById("wordTitle");
  const phoneticEl = document.getElementById("phonetic");

  document.getElementById("dateLabel").textContent = formatDate();

  let listLoaded = false;
  try {
    await loadWordsList();
    listLoaded = wordsList.length > 0;
  } catch (e) {
    console.error("Failed to load words:", e);
  }
  if (!listLoaded) {
    wordTitleEl.textContent = "Could not load word list.";
    phoneticEl.textContent = "Check the extension and try again.";
    return;
  }

  dailyWord = getDailyWordFromList();
  wordTitleEl.textContent = dailyWord || "—";
  phoneticEl.textContent = "Loading…";

  const stuckTimer = setTimeout(() => {
    if (phoneticEl.textContent === "Loading…") {
      phoneticEl.textContent = "Still loading… Check your connection.";
    }
  }, 10000);

  const cached = await withTimeout(
    chrome.storage.local.get(["dailyWord", "dailyWordDate", "dailyWordData"]),
    4000,
    {}
  );
  const dateKey = getDailyWordKey();

  if (cached.dailyWordDate === dateKey && cached.dailyWordData) {
    dailyWord = cached.dailyWord;
    dailyWordData = cached.dailyWordData;
  } else {
    dailyWordData = dailyWord ? await fetchWordFromAPI(dailyWord) : null;
    if (!dailyWordData && dailyWord && cached.dailyWordDate === dateKey - 1 && cached.dailyWordData) {
      dailyWordData = cached.dailyWordData;
    }
    await chrome.storage.local.set({
      dailyWord,
      dailyWordDate: dateKey,
      dailyWordData: dailyWordData || undefined,
    });
    if (dailyWord && dailyWordData) {
      addToWordHistory(dailyWord, dailyWordData);
    }
  }
  clearTimeout(stuckTimer);
  renderWordPanel(dailyWordData);
  updateBookmarkButton();
  document.getElementById("btnBookmark").addEventListener("click", () => toggleSaved(dailyWord));
  document.getElementById("btnSettings")?.addEventListener("click", () => chrome.runtime.openOptionsPage());
  checkForUpdate();

  try {
    const fallbackRes = await fetch(chrome.runtime.getURL("example-fallbacks.json"));
    window.exampleFallbacks = await fallbackRes.json();
  } catch {
    window.exampleFallbacks = {};
  }

  document.getElementById("searchSaved")?.addEventListener("input", renderSavedList);
  document.getElementById("exportSaved")?.addEventListener("click", exportSavedWords);
  document.getElementById("btnCopy")?.addEventListener("click", copyWordAndDefinition);
  document.getElementById("btnShare")?.addEventListener("click", shareWord);
  document.getElementById("btnRandom")?.addEventListener("click", loadRandomWord);
  document.getElementById("btnCalendar")?.addEventListener("click", addToCalendar);
  chrome.storage.sync.get("fontSize", ({ fontSize = "medium" }) => {
    document.body.classList.remove("font-small", "font-medium", "font-large");
    document.body.classList.add(`font-${fontSize}`);
  });
  initTabs();
  const { defaultTab = "word" } = await chrome.storage.sync.get("defaultTab");
  const targetTab = defaultTab === "last" ? ((await chrome.storage.local.get("lastTab")).lastTab || "word") : defaultTab;
  if (targetTab !== "word") switchToTab(targetTab);
  await loadQuizStreak();

  chrome.storage.sync.get("theme", ({ theme = "light" }) => {
    const dark = theme === "dark" || (theme === "system" && window.matchMedia("(prefers-color-scheme: dark)").matches);
    document.body.classList.toggle("theme-dark", dark);
  });
  if (window.matchMedia) {
    window.matchMedia("(prefers-color-scheme: dark)").addEventListener("change", () => {
      chrome.storage.sync.get("theme", ({ theme = "light" }) => {
        if (theme === "system") {
          document.body.classList.toggle("theme-dark", window.matchMedia("(prefers-color-scheme: dark)").matches);
        }
      });
    });
  }
}

init().catch((err) => {
  console.error("Vocab Extender init error:", err);
  document.getElementById("wordTitle").textContent = "Something went wrong.";
  document.getElementById("phonetic").textContent = "Try closing and reopening the extension.";
});
