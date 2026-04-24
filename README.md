# YouTube Shorts Hider (Firefox Extension)

Hide YouTube Shorts from the YouTube interface and reduce distraction while browsing.

This extension removes most Shorts entry points and can optionally close a tab if you land on a Shorts page.

## Features

- Hides Shorts UI blocks on YouTube pages.
- Removes common Shorts links in navigation and feed sections.
- Optional auto-close behavior when opening a Shorts URL.
- Simple popup with two toggles:
  - Extension enabled/disabled
  - Close tab on Shorts navigation
- Settings are saved locally using browser storage.

## Why this exists

YouTube Shorts can be very addictive and break focus quickly.  
This extension is built to make YouTube less distracting and more intentional.

## Installation (Temporary / Development)

1. Clone or download this repository.
2. Open Firefox and go to `about:debugging#/runtime/this-firefox`.
3. Click **Load Temporary Add-on...**.
4. Select the `manifest.json` file from this project.

## Publishing to Firefox Add-ons

When uploading to AMO:

- Zip the project files (with `manifest.json` at the archive root).
- Fill data-collection details in the AMO submission form.
- Keep `browser_specific_settings.gecko` valid for Firefox.

## Project structure

```text
ShortsHider/
├─ manifest.json
├─ src/
│  ├─ background.js
│  ├─ content.js
│  └─ style.css
├─ popup/
│  ├─ popup.html
│  ├─ popup.css
│  └─ popup.js
└─ assets/
   └─ icon.svg
```

## Permissions

- `https://www.youtube.com/*` - needed to run content logic on YouTube pages.
- `storage` - needed to persist extension settings.

## Current status

- Works as a Firefox MV2 extension.
- Planned: migration to Manifest V3 when needed.
ы
## Contributing

Issues and pull requests are welcome.  
If you find Shorts elements that are not hidden yet, open an issue with a screenshot and page URL.
