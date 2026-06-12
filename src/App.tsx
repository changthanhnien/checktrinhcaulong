import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ChevronDown, 
  RotateCcw, 
  CheckCircle2, 
  Share2, 
  Trophy, 
  AlertCircle,
  Lightbulb,
  ArrowRight,
  ArrowLeft,
  Sword,
  History,
  Trash2,
  Calendar,
  User,
  Camera,
  X,
  Check,
  Play,
  Target,
  Clock,
  ChevronRight,
  Dumbbell,
  Heart,
  TrendingUp,
  Settings,
  Zap,
  Shield,
  Activity,
  Award,
  Flame,
  Wind,
  Layers
} from 'lucide-react';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip as RechartsTooltip, 
  ResponsiveContainer 
} from 'recharts';
import { questions, Question, Option } from './data/questions';
import { calculateResult, Result, AdviceSettings, AdviceLength, AdviceTone } from './utils/logic';
import { skillCategories, Drill, SkillCategory } from './data/drills';
import { getAvatars, FLAGSHIP_MALE, FLAGSHIP_FEMALE } from './utils/avatars';

const chibiSelfie = FLAGSHIP_MALE; // Default fallback pointer

const LOCAL_STORAGE_KEY = 'badminton_checker_selections';
const HISTORY_STORAGE_KEY = 'badminton_checker_history';
const PROFILE_STORAGE_KEY = 'badminton_checker_profile';
const PRACTICE_SKILL_KEY = 'badminton_checker_practice_skill';
const PRACTICE_DRILL_KEY = 'badminton_checker_practice_drill';
const FAVORITES_STORAGE_KEY = 'badminton_checker_favorites';
const ADVICE_SETTINGS_KEY = 'badminton_checker_advice_settings';

interface HistoryEntry extends Result {
  id: string;
  date: string;
  timestamp: number;
}

interface Profile {
  name: string;
  avatar: string; // Base64 or URL
  gender?: 'male' | 'female';
}

const PREDEFINED_AVATARS = [
  FLAGSHIP_MALE,
  FLAGSHIP_FEMALE
];

const BADMINTON_TIPS = [
  {
    title: "Cầm vợt đúng cách",
    content: "Đừng cầm vợt quá chặt. Hãy thả lỏng tay để linh hoạt chuyển đổi giữa thuận tay và trái tay.",
    icon: "🏸"
  },
  {
    title: "Luôn về vị trí trung tâm",
    content: "Sau mỗi cú đánh, hãy nhanh chóng di chuyển về vị trí giữa sân để sẵn sàng cho pha cầu tiếp theo.",
    icon: "🎯"
  },
  {
    title: "Quan sát đối thủ",
    content: "Để ý hướng vai và cổ tay của đối thủ để đoán trước hướng cầu họ định đánh.",
    icon: "👀"
  },
  {
    title: "Đập cầu điểm rơi",
    content: "Thay vì đập mạnh vào người đối thủ, hãy thử đập vào nách hoặc các góc xa để ghi điểm dễ hơn.",
    icon: "🔥"
  },
  {
    title: "Giao cầu thấp",
    content: "Quả giao cầu ngắn sát lưới là vũ khí lợi hại để ép đối thủ phải hất cầu lên, tạo cơ hội tấn công.",
    icon: "⚡"
  }
];

const Tooltip = ({ text, children }: { text: string; children: React.ReactNode }) => {
  const [isVisible, setIsVisible] = useState(false);

  return (
    <div className="relative flex items-center" onMouseEnter={() => setIsVisible(true)} onMouseLeave={() => setIsVisible(false)}>
      {children}
      <AnimatePresence>
        {isVisible && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 5, scale: 0.95 }}
            className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-2 bg-emerald-900 text-white text-[10px] font-medium rounded-lg shadow-xl whitespace-nowrap z-50 pointer-events-none"
          >
            {text}
            <div className="absolute top-full left-1/2 -translate-x-1/2 border-8 border-transparent border-t-emerald-900" />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const PRACTICE_THEMES = {
  emerald: {
    name: 'Ngọc lục bảo',
    color: 'emerald',
    primary: 'bg-emerald-900',
    secondary: 'bg-emerald-50',
    text: 'text-emerald-900',
    accent: 'text-emerald-500',
    border: 'border-emerald-100',
    hover: 'hover:bg-emerald-50',
    hoverBorder: 'hover:border-emerald-300',
    ring: 'ring-emerald-50'
  },
  blue: {
    name: 'Đại dương',
    color: 'blue',
    primary: 'bg-blue-900',
    secondary: 'bg-blue-50',
    text: 'text-blue-900',
    accent: 'text-blue-500',
    border: 'border-blue-100',
    hover: 'hover:bg-blue-50',
    hoverBorder: 'hover:border-blue-300',
    ring: 'ring-blue-50'
  },
  purple: {
    name: 'Hoàng hôn',
    color: 'purple',
    primary: 'bg-purple-900',
    secondary: 'bg-purple-50',
    text: 'text-purple-900',
    accent: 'text-purple-500',
    border: 'border-purple-100',
    hover: 'hover:bg-purple-50',
    hoverBorder: 'hover:border-purple-300',
    ring: 'ring-purple-50'
  },
  orange: {
    name: 'Nắng vàng',
    color: 'orange',
    primary: 'bg-orange-900',
    secondary: 'bg-orange-50',
    text: 'text-orange-900',
    accent: 'text-orange-500',
    border: 'border-orange-100',
    hover: 'hover:bg-orange-50',
    hoverBorder: 'hover:border-orange-300',
    ring: 'ring-orange-50'
  },
  rose: {
    name: 'Hoa hồng',
    color: 'rose',
    primary: 'bg-rose-900',
    secondary: 'bg-rose-50',
    text: 'text-rose-900',
    accent: 'text-rose-500',
    border: 'border-rose-100',
    hover: 'hover:bg-rose-50',
    hoverBorder: 'hover:border-rose-300',
    ring: 'ring-rose-50'
  }
};

const PRACTICE_SETTINGS_KEY = 'badminton_checker_practice_settings';

const CATEGORY_ICONS: Record<string, React.ReactNode> = {
  'serve': <Sword size={24} />,
  'net-play': <Target size={24} />,
  'footwork': <Wind size={24} />,
  'smash': <Zap size={24} />,
  'defense': <Shield size={24} />,
  'recovery': <Activity size={24} />
};

const getCategoryIcon = (catId: string, emoji: string, iconSet: 'emoji' | 'lucide') => {
  if (iconSet === 'lucide') {
    return CATEGORY_ICONS[catId] || emoji;
  }
  return emoji;
};

export default function App() {
  const [selections, setSelections] = useState<Record<string, number>>({});
  const [result, setResult] = useState<Result | null>(null);
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [profile, setProfile] = useState<Profile>({ name: 'Lông Thủ', avatar: PREDEFINED_AVATARS[0], gender: 'male' });
  const [activeTab, setActiveTab] = useState<'assessment' | 'practice' | 'history'>('assessment');
  const [avatarCategory, setAvatarCategory] = useState<'All' | 'Championship' | 'Pro' | 'Chibi' | 'Meme'>('All');
  const [selectedSkill, setSelectedSkill] = useState<SkillCategory | null>(null);
  const [selectedDrill, setSelectedDrill] = useState<Drill | null>(null);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [timeLeft, setTimeLeft] = useState<number | null>(null);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [showCertificateModal, setShowCertificateModal] = useState(false);
  const [openQuestionId, setOpenQuestionId] = useState<string | null>(null);
  const [showCompletionModal, setShowCompletionModal] = useState(false);
  const [practiceSettings, setPracticeSettings] = useState({
    theme: 'emerald' as keyof typeof PRACTICE_THEMES,
    iconSet: 'emoji' as 'emoji' | 'lucide'
  });
  const [adviceSettings, setAdviceSettings] = useState<AdviceSettings>({
    length: 'long',
    tone: 'encouraging'
  });
  const [showPracticeSettings, setShowPracticeSettings] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const resultRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Load from localStorage
  useEffect(() => {
    const savedSelections = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (savedSelections) {
      try {
        setSelections(JSON.parse(savedSelections));
      } catch (e) {
        console.error('Failed to parse saved selections', e);
      }
    }

    const savedHistory = localStorage.getItem(HISTORY_STORAGE_KEY);
    if (savedHistory) {
      try {
        setHistory(JSON.parse(savedHistory));
      } catch (e) {
        console.error('Failed to parse saved history', e);
      }
    }

    const savedProfile = localStorage.getItem(PROFILE_STORAGE_KEY);
    if (savedProfile) {
      try {
        const parsed = JSON.parse(savedProfile);
        setProfile({
          name: parsed.name || 'Lông Thủ',
          avatar: (parsed.avatar && getAvatars().some(a => a.url === parsed.avatar)) ? parsed.avatar : PREDEFINED_AVATARS[0],
          gender: parsed.gender || 'male'
        });
      } catch (e) {
        console.error('Failed to parse saved profile', e);
      }
    }

    const savedSkillId = localStorage.getItem(PRACTICE_SKILL_KEY);
    if (savedSkillId) {
      const skill = skillCategories.find(s => s.id === savedSkillId);
      if (skill) {
        setSelectedSkill(skill);
        const savedDrillId = localStorage.getItem(PRACTICE_DRILL_KEY);
        if (savedDrillId) {
          const drill = skill.drills.find(d => d.id === savedDrillId);
          if (drill) {
            setSelectedDrill(drill);
          }
        }
      }
    }

    const savedFavorites = localStorage.getItem(FAVORITES_STORAGE_KEY);
    if (savedFavorites) {
      try {
        setFavorites(JSON.parse(savedFavorites));
      } catch (e) {
        console.error('Failed to parse saved favorites', e);
      }
    }

    const savedPracticeSettings = localStorage.getItem(PRACTICE_SETTINGS_KEY);
    if (savedPracticeSettings) {
      try {
        setPracticeSettings(JSON.parse(savedPracticeSettings));
      } catch (e) {
        console.error('Failed to parse saved practice settings', e);
      }
    }

    const savedAdviceSettings = localStorage.getItem(ADVICE_SETTINGS_KEY);
    if (savedAdviceSettings) {
      try {
        setAdviceSettings(JSON.parse(savedAdviceSettings));
      } catch (e) {
        console.error('Failed to parse saved advice settings', e);
      }
    }
  }, []);

  // Save to localStorage
  useEffect(() => {
    if (Object.keys(selections).length > 0) {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(selections));
    }
    // Clean result if selections fall below the mandatory 12 questions limit
    if (Object.keys(selections).length < 12) {
      setResult(null);
    }
  }, [selections]);

  useEffect(() => {
    localStorage.setItem(HISTORY_STORAGE_KEY, JSON.stringify(history));
  }, [history]);

  useEffect(() => {
    localStorage.setItem(PROFILE_STORAGE_KEY, JSON.stringify(profile));
  }, [profile]);

  useEffect(() => {
    localStorage.setItem(FAVORITES_STORAGE_KEY, JSON.stringify(favorites));
  }, [favorites]);

  useEffect(() => {
    localStorage.setItem(PRACTICE_SETTINGS_KEY, JSON.stringify(practiceSettings));
  }, [practiceSettings]);

  useEffect(() => {
    localStorage.setItem(ADVICE_SETTINGS_KEY, JSON.stringify(adviceSettings));
    if (result && Object.keys(selections).length === questions.length) {
      const res = calculateResult(selections, adviceSettings);
      setResult(res);
    }
  }, [adviceSettings]);

  useEffect(() => {
    if (selectedSkill) {
      localStorage.setItem(PRACTICE_SKILL_KEY, selectedSkill.id);
    } else {
      localStorage.removeItem(PRACTICE_SKILL_KEY);
    }
  }, [selectedSkill]);

  useEffect(() => {
    if (selectedDrill) {
      localStorage.setItem(PRACTICE_DRILL_KEY, selectedDrill.id);
    } else {
      localStorage.removeItem(PRACTICE_DRILL_KEY);
    }
  }, [selectedDrill]);

  // Escape key listener to close Certificate Modal
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setShowCertificateModal(false);
      }
    };
    if (showCertificateModal) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [showCertificateModal]);

  // Timer Logic
  useEffect(() => {
    if (selectedDrill) {
      const minutes = parseInt(selectedDrill.duration) || 0;
      setTimeLeft(minutes * 60);
      setIsTimerRunning(false);
    } else {
      setTimeLeft(null);
      setIsTimerRunning(false);
    }
  }, [selectedDrill]);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isTimerRunning && timeLeft !== null && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft(prev => (prev !== null ? prev - 1 : null));
      }, 1000);
    } else if (timeLeft === 0 && isTimerRunning) {
      setIsTimerRunning(false);
      setShowCompletionModal(true);
      showToast('🎉 Tuyệt vời! Bạn đã hoàn thành thời gian tập luyện!');
    }
    return () => clearInterval(interval);
  }, [isTimerRunning, timeLeft]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleSelect = (questionId: string, optionId: number) => {
    setSelections(prev => ({ ...prev, [questionId]: optionId }));
    setOpenQuestionId(null);
  };

  const toggleFavorite = (drillId: string) => {
    setFavorites(prev => 
      prev.includes(drillId) 
        ? prev.filter(id => id !== drillId) 
        : [...prev, drillId]
    );
    if (!favorites.includes(drillId)) {
      showToast('❤️ Đã thêm vào mục yêu thích!');
    }
  };

  const handleReset = () => {
    setSelections({});
    setResult(null);
    localStorage.removeItem(LOCAL_STORAGE_KEY);
  };

  const handleCheck = () => {
    if (Object.keys(selections).length < 12) {
      showToast('⚠️ Bạn bắt buộc phải hoàn thành toàn bộ 12 câu hỏi để xem trình độ của mình!');
      return;
    }
    const res = calculateResult(selections, adviceSettings);
    setResult(res);
    
    // Add to history
    const newEntry: HistoryEntry = {
      ...res,
      id: crypto.randomUUID(),
      date: new Date().toLocaleDateString('vi-VN', { 
        day: '2-digit', 
        month: '2-digit', 
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      }),
      timestamp: Date.now()
    };
    
    setHistory(prev => [newEntry, ...prev].slice(0, 10)); // Keep last 10
    
    setTimeout(() => {
      resultRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  const clearHistory = () => {
    setHistory([]);
    showToast('Đã xóa lịch sử!');
  };

  const showToast = (message: string) => {
    setToast(message);
    setTimeout(() => setToast(null), 3000);
  };

  const handleLogoClick = () => {
    localStorage.removeItem(LOCAL_STORAGE_KEY);
    setSelections({});
    setResult(null);
    window.location.reload();
  };

  const downloadCertificate = () => {
    if (!result) return;
    const canvas = document.createElement('canvas');
    canvas.width = 1920;
    canvas.height = 1080; // exactly 16:9 1080p HD
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.scale(1.6, 1.6); // Scale drawing commands from 1200x675 to 1920x1080

    // Draw rich beige/cream background
    ctx.fillStyle = "#fffdf5"; 
    ctx.fillRect(0, 0, 1200, 675);

    // Golden double border with high precision
    ctx.strokeStyle = "#fbbf24";
    ctx.lineWidth = 14;
    ctx.strokeRect(15, 15, 1170, 645);

    ctx.strokeStyle = "#d97706";
    ctx.lineWidth = 3;
    ctx.strokeRect(30, 30, 1140, 615);

    // Deep elegant green Corner Decorations
    ctx.fillStyle = "#064e3b";
    ctx.beginPath();
    ctx.moveTo(30, 30);
    ctx.lineTo(120, 30);
    ctx.lineTo(30, 120);
    ctx.closePath();
    ctx.fill();

    ctx.beginPath();
    ctx.moveTo(1170, 30);
    ctx.lineTo(1080, 30);
    ctx.lineTo(1170, 120);
    ctx.closePath();
    ctx.fill();

    ctx.beginPath();
    ctx.moveTo(30, 645);
    ctx.lineTo(120, 645);
    ctx.lineTo(30, 555);
    ctx.closePath();
    ctx.fill();

    ctx.beginPath();
    ctx.moveTo(1170, 645);
    ctx.lineTo(1080, 645);
    ctx.lineTo(1170, 555);
    ctx.closePath();
    ctx.fill();

    // Draw abstract badminton smash watermark silhouette in background with low opacity
    ctx.save();
    ctx.globalAlpha = 0.055; // light watermark
    ctx.fillStyle = "#b45309"; 
    ctx.translate(880, 340);
    ctx.scale(2.2, 2.2);
    
    // Head
    ctx.beginPath();
    ctx.arc(0, -60, 12, 0, 2 * Math.PI);
    ctx.fill();
    
    // Torso & Legs
    ctx.beginPath();
    ctx.moveTo(-5, -45);
    ctx.lineTo(8, -45);
    ctx.lineTo(15, -10);
    ctx.lineTo(35, 35);
    ctx.lineTo(25, 75);
    ctx.lineTo(10, 35);
    ctx.lineTo(-10, 15);
    ctx.lineTo(-25, 55);
    ctx.lineTo(-40, 45);
    ctx.closePath();
    ctx.fill();

    // Arms
    ctx.beginPath();
    ctx.moveTo(-10, -42);
    ctx.lineTo(-28, -25);
    ctx.lineTo(-38, -35);
    ctx.closePath();
    ctx.fill();
    
    ctx.beginPath();
    ctx.moveTo(12, -42);
    ctx.lineTo(30, -68);
    ctx.lineTo(48, -95); // High racket hand position
    ctx.lineTo(40, -100);
    ctx.lineTo(22, -72);
    ctx.closePath();
    ctx.fill();
    
    // Shuttlecock circle symbol
    ctx.beginPath();
    ctx.arc(70, -115, 6, 0, 2 * Math.PI);
    ctx.fill();
    ctx.restore();

    // Load chibi image (fallback to championship flagship of corresponding gender)
    const flagshipDefault = profile.gender === 'female' ? FLAGSHIP_FEMALE : FLAGSHIP_MALE;
    const imgSource = profile.avatar || flagshipDefault;

    const img = new Image();
    img.crossOrigin = "anonymous";
    img.src = imgSource;

    const renderRemainingDetails = () => {
      // Draw background inside picture frame (rounded)
      const bx = 70;
      const by = 100;
      const bw = 390;
      const bh = 390;
      const br = 24; // Subtle corner rounding radius

      ctx.fillStyle = "#ffffff";
      ctx.beginPath();
      ctx.moveTo(bx + br, by);
      ctx.lineTo(bx + bw - br, by);
      ctx.quadraticCurveTo(bx + bw, by, bx + bw, by + br);
      ctx.lineTo(bx + bw, by + bh - br);
      ctx.quadraticCurveTo(bx + bw, by + bh, bx + bw - br, by + bh);
      ctx.lineTo(bx + br, by + bh);
      ctx.quadraticCurveTo(bx, by + bh, bx, by + bh - br);
      ctx.lineTo(bx, by + br);
      ctx.quadraticCurveTo(bx, by, bx + br, by);
      ctx.closePath();
      ctx.fill();
      
      // Draw image with rounded circular clip matching exactly inside the frame
      ctx.save();
      const rx = 75;
      const ry = 105;
      const rw = 380;
      const rh = 380;
      const irr = 19; // Inner radius for image clipping
      ctx.beginPath();
      ctx.moveTo(rx + irr, ry);
      ctx.lineTo(rx + rw - irr, ry);
      ctx.quadraticCurveTo(rx + rw, ry, rx + rw, ry + irr);
      ctx.lineTo(rx + rw, ry + rh - irr);
      ctx.quadraticCurveTo(rx + rw, ry + rh, rx + rw - irr, ry + rh);
      ctx.lineTo(rx + irr, ry + rh);
      ctx.quadraticCurveTo(rx, ry + rh, rx, ry + rh - irr);
      ctx.lineTo(rx, ry + irr);
      ctx.quadraticCurveTo(rx, ry, rx + irr, ry);
      ctx.closePath();
      ctx.clip();
      
      // Draw image
      ctx.drawImage(img, rx, ry, rw, rh);
      ctx.restore();

      // Gold frame border (rounded matching the background card)
      ctx.strokeStyle = "#fbbf24";
      ctx.lineWidth = 10;
      ctx.beginPath();
      ctx.moveTo(bx + br, by);
      ctx.lineTo(bx + bw - br, by);
      ctx.quadraticCurveTo(bx + bw, by, bx + bw, by + br);
      ctx.lineTo(bx + bw, by + bh - br);
      ctx.quadraticCurveTo(bx + bw, by + bh, bx + bw - br, by + bh);
      ctx.lineTo(bx + br, by + bh);
      ctx.quadraticCurveTo(bx, by + bh, bx, by + bh - br);
      ctx.lineTo(bx, by + br);
      ctx.quadraticCurveTo(bx, by, bx + br, by);
      ctx.closePath();
      ctx.stroke();

      // Special ribbon under photo indicating Title
      ctx.fillStyle = "#d97706";
      ctx.fillRect(110, 465, 310, 42);
      
      ctx.fillStyle = "#ffffff";
      ctx.font = "bold 13px Arial, Helvetica, sans-serif";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      
      const selectedItem = getAvatars().find(av => av.url === profile.avatar);
      const isPro = ['TB-', 'TB', 'TB+', 'Khá', 'Giỏi'].includes(result.level);
      const chibiTitle = selectedItem 
        ? selectedItem.name.split(' (')[0]
        : (isPro 
            ? (profile.gender === 'female' ? 'NỮ LÔNG THỦ CHUYÊN NGHIỆP' : 'NAM LÔNG THỦ CHUYÊN NGHIỆP')
            : (profile.gender === 'female' ? 'NỮ LÔNG THỦ NGHIỆP DƯ' : 'NAM LÔNG THỦ NGHIỆP DƯ')
          );
      ctx.fillText(chibiTitle.toUpperCase(), 265, 486);

      // Reset text properties for main certificate body
      ctx.textAlign = "left";
      ctx.textBaseline = "alphabetic";

      // Draw Prestigious Badge Logo / Gold Crest at Top Center of description column
      ctx.save();
      ctx.translate(520, 105);
      
      // Laurel wings
      ctx.strokeStyle = "#fbbf24";
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      ctx.arc(-30, 0, 18, Math.PI * 0.5, Math.PI * 1.5);
      ctx.stroke();
      ctx.beginPath();
      ctx.arc(30, 0, 18, Math.PI * 1.5, Math.PI * 2.5);
      ctx.stroke();

      // Golden shield/disc
      ctx.fillStyle = "#fbbf24";
      ctx.beginPath();
      ctx.arc(0, 0, 20, 0, 2 * Math.PI);
      ctx.fill();
      
      ctx.fillStyle = "#064e3b"; // Dark green base
      ctx.beginPath();
      ctx.arc(0, 0, 17, 0, 2 * Math.PI);
      ctx.fill();

      // Gold monogram
      ctx.fillStyle = "#fbbf24";
      ctx.font = "900 13px Arial, Helvetica, sans-serif";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText("BC", 0, 0.5);
      ctx.restore();

      // Main Headers - aligned beautiful left column
      ctx.textAlign = "left";
      ctx.fillStyle = "#d97706"; // Premium gold/amber
      ctx.font = "italic 700 28px Arial, Helvetica, sans-serif";
      ctx.fillText("Chứng nhận vinh danh", 580, 115); // aligned next to brand logo

      ctx.fillStyle = "#064e3b"; // Slate emerald
      ctx.font = "900 42px Arial, Helvetica, sans-serif";
      ctx.fillText("BẰNG KHEN THÀNH TÍCH", 520, 175);

      // Elegant gold divider line
      ctx.strokeStyle = "#fbbf24";
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      ctx.moveTo(520, 200);
      ctx.lineTo(1120, 200);
      ctx.stroke();


      // Name - highlighted proudly in dark emerald
      ctx.fillStyle = "#022c22";
      ctx.font = "900 48px Arial, Helvetica, sans-serif";
      ctx.fillText(profile.name.toUpperCase(), 520, 315);

      // Achievement announcement
      ctx.fillStyle = "#334155";
      ctx.font = "700 16px Arial, Helvetica, sans-serif";
      ctx.fillText("ĐÃ XUẤT SẮC ĐẠT ĐỒNG THUẬN TRÌNH ĐỘ:", 520, 375);

      // Trình Độ Badge
      ctx.fillStyle = "#047857";
      ctx.fillRect(520, 400, 260, 55);
      
      ctx.fillStyle = "#ffffff";
      ctx.font = "800 28px Arial, Helvetica, sans-serif";
      ctx.textAlign = "center";
      ctx.fillText(`TRÌNH ${result.level.toUpperCase()}`, 650, 437);

      // Recenter text left for certification notes
      ctx.textAlign = "left";
      ctx.fillStyle = "#475569";
      ctx.font = "600 14.5px Arial, Helvetica, sans-serif";
      ctx.fillText("Chứng nhận bởi Hệ thống Đánh giá Phong trào Badminton Checker.", 520, 502);
      ctx.fillText("Kết quả phản ánh chính xác thực chiến, thể lực và nhãn quan chiến thuật.", 520, 524);

      // --- DRAW WATERMARKED RED OFFICIAL SEAL (LUI VỀ SAU NẰM DƯỚI TEXT) ---
      ctx.save();
      ctx.translate(1080, 540); // Offset right so left edge (1008px) never overlaps text which ends at ~970px - 1000px
      ctx.rotate(-0.12); // Flipped slightly -7 degrees for a real ink-stamp feel
      ctx.globalAlpha = 0.23; // Faded/Watermarked in chìm look
      
      const sealRed = "#ef4444"; // Authentic bright rubber seal red
      ctx.strokeStyle = sealRed;
      ctx.fillStyle = sealRed;
      
      // Outer thick boundary
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.arc(0, 0, 72, 0, 2 * Math.PI);
      ctx.stroke();
      
      // Secondary nested inner circle
      ctx.lineWidth = 1.2;
      ctx.beginPath();
      ctx.arc(0, 0, 62, 0, 2 * Math.PI);
      ctx.stroke();

      // Inner thin border boundary
      ctx.beginPath();
      ctx.arc(0, 0, 44, 0, 2 * Math.PI);
      ctx.stroke();
      
      // Decorative stars
      ctx.font = "bold 13px Arial, Helvetica, sans-serif";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText("★", -52, 0);
      ctx.fillText("★", 52, 0);
      
      // Text drawing circular path function
      const drawArcText = (text: string, radius: number, startAngle: number, clockwise: 1 | -1) => {
        const letters = text.split("");
        const spacing = 0.13; // spacing between letters
        letters.forEach((char, index) => {
          const angle = startAngle + (index * spacing * clockwise);
          ctx.save();
          ctx.translate(radius * Math.cos(angle), radius * Math.sin(angle));
          ctx.rotate(angle + Math.PI / 2 * clockwise);
          ctx.font = "bold 8px Arial, Helvetica, sans-serif";
          ctx.fillText(char, 0, 0);
          ctx.restore();
        });
      };
      
      // Circle boundaries texts - Beautifully aligned for Badminton Authority
      drawArcText("HIỆP HỘI BADMINTON", 53, -Math.PI * 0.75, 1);
      drawArcText("BADMINTON CHECKER", 53, Math.PI * 0.75, -1);
      
      // Central rubber confirmation seal details
      ctx.font = "bold 20px Arial, Helvetica, sans-serif";
      ctx.fillText("✔", 0, -8);
      ctx.font = "bold 10px Arial, Helvetica, sans-serif";
      ctx.fillText("ĐÃ DUYỆT", 0, 14);
      
      ctx.restore();
      // --- END OFFICIAL SEAL WATERMARK ---

      // Signature & Authority (Sitting clearly on top of the seal watermark)
      ctx.fillStyle = "#0f172a";
      ctx.font = "800 15.5px Arial, Helvetica, sans-serif";
      ctx.fillText("BAN TRỌNG TÀI BADMINTON CHECKER", 520, 590);
      
      ctx.fillStyle = "#d97706";
      ctx.font = "italic 600 13.5px Arial, Helvetica, sans-serif";
      ctx.fillText("Đã chứng thực & đóng dấu kiểm định", 520, 612);

      // Export canvas
      try {
        const urlObj = canvas.toDataURL('image/png');
        const link = document.createElement('a');
        link.href = urlObj;
        link.download = `Bang_Khen_Long_Thu_${profile.name.replace(/\s+/g, '_')}.png`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        showToast('Đã tải bằng khen dạng ảnh 16:9 chất lượng cao!');
      } catch (e) {
        showToast('Lỗi xuất canvas, vui lòng thử lại.');
      }
    };

    img.onload = renderRemainingDetails;
    img.onerror = () => {
      // Fallback if image CORS fails
      img.src = flagshipDefault;
      img.onload = renderRemainingDetails;
    };
  };

  const handleShare = () => {
    if (!result) return;
    setShowCertificateModal(true);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        showToast('Ảnh quá lớn (tối đa 5MB)');
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfile(prev => ({ ...prev, avatar: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const allSelected = Object.keys(selections).length === questions.length;

  const suggestedDifficulty = result ? (() => {
    if (['Newbie', 'Yếu', 'Yếu+'].includes(result.level)) return 'Dễ';
    if (['TB-', 'TB', 'TB+'].includes(result.level)) return 'Trung bình';
    if (['Khá', 'Giỏi'].includes(result.level)) return 'Khó';
    return null;
  })() : null;

  return (
    <div className="min-h-screen bg-emerald-50 text-emerald-950 font-sans selection:bg-emerald-200">
      
      <header className="bg-white/80 backdrop-blur-md sticky top-0 z-50 border-b border-emerald-100 shadow-sm">
        <div className="max-w-2xl mx-auto px-4 py-4 flex items-center justify-between">
          <button 
            onClick={handleLogoClick}
            className="flex items-center gap-3 focus:outline-none hover:opacity-85 active:scale-98 transition-all text-left group cursor-pointer"
            title="Làm mới trang"
          >
            <div className="w-10 h-10 bg-emerald-600 rounded-xl flex items-center justify-center shadow-lg shadow-emerald-200 group-hover:rotate-6 transition-transform">
              <Trophy className="text-white w-6 h-6" />
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-tight text-emerald-900">Check Trình</h1>
              <p className="text-[10px] text-emerald-600 font-bold uppercase tracking-widest">Badminton Checker</p>
            </div>
          </button>
          
          <div className="flex items-center gap-3">
            <button 
              onClick={() => setActiveTab('history')}
              className={`p-2 rounded-full transition-colors ${activeTab === 'history' ? 'bg-emerald-600 text-white shadow-lg' : 'text-emerald-600 hover:bg-emerald-100'}`}
              title="Lịch sử"
            >
              <History size={20} />
            </button>
            <div className="h-6 w-[1px] bg-emerald-100 mx-1" />
            <button 
              onClick={() => setShowProfileModal(true)}
              className="flex items-center gap-2 pl-1 pr-3 py-1 bg-emerald-50 hover:bg-emerald-100 rounded-full border border-emerald-100 transition-all group"
            >
              <div className="w-8 h-8 rounded-full overflow-hidden border-2 border-white shadow-sm">
                <img src={profile.avatar} alt="Avatar" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
              </div>
              <span className="text-sm font-bold text-emerald-900 max-w-[80px] truncate">{profile.name}</span>
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 py-8 pb-24">
        {/* Profile Modal */}
        <AnimatePresence>
          {showProfileModal && (
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setShowProfileModal(false)}
                className="absolute inset-0 bg-emerald-950/40 backdrop-blur-sm"
              />
              <motion.div 
                initial={{ scale: 0.9, opacity: 0, y: 20 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.9, opacity: 0, y: 20 }}
                className="relative bg-white w-full max-w-lg rounded-[2.5rem] shadow-2xl overflow-hidden"
              >
                <div className="p-6 md:p-8">
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <h3 className="text-xl font-black text-emerald-900 tracking-tight">Hồ sơ Lông Thủ</h3>
                      <p className="text-[10px] font-bold text-emerald-500 uppercase tracking-widest mt-0.5">Tuyển tập 120+ Avatar Chibi độc quyền</p>
                    </div>
                    <button onClick={() => setShowProfileModal(false)} className="p-2 hover:bg-emerald-50 rounded-full text-emerald-400 transition-colors">
                      <X size={20} />
                    </button>
                  </div>

                  <div className="flex flex-col items-center gap-5">
                    <div className="flex items-center gap-4 w-full bg-emerald-50/50 p-3 rounded-2xl border border-emerald-100">
                      <div className="relative shrink-0">
                        <div className="w-20 h-20 rounded-full overflow-hidden border-4 border-white shadow-md bg-white">
                          <img src={profile.avatar} alt="Current Avatar" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                        </div>
                        <button 
                          onClick={() => fileInputRef.current?.click()}
                          className="absolute bottom-0 right-0 p-1.5 bg-emerald-600 text-white rounded-full shadow-lg hover:bg-emerald-700 transition-all scale-90"
                        >
                          <Camera size={14} />
                        </button>
                        <input 
                          type="file" 
                          ref={fileInputRef} 
                          onChange={handleFileUpload} 
                          accept="image/*" 
                          className="hidden" 
                        />
                      </div>
                      <div className="flex-1 space-y-1">
                        <label className="text-[9px] font-bold text-emerald-500 uppercase tracking-widest block font-sans">Tên hiển thị</label>
                        <input 
                          type="text" 
                          value={profile.name}
                          onChange={(e) => setProfile(prev => ({ ...prev, name: e.target.value }))}
                          className="w-full px-3 py-2 bg-white border border-emerald-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 font-extrabold text-sm text-emerald-900 transition-all"
                          placeholder="Nhập tên..."
                        />
                      </div>
                    </div>

                    <div className="w-full space-y-1.5">
                      <label className="text-[10px] font-bold text-emerald-500 uppercase tracking-widest ml-1 font-sans">Giới tính (Để in Bằng khen)</label>
                      <div className="flex bg-emerald-50 p-1 rounded-xl border border-emerald-100 shadow-inner">
                        <button
                          type="button"
                          onClick={() => {
                            setProfile(prev => ({ 
                              ...prev, 
                              gender: 'male', 
                              avatar: prev.avatar.includes('female') || prev.avatar === FLAGSHIP_FEMALE ? FLAGSHIP_MALE : prev.avatar 
                            }));
                          }}
                          className={`flex-1 py-1.5 rounded-lg font-extrabold text-xs transition-all cursor-pointer ${
                            profile.gender !== 'female' 
                              ? 'bg-emerald-600 text-white shadow-sm' 
                              : 'text-emerald-600 hover:bg-emerald-100/50'
                          }`}
                        >
                          Nam 🚹
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setProfile(prev => ({ 
                              ...prev, 
                              gender: 'female', 
                              avatar: prev.avatar.includes('male') || prev.avatar === FLAGSHIP_MALE ? FLAGSHIP_FEMALE : prev.avatar 
                            }));
                          }}
                          className={`flex-1 py-1.5 rounded-lg font-extrabold text-xs transition-all cursor-pointer ${
                            profile.gender === 'female' 
                              ? 'bg-emerald-600 text-white shadow-sm' 
                              : 'text-emerald-600 hover:bg-emerald-100/50'
                          }`}
                        >
                          Nữ 🚺
                        </button>
                      </div>
                    </div>

                    <div className="w-full space-y-3">
                      <div className="flex items-center justify-between">
                        <label className="text-[10px] font-bold text-emerald-600 uppercase tracking-widest ml-1 font-sans">Chọn Avatar Chibi ({getAvatars().filter(av => av.gender === (profile.gender || 'male')).length} mẫu)</label>
                        <span className="text-[9px] font-black px-2 py-0.5 bg-amber-100 text-amber-800 rounded">BẢN QUYỀN CHIBI ✨</span>
                      </div>

                      {/* Avatar grid - simplified to 3 premium local options */}
                      <div className="grid grid-cols-3 gap-3 border border-emerald-100 p-3 rounded-2xl bg-emerald-50/20 shadow-sm">
                        {getAvatars()
                          .filter((av) => av.gender === (profile.gender || 'male'))
                          .map((av) => (
                            <button 
                              key={av.id}
                              type="button"
                              onClick={() => setProfile(prev => ({ ...prev, avatar: av.url }))}
                              className={`relative rounded-2xl overflow-hidden border-2 transition-all aspect-square group/av ${profile.avatar === av.url ? 'border-amber-500 ring-2 ring-amber-400 ring-offset-1 scale-95 shadow-md' : 'border-emerald-100/60 hover:border-emerald-300'}`}
                              title={av.name}
                            >
                              <img src={av.url} alt={av.name} className="w-full h-full object-cover transition-transform group-hover/av:scale-105" referrerPolicy="no-referrer" />
                              {profile.avatar === av.url ? (
                                <div className="absolute inset-x-0 bottom-0 bg-amber-500 text-white py-1 text-[8px] font-black text-center flex items-center justify-center gap-0.5 uppercase">
                                  <Check size={8} strokeWidth={4} /> Đang chọn
                                </div>
                              ) : (
                                <div className="absolute inset-x-0 bottom-0 bg-black/45 text-white py-1 text-[8px] font-bold text-center opacity-0 group-hover/av:opacity-100 transition-opacity">
                                  CHỌN
                                </div>
                              )}
                            </button>
                          ))}
                      </div>
                      
                      {/* Selected Avatar Title / Tagline */}
                      {(() => {
                        const selectedItem = getAvatars().find(av => av.url === profile.avatar);
                        if (selectedItem) {
                          return (
                            <div className="text-center py-2 bg-emerald-50 rounded-xl border border-emerald-100/60 transition-all shadow-inner">
                              <span className="text-[10px] text-emerald-800 font-bold italic font-sans">Danh xưng đi kèm: </span>
                              <strong className="text-xs font-black text-emerald-700 uppercase tracking-tight">{selectedItem.name}</strong>
                            </div>
                          );
                        }
                        return null;
                      })()}
                    </div>

                    <button 
                      onClick={() => setShowProfileModal(false)}
                      className="w-full py-3 bg-emerald-600 text-white font-black rounded-2xl shadow-lg shadow-emerald-200 hover:bg-emerald-700 transition-all mt-1 active:scale-98 text-xs cursor-pointer"
                    >
                      Xác nhận hồ sơ
                    </button>
                  </div>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

        {/* Main Content */}
        {activeTab === 'history' ? (
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-8"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <button 
                  onClick={() => setActiveTab('assessment')}
                  className="p-3 bg-white border border-emerald-100 hover:border-emerald-200 text-emerald-700 hover:text-emerald-950 rounded-2xl transition-all shadow-sm flex items-center justify-center shrink-0 cursor-pointer hover:bg-emerald-50 active:scale-95"
                  title="Quay lại Check Trình"
                >
                  <ArrowLeft size={18} />
                </button>
                <div>
                  <h2 className="text-2xl sm:text-3xl font-black text-emerald-900 tracking-tight">Lịch sử đánh giá</h2>
                  <p className="text-emerald-600 font-medium text-xs sm:text-sm">Theo dõi sự tiến bộ của bạn qua thời gian</p>
                </div>
              </div>
              {history.length > 0 && (
                <button 
                  onClick={clearHistory}
                  className="px-4 py-2 bg-red-50 text-red-600 rounded-xl font-bold text-xs flex items-center gap-2 hover:bg-red-100 transition-colors border border-red-100"
                >
                  <Trash2 size={14} />
                  Xóa tất cả
                </button>
              )}
            </div>

            {history.length === 0 ? (
              <div className="bg-white rounded-[2.5rem] border border-emerald-100 shadow-xl p-12 text-center space-y-4">
                <div className="w-20 h-20 bg-emerald-50 rounded-full flex items-center justify-center mx-auto text-emerald-200">
                  <History size={40} />
                </div>
                <div className="space-y-2">
                  <h3 className="text-xl font-black text-emerald-900">Chưa có dữ liệu</h3>
                  <p className="text-emerald-600 max-w-xs mx-auto">
                    Bạn chưa thực hiện bài đánh giá nào. Hãy bắt đầu ngay để theo dõi trình độ của mình!
                  </p>
                </div>
                <button 
                  onClick={() => setActiveTab('assessment')}
                  className="px-8 py-3 bg-emerald-600 text-white rounded-2xl font-bold shadow-lg shadow-emerald-200 hover:bg-emerald-700 transition-all"
                >
                  Bắt đầu đánh giá
                </button>
              </div>
            ) : (
              <div className="space-y-10">
                {/* Chart Section */}
                {history.length > 1 && (
                  <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white p-6 rounded-[2.5rem] border border-emerald-100 shadow-xl overflow-hidden"
                  >
                    <div className="flex items-center gap-2 mb-6 px-2">
                      <div className="p-2 bg-emerald-100 text-emerald-600 rounded-xl">
                        <TrendingUp size={20} />
                      </div>
                      <div>
                        <h3 className="text-lg font-black text-emerald-900 leading-tight">Biểu đồ tiến trình</h3>
                        <p className="text-xs text-emerald-500 font-bold uppercase tracking-widest">Sự thay đổi điểm số qua các lần đánh giá</p>
                      </div>
                    </div>
                    
                    <div className="h-[250px] w-full">
                      <ResponsiveContainer width="100%" height="100%">
                        <AreaChart
                          data={[...history].reverse().map(entry => ({
                            date: entry.date.split(' ')[0], // Only date part
                            score: Math.round(entry.score),
                            level: entry.level
                          }))}
                          margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
                        >
                          <defs>
                            <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                              <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                            </linearGradient>
                          </defs>
                          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0fdf4" />
                          <XAxis 
                            dataKey="date" 
                            axisLine={false} 
                            tickLine={false} 
                            tick={{ fill: '#065f46', fontSize: 10, fontWeight: 700 }}
                            dy={10}
                          />
                          <YAxis 
                            domain={[0, 100]} 
                            axisLine={false} 
                            tickLine={false} 
                            tick={{ fill: '#065f46', fontSize: 10, fontWeight: 700 }}
                          />
                          <RechartsTooltip 
                            cursor={{ stroke: '#10b981', strokeWidth: 1, strokeDasharray: '5 5' }}
                            content={({ active, payload }) => {
                              if (active && payload && payload.length) {
                                return (
                                  <div className="bg-white/95 backdrop-blur-md p-4 rounded-3xl shadow-2xl border border-emerald-100/50 outline-none">
                                    <p className="text-[10px] font-black text-emerald-500 uppercase tracking-widest mb-1">{payload[0].payload.date}</p>
                                    <div className="flex items-baseline gap-1">
                                      <span className="text-2xl font-black text-emerald-900">{payload[0].value}</span>
                                      <span className="text-xs font-bold text-emerald-600">điểm</span>
                                    </div>
                                    <p className="text-xs font-bold text-emerald-600 mt-1">Trình độ: {payload[0].payload.level}</p>
                                  </div>
                                );
                              }
                              return null;
                            }}
                          />
                          <Area 
                            type="monotone" 
                            dataKey="score" 
                            stroke="#10b981" 
                            strokeWidth={4}
                            fillOpacity={1} 
                            fill="url(#colorScore)" 
                            animationDuration={1500}
                            dot={{ r: 4, fill: '#fff', stroke: '#10b981', strokeWidth: 2 }}
                            activeDot={{ r: 6, fill: '#10b981', stroke: '#fff', strokeWidth: 2, shadow: '0 0 10px rgba(16, 185, 129, 0.4)' }}
                          />
                        </AreaChart>
                      </ResponsiveContainer>
                    </div>
                  </motion.div>
                )}

                <div className="relative space-y-6">
                {/* Timeline line */}
                <div className="absolute left-8 top-0 bottom-0 w-[2px] bg-emerald-100 hidden sm:block" />

                {history.map((entry, index) => {
                  const levelColors: Record<string, string> = {
                    'Newbie': 'bg-slate-100 text-slate-600 border-slate-200',
                    'Yếu': 'bg-orange-100 text-orange-600 border-orange-200',
                    'Yếu+': 'bg-orange-100 text-orange-600 border-orange-200',
                    'TB-': 'bg-yellow-100 text-yellow-600 border-yellow-200',
                    'TB': 'bg-emerald-100 text-emerald-600 border-emerald-200',
                    'TB+': 'bg-emerald-100 text-emerald-600 border-emerald-200',
                    'Khá': 'bg-blue-100 text-blue-600 border-blue-200',
                    'Giỏi': 'bg-purple-100 text-purple-600 border-purple-200',
                  };

                  const colorClass = levelColors[entry.level] || 'bg-emerald-100 text-emerald-600 border-emerald-200';

                  return (
                    <motion.div 
                      key={entry.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="relative pl-0 sm:pl-16 group"
                    >
                      {/* Timeline dot */}
                      <div className="absolute left-[30px] top-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-emerald-500 border-4 border-white shadow-sm z-10 hidden sm:block group-hover:scale-125 transition-transform" />
                      
                      <div className="bg-white rounded-3xl border border-emerald-100 shadow-sm p-6 hover:shadow-xl hover:border-emerald-300 transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
                        <div className="flex items-center gap-5">
                          <div className={`w-16 h-16 rounded-2xl flex items-center justify-center font-black text-xl border-2 shadow-sm shrink-0 ${colorClass}`}>
                            {entry.level}
                          </div>
                          <div>
                            <div className="flex items-center gap-2 text-[10px] text-emerald-500 font-bold uppercase tracking-[0.2em] mb-1">
                              <Calendar size={12} />
                              {entry.date}
                            </div>
                            <h4 className="text-lg font-black text-emerald-900 mb-1">{entry.description}</h4>
                            <div className="flex flex-wrap gap-2">
                              {entry.strengths.slice(0, 2).map((s, i) => (
                                <span key={i} className="px-2 py-0.5 bg-emerald-50 text-emerald-600 rounded-md text-[9px] font-bold border border-emerald-100">
                                  {s}
                                </span>
                              ))}
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-3 w-full sm:w-auto">
                          <button 
                            onClick={() => {
                              setResult(entry);
                              setActiveTab('assessment');
                              setTimeout(() => resultRef.current?.scrollIntoView({ behavior: 'smooth' }), 100);
                            }}
                            className="flex-1 sm:flex-none px-6 py-3 bg-emerald-50 text-emerald-600 rounded-xl font-bold text-sm hover:bg-emerald-600 hover:text-white transition-all flex items-center justify-center gap-2"
                          >
                            <ArrowRight size={16} />
                            Xem lại
                          </button>
                          <button 
                            onClick={() => {
                              const newHistory = history.filter(h => h.id !== entry.id);
                              setHistory(newHistory);
                              localStorage.setItem(HISTORY_STORAGE_KEY, JSON.stringify(newHistory));
                              showToast('Đã xóa bản ghi lịch sử');
                            }}
                            className="p-3 text-red-300 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
                            title="Xóa"
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          )}
        </motion.section>
        ) : (
          <>
            {/* Intro */}
            <section className="mb-10 text-center">
              <motion.div 
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="inline-block mb-4 px-4 py-1.5 bg-emerald-100 text-emerald-700 rounded-full text-[10px] font-black uppercase tracking-[0.2em]"
              >
                Chào mừng {profile.name}!
              </motion.div>
              <h2 className="text-3xl font-black text-emerald-900 mb-2 tracking-tight">Trình độ của bạn?</h2>
              <p className="text-emerald-700 max-w-md mx-auto leading-relaxed font-medium">
                Kiểm tra trình cầu lông của bạn dựa trên kỹ thuật, di chuyển, chiến thuật và độ ổn định.
              </p>
            </section>

            {/* Elegant Progress Bar */}
            <div className="mb-8 max-w-md mx-auto bg-white/60 p-4 rounded-2xl border border-emerald-100/50 shadow-sm">
              <div className="flex justify-between items-center mb-2">
                <span className="text-[10px] font-black text-emerald-800 uppercase tracking-widest">Tiến trình đánh giá</span>
                <span className="text-xs font-bold text-emerald-600">
                  {Object.keys(selections).filter(key => selections[key] !== undefined).length}/{questions.length} câu hỏi
                </span>
              </div>
              <div className="w-full h-3 bg-emerald-100/60 rounded-full overflow-hidden p-0.5">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: `${Math.round((Object.keys(selections).filter(key => selections[key] !== undefined).length / questions.length) * 100)}%` }}
                  transition={{ type: "spring", stiffness: 80, damping: 15 }}
                  className="h-full bg-emerald-600 rounded-full shadow-[0_0_12px_rgba(16,185,129,0.3)]"
                />
              </div>
            </div>

            {/* Questions List */}
            <div className="space-y-8">
              {questions.map((q, idx) => {
                const Icon = q.icon;
                const selectedOption = q.options.find(o => o.id === selections[q.id]);
                return (
                  <motion.div 
                    key={q.id}
                    initial={{ opacity: 0, y: 15 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className={`rounded-[2rem] border p-6 space-y-4 transition-all duration-300 bg-white ${
                      selectedOption 
                        ? 'border-emerald-300 shadow-[0_10px_30px_rgba(16,185,129,0.06)] ring-2 ring-emerald-500/5' 
                        : 'border-emerald-100 shadow-sm hover:border-emerald-200 hover:shadow-md'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
                        <Icon size={20} />
                      </div>
                      <div>
                        <span className="text-[10px] font-black text-emerald-400 uppercase tracking-widest block">Câu hỏi {idx + 1}</span>
                        <h3 className="font-extrabold text-emerald-950 text-sm leading-snug">{q.title}</h3>
                      </div>
                    </div>
                    <p className="text-xs text-emerald-600 font-medium italic">{q.description}</p>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                      {q.options.map((opt, oIdx) => {
                        const isSelected = selections[q.id] === opt.id;
                        return (
                          <motion.button
                            key={opt.id}
                            onClick={() => handleSelect(q.id, opt.id)}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ type: "spring", stiffness: 350, damping: 20, delay: oIdx * 0.05 }}
                            whileHover={{ scale: 1.015, y: -1 }}
                            whileTap={{ scale: 0.985 }}
                            className={`px-4 py-3 border text-left text-xs font-bold leading-relaxed rounded-2xl transition-colors duration-200 flex items-center justify-between group cursor-pointer ${
                              isSelected 
                                ? 'bg-emerald-600 border-emerald-600 text-white shadow-md font-extrabold shadow-emerald-200' 
                                : 'bg-emerald-50/20 border-emerald-100/50 text-emerald-800 hover:bg-emerald-50/55 hover:border-emerald-200'
                            }`}
                          >
                            <span className="pr-2">{opt.text}</span>
                            {isSelected ? (
                              <motion.div
                                initial={{ scale: 0, rotate: -30 }}
                                animate={{ scale: 1, rotate: 0 }}
                                transition={{ type: "spring", stiffness: 500, damping: 15 }}
                              >
                                <CheckCircle2 size={16} className="shrink-0 text-white" />
                              </motion.div>
                            ) : (
                              <div className="w-4 h-4 rounded-full border border-emerald-200 shrink-0 group-hover:border-emerald-400 bg-white group-hover:scale-110 transition-transform" />
                            )}
                          </motion.button>
                        );
                      })}
                    </div>
                  </motion.div>
                );
              })}
            </div>

            {/* Advice Settings */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-12 bg-emerald-50/50 rounded-3xl p-6 border border-emerald-100/50"
            >
              <h3 className="text-emerald-900 font-black uppercase tracking-widest text-[10px] mb-4 flex items-center gap-2">
                <Settings size={14} className="text-emerald-500" />
                Tùy chỉnh lời khuyên của Tui
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <label className="text-[9px] font-black text-emerald-600 uppercase tracking-widest block">Độ dài lời khuyên</label>
                  <div className="flex bg-white p-1 rounded-xl border border-emerald-100 shadow-sm">
                    {(['short', 'medium', 'long'] as AdviceLength[]).map((len) => (
                      <button
                        key={len}
                        onClick={() => setAdviceSettings(prev => ({ ...prev, length: len }))}
                        className={`flex-1 py-2 rounded-lg text-[10px] font-bold transition-all ${
                          adviceSettings.length === len 
                            ? 'bg-emerald-600 text-white shadow-md' 
                            : 'text-emerald-400 hover:text-emerald-600'
                        }`}
                      >
                        {len === 'short' ? 'Ngắn' : len === 'medium' ? 'Vừa' : 'Dài'}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="space-y-3">
                  <label className="text-[9px] font-black text-emerald-600 uppercase tracking-widest block">Giọng điệu tư vấn</label>
                  <div className="flex bg-white p-1 rounded-xl border border-emerald-100 shadow-sm">
                    {(['encouraging', 'strict', 'humorous'] as AdviceTone[]).map((tone) => (
                      <button
                        key={tone}
                        onClick={() => setAdviceSettings(prev => ({ ...prev, tone }))}
                        className={`flex-1 py-2 rounded-lg text-[10px] font-bold transition-all ${
                          adviceSettings.tone === tone 
                            ? 'bg-emerald-600 text-white shadow-md' 
                            : 'text-emerald-400 hover:text-emerald-600'
                        }`}
                      >
                        {tone === 'encouraging' ? 'Khích lệ' : tone === 'strict' ? 'Nghiêm khắc' : 'Phân tích sâu'}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Action Button */}
            <div className="mt-12">
              <button
                onClick={handleCheck}
                disabled={!allSelected}
                className={`w-full py-5 rounded-2xl font-bold text-lg shadow-xl transition-all flex items-center justify-center gap-3 ${
                  allSelected 
                    ? 'bg-emerald-600 text-white hover:bg-emerald-700 active:scale-[0.98] shadow-emerald-200' 
                    : 'bg-emerald-100 text-emerald-300 cursor-not-allowed'
                }`}
              >
                Check trình
                <ArrowRight size={22} />
              </button>
              {!allSelected && (
                <p className="text-center text-emerald-500 font-bold text-sm mt-4 flex items-center justify-center gap-1.5 animate-pulse bg-emerald-50 py-2.5 px-4 rounded-xl border border-emerald-100/60 shadow-sm max-w-md mx-auto">
                  <AlertCircle size={15} />
                  ⚠️ Bạn bắt buộc phải hoàn thành toàn bộ 12 câu hỏi để xem trình độ!
                </p>
              )}
            </div>

            {/* Result Section */}
            <AnimatePresence>
              {result && (
                <motion.div
                  ref={resultRef}
                  initial={{ opacity: 0, y: 40 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 20 }}
                  className="mt-16 bg-white rounded-3xl border border-emerald-100 shadow-2xl overflow-hidden"
                >
                  <div className="bg-emerald-600 p-8 text-center text-white relative overflow-hidden">
                    {/* Background decorative elements */}
                    <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
                      <div className="absolute -top-10 -left-10 w-40 h-40 border-4 border-white rounded-full" />
                      <div className="absolute -bottom-10 -right-10 w-40 h-40 border-4 border-white rounded-full" />
                    </div>
                    
                    <motion.h2 
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.1 }}
                      className="text-emerald-100 font-bold uppercase tracking-[0.2em] text-sm mb-4"
                    >
                      Kết quả của bạn
                    </motion.h2>
                    <motion.div 
                      initial={{ scale: 0.9, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ type: 'spring', damping: 12, delay: 0.2 }}
                      className="text-4xl sm:text-5xl font-black mb-4 tracking-tight"
                    >
                      Trình {result.level}
                    </motion.div>
                    <motion.p 
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.4 }}
                      className="text-emerald-50 text-lg font-medium opacity-90"
                    >
                      {result.description}
                    </motion.p>
                  </div>

                  <div className="p-8 space-y-8">
                    {/* Strengths & Weaknesses */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      <div className="space-y-3">
                        <h4 className="flex items-center gap-2 text-emerald-900 font-bold uppercase tracking-wider text-xs">
                          <Sword size={14} className="text-emerald-500" />
                          Điểm mạnh nổi bật
                        </h4>
                        <div className="space-y-2">
                          {result.strengths.map((s, i) => (
                            <motion.div 
                              key={i} 
                              initial={{ opacity: 0, x: -20 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: 0.3 + i * 0.1 }}
                              whileHover={{ x: 5, backgroundColor: '#ecfdf5' }}
                              className="bg-emerald-50 text-emerald-700 px-4 py-2.5 rounded-xl text-sm font-semibold border border-emerald-100 flex items-center gap-3 shadow-sm transition-colors cursor-default"
                            >
                              <div className="w-6 h-6 bg-emerald-500/10 rounded-lg flex items-center justify-center shrink-0">
                                <CheckCircle2 size={14} className="text-emerald-600" />
                              </div>
                              {s}
                            </motion.div>
                          ))}
                        </div>
                      </div>
                      <div className="space-y-3">
                        <h4 className="flex items-center gap-2 text-emerald-900 font-bold uppercase tracking-wider text-xs">
                          <AlertCircle size={14} className="text-orange-400" />
                          Cần cải thiện
                        </h4>
                        <div className="space-y-2">
                          {result.weaknesses.map((w, i) => (
                            <motion.div 
                              key={i} 
                              initial={{ opacity: 0, x: 20 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: 0.5 + i * 0.1 }}
                              whileHover={{ x: -5, backgroundColor: '#fff7ed' }}
                              className="bg-orange-50 text-orange-700 px-4 py-2.5 rounded-xl text-sm font-semibold border border-orange-100 flex items-center gap-3 shadow-sm transition-colors cursor-default"
                            >
                              <div className="w-6 h-6 bg-orange-400/10 rounded-lg flex items-center justify-center shrink-0">
                                <AlertCircle size={14} className="text-orange-600" />
                              </div>
                              {w}
                            </motion.div>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Advice */}
                    <motion.div 
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.7 }}
                      className="bg-white rounded-3xl p-8 border border-emerald-100 relative shadow-xl shadow-emerald-500/5 group"
                    >
                      <div className="absolute -top-6 -left-2 flex items-center gap-3">
                        <div className="w-14 h-14 bg-emerald-600 rounded-2xl flex items-center justify-center shadow-2xl border-4 border-white rotate-[-6deg] group-hover:rotate-0 transition-transform duration-500">
                          <User size={28} className="text-white" />
                        </div>
                        <div className="bg-emerald-900 text-white px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-[0.2em] border-2 border-white shadow-lg">
                          LỜI KHUYÊN TỪ TUI
                        </div>
                      </div>
                      <div className="mt-6">
                        <p className="text-emerald-900 leading-relaxed font-bold italic text-lg whitespace-pre-wrap">
                          {result.advice.split('**').map((part, i) => 
                            i % 2 === 1 ? <span key={i} className="text-emerald-600 font-black not-italic">{part}</span> : part
                          )}
                        </p>
                        <div className="mt-8 flex items-center gap-2 text-emerald-400">
                          <div className="h-[1px] flex-1 bg-emerald-100" />
                          <span className="text-[10px] font-black uppercase tracking-widest">Kiên trì lên trình</span>
                          <div className="h-[1px] flex-1 bg-emerald-100" />
                        </div>
                      </div>
                    </motion.div>

                    {/* Share Button */}
                    <button
                      onClick={handleShare}
                      className="w-full py-4 bg-emerald-900 text-white rounded-2xl font-bold flex items-center justify-center gap-3 hover:bg-emerald-800 transition-colors shadow-lg active:scale-[0.98]"
                    >
                      <Share2 size={20} />
                      Chia sẻ kết quả
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </>
        )}

        {/* Footer */}
        <footer className="mt-20 text-center pb-8">
          <p className="text-emerald-400 text-xs max-w-xs mx-auto leading-relaxed">
            Kết quả chỉ mang tính tham khảo trong môi trường phong trào/vãng lai.
          </p>
          <div className="mt-4 flex items-center justify-center gap-1 text-emerald-200">
            <div className="w-1 h-1 bg-current rounded-full" />
            <div className="w-1 h-1 bg-current rounded-full" />
            <div className="w-1 h-1 bg-current rounded-full" />
          </div>
        </footer>
      </main>
      <AnimatePresence>
        {showCertificateModal && result && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowCertificateModal(false)}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-emerald-950/90 backdrop-blur-md overflow-y-auto cursor-pointer"
          >
            {/* Background floating elements */}
             <motion.div
              initial={{ scale: 0.9, y: 50, rotate: -1 }}
              animate={{ scale: 1, y: 0, rotate: 0 }}
              exit={{ scale: 0.9, y: 50, rotate: 1 }}
              transition={{ type: "spring", damping: 15, stiffness: 120 }}
              onClick={(e) => e.stopPropagation()}
              className="relative w-full max-w-4xl bg-gradient-to-br from-amber-50 via-amber-100/30 to-orange-50 rounded-[2.5rem] border-8 border-amber-400 p-6 md:p-8 text-center md:text-left shadow-[0_20px_50px_rgba(245,158,11,0.35)] shadow-emerald-950 flex flex-col md:flex-row items-center gap-6 md:gap-8 overflow-hidden aspect-auto md:aspect-[16/9] min-h-[400px] cursor-default"
            >
              {/* Close Button */}
              <button 
                onClick={() => setShowCertificateModal(false)}
                className="absolute top-4 right-4 p-2 bg-amber-200/55 hover:bg-amber-200 text-amber-900 rounded-full transition-all cursor-pointer border border-amber-300 z-10 animate-bounce"
              >
                <X size={18} />
              </button>

              {/* Chibi Photo container - Left Column (Widescreen) / Top (Mobile) */}
              <motion.div 
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="relative mx-auto md:mx-0 w-44 h-44 sm:w-48 sm:h-48 md:w-60 md:h-60 bg-white p-2 md:p-3 rounded-[2rem] border-4 border-amber-300 shadow-xl overflow-hidden shrink-0 group cursor-pointer"
              >
                <img 
                  src={profile.avatar || chibiSelfie} 
                  alt="Chibi Badminton Selfie" 
                  className="w-full h-full object-cover rounded-2xl group-hover:scale-105 transition-transform duration-500"
                  referrerPolicy="no-referrer"
                />
                
                {/* Gold badge ornament on picture */}
                <div className="absolute -bottom-1 -right-1 bg-amber-500 text-white p-2 rounded-tl-2xl rounded-br-2xl text-[9px] font-black border-l-2 border-t-2 border-white">
                  CHAMPION
                </div>
              </motion.div>

              {/* Details container - Right Column */}
              <div className="flex-1 flex flex-col justify-between h-full space-y-4">
                <div>
                  <span className="font-display italic font-black text-amber-700 tracking-wider text-base sm:text-lg block mb-1 font-serif">
                    Chứng nhận vinh danh
                  </span>
                  <h2 className="text-3xl sm:text-4xl font-black text-emerald-950 tracking-tight leading-tight mb-2">
                    BẰNG KHEN THÀNH TÍCH
                  </h2>
                  <div className="h-0.5 w-24 bg-gradient-to-r from-amber-400 to-transparent mx-auto md:mx-0 mb-4" />

                  <div className="space-y-1.5 md:space-y-3">
                    <p className="text-amber-800 text-xs font-bold italic">
                      Trao tặng danh hiệu cao quý cho:
                    </p>
                    <p className="text-[10px] inline-block px-3 py-1 bg-amber-500 text-white rounded-lg font-bold uppercase tracking-wider mb-1">
                      {profile.gender === 'female' ? 'NỮ LÔNG THỦ CHUYÊN NGHIỆP' : 'NAM LÔNG THỦ CHUYÊN NGHIỆP'}
                    </p>
                    <h3 className="text-2xl sm:text-3xl font-black text-emerald-900 tracking-tight uppercase leading-snug">
                      {profile.name}
                    </h3>
                    
                    <div className="flex flex-row items-center justify-center md:justify-start gap-3 flex-wrap">
                      <p className="inline-block px-5 py-2 bg-emerald-600 text-white rounded-2xl font-black text-sm tracking-wide shadow-md shadow-emerald-200">
                        TRÌNH: {result.level}
                      </p>
                    </div>

                    <p className="text-xs text-amber-900/80 max-w-md leading-relaxed pt-2 font-medium">
                      Đã xuất sắc hoàn thành chuỗi đánh giá kỹ thuật toàn diện, sức bền thể lực cơ bản và tư duy chiến thuật thực chiến phong trào từ Badminton Checker!
                    </p>
                  </div>
                </div>

                {/* Footer of card inside */}
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2 border-t border-amber-200/50">
                  <div className="text-left hidden sm:block">
                    <p className="text-[9px] font-mono text-amber-900/60 uppercase">Mã chứng nhận</p>
                    <p className="text-xs font-black text-emerald-950">BC-REF-{Math.floor(1000 + Math.random() * 9000)}</p>
                  </div>
                  
                  {/* Action Buttons */}
                  <div className="flex flex-row gap-3 w-full sm:w-auto">
                    <button
                      onClick={downloadCertificate}
                      className="flex-1 sm:flex-none px-6 py-3 bg-emerald-700 hover:bg-emerald-800 text-white rounded-2xl font-black text-xs sm:text-sm shadow-lg hover:shadow-emerald-200 transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-95"
                    >
                      <Share2 size={16} />
                      Tải Bằng Khen (PNG)
                    </button>
                    <button
                      onClick={() => setShowCertificateModal(false)}
                      className="px-5 py-3 bg-amber-200 hover:bg-amber-300 text-amber-900 rounded-2xl font-black text-xs sm:text-sm transition-all cursor-pointer active:scale-95"
                    >
                      Đóng
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="fixed bottom-8 left-1/2 -translate-x-1/2 z-[100] bg-emerald-900 text-white px-6 py-3 rounded-full shadow-2xl font-medium text-sm flex items-center gap-3 whitespace-nowrap"
          >
            <CheckCircle2 size={18} className="text-emerald-400" />
            {toast}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
