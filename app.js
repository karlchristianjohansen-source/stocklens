/* ══════════════════════════════════════════════════════════════
   StockLens — app.js
   Terminal mock + per-ticker breakdown modal
   ══════════════════════════════════════════════════════════════ */

/* ─────────────── CONFIG — edit this after you deploy ─────────────── */
const CONFIG = {
  // Paste your $LENS ERC-20 address here after deploying. Leave '' until then.
  tokenAddress: '',
  tokenSymbol: 'LENS',
};

const $ = (id) => document.getElementById(id);

/* ══════════════════════════════════════════
   1.  Small helpers
   ══════════════════════════════════════════ */

function toast(msg) {
  const el = $('toast');
  el.textContent = msg;
  el.hidden = false;
  requestAnimationFrame(() => el.classList.add('show'));
  clearTimeout(toast._t);
  toast._t = setTimeout(() => {
    el.classList.remove('show');
    setTimeout(() => (el.hidden = true), 220);
  }, 2200);
}

async function copy(text, label) {
  try {
    await navigator.clipboard.writeText(text);
    toast(`${label} copied`);
  } catch {
    toast('Copy failed — select it manually');
  }
}

/* ══════════════════════════════════════════
   2.  Contract-address pill
   ══════════════════════════════════════════ */

function renderContract() {
  const value = $('ca-value');
  const note = $('ca-note');
  if (CONFIG.tokenAddress) {
    value.textContent = CONFIG.tokenAddress;
    note.textContent = 'Verify the address against our X post before you buy.';
  } else {
    value.textContent = 'Not deployed yet';
    note.textContent = 'Contract address goes live at launch. Never trust an address you did not find here.';
    $('ca-copy').disabled = true;
    $('ca-copy').style.opacity = '.45';
    $('ca-copy').style.cursor = 'not-allowed';
  }
}

/* ══════════════════════════════════════════
   3.  Terminal — sample data (the product mock)

   Every field below is illustrative. Swap TICKERS for a real feed to make
   this page do what it claims. `buyUrl` points at the Robinhood quote page.
   ══════════════════════════════════════════ */

const rh = (sym) => `https://robinhood.com/us/en/stocks/${sym}/`;

const TICKERS = [
  {
    sym: 'NVDA', tv: 'NASDAQ:NVDA', name: 'NVIDIA', exch: 'NASDAQ', px: 224.73, chg: 3.18, score: 82,
    buyUrl: rh('NVDA'),
    headline: 'A target raise landed on top of volume nobody could explain, and the two fed each other all session.',
    why: [
      'The move started with the sell side. Morgan Stanley took its target from $215 to $260 and kept the Overweight, which on its own is worth a point or two. What turned it into a 3% day was the tape underneath: volume ran 3.4× the thirty-day average and the range broke the upper band just after 14:00, well before most desks had read the note.',
      'That ordering matters. When price leads the research, the lens reads it as positioning rather than reaction — somebody was already building before the target moved. The accelerator shipping to hyperscalers, announced on the company blog and picked up by six outlets within the hour, gave the buying a story to point at.',
      'The one input pulling the other way is the insider column. The CFO sold 45,000 shares, though it was filed under a 10b5-1 plan set months ago, so the lens weights it lightly. Earnings in twelve days is the real risk: this name has moved an average of ±7.1% on its last eight prints.',
    ],
    drivers: [
      ['up',   'Target raised to $260',      'Morgan Stanley, Overweight held, up from $215'],
      ['up',   'Volume 3.4× the average',    'Upper band broke at 14:02, ahead of the note'],
      ['up',   'Product shipping',           'Next-gen accelerator to hyperscalers, six outlets'],
      ['down', 'CFO sold 45,000 shares',     'Pre-set 10b5-1 plan — weighted lightly'],
    ],
    stats: [['Volume vs avg', '3.4×'], ['52w range', '31% from low'], ['Next earnings', '12 days'], ['Avg move', '±7.1%']],
    feed: [
      ['analyst',  'Morgan Stanley raises target to $260', 'Overweight reiterated · from $215',        '2m'],
      ['unusual',  'Volume 3.4× the 30-day average',       'Range broke the upper band at 14:02',      '18m'],
      ['news',     'Next-gen accelerator ships to hyperscalers', 'Company blog · picked up by 6 outlets', '1h'],
      ['insider',  'CFO sold 45,000 shares',               'Rule 10b5-1 plan · filed Form 4',          '4h'],
      ['earnings', 'Q3 report in 12 days',                 'Stock moved ±7.1% avg over last 8 prints', '—'],
    ],
  },
  {
    sym: 'TSLA', tv: 'NASDAQ:TSLA', name: 'Tesla', exch: 'NASDAQ', px: 365.29, chg: -1.94, score: 38,
    buyUrl: rh('TSLA'),
    headline: 'Two downgrades in five sessions and a delivery number that leaked before anyone could confirm it.',
    why: [
      'The proximate cause is a report that delivery guidance is being trimmed for the quarter. Two outlets have it, neither has a filing behind it, and the company has said nothing — which is exactly the shape of news that moves a stock 2% and leaves everyone arguing about whether it should have.',
      'Underneath that, the analyst layer has been deteriorating for a week. Two downgrades in five sessions took the average target down 8.4% since Monday. That is a slower signal than a headline but a more reliable one, and it is the main reason the lens score sits at 38 rather than in the fifties.',
      'The options market agrees: put volume hit a six-month high and the skew steepened into the close, meaning people paid up for downside protection rather than selling stock. The one contrary input is a director buying 12,000 shares on the open market for $4.3M — a real purchase with real money, not a scheduled sale. It is the single most bullish thing in this file.',
    ],
    drivers: [
      ['down', 'Delivery guidance trimmed',   'Two outlets, no filing, no company comment'],
      ['down', 'Two downgrades in five days', 'Average target down 8.4% since Monday'],
      ['down', 'Put volume at a 6-month high','Skew steepened into the close'],
      ['up',   'Director bought $4.3M',       'Open-market purchase, 12,000 shares'],
    ],
    stats: [['Volume vs avg', '1.8×'], ['52w range', '18% from high'], ['Next earnings', '26 days'], ['Avg move', '±8.3%']],
    feed: [
      ['news',     'Delivery guidance trimmed for the quarter', 'Reported by two outlets, unconfirmed',  '9m'],
      ['analyst',  'Two downgrades in five sessions',      'Average target down 8.4% since Monday',     '35m'],
      ['unusual',  'Put volume at a 6-month high',         'Skew steepened into the close',             '1h'],
      ['insider',  'Director bought 12,000 shares',        'Open-market purchase · $4.3M',              '2d'],
      ['earnings', 'Q3 report in 26 days',                 'Whisper sits below consensus',              '—'],
    ],
  },
  {
    sym: 'HOOD', tv: 'NASDAQ:HOOD', name: 'Robinhood Markets', exch: 'NASDAQ', px: 118.40, chg: 5.62, score: 88,
    buyUrl: rh('HOOD'),
    headline: 'Record on-chain volume, three upgrades, and a 5.6% gap with no filing attached to it.',
    why: [
      'The cleanest read on the board. On-chain activity on Robinhood Chain hit a record, and the stock gapped 5.6% on 4.1× volume — but there is no filing, no press release and no analyst note timed to the open. The lens flags that as unexplained, which is not the same as unjustified. It usually means the information was in the chain data before it was in the news.',
      'The research layer confirms rather than causes: three upgrades this week took the street target up 14% month over month. When targets chase price by that margin, analysts are marking to market, not leading it.',
      'Two things to hold against the score. Insiders have done nothing for thirty days, which is normal inside a quiet window but removes a confirming signal. And earnings land in five days, on a name that has moved an average of ±9.4% over its last eight prints — the widest of anything in this list.',
    ],
    drivers: [
      ['up',   'Record on-chain volume',      'Robinhood Chain activity at an all-time high'],
      ['up',   'Gapped +5.6% on 4.1× volume', 'No matching filing — flagged as unexplained'],
      ['up',   'Three upgrades this week',    'Street target up 14% month over month'],
      ['flat', 'Earnings in five days',       '±9.4% average move over the last eight prints'],
    ],
    stats: [['Volume vs avg', '4.1×'], ['52w range', 'At the high'], ['Next earnings', '5 days'], ['Avg move', '±9.4%']],
    feed: [
      ['news',     'Robinhood Chain mainnet activity up sharply', 'On-chain volume at a record',        '4m'],
      ['unusual',  'Gapped +5.6% on 4.1× volume',          'No matching filing — flagged as unexplained', '22m'],
      ['analyst',  'Three upgrades this week',             'Street target up 14% month over month',     '2h'],
      ['insider',  'No insider activity in 30 days',       'Quiet window ahead of the report',          '—'],
      ['earnings', 'Q3 report in 5 days',                  'Moved ±9.4% avg over the last 8 prints',    '—'],
    ],
  },
  {
    sym: 'COIN', tv: 'NASDAQ:COIN', name: 'Coinbase', exch: 'NASDAQ', px: 182.70, chg: 2.10, score: 71,
    buyUrl: rh('COIN'),
    headline: 'A listing, a target raise, and call sweeps at nearly three times the usual premium.',
    why: [
      'A new chain went live on the exchange, which is the kind of announcement that reliably adds a percent or two because it maps directly onto fee revenue. The sell side moved with it — target to $215 from $190, Buy reiterated.',
      'The more interesting input is flow. Call sweeps hit the front month at 2.8× the twenty-day median premium. Sweeps are urgency: somebody wanted the exposure now and paid across multiple exchanges to get it, rather than working an order patiently.',
      'Insiders sold into the strength — two officers, both under pre-set plans, so the lens discounts it. Earnings are nineteen days out and consensus has been revised up twice this month, which cuts both ways: the bar is higher than it was.',
    ],
    drivers: [
      ['up',   'New chain listed',            'Direct read-through to fee revenue'],
      ['up',   'Target raised to $215',       'Buy reiterated, up from $190'],
      ['up',   'Front-month call sweeps',     'Premium 2.8× the 20-day median'],
      ['down', 'Two officers sold',           'Both under pre-set plans'],
    ],
    stats: [['Volume vs avg', '2.2×'], ['52w range', '44% from low'], ['Next earnings', '19 days'], ['Avg move', '±7.8%']],
    feed: [
      ['analyst',  'Target raised to $215',                'Buy reiterated · from $190',                '11m'],
      ['news',     'New chain listed on the exchange',     'Company announcement',                      '48m'],
      ['unusual',  'Call sweeps on the front month',       'Premium 2.8× the 20-day median',            '1h'],
      ['insider',  'Two officers sold into strength',      'Both under pre-set plans',                  '3d'],
      ['earnings', 'Q3 report in 19 days',                 'Consensus revised up twice this month',     '—'],
    ],
  },
  {
    sym: 'AAPL', tv: 'NASDAQ:AAPL', name: 'Apple', exch: 'NASDAQ', px: 315.69, chg: 0.42, score: 58,
    buyUrl: rh('AAPL'),
    headline: 'Nothing happened, and the lens thinks that is the whole story.',
    why: [
      'Every input is inside its normal band. Volume is ordinary, the spread is ordinary, and the range never threatened either edge. A third-party channel check points to flat builds — not a cut, not a raise, just flat.',
      'The research layer cancelled itself out: one upgrade, one downgrade, street target effectively unchanged. That is a genuinely neutral read rather than a lack of coverage.',
      'The CEO sold under a 10b5-1 plan, scheduled and disclosed well in advance, which carries close to zero information. Earnings are thirty-one days out on a name that moves ±3.2% on average — the calmest print in this list. A 58 here means the lens found nothing to lean on, which is itself worth knowing before you size a position.',
    ],
    drivers: [
      ['flat', 'Channel check flat',          'Third-party note, no build change either way'],
      ['flat', 'One upgrade, one downgrade',  'Street target effectively unchanged'],
      ['flat', 'Volume inside the band',      'Nothing outside normal range today'],
      ['down', 'CEO sold on schedule',        '10b5-1 plan, disclosed in advance'],
    ],
    stats: [['Volume vs avg', '1.0×'], ['52w range', 'Mid-range'], ['Next earnings', '31 days'], ['Avg move', '±3.2%']],
    feed: [
      ['news',     'Supply-chain check points to flat builds', 'Third-party channel note',              '25m'],
      ['analyst',  'One upgrade, one downgrade',           'Street target effectively unchanged',       '3h'],
      ['insider',  'CEO sold under a 10b5-1 plan',         'Scheduled, disclosed in advance',           '1d'],
      ['unusual',  'Nothing outside normal range',         'Volume and spread within band',             '—'],
      ['earnings', 'Q4 report in 31 days',                 'Moved ±3.2% avg over the last 8 prints',    '—'],
    ],
  },
  {
    sym: 'MSTR', tv: 'NASDAQ:MSTR', name: 'MicroStrategy', exch: 'NASDAQ', px: 289.11, chg: -4.35, score: 29,
    buyUrl: rh('MSTR'),
    headline: 'It fell 4.3% while the thing it holds went nowhere — the first time that correlation has broken in forty days.',
    why: [
      'This is the single most unusual reading on the board. The stock trades as a leveraged proxy for what sits on its balance sheet, and that relationship has held tightly for forty sessions. Today it broke: the underlying is flat and the equity is down 4.3%. When a correlation that reliable snaps, something specific to the company is doing the work.',
      'The candidate is the convertible note priced overnight and filed on an 8-K. Converts add shares at a fixed price, and holders routinely short the equity to hedge the conversion option — which produces exactly this pattern, selling pressure unconnected to the asset.',
      'Coverage was initiated at Hold with a target below the last close, which does not help. Against all of it, the chairman bought 3,000 shares on the open market. Small, but it is real money and it is the only input pointing up. Earnings in twenty-two days carry the widest estimate spread in the sector.',
    ],
    drivers: [
      ['down', 'Correlation broke',           'Down 4.3% with the underlying flat — first in 40d'],
      ['down', 'Convertible note priced',     'Filed 8-K overnight; hedging pressures the equity'],
      ['down', 'Initiated at Hold',           'Target sits below the last close'],
      ['up',   'Chairman bought 3,000 shares','Open-market purchase'],
    ],
    stats: [['Volume vs avg', '2.6×'], ['52w range', '38% from high'], ['Next earnings', '22 days'], ['Avg move', '±11.2%']],
    feed: [
      ['unusual',  'Down 4.3% with the underlying flat',   'Correlation broke for the first time in 40d', '6m'],
      ['news',     'Convertible note priced overnight',    'Filed 8-K',                                 '1h'],
      ['analyst',  'Coverage initiated at Hold',           'Target below the last close',               '5h'],
      ['insider',  'Chairman bought 3,000 shares',         'Open-market purchase',                      '1d'],
      ['earnings', 'Q3 report in 22 days',                 'Widest estimate spread in the sector',      '—'],
    ],
  },
  {
    sym: 'META', tv: 'NASDAQ:META', name: 'Meta Platforms', exch: 'NASDAQ', px: 649.09, chg: 1.28, score: 66,
    buyUrl: rh('META'),
    headline: 'Ad checks came in ahead and a model shipped to production — a quiet, well-supported grind higher.',
    why: [
      'Nothing dramatic, which is the point. Ad checks landed ahead of expectations and a target went to $720 on the back of them. That is research following data rather than sentiment, and it tends to stick better than a headline-driven move.',
      'A new model shipped to production the same morning. The market has learned to price these announcements modestly unless they come with a revenue line attached, so it added support rather than a spike.',
      'The tape agrees: a steady bid all session on 1.2× volume, comfortably inside the normal band. No gap, no sweep, no unexplained range break. The CTO sold 8,400 shares under a pre-set plan — routine. Earnings in seventeen days, ±6.0% average move.',
    ],
    drivers: [
      ['up',   'Ad checks ahead',             'Target lifted to $720 on the data'],
      ['up',   'Model shipped to production', 'Company blog, no revenue line attached yet'],
      ['flat', 'Steady bid, 1.2× volume',     'Inside the normal band all session'],
      ['down', 'CTO sold 8,400 shares',       'Pre-set plan'],
    ],
    stats: [['Volume vs avg', '1.2×'], ['52w range', '9% from high'], ['Next earnings', '17 days'], ['Avg move', '±6.0%']],
    feed: [
      ['analyst',  'Target lifted to $720',                'Ad checks came in ahead',                   '31m'],
      ['news',     'New model release ships to production','Company blog',                              '2h'],
      ['unusual',  'Steady bid all session',               'Volume 1.2× average — inside band',         '—'],
      ['insider',  'CTO sold 8,400 shares',                'Pre-set plan',                              '2d'],
      ['earnings', 'Q3 report in 17 days',                 'Moved ±6.0% avg over the last 8 prints',    '—'],
    ],
  },
  {
    sym: 'AMD', tv: 'NASDAQ:AMD', name: 'Advanced Micro Devices', exch: 'NASDAQ', px: 198.44, chg: 2.71, score: 74,
    buyUrl: rh('AMD'),
    headline: 'A hyperscaler design win pulled the whole second-source trade higher.',
    why: [
      'A named cloud provider committed to the next accelerator generation as a second source. Design wins are the highest-quality news this sector produces, because they are contractual and they show up in revenue on a schedule rather than a hope.',
      'The sell side moved within the hour — target to $230, and the note explicitly framed it as share gain rather than market growth. That distinction is why the lens weights it as heavily as it does.',
      'Volume ran 2.3× average with the buying concentrated in the last ninety minutes, which reads as institutional accumulation rather than retail chase. No insider activity either way. Earnings sit twenty-eight days out.',
    ],
    drivers: [
      ['up',   'Hyperscaler design win',      'Named second source for the next generation'],
      ['up',   'Target to $230',              'Note frames it as share gain, not market growth'],
      ['up',   'Late-session accumulation',   '2.3× volume, concentrated in the last 90 minutes'],
      ['flat', 'No insider activity',         'Nothing filed in either direction this month'],
    ],
    stats: [['Volume vs avg', '2.3×'], ['52w range', '27% from low'], ['Next earnings', '28 days'], ['Avg move', '±8.9%']],
    feed: [
      ['news',     'Hyperscaler names it a second source', 'Design win on the next accelerator',        '14m'],
      ['analyst',  'Target raised to $230',                'Framed as share gain, not market growth',   '52m'],
      ['unusual',  'Volume 2.3× average into the close',   'Buying concentrated in the last 90 minutes','1h'],
      ['insider',  'No insider activity this month',       'Nothing filed in either direction',         '—'],
      ['earnings', 'Q3 report in 28 days',                 'Moved ±8.9% avg over the last 8 prints',    '—'],
    ],
  },
  {
    sym: 'PLTR', tv: 'NASDAQ:PLTR', name: 'Palantir', exch: 'NASDAQ', px: 92.16, chg: -3.42, score: 34,
    buyUrl: rh('PLTR'),
    headline: 'A contract slipped a quarter, and a stock priced for perfection does not forgive slippage.',
    why: [
      'A government contract everyone had modelled for this quarter moved to next. Not cancelled, not reduced — moved. On most names that is a shrug. On a multiple this high it is a 3% day, because the price already assumed the timing.',
      'The analyst layer had been drifting down before the news: one downgrade last week on valuation alone, with the target left unchanged, which is the sell side saying the business is fine and the price is not.',
      'Insiders have been consistent sellers for three months, all under plans, but the consistency itself is the signal rather than any single filing. The counterweight is that volume was only 1.4× average — this was not capitulation, just repricing.',
    ],
    drivers: [
      ['down', 'Contract slipped a quarter',  'Moved, not cancelled — but the price assumed timing'],
      ['down', 'Downgrade on valuation',      'Target unchanged; the call is about the multiple'],
      ['down', 'Three months of insider sales','All under plans — the pattern is the signal'],
      ['flat', 'Only 1.4× volume',            'Repricing rather than capitulation'],
    ],
    stats: [['Volume vs avg', '1.4×'], ['52w range', '22% from high'], ['Next earnings', '34 days'], ['Avg move', '±12.4%']],
    feed: [
      ['news',     'Government contract slips a quarter',  'Timing only — scope unchanged',             '20m'],
      ['analyst',  'Downgraded on valuation',              'Target left unchanged',                     '6h'],
      ['unusual',  'Volume only 1.4× average',             'No capitulation in the tape',               '1h'],
      ['insider',  'Third straight month of sales',        'All under pre-set plans',                   '2d'],
      ['earnings', 'Q3 report in 34 days',                 'Moved ±12.4% avg over the last 8 prints',   '—'],
    ],
  },
  {
    sym: 'MSFT', tv: 'NASDAQ:MSFT', name: 'Microsoft', exch: 'NASDAQ', px: 512.88, chg: 0.86, score: 63,
    buyUrl: rh('MSFT'),
    headline: 'Cloud growth reaccelerated by a point, and that single point is the entire move.',
    why: [
      'A channel note put cloud growth a point above the last reported rate. On a base this large, one point is billions, which is why a fairly dry data point produced a clean day rather than a shrug.',
      'Two targets moved up modestly. Nobody is calling for a re-rating; the sell side is adjusting the model and saying so. That is a durable kind of support, if an unexciting one.',
      'The rest of the file is quiet. No insider activity, volume at 1.1× average, nothing outside the band. Earnings are twenty-four days out on a name that moves ±4.1% — the second-calmest here after Apple.',
    ],
    drivers: [
      ['up',   'Cloud growth +1pt',           'Channel note above the last reported rate'],
      ['up',   'Two targets nudged up',       'Model adjustment, not a re-rating call'],
      ['flat', 'Volume at 1.1× average',      'Nothing outside the band'],
      ['flat', 'No insider activity',         'Nothing filed this month'],
    ],
    stats: [['Volume vs avg', '1.1×'], ['52w range', '6% from high'], ['Next earnings', '24 days'], ['Avg move', '±4.1%']],
    feed: [
      ['news',     'Cloud growth reaccelerates a point',   'Third-party channel note',                  '40m'],
      ['analyst',  'Two targets nudged higher',            'Model adjustment, no re-rating',            '3h'],
      ['unusual',  'Volume 1.1× average',                  'Inside the band all session',               '—'],
      ['insider',  'No insider activity this month',       'Nothing filed',                             '—'],
      ['earnings', 'Q1 report in 24 days',                 'Moved ±4.1% avg over the last 8 prints',    '—'],
    ],
  },
  {
    sym: 'SOFI', tv: 'NASDAQ:SOFI', name: 'SoFi Technologies', exch: 'NASDAQ', px: 31.07, chg: 4.18, score: 76,
    buyUrl: rh('SOFI'),
    headline: 'Deposit growth beat the quarter in two months, and an insider backed it with his own money.',
    why: [
      'Deposits hit the full-quarter target eight weeks in. For a lender, cheap deposits are the input that determines everything downstream, so this is closer to a fundamental beat than a datapoint.',
      'Two upgrades followed, both citing funding cost rather than loan growth — the sell side is pricing the liability side of the balance sheet, which is the same thing the deposit number is telling you. When news and research point at the identical mechanism, the lens weights the pair heavily.',
      'The confirming input is an officer buying 60,000 shares on the open market. Not a plan, not a grant — a purchase. Volume ran 3.0× average with a clean break of the upper band. Earnings in eleven days is the only thing standing in the way.',
    ],
    drivers: [
      ['up',   'Deposits beat early',         'Full-quarter target reached in eight weeks'],
      ['up',   'Two upgrades on funding cost','Both cite the liability side, not loan growth'],
      ['up',   'Officer bought 60,000 shares','Open-market purchase, not a plan'],
      ['flat', 'Earnings in eleven days',     '±10.6% average move over the last eight prints'],
    ],
    stats: [['Volume vs avg', '3.0×'], ['52w range', 'At the high'], ['Next earnings', '11 days'], ['Avg move', '±10.6%']],
    feed: [
      ['news',     'Deposit growth beats the full quarter','Target reached eight weeks in',             '7m'],
      ['analyst',  'Two upgrades citing funding cost',     'Liability side, not loan growth',           '1h'],
      ['unusual',  'Volume 3.0× average',                  'Clean break of the upper band',             '25m'],
      ['insider',  'Officer bought 60,000 shares',         'Open-market purchase',                      '1d'],
      ['earnings', 'Q3 report in 11 days',                 'Moved ±10.6% avg over the last 8 prints',   '—'],
    ],
  },
  {
    sym: 'SPY', tv: 'AMEX:SPY', name: 'SPDR S&P 500 ETF', exch: 'NYSE ARCA', px: 764.15, chg: 0.19, score: 55,
    buyUrl: rh('SPY'),
    headline: 'The whole tape is holding its breath until Thursday.',
    why: [
      'An inflation print lands Thursday and everything is positioned around it. Realised volatility has compressed to a three-month low, which is what an index does when nobody wants to be wrong ahead of a number they cannot forecast.',
      'Strategist targets have drifted higher — the median year-end has been raised twice — but that is a slow, backward-looking input and it does not tell you much about Thursday.',
      'Two of the five lenses simply do not apply to an index fund. There is no insider layer on an ETF, and the earnings row is a calendar rather than an event: peak season starts in nine days, with 112 index constituents reporting that week. A 55 here means genuinely balanced, not uninformative.',
    ],
    drivers: [
      ['flat', 'Inflation print Thursday',    'The entire tape is positioned around it'],
      ['flat', 'Realised vol at a 3-month low','Compression into the print'],
      ['up',   'Strategist targets drifting up','Median year-end raised twice'],
      ['flat', 'No insider layer',            'Not applicable to an index fund'],
    ],
    stats: [['Volume vs avg', '0.9×'], ['52w range', '3% from high'], ['Peak season', '9 days'], ['Avg move', '±0.7%']],
    feed: [
      ['news',     'Inflation print lands Thursday',       'The whole tape is positioned around it',    '—'],
      ['unusual',  'Realised vol at a 3-month low',        'Compression into the print',                '1h'],
      ['analyst',  'Strategist targets drifting higher',   'Median year-end raised twice',              '1d'],
      ['insider',  'Not applicable — index fund',          'No insider layer on an ETF',                '—'],
      ['earnings', 'Peak season starts in 9 days',         '112 index names report that week',          '—'],
    ],
  },
];

const KIND_LABEL = {
  news: 'News', insider: 'Insider', analyst: 'Analyst', earnings: 'Earnings', unusual: 'Unusual',
};
const ARROW = { up: '↑', down: '↓', flat: '→' };

let activeSym = 'NVDA';

const bySym = (sym) => TICKERS.find((t) => t.sym === sym);

/* ── real company logos ──────────────────────────────────────────────
   Two independent sources, then the monogram. parqet is a crisp SVG but
   has no art for every ticker (SOFI 404s), so FMP backs it up. */
const LOGO_SOURCES = [
  (sym) => `https://assets.parqet.com/logos/symbol/${sym}`,
  (sym) => `https://financialmodelingprep.com/image-stock/${sym}.png`,
];

/* Tickers the first source has no art for — start them on the second and
   save a guaranteed 404 per render. */
const LOGO_SKIP_FIRST = new Set(['SOFI']);

/** <img> that walks the source list and finally degrades to the monogram. */
function logoHTML(sym, cls) {
  const start = LOGO_SKIP_FIRST.has(sym) ? 1 : 0;
  return `<img class="${cls}" src="${LOGO_SOURCES[start](sym)}" alt="${sym} logo"
    loading="lazy" data-sym="${sym}" data-attempt="${start}" onerror="lensLogoFallback(this)" />`;
}

/* global — the inline onerror handler above needs it on window */
window.lensLogoFallback = function (img) {
  const next = Number(img.dataset.attempt) + 1;
  if (next < LOGO_SOURCES.length) {
    img.dataset.attempt = String(next);
    img.src = LOGO_SOURCES[next](img.dataset.sym);
    return;
  }
  const span = document.createElement('span');
  span.className = `${img.className} logo-fallback`;
  span.textContent = img.dataset.sym.slice(0, 2);
  img.replaceWith(span);
};

/* ── TradingView widgets ─────────────────────────────────────────────
   Each widget reads its JSON config from the text of the script tag that
   creates it, so switching symbol means rebuilding the container. */
function mountChart(el, widget, config) {
  if (!el) return;
  el.innerHTML = '';
  const box = document.createElement('div');
  box.className = 'tradingview-widget-container';
  box.style.height = '100%';
  const slot = document.createElement('div');
  slot.className = 'tradingview-widget-container__widget';
  slot.style.height = '100%';
  box.appendChild(slot);

  const script = document.createElement('script');
  script.type = 'text/javascript';
  script.async = true;
  script.src = `https://s3.tradingview.com/external-embedding/embed-widget-${widget}.js`;
  script.text = JSON.stringify(config);
  box.appendChild(script);
  el.appendChild(box);
}

function panelChart(sym) {
  const t = bySym(sym);
  if (!t) return;
  mountChart($('tk-chart'), 'mini-symbol-overview', {
    symbol: t.tv,
    width: '100%',
    height: '100%',
    locale: 'en',
    dateRange: '12M',
    colorTheme: 'light',
    isTransparent: true,
    autosize: true,
    chartOnly: false,
    noTimeScale: false,
  });
}

function modalChart(sym) {
  const t = bySym(sym);
  if (!t) return;
  mountChart($('m-chart'), 'advanced-chart', {
    autosize: true,
    symbol: t.tv,
    interval: 'D',
    timezone: 'Etc/UTC',
    theme: 'light',
    style: '1',
    locale: 'en',
    hide_side_toolbar: true,
    hide_top_toolbar: false,
    allow_symbol_change: false,
    save_image: false,
    calendar: false,
    withdateranges: true,
    support_host: 'https://www.tradingview.com',
  });
}
const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));

function feedHTML(feed) {
  return feed.map(([kind, title, sub, time], i) => `
    <div class="feed-row" style="--i:${i}">
      <span class="feed-kind k-${kind}">${KIND_LABEL[kind]}</span>
      <span class="feed-body">
        <span class="feed-title">${esc(title)}</span>
        <span class="feed-sub">${esc(sub)}</span>
      </span>
      <span class="feed-time">${esc(time)}</span>
    </div>`).join('');
}

function renderWatchlist(filter = '') {
  const q = filter.trim().toUpperCase();
  const list = TICKERS.filter((t) => !q || t.sym.includes(q) || t.name.toUpperCase().includes(q));
  const box = $('watchlist');

  if (!list.length) {
    box.innerHTML = '<p style="padding:16px;font-size:12.5px;color:var(--faint)">No ticker matches. Try NVDA, HOOD or SPY.</p>';
    return;
  }

  box.innerHTML = list.map((t) => `
      <button class="wl-row ${t.sym === activeSym ? 'active' : ''}" data-sym="${t.sym}" type="button">
        ${logoHTML(t.sym, 'wl-logo')}
        <span class="wl-meta">
          <span class="wl-sym">${t.sym}</span>
          <span class="wl-name">${esc(t.name)}</span>
        </span>
      </button>`).join('');

  box.querySelectorAll('.wl-row').forEach((row) => {
    row.addEventListener('click', () => selectTicker(row.dataset.sym, true));
  });
}

function renderTicker() {
  const t = bySym(activeSym);
  if (!t) return;

  $('tk-logo').innerHTML = logoHTML(t.sym, 'ticker-logo-img');
  $('tk-sym').textContent = t.sym;
  $('tk-name').textContent = t.name;

  $('tk-score').textContent = `${t.score} / 100`;
  $('tk-gauge').style.left = `calc(${t.score}% - 1.5px)`;
  $('tk-feed').innerHTML = feedHTML(t.feed);

  panelChart(t.sym);
}

/** Select a ticker in the inline panel, and optionally open the full breakdown. */
function selectTicker(sym, openDetail = false) {
  if (!bySym(sym)) return;
  activeSym = sym;
  renderWatchlist($('ticker-input').value);
  renderTicker();
  if (openDetail) openModal(sym);
}

/* ══════════════════════════════════════════
   4.  Stock detail modal
   ══════════════════════════════════════════ */

const modal = {
  el: null,
  sheet: null,
  openSym: null,
  lastFocus: null,
  closeTimer: null,
};

function renderModal(sym) {
  const t = bySym(sym);
  if (!t) return;

  $('m-logo').innerHTML = logoHTML(sym, 'm-logo-img');
  $('m-sym').textContent = sym;
  $('m-exch').textContent = t.exch;
  $('m-name').textContent = t.name;

  $('m-score').textContent = `${t.score} / 100`;
  $('m-gauge').style.left = `calc(${t.score}% - 1.5px)`;

  $('m-headline').textContent = t.headline;
  $('m-why').innerHTML = t.why.map((p) => `<p>${esc(p)}</p>`).join('');

  $('m-drivers').innerHTML = t.drivers.map(([dir, title, sub]) => `
    <div class="m-driver">
      <span class="m-arrow ${dir}">${ARROW[dir]}</span>
      <span>
        <span class="m-driver-t">${esc(title)}</span>
        <span class="m-driver-s">${esc(sub)}</span>
      </span>
    </div>`).join('');

  $('m-feed').innerHTML = feedHTML(t.feed);

  $('m-stats').innerHTML = t.stats.map(([label, value]) => `
    <div class="m-stat"><span>${esc(label)}</span><strong>${esc(value)}</strong></div>`).join('');

  $('m-buy').href = t.buyUrl;
  $('m-buy-label').textContent = `Buy ${sym} on Robinhood`;
}

function openModal(sym) {
  if (!bySym(sym)) return;
  clearTimeout(modal.closeTimer);

  renderModal(sym);
  modal.openSym = sym;
  modal.lastFocus = document.activeElement;

  // Compensate for the scrollbar the lock removes, so the page does not jump.
  const gap = window.innerWidth - document.documentElement.clientWidth;
  if (gap > 0) document.body.style.paddingRight = `${gap}px`;
  document.body.classList.add('modal-open');

  modal.el.hidden = false;
  modal.el.scrollTop = 0;
  $('m-body').scrollTop = 0;
  void modal.el.offsetHeight;        // flush styles so the transition actually runs
  modal.el.classList.add('open');

  modalChart(sym);
  $('modal-close').focus({ preventScroll: true });
}

function closeModal() {
  if (!modal.openSym) return;
  modal.openSym = null;
  modal.el.classList.remove('open');

  // Let the exit transition finish before pulling the node out of the flow.
  modal.closeTimer = setTimeout(() => {
    modal.el.hidden = true;
    $('m-chart').innerHTML = '';          // drop the widget iframe
    document.body.classList.remove('modal-open');
    document.body.style.paddingRight = '';
    modal.lastFocus?.focus?.({ preventScroll: true });
  }, 320);
}

function initModal() {
  modal.el = $('modal');
  modal.sheet = $('modal-sheet');

  $('modal-backdrop').addEventListener('click', closeModal);
  $('modal-close').addEventListener('click', closeModal);

  // A click anywhere in the padded shell but outside the sheet also closes.
  modal.el.addEventListener('mousedown', (e) => {
    if (e.target === modal.el) closeModal();
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.openSym) closeModal();
  });

  // Keep the price in the open modal in step with the ticking sample data.
  modal.sheet.addEventListener('transitionend', () => {}, { passive: true });
}

/* ══════════════════════════════════════════
   5.  Ticking sample data
   ══════════════════════════════════════════ */

function tickClock() {
  const hhmmss = new Date().toLocaleTimeString('en-US', { hour12: false });
  $('terminal-clock').textContent = `SAMPLE FEED · ${hhmmss}`;
}

function buildMarquee() {
  const once = TICKERS.map((t) =>
    `<span role="button" tabindex="0" data-sym="${t.sym}">${t.sym}</span>`).join('');
  const track = $('marquee-track');
  track.innerHTML = once + once; // duplicated for a seamless -50% loop

  track.addEventListener('click', (e) => {
    const sym = e.target.closest('[data-sym]')?.dataset.sym;
    if (sym) selectTicker(sym, true);
  });
  track.addEventListener('keydown', (e) => {
    if (e.key !== 'Enter' && e.key !== ' ') return;
    const sym = e.target.closest('[data-sym]')?.dataset.sym;
    if (sym) { e.preventDefault(); selectTicker(sym, true); }
  });
}

/* ══════════════════════════════════════════
   6.  Wire-up
   ══════════════════════════════════════════ */

function init() {
  renderContract();
  buildMarquee();
  renderWatchlist();
  renderTicker();
  initModal();
  tickClock();

  setInterval(tickClock, 1000);

  $('ticker-input').addEventListener('input', (e) => {
    const q = e.target.value.trim().toUpperCase();
    renderWatchlist(q);
    const hit = bySym(q);
    if (hit) { activeSym = hit.sym; renderWatchlist(q); renderTicker(); }
  });
  $('ticker-input').addEventListener('keydown', (e) => {
    if (e.key !== 'Enter') return;
    const hit = bySym(e.target.value.trim().toUpperCase()) || bySym(activeSym);
    if (hit) selectTicker(hit.sym, true);
  });

  $('tk-more').addEventListener('click', () => openModal(activeSym));
  $('tk-open').addEventListener('click', () => openModal(activeSym));
  $('tk-open').addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); openModal(activeSym); }
  });

  $('ca-copy').addEventListener('click', () => {
    if (CONFIG.tokenAddress) copy(CONFIG.tokenAddress, 'Contract address');
  });

  const nav = document.querySelector('.nav');
  const onScroll = () => nav.classList.toggle('scrolled', window.scrollY > 8);
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
}

document.addEventListener('DOMContentLoaded', init);
