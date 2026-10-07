import React, { useReducer, useState } from 'react';
import {
  ChevronLeft, Home, Target, BookOpen, User, Shield, Plane, Car,
  Smartphone, GraduationCap, Star, CheckCircle, AlertCircle, Pause, Lock, TrendingUp,
  TrendingDown, Trophy, Plus, FastForward, Sparkles, Pencil, ArrowLeftRight, ArrowDownToLine,
  Trash2, HelpCircle, Search, PiggyBank, Play, Briefcase, Clock, Laptop, X, ChevronDown
} from 'lucide-react';
import { Home as HomeIcon } from 'lucide-react';
import { BarChart, Bar, LineChart, Line, ResponsiveContainer, XAxis, Tooltip, YAxis } from 'recharts';

// --- DATA MODEL ---
const GOAL_CATEGORIES = [
  { id: 'emergency', label: 'Emergency fund', icon: Shield, bg: '#EAF1FE', color: '#5B8DEF' },
  { id: 'trip', label: 'Trip', icon: Plane, bg: '#FEF6E7', color: '#F5A623' },
  { id: 'car', label: 'Car', icon: Car, bg: '#E6FAF5', color: '#00B386' },
  { id: 'house', label: 'House', icon: HomeIcon, bg: '#F0EDFD', color: '#8E7CF0' },
  { id: 'gadget', label: 'Gadget', icon: Smartphone, bg: '#FDEEEA', color: '#EB5B3C' },
  { id: 'studies', label: 'Higher studies', icon: GraduationCap, bg: '#E8F4FD', color: '#2B8AC9' },
  { id: 'custom', label: 'Custom', icon: Star, bg: '#F5F7FA', color: '#44475B' },
];

const MOCK_COMPANIES = [
  { id: 'kaveri', name: 'Kaveri Foods', sector: 'FMCG', price: 1240, pe: 42, sectorPe: 45, return5y: 68, debt: 'Low', description: 'Packaged snacks and staples', revenue: [800, 950, 1100, 1250, 1400], profit: [80, 95, 120, 135, 160], priceHistory: Array.from({length:60}, (_,i) => 1240/(Math.pow(1.68, (60-i)/60))) },
  { id: 'saffron', name: 'Saffron Tech Services', sector: 'IT', price: 1580, pe: 24, sectorPe: 26, return5y: 54, debt: 'Low', description: 'Software services for global banks', revenue: [2000, 2200, 2500, 2800, 3100], profit: [400, 450, 520, 520, 520], priceHistory: Array.from({length:60}, (_,i) => 1580/(Math.pow(1.54, (60-i)/60))) },
  { id: 'pinnacle', name: 'Pinnacle Bank', sector: 'Banking', price: 860, pe: 14, sectorPe: 16, return5y: 41, debt: 'High', description: 'Retail and small-business loans (high debt is normal for banks)', revenue: [5000, 5800, 6700, 7800, 9000], profit: [500, 600, 750, 900, 1100], priceHistory: Array.from({length:60}, (_,i) => 860/(Math.pow(1.41, (60-i)/60))) },
  { id: 'neelgiri', name: 'Neelgiri Pharma', sector: 'Pharma', price: 2150, pe: 28, sectorPe: 30, return5y: 22, debt: 'Medium', description: 'Generic medicines', revenue: [1500, 1600, 1550, 1700, 1900], profit: [300, 320, 250, 290, 350], priceHistory: Array.from({length:60}, (_,i) => 2150/(Math.pow(1.22, (60-i)/60))) },
  { id: 'zephyr', name: 'Zephyr EV Motors', sector: 'Auto', price: 410, pe: 95, sectorPe: 30, return5y: 210, debt: 'Medium', description: 'Electric scooters', revenue: [100, 300, 800, 1800, 3500], profit: [-50, -100, -80, -20, 150], priceHistory: Array.from({length:60}, (_,i) => 410/(Math.pow(3.1, (60-i)/60))) },
  { id: 'indus', name: 'Indus Rail Systems', sector: 'Industrials', price: 690, pe: 18, sectorPe: 22, return5y: 35, debt: 'High', description: 'Train components', revenue: [1200, 1100, 1400, 1350, 1600], profit: [100, 80, 150, 120, 180], priceHistory: Array.from({length:60}, (_,i) => 690/(Math.pow(1.35, (60-i)/60))) },
  { id: 'lotus', name: 'Lotus Telecom', sector: 'Telecom', price: 320, pe: 31, sectorPe: 28, return5y: -12, debt: 'High', description: 'Mobile network', revenue: [4000, 4050, 4000, 3950, 3900], profit: [400, 350, 300, 250, 200], priceHistory: Array.from({length:60}, (_,i) => 320/(Math.pow(0.88, (60-i)/60))) },
  { id: 'coral', name: 'Coral Cement', sector: 'Industrials', price: 1020, pe: 20, sectorPe: 22, return5y: 47, debt: 'Low', description: 'Cement for housing', revenue: [2500, 2800, 3100, 3400, 3800], profit: [300, 350, 400, 450, 520], priceHistory: Array.from({length:60}, (_,i) => 1020/(Math.pow(1.47, (60-i)/60))) },
];

const GLOSSARY = {
  'SIP': 'Investing a fixed amount automatically every month. Small, steady, no timing needed.',
  'NAV': 'The price of one unit of a mutual fund. It changes daily.',
  'Liquid fund': 'A low-risk debt fund for short-term money. Withdraw usually in a day.',
  'Debt fund': 'Invests in bonds and loans, not shares. Steadier, lower returns.',
  'Hybrid fund': 'A mix of stocks and bonds. Some growth, less of a roller-coaster.',
  'Index fund': 'Copies a market index like the Nifty 50. Low cost, no stock picking.',
  'Large-cap': "Funds holding India's biggest companies. Steadier than mid or small-cap.",
  'P/E ratio': 'Price divided by profit per share. How expensive a stock is vs its earnings.',
  'Debt (company)': 'Money a company has borrowed. High debt can be risky if profits fall.',
  'Revenue / Profit': "Revenue is total sales. Profit is what's left after all costs."
};

const DEMO_ACCOUNT = {
  user: { name: 'Aarav', incomeType: 'Salaried', monthlyBudget: 8000, mode: 'fixed', stockUnlocked: false, module1Done: false, module2Done: false },
  goals: [
    { id: 'g1', category: 'emergency', name: 'Emergency fund', targetAmount: 45000, monthsLeft: 10, monthlyAmount: 2100, status: 'active', invested: 24000, currentValue: 24310, instrument: 'Liquid fund', stockPercent: 0, stocks: [] },
    { id: 'g2', category: 'trip', name: 'Europe trip', targetAmount: 80000, monthsLeft: 24, monthlyAmount: 1700, status: 'active', invested: 38000, currentValue: 39120, instrument: 'Hybrid fund', stockPercent: 0, stocks: [] },
    { id: 'g3', category: 'car', name: 'New car', targetAmount: 300000, monthsLeft: 48, monthlyAmount: 3000, status: 'active', invested: 45000, currentValue: 47350, instrument: 'Index fund', stockPercent: 0, stocks: [] },
    { id: 'g4', category: 'house', name: 'House down payment', targetAmount: 500000, monthsLeft: 96, monthlyAmount: 1200, status: 'active', invested: 20000, currentValue: 21060, instrument: 'Index fund', stockPercent: 0, stocks: [] },
  ],
  simulatedMonth: 0
};

// --- CORE LOGIC (SECTION 6) ---
const RATES = { 'Liquid fund': 0.06, 'Hybrid fund': 0.09, 'Index fund': 0.12, Stocks: 0.12, Savings: 0.03 };

const getInstrument = (category, monthsLeft) => {
  if (category === 'emergency') return 'Liquid fund';
  if (monthsLeft < 12) return 'Liquid fund';
  if (monthsLeft <= 35) return 'Hybrid fund';
  return 'Index fund';
};

const getReason = (category, monthsLeft, goalName) => {
  if (category === 'emergency') return "Emergency money must be ready any day, so it stays in a liquid fund.";
  if (monthsLeft < 12) return `Your ${goalName || 'goal'} is ${monthsLeft} months away, so we keep this money safe from market ups and downs.`;
  if (monthsLeft <= 35) return `A mix of safety and growth for a goal ${monthsLeft} months away.`;
  if (monthsLeft <= 59) return "Long enough to ride out market dips, so we use an index fund.";
  return "You have time on your side, so most of this grows in an index fund.";
};

const getProjection = (currentValue, monthlyAmount, monthsLeft, instrument, stockPercent = 0) => {
  let rAnnual = RATES[instrument] || 0;
  if (instrument === 'Index fund' && stockPercent > 0) {
    rAnnual = (RATES['Index fund'] * (100 - stockPercent) + RATES['Stocks'] * stockPercent) / 100;
  }
  const r = rAnnual / 12;
  const n = monthsLeft;
  if (r === 0 || n === 0) return currentValue + (monthlyAmount * n);
  const fv = currentValue * Math.pow(1 + r, n) + monthlyAmount * (Math.pow(1 + r, n) - 1) / r;
  return Math.round(fv);
};

const getSavingsProjection = (currentValue, monthlyAmount, monthsLeft) => {
  const r = RATES['Savings'] / 12;
  const n = monthsLeft;
  if (r === 0 || n === 0) return currentValue + (monthlyAmount * n);
  return Math.round(currentValue * Math.pow(1 + r, n) + monthlyAmount * (Math.pow(1 + r, n) - 1) / r);
};

const getRequiredMonthly = (target, currentValue, monthsLeft, instrument, stockPercent = 0) => {
  let rAnnual = RATES[instrument] || 0;
  if (instrument === 'Index fund' && stockPercent > 0) {
    rAnnual = (RATES['Index fund'] * (100 - stockPercent) + RATES['Stocks'] * stockPercent) / 100;
  }
  const r = rAnnual / 12;
  const n = monthsLeft;
  if (n === 0) return 0;
  if (r === 0) return Math.max(0, Math.ceil((target - currentValue) / n / 100) * 100);
  const m = (target - currentValue * Math.pow(1 + r, n)) * r / (Math.pow(1 + r, n) - 1);
  return Math.max(0, Math.ceil(m / 100) * 100);
};

const getStatus = (fv, target) => {
  if (fv >= target) return 'on-track';
  if (fv >= 0.85 * target) return 'slightly-behind';
  return 'behind';
};

const getBudgetCheck = (goals, budget, newGoalMonthly = 0, ignoreGoalId = null) => {
  const used = goals.filter(g => g.status === 'active' && g.id !== ignoreGoalId).reduce((sum, g) => sum + g.monthlyAmount, 0) + newGoalMonthly;
  return { used, unassigned: Math.max(0, budget - used), over: used > budget };
};

const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
const getSimulatedMonthStr = (simMonth) => {
  const d = new Date(2026, 9 + simMonth, 1);
  return `${MONTHS[d.getMonth()]} ${d.getFullYear()}`;
};

const calculateSplit = (amount, goals) => {
  const active = goals.filter(g => g.status === 'active');
  const totalMonthly = active.reduce((s, g) => s + g.monthlyAmount, 0);
  if (totalMonthly === 0) return active.map(g => ({ ...g, splitAmount: 0 }));
  
  let remaining = amount;
  const split = active.map(g => {
    const s = Math.floor(amount * (g.monthlyAmount / totalMonthly));
    remaining -= s;
    return { ...g, splitAmount: s };
  });
  if (remaining > 0 && split.length > 0) {
    const maxGoal = split.reduce((prev, curr) => curr.monthlyAmount > prev.monthlyAmount ? curr : prev);
    maxGoal.splitAmount += remaining;
  }
  return split;
};

// --- STATE REDUCER ---
const initialState = {
  screen: 'S0',
  tab: 'Home',
  user: null,
  goals: [],
  simulatedMonth: 0,
  activeGoalId: null,
};

function appReducer(state, action) {
  switch (action.type) {
    case 'EXPLORE_DEMO':
      return {
        ...state,
        screen: 'Home',
        tab: 'Home',
        user: DEMO_ACCOUNT.user,
        goals: DEMO_ACCOUNT.goals,
        simulatedMonth: DEMO_ACCOUNT.simulatedMonth,
      };
    case 'UPDATE_ASSUMPTION':
      return {
        ...state,
        assumptions: { ...state.assumptions, [action.payload.key]: action.payload.value }
      };
    case 'RESET':
      return initialState;
    case 'NAVIGATE':
      return { ...state, screen: action.payload, tab: ['Home','Goals','Learn','Profile'].includes(action.payload) ? action.payload : state.tab, activeGoalId: action.goalId || state.activeGoalId, activeModuleId: action.moduleId ?? state.activeModuleId, addToGoalId: action.addToGoalId ?? state.addToGoalId, activeStockId: action.stockId ?? state.activeStockId };
    case 'COMPLETE_ONBOARDING': {
      const p = action.payload;
      const months = p.timelineType === 'Years' ? p.timeline * 12 : p.timeline;
      const newGoal = {
        id: 'g_' + Date.now(),
        category: p.categoryId,
        name: p.goalName,
        targetAmount: p.target,
        monthsLeft: months,
        monthlyAmount: p.monthlyAmount,
        status: 'active',
        invested: 0,
        currentValue: 0,
        instrument: getInstrument(p.categoryId, months),
        stockPercent: 0,
        stocks: []
      };
      return {
        ...state,
        user: {
          name: p.name,
          incomeType: p.incomeType,
          monthlyBudget: p.budget,
          mode: p.mode,
          stockUnlocked: false,
          module1Done: false,
          module2Done: false
        },
        goals: [newGoal],
        simulatedMonth: 0,
        screen: 'Home',
        tab: 'Home'
      };
    }
    case 'UPDATE_GOAL': {
      return {
        ...state,
        goals: state.goals.map(g => g.id === action.payload.id ? { ...g, ...action.payload } : g)
      };
    }
    case 'CREATE_GOAL':
      return { ...state, goals: [...state.goals, action.payload] };
    case 'INVEST_NOW': {
      const p = action.payload;
      return {
        ...state,
        goals: state.goals.map(g => {
          if (p.goalId && g.id === p.goalId) {
            return { ...g, invested: g.invested + p.amount, currentValue: g.currentValue + p.amount };
          } else if (p.splits) {
            const split = p.splits.find(s => s.id === g.id);
            if (split) return { ...g, invested: g.invested + split.splitAmount, currentValue: g.currentValue + split.splitAmount };
          }
          return g;
        })
      };
    }
    case 'SIMULATE_MONTH': {
      const addedAmount = action.payload || 0;
      const isFixed = state.user.mode === 'fixed';
      let toasty = null;
      
      let newGoals = state.goals.map(g => {
        if (g.status !== 'active') return g;
        
        let toAdd = 0;
        if (isFixed) {
          toAdd = g.monthlyAmount;
        } else if (action.split) {
          const s = action.split.find(x => x.id === g.id);
          toAdd = s ? s.splitAmount : 0;
        }

        let newInvested = g.invested + toAdd;
        let newCurrentValue = g.currentValue + toAdd;

        let r = 0;
        const rand = () => Math.random();
        if (g.instrument === 'Liquid fund') r = 0.005;
        else if (g.instrument === 'Hybrid fund') r = -0.005 + (rand() * 0.02);
        else {
          const indexPortion = 100 - g.stockPercent;
          const indexReturn = -0.03 + (rand() * 0.07);
          let stockReturn = 0;
          if (g.stockPercent > 0 && g.stocks.length > 0) {
            const sumReturns = g.stocks.reduce((acc, _) => acc + (-0.06 + (rand() * 0.13)), 0);
            stockReturn = sumReturns / g.stocks.length;
          }
          r = (indexReturn * indexPortion + stockReturn * g.stockPercent) / 100;
        }
        
        newCurrentValue = Math.round(newCurrentValue * (1 + r));
        const newMonthsLeft = Math.max(0, g.monthsLeft - 1);
        const newInstrument = getInstrument(g.category, newMonthsLeft);
        
        let newStockPercent = g.stockPercent;
        let newStocks = [...g.stocks];
        if (newMonthsLeft < 60) {
          newStockPercent = 0;
          newStocks = [];
        }

        if (newInstrument !== g.instrument) {
          toasty = `${g.name} is under ${newMonthsLeft < 12 ? '1 year' : newMonthsLeft < 36 ? '3 years' : '5 years'} away now, so new money goes to a ${newInstrument.toLowerCase()}.`;
        }
        
        return {
          ...g,
          invested: newInvested,
          currentValue: newCurrentValue,
          monthsLeft: newMonthsLeft,
          instrument: newInstrument,
          stockPercent: newStockPercent,
          stocks: newStocks
        };
      });

      const monthStr = getSimulatedMonthStr(state.simulatedMonth + 1).split(' ')[0];
      const addedTotal = isFixed ? newGoals.reduce((s,g) => s + (g.status === 'active' ? g.monthlyAmount : 0), 0) : addedAmount;
      const totalVal = newGoals.reduce((s,g) => s + g.currentValue, 0);

      if (action.payload === 0 && action.split && action.split.length === 0) {
        // Skip month toast handled by S15
      } else if (!toasty) {
        toasty = `${monthStr}: +${formatMoney(addedTotal)} added, value now ${formatMoney(totalVal)}`;
      }

      return {
        ...state,
        simulatedMonth: state.simulatedMonth + 1,
        goals: newGoals,
        toast: toasty || state.toast
      };
    }
    case 'MOVE_MONEY': {
      const p = action.payload; // { fromId, toId, amount }
      return {
        ...state,
        goals: state.goals.map(g => {
          if (g.id === p.fromId) {
            const investedRatio = g.currentValue > 0 ? g.invested / g.currentValue : 0;
            const investedToRemove = p.amount * investedRatio;
            return { ...g, currentValue: g.currentValue - p.amount, invested: Math.max(0, g.invested - investedToRemove) };
          }
          if (g.id === p.toId) {
            return { ...g, currentValue: g.currentValue + p.amount, invested: g.invested + p.amount };
          }
          return g;
        })
      };
    }
    case 'WITHDRAW': {
      const p = action.payload; // { goalId, amount, isFull }
      return {
        ...state,
        goals: state.goals.map(g => {
          if (g.id !== p.goalId) return g;
          const investedRatio = g.currentValue > 0 ? g.invested / g.currentValue : 0;
          const investedToRemove = p.amount * investedRatio;
          const newCurrentValue = Math.max(0, g.currentValue - p.amount);
          return { 
            ...g, 
            currentValue: newCurrentValue, 
            invested: Math.max(0, g.invested - investedToRemove),
            status: p.isFull ? 'completed' : g.status 
          };
        })
      };
    }
    case 'USER_UPDATE':
      return { ...state, user: { ...state.user, ...action.payload } };
    case 'DELETE_GOAL':
      return { ...state, goals: state.goals.filter(g => g.id !== action.payload) };
    case 'SHOW_TOAST':
      return { ...state, toast: action.payload };
    case 'HIDE_TOAST':
      return { ...state, toast: null };
    case 'SHOW_GLOSSARY':
      return { ...state, activeGlossaryTerm: action.payload };
    case 'HIDE_GLOSSARY':
      return { ...state, activeGlossaryTerm: null };
    default:
      return state;
  }
}

// --- UTILS ---
const formatMoney = (amount) => {
  return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(amount);
};

// --- COMPONENTS C1 to C27 ---
const C1PhoneFrame = ({ children }) => (
  <div className="flex items-center justify-center h-screen bg-page-bg sm:py-6 overflow-hidden">
    <div className="relative w-full h-full sm:w-[390px] sm:h-[844px] sm:max-h-[92vh] bg-screen-bg sm:rounded-[40px] sm:border-[10px] border-[#111] overflow-hidden shadow-2xl flex flex-col">
      <div className="h-[44px] w-full flex items-center justify-between px-6 text-sm font-medium z-50 bg-screen-bg">
        <span>9:41</span>
        <div className="flex gap-1.5 items-center text-xs">
           <span className="font-bold tracking-widest">····</span>
           <span>wifi</span>
           <div className="w-6 h-3 rounded-sm border border-current p-[1px]"><div className="bg-current w-full h-full rounded-[1px]"></div></div>
        </div>
      </div>
      <div className="flex-1 overflow-y-auto no-scrollbar relative flex flex-col">
        {children}
      </div>
    </div>
  </div>
);

const C2TopBar = ({ title, showBack = false, onBack, rightIcon: RightIcon, onRightClick, backIcon: BackIcon = ChevronLeft }) => (
  <div className="h-[56px] flex items-center px-4 bg-screen-bg shrink-0">
    {showBack && <button onClick={onBack} className="p-2 -ml-2 text-text-1"><BackIcon size={24} /></button>}
    <h2 className="text-[18px] leading-[26px] font-semibold text-text-1 ml-2 flex-1">{title}</h2>
    {RightIcon && <button onClick={onRightClick} className="p-2 -mr-2 text-text-1"><RightIcon size={24} /></button>}
  </div>
);

const C3BottomNav = ({ activeTab, onTabChange }) => {
  const tabs = [
    { id: 'Home', icon: Home },
    { id: 'Goals', icon: Target },
    { id: 'Learn', icon: BookOpen },
    { id: 'Profile', icon: User },
  ];
  return (
    <div className="h-[64px] bg-white border-t border-border flex justify-around items-center shrink-0">
      {tabs.map(tab => {
        const active = activeTab === tab.id;
        const Icon = tab.icon;
        return (
          <button key={tab.id} onClick={() => onTabChange(tab.id)} className={`flex flex-col items-center gap-1 ${active ? 'text-primary-dark' : 'text-text-3'}`}>
            <Icon size={24} className={active ? 'fill-current' : ''} />
            <span className={`text-[11px] ${active ? 'font-semibold' : 'font-medium'}`}>{tab.id}</span>
          </button>
        );
      })}
    </div>
  );
};

const C4Button = ({ children, variant = 'primary', icon: Icon, disabled, onClick, className = '' }) => {
  const base = "h-[48px] rounded-button text-[15px] leading-[22px] font-semibold w-full flex items-center justify-center gap-2 transition-all active:scale-[0.98]";
  const variants = {
    primary: "bg-primary text-white active:bg-primary-pressed",
    secondary: "bg-white border-[1.5px] border-primary-dark text-primary-dark active:bg-primary-tint",
    ghost: "text-primary-dark active:bg-primary-tint",
    'danger-text': "text-loss active:bg-loss-tint",
  };
  return (
    <button disabled={disabled} onClick={onClick} className={`${base} ${variants[variant]} ${disabled ? 'opacity-40 pointer-events-none' : ''} ${className}`}>
      {Icon && <Icon size={18} />}
      {children}
    </button>
  );
};

const C5Chip = ({ variant, label, instrumentColor }) => {
  const styles = {
    instrument: `bg-card-bg border border-border text-text-1 shadow-sm`,
    'on-track': 'bg-primary-tint text-primary-dark',
    'slightly-behind': 'bg-warning-tint text-warning-dark',
    behind: 'bg-loss-tint text-loss',
    paused: 'bg-warning-tint text-warning-dark',
    locked: 'bg-[#F0F1F4] text-text-2',
    gain: 'bg-primary-tint text-primary-dark',
    loss: 'bg-loss-tint text-loss',
    completed: 'bg-primary text-white',
    mock: 'bg-[#F0F1F4] text-text-2'
  };

  const getIcon = () => {
    switch (variant) {
      case 'on-track': return <CheckCircle size={12} />;
      case 'slightly-behind':
      case 'behind': return <AlertCircle size={12} />;
      case 'paused': return <Pause size={12} />;
      case 'locked': return <Lock size={12} />;
      case 'gain': return <TrendingUp size={12} />;
      case 'loss': return <TrendingDown size={12} />;
      case 'completed': return <Trophy size={12} />;
      case 'instrument': return <div className="w-[8px] h-[8px] rounded-full" style={{ backgroundColor: instrumentColor }} />;
      default: return null;
    }
  };

  return (
    <div className={`h-[28px] px-[10px] rounded-chip flex items-center gap-1.5 text-[12px] font-semibold w-fit ${styles[variant] || styles.instrument}`}>
      {getIcon()}
      <span>{label}</span>
    </div>
  );
};

const C6Card = ({ children, className = '', onClick }) => (
  <div className={`bg-card-bg rounded-card shadow-card p-4 ${className}`} onClick={onClick}>
    {children}
  </div>
);

const C7MoneyText = ({ amount, size = 'body', className = '' }) => {
  const sizes = {
    display: 'text-[32px] md:text-[40px] font-bold tracking-tight',
    h2: 'text-[18px] md:text-[26px] font-semibold',
    body: 'text-[15px] md:text-[22px] font-regular',
  };
  return <span className={`tabular-nums ${sizes[size]} ${className}`}>{formatMoney(amount)}</span>;
};

const C8ProgressBar = ({ progress, paused = false }) => (
  <div className="w-full">
    <div className="text-right text-[13px] leading-[18px] text-text-2 mb-1">{progress}%</div>
    <div className="h-[8px] rounded-full border border-border bg-screen-bg overflow-hidden">
      <div className={`h-full rounded-full transition-all duration-600 ${paused ? 'bg-text-3' : 'bg-primary-dark'}`} style={{ width: `${Math.min(progress, 100)}%` }} />
    </div>
  </div>
);

const C9AllocationBar = ({ items }) => (
  <div className="w-full">
    <div className="flex h-[10px] rounded-full overflow-hidden mb-3 gap-[1px]">
      {items.map((item, i) => (
        <div key={i} className="h-full" style={{ width: `${item.percent}%`, backgroundColor: item.color }} />
      ))}
    </div>
    <div className="flex flex-col gap-1.5">
      {items.map((item, i) => (
        <div key={i} className="flex items-center text-[13px] leading-[18px] text-text-2">
          <div className="w-2 h-2 rounded-full mr-2 shrink-0" style={{ backgroundColor: item.color }} />
          <span className="flex-1 truncate pr-2">{item.label}</span>
          <span className="mr-3 shrink-0 w-[40px] text-right">{item.percent}%</span>
          <span className="tabular-nums font-medium text-text-1 shrink-0 w-[80px] text-right">{formatMoney(item.amount)}</span>
        </div>
      ))}
    </div>
  </div>
);

const C10GoalCard = ({ goal, onClick }) => {
  const cat = GOAL_CATEGORIES.find(c => c.id === goal.category) || GOAL_CATEGORIES[6];
  const Icon = cat.icon;
  const progress = Math.round((goal.currentValue / goal.targetAmount) * 100);
  const fv = getProjection(goal.currentValue, goal.monthlyAmount, goal.monthsLeft, goal.instrument, goal.stockPercent);
  const status = goal.status === 'paused' ? 'paused' : goal.status === 'completed' ? 'completed' : getStatus(fv, goal.targetAmount);
  
  const statusLabels = {
    'paused': 'Paused',
    'completed': 'Completed',
    'on-track': 'On track',
    'slightly-behind': 'Slightly behind',
    'behind': 'Behind'
  };

  return (
    <div onClick={onClick}>
      <C6Card className="flex flex-col gap-3 active:scale-[0.98] transition-transform cursor-pointer">
        <div className="flex items-start gap-3">
          <div className="w-[44px] h-[44px] rounded-full flex items-center justify-center shrink-0" style={{ backgroundColor: cat.bg, color: cat.color }}>
            <Icon size={24} />
          </div>
          <div className="flex-1">
            <div className="text-[15px] font-semibold text-text-1">{goal.name}</div>
            <div className="text-[13px] text-text-2">
              {formatMoney(goal.currentValue)} of {formatMoney(goal.targetAmount)}
            </div>
          </div>
          <div className="text-[13px] text-text-2 text-right">
            {formatMoney(goal.monthlyAmount)}/mo
          </div>
        </div>
        <div className={goal.status === 'paused' ? 'opacity-70' : ''}>
          <C8ProgressBar progress={progress} paused={goal.status === 'paused'} />
        </div>
        <div className="flex gap-2 mt-1 flex-wrap">
          <C5Chip variant="instrument" instrumentColor={goal.instrument === 'Liquid fund' ? '#5B8DEF' : goal.instrument === 'Hybrid fund' ? '#F5A623' : '#00D09C'} label={goal.instrument} />
          <C5Chip variant={status} label={statusLabels[status]} />
          {goal.currentValue < goal.invested && (
            <C5Chip variant="loss" label={`-${formatMoney(goal.invested - goal.currentValue)}`} />
          )}
        </div>
      </C6Card>
    </div>
  );
};

const C11AmountInput = ({ value, onChange, max, useSuggestion, onUseSuggestion }) => (
  <div className="flex flex-col items-center w-full">
    <input 
      type="text" 
      value={formatMoney(value).replace('₹','').trim()} 
      onChange={(e) => onChange(e.target.value.replace(/[^0-9]/g, ''))}
      className="text-[32px] md:text-[40px] font-bold text-center tabular-nums w-full bg-transparent outline-none text-text-1" 
    />
    <div className="flex flex-wrap justify-center gap-2 mt-4">
      {['+₹100', '+₹500', '+₹1,000'].map(p => (
        <button key={p} onClick={() => onChange(value + parseInt(p.replace(/[^0-9]/g, '')))} className="px-3 py-1 bg-screen-bg text-text-1 text-[13px] rounded-chip font-medium border border-border shadow-sm">
          {p}
        </button>
      ))}
      {max !== undefined && max !== false && <button onClick={() => onChange(max)} className="px-3 py-1 bg-screen-bg text-text-1 text-[13px] rounded-chip font-medium border border-border shadow-sm">Max</button>}
      {useSuggestion !== undefined && <button onClick={onUseSuggestion} className="px-3 py-1 bg-primary-tint text-primary border border-primary text-[13px] rounded-chip font-medium shadow-sm">Use {formatMoney(useSuggestion)}</button>}
    </div>
  </div>
);

const C12Slider = ({ value, min, max, step = 1, onChange, disabled }) => (
  <div className="w-full relative py-4">
    <input 
      type="range" 
      min={min} max={max} step={step} value={value} onChange={e => onChange(e.target.value)}
      disabled={disabled}
      className={`w-full accent-primary h-[6px] rounded-full appearance-none outline-none ${disabled ? 'bg-border opacity-50' : 'bg-border'}`} 
    />
  </div>
);

const C13SegmentedControl = ({ options, selected, onChange }) => (
  <div className="flex p-1 bg-screen-bg rounded-chip border border-border">
    {options.map(opt => (
      <button 
        key={opt} 
        onClick={() => onChange(opt)}
        className={`flex-1 py-1.5 text-[13px] font-medium rounded-chip transition-all ${selected === opt ? 'bg-white text-text-1 shadow-sm border border-border' : 'text-text-2 border border-transparent'}`}
      >
        {opt}
      </button>
    ))}
  </div>
);

const C15BottomSheet = ({ isOpen, onClose, title, children, cta }) => {
  if (!isOpen) return null;
  return (
    <div className="absolute inset-0 bg-black/40 z-50 flex flex-col justify-end">
      <div className="bg-white w-full max-h-[90%] rounded-t-sheet flex flex-col shadow-sheet">
        <div className="w-full flex justify-center pt-3 pb-1">
          <div className="w-[36px] h-[4px] bg-border rounded-full" />
        </div>
        <div className="px-6 pb-2 flex justify-between items-center">
          <h2 className="text-[18px] font-semibold text-text-1">{title}</h2>
          <button onClick={onClose} className="text-text-2 p-1 bg-screen-bg rounded-full">X</button>
        </div>
        <div className="flex-1 overflow-y-auto no-scrollbar px-6 py-4">
          {children}
        </div>
        {cta && <div className="p-4 border-t border-border">{cta}</div>}
      </div>
    </div>
  );
};

const C16Toast = ({ message }) => (
  <div className="absolute bottom-20 left-4 right-4 bg-toast-bg text-white px-4 py-3 rounded-button text-[14px] font-medium flex items-center gap-2 shadow-lg animate-fade-in-up">
    <CheckCircle size={18} className="text-primary" />
    <span>{message}</span>
  </div>
);

const C17JargonTip = ({ term, dispatch }) => {
  if (!term || !dispatch) return null;
  return (
    <button onClick={(e) => { e.stopPropagation(); dispatch({ type: 'SHOW_GLOSSARY', payload: term }); }} className="inline-flex items-center text-text-2 ml-1 align-middle hover:text-primary transition-colors">
      <HelpCircle size={14} />
    </button>
  );
};

const C18LockedRow = ({ onUnlock }) => (
  <div className="bg-screen-bg rounded-button p-4 flex flex-col items-center text-center gap-2 border border-border">
    <Lock size={20} className="text-text-2" />
    <span className="text-[13px] text-text-1 font-medium">Complete 'How to look at a stock' to unlock</span>
    <C4Button variant="ghost" onClick={onUnlock} className="h-auto py-1 text-[13px]">Go to Learn</C4Button>
  </div>
);

const C19EmptyState = ({ title, caption, buttonLabel, onAction }) => (
  <div className="flex flex-col items-center text-center py-12 px-4">
    <div className="w-[64px] h-[64px] bg-primary-tint text-primary-dark rounded-full flex items-center justify-center mb-4">
      <Target size={32} />
    </div>
    <h2 className="text-[18px] font-semibold text-text-1 mb-1">{title}</h2>
    <p className="text-[13px] text-text-2 mb-6">{caption}</p>
    {buttonLabel && <C4Button onClick={onAction} className="w-auto px-6">{buttonLabel}</C4Button>}
  </div>
);

const C20SelectCard = ({ icon: Icon, label, selected, onClick, badge }) => (
  <button 
    onClick={onClick}
    className={`bg-white border rounded-card p-4 flex flex-col items-start gap-3 transition-all relative active:scale-[0.98]
    ${selected ? 'border-primary-dark bg-primary-tint shadow-sm' : 'border-border shadow-card'}`}
  >
    <div className="w-[40px] h-[40px] bg-screen-bg border border-border rounded-full flex items-center justify-center text-text-1">
      <Icon size={20} />
    </div>
    <span className="text-[15px] font-semibold text-text-1">{label}</span>
    {selected && <div className="absolute top-4 right-4 text-primary-dark"><CheckCircle size={18} /></div>}
    {badge && <div className="absolute top-[-10px] right-2 bg-primary-dark text-white text-[10px] uppercase tracking-wider font-bold px-2 py-0.5 rounded-full shadow-sm">{badge}</div>}
  </button>
);

const C21LearnCard = ({ step, title, body, onNext, onBack }) => (
  <C6Card className="flex flex-col h-full border border-border">
    <div className="flex gap-1 mb-6">
      {[1,2,3,4,5].map(i => <div key={i} className={`h-1.5 flex-1 rounded-full ${i <= step ? 'bg-primary-dark' : 'bg-border'}`} />)}
    </div>
    <div className="w-[48px] h-[48px] bg-screen-bg border border-border rounded-full flex items-center justify-center mb-6 text-text-1">
      <TrendingUp size={24} />
    </div>
    <h1 className="text-[24px] font-bold text-text-1 mb-4 leading-tight">{title}</h1>
    <div className="text-[15px] text-text-1 leading-relaxed flex-1 whitespace-pre-wrap">{body}</div>
    <div className="flex gap-3 mt-8">
      {onBack && <C4Button variant="ghost" onClick={onBack} className="flex-1">Back</C4Button>}
      <C4Button onClick={onNext} className="flex-[2]">Next</C4Button>
    </div>
  </C6Card>
);

const C22QuizOption = ({ label, selected, status = 'none', onClick, explanation }) => {
  let border = "border-border";
  let bg = "bg-white";
  let icon = null;

  if (status === 'correct') {
    border = "border-primary";
    bg = "bg-primary-tint";
    icon = <CheckCircle size={18} className="text-primary shrink-0" />;
  } else if (status === 'wrong') {
    border = "border-loss";
    bg = "bg-loss-tint";
    icon = <div className="text-loss font-bold shrink-0">✕</div>;
  } else if (selected) {
    border = "border-text-1";
  }

  return (
    <button onClick={onClick} className={`border rounded-card p-4 transition-all text-left flex flex-col w-full ${border} ${bg} shadow-card`} disabled={status !== 'none'}>
      <div className="flex items-start gap-3">
        <div className={`w-[20px] h-[20px] rounded-full border flex items-center justify-center shrink-0 mt-0.5 ${selected || status !== 'none' ? 'border-transparent' : 'border-text-3'}`}>
          {status === 'none' && selected && <div className="w-[10px] h-[10px] rounded-full bg-text-1" />}
          {icon}
        </div>
        <span className="text-[15px] font-medium text-text-1 flex-1">{label}</span>
      </div>
      {status !== 'none' && explanation && (
        <div className="text-[13px] text-text-2 mt-2 ml-8">{explanation}</div>
      )}
    </button>
  );
};

const C23InfoBanner = ({ text, warning = false }) => (
  <div className={`rounded-button p-3 flex items-start gap-2 ${warning ? 'bg-warning-tint text-warning-dark' : 'bg-primary-tint text-primary-dark'}`}>
    {warning ? <AlertCircle size={16} className="mt-0.5 shrink-0" /> : <Shield size={16} className="mt-0.5 shrink-0" />}
    <span className="text-[13px] font-medium flex-1">{text}</span>
  </div>
);


const C27ProjectionCard = ({ target, value, monthlyAmount, monthStr, savingsValue }) => (
  <C6Card className="bg-screen-bg border border-border shadow-none">
    <div className="text-[13px] text-text-1 mb-3">
      At <strong>{formatMoney(monthlyAmount)}/month</strong>, you'll have <strong>{formatMoney(value)}</strong> by {monthStr}
    </div>
    <C8ProgressBar progress={Math.round((value / target) * 100)} />
    <div className="mt-4 pt-3 border-t border-border flex flex-col gap-1 text-[13px] text-text-2">
      <span>Same money in a savings account: {formatMoney(savingsValue)}</span>
      <span className="text-[11px]">Illustrative: savings 3% a year vs this plan's assumed rate.</span>
    </div>
  </C6Card>
);

// --- SCREENS ---
const S0Launch = ({ dispatch }) => (
  <div className="flex flex-col h-full p-5 pt-20">
    <div className="flex-1 flex flex-col items-center text-center justify-center">
      <div className="w-[80px] h-[80px] bg-primary-tint rounded-full flex items-center justify-center text-primary-dark mb-8 border border-primary-tint shadow-sm">
        <PiggyBank size={40} />
      </div>
      <h1 className="text-[24px] md:text-[32px] font-bold text-text-1 mb-3 leading-tight">Invest for the things you want</h1>
      <p className="text-[15px] text-text-2">Goals first. Jargon later.</p>
    </div>
    <div className="flex flex-col gap-3 pb-6">
      <C4Button onClick={() => dispatch({ type: 'NAVIGATE', payload: 'Onboarding' })}>Start fresh</C4Button>
      <C4Button variant="secondary" onClick={() => dispatch({ type: 'EXPLORE_DEMO' })}>Explore demo account</C4Button>
      <p className="text-[11px] text-text-2 text-center uppercase tracking-wider font-medium mt-2">Prototype · mock data · no real money</p>
    </div>
  </div>
);

const S1Name = ({ data, updateData, onNext }) => (
  <div className="flex flex-col h-full justify-between">
    <div className="flex flex-col gap-6">
      <h1 className="text-[24px] md:text-[32px] font-bold text-text-1 leading-tight">What should we call you?</h1>
      <input 
        type="text" 
        value={data.name} 
        onChange={e => updateData({ name: e.target.value })} 
        className="h-[52px] w-full border-b-2 border-border text-[24px] font-medium outline-none focus:border-primary text-text-1 bg-transparent placeholder-text-3 transition-colors" 
        placeholder="Your name" 
        autoFocus
      />
    </div>
    <C4Button onClick={onNext} disabled={data.name.length < 2}>Continue</C4Button>
  </div>
);

const S2Income = ({ data, updateData, onNext }) => {
  const options = [
    { id: 'Salaried', icon: Briefcase },
    { id: 'Student', icon: GraduationCap },
    { id: 'Part-time', icon: Clock },
    { id: 'Freelance', icon: Laptop }
  ];
  return (
    <div className="flex flex-col h-full justify-between">
      <div className="flex flex-col gap-8">
        <h1 className="text-[24px] md:text-[32px] font-bold text-text-1 leading-tight">What's your situation?</h1>
        <div className="grid grid-cols-2 gap-4">
          {options.map(o => (
            <C20SelectCard 
              key={o.id} icon={o.icon} label={o.id} 
              selected={data.incomeType === o.id} 
              onClick={() => updateData({ incomeType: o.id, mode: o.id === 'Salaried' ? 'fixed' : 'flexible' })} 
            />
          ))}
        </div>
      </div>
      <C4Button onClick={onNext} disabled={!data.incomeType}>Continue</C4Button>
    </div>
  );
};

const S3Budget = ({ data, updateData, onNext }) => {
  return (
    <div className="flex flex-col h-full justify-between pb-6">
      <div className="flex flex-col gap-8">
        <h1 className="text-[24px] md:text-[32px] font-bold text-text-1 leading-tight">How much can you invest each month?</h1>
        
        <div>
          <C11AmountInput value={data.budget} onChange={v => updateData({ budget: Math.min(50000, Math.max(0, parseInt(v) || 0)) })} />
          <C12Slider value={data.budget} min={100} max={50000} step={100} onChange={v => updateData({ budget: parseInt(v) })} />
        </div>

        <C13SegmentedControl 
          options={['Fixed monthly (SIP)', 'Whatever I can']} 
          selected={data.mode === 'fixed' ? 'Fixed monthly (SIP)' : 'Whatever I can'} 
          onChange={v => updateData({ mode: v === 'Fixed monthly (SIP)' ? 'fixed' : 'flexible' })} 
        />

        {data.incomeType !== 'Salaried' && (
          <C23InfoBanner text="Income not fixed? We'll ask you each month how much you can invest." />
        )}
        <p className="text-[13px] text-text-2 text-center">This is your total. You'll split it across goals next.</p>
      </div>
      <C4Button onClick={onNext} disabled={data.budget < 100}>Continue</C4Button>
    </div>
  );
};

const GoalFormFields = ({ data, updateData, budget, showBudgetWarning, dispatch }) => {
  const months = data.timelineType === 'Years' ? data.timeline * 12 : data.timeline;
  const instrument = getInstrument(data.categoryId, months);
  const reason = getReason(data.categoryId, months, data.goalName);
  const reqMonthly = getRequiredMonthly(data.target, data.currentValue || 0, months, instrument, data.stockPercent || 0);
  const fv = getProjection(data.currentValue || 0, data.monthlyAmount, months, instrument, data.stockPercent || 0);
  const savFv = getSavingsProjection(data.currentValue || 0, data.monthlyAmount, months);

  const budgetErr = showBudgetWarning && data.monthlyAmount > budget;

  return (
    <div className="flex flex-col gap-6 pb-6">
      <div className="grid grid-cols-2 gap-3">
        {GOAL_CATEGORIES.map(c => (
          <C20SelectCard 
            key={c.id} icon={c.icon} label={c.label} 
            selected={data.categoryId === c.id} 
            onClick={() => updateData({ categoryId: c.id, goalName: c.label })}
            badge={c.id === 'emergency' ? 'Most people start here' : null} 
          />
        ))}
      </div>

      <div>
        <label className="text-[14px] font-medium text-text-1 mb-2 block">Goal name</label>
        <input type="text" value={data.goalName} onChange={e => updateData({ goalName: e.target.value })} className="w-full bg-white border border-border rounded-input px-4 h-[52px] text-[15px] font-medium outline-none focus:border-primary shadow-sm" />
      </div>

      <div>
        <label className="text-[14px] font-medium text-text-1 mb-2 block">Target amount</label>
        <C11AmountInput value={data.target} onChange={v => updateData({ target: parseInt(v) || 0 })} max={false} />
        {(data.target < 1000 || data.target > 10000000) && <p className="text-[13px] text-loss text-center mt-2">Target must be between ₹1,000 and ₹1,00,00,000</p>}
      </div>

      <div>
        <label className="text-[14px] font-medium text-text-1 mb-2 block">Timeline</label>
        <C13SegmentedControl options={['Months', 'Years']} selected={data.timelineType} onChange={v => updateData({ timelineType: v, timeline: v === 'Years' ? Math.max(1, Math.floor(data.timeline/12)) : Math.max(1, data.timeline) })} />
        <C12Slider value={data.timeline} min={1} max={data.timelineType === 'Years' ? 15 : 180} onChange={v => updateData({ timeline: parseInt(v) })} />
        <div className="text-center text-[15px] font-semibold text-text-1 mt-[-10px]">{data.timeline} {data.timelineType}</div>
        {(months < 1 || months > 180) && <p className="text-[13px] text-loss text-center mt-2">Timeline must be 1-180 months</p>}
      </div>

      <div>
        <label className="text-[14px] font-medium text-text-1 mb-2 block">Monthly amount</label>
        <C11AmountInput value={data.monthlyAmount} onChange={v => updateData({ monthlyAmount: parseInt(v) || 0 })} max={budget} useSuggestion={reqMonthly} onUseSuggestion={() => updateData({ monthlyAmount: reqMonthly })} />
        {budgetErr && <p className="text-[13px] text-loss text-center mt-2">Cannot exceed monthly budget ({formatMoney(budget)})</p>}
        {(data.monthlyAmount < 100) && <p className="text-[13px] text-loss text-center mt-2">Minimum investment is ₹100</p>}
      </div>

      <C6Card className="border border-border">
        <h2 className="text-[18px] font-semibold text-text-1 mb-4">Here's how we'll invest it</h2>
        <div className="flex gap-2 mb-3">
           <C5Chip variant="instrument" instrumentColor={instrument === 'Liquid fund' ? '#5B8DEF' : instrument === 'Hybrid fund' ? '#F5A623' : '#00D09C'} label={instrument} />
           <C17JargonTip term={instrument} dispatch={dispatch} />
        </div>
        <p className="text-[13px] text-text-2 mb-4 leading-relaxed">{reason}</p>
        <C9AllocationBar items={[{ label: instrument, percent: 100, amount: data.monthlyAmount, color: instrument === 'Liquid fund' ? '#5B8DEF' : instrument === 'Hybrid fund' ? '#F5A623' : '#00D09C' }]} />
      </C6Card>

      <C27ProjectionCard target={data.target} value={fv} monthlyAmount={data.monthlyAmount} monthStr={`${months} months`} savingsValue={savFv} />
    </div>
  );
};

const S4FirstGoal = ({ data, updateData, onCreate, dispatch }) => {
  const months = data.timelineType === 'Years' ? data.timeline * 12 : data.timeline;
  const valid = data.monthlyAmount <= data.budget && data.target >= 1000 && data.target <= 10000000 && months >= 1 && months <= 180 && data.monthlyAmount >= 100;

  return (
    <div className="flex flex-col gap-8 pb-8">
      <h1 className="text-[24px] font-bold text-text-1">What are you saving for?</h1>
      <GoalFormFields data={data} updateData={updateData} budget={data.budget} showBudgetWarning={true} dispatch={dispatch} />
      <C4Button onClick={onCreate} disabled={!valid}>Create my goal</C4Button>
    </div>
  );
};

const Onboarding = ({ dispatch }) => {
  const [step, setStep] = useState(1);
  const [data, setData] = useState({
    name: '',
    incomeType: '',
    budget: 8000,
    mode: 'fixed',
    categoryId: 'emergency',
    goalName: 'Emergency fund',
    target: 45000,
    timeline: 10,
    timelineType: 'Months',
    monthlyAmount: 8000
  });

  const updateData = (updates) => setData(d => ({ ...d, ...updates }));
  const next = () => setStep(s => s + 1);
  const back = () => setStep(s => s > 1 ? s - 1 : 1);

  const renderStep = () => {
    switch(step) {
      case 1: return <S1Name data={data} updateData={updateData} onNext={next} />;
      case 2: return <S2Income data={data} updateData={updateData} onNext={next} />;
      case 3: return <S3Budget data={data} updateData={updateData} onNext={next} />;
      case 4: return <S4FirstGoal data={data} updateData={updateData} onCreate={() => dispatch({ type: 'COMPLETE_ONBOARDING', payload: data })} dispatch={dispatch} />;
      default: return null;
    }
  };

  return (
    <div className="flex flex-col h-full bg-page-bg">
      <div className="flex items-center p-4 gap-4 bg-screen-bg shrink-0">
        <button onClick={() => step > 1 ? back() : dispatch({ type: 'NAVIGATE', payload: 'S0' })} className="text-text-1 p-2 -ml-2">
          <ChevronLeft size={24} />
        </button>
        <div className="flex flex-1 gap-2">
          {[1,2,3,4].map(i => (
            <div key={i} className={`h-1.5 flex-1 rounded-full ${i <= step ? 'bg-primary' : 'bg-border'}`} />
          ))}
        </div>
      </div>
      <div className="flex-1 overflow-y-auto no-scrollbar px-5 py-6">
        {renderStep()}
      </div>
    </div>
  );
};

const S8CreateEditGoal = ({ isOpen, onClose, initialData, mode = 'create', state, dispatch }) => {
  if (!isOpen) return null;
  const isEdit = mode === 'edit';
  const [data, setData] = useState(initialData || {
    categoryId: 'emergency',
    goalName: 'Emergency fund',
    target: 45000,
    timeline: 10,
    timelineType: 'Months',
    monthlyAmount: state?.user?.monthlyBudget || 0,
    currentValue: 0,
    stockPercent: 0
  });

  const updateData = (updates) => setData(d => ({ ...d, ...updates }));
  const months = data.timelineType === 'Years' ? data.timeline * 12 : data.timeline;
  
  const budgetInfo = getBudgetCheck(state?.goals || [], state?.user?.monthlyBudget || 0, data.monthlyAmount, isEdit ? initialData?.id : null);
  const budgetErr = budgetInfo.over;
  const valid = data.target >= 1000 && data.target <= 10000000 && months >= 1 && months <= 180 && data.monthlyAmount >= 100;

  const handleSave = () => {
    const newInstrument = getInstrument(data.categoryId, months);
    if (isEdit) {
      if (initialData.instrument !== newInstrument) {
        if (!window.confirm(`From now on, money for this goal goes into ${newInstrument}.`)) return;
      }
      dispatch({ type: 'UPDATE_GOAL', payload: { id: initialData.id, name: data.goalName, category: data.categoryId, targetAmount: data.target, monthsLeft: months, monthlyAmount: data.monthlyAmount, instrument: newInstrument } });
      dispatch({ type: 'SHOW_TOAST', payload: 'Changes saved' });
    } else {
      const newGoal = {
        id: 'g_' + Date.now(),
        category: data.categoryId,
        name: data.goalName,
        targetAmount: data.target,
        monthsLeft: months,
        monthlyAmount: data.monthlyAmount,
        status: 'active',
        invested: 0,
        currentValue: 0,
        instrument: newInstrument,
        stockPercent: 0,
        stocks: []
      };
      dispatch({ type: 'CREATE_GOAL', payload: newGoal });
      dispatch({ type: 'SHOW_TOAST', payload: `${data.goalName} goal created` });
    }
    onClose();
  };

  return (
    <C15BottomSheet isOpen={isOpen} onClose={onClose} title={isEdit ? "Edit goal" : "Create goal"}
      cta={<C4Button onClick={handleSave} disabled={!valid}>{isEdit ? "Save changes" : "Create goal"}</C4Button>}>
      <GoalFormFields data={data} updateData={updateData} budget={state?.user?.monthlyBudget || 0} showBudgetWarning={true} dispatch={dispatch} />
      {budgetErr && <p className="text-[13px] text-loss text-center mt-2">You're planning more than your budget.</p>}
    </C15BottomSheet>
  );
};

const S13ChangeAmountSheet = ({ isOpen, onClose, goal, state, dispatch }) => {
  if (!goal) return null;
  const [val, setVal] = useState(goal.monthlyAmount);
  const req = getRequiredMonthly(goal.targetAmount, goal.currentValue, goal.monthsLeft, goal.instrument, goal.stockPercent);
  const budgetInfo = getBudgetCheck(state.goals, state.user?.monthlyBudget || 0, val, goal.id);

  const handleSave = () => {
    dispatch({ type: 'UPDATE_GOAL', payload: { id: goal.id, monthlyAmount: val } });
    onClose();
  };

  return (
    <C15BottomSheet isOpen={isOpen} onClose={onClose} title="Change monthly amount" 
      cta={<C4Button onClick={handleSave} disabled={val < 100}>Save</C4Button>}>
      <C11AmountInput value={val} onChange={v => setVal(parseInt(v) || 0)} useSuggestion={req} onUseSuggestion={() => setVal(req)} />
      <div className={`mt-6 text-center text-[13px] font-medium ${budgetInfo.over ? 'text-loss' : 'text-text-2'}`}>
        {formatMoney(budgetInfo.used)} of {formatMoney(state.user?.monthlyBudget || 0)} budget planned
      </div>
      {budgetInfo.over && <p className="text-[13px] text-loss text-center mt-2">You're planning more than your budget.</p>}
      {val < 100 && <p className="text-[13px] text-loss text-center mt-2">Minimum investment is ₹100</p>}
    </C15BottomSheet>
  );
};

const S7GoalDetail = ({ state, dispatch, goalId }) => {
  const goal = state.goals.find(g => g.id === goalId);
  const [showAmountSheet, setShowAmountSheet] = useState(false);
  const [showEditSheet, setShowEditSheet] = useState(false);
  const [showMoveMoney, setShowMoveMoney] = useState(false);
  const [showWithdraw, setShowWithdraw] = useState(false);

  if (!goal) return <div className="p-8 text-center">Goal not found</div>;

  const cat = GOAL_CATEGORIES.find(c => c.id === goal.category) || GOAL_CATEGORIES[6];
  const Icon = cat.icon;
  const progress = Math.round((goal.currentValue / goal.targetAmount) * 100);
  const reqMonthly = getRequiredMonthly(goal.targetAmount, goal.currentValue, goal.monthsLeft, goal.instrument, goal.stockPercent);
  const reason = getReason(goal.category, goal.monthsLeft, goal.name);
  const fv = getProjection(goal.currentValue, goal.monthlyAmount, goal.monthsLeft, goal.instrument, goal.stockPercent);
  const savFv = getSavingsProjection(goal.currentValue, goal.monthlyAmount, goal.monthsLeft);

  const isCompleted = goal.currentValue >= goal.targetAmount;

  return (
    <div className="flex flex-col h-full bg-page-bg">
      <C2TopBar title={goal.name} showBack onBack={() => dispatch({ type: 'NAVIGATE', payload: 'Goals' })} rightIcon={Pencil} onRightClick={() => setShowEditSheet(true)} />
      <div className="flex-1 overflow-y-auto no-scrollbar px-4 py-6 flex flex-col gap-10">
        
        {/* Hero */}
        <div className="flex flex-col items-center text-center gap-2">
          <div className="w-[56px] h-[56px] rounded-full flex items-center justify-center mb-2 shadow-sm border border-border" style={{ backgroundColor: cat.bg, color: cat.color }}>
            <Icon size={32} />
          </div>
          <C7MoneyText amount={goal.currentValue} size="h2" />
          <p className="text-[13px] text-text-2">of {formatMoney(goal.targetAmount)} target</p>
          <div className="w-full max-w-[240px] mt-2 mb-2">
            <C8ProgressBar progress={progress} paused={goal.status === 'paused'} />
          </div>
          <div className="flex items-center gap-2 mt-1 flex-wrap justify-center">
            <C5Chip variant={goal.status === 'paused' ? 'paused' : goal.status === 'completed' ? 'completed' : getStatus(fv, goal.targetAmount)} label={goal.status === 'paused' ? 'Paused' : goal.status === 'completed' ? 'Completed' : getStatus(fv, goal.targetAmount).replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())} />
            {goal.currentValue < goal.invested && (
              <C5Chip variant="loss" label={`-${formatMoney(goal.invested - goal.currentValue)}`} />
            )}
            <span className="text-[13px] text-text-2 font-medium">{goal.monthsLeft} months left</span>
          </div>
        </div>

        {isCompleted && (
          <div className="flex flex-col gap-3">
            <C23InfoBanner text="You did it! 🎉" />
            <C4Button onClick={() => setShowWithdraw(true)}>Withdraw and complete</C4Button>
          </div>
        )}

        {/* Monthly amount */}
        <section className={`flex flex-col gap-4 ${goal.status === 'paused' ? 'opacity-70 pointer-events-none' : ''}`}>
          <h2 className="text-[18px] font-semibold text-text-1">Monthly amount</h2>
          <div className="flex justify-between items-end border border-border bg-white rounded-card p-4 shadow-sm">
            <div>
              <C7MoneyText amount={goal.monthlyAmount} size="h2" />
              <span className="text-[15px] text-text-2 font-medium">/mo</span>
            </div>
            <p className="text-[13px] text-text-2 font-medium text-right max-w-[120px] leading-tight">Needs {formatMoney(reqMonthly)}/mo to reach on time</p>
          </div>
          <div className="flex gap-3">
            <C4Button variant="secondary" onClick={() => setShowAmountSheet(true)} className="flex-1 text-[14px]">Edit</C4Button>
            <C4Button variant="ghost" onClick={() => dispatch({ type: 'UPDATE_GOAL', payload: { id: goal.id, monthlyAmount: reqMonthly } })} className="flex-1 text-[14px] bg-white border border-border shadow-sm">Match Target</C4Button>
          </div>
        </section>

        <C27ProjectionCard target={goal.targetAmount} value={fv} monthlyAmount={goal.monthlyAmount} monthStr={`${goal.monthsLeft} months`} savingsValue={savFv} />

        {/* How it's invested */}
        <section className={`flex flex-col gap-6 ${goal.status === 'paused' ? 'opacity-70' : ''}`}>
          <div className="flex flex-col gap-4">
            <h2 className="text-[18px] font-semibold text-text-1">How it's invested</h2>
            <div className="flex items-center gap-2">
              <C5Chip variant="instrument" instrumentColor={goal.instrument === 'Liquid fund' ? '#5B8DEF' : goal.instrument === 'Hybrid fund' ? '#F5A623' : '#00D09C'} label={goal.instrument} />
              <C17JargonTip term={goal.instrument} dispatch={dispatch} />
            </div>
            <C23InfoBanner text={reason} />
            <C9AllocationBar items={[{ label: goal.instrument, percent: 100, amount: goal.currentValue, color: goal.instrument === 'Liquid fund' ? '#5B8DEF' : goal.instrument === 'Hybrid fund' ? '#F5A623' : '#00D09C' }]} />
          </div>

          {goal.monthsLeft >= 60 && (
            <C6Card className="mt-2 border border-border shadow-sm bg-white">
              {!state.user?.stockUnlocked ? (
                <C18LockedRow onUnlock={() => dispatch({ type: 'NAVIGATE', payload: 'Learn' })} />
              ) : (
                <div className="flex flex-col gap-4">
                  <h3 className="text-[15px] font-semibold text-text-1">Stock allocation</h3>
                  <div className="flex items-center gap-3">
                    <span className="text-[15px] font-semibold w-12">{goal.stockPercent}%</span>
                    <C12Slider value={goal.stockPercent} min={0} max={25} onChange={v => dispatch({ type: 'UPDATE_GOAL', payload: { id: goal.id, stockPercent: parseInt(v) } })} disabled={goal.stocks.length === 0} />
                  </div>
                  <p className="text-[13px] text-text-2 font-medium">{goal.stocks.length === 0 ? 'Choose at least 1 stock to allocate.' : `Split equally across ${goal.stocks.length} stocks`}</p>
                  
                  <div className="flex flex-col gap-2 mt-2">
                    {goal.stocks.map(sid => {
                      const c = MOCK_COMPANIES.find(x => x.id === sid);
                      if(!c) return null;
                      return (
                        <div key={sid} className="flex items-center justify-between bg-screen-bg border border-border p-3 rounded-card">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-primary-tint text-primary-dark flex items-center justify-center font-bold">{c.name[0]}</div>
                            <span className="text-[15px] font-semibold text-text-1">{c.name}</span>
                          </div>
                          <button onClick={() => {
                            const newStocks = goal.stocks.filter(s => s !== sid);
                            dispatch({ type: 'UPDATE_GOAL', payload: { id: goal.id, stocks: newStocks, stockPercent: newStocks.length === 0 ? 0 : goal.stockPercent } });
                          }} className="text-text-2 p-1 hover:text-loss transition-colors"><Trash2 size={16} /></button>
                        </div>
                      )
                    })}
                  </div>
                  <C4Button variant="secondary" onClick={() => dispatch({ type: 'NAVIGATE', payload: 'S17', addToGoalId: goal.id })} disabled={goal.stocks.length >= 5} className="mt-2">Choose stocks</C4Button>
                </div>
              )}
            </C6Card>
          )}
        </section>

        {/* Actions */}
        <section className="flex flex-col bg-white rounded-card border border-border shadow-sm overflow-hidden">
          {[
            { label: goal.status === 'paused' ? 'Resume goal' : 'Pause goal', icon: goal.status === 'paused' ? Play : Pause, action: () => dispatch({ type: 'UPDATE_GOAL', payload: { id: goal.id, status: goal.status === 'paused' ? 'active' : 'paused' } }) },
            { label: 'Move money', icon: ArrowLeftRight, action: () => setShowMoveMoney(true) },
            { label: 'Withdraw', icon: ArrowDownToLine, action: () => setShowWithdraw(true) },
            { label: 'Delete goal', icon: Trash2, action: () => { if (window.confirm("Its money will be withdrawn.")) { dispatch({ type: 'DELETE_GOAL', payload: goal.id }); dispatch({ type: 'NAVIGATE', payload: 'Goals' }); } }, danger: true },
          ].map((a, i) => (
            <button key={i} onClick={a.action} className={`flex items-center justify-between py-4 px-4 border-b border-border last:border-0 active:bg-screen-bg transition-colors ${a.danger ? 'text-loss' : 'text-text-1'}`}>
              <div className="flex items-center gap-3">
                <a.icon size={20} className={a.danger ? 'text-loss' : 'text-text-2'} />
                <span className="text-[15px] font-medium">{a.label}</span>
              </div>
              <ChevronLeft size={20} className="rotate-180 text-text-3" />
            </button>
          ))}
        </section>

        <C23InfoBanner text="Goals are labels on one portfolio. Pausing or moving money doesn't sell anything." />
      </div>

      <S13ChangeAmountSheet isOpen={showAmountSheet} onClose={() => setShowAmountSheet(false)} goal={goal} state={state} dispatch={dispatch} />
      <S10MoveMoney isOpen={showMoveMoney} onClose={() => setShowMoveMoney(false)} goal={goal} state={state} dispatch={dispatch} />
      <S14Withdraw isOpen={showWithdraw} onClose={() => setShowWithdraw(false)} goal={goal} dispatch={dispatch} />
      {showEditSheet && (
        <S8CreateEditGoal 
          isOpen={showEditSheet} 
          onClose={() => setShowEditSheet(false)} 
          initialData={{
            id: goal.id,
            categoryId: goal.category,
            goalName: goal.name,
            target: goal.targetAmount,
            timeline: goal.monthsLeft >= 12 && goal.monthsLeft % 12 === 0 ? goal.monthsLeft / 12 : goal.monthsLeft,
            timelineType: goal.monthsLeft >= 12 && goal.monthsLeft % 12 === 0 ? 'Years' : 'Months',
            monthlyAmount: goal.monthlyAmount,
            currentValue: goal.currentValue,
            stockPercent: goal.stockPercent,
            instrument: goal.instrument
          }}
          mode="edit" 
          state={state} 
          dispatch={dispatch} 
        />
      )}
    </div>
  );
};

const S10MoveMoney = ({ isOpen, onClose, goal, state, dispatch }) => {
  if (!isOpen || !goal) return null;
  const otherGoals = state.goals.filter(g => g.status === 'active' && g.id !== goal.id);
  const [toId, setToId] = useState(otherGoals[0]?.id);
  const [amount, setAmount] = useState(0);

  const handleMove = () => {
    dispatch({ type: 'MOVE_MONEY', payload: { fromId: goal.id, toId, amount } });
    const toGoal = state.goals.find(g => g.id === toId);
    dispatch({ type: 'SHOW_TOAST', payload: `${formatMoney(amount)} moved from ${goal.name} to ${toGoal.name}` });
    onClose();
  };

  return (
    <C15BottomSheet isOpen={isOpen} onClose={onClose} title="Move money" cta={<C4Button onClick={handleMove} disabled={amount <= 0 || amount > goal.currentValue || !toId}>Move {formatMoney(amount)}</C4Button>}>
      <div className="flex flex-col gap-6">
        <div className="p-3 border border-border rounded-button bg-screen-bg flex justify-between items-center">
          <span className="text-[15px] font-medium text-text-2">From {goal.name}</span>
          <span className="text-[15px] font-semibold">{formatMoney(goal.currentValue)}</span>
        </div>
        <C11AmountInput value={amount} onChange={v => setAmount(parseInt(v) || 0)} max={goal.currentValue} />
        {amount > goal.currentValue && <p className="text-[13px] text-loss text-center mt-[-10px]">Cannot exceed {formatMoney(goal.currentValue)}</p>}
        <div>
          <label className="text-[13px] font-semibold text-text-2 mb-2 block uppercase tracking-wider">To</label>
          <div className="flex flex-col gap-2">
            {otherGoals.map(g => (
              <label key={g.id} className="flex items-center gap-3 p-3 border border-border rounded-button cursor-pointer active:bg-screen-bg">
                <input type="radio" name="togoal" checked={toId === g.id} onChange={() => setToId(g.id)} className="w-5 h-5 accent-primary" />
                <span className="flex-1 text-[15px] font-medium">{g.name}</span>
              </label>
            ))}
            {otherGoals.length === 0 && <p className="text-[13px] text-text-2">No other active goals.</p>}
          </div>
        </div>
      </div>
    </C15BottomSheet>
  );
};

const S14Withdraw = ({ isOpen, onClose, goal, dispatch }) => {
  if (!isOpen || !goal) return null;
  const [amount, setAmount] = useState(goal.currentValue);
  
  const handleWithdraw = () => {
    const isFull = amount === goal.currentValue && goal.currentValue >= goal.targetAmount;
    dispatch({ type: 'WITHDRAW', payload: { goalId: goal.id, amount, isFull } });
    if (isFull) {
      dispatch({ type: 'NAVIGATE', payload: 'S16', goalId: goal.id });
    } else {
      dispatch({ type: 'SHOW_TOAST', payload: `${formatMoney(amount)} on its way to your bank` });
    }
    onClose();
  };

  return (
    <C15BottomSheet isOpen={isOpen} onClose={onClose} title={goal.category === 'emergency' ? "Use your emergency fund" : "Withdraw"} cta={<C4Button onClick={handleWithdraw} disabled={amount <= 0 || amount > goal.currentValue}>Withdraw {formatMoney(amount)}</C4Button>}>
      <div className="flex flex-col gap-6">
        <C11AmountInput value={amount} onChange={v => setAmount(parseInt(v) || 0)} max={goal.currentValue} />
        {amount > goal.currentValue && <p className="text-[13px] text-loss text-center mt-[-10px]">Cannot exceed {formatMoney(goal.currentValue)}</p>}
        <C23InfoBanner text="Liquid funds usually reach your bank in 1 working day. Others in 2-3 (illustrative)." />
      </div>
    </C15BottomSheet>
  );
};

const S15FlexibleMonth = ({ isOpen, onClose, state, dispatch }) => {
  const [amount, setAmount] = useState(state?.user?.monthlyBudget || 0);
  if (!isOpen) return null;
  const monthStr = getSimulatedMonthStr(state.simulatedMonth + 1).split(' ')[0];
  const handleInvest = () => {
    const split = calculateSplit(amount, state.goals);
    dispatch({ type: 'SIMULATE_MONTH', payload: amount, split });
    onClose();
  };
  return (
    <C15BottomSheet isOpen={isOpen} onClose={onClose} title="Next month" cta={<div className="flex flex-col gap-2"><C4Button onClick={handleInvest}>Invest {formatMoney(amount)}</C4Button><C4Button variant="ghost" onClick={() => { dispatch({ type: 'SIMULATE_MONTH', payload: 0, split: [] }); dispatch({ type: 'SHOW_TOAST', payload: `No worries. Skipped ${monthStr}.` }); onClose(); }}>Skip this month</C4Button></div>}>
      <h2 className="text-[24px] font-bold text-text-1 text-center mb-6">How much can you invest in {monthStr}?</h2>
      <C11AmountInput value={amount} onChange={v => setAmount(parseInt(v) || 0)} useSuggestion={state.user?.monthlyBudget} onUseSuggestion={() => setAmount(state.user?.monthlyBudget)} />
      <p className="text-[13px] text-text-2 text-center mt-6">We'll split it by your goals' monthly amounts.</p>
    </C15BottomSheet>
  );
};

const S9InvestNow = ({ isOpen, onClose, state, dispatch }) => {
  const activeGoals = state?.goals?.filter(g => g.status === 'active') || [];
  const [amount, setAmount] = useState(1000);
  const [mode, setMode] = useState('Split across goals');
  const [selectedGoal, setSelectedGoal] = useState(activeGoals[0]?.id);

  if (!isOpen) return null;
  const splits = mode === 'Split across goals' ? calculateSplit(amount, state.goals) : [];

  const handleInvest = () => {
    if (mode === 'One goal') dispatch({ type: 'INVEST_NOW', payload: { goalId: selectedGoal, amount } });
    else dispatch({ type: 'INVEST_NOW', payload: { splits } });
    dispatch({ type: 'SHOW_TOAST', payload: `${formatMoney(amount)} invested` });
    onClose();
  };

  return (
    <C15BottomSheet isOpen={isOpen} onClose={onClose} title="Invest now" cta={<C4Button onClick={handleInvest} disabled={amount < 100}>Invest {formatMoney(amount)}</C4Button>}>
      <div className="flex flex-col gap-6">
        <C11AmountInput value={amount} onChange={v => setAmount(parseInt(v) || 0)} />
        {amount < 100 && <p className="text-[13px] text-loss text-center mt-[-10px]">Min ₹100</p>}
        {activeGoals.length > 1 && <C13SegmentedControl options={['One goal', 'Split across goals']} selected={mode} onChange={setMode} />}
        <div className="flex flex-col gap-2">
          {mode === 'One goal' ? activeGoals.map(g => (
            <label key={g.id} className="flex items-center gap-3 p-3 border border-border rounded-button cursor-pointer active:bg-screen-bg">
              <input type="radio" name="goal" checked={selectedGoal === g.id} onChange={() => setSelectedGoal(g.id)} className="w-5 h-5 accent-primary" />
              <span className="flex-1 text-[15px] font-medium">{g.name}</span>
            </label>
          )) : splits.map(s => {
            const cat = GOAL_CATEGORIES.find(c => c.id === s.category) || GOAL_CATEGORIES[6];
            const Icon = cat.icon;
            return (
              <div key={s.id} className="flex items-center gap-3 p-3 bg-screen-bg rounded-button border border-border">
                <div className="w-8 h-8 rounded-full flex items-center justify-center text-white bg-primary"><Icon size={16} /></div>
                <span className="flex-1 text-[15px] font-medium">{s.name}</span>
                <span className="text-[15px] font-semibold">{formatMoney(s.splitAmount)}</span>
              </div>
            );
          })}
        </div>
      </div>
    </C15BottomSheet>
  );
};

const S16GoalCompleted = ({ state, dispatch }) => {
  const goal = state.goals.find(g => g.id === state.activeGoalId);
  if (!goal) return null;
  return (
    <div className="flex flex-col h-full bg-page-bg p-6 items-center justify-center text-center gap-6">
      <div className="w-[96px] h-[96px] rounded-full bg-primary-tint text-primary flex items-center justify-center border-4 border-white shadow-card">
        <Trophy size={48} />
      </div>
      <div>
        <h1 className="text-[32px] font-bold text-text-1 mb-2 leading-tight">{goal.name} funded 🎉</h1>
        <p className="text-[15px] text-text-2">{formatMoney(goal.targetAmount)} saved.</p>
      </div>
      <C4Button onClick={() => dispatch({ type: 'NAVIGATE', payload: 'Goals' })} className="mt-8">Back to goals</C4Button>
    </div>
  );
};

const S6Goals = ({ state, dispatch }) => {
  const active = state.goals.filter(g => g.status === 'active' || g.status === 'paused');
  const completed = state.goals.filter(g => g.status === 'completed');
  const [showCreateSheet, setShowCreateSheet] = useState(false);

  return (
    <div className="flex flex-col h-full bg-page-bg">
      <div className="px-4 py-6 pb-2 shrink-0">
        <h1 className="text-[24px] font-bold text-text-1">Goals</h1>
        <p className="text-[13px] text-text-2">{active.length} of 6 slots used</p>
      </div>
      <div className="flex-1 overflow-y-auto no-scrollbar px-4 pb-2">
        {active.length === 0 && completed.length === 0 ? (
          <C19EmptyState title="No goals yet" caption="Start with an emergency fund. Future you says thanks." buttonLabel="Add your first goal" onAction={() => setShowCreateSheet(true)} />
        ) : (
          <div className="flex flex-col gap-4">
            {active.map(g => <C10GoalCard key={g.id} goal={g} onClick={() => dispatch({ type: 'NAVIGATE', payload: 'GoalDetail', goalId: g.id })} />)}
            {completed.length > 0 && (
              <div className="mt-6">
                <h2 className="text-[18px] font-semibold text-text-1 mb-4 flex items-center gap-2">Completed <C5Chip variant="completed" label={completed.length} /></h2>
                <div className="flex flex-col gap-4">
                  {completed.map(g => <C10GoalCard key={g.id} goal={g} onClick={() => dispatch({ type: 'NAVIGATE', payload: 'GoalDetail', goalId: g.id })} />)}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
      <div className="p-4 bg-page-bg shrink-0 border-t border-border">
        <C4Button onClick={() => setShowCreateSheet(true)} icon={Plus} disabled={active.length >= 6}>Add goal</C4Button>
        {active.length >= 6 && <p className="text-[11px] text-text-2 text-center mt-2">Maximum 6 active goals allowed.</p>}
      </div>
      {showCreateSheet && (
        <S8CreateEditGoal 
          isOpen={showCreateSheet} 
          onClose={() => setShowCreateSheet(false)} 
          mode="create" 
          state={state} 
          dispatch={dispatch} 
        />
      )}
    </div>
  );
};

const S5Home = ({ state, dispatch }) => {
  const [showS15, setShowS15] = useState(false);
  const [showS9, setShowS9] = useState(false);

  const renderGoals = state.goals.filter(g => g.status === 'active' || g.status === 'paused');
  const activeGoals = state.goals.filter(g => g.status === 'active');
  const totalInvested = state.goals.reduce((s, g) => s + g.invested, 0);
  const totalValue = state.goals.reduce((s, g) => s + g.currentValue, 0);
  const diff = totalValue - totalInvested;
  const diffPct = totalInvested > 0 ? (diff / totalInvested) * 100 : 0;

  const budgetCheck = getBudgetCheck(state.goals, state.user.monthlyBudget);

  const handleNextMonth = () => {
    if (state.user.mode === 'flexible') setShowS15(true);
    else dispatch({ type: 'SIMULATE_MONTH' });
  };

  return (
    <div className="flex flex-col h-full bg-page-bg">
      <div className="px-4 pt-6 pb-2 shrink-0">
        <h1 className="text-[24px] font-bold text-text-1">Hi {state.user.name} 👋</h1>
        <p className="text-[13px] text-text-2">{getSimulatedMonthStr(state.simulatedMonth)}</p>
      </div>
      <div className="flex-1 overflow-y-auto no-scrollbar px-4 py-4 flex flex-col gap-6 pb-24">
        <C6Card className="border border-border">
          <div className="text-[13px] font-medium text-text-2 mb-1">Total invested {formatMoney(totalInvested)}</div>
          <C7MoneyText amount={totalValue} size="display" />
          <div className="mt-2 flex items-center gap-2">
            <C5Chip variant={diff >= 0 ? 'gain' : 'loss'} label={`${diff >= 0 ? '+' : ''}${formatMoney(diff)} (${diffPct.toFixed(1)}%)`} />
            <span className="text-[11px] text-text-2 tracking-wider">Illustrative returns</span>
          </div>
          <div className="flex gap-3 mt-6">
            <C4Button onClick={() => setShowS9(true)} icon={Plus} className="flex-1">Invest now</C4Button>
            <C4Button variant="secondary" onClick={handleNextMonth} icon={FastForward} className="flex-1">Next month</C4Button>
          </div>
        </C6Card>

        <C6Card className="border border-border">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-[18px] font-semibold text-text-1">Monthly plan</h2>
            <span className="text-[13px] text-text-2 font-medium">Budget {formatMoney(state.user.monthlyBudget)}</span>
          </div>
          <C9AllocationBar items={activeGoals.map((g) => {
            const cat = GOAL_CATEGORIES.find(c => c.id === g.category) || GOAL_CATEGORIES[6];
            return { label: g.name, percent: Math.round((g.monthlyAmount / state.user.monthlyBudget) * 100), amount: g.monthlyAmount, color: cat.color };
          })} />
          {budgetCheck.over ? (
            <C23InfoBanner warning text={`You've planned ${formatMoney(budgetCheck.used - state.user.monthlyBudget)} more than your budget.`} />
          ) : (
            <div className="mt-4 pt-3 border-t border-border flex justify-between items-center">
              <span className="text-[13px] text-text-2 font-medium">{formatMoney(budgetCheck.unassigned)} unassigned</span>
              <C4Button variant="ghost" onClick={() => dispatch({ type: 'NAVIGATE', payload: 'Goals' })} className="w-auto h-auto py-1 px-3 text-[13px] bg-screen-bg border border-border shadow-sm">Assign</C4Button>
            </div>
          )}
        </C6Card>

        <div>
          <div className="flex justify-between items-center mb-3">
            <h2 className="text-[18px] font-semibold text-text-1">Your goals</h2>
            <C4Button variant="ghost" onClick={() => dispatch({ type: 'NAVIGATE', payload: 'Goals' })} className="w-auto h-auto py-1 px-2 text-[13px]">See all</C4Button>
          </div>
          <div className="flex flex-col gap-3">
            {renderGoals.slice(0, 4).map(g => <C10GoalCard key={g.id} goal={g} onClick={() => dispatch({ type: 'NAVIGATE', payload: 'GoalDetail', goalId: g.id })} className={g.status === 'paused' ? 'opacity-70' : ''} />)}
            {renderGoals.length === 0 && <C19EmptyState title="No goals yet" caption="Start with an emergency fund. Future you says thanks." buttonLabel="Add your first goal" onAction={() => dispatch({ type: 'NAVIGATE', payload: 'Onboarding' })} />}
          </div>
        </div>

        {!state.user.stockUnlocked && (
          <C6Card className="bg-screen-bg border border-border flex items-center justify-between shadow-sm cursor-pointer mb-6 transition-transform active:scale-[0.98]" onClick={() => dispatch({ type: 'NAVIGATE', payload: 'Learn' })}>
            <div className="flex items-center gap-3">
              <div className="w-[40px] h-[40px] rounded-full bg-primary-tint text-primary-dark flex items-center justify-center"><Sparkles size={20} /></div>
              <div>
                <div className="text-[14px] font-semibold text-text-1">Unlock stocks for long-term goals</div>
                <div className="text-[12px] text-text-2">3 min read + quick quiz</div>
              </div>
            </div>
            <ChevronLeft size={20} className="rotate-180 text-text-3" />
          </C6Card>
        )}
      </div>

      <S15FlexibleMonth isOpen={showS15} onClose={() => setShowS15(false)} state={state} dispatch={dispatch} />
      <S9InvestNow isOpen={showS9} onClose={() => setShowS9(false)} state={state} dispatch={dispatch} />
    </div>
  );
};


const MODULES = {
  1: {
    title: "How to look at a stock",
    cards: [
      "A stock = a tiny piece of a real business. First ask: what does it sell, and to whom?",
      "Fundamentals: is revenue growing? Is it making a profit? How much debt does it carry?",
      "Performance: look at how it has done over 3-5 years, not last week.",
      "Valuation: P/E = how much investors pay for ₹1 of profit. Very high P/E means high expectations.",
      "Tips and trends aren't research. If you can't explain why you own it, don't buy it."
    ],
    next: 'S13Q'
  },
  2: {
    title: "Mutual funds 101",
    cards: [
      "A mutual fund pools money from many people and invests it for them.",
      "Large-cap: India's biggest, steadiest companies. Mid-cap: growing mid-sized ones. Small-cap: small, fast-moving, riskier.",
      "Index funds copy an index like the Nifty 50, so fees are low and no one picks stocks.",
      "Liquid funds are a type of debt fund for short-term money. You can usually withdraw the next working day.",
      "Hybrid funds mix stocks and bonds, balancing growth and safety."
    ],
    next: 'Done'
  }
};

const QUIZ = [
  { q: "What does a P/E ratio tell you?", options: ["How much investors pay for ₹1 of profit", "The company's total debt", "Tomorrow's stock price"], a: 0 },
  { q: "A friend says a stock will double next month. What do you do first?", options: ["Check the business's fundamentals yourself", "Buy it right away", "Use your emergency fund"], a: 0 },
  { q: "What matters most when judging performance?", options: ["How it did over several years", "Last week's price", "How many people talk about it online"], a: 0 }
];

const C24StockRow = ({ stock, onAdd, isAdded, maxReached, onClick, showMock }) => (
  <div onClick={onClick} className="bg-screen-bg border border-border p-3 rounded-card flex items-center gap-3 cursor-pointer transition-transform active:scale-[0.98]">
    <div className="w-10 h-10 rounded-full bg-primary-tint text-primary-dark flex items-center justify-center font-bold">{stock.name[0]}</div>
    <div className="flex-1">
      <div className="text-[15px] font-semibold text-text-1 flex items-center gap-2">
        {stock.name} {showMock && <span className="text-[10px] bg-border text-text-2 px-1 rounded uppercase tracking-wider">Mock</span>}
      </div>
      <div className="text-[12px] text-text-2">{stock.sector}</div>
    </div>
    <div className="text-right">
      <div className="text-[15px] font-semibold text-text-1">{formatMoney(stock.price)}</div>
      <C5Chip variant={stock.return5y >= 0 ? 'gain' : 'loss'} label={`${stock.return5y >= 0 ? '+' : ''}${stock.return5y}%`} />
    </div>
    {onAdd && (
      <div className="flex flex-col items-center ml-2">
        <C4Button variant="ghost" className="w-auto h-auto py-1 px-3 border border-border shadow-sm bg-white" onClick={(e) => { e.stopPropagation(); onAdd(); }} disabled={isAdded || (maxReached && !isAdded)}>
          {isAdded ? 'Added' : 'Add'}
        </C4Button>
        {maxReached && !isAdded && <span className="text-[9px] text-text-3 mt-1">Max 5</span>}
      </div>
    )}
  </div>
);

const C25BarChart = ({ data, color }) => (
  <div className="h-[120px] w-full">
    <ResponsiveContainer width="100%" height="100%">
      <BarChart data={data.map((d,i)=>({name: `FY${22+i}`, val: d}))}>
        <XAxis dataKey="name" fontSize={11} tickLine={false} axisLine={false} tick={{fill: '#66697D'}} />
        <Tooltip cursor={{fill: 'transparent'}} contentStyle={{fontSize: '12px', borderRadius: '8px'}} />
        <Bar dataKey="val" fill={color} radius={[4,4,0,0]} />
      </BarChart>
    </ResponsiveContainer>
  </div>
);

const C26LineChart = ({ data }) => (
  <div className="h-[140px] w-full mt-4">
    <ResponsiveContainer width="100%" height="100%">
      <LineChart data={data.map((d,i)=>({i, val: d}))}>
        <YAxis domain={['auto', 'auto']} hide />
        <Tooltip contentStyle={{fontSize: '12px', borderRadius: '8px'}} labelFormatter={()=>''} />
        <Line type="monotone" dataKey="val" stroke="#00D09C" strokeWidth={2} dot={false} />
      </LineChart>
    </ResponsiveContainer>
  </div>
);

const S11Learn = ({ state, dispatch }) => (
  <div className="flex flex-col h-full bg-page-bg">
    <div className="px-4 py-6 pb-2 shrink-0">
      <h1 className="text-[24px] font-bold text-text-1">Learn</h1>
    </div>
    <div className="flex-1 overflow-y-auto no-scrollbar px-4 pb-24 flex flex-col gap-6">
      <C6Card className="border border-border flex items-center justify-between shadow-sm cursor-pointer" onClick={() => dispatch({ type: 'NAVIGATE', payload: state.user.stockUnlocked ? 'S17' : 'ModuleViewer', moduleId: 1 })}>
        <div className="flex items-center gap-3">
          <div className={`w-[40px] h-[40px] rounded-full flex items-center justify-center ${state.user.stockUnlocked ? 'bg-primary text-white' : 'bg-primary-tint text-primary'}`}>
            {state.user.stockUnlocked ? <CheckCircle size={20} /> : <Lock size={20} />}
          </div>
          <div>
            <div className="text-[14px] font-semibold text-text-1">Stocks for 5+ year goals</div>
            <div className="text-[12px] text-text-2">Pass the stock quiz to unlock</div>
          </div>
        </div>
        <C5Chip variant={state.user.stockUnlocked ? 'completed' : 'paused'} label={state.user.stockUnlocked ? 'Unlocked' : 'Locked'} />
      </C6Card>
      
      <div className="flex flex-col gap-3">
        <C6Card className="border border-border flex items-center justify-between cursor-pointer" onClick={() => dispatch({ type: 'NAVIGATE', payload: 'ModuleViewer', moduleId: 1 })}>
          <div className="flex items-center gap-3">
            <div className="w-[40px] h-[40px] rounded-full bg-screen-bg text-text-2 flex items-center justify-center"><TrendingUp size={20} /></div>
            <div>
              <div className="text-[14px] font-semibold text-text-1">How to look at a stock</div>
              <div className="text-[12px] text-text-2">5 cards · 3 min</div>
            </div>
          </div>
          <C5Chip variant={state.user.module1Done ? 'completed' : 'paused'} label={state.user.module1Done ? 'Done' : 'Not started'} />
        </C6Card>

        <C6Card className="border border-border flex items-center justify-between cursor-pointer" onClick={() => dispatch({ type: 'NAVIGATE', payload: 'ModuleViewer', moduleId: 2 })}>
          <div className="flex items-center gap-3">
            <div className="w-[40px] h-[40px] rounded-full bg-screen-bg text-text-2 flex items-center justify-center"><BookOpen size={20} /></div>
            <div>
              <div className="text-[14px] font-semibold text-text-1">Mutual funds 101</div>
              <div className="text-[12px] text-text-2">5 cards · 3 min</div>
            </div>
          </div>
          <C5Chip variant={state.user.module2Done ? 'completed' : 'paused'} label={state.user.module2Done ? 'Done' : 'Not started'} />
        </C6Card>
      </div>

      <C6Card className="border border-border flex items-center justify-between cursor-pointer" onClick={() => dispatch({ type: 'NAVIGATE', payload: 'S17' })}>
        <div className="flex items-center gap-3">
          <div className="w-[40px] h-[40px] rounded-full bg-screen-bg text-text-2 flex items-center justify-center"><Search size={20} /></div>
          <div className="text-[14px] font-semibold text-text-1">Practice: explore companies</div>
        </div>
        <ChevronLeft size={20} className="rotate-180 text-text-3" />
      </C6Card>
    </div>
  </div>
);

const S12ModuleViewer = ({ moduleId, dispatch }) => {
  const mod = MODULES[moduleId];
  const [step, setStep] = useState(0);

  const handleNext = () => {
    if (step < mod.cards.length - 1) setStep(step + 1);
    else if (mod.next === 'Done') {
      dispatch({ type: 'USER_UPDATE', payload: { [`module${moduleId}Done`]: true } });
      dispatch({ type: 'NAVIGATE', payload: 'Learn' });
    }
    else {
      dispatch({ type: 'USER_UPDATE', payload: { [`module${moduleId}Done`]: true } });
      dispatch({ type: 'NAVIGATE', payload: mod.next });
    }
  };

  return (
    <div className="flex flex-col h-full bg-page-bg">
      <C2TopBar title={mod.title} showBack onBack={() => dispatch({ type: 'NAVIGATE', payload: 'Learn' })} backIcon={X} />
      <div className="flex-1 flex flex-col justify-center px-6 gap-8">
        <div className="flex gap-2 justify-center">
          {mod.cards.map((_, i) => (
            <div key={i} className={`h-2 flex-1 rounded-full ${i <= step ? 'bg-primary' : 'bg-border'}`} />
          ))}
        </div>
        <div className="text-[20px] font-medium text-text-1 text-center min-h-[120px] flex items-center justify-center">
          {mod.cards[step]}
        </div>
      </div>
      <div className="p-6">
        <C4Button onClick={handleNext}>
          {step < mod.cards.length - 1 ? 'Next' : mod.next === 'Done' ? 'Done' : 'Take the quiz'}
        </C4Button>
      </div>
    </div>
  );
};

const S13QQuiz = ({ dispatch }) => {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [selected, setSelected] = useState(null);

  const handleNext = () => {
    const newAnswers = [...answers, selected === QUIZ[step].a];
    if (step < QUIZ.length - 1) {
      setAnswers(newAnswers);
      setSelected(null);
      setStep(step + 1);
    } else {
      const score = newAnswers.filter(Boolean).length;
      if (score >= 2) {
        dispatch({ type: 'USER_UPDATE', payload: { stockUnlocked: true } });
        setStep('pass');
      } else {
        setStep('fail');
      }
    }
  };

  if (step === 'pass') {
    return (
      <div className="flex flex-col h-full bg-page-bg p-6 items-center justify-center text-center gap-6">
        <div className="w-[80px] h-[80px] rounded-full bg-primary-tint text-primary flex items-center justify-center">
          <CheckCircle size={40} />
        </div>
        <div>
          <h1 className="text-[28px] font-bold text-text-1 mb-2">Stocks unlocked 🎉</h1>
          <p className="text-[15px] text-text-2">You can now add up to 25% stocks to goals 5+ years away.</p>
        </div>
        <C4Button onClick={() => dispatch({ type: 'NAVIGATE', payload: 'Goals' })} className="mt-8">Go to my goals</C4Button>
      </div>
    );
  }

  if (step === 'fail') {
    return (
      <div className="flex flex-col h-full bg-page-bg p-6 items-center justify-center text-center gap-6">
        <h1 className="text-[28px] font-bold text-text-1 mb-2">Almost there</h1>
        <p className="text-[15px] text-text-2">You need 2 of 3. Want a quick review?</p>
        <div className="flex flex-col gap-3 w-full mt-8">
          <C4Button onClick={() => dispatch({ type: 'NAVIGATE', payload: 'ModuleViewer', moduleId: 1 })}>Review cards</C4Button>
          <C4Button variant="ghost" onClick={() => { setStep(0); setAnswers([]); setSelected(null); }}>Try again</C4Button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-page-bg">
      <div className="px-6 py-8">
        <div className="text-[13px] font-bold text-text-2 tracking-wider mb-2 uppercase">Question {step + 1} of {QUIZ.length}</div>
        <h2 className="text-[22px] font-bold text-text-1 mb-8">{QUIZ[step].q}</h2>
        <div className="flex flex-col gap-3">
          {QUIZ[step].options.map((opt, i) => (
            <label key={i} className={`flex items-center p-4 border rounded-button cursor-pointer ${selected === i ? 'border-primary bg-primary-tint' : 'border-border bg-screen-bg'}`}>
              <input type="radio" name="q" checked={selected === i} onChange={() => setSelected(i)} className="hidden" />
              <span className={`text-[15px] font-medium ${selected === i ? 'text-primary' : 'text-text-1'}`}>{opt}</span>
            </label>
          ))}
        </div>
      </div>
      <div className="mt-auto p-6">
        <C4Button onClick={handleNext} disabled={selected === null}>Next</C4Button>
      </div>
    </div>
  );
};

const S17StockExplorer = ({ state, dispatch }) => {
  const [search, setSearch] = useState('');
  const [sector, setSector] = useState('All');
  const goalId = state.addToGoalId;
  const goal = goalId ? state.goals.find(g => g.id === goalId) : null;

  const sectors = ['All', ...new Set(MOCK_COMPANIES.map(c => c.sector))];
  const filtered = MOCK_COMPANIES.filter(c => (sector === 'All' || c.sector === sector) && c.name.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="flex flex-col h-full bg-page-bg">
      <C2TopBar title={
        <div className="flex items-center gap-2">
          <span>Explore companies</span>
          <span className="text-[10px] bg-border text-text-2 px-1 rounded uppercase tracking-wider font-bold">Mock</span>
        </div>
      } showBack onBack={() => dispatch({ type: 'NAVIGATE', payload: goal ? 'GoalDetail' : 'Learn' })} />
      <div className="px-4 py-4 shrink-0 border-b border-border bg-white flex flex-col gap-4">
        <C23InfoBanner text="These are made-up companies for learning. We never tell you what to buy." />
        <div className="relative">
          <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-3" />
          <input type="text" placeholder="Search companies..." value={search} onChange={e => setSearch(e.target.value)} className="w-full bg-screen-bg border border-border rounded-button h-12 pl-10 pr-4 text-[15px] outline-none focus:border-primary" />
        </div>
        <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
          {sectors.map(s => (
            <button key={s} onClick={() => setSector(s)} className={`shrink-0 px-3 py-1.5 rounded-button text-[13px] font-medium border transition-all active:scale-[0.98] ${sector === s ? 'bg-text-1 text-white border-text-1' : 'bg-white text-text-2 border-border'}`}>{s}</button>
          ))}
        </div>
      </div>
      <div className="flex-1 overflow-y-auto no-scrollbar p-4 flex flex-col gap-3 pb-24">
        {filtered.map(c => (
          <C24StockRow 
            key={c.id} 
            stock={c} 
            showMock 
            onAdd={goal ? () => {
              if (goal.stocks.length >= 5) return;
              dispatch({ type: 'UPDATE_GOAL', payload: { id: goal.id, stocks: [...goal.stocks, c.id] } });
              dispatch({ type: 'SHOW_TOAST', payload: `${c.name} added` });
            } : null}
            isAdded={goal?.stocks?.includes(c.id)}
            maxReached={goal?.stocks?.length >= 5}
            onClick={() => dispatch({ type: 'NAVIGATE', payload: 'S18StockPage', stockId: c.id })}
          />
        ))}
      </div>
    </div>
  );
};

const S18StockPage = ({ state, dispatch, stockId }) => {
  const stock = MOCK_COMPANIES.find(c => c.id === stockId);
  if (!stock) return <div className="p-8 text-center text-text-2">Stock not found</div>;
  const goalId = state.addToGoalId;
  const goal = goalId ? state.goals.find(g => g.id === goalId) : null;
  const isAdded = goal?.stocks?.includes(stock.id);

  const handleAdd = () => {
    if (goal.stocks.length >= 5) return;
    dispatch({ type: 'UPDATE_GOAL', payload: { id: goal.id, stocks: [...goal.stocks, stock.id] } });
    dispatch({ type: 'SHOW_TOAST', payload: `${stock.name} added` });
    dispatch({ type: 'NAVIGATE', payload: 'GoalDetail', goalId: goal.id });
  };

  return (
    <div className="flex flex-col h-full bg-page-bg relative">
      <C2TopBar title={stock.name} showBack onBack={() => dispatch({ type: 'NAVIGATE', payload: 'S17' })} />
      <div className="flex-1 overflow-y-auto no-scrollbar px-4 py-6 flex flex-col gap-8 pb-24">
        
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-primary-tint text-primary-dark flex items-center justify-center font-bold text-[20px]">{stock.name[0]}</div>
            <div>
              <h1 className="text-[20px] font-bold text-text-1 flex items-center gap-2">{stock.name} <span className="text-[10px] bg-border text-text-2 px-1 rounded uppercase tracking-wider">Mock</span></h1>
              <div className="text-[13px] text-text-2">{stock.sector}</div>
            </div>
          </div>
          <div className="mt-4 flex items-center gap-3">
            <C7MoneyText amount={stock.price} size="h2" />
            <C5Chip variant={stock.return5y >= 0 ? 'gain' : 'loss'} label={`5Y ${stock.return5y >= 0 ? '+' : ''}${stock.return5y}%`} />
          </div>
        </div>

        <section>
          <h2 className="text-[18px] font-semibold text-text-1 mb-3">1. The Business</h2>
          <p className="text-[15px] text-text-1 bg-screen-bg p-4 rounded-card border border-border">{stock.description}</p>
        </section>

        <section>
          <h2 className="text-[18px] font-semibold text-text-1 mb-4">2. Fundamentals</h2>
          <div className="flex flex-col gap-6">
            <div>
              <div className="flex items-center gap-2 mb-2"><h3 className="text-[14px] font-semibold">Revenue (₹ Cr)</h3><C17JargonTip term="Revenue / Profit" dispatch={dispatch} /></div>
              <C25BarChart data={stock.revenue} color="#5B8DEF" />
            </div>
            <div>
              <div className="flex items-center gap-2 mb-2"><h3 className="text-[14px] font-semibold">Profit (₹ Cr)</h3><C17JargonTip term="Revenue / Profit" dispatch={dispatch} /></div>
              <C25BarChart data={stock.profit} color="#00D09C" />
            </div>
            <div className="flex items-center gap-2 mt-2">
              <h3 className="text-[14px] font-semibold">Debt level</h3>
              <C17JargonTip term="Debt (company)" dispatch={dispatch} />
              <C5Chip variant={stock.debt === 'Low' ? 'completed' : stock.debt === 'Medium' ? 'paused' : 'loss'} label={stock.debt} />
            </div>
          </div>
        </section>

        <section>
          <h2 className="text-[18px] font-semibold text-text-1 mb-3">3. Performance</h2>
          <p className="text-[13px] text-text-2">5-year price trend</p>
          <C26LineChart data={stock.priceHistory} />
        </section>

        <section>
          <h2 className="text-[18px] font-semibold text-text-1 mb-4">4. Valuation</h2>
          <div className="flex flex-col gap-2 bg-screen-bg p-4 rounded-card border border-border">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-[16px] font-semibold">P/E {stock.pe}</span>
                <C17JargonTip term="P/E ratio" dispatch={dispatch} />
              </div>
              <span className="text-[13px] text-text-2">Sector avg {stock.sectorPe}</span>
            </div>
            <p className="text-[14px] font-medium text-text-1 mt-2">
              {stock.pe < stock.sectorPe - 2 ? 'Cheaper than its sector' : stock.pe > stock.sectorPe + 2 ? 'Pricier than its sector' : 'About the same as its sector'}
            </p>
          </div>
        </section>

      </div>
      {goal && (
        <div className="absolute bottom-0 left-0 right-0 p-4 bg-white border-t border-border z-10 shadow-[0_-4px_12px_rgba(0,0,0,0.05)]">
          <C4Button onClick={handleAdd} disabled={isAdded || goal.stocks.length >= 5}>
            {isAdded ? 'Added' : goal.stocks.length >= 5 ? 'Max 5 reached' : 'Add stock'}
          </C4Button>
        </div>
      )}
    </div>
  );
};

const S19Profile = ({ state, dispatch }) => {
  const [showBudgetSheet, setShowBudgetSheet] = useState(false);
  const [budgetVal, setBudgetVal] = useState(state.user.monthlyBudget);
  const [showAssumptions, setShowAssumptions] = useState(false);

  return (
    <div className="flex flex-col h-full bg-page-bg">
      <C2TopBar title="Profile" />
      <div className="flex-1 overflow-y-auto no-scrollbar px-4 py-6 flex flex-col gap-8 pb-24">
        <div className="flex items-center gap-4">
          <div className="w-[64px] h-[64px] rounded-full bg-primary-tint text-primary flex items-center justify-center text-[24px] font-bold">{state.user.name[0]}</div>
          <div>
            <h2 className="text-[20px] font-bold text-text-1">{state.user.name}</h2>
            <C5Chip variant="completed" label={state.user.incomeType} />
          </div>
        </div>

        <section className="flex flex-col gap-4">
          <h3 className="text-[14px] font-medium text-text-1">Monthly budget</h3>
          <div className="bg-screen-bg border border-border p-4 rounded-card flex justify-between items-center">
            <span className="text-[18px] font-semibold text-text-1">{formatMoney(state.user.monthlyBudget)}</span>
            <button onClick={() => setShowBudgetSheet(true)} className="text-[13px] font-medium bg-white text-primary border border-border shadow-sm rounded-chip px-4 py-1.5 active:scale-[0.98] transition-transform">Edit</button>
          </div>
        </section>

        <section className="flex flex-col gap-4">
          <h3 className="text-[14px] font-medium text-text-1">Contribution mode</h3>
          <C13SegmentedControl 
            options={['Fixed monthly (SIP)', 'Whatever I can']} 
            selected={state.user.mode === 'fixed' ? 'Fixed monthly (SIP)' : 'Whatever I can'} 
            onChange={v => { 
              const newMode = v === 'Fixed monthly (SIP)' ? 'fixed' : 'flexible';
              dispatch({ type: 'USER_UPDATE', payload: { mode: newMode } }); 
              dispatch({ type: 'SHOW_TOAST', payload: "Mode updated" }) 
            }} 
          />
        </section>

        <section className="flex flex-col gap-4">
          <div className="flex items-center justify-between cursor-pointer" onClick={() => setShowAssumptions(!showAssumptions)}>
            <div>
              <h3 className="text-[14px] font-medium text-text-1">Assumptions (for reviewers)</h3>
              <p className="text-[12px] text-text-2 mt-1">Illustrative rates used for projections.</p>
            </div>
            <ChevronDown size={20} className={`text-text-3 transition-transform ${showAssumptions ? 'rotate-180' : ''}`} />
          </div>
          {showAssumptions && (
            <C6Card className="bg-screen-bg border border-border shadow-none flex flex-col gap-4">
              {Object.keys(state.assumptions).map(key => (
                <div key={key} className="flex justify-between items-center">
                  <span className="text-[13px] font-medium text-text-1">{key}</span>
                  <div className="flex items-center gap-2">
                    <input type="number" value={Math.round(state.assumptions[key] * 100)} onChange={e => dispatch({ type: 'UPDATE_ASSUMPTION', payload: { key, value: parseFloat(e.target.value) / 100 } })} className="w-16 bg-white border border-border rounded p-1 text-center text-[13px] outline-none focus:border-primary" />
                    <span className="text-[13px] text-text-2">%</span>
                  </div>
                </div>
              ))}
            </C6Card>
          )}
        </section>

        <button className="text-[15px] font-bold text-loss mt-4 text-center p-4 active:bg-screen-bg rounded-button transition-colors" onClick={() => { if(window.confirm('Reset app?')) window.location.reload(); }}>
          Reset app
        </button>
      </div>
      <C15BottomSheet isOpen={showBudgetSheet} onClose={() => setShowBudgetSheet(false)} title="Monthly budget" cta={<C4Button disabled={budgetVal === state.user.monthlyBudget || budgetVal < 100} onClick={() => { dispatch({ type: 'USER_UPDATE', payload: { monthlyBudget: budgetVal } }); dispatch({ type: 'SHOW_TOAST', payload: "Budget updated" }); setShowBudgetSheet(false); }}>Save budget</C4Button>}>
        <div className="flex flex-col gap-4">
          <C11AmountInput value={budgetVal} onChange={v => setBudgetVal(parseInt(v) || 0)} />
        </div>
      </C15BottomSheet>
    </div>
  );
};

// --- APP COMPONENT ---
export default function App() {
  const [state, dispatch] = useReducer(appReducer, initialState);

  const renderScreen = () => {
    switch (state.screen) {
      case 'S0': return <S0Launch dispatch={dispatch} />;
      case 'Onboarding': return <Onboarding dispatch={dispatch} />;
      case 'GoalDetail': return <S7GoalDetail state={state} dispatch={dispatch} goalId={state.activeGoalId} />;
      case 'S16': return <S16GoalCompleted state={state} dispatch={dispatch} />;
      case 'Home': return <S5Home state={state} dispatch={dispatch} />;
      case 'Goals': return <S6Goals state={state} dispatch={dispatch} />;
      case 'Learn': return <S11Learn state={state} dispatch={dispatch} />;
      case 'Profile': return <S19Profile state={state} dispatch={dispatch} />;
      case 'ModuleViewer': return <S12ModuleViewer moduleId={state.activeModuleId} dispatch={dispatch} />;
      case 'S13Q': return <S13QQuiz dispatch={dispatch} />;
      case 'S17': return <S17StockExplorer state={state} dispatch={dispatch} />;
      case 'S18StockPage': return <S18StockPage state={state} dispatch={dispatch} stockId={state.activeStockId} />;
      default: return <S0Launch dispatch={dispatch} />;
    }
  };

  return (
    <C1PhoneFrame>
      <div className="flex-1 flex flex-col w-full h-full bg-page-bg overflow-hidden relative">
        {renderScreen()}
        {state.toast && (
          <div onClick={() => dispatch({ type: 'HIDE_TOAST' })} className="cursor-pointer z-50">
            <C16Toast message={state.toast} />
          </div>
        )}
        {state.activeGlossaryTerm && (
          <C15BottomSheet isOpen={true} onClose={() => dispatch({ type: 'HIDE_GLOSSARY' })} title={state.activeGlossaryTerm} cta={<C4Button onClick={() => dispatch({ type: 'HIDE_GLOSSARY' })}>Got it</C4Button>}>
            <p className="text-[15px] text-text-1">{GLOSSARY[state.activeGlossaryTerm] || "Definition not found."}</p>
          </C15BottomSheet>
        )}
      </div>
      {!['S0', 'Onboarding', 'GoalDetail', 'S16', 'ModuleViewer', 'S13Q', 'S17', 'S18StockPage'].includes(state.screen) && (
        <C3BottomNav activeTab={state.tab} onTabChange={(tab) => dispatch({ type: 'NAVIGATE', payload: tab })} />
      )}
    </C1PhoneFrame>
  );
}
