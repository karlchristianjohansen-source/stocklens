# StockLens

Landing page for **$LENS**, a meme coin on Robinhood Chain, wrapped around the
StockLens concept: *understand what's moving the market*.

Three files, no build step, no dependencies.

```
index.html         markup
styles.css         all styling
app.js             ticker data, the detail modal, the contract pill
assets/logo.png    the brand mark — nav, footer and favicon all read this one file
```

## Swapping the logo

`assets/logo.png` is the single source of truth: the nav mark, the footer mark
and the browser favicon all point at it. Replace that one file and all three
update — no markup changes.

The file is the original artwork, unmodified: 592×576, RGBA, exactly as
supplied. It is sized by height (`height: 30px; width: auto`) so the aspect
ratio stays exact and the image is never squashed or cropped.

## Run it

```bash
python3 -m http.server 4663
```

Then open `http://localhost:4663`. Opening `index.html` directly as a `file://`
URL also works — there is nothing that needs an origin.

## After you deploy the token

Open `app.js` and fill in the one field at the top:

```js
const CONFIG = {
  tokenAddress: '0xYourLensContractHere',   // ← paste it here
  tokenSymbol: 'LENS',
};
```

The moment it is set, the hero pill shows the real contract address and the
Copy button turns on.

## Network

| | |
|---|---|
| Chain | Robinhood Chain mainnet |
| Chain ID | 4663 (`0x1237`) |
| RPC | `https://rpc.mainnet.chain.robinhood.com` |
| Gas token | ETH (Arbitrum Nitro L2) |
| Explorer | https://robinhoodchain.blockscout.com |

Shown on the page as reference only — nothing in this build talks to the chain.
There is no wallet connect: the site is a static landing page plus the terminal
mock. If you add one later, `wallet_switchEthereumChain` to `0x1237` is the
call, and note that Phantom restricts which EVM networks it will add.

## The stock detail modal

Clicking any stock — a watchlist row, a ticker in the scrolling marquee, the
panel header, or **Full breakdown** — opens a near-fullscreen sheet with:

- **Why it moved** — a headline plus a written explanation of the session
- **The drivers** — the individual inputs, each tagged up / down / neutral
- The full five-lens signal feed and an at-a-glance stat row
- **Buy <SYM> on Robinhood** — links to `robinhood.com/us/en/stocks/<SYM>/`

It closes on a backdrop click, the ✕, or `Escape`. Opening scales and fades the
sheet up over 420ms on a `cubic-bezier(.22, 1, .36, 1)` curve; closing reverses
it, and the node is only pulled from the DOM once the exit transition finishes.
Body scroll is locked while it is open, with the scrollbar width compensated so
the page behind does not jump. Under 640px it becomes a bottom sheet with a
full-width buy button. All of it collapses to instant under
`prefers-reduced-motion`.

Per-ticker copy lives in the `TICKERS` array in `app.js` — `headline`, `why`
(an array of paragraphs), `drivers`, `stats` and `buyUrl`.

## The terminal is a mock

The ticker panel and every word in the detail modal are **sample data**,
hardcoded in the `TICKERS` array in `app.js`. Twelve names are covered. Prices
jitter on a timer so the surface reads as live, and the open modal's price
ticks with it. It is labelled as sample data in the UI in three places — the
terminal footer, the modal's badge and the modal's footer. Keep those labels.
To make it real, replace `TICKERS` with a fetch against a market-data provider.

The buy links are the one part that is already real: they point at live
Robinhood quote pages.

## Deploy

Any static host works — Vercel, Netlify, Cloudflare Pages, GitHub Pages. Drag
the folder in; there is nothing to build.
