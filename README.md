# Vocab Extender

Word of the Day Chrome extension + Next.js landing page. SAT/GRE-level vocabulary, daily words, quizzes, and bookmarks.

## Project structure

```
vocab-extender/
├── extension/          # Chrome extension (Manifest V3)
│   ├── manifest.json
│   ├── popup.html / popup.css / popup.js
│   ├── background.js
│   ├── words.json
│   └── icons/
├── website/            # Next.js landing page (Vercel)
│   ├── app/
│   ├── components/
│   └── public/
└── README.md
```

## Website (Next.js)

- **Stack:** Next.js 14, TypeScript, Tailwind CSS
- **Design:** Dark theme, orange/amber (#F59E0B) accents, Instrument Serif + Plus Jakarta Sans
- **Sections:** Hero, word ticker, extension mockup, features, how-it-works, CTA, footer

```bash
cd website
npm install
npm run dev
```

Build for production / Vercel:

```bash
npm run build
npm start
```

## Extension (Chrome)

- **Manifest V3**, popup 380×520px
- Daily word from Free Dictionary API + fallback `words.json`
- Quiz with streak tracking, saved words in `chrome.storage.local`
- Permissions: `storage`, `alarms`

Load unpacked in Chrome: `chrome://extensions` → Load unpacked → select `extension/` folder.

## License

Private / All rights reserved.
