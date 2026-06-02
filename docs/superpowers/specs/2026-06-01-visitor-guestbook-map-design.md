# Visitor Guest Book + Map

Date: 2026-06-01
Status: Approved, pre-implementation

## Idea

When a student finishes Historical Mode, let them "sign a guest book" with their
school and location (country, and US state if applicable). Plot every entry as a
pin on a world map, shown on the Historical finish screen and in the in-game
leaderboard modal. The teacher can review, edit, and delete entries from the
dashboard. The goal is the cross-school "who's played this" delight the teacher
already noticed from the global leaderboard, made visual.

## Decisions (locked during brainstorming)

- **Location input:** dropdowns only (country + US state). No IP geolocation
  (unreliable on school networks, silently captures minors' location), no
  free-text geocoding. Student explicitly chooses; works offline; no external API.
- **Collected fields:** school name (free text) + country + US state only. No
  student name, no free-text message attached to the public entry.
- **Map placement:** both the Historical finish screen (right after signing) and
  a new "Map" view in the existing in-game leaderboard modal.
- **Moderation:** client-side auto-filter (length + strip HTML + basic profanity
  reject) on submit, PLUS a teacher dashboard Guest Book tab to review/edit/delete.
- **Country coverage:** full world country list (~195) with centroids, plus the
  50 US states + DC.

## Architecture

Consistent with the codebase's no-framework, no-build, offline-capable,
`file://`-safe constraints. No mapping library, no map tiles, no external calls.
The app already hand-rolls SVG maps (`js/data/maps.js`), so the visitor map is a
static bundled SVG world map with pins positioned by an equirectangular
lat/lng -> SVG x/y projection.

### New data file: `js/data/geo.js`

Pure data + one function, no dependencies:

- `GEO_COUNTRIES`: array of `{ code, name, lat, lng }` for ~195 countries
  (centroid lat/lng). Sorted for the dropdown, with United States first/pinned.
- `GEO_US_STATES`: array of `{ code, name, lat, lng }` for 50 states + DC.
- `GEO_WORLD_VIEWBOX`: the SVG viewBox the bundled world map uses.
- `geoProject(lat, lng)`: returns `{ x, y }` in the world map's SVG coordinate
  space via equirectangular projection (`x = (lng+180)/360 * W`,
  `y = (90-lat)/180 * H`, scaled to the viewBox). Good enough at this zoom.
- `geoLookup(countryCode, stateCode)`: returns the centroid `{ lat, lng, label }`
  to store on an entry (state centroid when US + state given, else country
  centroid). `label` is the human display string ("Washington, USA" / "France").

### Bundled world map SVG

A public-domain, low-detail world map (single `<path>` set or a compact
land outline) added under `images/` (or inline in `js/data/geo.js` if small).
Chosen for small size and clear land masses at thumbnail scale. Must be public
domain (Natural Earth / Wikimedia public-domain world map).

### Firebase data model

New top-level public node, sibling of `globalScores`, append-only:

```
guestbook/<pushId> = {
  school:    <string, 1-60 chars, HTML stripped, profanity-rejected>,
  countryName: <string, <=56 chars>,
  regionName:  <string, <=40 chars, "" when not US>,
  lat:       <number>,
  lng:       <number>,
  label:     <string, <=80 chars, e.g. "Washington, USA">,
  timestamp: <server time>
}
```

No student name, no message. Lat/lng are precomputed client-side from `geo.js`
so the map renders with zero lookups.

### firebase-leaderboard.js additions

Mirror the existing global-score functions and conventions (graceful offline,
type coercion, `_key` on reads for moderation):

- `submitGuestEntry(entry, callback)` -> validates/coerces and `.push()`es to
  `guestbook`. Best-effort, silent offline.
- `loadGuestbook(limit, callback)` -> last N entries (default ~500), each with
  `_key`, for the map and the dashboard.
- `subscribeToGuestbook(callback)` -> live updates for the dashboard tab; returns
  an unsubscribe fn (mirrors `subscribeToProgress`).
- `deleteGuestEntry(key, callback)` -> remove one entry by push-key.
- `updateGuestEntry(key, fields, callback)` -> edit school/region/country (and
  recompute lat/lng/label if region/country change is done on the dashboard via
  geo.js, which the dashboard already loads).

### Guest book form (Historical finish screen)

In the Historical completion screen (the "Free-play Mode Unlocked!" branch in
`js/ui.js`, which currently hides the scoreboard), add a "Sign the Guest Book"
card after the unlock message:

- School text input (maxlength 60).
- Country `<select>` populated from `GEO_COUNTRIES`.
- US-state `<select>` populated from `GEO_US_STATES`, shown only when country is
  United States.
- "Add me to the map" button (skippable; the card can be dismissed/ignored).

On submit:
1. Run the auto-filter on the school name (trim, strip HTML, length cap,
   profanity reject with a friendly "keep it school-appropriate" message that
   lets them retry).
2. Derive centroid + label via `geoLookup`.
3. `submitGuestEntry(...)`.
4. Replace the card with a thank-you and reveal the map with the new pin
   highlighted (a brief pulse/different color).

Guard against double-submit (one entry per finish; disable the button after a
successful write).

### The map renderer (shared)

A single function `renderVisitorMap(container, entries, highlightKey)`:

- Injects the bundled world SVG into `container`.
- For each entry, projects lat/lng to x/y and appends a `<circle>` pin.
- Applies small deterministic jitter (seeded by push-key) so multiple entries at
  the same centroid form a visible cluster instead of one stacked dot.
- Pin click/tap -> a small popup showing the escaped `label` and `school`.
- `highlightKey` (optional) renders that pin larger / pulsing.

Used on the finish screen and in the leaderboard modal's new Map view. Untrusted
fields are rendered with `textContent` / escaping (never `innerHTML` with entry
data), consistent with the dashboard's XSS-safe approach.

### Leaderboard modal — Map view

Add a "Map" tab/section to the existing in-game leaderboard modal (alongside
Device / Class / Global). On open it calls `loadGuestbook` and
`renderVisitorMap`. Offline -> friendly "needs internet" message, matching the
Global view's behavior.

### Teacher dashboard — Guest Book tab

Add a fifth tab "Guest Book" to `teacher.html`:

- Subscribes via `subscribeToGuestbook`.
- Shows a table of entries (school, country, state, time) each with Edit and
  Delete, plus an embedded `renderVisitorMap` of all entries.
- Edit lets the teacher fix the school text or change country/state (recomputing
  lat/lng/label through `geo.js`, which the dashboard loads).
- Delete removes the entry (and its pin on next render).
- All entry text rendered via `textContent` (XSS-safe). Reuses the existing
  tab show/hide pattern and `.lb-table` styling.
- `teacher.html` must also load `js/data/geo.js` for the map + edit recompute.

### Auto-filter

A small client-side helper (in `js/ui.js` near the form, or a tiny shared util):
trim, strip `<>` / HTML, enforce 1-60 chars, and reject against a compact
profanity word list (case-insensitive, whole-word-ish). Returns
`{ ok, cleaned, reason }`. It is a deterrent; the teacher dashboard is the
authoritative moderation surface.

### Firebase rules (database.rules.json)

Add a `guestbook` node mirroring `globalScores` (public read + write, shape/size
validation):

```
"guestbook": {
  ".read": true,
  ".write": true,
  "$entryId": {
    ".validate": "newData.hasChildren(['school','lat','lng','timestamp']) && newData.child('school').isString() && newData.child('school').val().length <= 60 && newData.child('lat').isNumber() && newData.child('lng').isNumber() && newData.child('timestamp').isNumber()"
  }
}
```

(Like the recall rules, this must be published to the live DB by the teacher via
the Firebase console or `firebase deploy --only database`.)

## What is NOT changing

- No student name or free-text message on public entries.
- No external geolocation/geocoding/mapping APIs.
- Free-play end screen, scoring, the existing leaderboards, recall tracking,
  handouts. The guest book is additive.

## Error handling / edge cases

- Offline: form submit silently no-ops with a "saved when you're back online"
  style message is NOT promised; instead show "needs internet to add to the map"
  and keep play uninterrupted. Map views show a friendly offline message.
- Country selected but no state (non-US): use country centroid.
- US selected but no state chosen: prompt to pick a state, or fall back to the
  US centroid if they skip.
- Double-submit: button disables after a successful write; one entry per finish.
- Junk/profane school: rejected client-side with a retry message; anything that
  slips through is removable on the dashboard.

## Verification

- `geo.js`: assert every country/state has finite lat/lng; `geoProject` maps
  known points to plausible SVG coordinates (e.g., Washington State left-of-center
  and upper third; Australia lower-right).
- Map render: with synthetic entries, assert one pin per entry, pins within the
  viewBox, same-centroid entries get distinct positions (jitter), and popups use
  escaped text (no HTML injection from a crafted school name).
- Form: auto-filter rejects HTML/profanity/overlong; valid submit produces a
  well-formed entry object with a centroid.
- Dashboard: synthetic guestbook rows render in the table and on the embedded
  map; edit recomputes centroid; delete removes the row. Names XSS-safe.
- Firebase rules: valid JSON; a malformed guest write (missing lat, oversized
  school) is rejected; a well-formed one is accepted.
- Live: finish Historical Mode locally, sign the guest book, see the pin appear
  on the finish-screen map and in the modal's Map view, and see/edit/delete it
  on the dashboard Guest Book tab.

## Risk

Medium. The data and Firebase plumbing follow established patterns closely. The
main new surface is the SVG world map + projection (self-contained, testable
with assertions) and the full country/state centroid table (bulk data; verified
by an assertion that all coordinates are finite and in range). Privacy posture is
conservative by design (no names, student-chosen coarse location, teacher
moderation).
