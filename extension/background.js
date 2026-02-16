/**
 * Vocab Extender — Service worker (Manifest V3)
 * - Daily refresh at local midnight
 * - Badge: streak or first letter of today's word
 * - Notification reminder at user-chosen time
 */

const ALARM_REFRESH = "vocab-daily-refresh";
const ALARM_REMINDER = "vocab-reminder";

/** ms until next local midnight */
function msUntilMidnight() {
  const now = new Date();
  const midnight = new Date(now);
  midnight.setHours(24, 0, 0, 0);
  return midnight - now;
}

/** Schedule daily refresh at midnight */
function scheduleMidnightAlarm() {
  chrome.alarms.clear(ALARM_REFRESH);
  const delay = msUntilMidnight();
  chrome.alarms.create(ALARM_REFRESH, {
    when: Date.now() + delay,
    periodInMinutes: 24 * 60,
  });
}

/** Schedule reminder notification at hour (0-23). hour=9 = 9:00 AM */
function scheduleReminder(hour) {
  chrome.alarms.clear(ALARM_REMINDER);
  if (hour === "off" || hour === null || hour === undefined) return;
  const h = parseInt(hour, 10);
  if (isNaN(h) || h < 0 || h > 23) return;
  const now = new Date();
  let target = new Date(now.getFullYear(), now.getMonth(), now.getDate(), h, 0, 0);
  if (target <= now) target.setDate(target.getDate() + 1);
  chrome.alarms.create(ALARM_REMINDER, {
    when: target.getTime(),
    periodInMinutes: 24 * 60,
  });
}

chrome.runtime.onInstalled.addListener(() => {
  scheduleMidnightAlarm();
  chrome.storage.sync.get("reminder", ({ reminder }) => scheduleReminder(reminder));
});

chrome.storage.onChanged.addListener((changes, area) => {
  if (area === "sync" && changes.reminder) {
    scheduleReminder(changes.reminder.newValue);
  }
  if (area === "local" && (changes.quizStreak || changes.dailyWord)) {
    updateBadge();
  }
});

chrome.alarms.onAlarm.addListener(async (alarm) => {
  if (alarm.name === ALARM_REFRESH) {
    await chrome.storage.local.remove(["dailyWord", "dailyWordDate", "dailyWordData"]);
    chrome.action.setBadgeText({ text: "" });
    scheduleMidnightAlarm();
  }
  if (alarm.name === ALARM_REMINDER) {
    const { dailyWord } = await chrome.storage.local.get("dailyWord");
    chrome.notifications.create({
      type: "basic",
      iconUrl: chrome.runtime.getURL("icons/icon48.png"),
      title: "Vocab Extender",
      message: dailyWord ? `Today's word: ${dailyWord}` : "Check out today's word!",
    });
    const { reminder } = await chrome.storage.sync.get("reminder");
    scheduleReminder(reminder);
  }
});

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

chrome.runtime.onStartup.addListener(updateBadge);
updateBadge();
