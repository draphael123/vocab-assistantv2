/**
 * Vocab Extender — Service worker (Manifest V3)
 * Handles daily refresh via chrome.alarms so the word updates at midnight.
 */

const ALARM_NAME = "vocab-daily-refresh";
const MIDNIGHT_MS = 24 * 60 * 60 * 1000;

// Create alarm to fire once per day (at midnight or on first install)
chrome.runtime.onInstalled.addListener(() => {
  chrome.alarms.clear(ALARM_NAME);
  chrome.alarms.create(ALARM_NAME, { periodInMinutes: 24 * 60 }); // 24h in minutes
  // Optionally set a specific time: use delayInMinutes or when for exact midnight
});

chrome.alarms.onAlarm.addListener((alarm) => {
  if (alarm.name === ALARM_NAME) {
    // Clear cached word so popup fetches fresh word for new day
    chrome.storage.local.remove(["dailyWord", "dailyWordDate"], () => {
      // Badge or notify if desired
    });
  }
});
