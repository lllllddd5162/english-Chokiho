import React, { useState, useEffect, useMemo } from 'react';
import { initializeApp } from 'firebase/app';
import {
  getFirestore,
  collection,
  doc,
  setDoc,
  deleteDoc,
  onSnapshot,
  query,
  writeBatch
} from 'firebase/firestore';
import {
  getAuth,
  signInAnonymously,
  onAuthStateChanged
} from 'firebase/auth';
import {
  Users, BookOpen, CheckCircle2, Circle, Clock, Plus, Trash2, BarChart3,
  Trophy, ClipboardCheck, Calculator, Calendar,
  MessageSquare, Search, AlertCircle, X as LucideX, History,
  Edit2, Layers, UserPlus, Info, ListChecks,
  StickyNote, Bookmark, UserCheck, MinusCircle,
  BrainCircuit, Zap, Activity, FileText, Save, CheckCircle,
  GraduationCap, UserCog, ChevronRight, LogOut, ShieldCheck,
  KeyRound, AlertTriangle, Fingerprint, School, UserCircle2, FileSearch, ClipboardList, Loader2,
  Tag, TrendingUp, Printer, Sparkles, Copy, ChevronDown, Bot, RefreshCw,
  BookMarked, Languages, Star, Globe, Pencil, FlaskConical, Atom, Apple,
  Cherry, Glasses, PersonStanding,
  Music, Heart, Sun, Moon, Rocket, Crown, Diamond, Flame, Leaf, Bird,
  Cat, Dog, Fish, Smile, Coffee, Bus, Bike, Car, Home, Building2,
  MapPin, Flag, Bell, Gift, Camera, Mic, Headphones, Tv, Monitor,
  Laptop, Tablet, Smartphone, Watch, Calculator as Calc, BookOpenCheck,
  ClipboardPen, NotebookPen, PenTool, Paintbrush, Palette, Brush,
  Settings, LayoutDashboard, BarChart2, PieChart, LineChart,
  Aperture, Compass, Cpu, Database, Code, Terminal, Wifi,
  Lock, Unlock, Eye, EyeOff, Link, Share2, Download, Upload,
  RefreshCcw, RotateCcw, ZoomIn, ZoomOut, Maximize, Minimize,
  ChevronUp, ArrowUp, ArrowDown, ArrowLeft, ArrowRight,
  Check, X, Plus as PlusIcon, Minus, Divide, Equal,
  AlignLeft, AlignCenter, AlignRight, Bold, Italic, Underline,
  List, Hash, At, Percent, DollarSign, Euro, Infinity,
  Dumbbell, Trophy as TrophyIcon, Medal, Award, Target,
  Lightbulb, Wrench, Hammer, Scissors, Paperclip, Pin,
  Send, Mail, Phone, Video, MessageCircle, MessageSquareMore,
  Map, Navigation, Plane, Train, Ship, Tent, Mountain,
  Cloud, CloudRain, Snowflake, Wind, Thermometer, Droplets,
  Sprout, Flower2, TreePine, Clover, Mushroom,
  Hexagon, Pentagon, Triangle, Square, CircleDot, Shapes
} from 'lucide-react';

// 아이콘 후보 목록 (사이트 관리에서 선택 가능)
const ICON_LIST = [
  { name: 'Languages',       component: Languages },
  { name: 'BookOpen',        component: BookOpen },
  { name: 'BookOpenCheck',   component: BookOpenCheck },
  { name: 'BookMarked',      component: BookMarked },
  { name: 'GraduationCap',   component: GraduationCap },
  { name: 'School',          component: School },
  { name: 'Pencil',          component: Pencil },
  { name: 'PenTool',         component: PenTool },
  { name: 'NotebookPen',     component: NotebookPen },
  { name: 'ClipboardPen',    component: ClipboardPen },
  { name: 'Paintbrush',      component: Paintbrush },
  { name: 'Palette',         component: Palette },
  { name: 'Star',            component: Star },
  { name: 'Crown',           component: Crown },
  { name: 'Diamond',         component: Diamond },
  { name: 'Flame',           component: Flame },
  { name: 'Rocket',          component: Rocket },
  { name: 'Globe',           component: Globe },
  { name: 'Compass',         component: Compass },
  { name: 'Target',          component: Target },
  { name: 'Trophy',          component: Trophy },
  { name: 'Medal',           component: Medal },
  { name: 'Award',           component: Award },
  { name: 'Lightbulb',       component: Lightbulb },
  { name: 'BrainCircuit',    component: BrainCircuit },
  { name: 'Cpu',             component: Cpu },
  { name: 'Atom',            component: Atom },
  { name: 'FlaskConical',    component: FlaskConical },
  { name: 'Music',           component: Music },
  { name: 'Heart',           component: Heart },
  { name: 'Sun',             component: Sun },
  { name: 'Moon',            component: Moon },
  { name: 'Leaf',            component: Leaf },
  { name: 'Sprout',          component: Sprout },
  { name: 'TreePine',        component: TreePine },
  { name: 'Flower2',         component: Flower2 },
  { name: 'Bird',            component: Bird },
  { name: 'Cat',             component: Cat },
  { name: 'Dog',             component: Dog },
  { name: 'Apple',           component: Apple },
  { name: 'Cherry',          component: Cherry },
  { name: 'Glasses',         component: Glasses },
  { name: 'PersonStanding',  component: PersonStanding },
  { name: 'Coffee',          component: Coffee },
  { name: 'Smile',           component: Smile },
  { name: 'Home',            component: Home },
  { name: 'Building2',       component: Building2 },
  { name: 'MapPin',          component: MapPin },
  { name: 'Flag',            component: Flag },
  { name: 'Bell',            component: Bell },
  { name: 'Gift',            component: Gift },
  { name: 'Dumbbell',        component: Dumbbell },
  { name: 'Mountain',        component: Mountain },
  { name: 'Plane',           component: Plane },
  { name: 'Shapes',          component: Shapes },
];

// --- Firebase Configuration ---
const firebaseConfig = {
  apiKey: "AIzaSyBaWWriu3X7iVQnglR5XcA0Mqqc736VopM",
  authDomain: "science-academy-13dda.firebaseapp.com",
  projectId: "science-academy-13dda",
  storageBucket: "science-academy-13dda.firebasestorage.app",
  messagingSenderId: "449626746191",
  appId: "1:449626746191:web:73885c6bb862a07655293a"
};
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const APP_ID = 'english-Chokiho';

// --- Constants ---
const DIFFICULTIES = ['하', '중하', '중', '중상', '상', '극상'];
const ASSIGNMENT_LEVELS = ['기초', '기본', '심화', '최고난도'];

const MEMO_STATUS_ORDER = ['not_started', 'round_1', 'round_2', 'round_3', 'round_4'];
const MEMO_STATUS_CONFIG = {
  not_started: { label: '시작 전', color: 'text-slate-300', bg: 'bg-slate-50', icon: Circle },
  round_1:     { label: '1회독', color: 'text-cyan-500',   bg: 'bg-cyan-50',   icon: Zap },
  round_2:     { label: '2회독', color: 'text-blue-500',   bg: 'bg-blue-50',   icon: Activity },
  round_3:     { label: '3회독', color: 'text-purple-600', bg: 'bg-purple-50', icon: Layers },
  round_4:     { label: '4회독', color: 'text-emerald-600',bg: 'bg-emerald-50',icon: CheckCircle2 },
};

const ASSIGN_STATUS_ORDER = ['not_started', 'in_progress', 'incomplete_red', 'completed', 'exempt'];
const ASSIGN_LABELS = {
  in_progress: '진행 중', incomplete_red: '미완료', completed: '완료', exempt: '해당 없음'
};
const ASSIGN_STATUS_CONFIG = {
  not_started:    { label: '시작 전',    color: 'text-slate-300', bg: 'bg-slate-50',      icon: Circle },
  in_progress:    { label: '진행 중',    color: 'text-slate-900', bg: 'bg-slate-100',     icon: Clock },
  incomplete_red: { label: '미완료',     color: 'text-red-500',   bg: 'bg-red-50',        icon: AlertCircle },
  completed:      { label: '완료',       color: 'text-blue-500',  bg: 'bg-blue-50',       icon: CheckCircle2 },
  exempt:         { label: '해당 없음',  color: 'text-slate-400', bg: 'bg-slate-100/50',  icon: MinusCircle }
};

const STATUS_COLORS = {
  completed:      'text-blue-500 bg-blue-50',
  late_completed: 'text-orange-500 bg-orange-50',
  in_progress:    'text-slate-900 bg-slate-100',
  incomplete_red: 'text-red-500 bg-red-50',
  not_started:    'text-slate-300 bg-slate-50',
  exempt:         'text-slate-400 bg-slate-100/50 border border-dashed border-slate-200'
};

const LESSON_TYPES = [
  { id: '진도',           color: 'bg-indigo-500', light: 'bg-indigo-50 text-indigo-700 border-indigo-200',   calChip: 'bg-indigo-100 text-indigo-700' },
  { id: '암기',           color: 'bg-purple-500', light: 'bg-purple-50 text-purple-700 border-purple-200',   calChip: 'bg-purple-100 text-purple-700' },
  { id: '문제풀이',       color: 'bg-orange-500', light: 'bg-orange-50 text-orange-700 border-orange-200',   calChip: 'bg-orange-100 text-orange-700' },
  { id: '중간 테스트',    color: 'bg-blue-500',   light: 'bg-blue-50 text-blue-700 border-blue-200',         calChip: 'bg-blue-100 text-blue-700' },
  { id: '시험 직전 대비', color: 'bg-red-600',    light: 'bg-red-50 text-red-700 border-red-200',            calChip: 'bg-red-100 text-red-700' },
];

const DEFAULT_GRADE_SCALES = [
  { id: 'g1', label: '우수', min: 90, color: 'bg-indigo-500', icon: '🔥' },
  { id: 'g2', label: '보통', min: 70, color: 'bg-emerald-500', icon: '⭐' },
  { id: 'g3', label: '노력', min: 50, color: 'bg-yellow-500', icon: '📝' },
  { id: 'g4', label: '부진', min: 0,  color: 'bg-red-500',    icon: '⚠️' }
];

// --- CSS Color Variable Injector ---
function SiteColorStyle({ color, dark }) {
  const hex = color || '#1d4ed8';
  const r = parseInt(hex.slice(1,3),16), g = parseInt(hex.slice(3,5),16), b = parseInt(hex.slice(5,7),16);
  const lighten = (amt) => { const nr=Math.min(255,r+amt),ng=Math.min(255,g+amt),nb=Math.min(255,b+amt); return '#'+[nr,ng,nb].map(x=>x.toString(16).padStart(2,'0')).join(''); };
  const darken  = (amt) => { const nr=Math.max(0,r-amt),  ng=Math.max(0,g-amt),  nb=Math.max(0,b-amt);   return '#'+[nr,ng,nb].map(x=>x.toString(16).padStart(2,'0')).join(''); };
  const alpha   = (a)   => `rgba(${r},${g},${b},${a})`;
  return (
    <style>{`
      :root {
        --sc: ${hex};
        --sc-dark: ${darken(30)};
        --sc-darker: ${darken(55)};
        --sc-light: ${lighten(180)};
        --sc-faint: ${alpha(0.08)};
        --sc-faint2: ${alpha(0.15)};
        --sc-text: ${alpha(0.9)};
      }
      @media print {
        body * { visibility: hidden; }
        #print-report, #print-report * { visibility: visible; }
        #print-report { position: fixed; top: 0; left: 0; width: 100%; }
        @page { margin: 1.5cm; }
      }
      ${dark ? `
        body { background: #0f172a !important; color: #e2e8f0 !important; }
        .bg-white { background: #1e293b !important; }
        .bg-slate-50 { background: #0f172a !important; }
        .bg-slate-100 { background: #1e293b !important; }
        .bg-slate-200 { background: #334155 !important; }
        .border-slate-100 { border-color: #334155 !important; }
        .border-slate-200 { border-color: #475569 !important; }
        .text-slate-800 { color: #f1f5f9 !important; }
        .text-slate-700 { color: #e2e8f0 !important; }
        .text-slate-600 { color: #cbd5e1 !important; }
        .text-slate-500 { color: #94a3b8 !important; }
        .text-slate-400 { color: #64748b !important; }
        .shadow-sm { box-shadow: 0 1px 2px rgba(0,0,0,0.4) !important; }
        .shadow-2xl { box-shadow: 0 25px 50px rgba(0,0,0,0.6) !important; }
        input, textarea, select { background: #1e293b !important; color: #e2e8f0 !important; border-color: #475569 !important; }
        table thead tr { background: #1e293b !important; }
        .divide-y > * { border-color: #334155 !important; }
      ` : ''}
    `}</style>
  );
}


// --- Progress Mini Calendar Component ---
function ProgressMiniCalendar({ progressPlans, progressCalMonth, setProgressCalMonth, kstToday, attendance, students, makeupDates, onDateSelect }) {
  const [selectedDate, setSelectedDate] = useState(null);

  const handleDateClick = (dateStr, dim) => {
    if (dim) setProgressCalMonth(dateStr.slice(0, 7));
    if (onDateSelect) {
      onDateSelect(dateStr);
    } else {
      setSelectedDate(prev => prev === dateStr ? null : dateStr);
    }
  };

  const [calYear, calMonthIdx] = progressCalMonth.split('-').map(Number);
  const firstDay = new Date(calYear, calMonthIdx - 1, 1).getDay();
  const daysInMonth = new Date(calYear, calMonthIdx, 0).getDate();
  const plansByDate = progressPlans.reduce((acc, p) => {
    if (!acc[p.date]) acc[p.date] = [];
    acc[p.date].push(p);
    return acc;
  }, {});

  const prevMonth = () => {
    let y = calYear, m = calMonthIdx - 1;
    if (m < 1) { m = 12; y -= 1; }
    setProgressCalMonth(`${y}-${String(m).padStart(2, '0')}`);
  };
  const nextMonth = () => {
    let y = calYear, m = calMonthIdx + 1;
    if (m > 12) { m = 1; y += 1; }
    setProgressCalMonth(`${y}-${String(m).padStart(2, '0')}`);
  };

  const dayLabels = ['일', '월', '화', '수', '목', '금', '토'];
  const DOW = ['일', '월', '화', '수', '목', '금', '토'];

  const renderCell = (dateStr, day, colIdx, extra = {}) => {
    const dayPlans = plansByDate[dateStr] || [];
    const isToday = kstToday === dateStr;
    const isSelected = selectedDate === dateStr;
    const { dim = false } = extra;
    return (
      <div
        key={`cell-${dateStr}-${dim?'dim':''}`}
        onClick={() => handleDateClick(dateStr, dim)}
        className={`border-b border-r border-slate-50 min-h-[60px] p-1.5 transition-all cursor-pointer
          ${isSelected ? 'bg-blue-50 ring-1 ring-inset ring-blue-300' : dim ? 'bg-slate-50/30 hover:bg-slate-100/50' : 'hover:bg-slate-50/60'}`}
      >
        <div className={`text-xs font-black w-5 h-5 flex items-center justify-center rounded-full mb-1
          ${isToday ? 'bg-emerald-500 text-white'
            : isSelected ? 'bg-blue-500 text-white'
            : dim ? (colIdx===0?'text-red-200':colIdx===6?'text-blue-200':'text-slate-300')
            : colIdx===0?'text-red-400':colIdx===6?'text-blue-400':'text-slate-600'}`}>
          {day}
        </div>
        {dayPlans.length > 0 && (
          <div className="space-y-0.5">
            {dayPlans.slice(0, 2).map(p => {
              const lt = LESSON_TYPES.find(l => l.id === (p.lessonType || '진도')) || LESSON_TYPES[0];
              return <div key={p.id} className={`text-[8px] font-black px-1 py-0.5 rounded leading-none truncate ${dim ? 'opacity-30' : (p.done ? 'opacity-50 line-through ' : '') + lt.calChip}`}>{p.subject} {p.unit}</div>;
            })}
            {dayPlans.length > 2 && <div className="text-[8px] text-slate-400 font-bold px-1">+{dayPlans.length - 2}</div>}
          </div>
        )}
      </div>
    );
  };

  const selectedPlans = selectedDate ? (plansByDate[selectedDate] || []) : [];
  const selectedAttList = selectedDate && students ? students.map(s => ({
    s,
    att: attendance?.[`${s.id}-${selectedDate}`] || { status: 'none', makeup: false },
    makeupDate: makeupDates?.[`${s.id}-${selectedDate}`] || '',
  })) : [];
  const hasData = selectedPlans.length > 0 || selectedAttList.some(x => x.att.status !== 'none');

  return (
    <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
      <div className="flex items-center justify-between px-5 py-3 border-b border-slate-100">
        <button onClick={prevMonth} className="px-2 py-1.5 hover:bg-slate-100 rounded-xl transition-all text-slate-500 font-black text-sm">&#8249; 이전</button>
        <span className="font-black text-slate-800 text-sm">{calYear}년 {calMonthIdx}월</span>
        <button onClick={nextMonth} className="px-2 py-1.5 hover:bg-slate-100 rounded-xl transition-all text-slate-500 font-black text-sm">다음 &#8250;</button>
      </div>
      <div className="grid grid-cols-7 border-b border-slate-100">
        {dayLabels.map((d, i) => (
          <div key={d} className={`py-1.5 text-center text-[10px] font-black ${i===0?'text-red-400':i===6?'text-blue-400':'text-slate-400'}`}>{d}</div>
        ))}
      </div>
      <div className="grid grid-cols-7">
        {Array.from({ length: firstDay }).map((_, i) => {
          const prevMonthDays = new Date(calYear, calMonthIdx - 1, 0).getDate();
          const day = prevMonthDays - firstDay + i + 1;
          let pY = calYear, pM = calMonthIdx - 1;
          if (pM < 1) { pM = 12; pY -= 1; }
          const dateStr = `${pY}-${String(pM).padStart(2,'0')}-${String(day).padStart(2,'0')}`;
          return renderCell(dateStr, day, i % 7, { dim: true });
        })}
        {Array.from({ length: daysInMonth }).map((_, i) => {
          const day = i + 1;
          const dateStr = `${calYear}-${String(calMonthIdx).padStart(2,'0')}-${String(day).padStart(2,'0')}`;
          const colIdx = (firstDay + i) % 7;
          return renderCell(dateStr, day, colIdx);
        })}
        {Array.from({ length: (7 - (firstDay + daysInMonth) % 7) % 7 }).map((_, i) => {
          const day = i + 1;
          let nY = calYear, nM = calMonthIdx + 1;
          if (nM > 12) { nM = 1; nY += 1; }
          const dateStr = `${nY}-${String(nM).padStart(2,'0')}-${String(day).padStart(2,'0')}`;
          const colIdx = (firstDay + daysInMonth + i) % 7;
          return renderCell(dateStr, day, colIdx, { dim: true });
        })}
      </div>

      {/* 범례 */}
      <div className="px-4 py-2.5 border-t border-slate-50 flex flex-wrap gap-3 items-center">
        <div className="flex items-center gap-1.5">
          <div className="w-4 h-4 rounded-full bg-emerald-500 flex items-center justify-center">
            <span className="text-white text-[7px] font-black">오늘</span>
          </div>
          <span className="text-[9px] font-bold text-slate-400">오늘</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-4 h-4 rounded-full bg-blue-500"/>
          <span className="text-[9px] font-bold text-slate-400">선택</span>
        </div>
        <div className="w-px h-3 bg-slate-200"/>
        {LESSON_TYPES.map(lt => (
          <span key={lt.id} className={`text-[9px] font-black px-1.5 py-0.5 rounded border ${lt.light}`}>{lt.id}</span>
        ))}
      </div>

      {/* 선택 날짜 상세 패널 */}
      {selectedDate && (
        <div className="border-t border-slate-100">
          <div className="px-4 py-3 flex items-center justify-between" style={{background:'var(--sc-faint)'}}>
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full" style={{background:'var(--sc)'}}/>
              <span className="font-black text-sm" style={{color:'var(--sc)'}}>{selectedDate}</span>
              <span className="text-[11px] font-bold text-slate-400">{DOW[new Date(selectedDate).getDay()]}요일</span>
            </div>
            <button onClick={() => setSelectedDate(null)} className="text-slate-400 hover:text-slate-600 transition-colors text-lg font-black leading-none">×</button>
          </div>
          {!hasData ? (
            <div className="px-4 py-6 text-center text-slate-400 text-[11px] font-bold">이 날의 수업·출결 기록이 없습니다.</div>
          ) : (
            <div className="divide-y divide-slate-50">
              {selectedPlans.length > 0 && (
                <div className="px-4 py-3 space-y-1.5">
                  <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-2 flex items-center gap-1"><span style={{color:'var(--sc)'}}>●</span> 수업 내용</p>
                  {selectedPlans.map(p => {
                    const lt = LESSON_TYPES.find(l => l.id === (p.lessonType || '진도')) || LESSON_TYPES[0];
                    return (
                      <div key={p.id} className={`flex items-center gap-2 px-3 py-2 rounded-xl border bg-slate-50 ${p.done ? 'opacity-60' : ''}`}>
                        <span className={`text-[9px] font-black px-1.5 py-0.5 rounded-lg border shrink-0 ${lt.light}`}>{p.lessonType || '진도'}</span>
                        {p.subject && <span className="text-[10px] font-black text-slate-500 shrink-0">{p.subject}</span>}
                        <span className={`text-[11px] font-black text-slate-700 flex-1 min-w-0 truncate ${p.done ? 'line-through' : ''}`}>{p.unit}</span>
                        {p.done && <span className="text-[9px] font-black text-teal-500 shrink-0">✓</span>}
                      </div>
                    );
                  })}
                </div>
              )}
              {students && selectedAttList.some(x => x.att.status !== 'none') && (
                <div className="px-4 py-3">
                  <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-2 flex items-center gap-1"><span style={{color:'var(--sc)'}}>●</span> 출결 현황</p>
                  <div className="grid grid-cols-2 gap-1.5">
                    {selectedAttList.filter(x => x.att.status !== 'none').map(({ s, att, makeupDate }) => {
                      const sm = { present: { l: '출석', c: 'text-emerald-600 bg-emerald-50 border-emerald-100' }, late: { l: '지각', c: 'text-amber-600 bg-amber-50 border-amber-100' }, absent: { l: '결석', c: 'text-red-500 bg-red-50 border-red-100' } }[att.status] || { l: '-', c: 'text-slate-300 bg-slate-50 border-slate-100' };
                      return (
                        <div key={s.id} className={`flex items-center justify-between px-2.5 py-2 rounded-xl border text-[10px] font-black ${sm.c}`}>
                          <span>{s.name}</span>
                          <div className="flex items-center gap-1">
                            <span>{sm.l}</span>
                            {att.makeup && <span className="text-[8px] bg-purple-100 text-purple-600 px-1 py-0.5 rounded font-black">{makeupDate ? makeupDate.slice(5)+'보충' : '보충'}</span>}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// --- Error Boundary ---
class ErrorBoundary extends React.Component {
  constructor(props) { super(props); this.state = { hasError: false }; }
  static getDerivedStateFromError() { return { hasError: true }; }
  render() {
    if (this.state.hasError) return <div className="p-10 text-center font-bold text-red-500 bg-white m-4 rounded-3xl shadow-sm border">시스템 로딩 중 오류가 발생했습니다. 페이지를 새로고침 해주세요.</div>;
    return this.props.children;
  }
}

// --- useWindowSize Hook ---
function useWindowSize() {
  const [width, setWidth] = useState(typeof window !== 'undefined' ? window.innerWidth : 1024);
  useEffect(() => {
    const handler = () => setWidth(window.innerWidth);
    window.addEventListener('resize', handler);
    return () => window.removeEventListener('resize', handler);
  }, []);
  return width;
}

// --- Helper Functions ---
const calculateRoundProgress = (students, items, submissionData, statusOrder, labels) => {
  return students.reduce((acc, s) => {
    const rel = items.filter(a => a.type === 'all' || (a.targetStudents && a.targetStudents.includes(s.id)));
    const initialCount = rel.length;
    if (initialCount === 0) { acc[s.id] = { label: "미부여", percent: "0.0" }; return acc; }
    const exemptCount = rel.filter(item => submissionData[`${s.id}-${item.id}`]?.status === 'exempt').length;
    const effectiveTotal = initialCount - exemptCount;
    if (effectiveTotal <= 0) { acc[s.id] = { label: "제외됨", percent: "100.0" }; return acc; }
    const actualStages = statusOrder.slice(1).filter(st => st !== 'exempt');
    if (!labels) {
      for (let i = 0; i < actualStages.length; i++) {
        const stage = actualStages[i];
        const countReached = rel.filter(item => {
          const status = submissionData[`${s.id}-${item.id}`]?.status || 'not_started';
          if (status === 'exempt') return false;
          return statusOrder.indexOf(status) >= statusOrder.indexOf(stage);
        }).length;
        const pct = ((countReached / effectiveTotal) * 100).toFixed(1);
        if (pct !== "100.0") { acc[s.id] = { label: `${i + 1}회독`, percent: pct }; return acc; }
        if (i === actualStages.length - 1) { acc[s.id] = { label: `${actualStages.length}회독`, percent: "100.0" }; return acc; }
      }
      acc[s.id] = { label: "1회독", percent: "0.0" }; return acc;
    }
    let displayLabel = labels[actualStages[0]] || "진행 중";
    let displayPercent = "0.0";
    for (let i = 0; i < actualStages.length; i++) {
      const currentStageKey = actualStages[i];
      const countReached = rel.filter(item => {
        const status = submissionData[`${s.id}-${item.id}`]?.status || 'not_started';
        if (status === 'exempt') return false;
        return statusOrder.indexOf(status) >= statusOrder.indexOf(currentStageKey);
      }).length;
      const percent = ((countReached / effectiveTotal) * 100).toFixed(1);
      displayLabel = labels[currentStageKey] || "진행 중";
      displayPercent = percent;
      if (percent !== "100.0") break;
      if (i < actualStages.length - 1) continue;
    }
    acc[s.id] = { label: displayLabel, percent: displayPercent };
    return acc;
  }, {});
};

const getTargetStudentNamesLocal = (students, ids) =>
  students.filter(s => ids?.includes(s.id)).map(s => s.name).join(', ') || '없음';

// --- Shared UI Components ---
const BufferedInput = ({ value, onSave, placeholder, className, type = "text", disabled = false }) => {
  const [temp, setTemp] = useState(value || '');
  useEffect(() => { setTemp(value || ''); }, [value]);
  const handleBlur = () => { if (!disabled && temp !== value) onSave(temp); };
  return (
    <input type={type} value={temp} onChange={(e) => setTemp(e.target.value)} onBlur={handleBlur} disabled={disabled}
      onKeyDown={(e) => e.key === 'Enter' && e.target.blur()} placeholder={placeholder} className={`${className} select-text`} />
  );
};

const BufferedTextarea = ({ value, onSave, placeholder, className, disabled = false }) => {
  const [temp, setTemp] = useState(value || '');
  useEffect(() => { setTemp(value || ''); }, [value]);
  const handleBlur = () => { if (!disabled && temp !== value) onSave(temp); };
  return (
    <textarea value={temp} onChange={(e) => setTemp(e.target.value)} onBlur={handleBlur} disabled={disabled}
      placeholder={placeholder} className={`${className} select-text`} />
  );
};

// =====================================================================
// MAIN APP
// =====================================================================
export default function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('matrix');

  const windowWidth = useWindowSize();
  const isMobile = windowWidth < 768;

  // RBAC
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userRole, setUserRole] = useState(null);
  const [myStudentId, setMyStudentId] = useState(null);

  // Site settings
  const [siteTitle, setSiteTitle] = useState('English Academy');
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [siteColor, setSiteColor] = useState('#1d4ed8');
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [siteIconName, setSiteIconName] = useState('Languages');
  const [iconSearchInput, setIconSearchInput] = useState('');
  const [darkMode, setDarkMode] = useState(false);

  // Auth
  const [showPasswordInput, setShowPasswordInput] = useState(null);
  const [passwordInput, setPasswordInput] = useState('');
  const [studentCodeInput, setStudentCodeInput] = useState('');
  const [loginError, setLoginError] = useState(false);
  const [autoLogin, setAutoLogin] = useState(false);
  // 마스터 코드 앱 내 변경
  const [masterCode, setMasterCode] = useState('1234');
  const [showMasterCodeEdit, setShowMasterCodeEdit] = useState(false);
  const [newMasterCodeInput, setNewMasterCodeInput] = useState('');

  // Core Data
  const [students, setStudents] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [memoItems, setMemoItems] = useState([]);
  const [submissions, setSubmissions] = useState({});
  const [memoSubmissions, setMemoSubmissions] = useState({});
  const [tests, setTests] = useState([]);
  const [testScores, setTestScores] = useState({});
  const [attendance, setAttendance] = useState({});
  const [attendanceNotes, setAttendanceNotes] = useState({});
  const [makeupDates, setMakeupDates] = useState({});
  const [studentNotes, setStudentNotes] = useState({});
  const [studentScoreData, setStudentScoreData] = useState({});
  const [studentGoals, setStudentGoals] = useState({});

  // 과목 - 동적 (Firebase 저장, 빈값 초기화)
  const [subjects, setSubjects] = useState([]);
  const [editingSubjects, setEditingSubjects] = useState(false);
  const [subjectInput, setSubjectInput] = useState('');

  // 암기 섹션 - 영어 앱 전용 (선생님이 추가/삭제)
  const [memoSections, setMemoSections] = useState([]);
  const [editingMemoSections, setEditingMemoSections] = useState(false);
  const [memoSectionInput, setMemoSectionInput] = useState('');
  const [memoSectionFilter, setMemoSectionFilter] = useState('all');

  // 반 설정
  const [classrooms, setClassrooms] = useState([]);
  const [activeClassFilter, setActiveClassFilter] = useState('all');
  const [editingClassrooms, setEditingClassrooms] = useState(false);
  const [classroomInput, setClassroomInput] = useState('');

  // 진도 관리
  const [progressPlans, setProgressPlans] = useState([]);
  const [progressCalMonth, setProgressCalMonth] = useState(() => {
    const k = new Date(Date.now() + 9*60*60*1000);
    return k.toISOString().slice(0, 7);
  });
  const [progressSelectedDate, setProgressSelectedDate] = useState(() => {
    return new Date(Date.now() + 9*60*60*1000).toISOString().split('T')[0];
  });
  const [newPlan, setNewPlan] = useState({ subject: '', unit: '', memo: '', lessonType: '진도' });
  const [editPlanId, setEditPlanId] = useState(null);
  const [editPlanData, setEditPlanData] = useState(null);

  // 매트릭스 필터/정렬
  const [matrixHideDone, setMatrixHideDone] = useState(false);
  const [matrixStatusFilter, setMatrixStatusFilter] = useState('all');
  const [matrixSchoolFilter, setMatrixSchoolFilter] = useState('all');
  const [matrixGroupFilter, setMatrixGroupFilter] = useState('all');
  const [matrixSort, setMatrixSort] = useState('custom');
  const [collapsedStudents, setCollapsedStudents] = useState({});
  const [hiddenStudents, setHiddenStudents] = useState({});
  const [studentSearchQuery, setStudentSearchQuery] = useState('');

  // 학생 관리
  const [studentSort, setStudentSort] = useState('custom');
  const [editStudentId, setEditStudentId] = useState(null);
  const [editStudentData, setEditStudentData] = useState({ name: '', studentCode: '', homeroomTeacher: '', highSchool: '', group: '', classroomId: '' });
  const [bulkStudentInput, setBulkStudentInput] = useState('');
  const [dragState, setDragState] = useState({ type: null, fromId: null, overId: null });
  const [confirmDelete, setConfirmDelete] = useState(null);

  // 항목 등록
  const [regCategory, setRegCategory] = useState('assignment');
  // subject 빈값으로 초기화 (과목 미선택 방지)
  const [newAssignment, setNewAssignment] = useState({ title: '', subject: '', level: '기본', type: 'all', targetStudents: [], deadline: '', memoSection: '' });
  const [editItemId, setEditItemId] = useState(null);
  const [editItemData, setEditItemData] = useState(null);

  // 시험
  const [newTest, setNewTest] = useState({
    title: '', source: '', testDifficulty: '', difficulty: '중', description: '',
    date: new Date(Date.now() + 9*60*60*1000).toISOString().split('T')[0],
    scales: DEFAULT_GRADE_SCALES, testType: '중간 테스트', mcCount: '', saCount: ''
  });
  const [selectedTest, setSelectedTest] = useState(null);
  const [isTestEditMode, setIsTestEditMode] = useState(false);
  const [testSectionCollapsed, setTestSectionCollapsed] = useState({ main: false, mini: false });
  const [selectedReportTests, setSelectedReportTests] = useState({});

  // 출결
  const [currentDate, setCurrentDate] = useState(() => {
    const k = new Date(Date.now() + 9*60*60*1000);
    return k.toISOString().split('T')[0];
  });

  // UI
  const [openBulkMenu, setOpenBulkMenu] = useState(null);
  const [bulkDatePopup, setBulkDatePopup] = useState(null);
  const [bulkSelectedStatus, setBulkSelectedStatus] = useState(null);
  const [bulkSelectedDate, setBulkSelectedDate] = useState(() => {
    return new Date(Date.now() + 9*60*60*1000).toISOString().split('T')[0];
  });
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [statusMenu, setStatusMenu] = useState(null);
  const [inlineDateEditKey, setInlineDateEditKey] = useState(null);

  // 리포트
  const [reportRange, setReportRange] = useState({ from: '', to: '' });
  const [reportText, setReportText] = useState('');
  const [aiAnalysis, setAiAnalysis] = useState('');
  const [aiLoading, setAiLoading] = useState(false);
  const [reportGenerated, setReportGenerated] = useState(false);
  const [reportViewMode, setReportViewMode] = useState('summary');
  const [collapsedWeeks, setCollapsedWeeks] = useState({});
  const [weakUnitOpen, setWeakUnitOpen] = useState(true);

  // --- 로컬스토리지 로그인 유지 ---
  useEffect(() => {
    const saved = localStorage.getItem(`${APP_ID}_login`);
    if (saved) {
      try {
        const { role, studentId } = JSON.parse(saved);
        setUserRole(role);
        setMyStudentId(studentId || null);
        setIsLoggedIn(true);
        setAutoLogin(true);
      } catch {}
    }
  }, []);

  // --- Handlers ---
  const handleLogin = (role, sId = null, keepLogin = autoLogin) => {
    setUserRole(role);
    setMyStudentId(sId);
    setIsLoggedIn(true);
    if (keepLogin) {
      localStorage.setItem(`${APP_ID}_login`, JSON.stringify({ role, studentId: sId }));
    } else {
      localStorage.removeItem(`${APP_ID}_login`);
    }
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setUserRole(null);
    setMyStudentId(null);
    setActiveTab('matrix');
    localStorage.removeItem(`${APP_ID}_login`);
  };

  // URL 파라미터 자동 로그인
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const urlCode = params.get('code');
    if (!urlCode) return;
    if (urlCode === masterCode) { handleLogin('master'); }
    else if (urlCode === '26350') { handleLogin('teacher'); }
    const url = new URL(window.location.href);
    url.searchParams.delete('code');
    window.history.replaceState({}, '', url.toString());
  }, [masterCode]);

  const handleLoginAttempt = (role) => {
    setShowPasswordInput(role);
    setPasswordInput('');
    setStudentCodeInput('');
    setLoginError(false);
  };

  const handleAuthSubmit = () => {
    if (showPasswordInput === 'student') {
      const found = students.find(s => s.studentCode && s.studentCode.trim() === studentCodeInput.trim());
      if (found) { handleLogin('student', found.id); setShowPasswordInput(null); }
      else { setLoginError(true); }
    } else if (showPasswordInput === 'master') {
      if (passwordInput === masterCode) { handleLogin('master'); setShowPasswordInput(null); }
      else { setLoginError(true); }
    } else if (showPasswordInput === 'teacher') {
      if (passwordInput === '26350') { handleLogin('teacher'); setShowPasswordInput(null); }
      else { setLoginError(true); }
    }
  };

  // 마스터 코드 변경
  const saveMasterCode = async () => {
    if (!newMasterCodeInput.trim()) return;
    await setDoc(doc(db, 'artifacts', APP_ID, 'public', 'data', 'settings', 'config'), { masterCode: newMasterCodeInput.trim() }, { merge: true });
    setMasterCode(newMasterCodeInput.trim());
    setShowMasterCodeEdit(false);
    setNewMasterCodeInput('');
  };

  // 사이트 타이틀/색상
  const saveSiteTitle = async (newTitle) => {
    if (userRole !== 'master') return;
    setSiteTitle(newTitle);
    await setDoc(doc(db, 'artifacts', APP_ID, 'public', 'data', 'settings', 'config'), { siteTitle: newTitle }, { merge: true });
    setIsEditingTitle(false);
  };
  const saveSiteColor = async (color) => {
    if (userRole !== 'master') return;
    setSiteColor(color);
    await setDoc(doc(db, 'artifacts', APP_ID, 'public', 'data', 'settings', 'config'), { siteColor: color }, { merge: true });
    setShowColorPicker(false);
  };

  // 사이트 아이콘 저장
  const saveSiteIcon = async (iconName) => {
    if (userRole !== 'master') return;
    setSiteIconName(iconName);
    await setDoc(doc(db, 'artifacts', APP_ID, 'public', 'data', 'settings', 'config'), { siteIconName: iconName }, { merge: true });
  };

  // 다크모드 저장
  const saveDarkMode = async (val) => {
    if (userRole !== 'master') return;
    setDarkMode(val);
    await setDoc(doc(db, 'artifacts', APP_ID, 'public', 'data', 'settings', 'config'), { darkMode: val }, { merge: true });
  };

  // 과목 저장
  const saveSubjects = async (newList) => {
    setSubjects(newList);
    await setDoc(doc(db, 'artifacts', APP_ID, 'public', 'data', 'settings', 'config'), { subjects: newList }, { merge: true });
  };

  // 암기 섹션 저장
  const saveMemoSections = async (newList) => {
    setMemoSections(newList);
    await setDoc(doc(db, 'artifacts', APP_ID, 'public', 'data', 'settings', 'config'), { memoSections: newList }, { merge: true });
  };

  // 학생 노트
  const saveStudentNote = async (studentId, note) => {
    if (userRole !== 'master') return;
    await setDoc(doc(db, 'artifacts', APP_ID, 'public', 'data', 'notes', studentId), { note }, { merge: true });
  };

  // 상태 변경
  const handleStatusSelect = async (sid, itemId, category, nextStatus) => {
    if (userRole !== 'master') return;
    const key = `${sid}-${itemId}`;
    const coll = category === 'assignment' ? 'submissions' : 'memoSubmissions';
    const date = (nextStatus === 'completed' || nextStatus === 'round_4') ? new Date().toISOString().split('T')[0] : null;
    await setDoc(doc(db, 'artifacts', APP_ID, 'public', 'data', coll, key), { status: nextStatus, completionDate: date }, { merge: true });
    setStatusMenu(null);
  };

  const bulkUpdateStatus = async (item, nextStatus, category) => {
    if (userRole !== 'master') return;
    const batch = writeBatch(db);
    const coll = category === 'assignment' ? 'submissions' : 'memoSubmissions';
    const actualDate = (nextStatus === 'completed' || nextStatus === 'round_4') ? bulkSelectedDate : null;
    if (item.isBulkStudent) {
      (item.items || []).forEach(as => {
        batch.set(doc(db, 'artifacts', APP_ID, 'public', 'data', coll, `${item.studentId}-${as.id}`), { status: nextStatus, completionDate: actualDate }, { merge: true });
      });
    } else {
      students.forEach(s => {
        if (item.type === 'all' || (item.targetStudents && item.targetStudents.includes(s.id))) {
          batch.set(doc(db, 'artifacts', APP_ID, 'public', 'data', coll, `${s.id}-${item.id}`), { status: nextStatus, completionDate: actualDate }, { merge: true });
        }
      });
    }
    await batch.commit();
    setOpenBulkMenu(null);
    setBulkDatePopup(null);
  };

  // 항목 추가 (과목 미선택 시 차단)
  const addAssignment = async () => {
    if (userRole !== 'master') return;
    if (!newAssignment.title.trim()) return;
    if (!newAssignment.subject) {
      alert('과목을 먼저 선택해 주세요.');
      return;
    }
    const coll = regCategory === 'assignment' ? 'assignments' : 'memoItems';
    const id = (regCategory === 'assignment' ? 'a' : 'm') + Date.now();
    const list = regCategory === 'assignment' ? assignments : memoItems;
    const sortOrder = list.length > 0 ? Math.max(...list.map(x => x.sortOrder || 0)) + 1 : 0;
    await setDoc(doc(db, 'artifacts', APP_ID, 'public', 'data', coll, id), { ...newAssignment, sortOrder, category: regCategory });
    setNewAssignment(prev => ({ ...prev, title: '', subject: '', memoSection: '' }));
  };

  const addTest = async () => {
    if (userRole !== 'master' || !newTest.title.trim()) return;
    await setDoc(doc(db, 'artifacts', APP_ID, 'public', 'data', 'tests', 't' + Date.now()), { ...newTest });
    setNewTest({
      title: '', source: '', testDifficulty: '', difficulty: '중', description: '',
      date: new Date(Date.now() + 9*60*60*1000).toISOString().split('T')[0],
      scales: DEFAULT_GRADE_SCALES, testType: newTest.testType, mcCount: '', saCount: '', questions: []
    });
  };

  const updateTestDetails = async () => {
    if (userRole !== 'master' || !selectedTest) return;
    await setDoc(doc(db, 'artifacts', APP_ID, 'public', 'data', 'tests', selectedTest.id), selectedTest, { merge: true });
    setIsTestEditMode(false);
    setSelectedTest(null);
  };

  const saveEditItem = async () => {
    if (userRole !== 'master' || !editItemData?.title.trim()) return;
    if (!editItemData.subject) { alert('과목을 선택해 주세요.'); return; }
    const coll = editItemData.category === 'assignment' ? 'assignments' : 'memoItems';
    await setDoc(doc(db, 'artifacts', APP_ID, 'public', 'data', coll, editItemId), editItemData, { merge: true });
    setEditItemId(null);
    setEditItemData(null);
  };

  const deleteItem = async (coll, id) => {
    if (userRole !== 'master') return;
    await deleteDoc(doc(db, 'artifacts', APP_ID, 'public', 'data', coll, id));
  };

  const reorderList = async (type, fromId, toId) => {
    if (userRole !== 'master' || fromId === toId) return;
    let list, coll;
    if (type === 'assignment') { list = assignments; coll = 'assignments'; }
    else if (type === 'memo') { list = memoItems; coll = 'memoItems'; }
    else if (type === 'test') { list = tests; coll = 'tests'; }
    else if (type === 'student') { list = students; coll = 'students'; }
    else return;
    const fromIdx = list.findIndex(x => x.id === fromId);
    const toIdx = list.findIndex(x => x.id === toId);
    if (fromIdx < 0 || toIdx < 0) return;
    const newList = [...list];
    const [moved] = newList.splice(fromIdx, 1);
    newList.splice(toIdx, 0, moved);
    const batch = writeBatch(db);
    newList.forEach((item, i) => {
      batch.set(doc(db, 'artifacts', APP_ID, 'public', 'data', coll, item.id), { sortOrder: i }, { merge: true });
    });
    await batch.commit();
  };

  const saveStudentDetails = async () => {
    if (userRole !== 'master' || !editStudentId || !editStudentData.name.trim()) return;
    await setDoc(doc(db, 'artifacts', APP_ID, 'public', 'data', 'students', editStudentId), editStudentData, { merge: true });
    setEditStudentId(null);
  };

  const updateAttendance = async (sid, type) => {
    if (userRole !== 'master') return;
    const key = `${sid}-${currentDate}`;
    const cur = attendance[key] || { status: 'none', makeup: false };
    const update = type === 'makeup' ? { ...cur, makeup: !cur.makeup } : { ...cur, status: cur.status === type ? 'none' : type };
    await setDoc(doc(db, 'artifacts', APP_ID, 'public', 'data', 'attendance', key), update);
  };

  const updateMakeupDateValue = async (sid, attDate, mDate) => {
    if (userRole !== 'master') return;
    await setDoc(doc(db, 'artifacts', APP_ID, 'public', 'data', 'makeupDates', `${sid}-${attDate}`), { date: mDate });
  };

  const handleBulkAttendanceToggle = async () => {
    if (userRole !== 'master' || students.length === 0) return;
    const areAllPresent = students.every(s => attendance[`${s.id}-${currentDate}`]?.status === 'present');
    const nextStatus = areAllPresent ? 'none' : 'present';
    const batch = writeBatch(db);
    students.forEach(s => {
      const key = `${s.id}-${currentDate}`;
      const cur = attendance[key] || { status: 'none', makeup: false };
      batch.set(doc(db, 'artifacts', APP_ID, 'public', 'data', 'attendance', key), { ...cur, status: nextStatus }, { merge: true });
    });
    await batch.commit();
  };

  const addPlan = async () => {
    if (userRole !== 'master' || !newPlan.unit.trim()) return;
    if (!newPlan.subject) { alert('과목을 먼저 선택해 주세요.'); return; }
    const id = 'p' + Date.now();
    await setDoc(doc(db, 'artifacts', APP_ID, 'public', 'data', 'progressPlans', id), {
      ...newPlan, date: progressSelectedDate, done: false
    });
    setNewPlan(prev => ({ ...prev, unit: '', memo: '', subject: '' }));
  };

  const togglePlanDone = async (plan) => {
    if (userRole !== 'master') return;
    await setDoc(doc(db, 'artifacts', APP_ID, 'public', 'data', 'progressPlans', plan.id), { done: !plan.done }, { merge: true });
  };

  const saveEditPlan = async () => {
    if (userRole !== 'master' || !editPlanId || !editPlanData?.unit.trim()) return;
    await setDoc(doc(db, 'artifacts', APP_ID, 'public', 'data', 'progressPlans', editPlanId), editPlanData, { merge: true });
    setEditPlanId(null);
    setEditPlanData(null);
  };

  const deletePlan = async (id) => {
    if (userRole !== 'master') return;
    await deleteDoc(doc(db, 'artifacts', APP_ID, 'public', 'data', 'progressPlans', id));
  };

  const updateCompletionDate = async (sid, itemId, date, category) => {
    if (userRole !== 'master') return;
    const coll = category === 'assignment' ? 'submissions' : 'memoSubmissions';
    await setDoc(doc(db, 'artifacts', APP_ID, 'public', 'data', coll, `${sid}-${itemId}`), { completionDate: date }, { merge: true });
    setInlineDateEditKey(null);
  };

  // --- Firebase Sync ---
  useEffect(() => {
    let unsubscribers = [];
    let loadingDone = false;
    const initApp = async () => {
      try {
        await signInAnonymously(auth);
        onAuthStateChanged(auth, (u) => {
          setUser(u);
          if (u) {
            const basePath = ['artifacts', APP_ID, 'public', 'data'];
            unsubscribers.push(onSnapshot(doc(db, ...basePath, 'settings', 'config'), snap => {
              if (snap.exists()) {
                const d = snap.data();
                setSiteTitle(d.siteTitle || 'English Academy');
                if (d.siteColor) setSiteColor(d.siteColor);
                if (d.subjects) setSubjects(d.subjects);
                if (d.memoSections) setMemoSections(d.memoSections);
                if (d.masterCode) setMasterCode(d.masterCode);
                if (d.siteIconName) setSiteIconName(d.siteIconName);
                if (d.darkMode !== undefined) setDarkMode(d.darkMode);
              }
            }));
            unsubscribers.push(onSnapshot(query(collection(db, ...basePath, 'students')), s =>
              setStudents(s.docs.map(d => ({ id: d.id, ...d.data() })).sort((a, b) => {
                if (a.sortOrder != null && b.sortOrder != null) return a.sortOrder - b.sortOrder;
                if (a.sortOrder != null) return -1;
                if (b.sortOrder != null) return 1;
                return a.name.localeCompare(b.name, 'ko');
              }))
            ));
            unsubscribers.push(onSnapshot(query(collection(db, ...basePath, 'assignments')), s =>
              setAssignments(s.docs.map(d => ({ id: d.id, ...d.data() })).sort((a, b) => (a.sortOrder||0)-(b.sortOrder||0)))
            ));
            unsubscribers.push(onSnapshot(query(collection(db, ...basePath, 'memoItems')), s =>
              setMemoItems(s.docs.map(d => ({ id: d.id, ...d.data() })).sort((a, b) => (a.sortOrder||0)-(b.sortOrder||0)))
            ));
            unsubscribers.push(onSnapshot(query(collection(db, ...basePath, 'submissions')), s => { const d={}; s.docs.forEach(x=>d[x.id]=x.data()); setSubmissions(d); }));
            unsubscribers.push(onSnapshot(query(collection(db, ...basePath, 'memoSubmissions')), s => { const d={}; s.docs.forEach(x=>d[x.id]=x.data()); setMemoSubmissions(d); }));
            unsubscribers.push(onSnapshot(query(collection(db, ...basePath, 'tests')), s =>
              setTests(s.docs.map(d => ({ id: d.id, ...d.data() })).sort((a,b) => (a.sortOrder||0)-(b.sortOrder||0)))
            ));
            unsubscribers.push(onSnapshot(query(collection(db, ...basePath, 'testScores')), s => { const d={}; s.docs.forEach(x=>d[x.id]=x.data()); setTestScores(d); }));
            unsubscribers.push(onSnapshot(query(collection(db, ...basePath, 'attendance')), s => { const d={}; s.docs.forEach(x=>d[x.id]=x.data()); setAttendance(d); }));
            unsubscribers.push(onSnapshot(query(collection(db, ...basePath, 'attendanceNotes')), s => { const d={}; s.docs.forEach(x=>d[x.id]=x.data().note); setAttendanceNotes(d); }));
            unsubscribers.push(onSnapshot(query(collection(db, ...basePath, 'makeupDates')), s => { const d={}; s.docs.forEach(x=>d[x.id]=x.data().date); setMakeupDates(d); }));
            unsubscribers.push(onSnapshot(query(collection(db, ...basePath, 'notes')), s => { const d={}; s.docs.forEach(x=>d[x.id]=x.data().note); setStudentNotes(d); }));
            unsubscribers.push(onSnapshot(query(collection(db, ...basePath, 'studentScores')), s => { const d={}; s.docs.forEach(x=>d[x.id]=x.data()); setStudentScoreData(d); }));
            unsubscribers.push(onSnapshot(query(collection(db, ...basePath, 'classrooms')), s => setClassrooms(s.docs.map(d => ({ id: d.id, ...d.data() })))));
            unsubscribers.push(onSnapshot(query(collection(db, ...basePath, 'studentGoals')), s => { const d={}; s.docs.forEach(x=>d[x.id]=x.data()); setStudentGoals(d); }));
            unsubscribers.push(onSnapshot(query(collection(db, ...basePath, 'progressPlans')), s => setProgressPlans(s.docs.map(d => ({ id: d.id, ...d.data() })))));
            if (!loadingDone) { loadingDone = true; setLoading(false); }
          }
        });
      } catch (e) {
        console.error(e);
        setLoading(false);
      }
    };
    initApp();
    return () => unsubscribers.forEach(u => u());
  }, []);

  // --- Computed ---
  const visibleStudentsFiltered = useMemo(() => {
    let base = userRole === 'student' && myStudentId
      ? students.filter(s => s.id === myStudentId)
      : activeClassFilter !== 'all'
        ? students.filter(s => s.classroomId === activeClassFilter)
        : students;
    let filtered = base;
    if (matrixSchoolFilter !== 'all') filtered = filtered.filter(s => (s.highSchool||'미설정') === matrixSchoolFilter);
    if (matrixGroupFilter !== 'all') filtered = filtered.filter(s => (s.group||'미설정') === matrixGroupFilter);
    if (matrixStatusFilter === 'incomplete') {
      filtered = filtered.filter(s => {
        const rel = assignments.filter(a => a.type === 'all' || a.targetStudents?.includes(s.id));
        return rel.some(a => ['not_started','in_progress','incomplete_red'].includes(submissions[`${s.id}-${a.id}`]?.status || 'not_started'));
      });
    } else if (matrixStatusFilter === 'completed') {
      filtered = filtered.filter(s => {
        const rel = assignments.filter(a => a.type === 'all' || a.targetStudents?.includes(s.id));
        if (rel.length === 0) return false;
        return rel.every(a => ['completed','exempt'].includes(submissions[`${s.id}-${a.id}`]?.status || 'not_started'));
      });
    }
    const sorted = [...filtered];
    if (matrixSort === 'name') sorted.sort((a,b) => a.name.localeCompare(b.name,'ko'));
    else if (matrixSort === 'school') sorted.sort((a,b) => (a.highSchool||'').localeCompare(b.highSchool||'','ko') || a.name.localeCompare(b.name,'ko'));
    else if (matrixSort === 'group') sorted.sort((a,b) => (a.group||'z').localeCompare(b.group||'z') || a.name.localeCompare(b.name,'ko'));
    return sorted;
  }, [students, userRole, myStudentId, activeClassFilter, matrixSort, matrixSchoolFilter, matrixGroupFilter, matrixStatusFilter, assignments, submissions]);

  const stats = useMemo(() => {
    if (!students.length) return { assign: {}, memo: {}, studentTestAverages: {}, testAverages: {} };
    const assign = calculateRoundProgress(students, assignments, submissions, ASSIGN_STATUS_ORDER, ASSIGN_LABELS);
    const memo = calculateRoundProgress(students, memoItems, memoSubmissions, MEMO_STATUS_ORDER, null);
    const mainTests = tests.filter(t => !t.testType || t.testType === '중간 테스트');
    return {
      assign, memo,
      studentTestAverages: students.reduce((acc, s) => {
        const scs = mainTests.map(t => { const r=testScores[`${s.id}-${t.id}`]; return r?.absent ? null : (r?.score != null ? parseFloat(r.score) : null); }).filter(v => v != null && !isNaN(v));
        acc[s.id] = scs.length ? (scs.reduce((a,b)=>a+b,0)/scs.length).toFixed(1) : "0.0";
        return acc;
      }, {}),
      testAverages: tests.reduce((acc, t) => {
        const scs = students.map(s => { const r=testScores[`${s.id}-${t.id}`]; return r?.absent ? null : (r?.score != null ? parseFloat(r.score) : null); }).filter(v => v != null && !isNaN(v));
        acc[t.id] = scs.length ? (scs.reduce((a,b)=>a+b,0)/scs.length).toFixed(1) : "0.0";
        return acc;
      }, {})
    };
  }, [students, assignments, memoItems, submissions, memoSubmissions, tests, testScores]);

  // --- AI Report ---
  const generateReport = () => {
    const { from, to } = reportRange;
    const fromDate = from || '0000-00-00';
    const toDate = to && to >= from ? to : from || '9999-99-99';
    const inRange = (date) => !date || (date >= fromDate && date <= toDate);
    const lines = [];
    const now = new Date(Date.now()+9*60*60*1000).toISOString().split('T')[0];

    lines.push('===== 학원 영어 학습 종합 리포트 =====');
    lines.push(`생성일: ${now}  |  기간: ${from||'전체'} ~ ${to||'전체'}`);
    lines.push(`학생 수: ${students.length}명`);
    lines.push('');

    // ── 1. 과제 현황 ──
    lines.push('[과제 현황]');
    const rangedAssign = assignments.filter(a => inRange(a.deadline));
    if (!rangedAssign.length) {
      lines.push('  (해당 기간 과제 없음)');
    } else {
      const completedAll = rangedAssign.filter(a => students.every(s => {
        if (!(a.type==='all'||(a.targetStudents&&a.targetStudents.includes(s.id)))) return true;
        const st = submissions[`${s.id}-${a.id}`]?.status||'not_started';
        return st==='completed'||st==='exempt';
      }));
      lines.push(`  완료된 과제: ${completedAll.length}/${rangedAssign.length}개`);
      rangedAssign.forEach(a => {
        const targets = students.filter(s => a.type==='all'||(a.targetStudents&&a.targetStudents.includes(s.id)));
        const done = targets.filter(s => ['completed','exempt'].includes(submissions[`${s.id}-${a.id}`]?.status||'not_started')).length;
        const pct = targets.length ? Math.round(done/targets.length*100) : 0;
        lines.push(`  • [${a.subject||'-'}] ${a.title} — 완료율 ${pct}% (${done}/${targets.length}명)${a.deadline?` 마감:${a.deadline}`:''}`);
        targets.filter(s => !['completed','exempt'].includes(submissions[`${s.id}-${a.id}`]?.status||'not_started'))
          .forEach(s => lines.push(`    ⚠ 미완료: ${s.name}`));
      });
    }
    lines.push('');

    // ── 2. 암기 현황 ──
    lines.push('[암기 현황]');
    if (!memoItems.length) {
      lines.push('  (암기 항목 없음)');
    } else {
      memoItems.forEach(m => {
        const targets = students.filter(s => m.type==='all'||(m.targetStudents&&m.targetStudents.includes(s.id)));
        const r4 = targets.filter(s => memoSubmissions[`${s.id}-${m.id}`]?.status==='round_4').length;
        const pct = targets.length ? Math.round(r4/targets.length*100) : 0;
        lines.push(`  • [${m.subject||'-'}${m.memoSection?` / ${m.memoSection}`:''}] ${m.title} — 4회독 완료 ${pct}% (${r4}/${targets.length}명)`);
        targets.forEach(s => {
          const st = memoSubmissions[`${s.id}-${m.id}`]?.status||'not_started';
          if (st!=='round_4') lines.push(`    ${s.name}: ${MEMO_STATUS_CONFIG[st]?.label||'-'}`);
        });
      });
    }
    lines.push('');

    // ── 3. 시험 성적 ──
    lines.push('[시험 성적]');
    const rangedTests = tests.filter(t => inRange(t.date));
    if (!rangedTests.length) {
      lines.push('  (해당 기간 시험 없음)');
    } else {
      rangedTests.forEach(t => {
        const scores = students.map(s => {
          const r = testScores[`${s.id}-${t.id}`]||{};
          return r.absent ? null : (r.score!=null ? parseFloat(r.score) : null);
        }).filter(v => v!=null && !isNaN(v));
        const avg = scores.length ? (scores.reduce((a,b)=>a+b,0)/scores.length).toFixed(1) : '-';
        const max2 = scores.length ? Math.max(...scores) : '-';
        const min2 = scores.length ? Math.min(...scores) : '-';
        lines.push(`  • ${t.title} (${t.date}${t.maxScore?` / 만점 ${t.maxScore}점`:''}) — 평균 ${avg}점 | 최고 ${max2}점 | 최저 ${min2}점`);
        students.forEach(s => {
          const r = testScores[`${s.id}-${t.id}`]||{};
          const sc = r.absent ? (r.absent==='absent'?'결시':'비대상') : r.score!=null ? `${r.score}점` : '미입력';
          const diff = (!r.absent && r.score!=null && avg!=='-') ? ` (평균대비 ${(parseFloat(r.score)-parseFloat(avg))>=0?'+':''}${(parseFloat(r.score)-parseFloat(avg)).toFixed(1)})` : '';
          lines.push(`    ${s.name}: ${sc}${diff}`);
        });
      });
    }
    lines.push('');

    // ── 4. 출결 현황 ──
    lines.push('[출결 현황]');
    const attDates = Object.keys(attendance)
      .map(k => k.split('-').slice(1).join('-'))
      .filter((d,i,a) => a.indexOf(d)===i && inRange(d))
      .sort();
    if (!attDates.length) {
      lines.push('  (해당 기간 출결 기록 없음)');
    } else {
      students.forEach(s => {
        const present = attDates.filter(d => attendance[`${s.id}-${d}`]?.status==='present').length;
        const late = attDates.filter(d => attendance[`${s.id}-${d}`]?.status==='late').length;
        const absent2 = attDates.filter(d => attendance[`${s.id}-${d}`]?.status==='absent').length;
        const total = attDates.length;
        const rate = total ? Math.round(present/total*100) : 0;
        lines.push(`  ${s.name}: 출석 ${present}회 / 지각 ${late}회 / 결석 ${absent2}회 (출석률 ${rate}%)`);
      });
    }
    lines.push('');

    // ── 5. 진도 현황 ──
    lines.push('[진도 현황]');
    const rangedPlans = progressPlans.filter(p => inRange(p.date));
    if (!rangedPlans.length) {
      lines.push('  (해당 기간 진도 기록 없음)');
    } else {
      const done2 = rangedPlans.filter(p=>p.done).length;
      lines.push(`  수업 진행: ${done2}/${rangedPlans.length}회 완료`);
      // 과목별
      const subMap = {};
      rangedPlans.forEach(p => {
        const sub = p.subject||'미분류';
        if (!subMap[sub]) subMap[sub]={total:0,done:0};
        subMap[sub].total++;
        if (p.done) subMap[sub].done++;
      });
      Object.entries(subMap).forEach(([sub,st]) => {
        lines.push(`  • ${sub}: ${st.done}/${st.total}회`);
      });
      rangedPlans.slice(0,10).forEach(p => {
        lines.push(`  ${p.date} [${p.lessonType||'진도'}${p.subject?` / ${p.subject}`:''}] ${p.unit}${p.done?' ✓':''}`);
      });
      if (rangedPlans.length > 10) lines.push(`  ... 외 ${rangedPlans.length-10}건`);
    }
    lines.push('');
    lines.push('================================');

    setReportText(lines.join('\n'));
    setReportGenerated(true);
    setAiAnalysis('');
  };

  const requestAiAnalysis = async () => {
    if (!reportText || aiLoading) return;
    setAiLoading(true);
    setAiAnalysis('');
    try {
      const res = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: 'claude-sonnet-4-20250514',
          max_tokens: 1000,
          messages: [{ role: 'user', content: `당신은 영어 학원 학습 데이터 분석 전문가입니다. 아래 학습 리포트를 분석하고 다음 항목을 한국어로 작성해 주세요:\n\n1. 전체 학습 현황 요약 (2-3줄)\n2. 잘하고 있는 점\n3. 개선이 필요한 점 (구체적 학생명과 항목 포함)\n4. 다음 수업을 위한 액션 아이템 3가지\n5. 출결/진도 특이사항\n\n리포트:\n${reportText}` }]
        })
      });
      const data = await res.json();
      setAiAnalysis((data.content||[]).map(b=>b.text||'').join('') || '분석 결과를 받아오지 못했습니다.');
    } catch (e) {
      setAiAnalysis('AI 분석 중 오류: ' + e.message);
    }
    setAiLoading(false);
  };

  // ==========================================================
  // LOADING
  // ==========================================================
  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50">
      <Loader2 className="animate-spin text-blue-600 w-12 h-12" />
    </div>
  );

  // ==========================================================
  // LOGIN SCREEN
  // ==========================================================
  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-slate-100 flex items-center justify-center p-4 font-sans text-slate-900 font-black">
        <SiteColorStyle color={siteColor} dark={darkMode} />
        <div className="w-full max-w-lg bg-white rounded-[3.5rem] shadow-2xl p-8 md:p-12 border border-slate-200 animate-in fade-in zoom-in-95 duration-500 overflow-y-auto max-h-[95vh]">
          <div className="flex flex-col items-center mb-10 text-center">
            <div className="rounded-[2.2rem] text-white mb-6 shadow-2xl p-6" style={{background:siteColor}}>
              {(() => {
                if (siteIconName.startsWith('__custom__')) {
                  return <span className="text-white font-black leading-none" style={{fontSize:'3rem'}}>{siteIconName.replace('__custom__','')}</span>;
                }
                const ic = ICON_LIST.find(i => i.name === siteIconName);
                return ic ? React.createElement(ic.component, {size:48}) : React.createElement(Languages, {size:48});
              })()}
            </div>
            <h1 className="text-3xl font-black text-slate-800 uppercase tracking-tighter">{siteTitle}</h1>
            <p className="text-slate-400 text-sm font-bold uppercase tracking-widest mt-3">시스템 접속 권한 인증</p>
          </div>
          <div className="space-y-4 max-w-sm mx-auto">
            <button onClick={() => handleLoginAttempt('master')}
              className="w-full flex items-center justify-between p-6 rounded-[1.8rem] text-white shadow-lg transition-all active:scale-95"
              style={{background:siteColor}}>
              <div className="flex items-center gap-4"><ShieldCheck size={24} /><div><p className="font-black text-lg leading-none">마스터 로그인</p><p className="text-xs opacity-80 font-medium mt-1">관리 및 모든 수정 권한</p></div></div>
              <ChevronRight size={20} className="opacity-40" />
            </button>
            <button onClick={() => handleLoginAttempt('teacher')}
              className="w-full flex items-center justify-between p-6 bg-white border-2 rounded-[1.8rem] shadow-sm transition-all active:scale-95"
              style={{color:siteColor, borderColor:siteColor+'33'}}>
              <div className="flex items-center gap-4"><UserCog size={24} /><div><p className="font-black text-lg leading-none">선생님 / 실장님</p><p className="text-xs text-slate-400 font-medium mt-1">전체 조회 전용 모드</p></div></div>
              <ChevronRight size={20} className="opacity-40" />
            </button>
            <div className="relative py-4"><div className="absolute inset-0 flex items-center px-4"><div className="w-full border-t border-slate-100"></div></div><div className="relative flex justify-center text-[10px] uppercase font-black text-slate-300 tracking-[0.3em]">Student Portal</div></div>
            <button onClick={() => handleLoginAttempt('student')}
              className="w-full flex items-center justify-between p-6 bg-emerald-600 rounded-[1.8rem] text-white shadow-lg hover:bg-emerald-700 transition-all active:scale-95">
              <div className="flex items-center gap-4"><Fingerprint size={24} /><div><p className="font-black text-lg">학생 / 학부모 포털</p><p className="text-xs text-emerald-100 font-medium mt-1">학생 코드로 접속</p></div></div>
              <ChevronRight size={20} className="opacity-40" />
            </button>

            {/* 자동 로그인 체크박스 */}
            <label className="flex items-center justify-center gap-3 py-3 cursor-pointer select-none group">
              <div
                onClick={() => setAutoLogin(v => !v)}
                className={"w-5 h-5 rounded-md border-2 flex items-center justify-center transition-all flex-shrink-0 " + (autoLogin ? "border-transparent" : "border-slate-300 bg-white")}
                style={autoLogin ? {background: siteColor} : {}}
              >
                {autoLogin && <Check size={13} className="text-white" strokeWidth={3} />}
              </div>
              <span className="text-sm font-black text-slate-500 group-hover:text-slate-700 transition-colors">
                자동 로그인 <span className="text-[10px] font-bold text-slate-400">(새로고침해도 로그인 유지)</span>
              </span>
            </label>
          </div>
        </div>

        {showPasswordInput && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center p-6 bg-slate-900/80 backdrop-blur-md animate-in fade-in duration-300">
            <div className="w-full max-w-sm bg-white rounded-[2.8rem] p-10 shadow-2xl animate-in zoom-in-95">
              <div className="flex flex-col items-center text-center mb-8">
                <div className={`p-4 rounded-2xl mb-4 ${showPasswordInput === 'student' ? 'bg-emerald-100 text-emerald-600' : showPasswordInput === 'master' ? 'bg-blue-100 text-blue-600' : 'bg-orange-100 text-orange-600'}`}>
                  {showPasswordInput === 'student' ? <Fingerprint size={32} /> : <KeyRound size={32} />}
                </div>
                <h3 className="text-xl font-black text-slate-800">{showPasswordInput === 'student' ? 'Student' : showPasswordInput === 'master' ? 'Master' : 'Manager'} 인증</h3>
                <p className="text-sm text-slate-400 font-bold mt-1">정보를 입력하세요.</p>
              </div>
              <div className="space-y-4">
                <input
                  type={showPasswordInput === 'student' ? 'text' : 'password'}
                  autoFocus
                  placeholder={showPasswordInput === 'student' ? "학생 코드" : "Password"}
                  value={showPasswordInput === 'student' ? studentCodeInput : passwordInput}
                  onChange={(e) => { if (showPasswordInput === 'student') setStudentCodeInput(e.target.value); else setPasswordInput(e.target.value); setLoginError(false); }}
                  onKeyDown={(e) => e.key === 'Enter' && handleAuthSubmit()}
                  className={`w-full p-4 bg-slate-50 rounded-2xl border-2 text-center text-xl font-black tracking-widest outline-none transition-all ${loginError ? 'border-red-500 bg-red-50' : 'border-transparent focus:border-blue-500'}`}
                />
                <div className="grid grid-cols-2 gap-3 pt-2">
                  <button onClick={() => setShowPasswordInput(null)} className="py-4 bg-slate-100 text-slate-400 rounded-2xl font-black transition">취소</button>
                  <button onClick={handleAuthSubmit} className="py-4 text-white rounded-2xl font-black shadow-lg" style={{background: showPasswordInput === 'student' ? '#059669' : siteColor}}>입장</button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  // ==========================================================
  // MAIN APP
  // ==========================================================
  const kstToday = new Date(Date.now()+9*60*60*1000).toISOString().split('T')[0];

  return (
    <ErrorBoundary>
      <SiteColorStyle color={siteColor} dark={darkMode} />
      <div className="min-h-screen bg-slate-50 font-sans text-slate-900 pb-20 overflow-x-hidden font-black">

        {/* HEADER */}
        <header className="text-white shadow-lg sticky top-0 z-40" style={{background:'var(--sc-darker)'}}>
          <div className="max-w-7xl mx-auto px-4 md:px-6 py-4 flex flex-col md:flex-row justify-between items-center gap-3">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-white/20 rounded-lg flex items-center justify-center w-11 h-11">
                {(() => {
                  if (siteIconName.startsWith('__custom__')) {
                    return <span className="text-white font-black text-xl leading-none">{siteIconName.replace('__custom__','')}</span>;
                  }
                  const ic = ICON_LIST.find(i => i.name === siteIconName);
                  return ic ? React.createElement(ic.component, {className:"w-7 h-7"}) : React.createElement(Languages, {className:"w-7 h-7"});
                })()}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  {isEditingTitle && userRole === 'master' ? (
                    <BufferedInput value={siteTitle} onSave={saveSiteTitle} className="bg-blue-900/50 text-white border-none text-xl font-black uppercase tracking-tight px-2 rounded outline-none" />
                  ) : (
                    <div className="flex items-center gap-2 group cursor-pointer" onClick={() => userRole === 'master' && setIsEditingTitle(true)}>
                      <h1 className="text-xl font-black uppercase tracking-tight text-white leading-none">{siteTitle}</h1>
                      {userRole === 'master' && <Edit2 size={14} className="opacity-0 group-hover:opacity-100 transition-opacity" />}
                    </div>
                  )}
                </div>
                <div className="flex items-center gap-2 mt-1 text-[9px]">
                  <span className={`px-2 py-0.5 rounded font-black uppercase border ${userRole === 'master' ? 'bg-blue-500 border-blue-400' : userRole === 'teacher' ? 'bg-amber-500 border-amber-400' : 'bg-emerald-500 border-emerald-400'}`}>{userRole}</span>
                  <p className="text-white/50 tracking-widest uppercase ml-1">v1.0</p>
                  {/* 다크모드 토글 - 모든 역할 */}
                  <button
                    onClick={() => {
                      const next = !darkMode;
                      if (userRole === 'master') saveDarkMode(next);
                      else setDarkMode(next);
                    }}
                    className="flex items-center gap-1 px-2 py-0.5 rounded-lg bg-white/10 hover:bg-white/20 transition-all text-[9px] font-black text-white leading-none ml-1"
                    title={darkMode ? '라이트모드로 전환' : '다크모드로 전환'}
                  >
                    {darkMode ? <Sun size={11}/> : <Moon size={11}/>}
                    {darkMode ? '라이트' : '다크'}
                  </button>
                  {userRole === 'master' && (
                    <div className="relative ml-2">
                      <button onClick={() => setShowColorPicker(v=>!v)} className="flex items-center gap-1 px-2 py-0.5 rounded-lg bg-white/10 hover:bg-white/20 transition-all text-[9px] font-black text-white leading-none">
                        <span style={{background:siteColor}} className="w-3 h-3 rounded-full border border-white/40 inline-block" />색상
                      </button>
                      {showColorPicker && (
                        <div className="absolute top-8 right-0 z-[300] bg-white rounded-2xl shadow-2xl border border-slate-200 p-4 w-72 animate-in zoom-in-95" onClick={e=>e.stopPropagation()}>
                          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">추천 색상</p>
                          <div className="grid grid-cols-5 gap-2 mb-3">
                            {[['#1d4ed8','블루'],['#0f766e','틸'],['#7c3aed','바이올렛'],['#3730a3','인디고'],['#b91c1c','레드'],['#c2410c','오렌지'],['#15803d','그린'],['#1e3a5f','네이비'],['#4a1d96','퍼플'],['#374151','그레이']].map(([c,n])=>(
                              <button key={c} onClick={()=>saveSiteColor(c)} title={n}
                                className="w-9 h-9 rounded-xl border-2 transition-all hover:scale-110 active:scale-95 shadow-sm"
                                style={{background:c, borderColor: siteColor===c?'#fff':'transparent', outline:siteColor===c?'2px solid '+c:'none'}} />
                            ))}
                          </div>
                          <div className="flex gap-2 items-center">
                            <input type="color" value={siteColor} onChange={e=>setSiteColor(e.target.value)} className="w-10 h-10 rounded-xl border-2 border-slate-100 cursor-pointer" />
                            <input type="text" value={siteColor} onChange={e=>{ if(/^#[0-9a-fA-F]{0,6}$/.test(e.target.value)) setSiteColor(e.target.value); }}
                              className="flex-1 px-3 py-2 border-2 border-slate-100 rounded-xl font-mono text-sm font-bold text-slate-700 outline-none" />
                            <button onClick={()=>saveSiteColor(siteColor)} className="px-3 py-2 bg-slate-800 text-white rounded-xl font-black text-xs">적용</button>
                          </div>
                          <button onClick={()=>setShowColorPicker(false)} className="w-full mt-3 py-2 bg-slate-100 text-slate-500 rounded-xl font-bold text-xs">닫기</button>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
            <nav className="flex bg-white/10 p-1 rounded-xl items-center overflow-x-auto max-w-full no-scrollbar gap-0.5">
              {[
                { id: 'matrix',       l: '과제 현황', i: BarChart3 },
                { id: 'memorization', l: '암기 현황', i: BrainCircuit },
                { id: 'tests',        l: '성적표',    i: Trophy },
                { id: 'attendance',   l: '출결 관리', i: Calendar },
                { id: 'progress',     l: '진도 관리', i: TrendingUp },
                { id: 'students',     l: '학생 관리', i: Users,    h: userRole === 'student' },
                { id: 'report',       l: '리포트',    i: Printer,  h: userRole === 'student' },
                { id: 'assignments',  l: '항목 등록', i: BookOpen, h: userRole === 'student' },
                { id: 'sitemanage',   l: '사이트 관리', i: Settings, h: userRole !== 'master' },
              ].filter(t => !t.h).map(tab => (
                <button key={tab.id} onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-lg transition-all text-xs font-bold whitespace-nowrap ${activeTab === tab.id ? 'bg-white text-slate-900 shadow-md font-black' : 'hover:bg-white/10 text-white'}`}>
                  <tab.i size={14} />{tab.l}
                </button>
              ))}
              <button onClick={handleLogout} className="ml-1 p-2 hover:bg-white/20 rounded-lg text-white transition"><LogOut size={16} /></button>
            </nav>
          </div>
        </header>

        <main className="max-w-7xl mx-auto p-4 md:p-6 animate-in fade-in duration-500">

          {/* ====================================================
              과제 현황 / 암기 현황
          ==================================================== */}
          {(activeTab === 'matrix' || activeTab === 'memorization') && (
            <div className="space-y-6">
              {/* 상태 가이드 */}
              <div className="bg-white p-5 rounded-3xl shadow-sm border border-slate-200">
                <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2 leading-none"><Info size={18} /> 상태 가이드</h3>
                <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                  {activeTab === 'matrix' ? (
                    [{l:'시작 전',c:'bg-slate-50 text-slate-300',i:Circle},{l:'진행 중',c:'bg-slate-100 text-slate-900',i:Clock},{l:'미완료',c:'bg-red-50 text-red-500',i:AlertCircle},{l:'완료',c:'bg-blue-50 text-blue-500',i:CheckCircle2},{l:'해당 없음',c:'bg-slate-100 text-slate-400',i:MinusCircle}].map((item,i) => (
                      <div key={i} className="flex items-center gap-2 p-3 rounded-2xl border border-slate-100 bg-slate-50/50">
                        <div className={`p-2 rounded-xl ${item.c}`}><item.i size={16}/></div>
                        <p className="text-[11px] font-black">{item.l}</p>
                      </div>
                    ))
                  ) : (
                    MEMO_STATUS_ORDER.map(k => (
                      <div key={k} className="flex items-center gap-2 p-3 rounded-2xl border border-slate-100 bg-slate-50/50">
                        <div className={`p-2 rounded-xl ${MEMO_STATUS_CONFIG[k].bg} ${MEMO_STATUS_CONFIG[k].color}`}>{React.createElement(MEMO_STATUS_CONFIG[k].icon, {size:16})}</div>
                        <p className="text-[11px] font-black">{MEMO_STATUS_CONFIG[k].label}</p>
                      </div>
                    ))
                  )}
                </div>
              </div>

              {/* 매트릭스 테이블 */}
              <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden">
                {/* 필터 헤더 */}
                <div className="p-4 border-b border-slate-100 flex flex-wrap gap-3 items-center bg-white">
                  <h2 className="text-base font-bold flex items-center gap-2 shrink-0">
                    {activeTab === 'matrix' ? <ClipboardCheck size={18}/> : <BrainCircuit size={18}/>}
                    {userRole === 'student' ? '나의 학습 현황' : '전체 학습 진척도'}
                  </h2>
                  <span className="flex items-center gap-1 text-[10px] font-black text-slate-400 bg-slate-100 px-2 py-1 rounded-full">
                    <Users size={11}/>{visibleStudentsFiltered.length}명
                  </span>

                  {/* 암기 현황: 섹션 필터 */}
                  {activeTab === 'memorization' && memoSections.length > 0 && (
                    <div className="flex gap-1 flex-wrap">
                      <button onClick={() => setMemoSectionFilter('all')}
                        className={`px-2.5 py-1 rounded-xl text-[10px] font-black border transition-all ${memoSectionFilter === 'all' ? 'text-white border-transparent shadow-sm' : 'bg-white border-slate-200 text-slate-500'}`}
                        style={memoSectionFilter === 'all' ? {background:'var(--sc)'} : {}}>전체</button>
                      {memoSections.map(sec => (
                        <button key={sec} onClick={() => setMemoSectionFilter(sec)}
                          className={`px-2.5 py-1 rounded-xl text-[10px] font-black border transition-all ${memoSectionFilter === sec ? 'text-white border-transparent shadow-sm' : 'bg-white border-slate-200 text-slate-500'}`}
                          style={memoSectionFilter === sec ? {background:'var(--sc)'} : {}}>{sec}</button>
                      ))}
                    </div>
                  )}

                  {/* 반 필터 */}
                  {userRole !== 'student' && classrooms.length > 0 && (
                    <div className="flex gap-1 flex-wrap">
                      <button onClick={() => setActiveClassFilter('all')}
                        className={`px-2.5 py-1 rounded-xl text-[10px] font-black border transition-all ${activeClassFilter === 'all' ? 'text-white border-transparent shadow-sm' : 'bg-white border-slate-200 text-slate-500'}`}
                        style={activeClassFilter === 'all' ? {background:'var(--sc)'} : {}}>전체</button>
                      {classrooms.map(c => (
                        <button key={c.id} onClick={() => setActiveClassFilter(c.id)}
                          className={`px-2.5 py-1 rounded-xl text-[10px] font-black border transition-all ${activeClassFilter === c.id ? 'text-white border-transparent shadow-sm' : 'bg-white border-slate-200 text-slate-500'}`}
                          style={activeClassFilter === c.id ? {background:'var(--sc)'} : {}}>{c.name}</button>
                      ))}
                    </div>
                  )}

                  {userRole !== 'student' && (
                    <div className="flex items-center gap-2 ml-auto flex-wrap justify-end">
                      {/* 완료 숨기기 */}
                      <button onClick={() => setMatrixHideDone(v=>!v)}
                        className={`px-2.5 py-1.5 rounded-xl text-[10px] font-black border transition-all ${matrixHideDone ? 'text-white border-transparent shadow-sm' : 'bg-white border-slate-200 text-slate-500'}`}
                        style={matrixHideDone ? {background:'var(--sc)'} : {}}>완료 숨기기</button>
                      {/* 정렬 */}
                      {['custom','name','school'].map(s => (
                        <button key={s} onClick={() => setMatrixSort(s)}
                          className={`px-2 py-1.5 rounded-xl text-[10px] font-black border transition-all ${matrixSort===s?'text-white border-transparent shadow-sm':'bg-white border-slate-200 text-slate-500'}`}
                          style={matrixSort===s?{background:'var(--sc)'}:{}}>{s==='custom'?'직접':s==='name'?'가나다':'학교'}</button>
                      ))}
                    </div>
                  )}
                </div>

                {/* 테이블 - 모바일 */}
                {isMobile ? (
                  <div className="divide-y divide-slate-100">
                    {visibleStudentsFiltered.map(s => {
                      const allItems = activeTab === 'matrix' ? assignments : memoItems;
                      const filteredItems = activeTab === 'memorization' && memoSectionFilter !== 'all'
                        ? allItems.filter(a => a.memoSection === memoSectionFilter)
                        : allItems;
                      const collapsed = collapsedStudents[s.id];
                      const p = activeTab === 'matrix' ? stats.assign[s.id] : stats.memo[s.id];
                      return (
                        <div key={s.id} className="p-4">
                          <div className="flex items-center justify-between mb-3 cursor-pointer" onClick={() => setCollapsedStudents(prev => ({...prev, [s.id]: !prev[s.id]}))}>
                            <div className="flex items-center gap-2">
                              <span className="font-black text-slate-800">{s.name}</span>
                              {s.highSchool && <span className="text-[10px] text-slate-400 font-bold">{s.highSchool}</span>}
                            </div>
                            <div className="flex items-center gap-2">
                              {p && <span className="text-[10px] font-black text-slate-500">{p.label} {p.percent}%</span>}
                              <ChevronDown size={14} className={`text-slate-300 transition-transform ${collapsed ? '' : 'rotate-180'}`}/>
                            </div>
                          </div>
                          {!collapsed && (
                            <div className="space-y-2">
                              {filteredItems.map(as => {
                                const isTarget = as.type === 'all' || (as.targetStudents && as.targetStudents.includes(s.id));
                                const subKey = `${s.id}-${as.id}`;
                                const sub = (activeTab === 'matrix' ? submissions : memoSubmissions)[subKey];
                                const status = sub?.status || 'not_started';
                                const cfg = activeTab === 'matrix' ? ASSIGN_STATUS_CONFIG[status] : MEMO_STATUS_CONFIG[status];
                                const isLate = status === 'completed' && as.deadline && sub?.completionDate > as.deadline;
                                const colorClass = activeTab === 'matrix' ? (isLate ? STATUS_COLORS.late_completed : STATUS_COLORS[status]) : `${cfg?.bg} ${cfg?.color}`;
                                const Icon = activeTab === 'matrix'
                                  ? (status === 'completed' ? (isLate ? History : CheckCircle2) : status === 'in_progress' ? Clock : status === 'incomplete_red' ? AlertCircle : status === 'exempt' ? MinusCircle : Circle)
                                  : cfg?.icon || Circle;
                                if (!isTarget) return (
                                  <div key={as.id} className="flex items-center justify-between px-3 py-2 rounded-2xl bg-slate-50/50 border border-slate-100 opacity-40">
                                    <span className="text-[11px] font-black text-slate-400 truncate">{as.title}</span>
                                    <span className="text-[9px] text-slate-300 font-bold">대상 아님</span>
                                  </div>
                                );
                                return (
                                  <div key={as.id}
                                    onClick={(e) => { if (userRole === 'master') setStatusMenu({ studentId: s.id, itemId: as.id, category: activeTab === 'matrix' ? 'assignment' : 'memorization', x: e.clientX, y: e.clientY }); }}
                                    className={`flex items-start gap-2 px-3 py-2.5 rounded-2xl border transition-all ${colorClass} ${userRole === 'master' ? 'cursor-pointer active:scale-[0.98]' : 'cursor-default'}`}>
                                    <Icon size={15} className="shrink-0 mt-0.5" />
                                    <div className="flex-1 min-w-0">
                                      <p className="text-[11px] font-black leading-snug break-keep">{as.title}</p>
                                      <div className="flex flex-wrap items-center gap-1 mt-1">
                                        <span className="text-[9px] font-bold opacity-70">{as.subject}{as.level ? ` · ${as.level}` : ''}</span>
                                        {activeTab === 'memorization' && as.memoSection && (
                                          <span className="text-[9px] font-black px-1.5 py-0.5 rounded-lg bg-purple-100 text-purple-600">{as.memoSection}</span>
                                        )}
                                      </div>
                                    </div>
                                  </div>
                                );
                              })}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  /* 테이블 - 데스크탑 */
                  <div className="overflow-x-auto text-slate-700">
                    {(() => {
                      const allItems = activeTab === 'matrix' ? assignments : memoItems;
                      const filteredItems = (activeTab === 'memorization' && memoSectionFilter !== 'all')
                        ? allItems.filter(a => a.memoSection === memoSectionFilter)
                        : allItems.filter(as => {
                            if (!matrixHideDone) return true;
                            const targets = visibleStudentsFiltered.filter(s => as.type === 'all' || as.targetStudents?.includes(s.id));
                            return !(targets.length > 0 && targets.every(s => {
                              const st = (activeTab === 'matrix' ? submissions : memoSubmissions)[`${s.id}-${as.id}`]?.status;
                              return st === 'completed' || st === 'exempt' || st === 'round_4';
                            }));
                          });
                      if (filteredItems.length === 0 || visibleStudentsFiltered.length === 0) return (
                        <div className="p-12 text-center text-slate-400 font-bold">
                          {visibleStudentsFiltered.length === 0 ? '학생이 없습니다.' : '표시할 항목이 없습니다.'}
                        </div>
                      );
                      return (
                        <table className="w-full text-center border-collapse">
                          <thead>
                            <tr className="border-b border-slate-100 bg-slate-50">
                              <th className="px-4 py-3 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest sticky left-0 bg-slate-50 min-w-[100px]">학생</th>
                              <th className="px-3 py-3 text-[10px] font-black text-slate-400 uppercase tracking-widest min-w-[80px]">진척도</th>
                              {filteredItems.map(as => (
                                <th key={as.id} className="px-2 py-3 text-[10px] font-black text-slate-500 min-w-[110px] border-l border-slate-50">
                                  <div className="flex flex-col items-center gap-1">
                                    <span className="leading-snug break-keep text-center" style={{wordBreak:'break-word'}}>{as.title}</span>
                                    <div className="flex items-center gap-1 flex-wrap justify-center">
                                      {as.subject && <span className="text-[8px] font-black px-1.5 py-0.5 rounded text-white leading-none" style={{background:'var(--sc)'}}>{as.subject}</span>}
                                      {activeTab === 'memorization' && as.memoSection && (
                                        <span className="text-[8px] font-black px-1.5 py-0.5 rounded bg-purple-100 text-purple-600 leading-none">{as.memoSection}</span>
                                      )}
                                      {as.level && <span className="text-[8px] text-slate-400 font-bold">{as.level}</span>}
                                    </div>
                                    {/* 일괄 처리 버튼 */}
                                    {userRole === 'master' && (
                                      <button onClick={() => setBulkDatePopup({ item: as, category: activeTab === 'matrix' ? 'assignment' : 'memorization' })}
                                        className="text-[8px] px-1.5 py-0.5 rounded-lg bg-slate-100 text-slate-400 hover:bg-slate-200 font-black transition-all mt-0.5">일괄</button>
                                    )}
                                  </div>
                                </th>
                              ))}
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-50">
                            {visibleStudentsFiltered.map(s => {
                              const p = activeTab === 'matrix' ? stats.assign[s.id] : stats.memo[s.id];
                              return (
                                <tr key={s.id} className="hover:bg-slate-50/50 transition-colors">
                                  <td className="px-4 py-3 text-left sticky left-0 bg-white">
                                    <div className="flex items-center gap-2 cursor-pointer" onClick={() => setSelectedStudent(s)}>
                                      <div>
                                        <p className="font-black text-slate-800 text-sm leading-none">{s.name}</p>
                                        {s.highSchool && <p className="text-[9px] text-slate-400 font-bold mt-0.5">{s.highSchool}</p>}
                                      </div>
                                      <Search size={12} className="text-slate-200 hover:text-slate-400 shrink-0"/>
                                    </div>
                                  </td>
                                  <td className="px-3 py-3">
                                    {p && (
                                      <div className="flex flex-col items-center gap-1">
                                        <span className="text-[10px] font-black text-slate-600">{p.label}</span>
                                        <div className="w-14 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                                          <div className="h-full rounded-full transition-all" style={{width:p.percent+'%', background:'var(--sc)'}} />
                                        </div>
                                        <span className="text-[9px] font-bold text-slate-400">{p.percent}%</span>
                                      </div>
                                    )}
                                  </td>
                                  {filteredItems.map(as => {
                                    const isTarget = as.type === 'all' || (as.targetStudents && as.targetStudents.includes(s.id));
                                    if (!isTarget) return (
                                      <td key={as.id} className="px-2 py-3 border-l border-slate-50">
                                        <span className="text-[9px] text-slate-200 font-bold">-</span>
                                      </td>
                                    );
                                    const subKey = `${s.id}-${as.id}`;
                                    const sub = (activeTab === 'matrix' ? submissions : memoSubmissions)[subKey];
                                    const status = sub?.status || 'not_started';
                                    const cfg = activeTab === 'matrix' ? ASSIGN_STATUS_CONFIG[status] : MEMO_STATUS_CONFIG[status];
                                    const isLate = status === 'completed' && as.deadline && sub?.completionDate > as.deadline;
                                    const colorClass = activeTab === 'matrix' ? (isLate ? STATUS_COLORS.late_completed : STATUS_COLORS[status]) : `${cfg?.bg} ${cfg?.color}`;
                                    const Icon = activeTab === 'matrix'
                                      ? (status === 'completed' ? (isLate ? History : CheckCircle2) : status === 'in_progress' ? Clock : status === 'incomplete_red' ? AlertCircle : status === 'exempt' ? MinusCircle : Circle)
                                      : cfg?.icon || Circle;
                                    return (
                                      <td key={as.id} className="px-2 py-3 border-l border-slate-50">
                                        <div
                                          onClick={(e) => { if (userRole === 'master') setStatusMenu({ studentId: s.id, itemId: as.id, category: activeTab === 'matrix' ? 'assignment' : 'memorization', x: e.clientX, y: e.clientY }); }}
                                          className={`flex flex-col items-center gap-1 px-2 py-2 rounded-2xl ${colorClass} ${userRole === 'master' ? 'cursor-pointer hover:brightness-95' : ''}`}>
                                          <Icon size={16} />
                                          <span className="text-[9px] font-black leading-none">{cfg?.label}</span>
                                          {(status === 'completed' || status === 'round_4') && sub?.completionDate && (
                                            <span className="text-[8px] opacity-60">{sub.completionDate.slice(5).replace('-','/')}</span>
                                          )}
                                        </div>
                                      </td>
                                    );
                                  })}
                                </tr>
                              );
                            })}
                          </tbody>
                        </table>
                      );
                    })()}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ====================================================
              성적표
          ==================================================== */}
          {activeTab === 'tests' && (
            <div className="space-y-6">
              {/* 시험 등록 - master 전용 */}
              {userRole === 'master' && (
                <div className="bg-white p-5 md:p-8 rounded-3xl border border-slate-200 shadow-sm">
                  <h2 className="text-lg font-bold mb-6 flex items-center gap-2"><Trophy size={20} className="text-orange-500"/> 시험 등록</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <p className="text-[10px] font-black text-slate-400 mb-2 uppercase">시험 명칭</p>
                      <BufferedInput value={newTest.title} onSave={(v)=>setNewTest(p=>({...p,title:v}))} placeholder="예: 1학기 중간고사 모의" className="w-full px-4 py-3 bg-slate-50 border-2 border-transparent rounded-2xl font-bold outline-none focus:border-orange-400 transition-all" />
                    </div>
                    <div>
                      <p className="text-[10px] font-black text-slate-400 mb-2 uppercase">실시 일자</p>
                      <input type="date" value={newTest.date} onChange={(e)=>setNewTest(p=>({...p,date:e.target.value}))} className="w-full px-4 py-3 bg-slate-50 border-2 border-transparent rounded-2xl font-bold outline-none focus:border-orange-400 transition-all" />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <p className="text-[10px] font-black text-slate-400 mb-2 uppercase">시험 유형</p>
                      <div className="flex gap-2 flex-wrap">
                        {['중간 테스트','미니 테스트'].map(t=>(
                          <button key={t} onClick={()=>setNewTest(p=>({...p,testType:t}))}
                            className={`px-4 py-2 rounded-xl text-xs font-black border-2 transition ${newTest.testType===t?'bg-orange-500 border-orange-500 text-white':'border-slate-100 text-slate-400'}`}>{t}</button>
                        ))}
                      </div>
                    </div>
                    <div>
                      <p className="text-[10px] font-black text-slate-400 mb-2 uppercase">만점</p>
                      <div className="relative">
                        <BufferedInput type="number" value={newTest.maxScore??''} onSave={(v)=>setNewTest(p=>({...p,maxScore:v===''?null:parseFloat(v)}))} placeholder="예: 100"
                          className="w-full px-4 py-3 bg-slate-50 border-2 border-transparent rounded-2xl font-bold outline-none focus:border-orange-400 transition-all" />
                        <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[11px] font-black text-slate-400 pointer-events-none">점</span>
                      </div>
                    </div>
                  </div>
                  {/* 난이도 */}
                  <div className="mb-4">
                    <p className="text-[10px] font-black text-slate-400 mb-2 uppercase">시험 난이도</p>
                    <div className="flex flex-wrap gap-2">
                      {['최하','하','중하','중','중상','상','최상'].map(d=>(
                        <button key={d} onClick={()=>setNewTest(p=>({...p,testDifficulty:d}))}
                          className={`px-3 py-1.5 rounded-xl text-xs font-black border-2 transition ${newTest.testDifficulty===d?'border-transparent text-white shadow-sm':'border-slate-100 text-slate-400'}`}
                          style={newTest.testDifficulty===d?{background:{'최하':'#3b82f6','하':'#0ea5e9','중하':'#14b8a6','중':'#64748b','중상':'#f59e0b','상':'#f97316','최상':'#ef4444'}[d]}:{}}>
                          {d}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* 문항 설정 */}
                  <div className="mb-4">
                    <p className="text-[10px] font-black text-slate-400 mb-3 uppercase">문항 설정 (선택)</p>
                    <div className="grid grid-cols-2 gap-3 mb-3">
                      <div>
                        <p className="text-[10px] font-black text-slate-400 mb-1.5">객관식 문항 수</p>
                        <input type="number" min="0" value={newTest.mcCount||''} onChange={(e)=>{
                          const n = parseInt(e.target.value)||0;
                          const existing = (newTest.questions||[]).filter(q=>q.type==='객관식');
                          const newQs = Array.from({length:n},(_,i)=>existing[i]||{type:'객관식',num:i+1,points:'',unit:'',difficulty:'중'});
                          const others = (newTest.questions||[]).filter(q=>q.type!=='객관식');
                          setNewTest({...newTest,mcCount:e.target.value,questions:[...newQs,...others]});
                        }} placeholder="예: 20" className="w-full px-3 py-2.5 bg-slate-50 border-2 border-transparent rounded-2xl font-bold outline-none focus:border-orange-400 transition-all text-sm"/>
                      </div>
                      <div>
                        <p className="text-[10px] font-black text-slate-400 mb-1.5">주관식 문항 수</p>
                        <input type="number" min="0" value={newTest.saCount||''} onChange={(e)=>{
                          const n = parseInt(e.target.value)||0;
                          const mcQs = (newTest.questions||[]).filter(q=>q.type==='객관식');
                          const existing = (newTest.questions||[]).filter(q=>q.type==='주관식');
                          const newQs = Array.from({length:n},(_,i)=>existing[i]||{type:'주관식',num:mcQs.length+i+1,points:'',unit:'',difficulty:'중'});
                          setNewTest({...newTest,saCount:e.target.value,questions:[...(newTest.questions||[]).filter(q=>q.type!=='주관식'),...newQs]});
                        }} placeholder="예: 5" className="w-full px-3 py-2.5 bg-slate-50 border-2 border-transparent rounded-2xl font-bold outline-none focus:border-orange-400 transition-all text-sm"/>
                      </div>
                    </div>
                    {(newTest.questions||[]).length > 0 && (
                      <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
                        {(newTest.questions||[]).map((q,i)=>(
                          <div key={i} className="grid grid-cols-12 gap-2 items-center bg-slate-50 px-3 py-2 rounded-2xl border border-slate-100">
                            <span className="col-span-2 text-[10px] font-black text-slate-500">{q.type==='주관식'?'주':'객'}{q.num}번</span>
                            <input type="number" value={q.points||''} onChange={(e)=>{const qs=[...(newTest.questions||[])];qs[i]={...qs[i],points:e.target.value};setNewTest({...newTest,questions:qs});}}
                              placeholder="배점" className="col-span-2 px-2 py-1 bg-white border border-slate-200 rounded-xl text-xs font-bold outline-none focus:border-orange-400 text-center"/>
                            <input type="text" value={q.unit||''} onChange={(e)=>{const qs=[...(newTest.questions||[])];qs[i]={...qs[i],unit:e.target.value};setNewTest({...newTest,questions:qs});}}
                              placeholder="단원" className="col-span-5 px-2 py-1 bg-white border border-slate-200 rounded-xl text-xs font-bold outline-none focus:border-orange-400"/>
                            <select value={q.difficulty||'중'} onChange={(e)=>{const qs=[...(newTest.questions||[])];qs[i]={...qs[i],difficulty:e.target.value};setNewTest({...newTest,questions:qs});}}
                              className="col-span-3 px-1 py-1 bg-white border border-slate-200 rounded-xl text-xs font-bold outline-none">
                              {['하','중하','중','중상','상','극상'].map(d=><option key={d}>{d}</option>)}
                            </select>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                  <button onClick={addTest} className="w-full py-4 text-white rounded-2xl font-black shadow-lg transition-all active:scale-95" style={{background:'var(--sc)'}}>시험 등록</button>
                </div>
              )}

              {/* 시험 목록 */}
              {tests.length === 0 ? (
                <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center text-slate-400 font-bold shadow-sm">등록된 시험이 없습니다.</div>
              ) : (
                <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
                  <div className="px-6 py-4 border-b border-slate-100 flex items-center gap-2">
                    <Trophy size={18} className="text-orange-500"/>
                    <p className="font-black text-slate-800">성적표</p>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full border-collapse">
                      <thead>
                        <tr className="bg-orange-50">
                          <th className="px-4 py-3 text-left text-[10px] font-black text-orange-600 uppercase sticky left-0 bg-orange-50 min-w-[100px]">학생</th>
                          <th className="px-3 py-3 text-[10px] font-black text-orange-600 min-w-[60px]">평균</th>
                          {tests.map(t=>(
                            <th key={t.id} className="px-3 py-3 text-[10px] font-black text-orange-600 min-w-[100px] border-l border-orange-100">
                              <div className="text-center">
                                <p className="leading-snug">{t.title}</p>
                                <p className="text-[8px] text-orange-400 font-bold">{t.date}{t.maxScore ? ` · 만점 ${t.maxScore}점` : ''}</p>
                                <span className="text-[8px] font-black px-1.5 py-0.5 rounded bg-orange-100 text-orange-600 mt-0.5 inline-block">AVG {stats.testAverages[t.id]}{t.maxScore ? ` / ${t.maxScore}` : ''}</span>
                                {t.testDifficulty && (() => {
                                  const dc = {'최하':'bg-blue-100 text-blue-600','하':'bg-sky-100 text-sky-600','중하':'bg-teal-100 text-teal-600','중':'bg-slate-100 text-slate-600','중상':'bg-amber-100 text-amber-600','상':'bg-orange-100 text-orange-600','최상':'bg-red-100 text-red-600'};
                                  return <span className={`text-[8px] font-black px-1.5 py-0.5 rounded mt-0.5 ml-1 inline-block ${dc[t.testDifficulty]||'bg-slate-100 text-slate-500'}`}>{t.testDifficulty}</span>;
                                })()}
                                {userRole === 'master' && (
                                  <div className="flex justify-center gap-1 mt-1">
                                    <button onClick={()=>setSelectedTest({...t})} className="text-[8px] px-1.5 py-0.5 rounded bg-blue-50 text-blue-400 hover:bg-blue-100 font-black transition-all">수정</button>
                                    <button onClick={()=>setConfirmDelete({coll:'tests',id:t.id,label:t.title})} className="text-[8px] px-1.5 py-0.5 rounded bg-red-50 text-red-300 hover:bg-red-100 hover:text-red-500 font-black transition-all">삭제</button>
                                  </div>
                                )}
                              </div>
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-50">
                        {visibleStudentsFiltered.map(s=>(
                          <tr key={s.id} className="hover:bg-orange-50/30">
                            <td className="px-4 py-3 sticky left-0 bg-white">
                              <p className="font-black text-slate-800 text-sm">{s.name}</p>
                              {s.highSchool && <p className="text-[9px] text-slate-400">{s.highSchool}</p>}
                            </td>
                            <td className="px-3 py-3 text-center">
                              <span className="font-black text-slate-700">{stats.studentTestAverages[s.id] || '-'}</span>
                            </td>
                            {tests.map(t=>{
                              const res = testScores[`${s.id}-${t.id}`] || {};
                              const score = res.score;
                              const scales = t.scales || DEFAULT_GRADE_SCALES;
                              const grade = score != null ? scales.find(g=>score>=g.min) : null;
                              return (
                                <td key={t.id} className="px-3 py-3 text-center border-l border-slate-50">
                                  {res.absent === 'absent' ? (
                                    <div className="flex flex-col items-center gap-1">
                                      <span className="text-[10px] font-black text-red-400">결시</span>
                                      {userRole === 'master' && (
                                        <button onClick={()=>setDoc(doc(db,'artifacts',APP_ID,'public','data','testScores',`${s.id}-${t.id}`),{absent:false,score:null},{merge:true})}
                                          className="text-[8px] font-black px-1.5 py-0.5 rounded-lg bg-red-50 text-red-400 border border-red-200 hover:bg-red-100 transition-all">취소 ×</button>
                                      )}
                                    </div>
                                  ) : res.absent === 'excluded' ? (
                                    <div className="flex flex-col items-center gap-1">
                                      <span className="text-[10px] font-black text-slate-300">비대상</span>
                                      {userRole === 'master' && (
                                        <button onClick={()=>setDoc(doc(db,'artifacts',APP_ID,'public','data','testScores',`${s.id}-${t.id}`),{absent:false,score:null},{merge:true})}
                                          className="text-[8px] font-black px-1.5 py-0.5 rounded-lg bg-slate-50 text-slate-400 border border-slate-200 hover:bg-slate-100 transition-all">취소 ×</button>
                                      )}
                                    </div>
                                  ) : userRole === 'master' ? (
                                    <div className="flex flex-col items-center gap-1">
                                      <div className="flex items-center gap-1">
                                        <BufferedInput type="number" value={score??''}
                                          onSave={(v)=>setDoc(doc(db,'artifacts',APP_ID,'public','data','testScores',`${s.id}-${t.id}`),{score:v===''?null:parseFloat(v)},{merge:true})}
                                          className="w-16 px-2 py-1.5 rounded-xl bg-white border border-orange-200 font-bold text-center text-sm focus:border-orange-400 outline-none" />
                                        {t.maxScore && <span className="text-[9px] text-slate-400 font-bold">/{t.maxScore}</span>}
                                      </div>
                                      {/* 자동 기입 버튼: 문항 배점 합산 */}
                                      {(() => {
                                        const allQs = t.questions || [];
                                        if (allQs.length === 0) return null;
                                        const wrongNums = res.wrongNums || [];
                                        const partialScores = res.partialScores || {};
                                        // 객관식 총점 = 객관식 배점 합산
                                        const mcTotal = allQs.filter(q=>q.type!=='주관식').reduce((sum,q)=>sum+(parseFloat(q.points)||0),0);
                                        // 주관식 총점 = 주관식 배점 합산
                                        const saTotal = allQs.filter(q=>q.type==='주관식').reduce((sum,q)=>sum+(parseFloat(q.points)||0),0);
                                        // 만점 = 등록된 만점 또는 전체 배점 합산
                                        const maxScore = parseFloat(t.maxScore) || (mcTotal + saTotal) || 0;
                                        if (maxScore === 0) return null;
                                        // 객관식 오답 차감
                                        const mcDeduct = wrongNums
                                          .filter(n=>{ const q=allQs[n-1]; return q && q.type!=='주관식'; })
                                          .reduce((sum,n)=>sum+(parseFloat(allQs[n-1]?.points)||0),0);
                                        // 주관식: 배점 - 부분점수 = 차감
                                        const saDeduct = wrongNums
                                          .filter(n=>{ const q=allQs[n-1]; return q && q.type==='주관식'; })
                                          .reduce((sum,n)=>{
                                            const q=allQs[n-1];
                                            const full=parseFloat(q?.points)||0;
                                            const partial=partialScores[n]!=null?parseFloat(partialScores[n]):0;
                                            return sum+(full-partial);
                                          },0);
                                        const auto = Math.max(0, maxScore - mcDeduct - saDeduct);
                                        const autoFixed = isNaN(auto) ? 0 : parseFloat(auto.toFixed(1));
                                        return (
                                          <button onClick={()=>setDoc(doc(db,'artifacts',APP_ID,'public','data','testScores',`${s.id}-${t.id}`),{score:autoFixed},{merge:true})}
                                            className="text-[8px] font-black px-1.5 py-0.5 rounded-lg bg-orange-100 text-orange-600 hover:bg-orange-200 transition-all leading-none mt-0.5 flex items-center gap-0.5">
                                            <Zap size={8}/>{autoFixed}점 자동기입
                                          </button>
                                        );
                                      })()}
                                    </div>
                                  ) : (
                                    <div className="flex flex-col items-center gap-1">
                                      <span className="font-black text-slate-800">
                                        {score!=null ? `${score}점${t.maxScore ? ` / ${t.maxScore}점` : ''}` : '-'}
                                      </span>
                                      {grade && <span className="text-[9px] font-black px-1.5 py-0.5 rounded text-white leading-none" style={{background:grade.color?.replace('bg-','').includes('-')?undefined:grade.color}}>{grade.icon} {grade.label}</span>}
                                    </div>
                                  )}
                                  {userRole === 'master' && !res.absent && (
                                    <div className="flex flex-col items-center gap-1 mt-1">
                                      <div className="flex justify-center gap-2">
                                        <button onClick={()=>setDoc(doc(db,'artifacts',APP_ID,'public','data','testScores',`${s.id}-${t.id}`),{absent:'absent',score:null},{merge:true})}
                                          className="text-[8px] font-black text-red-300 hover:text-red-500 transition-colors">결시</button>
                                        <button onClick={()=>setDoc(doc(db,'artifacts',APP_ID,'public','data','testScores',`${s.id}-${t.id}`),{absent:'excluded',score:null},{merge:true})}
                                          className="text-[8px] font-black text-slate-300 hover:text-slate-500 transition-colors">비대상</button>
                                      </div>
                                      {/* 오답 토글 */}
                                      {(t.questions||[]).length > 0 && (
                                        <div className="w-full mt-1 pt-1 border-t border-slate-50">
                                          <p className="text-[8px] font-black text-slate-300 mb-1 text-center">오답 토글</p>
                                          <div className="flex flex-wrap gap-0.5 justify-center mb-1">
                                            {(t.questions||[]).map((q,qi)=>{
                                              const wrongNums = res.wrongNums||[];
                                              const isWrong = wrongNums.includes(qi+1);
                                              const isSA = q.type==='주관식';
                                              return (
                                                <button key={qi} onClick={()=>{
                                                  const next = isWrong ? wrongNums.filter(n=>n!==qi+1) : [...wrongNums,qi+1];
                                                  setDoc(doc(db,'artifacts',APP_ID,'public','data','testScores',`${s.id}-${t.id}`),{wrongNums:next},{merge:true});
                                                }} className={`w-6 h-6 rounded-lg text-[8px] font-black border transition-all leading-none ${isWrong?(isSA?'bg-purple-500 border-purple-500 text-white':'bg-red-500 border-red-500 text-white'):'bg-white border-slate-200 text-slate-300 hover:border-red-300'}`}
                                                title={isSA?'주관식':'객관식'}>
                                                  {isSA?'주':'객'}{q.num||qi+1}
                                                </button>
                                              );
                                            })}
                                          </div>
                                          {/* 주관식 오답 - 부분점수 입력 */}
                                          {(res.wrongNums||[]).some(n=>(t.questions||[])[n-1]?.type==='주관식') && (
                                            <div className="space-y-1 mt-1">
                                              <p className="text-[8px] font-black text-purple-400 text-center">주관식 부분점수</p>
                                              {(res.wrongNums||[]).filter(n=>(t.questions||[])[n-1]?.type==='주관식').sort((a,b)=>a-b).map(n=>{
                                                const q=(t.questions||[])[n-1];
                                                const partialScores=res.partialScores||{};
                                                return (
                                                  <div key={n} className="flex items-center gap-2 bg-purple-50 px-2 py-1 rounded-lg">
                                                    <span className="text-[9px] font-black text-purple-600 shrink-0">주{q.num||n}번</span>
                                                    {q.points && <span className="text-[9px] text-purple-400 shrink-0">/{q.points}점</span>}
                                                    <input type="number" min="0" max={q.points||9999}
                                                      value={partialScores[n]??''}
                                                      onChange={e=>{
                                                        const val = e.target.value===''?null:Math.max(0,Math.min(parseFloat(e.target.value)||0,parseFloat(q.points)||9999));
                                                        const newPS={...partialScores,[n]:val};
                                                        setDoc(doc(db,'artifacts',APP_ID,'public','data','testScores',`${s.id}-${t.id}`),{partialScores:newPS},{merge:true});
                                                      }}
                                                      placeholder="부분점수"
                                                      className="flex-1 min-w-0 px-1.5 py-0.5 bg-white border border-purple-200 rounded-lg text-[10px] font-bold text-center outline-none focus:border-purple-400"/>
                                                  </div>
                                                );
                                              })}
                                            </div>
                                          )}
                                        </div>
                                      )}
                                    </div>
                                  )}
                                  {/* 학생/선생님: 오답 문항 상세 */}
                                  {userRole !== 'master' && !res.absent && (t.questions||[]).length > 0 && (() => {
                                    const wrongNums = res.wrongNums||[];
                                    if (!wrongNums.length) return <p className="text-[8px] font-black text-emerald-500 mt-1">✓ 오답 없음</p>;
                                    const DCOL = {'하':'text-blue-500','중하':'text-cyan-600','중':'text-slate-500','중상':'text-amber-600','상':'text-orange-600','극상':'text-red-600'};
                                    return (
                                      <div className="mt-1 text-left space-y-0.5">
                                        <p className="text-[8px] font-black text-red-400">오답 {wrongNums.length}개</p>
                                        {wrongNums.sort((a,b)=>a-b).map(n=>{
                                          const q=(t.questions||[])[n-1];
                                          if(!q) return null;
                                          return <div key={n} className="text-[8px] text-slate-500 font-bold">
                                            <span className={`font-black ${DCOL[q.difficulty]||'text-slate-500'}`}>{q.type==='주관식'?'주':'객'}{q.num||n}번</span>
                                            {q.unit ? ` · ${q.unit}` : ''}
                                            {q.points ? ` (${q.points}점)` : ''}
                                          </div>;
                                        })}
                                      </div>
                                    );
                                  })()}
                                  {/* 등수 */}
                                  {!res.absent && score!=null && !isNaN(parseFloat(score)) && (() => {
                                    const allScores = students.map(st=>{const r=testScores[`${st.id}-${t.id}`];const v=r?.absent?null:parseFloat(r?.score);return(!isNaN(v)&&v!=null)?v:null;}).filter(v=>v!=null).sort((a,b)=>b-a);
                                    const rank = allScores.indexOf(parseFloat(score))+1;
                                    const total = allScores.length;
                                    return rank>0 ? <p className="text-[8px] font-black text-indigo-400 mt-0.5">{rank}/{total}등</p> : null;
                                  })()}
                                </td>
                              );
                            })}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* 점수 분포 / 오답 단원 분석 */}
              {tests.length > 0 && (
                <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6">
                  <h2 className="text-base font-black text-slate-800 mb-5 flex items-center gap-2"><BarChart3 size={18} className="text-orange-500"/> 시험 분석</h2>
                  <div className="space-y-6">
                    {tests.map(t=>{
                      const allScores = students.map(s=>{const r=testScores[`${s.id}-${t.id}`];return r?.absent?null:r?.score;}).filter(v=>v!=null);
                      if(!allScores.length) return null;
                      const avg = (allScores.reduce((a,b)=>a+b,0)/allScores.length).toFixed(1);
                      const max2 = Math.max(...allScores);
                      const min2 = Math.min(...allScores);
                      // 구간별 분포
                      const bands = t.maxScore
                        ? [{l:'90~100%',min:t.maxScore*0.9},{l:'70~90%',min:t.maxScore*0.7},{l:'50~70%',min:t.maxScore*0.5},{l:'~50%',min:0}]
                        : [{l:'90점↑',min:90},{l:'70~89',min:70},{l:'50~69',min:50},{l:'~49',min:0}];
                      // 오답 단원 분석
                      const unitErr = {};
                      students.forEach(s=>{
                        const r=testScores[`${s.id}-${t.id}`]||{};
                        (r.wrongNums||[]).forEach(n=>{
                          const q=(t.questions||[])[n-1];
                          if(q?.unit){unitErr[q.unit]=(unitErr[q.unit]||0)+1;}
                        });
                      });
                      const topUnits = Object.entries(unitErr).sort((a,b)=>b[1]-a[1]).slice(0,5);
                      return (
                        <div key={t.id} className="border border-slate-100 rounded-2xl p-4">
                          <p className="font-black text-slate-700 text-sm mb-3">{t.title} <span className="text-[10px] font-bold text-slate-400">{t.date}</span></p>
                          <div className="grid grid-cols-3 gap-3 mb-4">
                            {[{l:'평균',v:avg+'점'},{l:'최고',v:max2+'점'},{l:'최저',v:min2+'점'}].map(item=>(
                              <div key={item.l} className="bg-orange-50 rounded-xl p-3 text-center">
                                <p className="text-[10px] font-black text-orange-400 mb-1">{item.l}</p>
                                <p className="font-black text-orange-700 text-lg leading-none">{item.v}</p>
                              </div>
                            ))}
                          </div>
                          {/* 점수 분포 */}
                          <p className="text-[10px] font-black text-slate-400 uppercase mb-2">점수 분포</p>
                          <div className="space-y-1.5 mb-4">
                            {bands.map((band,bi)=>{
                              const nextMin = bi<bands.length-1?bands[bi+1].min:0;
                              const count = allScores.filter(v=>v>=band.min&&(bi===0?true:v<(bi>0?bands[bi-1].min:Infinity))).length;
                              const pct = Math.round(count/allScores.length*100);
                              return (
                                <div key={band.l} className="flex items-center gap-3">
                                  <span className="text-[10px] font-black text-slate-400 w-16 shrink-0">{band.l}</span>
                                  <div className="flex-1 h-5 bg-slate-50 rounded-lg overflow-hidden">
                                    <div className="h-full bg-orange-400 rounded-lg transition-all flex items-center justify-end pr-2" style={{width:pct+'%'}}>
                                      {pct>10&&<span className="text-[9px] font-black text-white">{count}명</span>}
                                    </div>
                                  </div>
                                  <span className="text-[10px] font-bold text-slate-400 w-8 text-right">{pct}%</span>
                                </div>
                              );
                            })}
                          </div>
                          {/* 오답 단원 분석 */}
                          {topUnits.length > 0 && (
                            <div>
                              <p className="text-[10px] font-black text-slate-400 uppercase mb-2">오답 많은 단원 TOP {topUnits.length}</p>
                              <div className="space-y-1.5">
                                {topUnits.map(([unit,cnt],i)=>(
                                  <div key={unit} className="flex items-center gap-3">
                                    <span className="text-[10px] font-black text-slate-300 w-4">{i+1}</span>
                                    <span className="flex-1 text-[11px] font-black text-slate-600">{unit}</span>
                                    <div className="flex items-center gap-1">
                                      <div className="h-1.5 bg-red-400 rounded-full" style={{width:Math.round(cnt/students.length*60)+'px'}}/>
                                      <span className="text-[10px] font-bold text-red-400">{cnt}명</span>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ====================================================
              출결 관리
          ==================================================== */}
          {activeTab === 'attendance' && userRole !== 'student' && (
            <div className="space-y-6">
              <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm">
                <div className="flex flex-wrap items-center gap-4 mb-6">
                  <h2 className="text-lg font-bold flex items-center gap-2"><Calendar size={20} className="text-emerald-600"/> 출결 관리</h2>
                  <input type="date" value={currentDate} onChange={e=>setCurrentDate(e.target.value)}
                    className="px-4 py-2 bg-slate-50 border-2 border-transparent rounded-2xl font-bold outline-none focus:border-emerald-400 transition-all" />
                  {userRole === 'master' && (
                    <button onClick={handleBulkAttendanceToggle}
                      className="px-4 py-2 rounded-2xl text-xs font-black border-2 border-emerald-200 text-emerald-600 hover:bg-emerald-50 transition-all">
                      전체 출석 토글
                    </button>
                  )}
                </div>
                {/* 달력 */}
                <div className="mb-2">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 flex items-center gap-1.5"><TrendingUp size={11} className="text-teal-500"/> 진도 수업 달력 (날짜 클릭 시 이동)</p>
                  <ProgressMiniCalendar
                    progressPlans={progressPlans}
                    progressCalMonth={progressCalMonth}
                    setProgressCalMonth={setProgressCalMonth}
                    kstToday={kstToday}
                    attendance={attendance}
                    students={students}
                    makeupDates={makeupDates}
                    onDateSelect={(date) => setCurrentDate(date)}
                  />
                </div>

                <div className="space-y-3">
                  {visibleStudentsFiltered.map(s => {
                    const att = attendance[`${s.id}-${currentDate}`] || { status: 'none', makeup: false };
                    const note = attendanceNotes[`${s.id}-${currentDate}`] || '';
                    const mDateValue = makeupDates[`${s.id}-${currentDate}`] || '';
                    return (
                      <div key={s.id} className="flex flex-col gap-2 p-4 bg-slate-50 rounded-2xl border border-slate-100">
                        <div className="flex items-center justify-between flex-wrap gap-2">
                          <span className="font-black text-slate-800">{s.name}{s.highSchool && <span className="text-[10px] text-slate-400 font-bold ml-2">{s.highSchool}</span>}</span>
                          <div className="flex gap-2 flex-wrap">
                            {[{id:'present',l:'출석',c:'emerald'},{id:'late',l:'지각',c:'amber'},{id:'absent',l:'결석',c:'red'}].map(opt=>(
                              <button key={opt.id} onClick={()=>updateAttendance(s.id,opt.id)} disabled={userRole!=='master'}
                                className={`px-3 py-1.5 rounded-xl text-xs font-black border-2 transition-all ${att.status===opt.id?`bg-${opt.c}-500 border-${opt.c}-500 text-white`:'bg-white border-slate-100 text-slate-400'} ${userRole==='master'?'active:scale-95':'cursor-default'}`}>
                                {opt.l}
                              </button>
                            ))}
                            <button onClick={()=>updateAttendance(s.id,'makeup')} disabled={userRole!=='master'}
                              className={`px-3 py-1.5 rounded-xl text-xs font-black border-2 transition-all ${att.makeup?'bg-purple-500 border-purple-500 text-white':'bg-white border-slate-100 text-slate-400'} ${userRole==='master'?'active:scale-95':'cursor-default'}`}>
                              보충
                            </button>
                          </div>
                        </div>
                        {userRole === 'master' && (
                          <BufferedInput value={note} onSave={(v)=>setDoc(doc(db,'artifacts',APP_ID,'public','data','attendanceNotes',`${s.id}-${currentDate}`),{note:v})}
                            placeholder="메모..." className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-sm font-medium outline-none focus:border-slate-300 transition-all" />
                        )}
                        {att.makeup && (
                          <div className="flex items-center gap-2 bg-purple-50 px-3 py-1.5 rounded-xl border border-purple-100 w-fit">
                            <span className="text-[10px] font-black text-purple-600">보충일</span>
                            {userRole === 'master' ? (
                              <input type="date" value={mDateValue} onChange={(e)=>updateMakeupDateValue(s.id,currentDate,e.target.value)} className="text-xs bg-white border-none rounded px-2 py-0.5 outline-none font-bold text-purple-700" />
                            ) : (
                              <span className="text-xs font-bold text-purple-700">{mDateValue||'-'}</span>
                            )}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* 출결 - student 전용 */}
          {activeTab === 'attendance' && userRole === 'student' && (() => {
            const s = students.find(st => st.id === myStudentId);
            if (!s) return null;
            const allDates = Object.keys(attendance).filter(k=>k.startsWith(`${s.id}-`)).map(k=>k.replace(`${s.id}-`,'')).sort((a,b)=>b.localeCompare(a));
            const STATUS_LABEL = { present:{l:'출석',c:'emerald'}, late:{l:'지각',c:'amber'}, absent:{l:'결석',c:'red'}, none:{l:'-',c:'slate'} };
            return (
              <div className="max-w-lg mx-auto space-y-4">
                <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm flex items-center gap-3">
                  <div className="p-3 bg-emerald-100 rounded-2xl text-emerald-600"><Calendar size={20}/></div>
                  <div><p className="font-black text-slate-800">{s.name}의 출결 기록</p><p className="text-xs text-slate-400 mt-1">{allDates.length}건</p></div>
                </div>
                {allDates.length === 0 ? (
                  <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center text-slate-400 font-bold">출결 기록이 없습니다.</div>
                ) : (
                  <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden divide-y divide-slate-100 shadow-sm">
                    {allDates.map(date => {
                      const att = attendance[`${s.id}-${date}`] || {status:'none',makeup:false};
                      const cfg = STATUS_LABEL[att.status] || STATUS_LABEL.none;
                      const note = attendanceNotes[`${s.id}-${date}`] || '';
                      return (
                        <div key={date} className="p-4 flex items-center gap-4">
                          <span className="font-black text-slate-700 text-sm w-28 shrink-0">{date}</span>
                          <span className={`px-3 py-1.5 rounded-xl text-xs font-black bg-${cfg.c}-50 text-${cfg.c}-600 border border-${cfg.c}-100 leading-none`}>{cfg.l}</span>
                          {att.makeup && <span className="px-2 py-1 bg-purple-50 text-purple-600 rounded-xl text-xs font-black border border-purple-100">보충</span>}
                          {note && <span className="flex-1 text-xs text-slate-400 font-medium italic truncate">{note}</span>}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })()}

          {/* ====================================================
              진도 관리
          ==================================================== */}
          {activeTab === 'progress' && userRole !== 'student' && (
            <div className="space-y-6">
              {userRole === 'master' && (
                <div className="bg-white p-5 md:p-8 rounded-3xl border border-slate-200 shadow-sm">
                  <h2 className="text-lg font-bold mb-6 flex items-center gap-2"><TrendingUp size={20} className="text-teal-600"/> 진도 등록</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <p className="text-[10px] font-black text-slate-400 mb-2 uppercase">날짜</p>
                      <input type="date" value={progressSelectedDate} onChange={e=>setProgressSelectedDate(e.target.value)} className="w-full px-4 py-3 bg-slate-50 border-2 border-transparent rounded-2xl font-bold outline-none focus:border-teal-400 transition-all" />
                    </div>
                    <div>
                      <p className="text-[10px] font-black text-slate-400 mb-2 uppercase">수업 유형</p>
                      <div className="flex gap-2 flex-wrap">
                        {LESSON_TYPES.map(lt=>(
                          <button key={lt.id} onClick={()=>setNewPlan(p=>({...p,lessonType:lt.id}))}
                            className={`px-3 py-1.5 rounded-xl text-xs font-black border-2 transition-all ${newPlan.lessonType===lt.id?`${lt.color} border-transparent text-white`:'border-slate-100 text-slate-400'}`}>{lt.id}</button>
                        ))}
                      </div>
                    </div>
                  </div>
                  <div className="mb-4">
                    <p className="text-[10px] font-black text-slate-400 mb-2 uppercase">과목 선택 {subjects.length === 0 && <span className="text-red-400">(먼저 과목을 추가하세요)</span>}</p>
                    <div className="flex flex-wrap gap-2">
                      {subjects.map(sub=>(
                        <button key={sub} onClick={()=>setNewPlan(p=>({...p,subject:sub}))}
                          className={`px-3 py-1.5 rounded-xl text-xs font-black border-2 transition ${newPlan.subject===sub?'text-white border-transparent shadow-md':'border-slate-100 text-slate-400'}`}
                          style={newPlan.subject===sub?{background:'var(--sc)'}:{}}>{sub}</button>
                      ))}
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <p className="text-[10px] font-black text-slate-400 mb-2 uppercase">단원/내용</p>
                      <BufferedInput value={newPlan.unit} onSave={(v)=>setNewPlan(p=>({...p,unit:v}))} placeholder="예: Unit 3 문법 설명"
                        className="w-full px-4 py-3 bg-slate-50 border-2 border-transparent rounded-2xl font-bold outline-none focus:border-teal-400 transition-all" />
                    </div>
                    <div>
                      <p className="text-[10px] font-black text-slate-400 mb-2 uppercase">메모</p>
                      <BufferedInput value={newPlan.memo} onSave={(v)=>setNewPlan(p=>({...p,memo:v}))} placeholder="메모..."
                        className="w-full px-4 py-3 bg-slate-50 border-2 border-transparent rounded-2xl font-bold outline-none focus:border-teal-400 transition-all" />
                    </div>
                  </div>
                  <button onClick={addPlan} className="w-full py-4 text-white rounded-2xl font-black shadow-lg transition-all active:scale-95" style={{background:'var(--sc)'}}>등록</button>
                </div>
              )}

              {/* 진도율 요약 */}
              {(() => {
                const jinDoPlans = progressPlans.filter(p => !p.lessonType || p.lessonType === '진도');
                const totalPlans = jinDoPlans.length;
                const donePlans = jinDoPlans.filter(p => p.done).length;
                const overallPct = totalPlans > 0 ? Math.round((donePlans / totalPlans) * 100) : 0;
                const subjectStats = subjects.reduce((acc, sub) => {
                  const all = jinDoPlans.filter(p => p.subject === sub);
                  const done = all.filter(p => p.done).length;
                  if (all.length > 0) acc[sub] = { total: all.length, done };
                  return acc;
                }, {});
                return (
                  <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="font-black text-slate-800 flex items-center gap-2 leading-none"><TrendingUp size={18} className="text-teal-600" /> 전체 진도율</h3>
                      <span className="text-2xl font-black text-teal-600 leading-none">{overallPct}%</span>
                    </div>
                    <div className="h-3 bg-slate-100 rounded-full overflow-hidden mb-4">
                      <div className="h-full bg-teal-500 rounded-full transition-all duration-500" style={{ width: overallPct + '%' }} />
                    </div>
                    {Object.keys(subjectStats).length > 0 && (
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                        {Object.entries(subjectStats).map(([sub, st]) => {
                          const pct = Math.round((st.done / st.total) * 100);
                          return (
                            <div key={sub} className="bg-slate-50 rounded-2xl p-3 border border-slate-100">
                              <div className="flex justify-between items-center mb-1.5">
                                <span className="text-[11px] font-black text-slate-600">{sub}</span>
                                <span className="text-[11px] font-black text-teal-600">{pct}%</span>
                              </div>
                              <div className="h-1.5 bg-slate-200 rounded-full overflow-hidden">
                                <div className="h-full bg-teal-400 rounded-full transition-all" style={{ width: pct + '%' }} />
                              </div>
                              <p className="text-[9px] text-slate-400 font-bold mt-1 leading-none">{st.done}/{st.total} 완료</p>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
              })()}

              {/* 달력 */}
              <div>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 flex items-center gap-1.5"><TrendingUp size={11} className="text-teal-500"/> 진도 수업 달력</p>
                <ProgressMiniCalendar
                  progressPlans={progressPlans}
                  progressCalMonth={progressCalMonth}
                  setProgressCalMonth={setProgressCalMonth}
                  kstToday={kstToday}
                  attendance={attendance}
                  students={students}
                  makeupDates={makeupDates}
                />
              </div>

              {/* 진도 목록 */}
              {(() => {
                const plansByDate = progressPlans.reduce((acc,p)=>{ if(!acc[p.date]) acc[p.date]=[]; acc[p.date].push(p); return acc; },{});
                const sortedDates = Object.keys(plansByDate).sort((a,b)=>b.localeCompare(a));
                if (sortedDates.length === 0) return (
                  <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center text-slate-400 font-bold shadow-sm">등록된 진도 계획이 없습니다.</div>
                );
                return sortedDates.map(date => (
                  <div key={date} className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
                    <div className="px-5 py-3 border-b border-slate-100 flex items-center justify-between bg-slate-50">
                      <span className="font-black text-slate-700">{date}</span>
                      <span className="text-[10px] text-slate-400 font-bold">{plansByDate[date].length}건</span>
                    </div>
                    <div className="divide-y divide-slate-50">
                      {plansByDate[date].map(plan=>{
                        const lt = LESSON_TYPES.find(l=>l.id===(plan.lessonType||'진도'))||LESSON_TYPES[0];
                        return (
                          <div key={plan.id} className="px-5 py-3 flex items-center gap-3">
                            <span className={`text-[10px] font-black px-2 py-1 rounded-lg border ${lt.light} leading-none shrink-0`}>{plan.lessonType||'진도'}</span>
                            {plan.subject && <span className="text-[10px] font-black px-2 py-1 rounded-lg text-white leading-none shrink-0" style={{background:'var(--sc)'}}>{plan.subject}</span>}
                            {editPlanId === plan.id ? (
                              <div className="flex-1 flex gap-2">
                                <BufferedInput value={editPlanData?.unit||''} onSave={(v)=>setEditPlanData(p=>({...p,unit:v}))} className="flex-1 px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold outline-none" />
                                <button onClick={saveEditPlan} className="px-3 py-1.5 text-white rounded-xl font-black text-xs" style={{background:'var(--sc)'}}>저장</button>
                                <button onClick={()=>setEditPlanId(null)} className="px-3 py-1.5 bg-slate-100 text-slate-500 rounded-xl font-black text-xs">취소</button>
                              </div>
                            ) : (
                              <>
                                <div className="flex-1">
                                  <p className={`text-sm font-bold ${plan.done?'line-through text-slate-400':'text-slate-700'}`}>{plan.unit}</p>
                                  {plan.memo && <p className="text-[10px] text-slate-400 font-medium">{plan.memo}</p>}
                                </div>
                                {userRole === 'master' && (
                                  <div className="flex items-center gap-2">
                                    <button onClick={()=>togglePlanDone(plan)} className={`px-2.5 py-1.5 rounded-xl text-xs font-black border-2 transition-all ${plan.done?'bg-teal-500 border-teal-500 text-white':'border-slate-100 text-slate-400'}`}>{plan.done?'완료':'미완'}</button>
                                    <button onClick={()=>{setEditPlanId(plan.id);setEditPlanData({...plan});}} className="p-1.5 text-slate-400 hover:text-blue-500 transition-colors"><Edit2 size={14}/></button>
                                    <button onClick={()=>deletePlan(plan.id)} className="p-1.5 text-slate-400 hover:text-red-500 transition-colors"><Trash2 size={14}/></button>
                                  </div>
                                )}
                              </>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ));
              })()}
            </div>
          )}

          {/* 진도 - student 전용 */}
          {activeTab === 'progress' && userRole === 'student' && (() => {
            const jinDoPlans = progressPlans.filter(p => !p.lessonType || p.lessonType === '진도');
            const totalPlans = jinDoPlans.length;
            const donePlans = jinDoPlans.filter(p=>p.done).length;
            const overallPct = totalPlans > 0 ? Math.round((donePlans/totalPlans)*100) : 0;
            const plansByDate = progressPlans.reduce((acc,p)=>{ if(!acc[p.date]) acc[p.date]=[]; acc[p.date].push(p); return acc; },{});
            const sortedDates = Object.keys(plansByDate).sort((a,b)=>b.localeCompare(a));
            return (
              <div className="max-w-2xl mx-auto space-y-5">
                <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-5">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-black text-slate-800 flex items-center gap-2"><TrendingUp size={16} className="text-teal-600"/> 전체 진도율</h3>
                    <span className="text-2xl font-black text-teal-600">{overallPct}%</span>
                  </div>
                  <div className="h-3 bg-slate-100 rounded-full overflow-hidden">
                    <div className="h-full bg-teal-500 rounded-full transition-all duration-500" style={{width:overallPct+'%'}} />
                  </div>
                </div>
                {sortedDates.map(date=>(
                  <div key={date} className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
                    <div className="px-5 py-3 border-b border-slate-100 bg-slate-50 flex items-center justify-between">
                      <span className="font-black text-slate-700">{date}</span>
                    </div>
                    <div className="divide-y divide-slate-50">
                      {plansByDate[date].map(plan=>{
                        const lt=LESSON_TYPES.find(l=>l.id===(plan.lessonType||'진도'))||LESSON_TYPES[0];
                        return (
                          <div key={plan.id} className="px-5 py-3 flex items-center gap-3">
                            <span className={`text-[10px] font-black px-2 py-1 rounded-lg border ${lt.light} leading-none shrink-0`}>{plan.lessonType||'진도'}</span>
                            {plan.subject && <span className="text-[10px] font-black px-2 py-1 rounded-lg text-white leading-none shrink-0" style={{background:'var(--sc)'}}>{plan.subject}</span>}
                            <div className="flex-1">
                              <p className={`text-sm font-bold ${plan.done?'line-through text-slate-400':'text-slate-700'}`}>{plan.unit}</p>
                              {plan.memo && <p className="text-[10px] text-slate-400">{plan.memo}</p>}
                            </div>
                            {plan.done && <CheckCircle2 size={16} className="text-teal-500 shrink-0"/>}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            );
          })()}

          {/* ====================================================
              학생 관리
          ==================================================== */}
          {activeTab === 'students' && userRole !== 'student' && (
            <div className="max-w-4xl mx-auto space-y-6">
              {/* 반 설정 */}
              {userRole === 'master' && (
                <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm">
                  <div className="flex items-center justify-between mb-3">
                    <h2 className="text-base font-black text-slate-800 flex items-center gap-2"><Users size={16} className="text-indigo-500"/> 반 설정</h2>
                    <button onClick={()=>setEditingClassrooms(v=>!v)} className={`px-3 py-1.5 rounded-xl text-xs font-black border transition-all ${editingClassrooms?'bg-indigo-600 text-white border-indigo-600':'bg-white border-slate-200 text-slate-500'}`}>{editingClassrooms?'완료':'편집'}</button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {classrooms.map(c=>(
                      <div key={c.id} className={`flex items-center gap-1 px-3 py-1.5 rounded-xl text-sm font-black border ${editingClassrooms?'bg-indigo-50 border-indigo-200 text-indigo-700':'bg-slate-50 border-slate-200 text-slate-600'}`}>
                        {c.name}
                        {editingClassrooms && <button onClick={async()=>await deleteDoc(doc(db,'artifacts',APP_ID,'public','data','classrooms',c.id))} className="ml-1 text-indigo-300 hover:text-red-500 font-black">×</button>}
                      </div>
                    ))}
                    {editingClassrooms && (
                      <div className="flex items-center gap-1">
                        <input value={classroomInput} onChange={e=>setClassroomInput(e.target.value)}
                          onKeyDown={async e=>{ if(e.key==='Enter'&&classroomInput.trim()){ await setDoc(doc(db,'artifacts',APP_ID,'public','data','classrooms','c'+Date.now()),{name:classroomInput.trim()}); setClassroomInput(''); }}}
                          placeholder="반 이름..." className="px-3 py-1.5 rounded-xl text-sm font-bold border border-indigo-200 bg-white outline-none focus:border-indigo-400 w-28" />
                        <button onClick={async()=>{ if(classroomInput.trim()){ await setDoc(doc(db,'artifacts',APP_ID,'public','data','classrooms','c'+Date.now()),{name:classroomInput.trim()}); setClassroomInput(''); }}} className="px-2.5 py-1.5 rounded-xl bg-indigo-500 text-white text-xs font-black">+</button>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* 마스터 코드 변경 - 영어 앱 전용 */}
              {userRole === 'master' && (
                <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm">
                  <div className="flex items-center justify-between mb-3">
                    <h2 className="text-base font-black text-slate-800 flex items-center gap-2"><KeyRound size={16} className="text-orange-500"/> 마스터 코드 변경</h2>
                    <button onClick={()=>setShowMasterCodeEdit(v=>!v)} className={`px-3 py-1.5 rounded-xl text-xs font-black border transition-all ${showMasterCodeEdit?'bg-orange-500 text-white border-orange-500':'bg-white border-slate-200 text-slate-500'}`}>{showMasterCodeEdit?'취소':'변경'}</button>
                  </div>
                  {showMasterCodeEdit ? (
                    <div className="flex gap-2">
                      <input type="password" value={newMasterCodeInput} onChange={e=>setNewMasterCodeInput(e.target.value)} placeholder="새 마스터 코드 입력"
                        className="flex-1 px-4 py-2.5 bg-slate-50 border-2 border-transparent rounded-2xl font-bold outline-none focus:border-orange-400 transition-all" onKeyDown={e=>e.key==='Enter'&&saveMasterCode()} />
                      <button onClick={saveMasterCode} className="px-4 py-2.5 bg-orange-500 text-white rounded-2xl font-black text-sm shadow-sm hover:bg-orange-600 transition-all">저장</button>
                    </div>
                  ) : (
                    <p className="text-sm text-slate-400 font-medium">현재 코드: <span className="font-black text-slate-600">{'*'.repeat(masterCode.length)}</span></p>
                  )}
                </div>
              )}

              {/* 학생 일괄 등록 */}
              {userRole === 'master' && (
                <div className="bg-white p-5 md:p-8 rounded-3xl shadow-sm border border-slate-200">
                  <h2 className="text-lg font-bold mb-4 flex items-center gap-2 text-indigo-600"><UserPlus size={22}/> 학생 일괄 등록</h2>
                  <BufferedTextarea value={bulkStudentInput} onSave={setBulkStudentInput} placeholder="이름 입력 (쉼표 또는 줄바꿈으로 구분)" className="w-full h-28 px-4 py-4 rounded-2xl border bg-slate-50 font-bold resize-none mb-4 outline-none focus:bg-white text-slate-800 shadow-inner" />
                  <button onClick={()=>{
                    if (!bulkStudentInput.trim()) return;
                    const names = bulkStudentInput.split(/[,\n]/).map(n=>n.trim()).filter(Boolean);
                    const batch = writeBatch(db);
                    names.forEach(name=>{
                      const id='s'+(typeof crypto!=='undefined'&&crypto.randomUUID?crypto.randomUUID().replace(/-/g,''):Date.now()+Math.random().toString(36).substr(2,9));
                      batch.set(doc(db,'artifacts',APP_ID,'public','data','students',id),{name,studentCode:'',homeroomTeacher:'',highSchool:''});
                    });
                    batch.commit().then(()=>setBulkStudentInput(''));
                  }} className="w-full py-4 rounded-2xl font-black text-lg shadow-xl text-white transition-all" style={{background:'var(--sc)'}}>등록하기</button>
                </div>
              )}

              {/* 학생 목록 */}
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">정렬</span>
                {[{id:'custom',l:'직접'},{id:'name',l:'가나다'},{id:'school',l:'학교별'},{id:'group',l:'그룹별'}].map(opt=>(
                  <button key={opt.id} onClick={()=>setStudentSort(opt.id)}
                    className={`px-3 py-1.5 rounded-xl text-[10px] font-black border transition-all ${studentSort===opt.id?'text-white border-transparent shadow-sm':'bg-white border-slate-200 text-slate-500'}`}
                    style={studentSort===opt.id?{background:'var(--sc)'}:{}}>{opt.l}</button>
                ))}
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {(() => {
                  let sorted = [...students];
                  if (studentSort==='name') sorted.sort((a,b)=>a.name.localeCompare(b.name,'ko'));
                  else if (studentSort==='school') sorted.sort((a,b)=>(a.highSchool||'').localeCompare(b.highSchool||'','ko')||a.name.localeCompare(b.name,'ko'));
                  else if (studentSort==='group') sorted.sort((a,b)=>(a.group||'z').localeCompare(b.group||'z')||a.name.localeCompare(b.name,'ko'));
                  return sorted;
                })().map(s=>(
                  <div key={s.id}
                    draggable={userRole==='master'&&!editStudentId}
                    onDragStart={()=>setDragState({type:'student',fromId:s.id,overId:null})}
                    onDragOver={(e)=>{e.preventDefault();setDragState(p=>({...p,overId:s.id}));}}
                    onDragEnd={()=>{if(dragState.fromId&&dragState.overId)reorderList('student',dragState.fromId,dragState.overId);setDragState({type:null,fromId:null,overId:null});}}
                    className={`bg-white p-5 rounded-3xl border border-slate-200 shadow-sm group transition-all ${dragState.overId===s.id&&dragState.fromId!==s.id?'ring-2 ring-indigo-400 scale-[1.01]':''} ${userRole==='master'&&!editStudentId?'cursor-grab active:cursor-grabbing':''}`}>
                    {editStudentId === s.id ? (
                      <div className="space-y-3">
                        <div className="grid grid-cols-2 gap-3">
                          <div><p className="text-[9px] font-black text-slate-400 mb-1">이름</p><BufferedInput value={editStudentData.name} onSave={(v)=>setEditStudentData(p=>({...p,name:v}))} className="w-full px-3 py-2 border-2 border-slate-100 rounded-xl font-bold text-sm outline-none focus:border-blue-400 bg-white text-slate-800" /></div>
                          <div><p className="text-[9px] font-black text-slate-400 mb-1">학생 코드</p><BufferedInput value={editStudentData.studentCode} onSave={(v)=>setEditStudentData(p=>({...p,studentCode:v}))} className="w-full px-3 py-2 border-2 border-slate-100 rounded-xl font-bold text-sm outline-none focus:border-blue-400 bg-white text-slate-800" placeholder="학생 코드..." /></div>
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                          <div><p className="text-[9px] font-black text-slate-400 mb-1">학교</p><BufferedInput value={editStudentData.highSchool} onSave={(v)=>setEditStudentData(p=>({...p,highSchool:v}))} className="w-full px-3 py-2 border-2 border-slate-100 rounded-xl font-bold text-sm outline-none focus:border-blue-400 bg-white text-slate-800" placeholder="학교명..." /></div>
                          <div><p className="text-[9px] font-black text-slate-400 mb-1">담임 선생님</p><BufferedInput value={editStudentData.homeroomTeacher} onSave={(v)=>setEditStudentData(p=>({...p,homeroomTeacher:v}))} className="w-full px-3 py-2 border-2 border-slate-100 rounded-xl font-bold text-sm outline-none focus:border-blue-400 bg-white text-slate-800" placeholder="담임..." /></div>
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                          <div><p className="text-[9px] font-black text-slate-400 mb-1">그룹</p>
                            <select value={editStudentData.group||''} onChange={e=>setEditStudentData(p=>({...p,group:e.target.value}))} className="w-full px-3 py-2 border-2 border-slate-100 rounded-xl font-bold text-sm outline-none focus:border-blue-400 bg-white text-slate-800">
                              <option value="">없음</option>
                              {['A','B','C','D','E'].map(g=><option key={g} value={g}>그룹 {g}</option>)}
                            </select>
                          </div>
                          <div><p className="text-[9px] font-black text-slate-400 mb-1">반</p>
                            <select value={editStudentData.classroomId||''} onChange={e=>setEditStudentData(p=>({...p,classroomId:e.target.value}))} className="w-full px-3 py-2 border-2 border-slate-100 rounded-xl font-bold text-sm outline-none focus:border-blue-400 bg-white text-slate-800">
                              <option value="">없음</option>
                              {classrooms.map(c=><option key={c.id} value={c.id}>{c.name}</option>)}
                            </select>
                          </div>
                        </div>
                        <div className="flex gap-2 pt-1">
                          <button onClick={()=>setEditStudentId(null)} className="flex-1 py-2.5 bg-slate-100 text-slate-500 rounded-2xl font-black text-sm transition">취소</button>
                          <button onClick={saveStudentDetails} className="flex-1 py-2.5 text-white rounded-2xl font-black text-sm shadow-md transition" style={{background:'var(--sc)'}}>저장</button>
                        </div>
                      </div>
                    ) : (
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex-1 min-w-0">
                          <p className="font-black text-slate-800 text-base leading-none">{s.name}</p>
                          {s.highSchool && <p className="text-[11px] text-slate-400 font-bold mt-1">{s.highSchool}</p>}
                          {s.studentCode && <p className="text-[9px] text-slate-300 font-bold mt-1">코드: {s.studentCode}</p>}
                          {s.group && <span className="inline-block mt-1 text-[9px] font-black px-1.5 py-0.5 rounded-lg bg-amber-100 text-amber-700">그룹 {s.group}</span>}
                          {/* 노트 */}
                          {userRole === 'master' && (
                            <BufferedTextarea value={studentNotes[s.id]||''} onSave={(v)=>saveStudentNote(s.id,v)} placeholder="학생 메모..."
                              className="mt-2 w-full px-3 py-2 bg-slate-50 border border-slate-100 rounded-xl text-xs font-medium resize-none h-12 outline-none focus:border-slate-300 text-slate-600" />
                          )}
                          {userRole === 'teacher' && studentNotes[s.id] && (
                            <p className="mt-2 text-[10px] text-slate-400 font-medium italic">{studentNotes[s.id]}</p>
                          )}
                        </div>
                        {userRole === 'master' && (
                          <div className="flex gap-2 shrink-0">
                            <button onClick={()=>{setEditStudentId(s.id);setEditStudentData({name:s.name,studentCode:s.studentCode||'',homeroomTeacher:s.homeroomTeacher||'',highSchool:s.highSchool||'',group:s.group||'',classroomId:s.classroomId||''});}} className="p-2 text-blue-500 bg-blue-50 hover:bg-blue-100 rounded-xl transition-all"><Edit2 size={16}/></button>
                            <button onClick={()=>setConfirmDelete({coll:'students',id:s.id,label:s.name})} className="p-2 text-red-500 bg-red-50 hover:bg-red-100 rounded-xl transition-all"><Trash2 size={16}/></button>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ====================================================
              리포트
          ==================================================== */}
          {activeTab === 'report' && userRole !== 'student' && (
            <div className="max-w-4xl mx-auto space-y-6">
              {/* 리포트 생성 */}
              {(() => {
                const hasSelection = Object.values(selectedReportTests).some(Boolean);
                const chosenTests = hasSelection ? tests.filter(t => selectedReportTests[t.id]) : tests;

                const printReport = () => {
                  const win = window.open('', '_blank', 'width=1000,height=900');
                  const now = new Date(Date.now()+9*60*60*1000).toISOString().split('T')[0];
                  const fromDate = reportRange.from || '';
                  const toDate = reportRange.to || '';
                  const inRange = (date) => !date || (!fromDate && !toDate) || (date >= (fromDate||'0000') && date <= (toDate||'9999'));

                  // ── 학생별 시험 성적 ──
                  const sortedTests2 = chosenTests.slice().sort((a,b)=>(a.date||'').localeCompare(b.date||''));
                  const thds = sortedTests2.map(t =>
                    `<th style="padding:7px 8px;background:#fff7ed;color:#ea580c;font-size:10px;white-space:nowrap;border:1px solid #e2e8f0">${t.title}<br/><span style="font-weight:400;font-size:9px">${t.date}${t.maxScore ? ' · '+t.maxScore+'점' : ''}</span></th>`
                  ).join('');

                  const studentRows = students.map(s => {
                    const tds = sortedTests2.map(t => {
                      const res = testScores[`${s.id}-${t.id}`] || {};
                      const sc = res.score;
                      const val = res.absent === 'absent' ? '결시' : res.absent === 'excluded' ? '-' : sc != null ? sc+'점' : '-';
                      const color = res.absent === 'absent' ? '#ef4444' : sc != null ? '#1e293b' : '#cbd5e1';
                      const pct = (sc != null && t.maxScore) ? ' ('+Math.round(sc/t.maxScore*100)+'%)' : '';
                      return `<td style="padding:7px 8px;text-align:center;font-weight:${sc!=null||res.absent?'900':'400'};color:${color};border:1px solid #e2e8f0">${val}${pct}</td>`;
                    }).join('');
                    const validScores = sortedTests2.map(t => { const r=testScores[`${s.id}-${t.id}`]; return r?.absent?null:(r?.score!=null?parseFloat(r.score):null); }).filter(v=>v!=null&&!isNaN(v));
                    const avg = validScores.length ? (validScores.reduce((a,b)=>a+b,0)/validScores.length).toFixed(1) : '-';
                    const wrongUnits = sortedTests2.flatMap(t => { const r=testScores[`${s.id}-${t.id}`]||{}; return (r.wrongNums||[]).map(n=>(t.questions||[])[n-1]?.unit).filter(Boolean); });
                    const unitMap = {}; wrongUnits.forEach(u=>{unitMap[u]=(unitMap[u]||0)+1;});
                    const topUnits = Object.entries(unitMap).sort((a,b)=>b[1]-a[1]).slice(0,3).map(([u,c])=>`${u}(${c}회)`).join(', ');
                    return `<tr><td style="padding:7px 8px;font-weight:700;white-space:nowrap;border:1px solid #e2e8f0">${s.name}</td>${tds}<td style="padding:7px 8px;text-align:center;font-weight:900;color:#ea580c;border:1px solid #e2e8f0">${avg}${avg!=='-'?'점':''}</td><td style="padding:7px 8px;font-size:10px;color:#ef4444;border:1px solid #e2e8f0">${topUnits||'-'}</td></tr>`;
                  }).join('');

                  // ── 반 평균 ──
                  const avgs = sortedTests2.map(t => {
                    const vs = students.map(s=>{const r=testScores[`${s.id}-${t.id}`];const v=r?.absent?null:parseFloat(r?.score);return(!isNaN(v)&&v!=null)?v:null;}).filter(v=>v!=null);
                    const avg = vs.length ? (vs.reduce((a,b)=>a+b,0)/vs.length).toFixed(1) : '-';
                    return `<td style="padding:7px 8px;text-align:center;font-weight:900;color:#ea580c;background:#fff7ed;border:1px solid #e2e8f0">${avg}${avg!=='-'?'점':''}</td>`;
                  }).join('');

                  // ── 과제 현황 ──
                  const rangedAssign = assignments.filter(a => inRange(a.deadline));
                  const assignRows = rangedAssign.map(a => {
                    const targets = students.filter(s => a.type==='all'||(a.targetStudents&&a.targetStudents.includes(s.id)));
                    const done = targets.filter(s => ['completed','exempt'].includes(submissions[`${s.id}-${a.id}`]?.status||'not_started')).length;
                    const pct = targets.length ? Math.round(done/targets.length*100) : 0;
                    const incomplete = targets.filter(s => !['completed','exempt'].includes(submissions[`${s.id}-${a.id}`]?.status||'not_started')).map(s=>s.name).join(', ');
                    return `<tr><td style="padding:6px 8px;border:1px solid #e2e8f0;font-weight:700">${a.subject||'-'}</td><td style="padding:6px 8px;border:1px solid #e2e8f0">${a.title}</td><td style="padding:6px 8px;border:1px solid #e2e8f0;text-align:center;font-weight:900;color:${pct===100?'#22c55e':'#ea580c'}">${pct}%</td><td style="padding:6px 8px;border:1px solid #e2e8f0;font-size:10px;color:#ef4444">${incomplete||'전원 완료'}</td></tr>`;
                  }).join('');

                  // ── 진도 현황 ──
                  const rangedPlans = progressPlans.filter(p => inRange(p.date)).slice().sort((a,b)=>(b.date||'').localeCompare(a.date||''));
                  const planRows = rangedPlans.map(p =>
                    `<tr><td style="padding:5px 8px;border:1px solid #e2e8f0;white-space:nowrap">${p.date||'-'}</td><td style="padding:5px 8px;border:1px solid #e2e8f0">${p.lessonType||'진도'}</td><td style="padding:5px 8px;border:1px solid #e2e8f0">${p.subject||'-'}</td><td style="padding:5px 8px;border:1px solid #e2e8f0">${p.unit||'-'}</td><td style="padding:5px 8px;border:1px solid #e2e8f0;text-align:center;color:${p.done?'#22c55e':'#94a3b8'}">${p.done?'✓':'-'}</td></tr>`
                  ).join('');

                  // ── 출결 현황 ──
                  const attDates = Object.keys(attendance).map(k=>k.split('-').slice(1).join('-')).filter((d,i,a)=>a.indexOf(d)===i&&inRange(d)).sort();
                  const attRows = students.map(s => {
                    const present = attDates.filter(d=>attendance[`${s.id}-${d}`]?.status==='present').length;
                    const late = attDates.filter(d=>attendance[`${s.id}-${d}`]?.status==='late').length;
                    const absent2 = attDates.filter(d=>attendance[`${s.id}-${d}`]?.status==='absent').length;
                    const rate = attDates.length ? Math.round(present/attDates.length*100) : 0;
                    return `<tr><td style="padding:6px 8px;border:1px solid #e2e8f0;font-weight:700">${s.name}</td><td style="padding:6px 8px;border:1px solid #e2e8f0;text-align:center">${present}</td><td style="padding:6px 8px;border:1px solid #e2e8f0;text-align:center;color:#d97706">${late}</td><td style="padding:6px 8px;border:1px solid #e2e8f0;text-align:center;color:#ef4444">${absent2}</td><td style="padding:6px 8px;border:1px solid #e2e8f0;text-align:center;font-weight:900;color:${rate>=90?'#22c55e':rate>=70?'#d97706':'#ef4444'}">${rate}%</td></tr>`;
                  }).join('');

                  win.document.write(`<!DOCTYPE html><html><head><meta charset="utf-8"><title>학습 종합 리포트</title>
                  <style>*{box-sizing:border-box;margin:0;padding:0}body{font-family:-apple-system,BlinkMacSystemFont,'Malgun Gothic','Apple SD Gothic Neo',sans-serif;padding:24px;color:#1e293b;font-size:12px;-webkit-print-color-adjust:exact;print-color-adjust:exact}
                  h1{font-size:20px;font-weight:900;color:#1d4ed8;margin-bottom:4px}.meta{font-size:11px;color:#94a3b8;margin-bottom:20px}
                  .section{margin-bottom:28px;page-break-inside:avoid}.section-title{font-size:11px;font-weight:900;color:#94a3b8;text-transform:uppercase;letter-spacing:.06em;margin-bottom:8px;padding-bottom:5px;border-bottom:2px solid #f1f5f9}
                  table{width:100%;border-collapse:collapse;font-size:11px}th{background:#f8fafc;padding:7px 8px;font-weight:900;text-align:center;border:1px solid #e2e8f0}
                  tbody tr:nth-child(even) td{background:#f8fafc}@media print{body{padding:10px}tr{page-break-inside:avoid}}</style></head><body>
                  <h1>📊 ${siteTitle} 학습 종합 리포트</h1>
                  <p class="meta">출력일: ${now} · 기간: ${fromDate||'전체'} ~ ${toDate||'전체'} · 학생 ${students.length}명</p>
                  ${sortedTests2.length ? `<div class="section"><div class="section-title">🏆 시험 성적</div>
                  <table><thead><tr><th style="border:1px solid #e2e8f0">이름</th>${thds}<th style="background:#fff7ed;color:#ea580c;border:1px solid #e2e8f0">평균</th><th style="background:#fef2f2;color:#ef4444;border:1px solid #e2e8f0">취약 단원</th></tr></thead>
                  <tbody>${studentRows}</tbody><tfoot><tr><td style="padding:7px 8px;font-weight:900;background:#fff7ed;border:1px solid #e2e8f0">반 평균</td>${avgs}<td colspan="2" style="background:#fff7ed;border:1px solid #e2e8f0"></td></tr></tfoot></table></div>` : ''}
                  ${rangedAssign.length ? `<div class="section"><div class="section-title">📋 과제 현황</div>
                  <table><thead><tr><th style="border:1px solid #e2e8f0">과목</th><th style="border:1px solid #e2e8f0">과제명</th><th style="border:1px solid #e2e8f0">완료율</th><th style="border:1px solid #e2e8f0">미완료 학생</th></tr></thead><tbody>${assignRows}</tbody></table></div>` : ''}
                  ${attDates.length ? `<div class="section"><div class="section-title">📅 출결 현황</div>
                  <table><thead><tr><th style="border:1px solid #e2e8f0">이름</th><th style="border:1px solid #e2e8f0">출석</th><th style="border:1px solid #e2e8f0">지각</th><th style="border:1px solid #e2e8f0">결석</th><th style="border:1px solid #e2e8f0">출석률</th></tr></thead><tbody>${attRows}</tbody></table></div>` : ''}
                  ${rangedPlans.length ? `<div class="section"><div class="section-title">📈 진도 현황</div>
                  <table><thead><tr><th style="border:1px solid #e2e8f0">날짜</th><th style="border:1px solid #e2e8f0">유형</th><th style="border:1px solid #e2e8f0">과목</th><th style="border:1px solid #e2e8f0">내용</th><th style="border:1px solid #e2e8f0">완료</th></tr></thead><tbody>${planRows}</tbody></table></div>` : ''}
                  <script>window.onload=function(){window.print();window.close();};<\/script></body></html>`);
                  win.document.close();
                };

                return (
                  <div className="space-y-5">
                    {/* 날짜 범위 */}
                    <div className="bg-white p-5 md:p-6 rounded-3xl border border-slate-200 shadow-sm">
                      <h2 className="text-lg font-bold mb-4 flex items-center gap-2"><Printer size={20}/> 리포트 생성</h2>
                      <div className="grid grid-cols-2 gap-4 mb-4">
                        <div>
                          <p className="text-[10px] font-black text-slate-400 mb-2">시작일</p>
                          <input type="date" value={reportRange.from} onChange={e=>setReportRange(p=>({...p,from:e.target.value}))} className="w-full px-4 py-3 bg-slate-50 border-2 border-transparent rounded-2xl font-bold outline-none focus:border-blue-400 transition-all text-slate-800"/>
                        </div>
                        <div>
                          <p className="text-[10px] font-black text-slate-400 mb-2">종료일</p>
                          <input type="date" value={reportRange.to} onChange={e=>setReportRange(p=>({...p,to:e.target.value}))} className="w-full px-4 py-3 bg-slate-50 border-2 border-transparent rounded-2xl font-bold outline-none focus:border-blue-400 transition-all text-slate-800"/>
                        </div>
                      </div>
                      <div className="flex flex-wrap gap-2 mb-5">
                        {[
                          {l:'이번 주', fn:()=>{const d=new Date(Date.now()+9*60*60*1000);const day=d.getDay();const mon=new Date(d);mon.setDate(d.getDate()-(day===0?6:day-1));const sun=new Date(mon);sun.setDate(mon.getDate()+6);setReportRange({from:mon.toISOString().split('T')[0],to:sun.toISOString().split('T')[0]});}},
                          {l:'이번 달', fn:()=>{const d=new Date(Date.now()+9*60*60*1000);const y=d.getFullYear();const m=d.getMonth();const last=new Date(y,m+1,0);setReportRange({from:`${y}-${String(m+1).padStart(2,'0')}-01`,to:last.toISOString().split('T')[0]});}},
                          {l:'지난 달', fn:()=>{const d=new Date(Date.now()+9*60*60*1000);const y=d.getMonth()===0?d.getFullYear()-1:d.getFullYear();const m=d.getMonth()===0?12:d.getMonth();const last=new Date(y,m,0);setReportRange({from:`${y}-${String(m).padStart(2,'0')}-01`,to:last.toISOString().split('T')[0]});}},
                          {l:'전체', fn:()=>setReportRange({from:'',to:''})},
                        ].map(btn=>(
                          <button key={btn.l} onClick={btn.fn} className="px-3 py-1.5 rounded-xl text-xs font-black border border-slate-200 bg-slate-50 text-slate-500 hover:border-blue-400 hover:text-blue-500 transition-all">{btn.l}</button>
                        ))}
                      </div>
                      {/* 달력 */}
                      <p className="text-[10px] font-black text-slate-400 mb-2 flex items-center gap-1"><Calendar size={11}/> 달력 날짜 클릭으로 범위 선택 <span className="text-slate-300 font-medium">(첫 클릭: 시작일 · 두 번째: 종료일)</span></p>
                      <ProgressMiniCalendar
                        progressPlans={progressPlans}
                        progressCalMonth={progressCalMonth}
                        setProgressCalMonth={setProgressCalMonth}
                        kstToday={kstToday}
                        attendance={attendance}
                        students={students}
                        makeupDates={makeupDates}
                        onDateSelect={(date) => {
                          if (!reportRange.from || (reportRange.from && reportRange.to)) {
                            setReportRange({from:date, to:''});
                          } else {
                            if (date >= reportRange.from) setReportRange(p=>({...p,to:date}));
                            else setReportRange({from:date, to:reportRange.from});
                          }
                        }}
                      />
                      {(reportRange.from || reportRange.to) && (
                        <div className="mt-2 px-4 py-2 bg-blue-50 rounded-2xl border border-blue-100 flex items-center gap-2">
                          <Calendar size={12} className="text-blue-400"/>
                          <span className="text-xs font-black text-blue-600">{reportRange.from||'시작일 미설정'} ~ {reportRange.to||'종료일 미설정'}</span>
                          <button onClick={()=>setReportRange({from:'',to:''})} className="ml-auto text-blue-300 hover:text-blue-500 font-black text-sm">×</button>
                        </div>
                      )}
                    </div>

                    {/* 시험 선택 */}
                    {tests.length > 0 && (
                      <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm">
                        <p className="font-black text-slate-800 text-sm mb-3 flex items-center gap-2"><Trophy size={15} className="text-orange-500"/> 포함할 시험 선택 <span className="text-[10px] font-medium text-slate-400">(미선택 시 전체)</span></p>
                        <div className="flex flex-wrap gap-2 mb-2">
                          {tests.slice().sort((a,b)=>(a.date||'').localeCompare(b.date||'')).map(t=>(
                            <button key={t.id} onClick={()=>setSelectedReportTests(p=>({...p,[t.id]:!p[t.id]}))}
                              className={`px-3 py-1.5 rounded-xl text-[11px] font-black border-2 transition-all ${selectedReportTests[t.id]?'bg-orange-500 border-orange-500 text-white shadow-sm':'bg-white border-slate-200 text-slate-500 hover:border-orange-300'}`}>
                              {t.title} <span className="opacity-60 font-medium">{t.date}</span>
                            </button>
                          ))}
                        </div>
                        {hasSelection && <button onClick={()=>setSelectedReportTests({})} className="text-[10px] font-black text-red-400 hover:text-red-600 transition-colors">선택 초기화</button>}
                      </div>
                    )}

                    {/* 출력 버튼 */}
                    <button onClick={printReport} className="w-full py-4 text-white rounded-2xl font-black shadow-lg transition-all active:scale-95 flex items-center justify-center gap-2" style={{background:'var(--sc)'}}>
                      <Printer size={18}/> 리포트 출력 (새 창)
                    </button>
                  </div>
                );
              })()}
            </div>
          )}

          {/* ====================================================
              항목 등록
          ==================================================== */}
          {activeTab === 'assignments' && userRole !== 'student' && (
            <div className="max-w-4xl mx-auto space-y-6">

              {/* 과목 설정 - master 전용 */}
              {userRole === 'master' && (
                <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-base font-black text-slate-800 flex items-center gap-2"><Tag size={16} className="text-indigo-500"/> 과목 설정</h2>
                    <button onClick={()=>setEditingSubjects(v=>!v)} className={`px-3 py-1.5 rounded-xl text-xs font-black border transition-all ${editingSubjects?'bg-indigo-600 text-white border-indigo-600':'bg-white border-slate-200 text-slate-500'}`}>{editingSubjects?'완료':'편집'}</button>
                  </div>
                  {subjects.length === 0 && !editingSubjects && (
                    <div className="flex items-center gap-2 px-4 py-3 bg-amber-50 border border-amber-200 rounded-2xl mb-3">
                      <AlertTriangle size={14} className="text-amber-500 shrink-0"/>
                      <p className="text-xs font-black text-amber-700">과목이 없습니다. 편집 버튼을 눌러 과목을 추가하세요.</p>
                    </div>
                  )}
                  <div className="flex flex-wrap gap-2">
                    {subjects.map((sub,i)=>(
                      <div key={sub} className={`flex items-center gap-1 px-3 py-1.5 rounded-xl text-sm font-black border ${editingSubjects?'bg-indigo-50 border-indigo-200 text-indigo-700':'bg-slate-50 border-slate-200 text-slate-600'}`}>
                        {sub}
                        {editingSubjects && <button onClick={()=>saveSubjects(subjects.filter((_,j)=>j!==i))} className="ml-1 text-indigo-300 hover:text-red-500 transition-colors font-black leading-none">×</button>}
                      </div>
                    ))}
                    {editingSubjects && (
                      <div className="flex items-center gap-1">
                        <input value={subjectInput} onChange={e=>setSubjectInput(e.target.value)}
                          onKeyDown={e=>{ if(e.key==='Enter'&&subjectInput.trim()&&!subjects.includes(subjectInput.trim())){ saveSubjects([...subjects,subjectInput.trim()]); setSubjectInput(''); }}}
                          placeholder="과목 추가..." className="px-3 py-1.5 rounded-xl text-sm font-bold border border-indigo-200 bg-white outline-none focus:border-indigo-400 w-28 text-slate-700" />
                        <button onClick={()=>{ if(subjectInput.trim()&&!subjects.includes(subjectInput.trim())){ saveSubjects([...subjects,subjectInput.trim()]); setSubjectInput(''); }}} className="px-2.5 py-1.5 rounded-xl bg-indigo-500 text-white text-xs font-black">+</button>
                      </div>
                    )}
                  </div>
                  {editingSubjects && <p className="text-[10px] text-slate-400 font-medium mt-3">Enter 또는 + 버튼으로 추가 · × 로 삭제</p>}
                </div>
              )}

              {/* 암기 섹션 설정 - master 전용 / 영어 앱 전용 */}
              {userRole === 'master' && (
                <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-base font-black text-slate-800 flex items-center gap-2"><BookMarked size={16} className="text-purple-500"/> 암기 영역 설정</h2>
                    <button onClick={()=>setEditingMemoSections(v=>!v)} className={`px-3 py-1.5 rounded-xl text-xs font-black border transition-all ${editingMemoSections?'bg-purple-600 text-white border-purple-600':'bg-white border-slate-200 text-slate-500'}`}>{editingMemoSections?'완료':'편집'}</button>
                  </div>
                  <p className="text-[10px] text-slate-400 font-medium mb-3">항목 등록 시 선택할 암기 영역을 설정합니다. (예: 교과서 본문, 수능 어휘, 영문법 정리)</p>
                  <div className="flex flex-wrap gap-2">
                    {memoSections.map((sec,i)=>(
                      <div key={sec} className={`flex items-center gap-1 px-3 py-1.5 rounded-xl text-sm font-black border ${editingMemoSections?'bg-purple-50 border-purple-200 text-purple-700':'bg-slate-50 border-slate-200 text-slate-600'}`}>
                        {sec}
                        {editingMemoSections && <button onClick={()=>saveMemoSections(memoSections.filter((_,j)=>j!==i))} className="ml-1 text-purple-300 hover:text-red-500 transition-colors font-black leading-none">×</button>}
                      </div>
                    ))}
                    {editingMemoSections && (
                      <div className="flex items-center gap-1">
                        <input value={memoSectionInput} onChange={e=>setMemoSectionInput(e.target.value)}
                          onKeyDown={e=>{ if(e.key==='Enter'&&memoSectionInput.trim()&&!memoSections.includes(memoSectionInput.trim())){ saveMemoSections([...memoSections,memoSectionInput.trim()]); setMemoSectionInput(''); }}}
                          placeholder="영역 추가..." className="px-3 py-1.5 rounded-xl text-sm font-bold border border-purple-200 bg-white outline-none focus:border-purple-400 w-32 text-slate-700" />
                        <button onClick={()=>{ if(memoSectionInput.trim()&&!memoSections.includes(memoSectionInput.trim())){ saveMemoSections([...memoSections,memoSectionInput.trim()]); setMemoSectionInput(''); }}} className="px-2.5 py-1.5 rounded-xl bg-purple-500 text-white text-xs font-black">+</button>
                      </div>
                    )}
                    {memoSections.length === 0 && !editingMemoSections && (
                      <span className="text-xs text-slate-400 font-medium">편집 버튼을 눌러 암기 영역을 추가하세요</span>
                    )}
                  </div>
                </div>
              )}

              {/* 항목 등록 - master 전용 */}
              {userRole === 'master' && (
                <div className="bg-white p-5 md:p-8 rounded-3xl border border-slate-200 shadow-sm">
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-bold text-slate-800">신규 항목 발행</h2>
                    <div className="flex bg-slate-100 p-1 rounded-xl">
                      <button onClick={()=>setRegCategory('assignment')} className={`px-4 py-2 rounded-lg text-xs font-bold transition ${regCategory==='assignment'?'bg-white text-indigo-800 shadow-sm font-black':'text-slate-400'}`}>과제(숙제)</button>
                      <button onClick={()=>setRegCategory('memorization')} className={`px-4 py-2 rounded-lg text-xs font-bold transition ${regCategory==='memorization'?'bg-white text-purple-800 shadow-sm font-black':'text-slate-400'}`}>암기(테스트)</button>
                    </div>
                  </div>
                  <div className="space-y-6">
                    {/* 과목 선택 */}
                    <div>
                      <p className="text-[10px] font-black text-slate-400 mb-3 uppercase flex items-center gap-1"><Tag size={12}/> 1. 과목
                        {subjects.length === 0 && <span className="text-red-400 ml-1">(항목 등록 탭에서 먼저 과목을 추가하세요)</span>}
                        {!newAssignment.subject && subjects.length > 0 && <span className="text-red-400 ml-1">* 필수</span>}
                      </p>
                      {subjects.length === 0 ? (
                        <div className="px-4 py-3 bg-amber-50 border border-amber-200 rounded-2xl">
                          <p className="text-xs font-black text-amber-700 flex items-center gap-1"><AlertTriangle size={12}/>과목을 먼저 추가해 주세요.</p>
                        </div>
                      ) : (
                        <div className="flex flex-wrap gap-2">
                          {subjects.map(sub=>(
                            <button key={sub} onClick={()=>setNewAssignment(p=>({...p,subject:sub}))}
                              className={`px-3 py-1.5 rounded-xl text-xs font-bold border-2 transition ${newAssignment.subject===sub?'text-white border-transparent shadow-md':'border-slate-100 text-slate-400 hover:border-slate-200'}`}
                              style={newAssignment.subject===sub?{background:'var(--sc)'}:{}}>{sub}</button>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* 암기 영역 선택 (암기 카테고리일 때만) */}
                    {regCategory === 'memorization' && (
                      <div>
                        <p className="text-[10px] font-black text-slate-400 mb-3 uppercase flex items-center gap-1"><BookMarked size={12}/> 2. 암기 영역 (선택)</p>
                        {memoSections.length === 0 ? (
                          <p className="text-xs text-slate-400 font-medium">암기 영역 설정에서 영역을 추가하면 여기서 선택할 수 있습니다.</p>
                        ) : (
                          <div className="flex flex-wrap gap-2">
                            <button onClick={()=>setNewAssignment(p=>({...p,memoSection:''}))}
                              className={`px-3 py-1.5 rounded-xl text-xs font-bold border-2 transition ${!newAssignment.memoSection?'bg-purple-600 border-purple-600 text-white shadow-md':'border-slate-100 text-slate-400'}`}>영역 없음</button>
                            {memoSections.map(sec=>(
                              <button key={sec} onClick={()=>setNewAssignment(p=>({...p,memoSection:sec}))}
                                className={`px-3 py-1.5 rounded-xl text-xs font-bold border-2 transition ${newAssignment.memoSection===sec?'bg-purple-600 border-purple-600 text-white shadow-md':'border-slate-100 text-slate-400 hover:border-slate-200'}`}>{sec}</button>
                            ))}
                          </div>
                        )}
                      </div>
                    )}

                    {/* 수준 */}
                    <div>
                      <p className="text-[10px] font-black text-slate-400 mb-3 uppercase flex items-center gap-1"><TrendingUp size={12}/> {regCategory==='memorization'?'3':'2'}. 수준</p>
                      <div className="flex flex-wrap gap-2">
                        {ASSIGNMENT_LEVELS.map(lvl=>(
                          <button key={lvl} onClick={()=>setNewAssignment(p=>({...p,level:lvl}))}
                            className={`px-3 py-1.5 rounded-xl text-xs font-bold border-2 transition ${newAssignment.level===lvl?'bg-indigo-700 border-indigo-700 text-white shadow-md':'border-slate-100 text-slate-400 hover:border-slate-200'}`}>{lvl}</button>
                        ))}
                      </div>
                    </div>

                    {/* 대상 */}
                    <div>
                      <p className="text-[10px] font-black text-slate-400 mb-3 uppercase flex items-center gap-1"><UserCheck size={12}/> {regCategory==='memorization'?'4':'3'}. 대상</p>
                      <div className="flex gap-2 mb-3">
                        <button onClick={()=>setNewAssignment(p=>({...p,type:'all',targetStudents:[]}))}
                          className={`flex-1 py-2 rounded-xl text-xs font-bold border-2 ${newAssignment.type==='all'?'bg-indigo-600 border-indigo-600 text-white shadow-sm':'bg-white border-slate-100 text-slate-400'}`}>전체</button>
                        <button onClick={()=>setNewAssignment(p=>({...p,type:'group',targetStudents:[]}))}
                          className={`flex-1 py-2 rounded-xl text-xs font-black border-2 ${newAssignment.type==='group'?'bg-amber-500 border-amber-500 text-white shadow-sm':'bg-white border-slate-100 text-slate-400'}`}>그룹</button>
                        <button onClick={()=>setNewAssignment(p=>({...p,type:'individual',targetStudents:[]}))}
                          className={`flex-1 py-2 rounded-xl text-xs font-black border-2 ${newAssignment.type==='individual'?'bg-indigo-600 border-indigo-600 text-white shadow-sm':'bg-white border-slate-100 text-slate-400'}`}>개별</button>
                      </div>

                      {/* 그룹 선택 */}
                      {newAssignment.type === 'group' && (() => {
                        const groups = [...new Set(students.map(s=>s.group||'').filter(Boolean))].sort();
                        if (!groups.length) return <p className="text-xs text-slate-400 font-bold">등록된 그룹이 없습니다. 학생 관리에서 그룹을 설정해주세요.</p>;
                        return (
                          <div className="space-y-3">
                            <div className="flex flex-wrap gap-2">
                              {groups.map(g=>{
                                const gStudents = students.filter(s=>s.group===g).map(s=>s.id);
                                const allSel = gStudents.every(id=>newAssignment.targetStudents.includes(id));
                                return (
                                  <button key={g} onClick={()=>{
                                    setNewAssignment(p=>({
                                      ...p,
                                      targetStudents: allSel
                                        ? p.targetStudents.filter(id=>!gStudents.includes(id))
                                        : [...new Set([...p.targetStudents,...gStudents])]
                                    }));
                                  }} className={`px-3 py-1.5 rounded-xl text-xs font-black border-2 transition-all flex items-center gap-1.5 ${allSel?'bg-amber-500 border-amber-500 text-white shadow-sm':'border-amber-200 text-amber-600 bg-amber-50 hover:bg-amber-100'}`}>
                                    그룹 {g}
                                    <span className="text-[10px] opacity-70">({gStudents.length}명)</span>
                                  </button>
                                );
                              })}
                            </div>
                            {newAssignment.targetStudents.length > 0 && (
                              <div className="bg-amber-50 rounded-xl px-3 py-2 border border-amber-100">
                                <p className="text-[10px] font-black text-amber-600 mb-1">선택된 학생 ({newAssignment.targetStudents.length}명)</p>
                                <p className="text-xs text-amber-700 font-bold">
                                  {students.filter(s=>newAssignment.targetStudents.includes(s.id)).map(s=>s.name).join(', ')}
                                </p>
                              </div>
                            )}
                          </div>
                        );
                      })()}

                      {/* 개별 선택 */}
                      {newAssignment.type === 'individual' && (
                        <div className="flex flex-wrap gap-2">
                          {students.map(s=>(
                            <button key={s.id} onClick={()=>{
                              const next = newAssignment.targetStudents.includes(s.id)
                                ? newAssignment.targetStudents.filter(id=>id!==s.id)
                                : [...newAssignment.targetStudents,s.id];
                              setNewAssignment(p=>({...p,targetStudents:next}));
                            }} className={`px-3 py-1.5 rounded-xl text-xs font-black border-2 transition-all ${newAssignment.targetStudents.includes(s.id)?'bg-indigo-600 border-indigo-600 text-white shadow-sm':'border-slate-100 text-slate-400 hover:border-slate-200'}`}>
                              {s.name}
                              {s.group && <span className="ml-1 text-[9px] opacity-60">({s.group})</span>}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* 제목 + 마감일 */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <p className="text-[10px] font-black text-slate-400 mb-2 uppercase">{regCategory==='memorization'?'5':'4'}. 항목 제목</p>
                        <BufferedInput value={newAssignment.title} onSave={(v)=>setNewAssignment(p=>({...p,title:v}))} placeholder="항목 제목 입력..."
                          className="w-full px-4 py-3 bg-slate-50 border-2 border-transparent rounded-2xl font-bold outline-none focus:border-indigo-400 transition-all text-slate-800" />
                      </div>
                      {regCategory === 'assignment' && (
                        <div>
                          <p className="text-[10px] font-black text-slate-400 mb-2 uppercase">5. 마감일 (선택)</p>
                          <input type="date" value={newAssignment.deadline} onChange={e=>setNewAssignment(p=>({...p,deadline:e.target.value}))}
                            className="w-full px-4 py-3 bg-slate-50 border-2 border-transparent rounded-2xl font-bold outline-none focus:border-indigo-400 transition-all" />
                        </div>
                      )}
                    </div>

                    <button onClick={addAssignment}
                      disabled={!newAssignment.subject || !newAssignment.title.trim()}
                      className={`w-full py-4 rounded-2xl font-black text-lg transition-all ${newAssignment.subject && newAssignment.title.trim() ? 'text-white shadow-xl active:scale-95' : 'bg-slate-100 text-slate-300 cursor-not-allowed'}`}
                      style={newAssignment.subject && newAssignment.title.trim() ? {background:'var(--sc)'} : {}}>
                      {!newAssignment.subject ? '과목을 먼저 선택하세요' : !newAssignment.title.trim() ? '제목을 입력하세요' : '등록하기'}
                    </button>
                  </div>
                </div>
              )}

              {/* 등록된 항목 목록 */}
              <div className="space-y-3">
                <div className="flex gap-2">
                  <button onClick={()=>setRegCategory('assignment')} className={`px-4 py-2 rounded-xl text-xs font-black border-2 transition ${regCategory==='assignment'?'text-white border-transparent shadow-sm':'bg-white border-slate-200 text-slate-500'}`} style={regCategory==='assignment'?{background:'var(--sc)'}:{}}>과제 ({assignments.length})</button>
                  <button onClick={()=>setRegCategory('memorization')} className={`px-4 py-2 rounded-xl text-xs font-black border-2 transition ${regCategory==='memorization'?'bg-purple-600 border-purple-600 text-white shadow-sm':'bg-white border-slate-200 text-slate-500'}`}>암기 ({memoItems.length})</button>
                </div>
                {(regCategory==='assignment'?assignments:memoItems).map(a=>(
                  <div key={a.id} className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
                    {editItemId === a.id ? (
                      <div className="space-y-3 bg-slate-50 rounded-2xl p-4 border border-slate-100">
                        {/* 제목 */}
                        <div>
                          <p className="text-[10px] font-black text-slate-400 mb-1.5 uppercase">제목</p>
                          <BufferedInput value={editItemData?.title||''} onSave={(v)=>setEditItemData(p=>({...p,title:v}))} className="w-full px-3 py-2.5 border-2 border-white rounded-xl font-bold text-sm outline-none focus:border-blue-400 bg-white text-slate-800" />
                        </div>

                        {/* 과목 */}
                        <div>
                          <p className="text-[10px] font-black text-slate-400 mb-1.5 uppercase">과목</p>
                          <div className="flex flex-wrap gap-1.5">
                            {subjects.map(sub=>(
                              <button key={sub} onClick={()=>setEditItemData(p=>({...p,subject:sub}))}
                                className={`px-2.5 py-1 rounded-lg text-xs font-black border-2 transition ${editItemData?.subject===sub?'text-white border-transparent':'border-slate-200 text-slate-400 bg-white'}`}
                                style={editItemData?.subject===sub?{background:'var(--sc)'}:{}}>{sub}</button>
                            ))}
                          </div>
                        </div>

                        {/* 난이도 (과제만) */}
                        {editItemData?.category === 'assignment' && (
                          <div>
                            <p className="text-[10px] font-black text-slate-400 mb-1.5 uppercase">난이도</p>
                            <div className="flex flex-wrap gap-1.5">
                              {ASSIGNMENT_LEVELS.map(lv=>(
                                <button key={lv} onClick={()=>setEditItemData(p=>({...p,level:lv}))}
                                  className={`px-2.5 py-1 rounded-lg text-xs font-black border-2 transition ${editItemData?.level===lv?'bg-amber-500 border-amber-500 text-white':'border-slate-200 text-slate-400 bg-white'}`}>{lv}</button>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* 마감일 (과제만) */}
                        {editItemData?.category === 'assignment' && (
                          <div>
                            <p className="text-[10px] font-black text-slate-400 mb-1.5 uppercase">마감일</p>
                            <input type="date" value={editItemData?.deadline||''} onChange={e=>setEditItemData(p=>({...p,deadline:e.target.value}))}
                              className="px-3 py-2 bg-white border-2 border-slate-200 rounded-xl font-bold text-sm outline-none focus:border-blue-400 text-slate-800"/>
                            {editItemData?.deadline && <button onClick={()=>setEditItemData(p=>({...p,deadline:''}))} className="ml-2 text-xs text-red-400 font-black">× 제거</button>}
                          </div>
                        )}

                        {/* 암기 영역 (암기만) */}
                        {editItemData?.category === 'memorization' && memoSections.length > 0 && (
                          <div>
                            <p className="text-[10px] font-black text-slate-400 mb-1.5 uppercase">암기 영역</p>
                            <div className="flex flex-wrap gap-1.5">
                              <button onClick={()=>setEditItemData(p=>({...p,memoSection:''}))}
                                className={`px-2.5 py-1 rounded-lg text-xs font-black border-2 transition ${!editItemData?.memoSection?'bg-purple-600 border-purple-600 text-white':'border-slate-200 text-slate-400 bg-white'}`}>영역 없음</button>
                              {memoSections.map(sec=>(
                                <button key={sec} onClick={()=>setEditItemData(p=>({...p,memoSection:sec}))}
                                  className={`px-2.5 py-1 rounded-lg text-xs font-black border-2 transition ${editItemData?.memoSection===sec?'bg-purple-600 border-purple-600 text-white':'border-slate-200 text-slate-400 bg-white'}`}>{sec}</button>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* 대상 학생 */}
                        <div>
                          <p className="text-[10px] font-black text-slate-400 mb-1.5 uppercase">대상 학생</p>
                          <div className="flex flex-wrap gap-1.5 mb-2">
                            <button onClick={()=>setEditItemData(p=>({...p,type:'all',targetStudents:[]}))}
                              className={`px-2.5 py-1 rounded-lg text-xs font-black border-2 transition ${editItemData?.type==='all'?'bg-slate-600 border-slate-600 text-white':'border-slate-200 text-slate-400 bg-white'}`}>전체</button>
                            <button onClick={()=>setEditItemData(p=>({...p,type:'group',targetStudents:[]}))}
                              className={`px-2.5 py-1 rounded-lg text-xs font-black border-2 transition ${editItemData?.type==='group'?'bg-amber-500 border-amber-500 text-white':'border-slate-200 text-amber-600 bg-amber-50'}`}>그룹</button>
                            <button onClick={()=>setEditItemData(p=>({...p,type:'specific',targetStudents:p.targetStudents||[]}))}
                              className={`px-2.5 py-1 rounded-lg text-xs font-black border-2 transition ${editItemData?.type==='specific'?'bg-blue-500 border-blue-500 text-white':'border-slate-200 text-slate-400 bg-white'}`}>개별</button>
                          </div>
                          {editItemData?.type === 'group' && (() => {
                            const groups = [...new Set(students.map(s=>s.group||'').filter(Boolean))].sort();
                            return (
                              <div className="space-y-2">
                                <div className="flex flex-wrap gap-1.5">
                                  {groups.map(g=>{
                                    const gStudents = students.filter(s=>s.group===g).map(s=>s.id);
                                    const allSel = gStudents.every(id=>(editItemData?.targetStudents||[]).includes(id));
                                    return (
                                      <button key={g} onClick={()=>setEditItemData(p=>({
                                        ...p,
                                        targetStudents: allSel
                                          ? (p.targetStudents||[]).filter(id=>!gStudents.includes(id))
                                          : [...new Set([...(p.targetStudents||[]),...gStudents])]
                                      }))} className={`px-2.5 py-1 rounded-lg text-xs font-black border-2 transition ${allSel?'bg-amber-500 border-amber-500 text-white':'border-amber-200 text-amber-600 bg-amber-50'}`}>
                                        그룹 {g} ({gStudents.length}명)
                                      </button>
                                    );
                                  })}
                                </div>
                                {(editItemData?.targetStudents||[]).length > 0 && (
                                  <p className="text-[10px] text-amber-600 font-bold px-2">
                                    {students.filter(s=>(editItemData?.targetStudents||[]).includes(s.id)).map(s=>s.name).join(', ')}
                                  </p>
                                )}
                              </div>
                            );
                          })()}
                          {editItemData?.type === 'specific' && (
                            <div className="flex flex-wrap gap-1.5 mt-1">
                              {students.map(s=>{
                                const sel = (editItemData?.targetStudents||[]).includes(s.id);
                                return (
                                  <button key={s.id} onClick={()=>setEditItemData(p=>({
                                    ...p,
                                    targetStudents: sel
                                      ? (p.targetStudents||[]).filter(id=>id!==s.id)
                                      : [...(p.targetStudents||[]),s.id]
                                  }))} className={`px-2.5 py-1 rounded-lg text-xs font-black border-2 transition ${sel?'text-white border-transparent':'border-slate-200 text-slate-400 bg-white'}`}
                                  style={sel?{background:'var(--sc)'}:{}}>{s.name}{s.group?<span className="ml-1 text-[9px] opacity-60">({s.group})</span>:null}</button>
                                );
                              })}
                            </div>
                          )}
                        </div>

                        <div className="flex gap-2 pt-1">
                          <button onClick={()=>setEditItemId(null)} className="flex-1 py-2.5 bg-slate-200 text-slate-500 rounded-xl font-black text-sm">취소</button>
                          <button onClick={saveEditItem} className="flex-1 py-2.5 text-white rounded-xl font-black text-sm shadow-sm" style={{background:'var(--sc)'}}>저장</button>
                        </div>
                      </div>
                    ) : (
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex-1 min-w-0">
                          <div className="flex flex-wrap items-center gap-1.5 mb-1">
                            {a.subject && <span className="text-[10px] font-black px-1.5 py-0.5 rounded text-white leading-none" style={{background:'var(--sc)'}}>{a.subject}</span>}
                            <span className="text-[10px] font-bold text-slate-400">{a.level}</span>
                            {a.memoSection && <span className="text-[10px] font-black px-1.5 py-0.5 rounded bg-purple-100 text-purple-600 leading-none">{a.memoSection}</span>}
                            {a.deadline && <span className="text-[10px] font-bold text-slate-400">마감 {a.deadline}</span>}
                            <span className="text-[9px] font-bold text-slate-300">{a.type==='all'?'전체':getTargetStudentNamesLocal(students,a.targetStudents)}</span>
                          </div>
                          <p className="font-black text-sm text-slate-700 break-keep">{a.title}</p>
                        </div>
                        {userRole === 'master' && (
                          <div className="flex gap-1.5 shrink-0">
                            <button onClick={async()=>{
                              const coll = regCategory==='assignment'?'assignments':'memoItems';
                              const list = regCategory==='assignment'?assignments:memoItems;
                              const id = (regCategory==='assignment'?'a':'m')+Date.now();
                              const sortOrder = list.length>0?Math.max(...list.map(x=>x.sortOrder||0))+1:0;
                              const {id:_omit,...rest} = a;
                              await setDoc(doc(db,'artifacts',APP_ID,'public','data',coll,id),{...rest,title:a.title+' (복사)',sortOrder});
                            }} className="p-2 text-emerald-500 bg-emerald-50 hover:bg-emerald-100 rounded-xl transition-all" title="복사"><Copy size={15}/></button>
                            <button onClick={()=>{setEditItemId(a.id);setEditItemData({...a});}} className="p-2 text-indigo-500 bg-indigo-50 hover:bg-indigo-100 rounded-xl transition-all"><Edit2 size={15}/></button>
                            <button onClick={()=>deleteItem(regCategory==='assignment'?'assignments':'memoItems',a.id)} className="p-2 text-red-500 bg-red-50 hover:bg-red-100 rounded-xl transition-all"><Trash2 size={15}/></button>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ====================================================
              사이트 관리 (마스터 전용)
          ==================================================== */}
          {activeTab === 'sitemanage' && userRole === 'master' && (
            <div className="max-w-2xl mx-auto space-y-6">

              {/* 사이트 아이콘 변경 */}
              <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
                <h2 className="text-base font-black text-slate-800 flex items-center gap-2 mb-5">
                  {(() => { const ic = ICON_LIST.find(i => i.name === siteIconName); return ic ? React.createElement(ic.component, {size:18, style:{color:"var(--sc)"}}) : React.createElement(Languages, {size:18, style:{color:"var(--sc)"}}); })()}
                  사이트 아이콘 변경
                </h2>

                {/* 현재 아이콘 미리보기 */}
                <div className="flex items-center gap-4 mb-5 p-4 bg-slate-50 rounded-2xl border border-slate-100">
                  <div className="p-4 rounded-2xl text-white shadow-lg flex items-center justify-center min-w-[64px] min-h-[64px]" style={{background:"var(--sc)"}}>
                    {(() => {
                      if (siteIconName.startsWith('__custom__')) {
                        return <span className="font-black leading-none" style={{fontSize:'2rem'}}>{siteIconName.replace('__custom__','')}</span>;
                      }
                      const ic = ICON_LIST.find(i => i.name === siteIconName);
                      return ic ? React.createElement(ic.component, {size:32}) : React.createElement(Languages, {size:32});
                    })()}
                  </div>
                  <div>
                    <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-1">현재 아이콘</p>
                    <p className="font-black text-slate-700 text-lg">{siteIconName.startsWith('__custom__') ? '"' + siteIconName.replace('__custom__','') + '" (직접 입력)' : siteIconName}</p>
                  </div>
                </div>

                {/* 직접 입력 - 1글자 */}
                <div className="mb-4">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">글자/기호 직접 입력 <span className="normal-case text-slate-300 font-bold">(알파벳·숫자·특수문자·이모지 1글자)</span></p>
                  <div className="flex gap-3 items-center">
                    {/* 미리보기 */}
                    <div className="w-16 h-16 rounded-2xl flex items-center justify-center text-white text-3xl font-black shadow-md flex-shrink-0" style={{background:"var(--sc)"}}>
                      {iconSearchInput.length > 0 ? iconSearchInput.slice(0,2) : <span className="text-white/40 text-base">?</span>}
                    </div>
                    <div className="flex-1 flex gap-2">
                      <input
                        value={iconSearchInput}
                        onChange={e => {
                          // 이모지는 2바이트라 slice로 처리
                          const val = [...e.target.value];
                          setIconSearchInput(val.slice(0,1).join(''));
                        }}
                        placeholder="A, E, ★, 🎯 ..."
                        className="flex-1 px-4 py-3 bg-slate-50 border-2 border-transparent rounded-2xl font-black outline-none focus:border-blue-400 transition-all text-slate-700 text-2xl text-center tracking-widest"
                        maxLength={2}
                      />
                      <button
                        onClick={() => {
                          if (!iconSearchInput.trim()) return;
                          saveSiteIcon('__custom__' + iconSearchInput.slice(0,2));
                          setIconSearchInput('');
                        }}
                        disabled={!iconSearchInput.trim()}
                        className={"px-4 py-3 text-white rounded-2xl font-black text-sm shadow-sm transition-all active:scale-95 " + (!iconSearchInput.trim() ? "opacity-40 cursor-not-allowed" : "")}
                        style={{background:"var(--sc)"}}>적용</button>
                    </div>
                  </div>
                  <p className="text-[10px] text-slate-400 font-medium mt-2">입력한 글자가 헤더 및 로그인 화면 아이콘으로 표시됩니다.</p>
                </div>

                {/* 목록에서 선택 */}
                <div>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">목록에서 선택 ({ICON_LIST.length}개)</p>
                  <div className="grid grid-cols-5 sm:grid-cols-6 md:grid-cols-8 gap-2">
                    {ICON_LIST.map(({ name, component }) => {
                      const isSelected = siteIconName === name;
                      return (
                        <button
                          key={name}
                          onClick={() => saveSiteIcon(name)}
                          title={name}
                          className={"flex flex-col items-center gap-1.5 p-2.5 rounded-2xl border-2 transition-all active:scale-95 " + (isSelected ? "text-white border-transparent shadow-lg scale-105" : "bg-slate-50 border-slate-100 text-slate-500 hover:border-slate-300 hover:bg-white")}
                          style={isSelected ? {background:"var(--sc)", borderColor:"var(--sc)"} : {}}
                        >
                          {React.createElement(component, {size: 22})}
                          <span className="text-[7px] font-black leading-none text-center break-all">{name}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* 마스터 코드 변경 */}
              <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-base font-black text-slate-800 flex items-center gap-2">
                    <KeyRound size={16} className="text-orange-500"/> 마스터 코드 변경
                  </h2>
                  <button onClick={() => setShowMasterCodeEdit(v=>!v)}
                    className={"px-3 py-1.5 rounded-xl text-xs font-black border transition-all " + (showMasterCodeEdit ? "bg-orange-500 text-white border-orange-500" : "bg-white border-slate-200 text-slate-500")}>
                    {showMasterCodeEdit ? "취소" : "변경"}
                  </button>
                </div>
                {showMasterCodeEdit ? (
                  <div className="flex gap-2">
                    <input type="password" value={newMasterCodeInput} onChange={e=>setNewMasterCodeInput(e.target.value)}
                      placeholder="새 마스터 코드 입력"
                      className="flex-1 px-4 py-2.5 bg-slate-50 border-2 border-transparent rounded-2xl font-bold outline-none focus:border-orange-400 transition-all"
                      onKeyDown={e=>e.key==="Enter"&&saveMasterCode()} />
                    <button onClick={saveMasterCode} className="px-4 py-2.5 bg-orange-500 text-white rounded-2xl font-black text-sm shadow-sm hover:bg-orange-600 transition-all">저장</button>
                  </div>
                ) : (
                  <p className="text-sm text-slate-400 font-medium">현재 코드: <span className="font-black text-slate-600">{"*".repeat(masterCode.length)}</span></p>
                )}
              </div>

              {/* 사이트 색상 */}
              <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
                <h2 className="text-base font-black text-slate-800 flex items-center gap-2 mb-4">
                  <Palette size={16} className="text-pink-500"/> 사이트 색상 변경
                </h2>
                <div className="grid grid-cols-5 gap-2 mb-4">
                  {[["#1d4ed8","블루"],["#0f766e","틸"],["#7c3aed","바이올렛"],["#3730a3","인디고"],["#b91c1c","레드"],["#c2410c","오렌지"],["#15803d","그린"],["#1e3a5f","네이비"],["#4a1d96","퍼플"],["#374151","그레이"]].map(([c,n])=>(
                    <button key={c} onClick={()=>saveSiteColor(c)} title={n}
                      className="h-12 rounded-2xl border-4 transition-all hover:scale-105 active:scale-95 shadow-sm flex items-center justify-center"
                      style={{background:c, borderColor: siteColor===c?"#fff":"transparent", outline:siteColor===c?"3px solid "+c:"none"}}>
                      {siteColor===c && <span className="text-white font-black text-lg">✓</span>}
                    </button>
                  ))}
                </div>
                <div className="flex gap-2 items-center">
                  <input type="color" value={siteColor} onChange={e=>setSiteColor(e.target.value)} className="w-12 h-12 rounded-xl border-2 border-slate-100 cursor-pointer p-0.5" />
                  <input type="text" value={siteColor}
                    onChange={e=>{ if(/^#[0-9a-fA-F]{0,6}$/.test(e.target.value)) setSiteColor(e.target.value); }}
                    className="flex-1 px-3 py-3 border-2 border-slate-100 rounded-xl font-mono text-sm font-bold text-slate-700 outline-none focus:border-slate-400" placeholder="#1d4ed8" />
                  <button onClick={()=>saveSiteColor(siteColor)} className="px-4 py-3 bg-slate-800 text-white rounded-xl font-black text-sm hover:bg-slate-700 transition-all">적용</button>
                </div>
              </div>


              {/* 다크모드 */}
              <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-base font-black text-slate-800 flex items-center gap-2">
                      <Moon size={16} className="text-indigo-500"/> 다크모드
                    </h2>
                    <p className="text-xs text-slate-400 font-medium mt-1">어두운 배경으로 전환합니다</p>
                  </div>
                  <button onClick={()=>saveDarkMode(!darkMode)}
                    className={"relative w-14 h-7 rounded-full transition-all duration-300 flex items-center " + (darkMode ? "bg-indigo-500" : "bg-slate-200")}
                  >
                    <span className={"absolute w-6 h-6 bg-white rounded-full shadow-md transition-all duration-300 " + (darkMode ? "left-7" : "left-0.5")} />
                    <span className={"absolute text-[9px] font-black transition-all " + (darkMode ? "left-2 text-white" : "right-1.5 text-slate-400")}>{darkMode ? "ON" : "OFF"}</span>
                  </button>
                </div>
              </div>

            </div>
          )}
        </main>

        {/* ====================================================
            MODALS & PORTALS
        ==================================================== */}

        {/* 학생 상세 모달 */}
        {selectedStudent && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in" onClick={()=>setSelectedStudent(null)}>
            <div className="bg-white w-full max-w-md rounded-[2.5rem] shadow-2xl overflow-hidden" onClick={e=>e.stopPropagation()}>
              <div className="p-6 text-white flex justify-between items-start" style={{background:'var(--sc-darker)'}}>
                <div>
                  <h2 className="text-2xl font-black">{selectedStudent.name}</h2>
                  {selectedStudent.highSchool && <p className="text-white/70 text-sm mt-1">{selectedStudent.highSchool}</p>}
                </div>
                <button onClick={()=>setSelectedStudent(null)} className="p-1 hover:bg-white/10 rounded-full"><LucideX size={22}/></button>
              </div>
              <div className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
                <div>
                  <p className="text-[10px] font-black text-slate-400 uppercase mb-2">과제 현황</p>
                  {assignments.map(a=>{
                    const isTarget = a.type==='all'||(a.targetStudents&&a.targetStudents.includes(selectedStudent.id));
                    if (!isTarget) return null;
                    const sub=submissions[`${selectedStudent.id}-${a.id}`]||{};
                    const status=sub.status||'not_started';
                    const cfg=ASSIGN_STATUS_CONFIG[status];
                    return (
                      <div key={a.id} className={`flex items-center justify-between px-3 py-2 rounded-xl border mb-1.5 ${cfg.bg} ${cfg.color}`}>
                        <span className="text-xs font-black truncate flex-1 mr-2">{a.title}</span>
                        <div className="flex items-center gap-1 shrink-0">{React.createElement(cfg.icon,{size:12})}<span className="text-[10px] font-black">{cfg.label}</span></div>
                      </div>
                    );
                  })}
                </div>
                <div>
                  <p className="text-[10px] font-black text-slate-400 uppercase mb-2">시험 점수</p>
                  {tests.map(t=>{
                    const res=testScores[`${selectedStudent.id}-${t.id}`]||{};
                    return (
                      <div key={t.id} className="flex items-center justify-between px-3 py-2 rounded-xl border border-orange-100 bg-orange-50 mb-1.5">
                        <span className="text-xs font-black text-orange-800 truncate flex-1 mr-2">{t.title}</span>
                        <span className="text-xs font-black text-orange-600 shrink-0">{res.absent?'결시':res.score!=null?`${res.score}점`:'-'}</span>
                      </div>
                    );
                  })}
                </div>
                <button onClick={()=>setSelectedStudent(null)} className="w-full py-4 text-white rounded-2xl font-black shadow-lg transition-all active:scale-95" style={{background:'var(--sc-darker)'}}>닫기</button>
              </div>
            </div>
          </div>
        )}

        {/* 상태 메뉴 포탈 */}
        {statusMenu && (
          <div className="fixed inset-0 z-[150]" onClick={()=>setStatusMenu(null)}>
            <div className="absolute bg-white rounded-2xl shadow-2xl border border-slate-100 py-2 min-w-[140px] animate-in zoom-in-95"
              style={{left:Math.min(statusMenu.x,window.innerWidth-160),top:Math.min(statusMenu.y,window.innerHeight-200)}}
              onClick={e=>e.stopPropagation()}>
              <p className="px-3 py-1 text-[9px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-100 mb-1">상태 변경</p>
              {(statusMenu.category==='assignment'?ASSIGN_STATUS_ORDER:MEMO_STATUS_ORDER).map(st=>{
                const cfg=statusMenu.category==='assignment'?ASSIGN_STATUS_CONFIG[st]:MEMO_STATUS_CONFIG[st];
                return (
                  <button key={st} onClick={()=>handleStatusSelect(statusMenu.studentId,statusMenu.itemId,statusMenu.category,st)}
                    className={`w-full flex items-center gap-2 px-3 py-2 text-xs font-black hover:bg-slate-50 transition-colors ${cfg?.color}`}>
                    {cfg?.icon&&React.createElement(cfg.icon,{size:14})}{cfg?.label}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* 시험 정보 수정 모달 */}
        {selectedTest && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in" onClick={()=>setSelectedTest(null)}>
            <div className="bg-white w-full max-w-lg rounded-[2.5rem] shadow-2xl overflow-hidden animate-in zoom-in-95" onClick={e=>e.stopPropagation()}>
              <div className="p-6 text-white flex justify-between items-start" style={{background:'var(--sc-darker)'}}>
                <div>
                  <h2 className="text-xl font-black">시험 정보 수정</h2>
                  <p className="text-white/60 text-sm mt-1">{selectedTest.title}</p>
                </div>
                <button onClick={()=>setSelectedTest(null)} className="p-1 hover:bg-white/10 rounded-full"><LucideX size={20}/></button>
              </div>
              <div className="p-6 max-h-[70vh] overflow-y-auto space-y-4">
                {/* 기본 정보 수정 */}
                <div className="grid grid-cols-1 gap-3">
                  <div>
                    <p className="text-[10px] font-black text-slate-400 mb-1.5 uppercase">시험 명칭</p>
                    <BufferedInput value={selectedTest.title||''} onSave={(v)=>setSelectedTest(p=>({...p,title:v}))}
                      className="w-full px-4 py-3 bg-slate-50 border-2 border-transparent rounded-2xl font-bold outline-none focus:border-orange-400 transition-all text-slate-800"/>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <p className="text-[10px] font-black text-slate-400 mb-1.5 uppercase">실시 일자</p>
                      <input type="date" value={selectedTest.date||''} onChange={e=>setSelectedTest(p=>({...p,date:e.target.value}))}
                        className="w-full px-3 py-2.5 bg-slate-50 border-2 border-transparent rounded-2xl font-bold outline-none focus:border-orange-400 transition-all text-slate-800"/>
                    </div>
                    <div>
                      <p className="text-[10px] font-black text-slate-400 mb-1.5 uppercase">만점</p>
                      <BufferedInput type="number" value={selectedTest.maxScore??''} onSave={(v)=>setSelectedTest(p=>({...p,maxScore:v===''?null:parseFloat(v)||null}))}
                        className="w-full px-3 py-2.5 bg-slate-50 border-2 border-transparent rounded-2xl font-bold outline-none focus:border-orange-400 transition-all text-slate-800" placeholder="예: 100"/>
                    </div>
                  </div>
                  <div>
                    <p className="text-[10px] font-black text-slate-400 mb-1.5 uppercase">시험 유형</p>
                    <div className="flex gap-2">
                      {['중간 테스트','미니 테스트'].map(t=>(
                        <button key={t} onClick={()=>setSelectedTest(p=>({...p,testType:t}))}
                          className={`px-4 py-2 rounded-xl text-xs font-black border-2 transition ${selectedTest.testType===t?'bg-orange-500 border-orange-500 text-white':'border-slate-100 text-slate-400'}`}>{t}</button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <p className="text-[10px] font-black text-slate-400 mb-1.5 uppercase">시험 난이도</p>
                    <div className="flex flex-wrap gap-2">
                      {['최하','하','중하','중','중상','상','최상'].map(d=>(
                        <button key={d} onClick={()=>setSelectedTest(p=>({...p,testDifficulty:d}))}
                          className={`px-3 py-1.5 rounded-xl text-xs font-black border-2 transition ${selectedTest.testDifficulty===d?'border-transparent text-white shadow-sm':'border-slate-100 text-slate-400'}`}
                          style={selectedTest.testDifficulty===d?{background:{'최하':'#3b82f6','하':'#0ea5e9','중하':'#14b8a6','중':'#64748b','중상':'#f59e0b','상':'#f97316','최상':'#ef4444'}[d]}:{}}>
                          {d}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
                {/* 문항 수정 */}
                {(selectedTest.questions||[]).length > 0 && (
                  <div>
                    <p className="text-[10px] font-black text-slate-400 uppercase mb-2">문항 수정</p>
                    <div className="space-y-2 max-h-52 overflow-y-auto pr-1">
                      {(selectedTest.questions||[]).map((q,i)=>(
                        <div key={i} className="grid grid-cols-12 gap-2 items-center bg-slate-50 px-3 py-2 rounded-2xl border border-slate-100">
                          <span className="col-span-2 text-[10px] font-black text-slate-500">{q.type==='주관식'?'주':'객'}{q.num||i+1}번</span>
                          <input type="number" value={q.points||''} onChange={(e)=>{const qs=[...(selectedTest.questions||[])];qs[i]={...qs[i],points:e.target.value};setSelectedTest(p=>({...p,questions:qs}));}}
                            placeholder="배점" className="col-span-2 px-2 py-1 bg-white border border-slate-200 rounded-xl text-xs font-bold outline-none focus:border-orange-400 text-center"/>
                          <input type="text" value={q.unit||''} onChange={(e)=>{const qs=[...(selectedTest.questions||[])];qs[i]={...qs[i],unit:e.target.value};setSelectedTest(p=>({...p,questions:qs}));}}
                            placeholder="단원" className="col-span-5 px-2 py-1 bg-white border border-slate-200 rounded-xl text-xs font-bold outline-none focus:border-orange-400"/>
                          <select value={q.difficulty||'중'} onChange={(e)=>{const qs=[...(selectedTest.questions||[])];qs[i]={...qs[i],difficulty:e.target.value};setSelectedTest(p=>({...p,questions:qs}));}}
                            className="col-span-3 px-1 py-1 bg-white border border-slate-200 rounded-xl text-xs font-bold outline-none">
                            {['하','중하','중','중상','상','극상'].map(d=><option key={d}>{d}</option>)}
                          </select>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                <div className="flex gap-3 pt-2">
                  <button onClick={()=>setSelectedTest(null)} className="flex-1 py-3 bg-slate-100 text-slate-500 rounded-2xl font-black text-sm">취소</button>
                  <button onClick={updateTestDetails} className="flex-2 px-8 py-3 text-white rounded-2xl font-black text-sm shadow-lg transition-all active:scale-95" style={{background:'var(--sc)'}}>저장</button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 삭제 확인 모달 */}
        {confirmDelete && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center p-6 bg-slate-900/60 backdrop-blur-sm animate-in fade-in" onClick={()=>setConfirmDelete(null)}>
            <div className="bg-white rounded-3xl shadow-2xl p-7 w-full max-w-sm text-center animate-in zoom-in-95" onClick={e=>e.stopPropagation()}>
              <div className="w-14 h-14 bg-red-100 rounded-2xl flex items-center justify-center mx-auto mb-4"><Trash2 size={26} className="text-red-500"/></div>
              <p className="text-lg font-black text-slate-800 mb-1">정말 삭제할까요?</p>
              <p className="text-sm text-slate-500 font-medium mb-6"><span className="font-black text-slate-700">{confirmDelete.label}</span> 학생을 삭제하면<br/>복구할 수 없습니다.</p>
              <div className="flex gap-3">
                <button onClick={()=>setConfirmDelete(null)} className="flex-1 py-3 bg-slate-100 text-slate-600 rounded-2xl font-black hover:bg-slate-200 transition-all">취소</button>
                <button onClick={async()=>{await deleteItem(confirmDelete.coll,confirmDelete.id);setConfirmDelete(null);}} className="flex-1 py-3 bg-red-500 text-white rounded-2xl font-black shadow-lg hover:bg-red-600 transition-all active:scale-95">삭제</button>
              </div>
            </div>
          </div>
        )}

        {/* 일괄 처리 날짜 선택 팝업 */}
        {bulkDatePopup && (
          <div className="fixed inset-0 z-[160] flex items-center justify-center p-6 bg-slate-900/60 backdrop-blur-sm animate-in fade-in" onClick={()=>{setBulkDatePopup(null);setBulkSelectedStatus(null);}}>
            <div className="bg-white rounded-[2rem] shadow-2xl p-5 md:p-8 w-full max-w-xs animate-in zoom-in-95" onClick={e=>e.stopPropagation()}>
              <div className="flex items-center gap-3 mb-6">
                <div className="p-3 bg-indigo-100 rounded-2xl text-indigo-600"><Calendar size={22}/></div>
                <div>
                  <p className="font-black text-slate-800 text-base leading-none">일괄 처리 날짜 선택</p>
                  <p className="text-[11px] text-slate-400 font-medium mt-1.5 truncate max-w-[180px]">{bulkDatePopup.item.title}</p>
                </div>
              </div>
              <input type="date" value={bulkSelectedDate} onChange={e=>setBulkSelectedDate(e.target.value)}
                className="w-full px-4 py-3 bg-slate-50 border-2 border-slate-100 rounded-2xl font-bold text-slate-800 outline-none focus:border-indigo-400 transition-all mb-6 text-center" autoFocus />
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">적용할 상태 선택</p>
              <div className="space-y-1.5 max-h-52 overflow-y-auto mb-4">
                {(bulkDatePopup.category==='assignment'?ASSIGN_STATUS_ORDER:MEMO_STATUS_ORDER).map(st=>{
                  const cfg=bulkDatePopup.category==='assignment'?ASSIGN_STATUS_CONFIG[st]:MEMO_STATUS_CONFIG[st];
                  const isSelected=bulkSelectedStatus===st;
                  return (
                    <button key={st} onClick={()=>setBulkSelectedStatus(st)}
                      className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-xs font-black transition-all shadow-sm border-2 ${isSelected?`${cfg?.bg} ${cfg?.color} border-current ring-2 ring-offset-1 ring-current scale-[1.02]`:`${cfg?.bg} ${cfg?.color} border-transparent opacity-60 hover:opacity-100`}`}>
                      {cfg?.icon&&React.createElement(cfg.icon,{size:14})}{cfg?.label}
                      {isSelected&&<CheckCircle2 size={14} className="ml-auto"/>}
                    </button>
                  );
                })}
              </div>
              <div className="flex gap-3">
                <button onClick={()=>{setBulkDatePopup(null);setBulkSelectedStatus(null);}} className="flex-1 py-3 bg-slate-100 text-slate-400 rounded-2xl font-black text-sm hover:bg-slate-200">취소</button>
                <button onClick={()=>{if(bulkSelectedStatus){bulkUpdateStatus(bulkDatePopup.item,bulkSelectedStatus,bulkDatePopup.category);setBulkSelectedStatus(null);}}} disabled={!bulkSelectedStatus}
                  className={`flex-1 py-3 rounded-2xl font-black text-sm flex items-center justify-center gap-2 ${bulkSelectedStatus?'text-white shadow-lg active:scale-95':'bg-slate-100 text-slate-300 cursor-not-allowed'}`}
                  style={bulkSelectedStatus?{background:'var(--sc)'}:{}}>
                  <CheckCircle size={16}/>완료
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    </ErrorBoundary>
  );
}
