const fs = require('fs');
let code = fs.readFileSync('src/components/ReportView.tsx', 'utf8');

code = code.replace(
  "import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer } from 'recharts';",
  "import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, Tooltip as RechartsTooltip } from 'recharts';"
);

code = code.replace(
  "import { BookOpen, AlertTriangle, CheckCircle, ChevronDown, ChevronUp, Loader2, Info, BrainCircuit, Activity, HeartPulse, Zap, XCircle, Sparkles, Target, Clock, ArrowRight, Download, RotateCcw } from 'lucide-react';",
  "import { BookOpen, AlertTriangle, CheckCircle, ChevronDown, ChevronUp, Loader2, Info, BrainCircuit, Activity, HeartPulse, Zap, XCircle, Sparkles, Target, Clock, ArrowRight, Download, RotateCcw, ChevronRight, Search } from 'lucide-react';"
);

fs.writeFileSync('src/components/ReportView.tsx', code);
