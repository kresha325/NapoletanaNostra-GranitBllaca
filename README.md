# Napoletana Nostra

Faqe Vite + React për Napoletana Nostra. Për zhvillim lokal: `npm install`, pastaj `npm run dev`.

## Muzikë / video ambient

Muzika luhet përmes **YouTube IFrame API**: player në **footer**, **autoplay i heshtuar** (kërkesë e shfletuesve), dhe butoni rrethor majtas-poshtë për **zërin ON/OFF** (mute); nëse API nuk ofron mute, butoni bie në **play / pause**.

| | |
| --- | --- |
| **Video** | [TYtdYslLY9I](https://www.youtube.com/watch?v=TYtdYslLY9I) (embed në faqe) |
| **Kodi** | `src/lib/youtube-ambient-config.ts` (`AMBIENT_YOUTUBE_VIDEO_ID`) |

**Shënime për console**

- **Gjatë `npm run build`:** paralajmërimi për chunk >500 kB u zbut me `manualChunks` (react + framer veç) dhe `chunkSizeWarningLimit` në `vite.config.ts`.
- **`npm warn Unknown env config "devdir"`:** vjen nga mjedisi Cursor/npm në makinë, jo nga ky projekt; mund të injorohet ose të hiqet `devdir` nga konfigurimi global i npm nëse të shqetëson.
- **Në DevTools (Chrome):** embed-i i YouTube shpesh shkakton mesazhe për **cookies të palëve të treta** / **Storage** — kufizohen nga shfletuesi dhe nuk janë gabime të kodit tonë.

Përdorimi varet nga **lejet e embed** të videos dhe nga **kushtet e YouTube**; për përdorim biznesi kontrollo me pronarin e përmbajtjes nëse është e nevojshme.

**Shënim:** `public/audio` dhe `docs/audio` (p.sh. `music.mp3`) **nuk përdoren më** — ambienti është vetëm YouTube; ato rrugë janë hequr nga repozitori.

## Fotografi — seksioni i historisë (`Home`)

Të dyja përdoren në rrotacion në `src/pages/Home.tsx` (`STORY_PIZZAIOLO_IMAGES`):

- **`public/images/pizzaiolo.png`** — fotografi e **Napoletana Nostra** (pronësi e biznesit).
- **`public/images/picaolo.webp`** — gjithashtu fotografi e **Napoletana Nostra** (pronësi e biznesit).
