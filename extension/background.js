/**
 * Vocab Extender — Service worker (Manifest V3)
 * - Daily refresh at local midnight via chrome.alarms
 * - Badge: streak count or first letter of today's word
 */

const ALARM_NAME = "vocab-daily-refresh";

/** ms until next local midnight */
function msUntilMidnight() {
  const now = new Date();
  const midnight = new Date(now);
  midnight.setHours(24, 0, 0, 0);
  return midnight - now;
}

/** Schedule alarm for next midnight, then every 24h */
function scheduleMidnightAlarm() {
  chrome.alarms.clear(ALARM_NAME);
  const delay = msUntilMidnight();
  chrome.alarms.create(ALARM_NAME, {
    when: Date.now() + delay,
    periodInMinutes: 24 * 60,
  });
}

chrome.runtime.onInstalled.addListener(() => {
  scheduleMidnightAlarm();
});

chrome.alarms.onAlarm.addListener((alarm) => {
  if (alarm.name === ALARM_NAME) {
    chrome.storage.local.remove(["dailyWord", "dailyWordDate", "dailyWordData"]);
    chrome.action.setBadgeText({ text: "" });
  }
});

/** Update badge with streak or first letter of today's word */
async function updateBadge() {
  try {
    const { quizStreak = 0, dailyWord } = await chrome.storage.local.get(["quizStreak", "dailyWord"]);
    if (quizStreak > 0) {
      const text = quizStreak > 99 ? "99" : String(quizStreak);
      await chrome.action.setBadgeText({ text });
      await chrome.action.setBadgeBackgroundColor({ color: "#1E5F74" });
    } else if (dailyWord) {
      await chrome.action.setBadgeText({ text: dailyWord.charAt(0).toUpperCase() });
      await chrome.action.setBadgeBackgroundColor({ color: "#1E5F74" });
    } else {
      await chrome.action.setBadgeText({ text: "" });
    }
  } catch {}
}

chrome.storage.onChanged.addListener((changes, area) => {
  if (area === "local" && (changes.quizStreak || changes.dailyWord)) {
    updateBadge();
  }
});

// Initial badge on startup
chrome.runtime.onStartup.addListener(updateBadge);
updateBadge();
