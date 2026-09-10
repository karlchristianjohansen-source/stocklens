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
    sym: 'GOOGL', tv: 'NASDAQ:GOOGL', name: 'Alphabet', exch: 'NASDAQ', score: 73,
    buyUrl: rh('GOOGL'),
    headline: 'A cloud backlog number landed that nobody had in their model.',
    why: [
      'Committed cloud backlog came in well above the last disclosure. Backlog is contracted revenue that has not been recognised yet, which makes it one of the few forward numbers in software that is not a guess — and it reframes the growth argument for the next four quarters rather than the next one.',
      'Two houses raised targets on the back of it, both citing capacity rather than demand. That is the tell: the constraint has moved from finding customers to serving them, which is the better problem to have and usually the one that gets paid for.',
      'The tape agreed without getting carried away — 1.7× volume, an orderly close, no gap. Insiders sold under scheduled plans, which the lens weights lightly. Earnings sit 20 days out.',
    ],
    drivers: [
      ['up',   'Cloud backlog beat',          'Contracted revenue above the last disclosure'],
      ['up',   'Two targets raised',          'Both cite capacity, not demand'],
      ['flat', 'Orderly 1.7× volume',         'No gap, no sweep — a steady bid'],
      ['down', 'Scheduled insider sales',     'Pre-set plans, weighted lightly'],
    ],
    stats: [['Volume vs avg', '1.7×'], ['52w range', '11% from high'], ['Next earnings', '20 days'], ['Avg move', '±5.4%']],
    feed: [
      ['news',     'Cloud backlog well above last disclosure', 'Contracted, not forecast revenue',      '12m'],
      ['analyst',  'Two targets raised on capacity',       'Constraint has moved to serving demand',    '54m'],
      ['unusual',  'Volume 1.7× average, orderly close',   'No gap and no sweep',                       '2h'],
      ['insider',  'Officers sold under plans',            'Scheduled, disclosed in advance',           '2d'],
      ['earnings', 'Q3 report in 20 days',                 'Moved ±5.4% avg over the last 8 prints',    '—'],
    ],
  },
  {
    sym: 'AMZN', tv: 'NASDAQ:AMZN', name: 'Amazon', exch: 'NASDAQ', score: 69,
    buyUrl: rh('AMZN'),
    headline: 'Retail margin did the work this quarter, not the cloud line everyone watches.',
    why: [
      'A third-party margin check put North America retail ahead of consensus. That is the half of this business the market has spent years treating as a cost of doing business, so a beat there moves the story more than an equivalent beat in cloud would.',
      'The sell side has not fully caught up — one target raise, framed cautiously around fulfilment cost per unit. When research lags a margin datapoint, the lens leans on the data rather than the note.',
      'Volume was unremarkable at 1.3× and nothing broke the band, which is the profile of repricing rather than a chase. No insider activity in either direction this month. Earnings in 24 days.',
    ],
    drivers: [
      ['up',   'Retail margin ahead',         'North America above consensus on a channel check'],
      ['up',   'Target raised, cautiously',   'Framed on fulfilment cost per unit'],
      ['flat', 'Volume 1.3×, inside the band','Repricing rather than a chase'],
      ['flat', 'No insider activity',         'Nothing filed this month'],
    ],
    stats: [['Volume vs avg', '1.3×'], ['52w range', '8% from high'], ['Next earnings', '24 days'], ['Avg move', '±6.7%']],
    feed: [
      ['news',     'Retail margin check lands ahead',      'North America above consensus',             '28m'],
      ['analyst',  'One target raised on unit costs',      'Cautious framing, no re-rating',            '3h'],
      ['unusual',  'Volume 1.3× average',                  'Nothing outside the band',                  '—'],
      ['insider',  'No insider activity this month',       'Nothing filed either way',                  '—'],
      ['earnings', 'Q3 report in 24 days',                 'Moved ±6.7% avg over the last 8 prints',    '—'],
    ],
  },
  {
    sym: 'AVGO', tv: 'NASDAQ:AVGO', name: 'Broadcom', exch: 'NASDAQ', score: 79,
    buyUrl: rh('AVGO'),
    headline: 'A second custom-silicon customer was confirmed, and that changes the multiple, not just the model.',
    why: [
      'The company confirmed a second large customer for custom accelerators. One customer is a contract; two is a business line. The market prices those differently, which is why this moved more than the revenue arithmetic alone would justify.',
      'Three targets went up within the session, all rebuilding the custom-silicon line rather than adjusting the existing one. That distinction matters — analysts adding a new segment is a structural revision, not a tweak.',
      'Volume ran 2.6× with heavy call activity on the front month. Insiders were quiet. The risk is concentration: a business built on two customers is exposed to both of them, and the lens does not score that.',
    ],
    drivers: [
      ['up',   'Second custom-silicon customer', 'One is a contract, two is a business line'],
      ['up',   'Three targets rebuilt',        'A new segment, not an adjustment'],
      ['up',   'Front-month call activity',    'Volume 2.6× the average'],
      ['down', 'Customer concentration',       'Two names now carry the segment'],
    ],
    stats: [['Volume vs avg', '2.6×'], ['52w range', 'At the high'], ['Next earnings', '38 days'], ['Avg move', '±8.1%']],
    feed: [
      ['news',     'Second custom-silicon customer confirmed', 'Company statement',                     '19m'],
      ['analyst',  'Three targets raised in-session',      'Custom line rebuilt, not adjusted',         '1h'],
      ['unusual',  'Volume 2.6× with call activity',       'Concentrated in the front month',           '40m'],
      ['insider',  'No insider activity',                  'Quiet through the announcement',            '—'],
      ['earnings', 'Q4 report in 38 days',                 'Moved ±8.1% avg over the last 8 prints',    '—'],
    ],
  },
  {
    sym: 'LLY', tv: 'NYSE:LLY', name: 'Eli Lilly', exch: 'NYSE', score: 64,
    buyUrl: rh('LLY'),
    headline: 'Supply caught up with demand, which is good news that reads like bad news.',
    why: [
      'Manufacturing capacity for the incretin franchise came online ahead of schedule. For most companies that is unambiguously good. Here it is more subtle: scarcity has been supporting price, and the market spent the session working out whether volume growth offsets a softer mix.',
      'The sell side landed on yes, narrowly — one target raise, one reiterate, and a notably wide spread between the two. That disagreement is the most informative thing in this file.',
      'Volume was 1.5× and the range stayed inside the band. A director bought on the open market last week, which is a genuine signal rather than a scheduled one. Earnings in 29 days.',
    ],
    drivers: [
      ['up',   'Capacity online early',       'Volume growth ahead of schedule'],
      ['down', 'Scarcity had supported price','Softer mix as supply normalises'],
      ['flat', 'Analysts split',              'One raise, one reiterate, wide spread'],
      ['up',   'Director bought on the open market', 'Unscheduled, real money'],
    ],
    stats: [['Volume vs avg', '1.5×'], ['52w range', '14% from high'], ['Next earnings', '29 days'], ['Avg move', '±5.9%']],
    feed: [
      ['news',     'Incretin capacity online ahead of plan','Volume up, mix likely softer',             '35m'],
      ['analyst',  'One raise, one reiterate',             'Unusually wide spread between them',        '2h'],
      ['unusual',  'Volume 1.5×, range inside the band',   'No break either side',                      '—'],
      ['insider',  'Director bought on the open market',   'Unscheduled purchase',                      '6d'],
      ['earnings', 'Q3 report in 29 days',                 'Moved ±5.9% avg over the last 8 prints',    '—'],
    ],
  },
  {
    sym: 'JPM', tv: 'NYSE:JPM', name: 'JPMorgan Chase', exch: 'NYSE', score: 61,
    buyUrl: rh('JPM'),
    headline: 'Credit costs came in lower than guided, and the buyback got bigger.',
    why: [
      'Charge-offs landed below the range management guided to last quarter. For a lender that is the number that matters, because it feeds straight through provisions into earnings without any revenue growth required.',
      'The buyback authorisation was increased alongside it. Read together, those two say the same thing: the balance sheet has more room than the guidance implied.',
      'Research nudged targets up modestly — nobody is re-rating a bank on one quarter of credit data. Volume was ordinary at 1.2×. No insider activity. The next report is 15 days out and sets the tone for the sector.',
    ],
    drivers: [
      ['up',   'Charge-offs below guidance',  'Straight through provisions into earnings'],
      ['up',   'Buyback authorisation raised','Balance sheet has more room than guided'],
      ['flat', 'Targets nudged, not re-rated','One quarter of credit data'],
      ['flat', 'Volume 1.2×',                 'Ordinary session'],
    ],
    stats: [['Volume vs avg', '1.2×'], ['52w range', '5% from high'], ['Next earnings', '15 days'], ['Avg move', '±3.8%']],
    feed: [
      ['news',     'Charge-offs below guided range',       'Credit costs better than management said',  '22m'],
      ['news',     'Buyback authorisation increased',      'Announced alongside the credit update',     '22m'],
      ['analyst',  'Targets nudged higher',                'No re-rating on one quarter',               '4h'],
      ['insider',  'No insider activity',                  'Nothing filed this month',                  '—'],
      ['earnings', 'Q3 report in 15 days',                 'First large bank to report',                '—'],
    ],
  },
  {
    sym: 'V', tv: 'NYSE:V', name: 'Visa', exch: 'NYSE', score: 57,
    buyUrl: rh('V'),
    headline: 'Cross-border volume held up, which is the only line that really moves this stock.',
    why: [
      'Monthly cross-border volume stayed at the high end of the recent range. That is the highest-margin flow in the business, and it is the metric the market uses as a proxy for both travel and the health of the consumer.',
      'Nothing else in the file did much. Targets were unchanged, coverage was quiet, and the tape traded 0.9× average — below normal. A 57 here reflects a genuinely balanced read rather than an absence of information.',
      'The open question is regulatory rather than operational, and it does not appear in any of these five lenses. Earnings in 33 days.',
    ],
    drivers: [
      ['up',   'Cross-border volume holding',  'Highest-margin flow, top of the range'],
      ['flat', 'Targets unchanged',            'Quiet week from the sell side'],
      ['flat', 'Volume 0.9× — below normal',   'Nothing forcing the price either way'],
      ['flat', 'No insider activity',          'Nothing filed'],
    ],
    stats: [['Volume vs avg', '0.9×'], ['52w range', '7% from high'], ['Next earnings', '33 days'], ['Avg move', '±3.1%']],
    feed: [
      ['news',     'Cross-border volume at the top of range','Monthly operating update',                '1h'],
      ['analyst',  'Targets unchanged',                    'Quiet week from the sell side',             '—'],
      ['unusual',  'Volume 0.9× — below normal',           'Nothing forcing the price',                 '—'],
      ['insider',  'No insider activity',                  'Nothing filed this month',                  '—'],
      ['earnings', 'Q4 report in 33 days',                 'Moved ±3.1% avg over the last 8 prints',    '—'],
    ],
  },
  {
    sym: 'WMT', tv: 'NYSE:WMT', name: 'Walmart', exch: 'NYSE', score: 67,
    buyUrl: rh('WMT'),
    headline: 'The advertising business grew faster than the stores, again.',
    why: [
      'Retail media revenue grew several times faster than comparable sales. That mix shift is the whole bull case here: advertising carries margins a grocery aisle never will, so every point of mix is worth more than a point of sales.',
      'Two analysts raised targets and both explicitly re-based their margin assumption rather than their revenue line. That is the shape of a durable revision.',
      'Grocery share gains continued, which is the defensive half of the story. Volume 1.4×, inside the band. An officer sold under a scheduled plan. Earnings in 41 days — the longest runway of anything on this list.',
    ],
    drivers: [
      ['up',   'Retail media outgrew stores',  'Ad margins the aisles cannot match'],
      ['up',   'Two targets re-based on margin','Structural, not a revenue tweak'],
      ['up',   'Grocery share gains continued','The defensive half of the story'],
      ['down', 'Officer sold on schedule',     'Pre-set plan'],
    ],
    stats: [['Volume vs avg', '1.4×'], ['52w range', '3% from high'], ['Next earnings', '41 days'], ['Avg move', '±4.6%']],
    feed: [
      ['news',     'Retail media outgrows comparable sales','Mix shift toward advertising',             '45m'],
      ['analyst',  'Two targets re-based on margin',       'Margin assumption, not revenue',            '2h'],
      ['unusual',  'Volume 1.4×, inside the band',         'No break either side',                      '—'],
      ['insider',  'Officer sold under a plan',            'Scheduled and disclosed',                   '3d'],
      ['earnings', 'Q3 report in 41 days',                 'Moved ±4.6% avg over the last 8 prints',    '—'],
    ],
  },
  {
    sym: 'NFLX', tv: 'NASDAQ:NFLX', name: 'Netflix', exch: 'NASDAQ', score: 52,
    buyUrl: rh('NFLX'),
    headline: 'The ad tier is growing and the price increase is being absorbed — but the stock already assumed both.',
    why: [
      'Third-party data has ad-tier signups running ahead of plan and churn steady through the latest price increase. On the facts, that is a good week. The stock barely moved, which tells you the expectation was already in the price.',
      'The sell side is split down the middle: one upgrade on advertising, one downgrade on the multiple, targets effectively unchanged in aggregate. Both are looking at the same numbers and disagreeing about what to pay for them.',
      'Live-event rights costs are the open risk and do not show up in any of these five lenses. Volume 1.1×, nothing unusual. Earnings in 18 days.',
    ],
    drivers: [
      ['up',   'Ad-tier signups ahead of plan','Third-party data, churn steady'],
      ['up',   'Price increase absorbed',      'No churn spike after the change'],
      ['down', 'Downgrade on the multiple',    'The business is fine, the price is the argument'],
      ['flat', 'Volume 1.1×',                  'Nothing unusual in the tape'],
    ],
    stats: [['Volume vs avg', '1.1×'], ['52w range', '16% from high'], ['Next earnings', '18 days'], ['Avg move', '±9.1%']],
    feed: [
      ['news',     'Ad-tier signups running ahead of plan','Third-party data, churn steady',            '50m'],
      ['analyst',  'One upgrade, one downgrade',           'Aggregate target unchanged',                '3h'],
      ['unusual',  'Volume 1.1×',                          'Inside the band',                           '—'],
      ['insider',  'No insider activity this month',       'Nothing filed',                             '—'],
      ['earnings', 'Q3 report in 18 days',                 'Moved ±9.1% avg over the last 8 prints',    '—'],
    ],
  },
  {
    sym: 'ORCL', tv: 'NYSE:ORCL', name: 'Oracle', exch: 'NYSE', score: 70,
    buyUrl: rh('ORCL'),
    headline: 'Remaining performance obligations jumped, and the capex needed to deliver them jumped with it.',
    why: [
      'Remaining performance obligations rose sharply on new cloud infrastructure commitments. RPO is contracted and disclosed, which makes it far harder to argue with than a pipeline number.',
      'The complication arrived in the same filing: capital expenditure guidance went up to serve it. Revenue you have to spend heavily to deliver is worth less than revenue you do not, and the analyst response split along exactly that line — targets up, margin estimates down.',
      'Volume ran 2.1× with a clean break of the upper band. No insider activity. Earnings are 47 days out, the furthest on this list, which leaves a long window for the capex argument to be re-litigated.',
    ],
    drivers: [
      ['up',   'RPO jumped on cloud commitments','Contracted and disclosed, not pipeline'],
      ['down', 'Capex guidance raised with it', 'Revenue that costs more to deliver'],
      ['flat', 'Targets up, margins down',      'Analysts split on the same filing'],
      ['up',   'Volume 2.1×, upper band broken','Clean break, no reversal'],
    ],
    stats: [['Volume vs avg', '2.1×'], ['52w range', 'At the high'], ['Next earnings', '47 days'], ['Avg move', '±7.4%']],
    feed: [
      ['news',     'RPO jumps on cloud commitments',       'Contracted backlog, disclosed in filing',   '16m'],
      ['news',     'Capex guidance raised to serve it',    'Same filing',                               '16m'],
      ['analyst',  'Targets up, margin estimates down',    'Split response to one number',              '1h'],
      ['unusual',  'Volume 2.1×, upper band broken',       'No reversal into the close',                '30m'],
      ['earnings', 'Q2 report in 47 days',                 'Moved ±7.4% avg over the last 8 prints',    '—'],
    ],
  },
  {
    sym: 'XOM', tv: 'NYSE:XOM', name: 'Exxon Mobil', exch: 'NYSE', score: 45,
    buyUrl: rh('XOM'),
    headline: 'Production is up and refining margins are down, and the second one is winning.',
    why: [
      'Upstream volumes came in above plan, helped by assets that started ahead of schedule. In most quarters that carries the day. Not this one — refining crack spreads narrowed enough to more than offset it, and the market pays attention to the margin, not the barrel count.',
      'Analysts cut estimates while leaving targets alone, which is a specific message: the long-run value is unchanged, the next two quarters are worse. That combination reliably produces a soft tape without a real breakdown.',
      'Volume was 1.3× and the range never threatened the lower band. The dividend is the floor under this and nothing in the file threatens it. Earnings in 26 days.',
    ],
    drivers: [
      ['up',   'Upstream volumes above plan',  'Assets started ahead of schedule'],
      ['down', 'Refining margins narrowed',    'More than offsets the extra barrels'],
      ['down', 'Estimates cut, targets held',  'Next two quarters worse, long run unchanged'],
      ['flat', 'Dividend unthreatened',        'Nothing in the file touches the payout'],
    ],
    stats: [['Volume vs avg', '1.3×'], ['52w range', '12% from high'], ['Next earnings', '26 days'], ['Avg move', '±3.4%']],
    feed: [
      ['news',     'Upstream volumes above plan',          'Early starts on new assets',                '38m'],
      ['news',     'Refining crack spreads narrowed',      'Offsets the volume gain',                   '38m'],
      ['analyst',  'Estimates cut, targets unchanged',     'Near term worse, long run intact',          '5h'],
      ['unusual',  'Volume 1.3×, lower band held',         'No breakdown in the tape',                  '—'],
      ['earnings', 'Q3 report in 26 days',                 'Moved ±3.4% avg over the last 8 prints',    '—'],
    ],
  },
  {
    sym: 'COST', tv: 'NASDAQ:COST', name: 'Costco', exch: 'NASDAQ', score: 60,
    buyUrl: rh('COST'),
    headline: 'Renewal rates hit a record and the multiple is still the entire argument.',
    why: [
      'Membership renewal reached an all-time high. Membership fees are close to pure profit here, so renewal rate is the single cleanest read on the business, and it went the right way.',
      'Traffic grew faster than basket size, which is the healthier of the two — it means more visits rather than inflation flattering the average ticket.',
      'Against that, every downgrade this year has been about valuation rather than operations, and this week added another. The lens scores the business and the tape, not the multiple, which is why a 60 here understates how divided opinion actually is. Earnings in 12 days.',
    ],
    drivers: [
      ['up',   'Record renewal rate',          'Fee income is close to pure profit'],
      ['up',   'Traffic outgrew basket size',  'More visits, not just higher prices'],
      ['down', 'Another valuation downgrade',  'Operations not disputed, multiple is'],
      ['flat', 'Volume 1.0×',                  'An ordinary session'],
    ],
    stats: [['Volume vs avg', '1.0×'], ['52w range', '6% from high'], ['Next earnings', '12 days'], ['Avg move', '±4.2%']],
    feed: [
      ['news',     'Membership renewal at a record',       'Monthly membership update',                 '55m'],
      ['news',     'Traffic outgrew basket size',          'Visits up, not just ticket',                '55m'],
      ['analyst',  'Downgraded on valuation',              'Operations not disputed',                   '4h'],
      ['insider',  'Officer sold under a plan',            'Scheduled',                                 '4d'],
      ['earnings', 'Q4 report in 12 days',                 'Moved ±4.2% avg over the last 8 prints',    '—'],
    ],
  },
  {
    sym: 'TSM', tv: 'NYSE:TSM', name: 'Taiwan Semiconductor', exch: 'NYSE', score: 77,
    buyUrl: rh('TSM'),
    headline: 'Advanced-node capacity is sold out into next year, and pricing moved with it.',
    why: [
      'Leading-edge capacity is reported fully booked through next year, and the company is said to have raised advanced-node pricing alongside it. Sold-out capacity plus pricing power is the strongest combination this industry produces, and it shows up in gross margin almost immediately.',
      'Monthly revenue confirmed it independently — the disclosure came in ahead of the seasonal pattern, which is a real number rather than a channel rumour.',
      'The risk sits entirely outside these five lenses and is geopolitical. Nothing in the news, insider, analyst or earnings columns captures it, and it is the reason this trades at a discount to what the fundamentals alone would support. Earnings in 21 days.',
    ],
    drivers: [
      ['up',   'Advanced nodes sold out',      'Booked through next year'],
      ['up',   'Advanced-node pricing raised', 'Flows to gross margin quickly'],
      ['up',   'Monthly revenue ahead',        'Confirms it independently'],
      ['flat', 'Geopolitical risk unscored',   'Sits outside all five lenses'],
    ],
    stats: [['Volume vs avg', '1.9×'], ['52w range', 'At the high'], ['Next earnings', '21 days'], ['Avg move', '±5.2%']],
    feed: [
      ['news',     'Advanced nodes booked through next year','Capacity reported sold out',              '26m'],
      ['news',     'Advanced-node pricing raised',         'Flows to gross margin',                     '26m'],
      ['unusual',  'Volume 1.9× on the disclosure',        'Sustained through the close',               '1h'],
      ['analyst',  'Targets raised across the group',      'Read-through to the whole supply chain',    '3h'],
      ['earnings', 'Q3 report in 21 days',                 'Moved ±5.2% avg over the last 8 prints',    '—'],
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
  // eager: these are a few KB each, and lazy loading only buys pop-in
  // as the watchlist scrolls
  return `<img class="${cls}" src="${LOGO_SOURCES[start](sym)}" alt="${sym} logo"
    decoding="async" data-sym="${sym}" data-attempt="${start}" onerror="lensLogoFallback(this)" />`;
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
