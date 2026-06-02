# Visitor Guest Book + Map Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Let students who finish Historical Mode sign a guest book (school + country/US-state via dropdowns), plot every entry as a pin on a dependency-free SVG world map shown on the finish screen and the in-game leaderboard modal, with a teacher dashboard Guest Book tab to review/edit/delete.

**Architecture:** A new `js/data/geo.js` holds the country/US-state centroid tables, an equirectangular lat/lng→SVG projection, and a bundled public-domain world-map SVG string. A new public Firebase node `guestbook` stores entries (school + precomputed lat/lng + label). A shared `renderVisitorMap()` draws pins (XSS-safe). The Historical finish screen (`renderHistoricalComplete`) gets a sign-the-guestbook card; the leaderboard modal and the dashboard get map views. Follows the codebase's no-framework, no-build, `file://`-safe, inline-SVG conventions (mirrors `js/data/maps.js` and the existing global-leaderboard plumbing).

**Tech Stack:** Vanilla JS (IIFE/global functions), inline SVG, Firebase Realtime Database (compat SDK). No mapping library, no tiles, no build step. Verification via Node assertion scripts (`node --check`, geo/render logic tests) + a served-page smoke test.

---

## File structure

- `js/data/geo.js` (new): `GEO_COUNTRIES`, `GEO_US_STATES`, `GEO_WORLD_SVG`, `GEO_WORLD_VIEWBOX`, `geoProject(lat,lng)`, `geoLookup(countryCode, stateCode)`. Pure data + functions, no deps.
- `js/firebase-leaderboard.js` (modify): add `submitGuestEntry`, `loadGuestbook`, `subscribeToGuestbook`, `deleteGuestEntry`, `updateGuestEntry`; export them.
- `js/ui.js` (modify): add `buildGuestbookForm()`, `wireGuestbookForm()`, `renderVisitorMap()`, `cleanSchoolName()` (auto-filter); call the form from `renderHistoricalComplete`; add a map section to `openLeaderboardModal`.
- `index.html` (modify): add `#guestbookSection` to `endGameScreen`; add a Visitor Map wrapper to the leaderboard modal; load `js/data/geo.js`.
- `teacher.html` (modify): load `geo.js`; add a "Guest Book" tab, view, subscribe, render table + embedded map, edit/delete.
- `database.rules.json` (modify): add a validated `guestbook` node.

---

## Task 1: Create geo.js with centroids and projection (no map SVG yet)

**Files:**
- Create: `js/data/geo.js`

- [ ] **Step 1: Write the data + functions.** Create `js/data/geo.js`. `GEO_WORLD_VIEWBOX` is `'0 0 1000 500'` (2:1 equirectangular). `geoProject` maps lng[-180,180]→x[0,1000], lat[90,-90]→y[0,500]. Include the full country list and 50 states + DC. (Country/state centroid values: use standard published centroids; the list below is the required schema and a representative subset — the implementer fills all ~195 countries and 51 US rows with real centroids. Every row MUST have finite numeric lat/lng. Task 2 asserts completeness against these counts: countries length >= 190, states length === 51.)

```javascript
// Geographic data for the visitor guest book map. No dependencies, no network.
// Centroids are approximate country/state center points; precise enough for a
// pin on a small world map. Projection is equirectangular onto GEO_WORLD_VIEWBOX.

var GEO_WORLD_VIEWBOX = '0 0 1000 500';

// { code: ISO-ish, name: display, lat, lng }. United States pinned first.
var GEO_COUNTRIES = [
    { code: 'US', name: 'United States', lat: 39.8, lng: -98.6 },
    { code: 'CA', name: 'Canada', lat: 56.1, lng: -106.3 },
    { code: 'MX', name: 'Mexico', lat: 23.6, lng: -102.5 },
    { code: 'GB', name: 'United Kingdom', lat: 54.0, lng: -2.0 },
    { code: 'FR', name: 'France', lat: 46.2, lng: 2.2 },
    { code: 'DE', name: 'Germany', lat: 51.2, lng: 10.4 },
    { code: 'AU', name: 'Australia', lat: -25.3, lng: 133.8 },
    { code: 'JP', name: 'Japan', lat: 36.2, lng: 138.3 },
    { code: 'BR', name: 'Brazil', lat: -14.2, lng: -51.9 },
    { code: 'IN', name: 'India', lat: 20.6, lng: 79.0 }
    // ... implementer completes the full ~195-country list, each with real centroids ...
];

// 50 states + DC. { code: USPS, name, lat, lng }.
var GEO_US_STATES = [
    { code: 'AL', name: 'Alabama', lat: 32.8, lng: -86.8 },
    { code: 'AK', name: 'Alaska', lat: 64.7, lng: -152.0 },
    { code: 'AZ', name: 'Arizona', lat: 34.2, lng: -111.7 },
    { code: 'WA', name: 'Washington', lat: 47.4, lng: -120.5 }
    // ... implementer completes all 50 states + DC ...
];

// Equirectangular projection onto the world viewBox (1000 x 500).
function geoProject(lat, lng) {
    var W = 1000, H = 500;
    var x = (Number(lng) + 180) / 360 * W;
    var y = (90 - Number(lat)) / 180 * H;
    return { x: x, y: y };
}

// Resolve a submitted country/state to a centroid + display label.
function geoLookup(countryCode, stateCode) {
    var country = null, i;
    for (i = 0; i < GEO_COUNTRIES.length; i++) {
        if (GEO_COUNTRIES[i].code === countryCode) { country = GEO_COUNTRIES[i]; break; }
    }
    if (!country) return null;
    if (countryCode === 'US' && stateCode) {
        for (i = 0; i < GEO_US_STATES.length; i++) {
            if (GEO_US_STATES[i].code === stateCode) {
                var s = GEO_US_STATES[i];
                return { lat: s.lat, lng: s.lng, label: s.name + ', USA' };
            }
        }
    }
    return { lat: country.lat, lng: country.lng, label: country.name };
}
```

- [ ] **Step 2: Syntax check.**

```bash
cd /Users/shiebenaderet/Documents/GitHub/civil-war-battle-simulation
node --check js/data/geo.js && echo "geo.js parses OK"
```

Expected: `geo.js parses OK`.

- [ ] **Step 3: Commit.**

```bash
git add js/data/geo.js
git commit -m "geo: country/state centroids + equirectangular projection"
```

## Task 2: Verify geo data completeness and projection

**Files:**
- Test: inline Node script (no framework in repo)

- [ ] **Step 1: Write and run the assertion.**

```bash
cd /Users/shiebenaderet/Documents/GitHub/civil-war-battle-simulation
node -e '
const fs=require("fs"),vm=require("vm");
const c={}; vm.createContext(c); vm.runInContext(fs.readFileSync("js/data/geo.js","utf8")+"\nthis.G={GEO_COUNTRIES,GEO_US_STATES,geoProject,geoLookup};",c);
const {GEO_COUNTRIES,GEO_US_STATES,geoProject,geoLookup}=c.G;
let fail=[];
if(GEO_COUNTRIES.length<190) fail.push("countries "+GEO_COUNTRIES.length+" < 190");
if(GEO_US_STATES.length!==51) fail.push("states "+GEO_US_STATES.length+" !== 51");
[].concat(GEO_COUNTRIES,GEO_US_STATES).forEach(r=>{
  if(!r.code||!r.name) fail.push("missing code/name: "+JSON.stringify(r));
  if(!isFinite(r.lat)||r.lat<-90||r.lat>90) fail.push(r.name+" bad lat "+r.lat);
  if(!isFinite(r.lng)||r.lng<-180||r.lng>180) fail.push(r.name+" bad lng "+r.lng);
});
// projection sanity: WA upper-left-ish, Australia lower-right-ish, within viewBox
const wa=geoProject(47.4,-120.5), au=geoProject(-25.3,133.8);
[wa,au].forEach(p=>{ if(p.x<0||p.x>1000||p.y<0||p.y>500) fail.push("projection out of box "+JSON.stringify(p)); });
if(!(wa.x<500 && wa.y<250)) fail.push("WA not upper-left: "+JSON.stringify(wa));
if(!(au.x>500 && au.y>250)) fail.push("AU not lower-right: "+JSON.stringify(au));
// lookup
const l=geoLookup("US","WA"); if(!l||l.label!=="Washington, USA") fail.push("US/WA lookup wrong: "+JSON.stringify(l));
const f=geoLookup("FR",""); if(!f||f.label!=="France") fail.push("FR lookup wrong: "+JSON.stringify(f));
if(fail.length){console.error("FAILS:\n"+fail.join("\n"));process.exit(1);}
console.log("PASS: geo data complete, projection + lookup sane");
'
```

Expected: `PASS: geo data complete, projection + lookup sane`. If it fails, fill in the missing rows / fix coordinates in `geo.js` and rerun.

- [ ] **Step 2: Commit** (only if Task 1 needed coordinate fixes; otherwise skip).

```bash
git add js/data/geo.js && git commit -m "geo: complete centroid tables (assertion passes)"
```

## Task 3: Add the bundled world-map SVG to geo.js

**Files:**
- Modify: `js/data/geo.js`

- [ ] **Step 1: Source a public-domain equirectangular world map.** Fetch a public-domain world land SVG and confirm its license is public domain (Natural Earth derived, or a Wikimedia Commons PD world map). Candidate (verify PD at fetch time):

```bash
cd /tmp
curl -sL "https://upload.wikimedia.org/wikipedia/commons/8/80/World_map_-_low_resolution.svg" -o world-raw.svg
head -c 400 /tmp/world-raw.svg   # inspect: must be plain SVG paths, license PD
```

If that file is not clearly public domain or not equirectangular, use another PD equirectangular source. The requirement: land masses as `<path>`/`<polygon>` data, equirectangular projection, redistributable as public domain.

- [ ] **Step 2: Normalize to the viewBox and inline it.** Scale/translate the artwork so its coordinate space is `0 0 1000 500` (equirectangular, matching `geoProject`). Strip scripts, metadata, and styling down to the land paths; set land fill to a CSS var token used elsewhere (e.g. `var(--color-cream-200)` / a neutral land color) and a transparent ocean so the app background shows. Inline the result as a single template-string constant appended to `js/data/geo.js`:

```javascript
// Public-domain equirectangular world map (land outlines only), normalized to
// the 1000x500 viewBox so geoProject() coordinates land on the right country.
// Source: <exact PD source + license noted here at implementation time>.
var GEO_WORLD_SVG = '<g class="geo-land" fill="#d8cba8" stroke="#b3a06f" stroke-width="0.5">' +
    '<!-- land <path> data, coordinates already in 0..1000 / 0..500 space -->' +
    '</g>';
```

(Store only the inner `<g>`...land paths, not a full `<svg>` wrapper; `renderVisitorMap` provides the `<svg viewBox>` wrapper so pins and land share one coordinate space.)

- [ ] **Step 3: Verify the SVG parses and aligns.** Render the map + three reference pins (Washington, France, Australia) to a PNG and eyeball that pins land on the correct land masses.

```bash
cd /Users/shiebenaderet/Documents/GitHub/civil-war-battle-simulation
node --check js/data/geo.js && echo "geo.js still parses"
node -e '
const fs=require("fs"),vm=require("vm");
const c={};vm.createContext(c);vm.runInContext(fs.readFileSync("js/data/geo.js","utf8")+"\nthis.G={GEO_WORLD_SVG,GEO_WORLD_VIEWBOX,geoProject};",c);
const {GEO_WORLD_SVG,GEO_WORLD_VIEWBOX,geoProject}=c.G;
function pin(lat,lng,color){const p=geoProject(lat,lng);return "<circle cx=\""+p.x.toFixed(1)+"\" cy=\""+p.y.toFixed(1)+"\" r=\"6\" fill=\""+color+"\"/>";}
const svg="<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\""+GEO_WORLD_VIEWBOX+"\" width=\"1000\" height=\"500\"><rect width=\"1000\" height=\"500\" fill=\"#eef\"/>"+GEO_WORLD_SVG+pin(47.4,-120.5,"red")+pin(46.2,2.2,"green")+pin(-25.3,133.8,"blue")+"</svg>";
fs.writeFileSync("/tmp/geo-check.svg",svg);console.log("wrote /tmp/geo-check.svg");
'
CHROME="/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"
"$CHROME" --headless --disable-gpu --window-size=1000,500 --screenshot=/tmp/geo-check.png "file:///tmp/geo-check.svg" 2>/dev/null
echo "rendered /tmp/geo-check.png — open and confirm: red pin on US Pacific NW, green on France, blue on Australia"
```

Expected: `geo.js still parses`; the PNG shows the three pins on the correct continents. (Read the PNG to confirm; adjust the SVG normalization in Step 2 if pins are offset.)

- [ ] **Step 4: Commit.**

```bash
git add js/data/geo.js
git commit -m "geo: bundle public-domain equirectangular world map SVG"
```

## Task 4: Firebase guestbook functions

**Files:**
- Modify: `js/firebase-leaderboard.js` (add before the `return {...}` ~line 409; export in that block)

- [ ] **Step 1: Add the five functions** (mirror the `globalScores` + `progress` patterns: type coercion, graceful offline, `_key` on reads, `.push` for submit, `subscribe` returns an unsubscribe fn). Place after `renameGlobalScore`.

```javascript
    // v3.23: visitor guest book. Public node (like globalScores) so anyone who
    // finishes can drop a pin. Entries carry a precomputed centroid so the map
    // renders with no lookups. school is length-capped; teacher moderates.
    function submitGuestEntry(entry, callback) {
        if (!isAvailable()) { if (callback) callback(false, 'Offline.'); return; }
        var e = {
            school: String(entry.school || '').substring(0, 60),
            countryName: String(entry.countryName || '').substring(0, 56),
            regionName: String(entry.regionName || '').substring(0, 40),
            lat: Number(entry.lat) || 0,
            lng: Number(entry.lng) || 0,
            label: String(entry.label || '').substring(0, 80),
            timestamp: firebase.database.ServerValue.TIMESTAMP
        };
        db.ref('guestbook').push(e)
            .then(function() { if (callback) callback(true, ''); })
            .catch(function() { if (callback) callback(false, 'Could not sign the guest book.'); });
    }

    function loadGuestbook(limit, callback) {
        if (!isAvailable()) { callback(null, 'Offline.'); return; }
        var n = Number(limit) || 500;
        db.ref('guestbook').limitToLast(n).once('value')
            .then(function(snapshot) {
                var entries = [];
                snapshot.forEach(function(child) {
                    var v = child.val() || {}; v._key = child.key; entries.push(v);
                });
                callback(entries, '');
            })
            .catch(function() { callback(null, 'Could not load the guest book.'); });
    }

    function subscribeToGuestbook(callback) {
        if (!isAvailable()) { callback(null, 'Offline.'); return function() {}; }
        var ref = db.ref('guestbook');
        var handler = ref.on('value', function(snapshot) {
            var entries = [];
            snapshot.forEach(function(child) {
                var v = child.val() || {}; v._key = child.key; entries.push(v);
            });
            callback(entries, '');
        }, function() { callback(null, 'Listener error.'); });
        return function() { ref.off('value', handler); };
    }

    function deleteGuestEntry(key, callback) {
        if (!isAvailable()) { if (callback) callback(false, 'Offline.'); return; }
        var k = String(key || '').trim();
        if (!k) { if (callback) callback(false, 'Missing key.'); return; }
        db.ref('guestbook/' + k).remove()
            .then(function() { if (callback) callback(true, ''); })
            .catch(function() { if (callback) callback(false, 'Delete failed.'); });
    }

    function updateGuestEntry(key, fields, callback) {
        if (!isAvailable()) { if (callback) callback(false, 'Offline.'); return; }
        var k = String(key || '').trim();
        if (!k) { if (callback) callback(false, 'Missing key.'); return; }
        var patch = {};
        if (typeof fields.school === 'string') patch.school = fields.school.substring(0, 60);
        if (typeof fields.countryName === 'string') patch.countryName = fields.countryName.substring(0, 56);
        if (typeof fields.regionName === 'string') patch.regionName = fields.regionName.substring(0, 40);
        if (fields.lat !== undefined) patch.lat = Number(fields.lat) || 0;
        if (fields.lng !== undefined) patch.lng = Number(fields.lng) || 0;
        if (typeof fields.label === 'string') patch.label = fields.label.substring(0, 80);
        db.ref('guestbook/' + k).update(patch)
            .then(function() { if (callback) callback(true, ''); })
            .catch(function() { if (callback) callback(false, 'Update failed.'); });
    }
```

- [ ] **Step 2: Export them** in the `return {...}` object (after `renameGlobalScore: renameGlobalScore,`):

```javascript
        submitGuestEntry: submitGuestEntry,
        loadGuestbook: loadGuestbook,
        subscribeToGuestbook: subscribeToGuestbook,
        deleteGuestEntry: deleteGuestEntry,
        updateGuestEntry: updateGuestEntry,
```

- [ ] **Step 3: Syntax check + commit.**

```bash
cd /Users/shiebenaderet/Documents/GitHub/civil-war-battle-simulation
node --check js/firebase-leaderboard.js && echo "firebase-leaderboard.js parses OK"
git add js/firebase-leaderboard.js
git commit -m "Firebase: guest book submit/load/subscribe/delete/update"
```

## Task 5: Firebase rules for guestbook

**Files:**
- Modify: `database.rules.json` (add `guestbook` sibling of `globalScores`)

- [ ] **Step 1: Add the node** after the `globalScores` block:

```json
    "guestbook": {
      ".read": true,
      ".write": true,
      "$entryId": {
        ".validate": "newData.hasChildren(['school', 'lat', 'lng', 'timestamp']) && newData.child('school').isString() && newData.child('school').val().length <= 60 && newData.child('lat').isNumber() && newData.child('lng').isNumber() && newData.child('timestamp').isNumber()"
      }
    }
```

- [ ] **Step 2: Validate JSON + commit.**

```bash
cd /Users/shiebenaderet/Documents/GitHub/civil-war-battle-simulation
node -e 'JSON.parse(require("fs").readFileSync("database.rules.json","utf8")); console.log("rules JSON valid");'
git add database.rules.json
git commit -m "Firebase rules: validate public guestbook node (publish required)"
```

(Note in handoff: the teacher must publish the updated rules in the Firebase console or via `firebase deploy --only database`, same as the recall node.)

## Task 6: Auto-filter + shared map renderer in ui.js

**Files:**
- Modify: `js/ui.js`

- [ ] **Step 1: Add `cleanSchoolName`** (auto-filter). Place near the other guestbook code (add a clearly-commented section). Strips HTML, caps length, rejects a compact profanity list. Returns `{ ok, cleaned, reason }`.

```javascript
// ============================================================
// Visitor Guest Book + Map
// ============================================================

// Compact profanity deterrent. Not exhaustive — the teacher dashboard is the
// authoritative moderation surface. Whole-word, case-insensitive.
var GUESTBOOK_BANNED = ['fuck','shit','bitch','asshole','cunt','dick','piss','bastard','slut','whore','nigger','faggot','retard'];

function cleanSchoolName(raw) {
    var s = String(raw == null ? '' : raw).replace(/[<>]/g, '').trim();
    if (!s) return { ok: false, cleaned: '', reason: 'Enter your school name.' };
    if (s.length > 60) s = s.substring(0, 60);
    var lower = s.toLowerCase();
    for (var i = 0; i < GUESTBOOK_BANNED.length; i++) {
        var re = new RegExp('\\b' + GUESTBOOK_BANNED[i] + '\\b', 'i');
        if (re.test(lower)) return { ok: false, cleaned: s, reason: "Let's keep it school-appropriate." };
    }
    return { ok: true, cleaned: s, reason: '' };
}
```

- [ ] **Step 2: Add `renderVisitorMap`** (shared by finish screen, modal, dashboard). Builds the SVG via DOM (XSS-safe: entry text only via `textContent` in the popup). Pins jitter deterministically by key so same-centroid entries don't stack.

```javascript
// Render guest entries as pins on the bundled world map into `container`.
// entries: [{ school, label, lat, lng, _key }]. highlightKey optional.
function renderVisitorMap(container, entries, highlightKey) {
    if (!container) return;
    if (typeof GEO_WORLD_SVG === 'undefined') { container.textContent = 'Map unavailable.'; return; }
    var vb = (typeof GEO_WORLD_VIEWBOX !== 'undefined') ? GEO_WORLD_VIEWBOX : '0 0 1000 500';
    container.innerHTML = ''; // clear (empty string literal only)

    var SVG = 'http://www.w3.org/2000/svg';
    var svg = document.createElementNS(SVG, 'svg');
    svg.setAttribute('viewBox', vb);
    svg.setAttribute('class', 'visitor-map');
    svg.setAttribute('role', 'img');
    svg.setAttribute('aria-label', 'Map of where players are from');

    // Land layer (trusted, bundled string).
    var land = document.createElementNS(SVG, 'g');
    land.innerHTML = GEO_WORLD_SVG; // trusted constant from geo.js, not user data
    svg.appendChild(land);

    var popup = document.createElementNS(SVG, 'text');
    popup.setAttribute('class', 'visitor-map-popup');
    popup.setAttribute('text-anchor', 'middle');
    popup.style.display = 'none';

    (entries || []).forEach(function(e) {
        if (!isFinite(e.lat) || !isFinite(e.lng)) return;
        var p = geoProject(e.lat, e.lng);
        // deterministic jitter from the push-key so clusters spread, stable per entry
        var seed = 0, key = String(e._key || (e.lat + '' + e.lng));
        for (var i = 0; i < key.length; i++) seed = (seed * 31 + key.charCodeAt(i)) >>> 0;
        var jx = ((seed % 100) / 100 - 0.5) * 10;
        var jy = (((seed >> 8) % 100) / 100 - 0.5) * 10;
        var dot = document.createElementNS(SVG, 'circle');
        dot.setAttribute('cx', (p.x + jx).toFixed(1));
        dot.setAttribute('cy', (p.y + jy).toFixed(1));
        var isHi = highlightKey && e._key === highlightKey;
        dot.setAttribute('r', isHi ? '7' : '4');
        dot.setAttribute('class', 'visitor-pin' + (isHi ? ' visitor-pin-new' : ''));
        var labelText = (e.school ? e.school + ' — ' : '') + (e.label || '');
        dot.addEventListener('click', function() {
            popup.textContent = labelText; // textContent: XSS-safe
            popup.setAttribute('x', (p.x + jx).toFixed(1));
            popup.setAttribute('y', (p.y + jy - 10).toFixed(1));
            popup.style.display = '';
        });
        svg.appendChild(dot);
    });
    svg.appendChild(popup);
    container.appendChild(svg);
}
```

- [ ] **Step 3: Syntax check + commit.**

```bash
cd /Users/shiebenaderet/Documents/GitHub/civil-war-battle-simulation
node --check js/ui.js && echo "ui.js parses OK"
git add js/ui.js
git commit -m "Guest book: auto-filter + shared XSS-safe map renderer"
```

## Task 7: Verify auto-filter + map render logic

**Files:**
- Test: inline Node script with a minimal DOM shim

- [ ] **Step 1: Run the logic test** (mirrors the functions; keep in sync if signatures change).

```bash
cd /Users/shiebenaderet/Documents/GitHub/civil-war-battle-simulation
node -e '
// cleanSchoolName logic
var BANNED=["fuck","shit","damn"];
function clean(raw){var s=String(raw==null?"":raw).replace(/[<>]/g,"").trim();if(!s)return{ok:false,reason:"empty"};if(s.length>60)s=s.substring(0,60);for(var i=0;i<BANNED.length;i++){if(new RegExp("\\b"+BANNED[i]+"\\b","i").test(s.toLowerCase()))return{ok:false,reason:"profanity"};}return{ok:true,cleaned:s};}
var t=[["",false],["Lincoln Middle School",true],["<script>x</script>School",true],["damn school",false],["a".repeat(80),true]];
var pass=true;
t.forEach(function(c){var r=clean(c[0]);if(r.ok!==c[1]){console.error("FAIL clean("+JSON.stringify(c[0]).slice(0,30)+") ok="+r.ok+" expect "+c[1]);pass=false;}});
// HTML must be stripped
if(clean("<b>Hi</b>").cleaned.indexOf("<")!==-1){console.error("FAIL: angle brackets not stripped");pass=false;}
// length cap
if(clean("a".repeat(80)).cleaned.length!==60){console.error("FAIL: length not capped");pass=false;}
console.log(pass?"PASS: auto-filter logic":"FAILED");process.exit(pass?0:1);
'
```

Expected: `PASS: auto-filter logic`.

- [ ] **Step 2: Render-with-jitter + XSS test** using the real `renderVisitorMap` against a DOM shim. (Reuse the shim style from `/tmp/recall-verify/test-render.js`: `createElementNS`, a `textContent` setter, and an `innerHTML` setter that throws on non-empty assignment EXCEPT for the trusted land `<g>`.) Assert: one `<circle>` per valid entry, same-centroid entries get different cx/cy (jitter), and a crafted `school` with `<script>` reaches the popup only via `textContent`. Save as `/tmp/guestbook-render-test.js` and run with `node`. Expected: `ALL PASS`.

- [ ] **Step 3: Commit** (test artifact is in /tmp; nothing to commit unless logic was fixed).

## Task 8: Guest book form on the Historical finish screen

**Files:**
- Modify: `index.html` (add `#guestbookSection` to `endGameScreen`; load `geo.js`), `js/ui.js` (`buildGuestbookForm`, `wireGuestbookForm`; call from `renderHistoricalComplete`)

- [ ] **Step 1: Load geo.js** in `index.html`. After the battles.js script tag (find it: `grep -n 'js/data/battles.js' index.html`), add:

```html
    <script src="js/data/geo.js"></script>
```

- [ ] **Step 2: Add the mount** in `endGameScreen`. After `<div id="scoreboardSection" ...></div>` (index.html ~line 989) add:

```html
            <div id="guestbookSection" class="guestbook-section" style="display:none;"></div>
```

- [ ] **Step 3: Build + wire the form (js/ui.js).** Add after `renderVisitorMap`. The form builds country options from `GEO_COUNTRIES` (US first), a US-state select from `GEO_US_STATES` shown only when country==US, a school input, an "Add me to the map" button, and an error line. On submit: `cleanSchoolName`, `geoLookup`, `submitGuestEntry`, then swap to a thank-you and render the map with the new pin highlighted. Guard double-submit.

```javascript
function buildGuestbookForm(container) {
    if (!container || typeof GEO_COUNTRIES === 'undefined') return;
    var countryOpts = GEO_COUNTRIES.map(function(c) {
        return '<option value="' + c.code + '">' + escapeHtml(c.name) + '</option>';
    }).join('');
    var stateOpts = '<option value="">Select state…</option>' + GEO_US_STATES.map(function(s) {
        return '<option value="' + s.code + '">' + escapeHtml(s.name) + '</option>';
    }).join('');
    container.style.display = '';
    container.innerHTML =
        '<div class="guestbook-card" id="guestbookCard">' +
        '<h3 class="guestbook-title">Sign the Guest Book</h3>' +
        '<p class="guestbook-sub">Add your school to the map of everyone who has played.</p>' +
        '<input type="text" id="gbSchool" class="guestbook-input" maxlength="60" placeholder="Your school name">' +
        '<select id="gbCountry" class="guestbook-input">' + countryOpts + '</select>' +
        '<select id="gbState" class="guestbook-input">' + stateOpts + '</select>' +
        '<div id="gbError" class="guestbook-error" style="display:none;"></div>' +
        '<button type="button" id="gbSubmit" class="guestbook-btn">Add me to the map</button>' +
        '</div>' +
        '<div id="guestbookMapMount" class="guestbook-map-mount"></div>';
    wireGuestbookForm(container);
}

function wireGuestbookForm(container) {
    var countrySel = container.querySelector('#gbCountry');
    var stateSel = container.querySelector('#gbState');
    var schoolEl = container.querySelector('#gbSchool');
    var errEl = container.querySelector('#gbError');
    var submitBtn = container.querySelector('#gbSubmit');
    var card = container.querySelector('#guestbookCard');
    var mapMount = container.querySelector('#guestbookMapMount');
    if (!countrySel || !stateSel || !schoolEl || !submitBtn) return;

    function syncStateVisibility() {
        stateSel.style.display = (countrySel.value === 'US') ? '' : 'none';
    }
    syncStateVisibility();
    countrySel.addEventListener('change', syncStateVisibility);

    var submitted = false;
    submitBtn.addEventListener('click', function() {
        if (submitted) return;
        var filt = cleanSchoolName(schoolEl.value);
        if (!filt.ok) { errEl.textContent = filt.reason; errEl.style.display = 'block'; return; }
        if (countrySel.value === 'US' && !stateSel.value) {
            errEl.textContent = 'Pick your state.'; errEl.style.display = 'block'; return;
        }
        errEl.style.display = 'none';
        var loc = geoLookup(countrySel.value, stateSel.value);
        if (!loc) { errEl.textContent = 'Pick your country.'; errEl.style.display = 'block'; return; }
        submitted = true;
        submitBtn.disabled = true;
        var entry = {
            school: filt.cleaned,
            countryName: (function(){ for (var i=0;i<GEO_COUNTRIES.length;i++) if (GEO_COUNTRIES[i].code===countrySel.value) return GEO_COUNTRIES[i].name; return ''; })(),
            regionName: stateSel.value && countrySel.value==='US' ? (stateSel.options[stateSel.selectedIndex].text) : '',
            lat: loc.lat, lng: loc.lng, label: loc.label
        };
        if (!firebaseLeaderboard.isAvailable()) {
            errEl.textContent = 'You need an internet connection to add to the map.';
            errEl.style.display = 'block'; submitted = false; submitBtn.disabled = false; return;
        }
        firebaseLeaderboard.submitGuestEntry(entry, function(ok) {
            if (card) card.innerHTML = '<h3 class="guestbook-title">Thanks for signing!</h3>' +
                '<p class="guestbook-sub">You are on the map: ' + escapeHtml(loc.label) + '</p>';
            firebaseLeaderboard.loadGuestbook(500, function(entries) {
                if (entries && mapMount) {
                    // best-effort highlight: the most recent matching label
                    var hi = null;
                    for (var i = entries.length - 1; i >= 0; i--) {
                        if (entries[i].label === loc.label && entries[i].school === entry.school) { hi = entries[i]._key; break; }
                    }
                    renderVisitorMap(mapMount, entries, hi);
                }
            });
        });
    });
}
```

- [ ] **Step 4: Call it from `renderHistoricalComplete`.** In `js/ui.js`, right before `showScreen('endGameScreen');` in that function (~line 2038), add:

```javascript
    var gbSection = document.getElementById('guestbookSection');
    if (gbSection && typeof buildGuestbookForm === 'function') buildGuestbookForm(gbSection);
```

- [ ] **Step 5: Minimal CSS** in `css/styles.css` (append): `.guestbook-section`, `.guestbook-card`, `.guestbook-input` (block, spaced), `.guestbook-btn` (reuse brand button styling), `.guestbook-error { color:#b91c1c; font-size:13px; }`, `.visitor-map { width:100%; height:auto; background:var(--color-paper); border:1px solid var(--color-ink); }`, `.visitor-pin { fill:var(--color-accent); cursor:pointer; }`, `.visitor-pin-new { fill:#1d7a3a; }`, `.visitor-map-popup { font-family:var(--font-serif); font-size:14px; fill:var(--color-ink); }`.

- [ ] **Step 6: Syntax check + served smoke test + commit.**

```bash
cd /Users/shiebenaderet/Documents/GitHub/civil-war-battle-simulation
node --check js/ui.js && echo "ui.js OK"
python3 -m http.server 8131 >/dev/null 2>&1 &
SVR=$!; sleep 1
curl -s http://localhost:8131/ | grep -o 'js/data/geo.js' | head -1
curl -s http://localhost:8131/ | grep -o 'id="guestbookSection"' | head -1
kill $SVR 2>/dev/null
git add index.html js/ui.js css/styles.css
git commit -m "Guest book: sign-the-guestbook form + map on Historical finish"
```

Expected: `ui.js OK`, both grep lines print.

## Task 9: Visitor Map in the leaderboard modal

**Files:**
- Modify: `index.html` (add a map wrapper to `leaderboardModal`), `js/ui.js` (render it in `openLeaderboardModal`)

- [ ] **Step 1: Add the wrapper** in `index.html` leaderboard modal body, after the global wrapper (~line 950):

```html
                    <div class="menu-leaderboard-map-wrapper">
                        <h3 class="scoreboard-title">Where Players Are From</h3>
                        <div id="menuLeaderboardMapMount"></div>
                    </div>
```

- [ ] **Step 2: Render in `openLeaderboardModal`** (js/ui.js ~line 2884). After the global block, add:

```javascript
    var mapMount = document.getElementById('menuLeaderboardMapMount');
    if (mapMount) {
        if (firebaseLeaderboard.isAvailable()) {
            mapMount.textContent = 'Loading map…';
            firebaseLeaderboard.loadGuestbook(500, function(entries, err) {
                if (err || !entries) { mapMount.textContent = 'Map needs an internet connection.'; return; }
                if (!entries.length) { mapMount.textContent = 'No guest book signatures yet.'; return; }
                renderVisitorMap(mapMount, entries, null);
            });
        } else {
            mapMount.textContent = 'Map needs an internet connection.';
        }
    }
```

- [ ] **Step 3: Syntax check + commit.**

```bash
cd /Users/shiebenaderet/Documents/GitHub/civil-war-battle-simulation
node --check js/ui.js && echo "ui.js OK"
git add index.html js/ui.js
git commit -m "Guest book: visitor map in the leaderboard modal"
```

## Task 10: Guest Book tab on the teacher dashboard

**Files:**
- Modify: `teacher.html` (load geo.js; add tab button, CSS, view, state, subscribe, switchTab, render with edit/delete + embedded map)

- [ ] **Step 1: Load geo.js + ui-free deps.** After `<script src="js/data/acts.js"></script>` (find: `grep -n 'js/data/acts.js' teacher.html`) add:

```html
    <script src="js/data/geo.js"></script>
```

`renderVisitorMap` lives in `ui.js` which the dashboard does NOT load. The dashboard needs its own copy. To avoid loading the whole `ui.js`, add a small self-contained `renderVisitorMap` inside the dashboard's inline script (same body as Task 6 Step 2; it only depends on `GEO_WORLD_SVG`/`GEO_WORLD_VIEWBOX`/`geoProject` from geo.js). Keep it byte-identical in behavior.

- [ ] **Step 2: Tab button** after the Questions tab (teacher.html ~line 417):

```html
        <button class="tab-btn" data-tab="guestbook" type="button">Guest Book</button>
```

- [ ] **Step 3: CSS + view + tab show/hide.** Add CSS near the questions-tab block (mirror its pattern) for `body.tab-guestbook #guestbookView { display:block }`, hide `#dashboardMain`, hide `#sortControlGroup`/`#clearAllBtn`. Add the view after `#questionsView`:

```html
    <main id="guestbookView">
        <div id="guestbookMapMount" style="margin-bottom:16px;"></div>
        <table class="lb-table" id="guestbookTable">
            <thead><tr><th>School</th><th>Location</th><th>When</th><th></th></tr></thead>
            <tbody id="guestbookBody"></tbody>
        </table>
        <p id="guestbookEmpty" style="padding:16px;color:#777;display:none;">No guest book signatures yet.</p>
    </main>
```

- [ ] **Step 4: State + subscribe.** Add `gbEntries: []` to `state`. In `init`, after the recall subscription, subscribe:

```javascript
            firebaseLeaderboard.subscribeToGuestbook(function(entries, gerr) {
                if (gerr) return;
                state.gbEntries = entries || [];
                if (state.tab === 'guestbook') renderGuestbook();
            });
```

- [ ] **Step 5: switchTab branch.** Extend `switchTab` (it currently allows progress/leaderboard/global/questions): add `guestbook` to the allowed list, toggle `body.classList.toggle('tab-guestbook', tab === 'guestbook')`, and `else if (tab === 'guestbook') renderGuestbook();`.

- [ ] **Step 6: renderGuestbook (with edit/delete + map).** Add near `renderQuestions`. Table rows built with `textContent` (XSS-safe). Edit prompts for a new school name (and keeps location); delete confirms then calls `deleteGuestEntry`. Embedded map via the dashboard's `renderVisitorMap`.

```javascript
        function renderGuestbook() {
            var body = document.getElementById('guestbookBody');
            var empty = document.getElementById('guestbookEmpty');
            var mapMount = document.getElementById('guestbookMapMount');
            body.innerHTML = '';
            var rows = state.gbEntries.slice().sort(function(a, b){ return (b.timestamp||0)-(a.timestamp||0); });
            if (mapMount) renderVisitorMap(mapMount, rows, null);
            if (!rows.length) { empty.style.display = ''; return; }
            empty.style.display = 'none';
            rows.forEach(function(e) {
                var tr = document.createElement('tr');
                var tdS = document.createElement('td'); tdS.textContent = e.school || '';
                var tdL = document.createElement('td'); tdL.textContent = e.label || '';
                var tdW = document.createElement('td');
                tdW.textContent = e.timestamp ? new Date(e.timestamp).toLocaleDateString() : '';
                var tdA = document.createElement('td');
                var edit = document.createElement('button'); edit.textContent = 'Edit'; edit.className='lb-mini-btn';
                var del = document.createElement('button'); del.textContent = 'Delete'; del.className='lb-mini-btn';
                edit.addEventListener('click', function() {
                    var next = window.prompt('School name:', e.school || '');
                    if (next == null) return;
                    firebaseLeaderboard.updateGuestEntry(e._key, { school: String(next).substring(0,60) }, function(ok, m){ if(!ok) setStatus(m||'Update failed.', true); });
                });
                del.addEventListener('click', function() {
                    if (!window.confirm('Delete this guest book entry?')) return;
                    firebaseLeaderboard.deleteGuestEntry(e._key, function(ok, m){ if(!ok) setStatus(m||'Delete failed.', true); });
                });
                tdA.appendChild(edit); tdA.appendChild(del);
                tr.appendChild(tdS); tr.appendChild(tdL); tr.appendChild(tdW); tr.appendChild(tdA);
                body.appendChild(tr);
            });
        }
```

- [ ] **Step 7: Validate inline script + commit.**

```bash
cd /Users/shiebenaderet/Documents/GitHub/civil-war-battle-simulation
node -e 'const fs=require("fs");const m=fs.readFileSync("teacher.html","utf8").match(/<script>\n([\s\S]*?)<\/script>/);fs.writeFileSync("/tmp/gb-teacher.js",m[1]);'
node --check /tmp/gb-teacher.js && echo "teacher.html inline script OK"
git add teacher.html
git commit -m "Dashboard: Guest Book tab (map + table, edit/delete)"
```

Expected: `teacher.html inline script OK`.

## Task 11: Live end-to-end verification

- [ ] **Step 1: Serve + render the guestbook map standalone** (already done in Task 3 for alignment). Confirm `geo.js`, `ui.js`, `teacher.html` all `node --check` clean.

- [ ] **Step 2: Manual flow.** Serve locally; finish Historical Mode (set a valid class code first is NOT required for the guest book — it posts globally); sign the guest book; confirm the pin appears on the finish-screen map; open the menu Leaderboard and confirm the map shows under "Where Players Are From"; open `teacher.html` (password `amsmustangs`) → Guest Book tab and confirm the entry appears in the table and on the map, edit the school name, then delete it.

```bash
cd /Users/shiebenaderet/Documents/GitHub/civil-war-battle-simulation
python3 -m http.server 8132 >/dev/null 2>&1 &
echo "open http://localhost:8132/ , finish Historical Mode, sign the guest book"
echo "then http://localhost:8132/teacher.html (password amsmustangs) > Guest Book"
# pkill -f 'http.server 8132' when done
```

- [ ] **Step 3: Offline safety.** With DevTools offline, attempt to sign → friendly "needs internet" message, no crash. Map mounts show the offline message.

- [ ] **Step 4: Reminder to publish rules.** The guestbook node won't accept writes until `database.rules.json` is published live (console or `firebase deploy --only database`).

---

## Self-review notes

- **Spec coverage:** geo.js (centroids/projection/world SVG) → Tasks 1-3. Firebase node + functions → Tasks 4-5. Auto-filter + shared renderer → Task 6 (verified Task 7). Finish-screen form + map → Task 8. Modal map → Task 9. Dashboard Guest Book tab (table + map + edit/delete) → Task 10. Rules → Task 5. Live verify → Task 11. Full world country list + 50 states → Task 1/2 assertion. No-names/no-message, dropdown-only, no IP → form in Task 8 collects only school+country+state. All spec sections covered.
- **No placeholders:** every code/command step is concrete. The two intentional "implementer fills in" spots are the bulk centroid rows (Task 1, gated by the Task 2 completeness assertion) and the bundled world SVG path data (Task 3, gated by the visual alignment check) — both are data too large to inline literally and both have an automated/visual gate.
- **Type/name consistency:** entry shape `{school, countryName, regionName, lat, lng, label, timestamp}` identical across `submitGuestEntry` (Task 4), the form (Task 8), the rules validation (Task 5), and the renderers (Tasks 6/10). `renderVisitorMap(container, entries, highlightKey)` signature identical in ui.js (Task 6) and the dashboard copy (Task 10). `geoLookup`/`geoProject`/`GEO_*` names consistent across geo.js and all consumers. `_key` used for highlight/edit/delete consistently.
- **XSS (read this before implementing any render step):** The ONLY user-entered field is `school` (free text typed by a student). It must be rendered via `textContent` everywhere it is displayed — the map popup (Task 6), the dashboard table (Task 10), and any future surface. NEVER assign a user-entered value into `innerHTML`. The `innerHTML` assignments in this plan are restricted to: (a) the trusted bundled `GEO_WORLD_SVG` constant in `renderVisitorMap`; (b) form scaffolding built from the trusted `GEO_COUNTRIES`/`GEO_US_STATES` constants (still passed through `escapeHtml` defensively); and (c) the finish-screen thank-you, which displays only `escapeHtml(loc.label)` (a trusted geo-table label), NOT the raw school name. If you need to show the school name back to the student, set it with `textContent`. Server-side, the Firebase rules cap `school` length, and `cleanSchoolName` strips `<`/`>` and rejects profanity, but `textContent` is the actual XSS guarantee — the filter is only a content deterrent, not a security boundary.
- **Dashboard renderVisitorMap duplication:** intentional — the dashboard doesn't load ui.js, so it carries its own copy that depends only on geo.js. Task 10 Step 1 calls this out.
