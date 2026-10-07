# GROWW GOALS — PRODUCT SPEC v2

## 0. Product
Mobile-first prototype of a goal-based investing experience inside Groww for first-time
investors aged 20-26. Single-file React artifact. Tailwind for styling. Icons: lucide-react
only (if an icon name doesn't exist in the available version, use the closest match).
Charts: recharts. All state in React memory (useReducer). NO localStorage or browser
storage. No backend, no real payments, no KYC. App resets on reload. Simulated "today" =
October 2026. Instruments available: Liquid fund, Hybrid fund, Index fund, Stocks.
No fixed deposits (not offered on Groww).

## 1. Design tokens
Colors
- primary #00D09C | primary-pressed #00B386 | primary-tint #E6FAF5
- text-1 #44475B | text-2 #7C7E8C | text-3 #A0A2AD
- screen-bg #F5F7FA | card-bg #FFFFFF | border #E9EBEF | page-bg (behind phone) #E3E7EC
- loss #EB5B3C | loss-tint #FDEEEA | warning #F5A623 | warning-tint #FEF6E7
- toast-bg #2D3047
Instrument colors: Liquid fund #5B8DEF | Hybrid #F5A623 | Index #00D09C | Stocks #2D3047
Goal categories (icon, circle tint / icon color)
- Emergency fund: Shield, #EAF1FE / #5B8DEF
- Trip: Plane, #FEF6E7 / #F5A623
- Car: Car, #E6FAF5 / #00B386
- House: Home, #F0EDFD / #8E7CF0
- Gadget: Smartphone, #FDEEEA / #EB5B3C
- Higher studies: GraduationCap, #E8F4FD / #2B8AC9
- Custom: Star, #F5F7FA / #44475B
Typography (Inter, fallback system-ui; money uses tabular-nums)
- display 32/40 bold | h1 24/32 bold | h2 18/26 semibold
- body 15/22 regular | body-strong 15/22 semibold | caption 13/18 regular text-2
- micro 11/14 medium uppercase, letter-spacing 0.4px, text-2
Spacing 4/8/12/16/20/24/32. Screen padding 20. Card padding 16. Card gap 12.
Radius: cards 16, buttons 12, inputs 12, chips 999, sheets 24 (top).
Shadows: card 0 1px 3px rgba(16,24,40,0.06); sheet 0 -8px 24px rgba(16,24,40,0.12).
Motion: 200ms ease-out; sheets slide up 250ms; progress bars animate 600ms; toasts 2.5s.
Touch targets min 44px.

## 2. Copy rules
Second person. Sentences under 15 words. Plain English; every financial term gets a C17
JargonTip. Never say "guaranteed". Never recommend a real stock or fund. Money in Indian
format (₹1,00,000). Max one emoji per screen. Calm and friendly; light humour only in empty
states and success messages.

## 3. Components
C1 PhoneFrame: 390x844, radius 40, 10px #111 bezel, centered on page-bg. Fake status bar
   44px: "9:41" left, Signal/Wifi/Battery right. Content scrolls inside.
C2 TopBar: 56px. ChevronLeft back (non-root screens), title h2, optional right icon.
C3 BottomNav: 64px white, top border. Home (Home), Goals (Target), Learn (BookOpen),
   Profile (User). Active primary icon + 11px semibold label; inactive text-3.
   Hidden on S0-S4, S12, S13, S16.
C4 Button: 48px, radius 12, body-strong, full width default. Variants: primary (primary
   bg, white text), secondary (white, 1.5px primary border, primary text), ghost
   (primary text), danger-text (loss text). Disabled 40% opacity. Optional 18px icon.
C5 Chip: 28px, px 10, radius 999, 12px semibold. Variants:
   instrument (instrument color 12% bg + 6px dot + label);
   on-track (primary-tint, primary, CheckCircle 12); slightly-behind (warning-tint,
   warning, AlertCircle 12); behind (loss-tint, loss, AlertCircle 12);
   paused (warning-tint, warning, Pause 12); locked (#F0F1F4, text-2, Lock 12);
   gain (primary-tint, TrendingUp); loss (loss-tint, TrendingDown);
   completed (primary bg, white, Trophy 12); mock (#F0F1F4, text-2, "Mock data").
C6 Card: white, radius 16, card shadow, padding 16.
C7 MoneyText: ₹ Indian grouping, tabular-nums; sizes display / h2 / body.
C8 ProgressBar: 8px, radius 999, track border color, fill primary (paused text-3).
   % caption right-aligned above.
C9 AllocationBar: 10px segmented bar by instrument or by goal; legend rows below
   (dot, name, %, ₹) in caption size.
C10 GoalCard (C6): Row 1: 44px category icon circle | name body-strong + caption
   "₹38,000 of ₹80,000" | right caption "₹1,700/mo". Row 2: C8. Row 3: instrument chip +
   status chip (on-track / slightly-behind / behind / paused). Paused content 70%
   opacity. Tap -> S7.
C11 AmountInput: centered display-size ₹ value, editable. Quick pills: +₹100, +₹500,
   +₹1,000, and "Max" when a max exists. Optional "Use ₹X" suggestion pill. Helper
   caption; error caption in loss.
C12 Slider: 6px track, primary fill, 24px white thumb with 2px primary border, value
   bubble while dragging.
C13 SegmentedControl: pill container screen-bg, selected segment white + shadow.
C15 BottomSheet: overlay rgba(0,0,0,0.4), white, top radius 24, 36x4 drag handle, h2
   title, X close, max height 90%, scrolls, sticky CTA at bottom.
C16 Toast: toast-bg, white 14px, CheckCircle icon, radius 12, 16px above BottomNav, 2.5s.
C17 JargonTip: HelpCircle 14px text-2 after a term; tap opens C15 with term title, 2-line
   glossary text (section 7), "Got it".
C18 LockedRow: screen-bg box, radius 12, Lock icon, "Complete 'How to look at a stock' to
   unlock", ghost "Go to Learn" -> S11.
C19 EmptyState: 64px primary-tint icon circle, h2, caption, primary button.
C20 SelectCard: 2-col grid item, white, 1px border, radius 16, padding 16, icon circle +
   body-strong label. Selected: 2px primary border, primary-tint bg, Check badge.
   Optional micro badge.
C21 LearnCard: step dots, 48px icon, h1 title, 2-3 short body paragraphs, Back (ghost) /
   Next (primary).
C22 QuizOption: white card with radio. After answer: correct = primary border + tint +
   Check; wrong pick = loss border + tint + X; one-line explanation below.
C23 InfoBanner: primary-tint bg (or warning-tint for warnings), radius 12, Info or
   AlertCircle 16px, caption text-1.
C24 StockRow: 40px circle with company initial (stock color #2D3047 10% bg) | name
   body-strong + sector caption | right: "P/E 24" caption + 5Y return chip (gain/loss).
   Tap -> S18.
C25 MiniBarChart (recharts): 5 bars for FY22-FY26, labels below, values in ₹ Cr on hover.
C26 PriceLineChart (recharts): 5-year line, primary if up overall, loss if down; no grid,
   axis labels caption size.
C27 ProjectionCard (C6): "At ₹X/month, you'll have ₹Y by {Month Year}" + C8 vs target +
   comparison row: "Same money in a savings account: ₹Z" (text-2) with JargonTip-style
   note "Illustrative: savings 3% a year vs this plan's assumed rate."

## 4. Screens
S0 Launch: 80px primary-tint circle with PiggyBank. h1 "Invest for the things you want".
   Caption "Goals first. Jargon later." Bottom: primary "Start fresh", secondary "Explore
   demo account", micro "Prototype · mock data · no real money".
S1 Onboarding 1/4 Name: C2 back + 4-segment progress bar. h1 "What should we call you?"
   52px text input. Continue disabled until 2+ characters.
S2 Onboarding 2/4 Income: h1 "What's your situation?" 2x2 C20: Salaried (Briefcase),
   Student (GraduationCap), Part-time (Clock), Freelance (Laptop).
S3 Onboarding 3/4 Budget: h1 "How much can you invest each month?" C11 + C12
   (₹100-₹50,000, step ₹100). C13 "Fixed monthly (SIP)" / "Whatever I can"; default Fixed
   for Salaried, "Whatever I can" for others. Non-salaried: C23 "Income not fixed? We'll
   ask you each month how much you can invest." Caption "This is your total. You'll
   split it across goals next."
S4 Onboarding 4/4 First goal: h1 "What are you saving for?" C20 grid of 7 categories;
   Emergency fund preselected, micro badge "Most people start here". Fields: name
   (prefilled), target C11, timeline C13 Months/Years + C12, monthly amount C11 (default
   = full budget, max = budget, "Use ₹X" pill = required monthly). Live C6 "Here's how
   we'll invest it": instrument chip + C17, reason, C9, and C27. CTA "Create my goal" ->
   S5.
S5 Home: h1 "Hi {name} 👋", caption current simulated month ("October 2026").
   Portfolio C6: micro "TOTAL INVESTED", display amount; "Current value ₹X" + gain/loss
   chip "+₹5,140 (4.0%)"; micro "Illustrative returns".
   Buttons side by side: primary "Invest now" (Plus) -> S9; secondary "Next month"
   (FastForward) -> simulate (flexible mode opens S15 first).
   Monthly plan C6: "Monthly budget ₹8,000", C9 by goal (each active goal's monthly
   amount), caption "₹X unassigned" with ghost "Assign" -> S6; if over budget, C23
   warning "You've planned ₹X more than your budget."
   h2 "Your goals" + ghost "See all" -> S6; up to 4 C10.
   If stocks locked: nudge C6 with Sparkles "Unlock stocks for long-term goals",
   caption "3 min read + quick quiz" -> S11.
S6 Goals tab: h1 "Goals", caption "{n} of 6 active". C10 list. Section "Completed" (if
   any) with completed chip. Sticky primary "Add goal" (Plus) -> S8, disabled at 6 active
   with caption. Empty: C19 "No goals yet" / "Start with an emergency fund. Future you
   says thanks." / "Add your first goal".
S7 Goal detail: C2 back + goal name + right Pencil icon -> S8 edit mode.
   Hero: 56px icon circle, h2 current value, caption "of ₹80,000 target", C8, status chip,
   caption "18 months left · April 2028".
   If value ≥ target: C23 "You did it! 🎉" + primary "Withdraw and complete" -> S14.
   h2 "Monthly amount": MoneyText "₹1,700/month", caption "Needs ₹1,850/month to reach
   on time", secondary "Change amount" -> S13, ghost "Match what's needed" (sets it to the
   required amount, rounded up to ₹100).
   C27 projection.
   h2 "How it's invested": instrument chip + C17, C23 reason, C9.
   60+ months: if locked C18; if unlocked: stock slider C12 0-25% + "Your stocks" list
   (C24 rows with remove X) + secondary "Choose stocks" -> S17. Slider disabled until at
   least 1 stock is chosen; caption "Split equally across your stocks".
   Action rows (52px, icon + label + ChevronRight): Pause goal (Pause) / Resume goal
   (Play); Move money (ArrowLeftRight) -> S10; Withdraw (ArrowDownToLine) -> S14; Delete
   goal (Trash2, loss) with confirm sheet ("Its money will be withdrawn").
   C23 bottom: "Goals are labels on one portfolio. Pausing or moving money doesn't sell
   anything."
S8 Create/Edit goal (C15): same fields as S4 (category, name, target, timeline, monthly
   amount, live preview, C27). Create CTA "Create goal", toast "{name} goal created".
   Edit mode title "Edit goal", CTA "Save changes"; if the instrument changes, show a
   confirm sheet "From now on, money for this goal goes into {new instrument}." Toast
   "Changes saved".
S9 Invest now (C15): C11 (min ₹100). C13 "One goal" / "Split across goals".
   One goal: radio list of active goals. Split: proportional to goals' monthly amounts,
   live list (icon, name, ₹). CTA "Invest ₹X". Toast "₹X invested".
S10 Move money (C15): "From" row (fixed, shows value). "To": radio list of other active
   goals. C11 with Max = from value. CTA "Move ₹X". Toast "₹X moved from Trip to Car".
S13 Change monthly amount (C15): C11 (min ₹100), "Use ₹X" pill = required amount,
   caption showing new budget total ("₹8,500 of ₹8,000 budget planned") with warning
   colour if over. CTA "Save".
S14 Withdraw (C15): C11, Max = current value. Emergency fund title: "Use your emergency
   fund". C23 "Liquid funds usually reach your bank in 1 working day. Others in 2-3
   (illustrative)." CTA "Withdraw ₹X". Toast "₹X on its way to your bank". If value ≥
   target and user withdraws all -> goal status completed -> S16.
S15 Flexible month prompt (C15, flexible mode only, opens on "Next month"): h2 "How much
   can you invest in {Month}?" C11 with pill "Usual: ₹X". Caption "We'll split it by your
   goals' monthly amounts." Primary "Invest ₹X", ghost "Skip this month" (toast "No
   worries. Skipped {Month}."). Then the month simulates.
S16 Goal completed: full screen, 96px primary-tint circle with Trophy, h1 "{Goal}
   funded 🎉", caption "₹X saved over {n} months.", primary "Back to goals".
S11 Learn tab: h1 "Learn". Unlock status C6: Lock (or Unlock in primary) + "Stocks for
   5+ year goals" + chip Locked/Unlocked + caption "Pass the stock quiz to unlock".
   Module C6 cards: icon circle, title, caption "5 cards · 3 min", chip Not started/Done.
   C6 "Practice: explore companies" (Search icon) -> S17 (browse-only, no Add button).
S12 Module viewer: full screen, X close, step dots, C21. Module 1 last card: "Take the
   quiz" -> S13Q. Module 2 last card: "Done".
S13Q Quiz: caption "Question 1 of 3", h2 question, C22 options, feedback, Next. Pass
   (2+/3): 80px primary-tint circle with Unlock, h1 "Stocks unlocked 🎉", caption "You can
   now add up to 25% stocks to goals 5+ years away.", primary "Go to my goals". Fail: h1
   "Almost there", caption "You need 2 of 3. Want a quick review?", primary "Review
   cards", ghost "Try again".
S17 Stock explorer: C2 back + "Explore companies" + chip "Mock data". C23 "These are
   made-up companies for learning. We never tell you what to buy." Search input
   (Search icon). Sector chips row (All, FMCG, IT, Banking, Pharma, Auto, Industrials,
   Telecom). List of C24.
S18 Stock page: C2 back + company name + mock chip. Header: initial circle, name, sector,
   h2 price "₹1,240", 5Y return chip. Four sections mirroring module 1, each with a
   numbered micro label:
   "1 · THE BUSINESS": one-line description.
   "2 · FUNDAMENTALS": revenue C25, profit C25, debt level chip (Low/Medium/High) + C17.
   "3 · PERFORMANCE": C26 5-year price line, caption "5-year return +68%".
   "4 · VALUATION": "P/E 24" + C17, caption "Sector average 26". Plain-English line:
   "Cheaper than its sector" / "About the same as its sector" / "Pricier than its sector".
   Sticky bottom (only when opened from a goal): primary "Add to {goal}" (max 5 stocks
   per goal; disabled with caption if 5 already).
S19 Profile: 64px primary circle with initial, h2 name, income chip. Rows: Monthly budget
   (C15 with C11 + C12), Contribution mode (C13). C6 "Assumptions": mock data and mock
   companies; illustrative returns; simplified fund choice by timeline; no real
   transactions; app resets on reload. Danger-text "Reset app" with confirm -> S0.

## 5. Data
user: name, incomeType, monthlyBudget, mode (fixed|flexible), stockUnlocked,
   module1Done, module2Done
goal: id, category, name, targetAmount, monthsLeft, monthlyAmount, status
   (active|paused|completed), invested, currentValue, instrument, stockPercent (0-25),
   stocks[] (stock ids, max 5)
stock: id, name, sector, description, price, revenue[5], profit[5] (₹ Cr, FY22-FY26),
   debt (Low|Medium|High), pe, sectorPe, return5y, priceHistory[60 monthly points]
simulatedMonth (0 = October 2026)

## 6. Rules
Instrument by monthsLeft: <12 Liquid fund | 12-35 Hybrid fund | 36-59 Index fund |
   60+ Index fund + optional stocks. Emergency fund is ALWAYS Liquid fund regardless of
   timeline. Recompute whenever monthsLeft crosses 12, 36 or 60; show a toast when it
   changes ("Car goal is 3 years away now, so new money goes to a hybrid fund").
Reasons: Emergency "Emergency money must be ready any day, so it stays in a liquid fund."
   | <12 "Your {goal} is {n} months away, so we keep this money safe from market ups and
   downs." | 12-35 "A mix of safety and growth for a goal {n} months away." | 36-59
   "Long enough to ride out market dips, so we use an index fund." | 60+ "You have time on
   your side, so most of this grows in an index fund."
Assumed annual rates (projections only): Liquid 6%, Hybrid 9%, Index 12%, Stocks 12%,
   Savings account 3%. Monthly r = annual/12.
Projection: FV = V(1+r)^n + M((1+r)^n - 1)/r, V = currentValue, M = monthlyAmount,
   n = monthsLeft. Blended r for goals with stocks.
Required monthly: M = max(0, (T - V(1+r)^n) * r / ((1+r)^n - 1)), rounded up to ₹100.
Status: FV ≥ target -> On track | FV ≥ 85% of target -> Slightly behind | else Behind.
   Paused -> Paused. Completed -> Completed.
Budget: sum of active goals' monthlyAmount vs monthlyBudget -> "unassigned" or
   "over budget" (warn, don't block).
Invest now split / flexible split: proportional to active goals' monthlyAmount; whole
   rupees; remainder to the goal with the largest monthlyAmount; total exact.
Simulate month (fixed mode adds each active goal's monthlyAmount; flexible mode adds the
   S15 amount): apply returns to currentValue: Liquid +0.5%, Hybrid random -0.5% to +1.5%,
   Index random -3% to +4%, each stock random -6% to +7% (on the stock portion, split
   equally across chosen stocks). monthsLeft -1 (min 0), simulatedMonth +1. Toast
   "{Month}: +₹X added, value now ₹Y".
Pause: no new money; value stays and still gets returns.
Move money: moves currentValue (and invested proportionally); total value unchanged;
   ≤ source value.
Withdraw: ≤ currentValue; reduces currentValue and invested proportionally.
Completed goals don't count toward the 6 active limit.
Bounds: budget ₹100-₹50,000; goal monthly amount ≥ ₹100 (₹0 only while paused);
   target ₹1,000-₹1,00,00,000; timeline 1-180 months; max 6 active goals; any investment
   ≥ ₹100; max 5 stocks per goal; stockPercent must be 0 when no stocks are chosen.

Demo account: Aarav, Salaried, budget ₹8,000, fixed mode, stockUnlocked false, modules
not done.
- Emergency fund: target ₹45,000, 10 months, monthly ₹2,100, invested ₹24,000,
  value ₹24,310
- Europe trip (Trip): target ₹80,000, 24 months, monthly ₹1,700, invested ₹38,000,
  value ₹39,120
- New car (Car): target ₹3,00,000, 48 months, monthly ₹3,000, invested ₹45,000,
  value ₹47,350
- House down payment (House): target ₹5,00,000, 96 months, monthly ₹1,200,
  invested ₹20,000, value ₹21,060

Mock companies (fictional; generate plausible revenue/profit arrays and a 60-point price
history consistent with these):
1. Kaveri Foods, FMCG, packaged snacks and staples, price ₹1,240, P/E 42, sector 45,
   5Y +68%, debt Low, revenue and profit growing steadily
2. Saffron Tech Services, IT, software services for global banks, ₹1,580, P/E 24,
   sector 26, 5Y +54%, debt Low, revenue growing, profit flat last 2 years
3. Pinnacle Bank, Banking, retail and small-business loans, ₹860, P/E 14, sector 16,
   5Y +41%, debt High (normal for banks — say so in the description), growing
4. Neelgiri Pharma, Pharma, generic medicines, ₹2,150, P/E 28, sector 30, 5Y +22%,
   debt Medium, profit dipped in FY24 then recovered
5. Zephyr EV Motors, Auto, electric scooters, ₹410, P/E 95, sector 30, 5Y +210%,
   debt Medium, revenue growing fast, profit only turned positive in FY26
6. Indus Rail Systems, Industrials, train components, ₹690, P/E 18, sector 22,
   5Y +35%, debt High, uneven profit
7. Lotus Telecom, Telecom, mobile network, ₹320, P/E 31, sector 28, 5Y -12%, debt High,
   revenue flat, profit falling
8. Coral Cement, Industrials, cement for housing, ₹1,020, P/E 20, sector 22, 5Y +47%,
   debt Low, steady growth

## 7. Content
Module 1 "How to look at a stock" (TrendingUp), 5 cards:
1. A stock = a tiny piece of a real business. First ask: what does it sell, and to whom?
2. Fundamentals: is revenue growing? Is it making a profit? How much debt does it carry?
3. Performance: look at how it has done over 3-5 years, not last week.
4. Valuation: P/E = how much investors pay for ₹1 of profit. Very high P/E means high
   expectations.
5. Tips and trends aren't research. If you can't explain why you own it, don't buy it.
Module 2 "Mutual funds 101" (Layers), 5 cards:
1. A mutual fund pools money from many people and invests it for them.
2. Large-cap: India's biggest, steadiest companies. Mid-cap: growing mid-sized ones.
   Small-cap: small, fast-moving, riskier.
3. Index funds copy an index like the Nifty 50, so fees are low and no one picks stocks.
4. Liquid funds are a type of debt fund for short-term money. You can usually withdraw
   the next working day.
5. Hybrid funds mix stocks and bonds, balancing growth and safety.
Quiz:
Q1 What does a P/E ratio tell you? ✔ How much investors pay for ₹1 of profit |
   The company's total debt | Tomorrow's stock price
Q2 A friend says a stock will double next month. What do you do first? ✔ Check the
   business's fundamentals yourself | Buy it right away | Use your emergency fund
Q3 What matters most when judging performance? ✔ How it did over several years |
   Last week's price | How many people talk about it online
Glossary (C17):
- SIP: Investing a fixed amount automatically every month. Small, steady, no timing needed.
- NAV: The price of one unit of a mutual fund. It changes daily.
- Liquid fund: A low-risk debt fund for short-term money. Withdraw usually in a day.
- Debt fund: Invests in bonds and loans, not shares. Steadier, lower returns.
- Hybrid fund: A mix of stocks and bonds. Some growth, less of a roller-coaster.
- Index fund: Copies a market index like the Nifty 50. Low cost, no stock picking.
- Large-cap: Funds holding India's biggest companies. Steadier than mid or small-cap.
- P/E ratio: Price divided by profit per share. How expensive a stock is vs its earnings.
- Debt (company): Money a company has borrowed. High debt can be risky if profits fall.
- Revenue / Profit: Revenue is total sales. Profit is what's left after all costs.