const fs = require('fs');
let code = fs.readFileSync('src/components/ReportView.tsx', 'utf8');

code = code.replace(
  "import { FileText, Download, BookOpen, ListTodo, RotateCcw, AlertTriangle, CheckCircle, XCircle, Info, ChevronDown, ChevronUp, Loader2, Sparkles, UserCheck, Clock, BrainCircuit, ShieldAlert, TrendingUp } from 'lucide-react';",
  "import { FileText, Download, BookOpen, ListTodo, RotateCcw, AlertTriangle, CheckCircle, XCircle, Info, ChevronDown, ChevronUp, Loader2, Sparkles, UserCheck, Clock, BrainCircuit, ShieldAlert, TrendingUp, ChevronRight, Search } from 'lucide-react';"
);

fs.writeFileSync('src/components/ReportView.tsx', code);
