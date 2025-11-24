import React, { useState, useEffect, useRef } from 'react';
import { 
  Menu, X, Upload, FileText, Download, Archive, 
  Plus, Trash2, Calculator, Activity, Atom, FlaskConical, 
  Settings, User, ChevronRight, ChevronLeft, Globe, 
  LayoutGrid, Scissors, Combine, BookOpen, Loader2
} from 'lucide-react';

// --- رابط السيرفر الخلفي (Backend) الموجود على Render ---
const API_BASE_URL = "https://n9xium.onrender.com/api";

// --- التعريفات والأنواع (Types) ---
// ملاحظة: في ملفات .jsx العادية لا نحتاج لتعريفات TypeScript المعقدة، 
// لكن سأبقي الهيكل نظيفاً ليعمل في بيئة Vite القياسية.

const translations = {
  home: { ar: 'الرئيسية', en: 'Home' },
  tools: { ar: 'أدوات N9', en: 'N9 Tools' },
  universityName: { ar: 'الجامعة الإسلامية بمينيسوتا', en: 'Islamic University of Minnesota' },
  dept: { ar: 'قسم تكنولوجيا المعلومات', en: 'Department of Information Technology' },
  deptDesc: { ar: 'يوفر قسم تكنولوجيا المعلومات مجموعة متنوعة من البرامج الدراسية التي تهدف إلى تجهيز الطلاب بالمعرفة والمهارات اللازمة.', en: 'The IT department offers a variety of study programs aimed at equipping students with necessary knowledge and skills.' },
  coursesTitle: { ar: 'المواد التي تدرس في الجامعة:', en: 'Courses Taught:' },
  courses: { ar: 'أساسيات البرمجة، أنظمة الشبكات، تطوير الويب، تصميم قواعد البيانات', en: 'Programming Basics, Network Systems, Web Development, Database Design' },
  majorsTitle: { ar: 'تخصصات الجامعة:', en: 'University Majors:' },
  majors: { ar: 'الذكاء الاصطناعي، تطوير التطبيقات، أمن المعلومات', en: 'Artificial Intelligence, App Development, Information Security' },
  designedBy: { ar: 'من تصميم ناصح محمد زاهر النعمان', en: 'Designed by Nasseh Mohammed Zaher Alnaman' },
  tool_img2pdf: { ar: 'تحويل صور إلى PDF', en: 'Image to PDF' },
  tool_zip: { ar: 'ضغط ملفات Zip', en: 'Compress to Zip' },
  tool_schedule: { ar: 'إنشاء جدول تعليمي', en: 'Create Schedule' },
  tool_merge: { ar: 'دمج ملفات PDF', en: 'Merge PDF' },
  tool_split: { ar: 'تقطيع PDF', en: 'Split PDF' },
  tool_calc: { ar: 'حاسبة علمية', en: 'Scientific Calculator' },
  tool_graph: { ar: 'رسوم بيانية', en: 'Graphing Tool' },
  tool_physics: { ar: 'معادلات الفيزياء', en: 'Physics Equations' },
  tool_chemistry: { ar: 'معادلات الكيمياء', en: 'Chemistry Equations' },
  contact: { ar: 'تواصل معنا', en: 'Contact Us' },
  upload: { ar: 'اضغط لرفع الملفات', en: 'Click to upload files' },
  process: { ar: 'بدء المعالجة', en: 'Start Processing' },
  processing: { ar: 'جاري المعالجة (انتظر قليلاً)...', en: 'Processing (Please wait)...' },
  success: { ar: 'تمت العملية بنجاح!', en: 'Success!' },
  error: { ar: 'حدث خطأ، تأكد من الملفات وحاول مرة أخرى', en: 'Error occurred, check files and try again' },
  download: { ar: 'تحميل الملف الناتج', en: 'Download Result' },
  selectFiles: { ar: 'تم اختيار ملفات:', en: 'Files selected:' },
  founder: { ar: 'ناصح محمد زاهر النعمان', en: 'Nasseh Mohammed Zaher Alnaman' },
  insta: { ar: 'انستقرام: nassehX10', en: 'Instagram: nassehX10' },
  brandOwner: { ar: 'مالك شعار N9', en: 'Owner of N9 Brand' },
  partnership: { ar: 'تأسس الموقع لغرض علمي بشراكة مع جامعة مينيسوتا الإسلامية - أمريكا', en: 'Established for scientific purposes in partnership with IUM - USA' },
  addSubject: { ar: 'إضافة مادة', en: 'Add Subject' },
  subjectName: { ar: 'اسم المادة', en: 'Subject Name' },
  teacherName: { ar: 'اسم المعلم', en: 'Teacher Name' },
  time: { ar: 'التوقيت', en: 'Time' },
  grades: { ar: 'الدرجات', en: 'Grades' },
  solve: { ar: 'حل المعادلة', en: 'Solve Equation' },
  calcResult: { ar: 'النتيجة', en: 'Result' },
};

// --- مكونات مساعدة (Components) ---

const Button = ({ children, onClick, variant = 'primary', className = '', disabled = false }) => {
  const baseStyle = "px-6 py-2 rounded-lg font-bold transition-all duration-300 transform shadow-md flex items-center justify-center gap-2";
  const variants = {
    primary: "bg-blue-600 hover:bg-blue-700 text-white border border-blue-500",
    gold: "bg-gradient-to-r from-yellow-600 to-yellow-400 hover:from-yellow-500 hover:to-yellow-300 text-black border border-yellow-300",
    outline: "bg-transparent border-2 border-current",
  };
  return (
    <button 
      onClick={onClick} 
      disabled={disabled}
      className={`${baseStyle} ${variants[variant]} ${className} ${disabled ? 'opacity-50 cursor-not-allowed scale-100' : 'hover:scale-105 active:scale-95'}`}
    >
      {children}
    </button>
  );
};

const Card = ({ children, title, theme, className = '' }) => {
  const isGold = theme === 'n9';
  return (
    <div className={`p-6 rounded-2xl shadow-xl ${isGold ? 'bg-zinc-900 border border-yellow-600/30 text-yellow-50' : 'bg-white border border-blue-100 text-gray-800'} ${className}`}>
      {title && <h3 className={`text-2xl font-bold mb-4 ${isGold ? 'text-yellow-500' : 'text-blue-600'}`}>{title}</h3>}
      {children}
    </div>
  );
};

// --- التطبيق الرئيسي (Main App) ---

export default function App() {
  const [lang, setLang] = useState('ar');
  const [page, setPage] = useState('home');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  
  // حالة أدوات الملفات
  const [selectedFiles, setSelectedFiles] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [downloadUrl, setDownloadUrl] = useState(null);
  const [statusMsg, setStatusMsg] = useState('');

  // حالة الجدول الدراسي
  const [subjects, setSubjects] = useState([]);
  
  // حالة الآلة الحاسبة
  const [calcInput, setCalcInput] = useState('');
  
  // حالة الرسم البياني
  const canvasRef = useRef(null);
  const [graphEq, setGraphEq] = useState('x * x');

  // حالة حل المعادلات
  const [selectedPhyEq, setSelectedPhyEq] = useState('');
  const [selectedChemEq, setSelectedChemEq] = useState('');
  const [eqInputs, setEqInputs] = useState({});
  const [eqResult, setEqResult] = useState(null);

  const t = (key) => translations[key] ? translations[key][lang] : key;

  // --- دالة الاتصال بالسيرفر (API) ---
  const handleFileProcess = async (endpoint) => {
    if (!selectedFiles || selectedFiles.length === 0) return;

    setIsProcessing(true);
    setStatusMsg('');
    setDownloadUrl(null);

    const formData = new FormData();
    // معالجة خاصة لأداة التقطيع لأن السيرفر يتوقع ملف واحد باسم 'file'
    if (endpoint === 'split-pdf') {
       formData.append('file', selectedFiles[0]);
    } else {
       for (let i = 0; i < selectedFiles.length; i++) {
         formData.append('files', selectedFiles[i]);
       }
    }

    try {
      const response = await fetch(`${API_BASE_URL}/${endpoint}`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) throw new Error('Server Error');

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      setDownloadUrl(url);
      setStatusMsg('success');
    } catch (error) {
      console.error(error);
      setStatusMsg('error');
    } finally {
      setIsProcessing(false);
    }
  };

  // --- دوال المنطق (Logic Functions) ---

  const handleAddSubject = (e) => {
    e.preventDefault();
    if (subjects.length >= 10) return alert(lang === 'ar' ? 'الحد الأقصى 10 مواد' : 'Max 10 subjects');
    const form = e.target;
    const formData = new FormData(form);
    
    const newSubject = {
      id: Date.now(),
      name: formData.get('name'),
      teacher: formData.get('teacher'),
      time: formData.get('time'),
      participation: Number(formData.get('participation')),
      attendance: Number(formData.get('attendance')),
      homework: Number(formData.get('homework')),
      midterm: Number(formData.get('midterm')),
      final: Number(formData.get('final')),
    };
    setSubjects([...subjects, newSubject]);
    form.reset();
  };

  const drawGraph = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;
    ctx.clearRect(0, 0, width, height);

    ctx.strokeStyle = '#666';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(0, height / 2); ctx.lineTo(width, height / 2);
    ctx.moveTo(width / 2, 0); ctx.lineTo(width / 2, height);
    ctx.stroke();

    ctx.strokeStyle = '#EAB308';
    ctx.lineWidth = 2;
    ctx.beginPath();
    
    for (let px = 0; px < width; px++) {
      const x = (px - width / 2) / 20;
      try {
        let y = 0;
        if (graphEq.includes('sin')) y = Math.sin(x);
        else if (graphEq.includes('cos')) y = Math.cos(x);
        else if (graphEq.includes('tan')) y = Math.tan(x);
        else y = eval(graphEq.replace(/x/g, `(${x})`)); 
        const py = height / 2 - y * 20;
        if (px === 0) ctx.moveTo(px, py); else ctx.lineTo(px, py);
      } catch (e) {}
    }
    ctx.stroke();
  };

  // --- واجهات المستخدم (UI Sections) ---

  const renderHome = () => (
    <div className="animate-fade-in pb-20">
      <div className="bg-blue-600 text-white p-8 rounded-b-3xl shadow-lg relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>
        <div className="relative z-10 text-center">
          <div className="flex justify-center mb-4">
             <div className="w-24 h-24 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm border-2 border-white/50">
                <BookOpen size={48} className="text-white" />
             </div>
          </div>
          <h1 className="text-3xl md:text-5xl font-bold mb-2 font-kufi">{t('universityName')}</h1>
          <p className="text-xl opacity-90">{t('partnership')}</p>
        </div>
      </div>
      <div className="container mx-auto px-4 mt-8 space-y-6">
        <Card title={t('dept')} theme="uni">
          <p className="text-lg leading-relaxed text-gray-700">{t('deptDesc')}</p>
        </Card>
        <div className="grid md:grid-cols-2 gap-6">
          <Card title={t('coursesTitle')} theme="uni" className="bg-blue-50 border-blue-200">
             <ul className="list-disc list-inside space-y-2 text-gray-800">
               {t('courses').split('،').map((c, i) => <li key={i}>{c}</li>)}
               {lang === 'en' && t('courses').split(',').map((c, i) => <li key={i+10}>{c}</li>)}
             </ul>
          </Card>
          <Card title={t('majorsTitle')} theme="uni" className="bg-cyan-50 border-cyan-200">
             <ul className="list-disc list-inside space-y-2 text-gray-800">
               {t('majors').split('،').map((c, i) => <li key={i}>{c}</li>)}
               {lang === 'en' && t('majors').split(',').map((c, i) => <li key={i+10}>{c}</li>)}
             </ul>
          </Card>
        </div>
      </div>
      <div className="fixed bottom-0 left-0 w-full bg-slate-900 text-white p-4 text-center z-40 border-t-4 border-blue-500">
        <div className="flex flex-col items-center justify-center">
          <p className="font-bold text-sm md:text-base">{t('designedBy')}</p>
          <span className="text-xs text-blue-300 font-mono mt-1">Nasseh X IUM</span>
        </div>
      </div>
    </div>
  );

  const renderToolsLayout = (children, title) => (
    <div className="min-h-screen bg-zinc-950 text-yellow-50 pb-12">
      <div className="bg-zinc-900 p-6 shadow-2xl border-b border-yellow-600/30 flex justify-between items-center sticky top-0 z-50">
        <h2 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-yellow-600 flex items-center gap-2">
           <img src="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAxMDAgMTAwIiBmaWxsPSJub25lIiBzdHJva2U9IiNGNTkwMEEiIHN0cm9rZS13aWR0aD0iMiI+PHRleHQgeD0iNTAiIHk9IjcwIiBmb250LXNpemU9IjYwIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmaWxsPSIjRTVCMzA4Ij5OOTwvdGV4dD48L3N2Zz4=" className="w-10 h-10" alt="N9" />
           {title}
        </h2>
        <Button variant="outline" className="text-yellow-500 border-yellow-600 hover:bg-yellow-900/20" onClick={() => {setPage('home'); setSelectedFiles(null); setDownloadUrl(null);}}>
          {lang === 'ar' ? 'عودة للجامعة' : 'Back to Uni'}
        </Button>
      </div>
      <div className="container mx-auto p-4 md:p-8 animate-fade-in-up">
        {children}
      </div>
    </div>
  );

  const renderFileTool = (endpoint, title, icon, accept) => {
    const Icon = icon;
    return renderToolsLayout(
      <div className="flex flex-col items-center justify-center min-h-[50vh] space-y-8">
        <div className={`w-32 h-32 rounded-full bg-zinc-800 border-2 border-dashed ${isProcessing ? 'border-blue-500 animate-spin-slow' : 'border-yellow-600'} flex items-center justify-center transition-all`}>
          {isProcessing ? <Loader2 size={64} className="text-blue-500 animate-spin" /> : <Icon size={64} className="text-yellow-500" />}
        </div>
        
        <div className="text-center space-y-4 w-full max-w-md">
          <h3 className="text-3xl font-light">{title}</h3>
          
          {!downloadUrl && !isProcessing && (
            <>
              <p className="text-gray-400">{t('upload')}</p>
              <label className="cursor-pointer bg-zinc-800 hover:bg-zinc-700 text-yellow-500 px-8 py-4 rounded-xl border border-yellow-600 transition-all flex items-center justify-center gap-3 shadow-[0_0_15px_rgba(234,179,8,0.2)]">
                <Upload />
                <span>{selectedFiles ? `${t('selectFiles')} ${selectedFiles.length}` : (lang === 'ar' ? 'اختيار الملفات' : 'Select Files')}</span>
                <input 
                  type="file" 
                  multiple 
                  accept={accept} 
                  className="hidden" 
                  onChange={(e) => setSelectedFiles(e.target.files)} 
                />
              </label>
              {selectedFiles && (
                <Button variant="gold" className="w-full text-lg font-bold" onClick={() => handleFileProcess(endpoint)}>
                  {t('process')}
                </Button>
              )}
            </>
          )}

          {isProcessing && <p className="text-xl text-blue-400 animate-pulse">{t('processing')}</p>}

          {statusMsg === 'error' && <p className="text-red-500 font-bold">{t('error')}</p>}

          {downloadUrl && (
            <div className="animate-fade-in space-y-4">
              <p className="text-green-400 font-bold text-xl">{t('success')}</p>
              <a href={downloadUrl} download="N9-Result" className="block w-full">
                <Button variant="gold" className="w-full bg-green-600 border-green-500 hover:bg-green-500 text-white">
                  <Download /> {t('download')}
                </Button>
              </a>
              <button onClick={() => { setDownloadUrl(null); setSelectedFiles(null); }} className="text-gray-500 underline text-sm mt-4">
                {lang === 'ar' ? 'معالجة ملف آخر' : 'Process another file'}
              </button>
            </div>
          )}
        </div>
      </div>
    , title);
  };

  const renderSchedule = () => renderToolsLayout(
    <div className="space-y-8">
      <Card theme="n9" title={t('addSubject')}>
        <form onSubmit={handleAddSubject} className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <input required name="name" placeholder={t('subjectName')} className="bg-zinc-800 border-zinc-700 text-white rounded p-2 focus:border-yellow-500 outline-none" />
          <input required name="teacher" placeholder={t('teacherName')} className="bg-zinc-800 border-zinc-700 text-white rounded p-2 focus:border-yellow-500 outline-none" />
          <input required name="time" type="time" className="bg-zinc-800 border-zinc-700 text-white rounded p-2 focus:border-yellow-500 outline-none" />
          <div className="md:col-span-4 grid grid-cols-2 md:grid-cols-5 gap-2 text-sm">
            <input name="participation" type="number" placeholder="مشاركة (10)" className="bg-zinc-800 border-zinc-700 text-white rounded p-2" />
            <input name="attendance" type="number" placeholder="حضور (10)" className="bg-zinc-800 border-zinc-700 text-white rounded p-2" />
            <input name="homework" type="number" placeholder="واجبات (20)" className="bg-zinc-800 border-zinc-700 text-white rounded p-2" />
            <input name="midterm" type="number" placeholder="نصفي (20)" className="bg-zinc-800 border-zinc-700 text-white rounded p-2" />
            <input name="final" type="number" placeholder="نهائي (40)" className="bg-zinc-800 border-zinc-700 text-white rounded p-2" />
          </div>
          <Button variant="gold" className="md:col-span-4 mt-2">{t('addSubject')}</Button>
        </form>
      </Card>
      <div className="overflow-x-auto rounded-xl border border-zinc-700">
        <table className="w-full text-right bg-zinc-900">
          <thead className="bg-zinc-800 text-yellow-500">
            <tr>
              <th className="p-3">{t('subjectName')}</th>
              <th className="p-3">{t('teacherName')}</th>
              <th className="p-3">{t('time')}</th>
              <th className="p-3">{t('grades')} (100)</th>
              <th className="p-3"></th>
            </tr>
          </thead>
          <tbody>
            {subjects.map((s) => {
              const total = s.participation + s.attendance + s.homework + s.midterm + s.final;
              return (
                <tr key={s.id} className="border-t border-zinc-800 hover:bg-zinc-800/50 text-white">
                  <td className="p-3 font-bold">{s.name}</td>
                  <td className="p-3 text-gray-400">{s.teacher}</td>
                  <td className="p-3 font-mono text-yellow-200">{s.time}</td>
                  <td className="p-3 font-bold"><span className={`${total >= 50 ? 'text-green-400' : 'text-red-400'}`}>{total}</span></td>
                  <td className="p-3 text-left"><button onClick={() => setSubjects(subjects.filter(sub => sub.id !== s.id))} className="text-red-500 hover:text-red-400"><Trash2 size={18} /></button></td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>, t('tool_schedule')
  );

  const renderCalculator = () => {
    const btns = ['7','8','9','/', '4','5','6','*', '1','2','3','-', 'C','0','=','+'];
    return renderToolsLayout(
      <div className="max-w-md mx-auto">
        <div className="bg-black p-6 rounded-3xl border-2 border-yellow-600/50 shadow-[0_0_30px_rgba(234,179,8,0.1)]">
          <div className="bg-zinc-900 h-24 rounded-xl mb-6 flex items-end justify-end p-4 text-4xl font-mono text-yellow-400 overflow-x-auto">
            {calcInput || '0'}
          </div>
          <div className="grid grid-cols-4 gap-4">
            {btns.map(b => (
              <button 
                key={b} 
                onClick={() => {
                   if (b === 'C') setCalcInput('');
                   else if (b === '=') { try { setCalcInput(eval(calcInput).toString()); } catch { setCalcInput('Error'); } }
                   else setCalcInput(prev => prev + b);
                }}
                className={`p-4 rounded-xl text-xl font-bold transition-all ${b === '=' ? 'bg-yellow-600 text-black col-span-2' : b === 'C' ? 'bg-red-900 text-red-200' : 'bg-zinc-800 text-white hover:bg-zinc-700'}`}
              >
                {b}
              </button>
            ))}
            {['sin','cos','tan','sqrt','log','(',')','^'].map(fn => (
               <button key={fn} onClick={() => setCalcInput(prev => prev + (fn === '^' ? '**' : fn === 'sqrt' ? 'Math.sqrt(' : `Math.${fn}(`))} className="p-3 bg-zinc-900 text-yellow-600 text-sm font-bold rounded-lg hover:bg-zinc-800">{fn}</button>
            ))}
          </div>
        </div>
      </div>, t('tool_calc')
    );
  };

  const renderGraph = () => renderToolsLayout(
      <div className="flex flex-col items-center gap-6">
        <div className="w-full max-w-2xl bg-zinc-900 p-4 rounded-xl border border-zinc-700">
           <div className="flex gap-2 mb-4">
             <span className="text-yellow-500 font-bold p-2">y = </span>
             <input value={graphEq} onChange={(e) => setGraphEq(e.target.value)} className="flex-1 bg-black text-white p-2 rounded border border-zinc-700 focus:border-yellow-500 outline-none font-mono" placeholder="Example: x * x" />
             <Button variant="gold" onClick={drawGraph}>{lang === 'ar' ? 'ارسم' : 'Draw'}</Button>
           </div>
           <canvas ref={canvasRef} width={600} height={400} className="w-full bg-black rounded border border-zinc-800 cursor-crosshair"></canvas>
        </div>
      </div>, t('tool_graph')
  );

  const equations = {
    physics: [
      { id: 'newton2', name: 'Newton\'s 2nd Law (F=ma)', inputs: ['m (kg)', 'a (m/s²)'], func: (v) => v[0] * v[1] },
      { id: 'velocity', name: 'Velocity (v=d/t)', inputs: ['d (m)', 't (s)'], func: (v) => v[0] / v[1] },
      { id: 'ke', name: 'Kinetic Energy (K=0.5mv²)', inputs: ['m (kg)', 'v (m/s)'], func: (v) => 0.5 * v[0] * v[1] * v[1] },
      { id: 'ohm', name: 'Ohm\'s Law (V=IR)', inputs: ['I (A)', 'R (Ω)'], func: (v) => v[0] * v[1] },
      { id: 'power', name: 'Power (P=W/t)', inputs: ['W (J)', 't (s)'], func: (v) => v[0] / v[1] },
    ],
    chemistry: [
      { id: 'density', name: 'Density (D=m/v)', inputs: ['m (g)', 'v (mL)'], func: (v) => v[0] / v[1] },
      { id: 'moles', name: 'Moles (n=m/M)', inputs: ['mass (g)', 'Molar Mass (g/mol)'], func: (v) => v[0] / v[1] },
      { id: 'molarity', name: 'Molarity (M=n/V)', inputs: ['moles (n)', 'Volume (L)'], func: (v) => v[0] / v[1] },
      { id: 'ideal_gas', name: 'Ideal Gas (P=nRT/V)', inputs: ['n (mol)', 'T (K)', 'V (L)'], func: (v) => (v[0] * 0.0821 * v[1]) / v[2] },
      { id: 'ph', name: 'pH Calculation (-log[H+])', inputs: ['[H+]'], func: (v) => -Math.log10(v[0]) },
    ]
  };

  const renderSolver = (type) => {
    const list = equations[type];
    const selectedId = type === 'physics' ? selectedPhyEq : selectedChemEq;
    const currentEq = list.find(e => e.id === selectedId);
    return renderToolsLayout(
      <div className="max-w-3xl mx-auto space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2 h-96 overflow-y-auto pr-2 custom-scrollbar">
            {list.map((eq, i) => (
              <button
                key={eq.id}
                onClick={() => { type === 'physics' ? setSelectedPhyEq(eq.id) : setSelectedChemEq(eq.id); setEqResult(null); setEqInputs({}); }}
                className={`w-full text-left p-4 rounded-lg border transition-all ${selectedId === eq.id ? 'bg-yellow-600 text-black border-yellow-400 font-bold' : 'bg-zinc-800 border-zinc-700 hover:border-yellow-600 text-gray-300'}`}
              >
                {i + 1}. {eq.name}
              </button>
            ))}
          </div>
          <div className="bg-zinc-900 p-6 rounded-xl border border-zinc-700 flex flex-col justify-center">
             {currentEq ? (
               <div className="space-y-6 animate-fade-in">
                 <h3 className="text-xl font-bold text-yellow-500">{currentEq.name}</h3>
                 <div className="space-y-4">
                   {currentEq.inputs.map(input => (
                     <div key={input}>
                       <label className="text-sm text-gray-400 block mb-1">{input}</label>
                       <input type="number" onChange={(e) => setEqInputs({...eqInputs, [input]: parseFloat(e.target.value)})} className="w-full bg-black border border-zinc-600 p-3 rounded text-white focus:border-yellow-500 outline-none" />
                     </div>
                   ))}
                 </div>
                 <Button variant="gold" className="w-full" onClick={() => currentEq && setEqResult(currentEq.func(currentEq.inputs.map(l => eqInputs[l] || 0)))}>{t('solve')}</Button>
                 {eqResult !== null && (
                   <div className="mt-4 p-4 bg-green-900/30 border border-green-500 rounded text-center">
                     <span className="text-gray-300">{t('calcResult')}: </span>
                     <span className="text-2xl font-bold text-green-400">{eqResult.toFixed(4)}</span>
                   </div>
                 )}
               </div>
             ) : <div className="text-center text-gray-500">{lang === 'ar' ? 'اختر معادلة من القائمة' : 'Select an equation from list'}</div>}
          </div>
        </div>
      </div>, type === 'physics' ? t('tool_physics') : t('tool_chemistry')
    );
  };

  const renderContact = () => renderToolsLayout(
    <div className="max-w-2xl mx-auto text-center space-y-10 py-10">
      <div className="relative inline-block">
        <div className="absolute inset-0 bg-yellow-500 blur-3xl opacity-20"></div>
        <img src="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAxMDAgMTAwIiBmaWxsPSJub25lIiBzdHJva2U9IiNGNTkwMEEiIHN0cm9rZS13aWR0aD0iMiI+PHRleHQgeD0iNTAiIHk9IjcwIiBmb250LXNpemU9IjYwIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmaWxsPSIjRTVCMzA4Ij5OOTwvdGV4dD48L3N2Zz4=" className="w-40 h-40 mx-auto relative z-10" alt="N9 Logo" />
      </div>
      <div className="space-y-4">
        <h2 className="text-4xl font-bold text-white font-kufi">{t('founder')}</h2>
        <p className="text-xl text-yellow-500">{t('brandOwner')}</p>
        <div className="flex items-center justify-center gap-2 text-gray-400 hover:text-white transition-colors cursor-pointer">
           <User size={20} /><span>{t('insta')}</span>
        </div>
      </div>
      <div className="border-t border-zinc-800 pt-8 mt-8">
        <p className="text-gray-500 text-sm leading-relaxed max-w-lg mx-auto">{t('partnership')}</p>
      </div>
    </div>, t('contact')
  );

  const toolsList = [
    { id: 'img2pdf', icon: FileText, label: t('tool_img2pdf') },
    { id: 'zip', icon: Archive, label: t('tool_zip') },
    { id: 'schedule', icon: LayoutGrid, label: t('tool_schedule') },
    { id: 'mergePdf', icon: Combine, label: t('tool_merge') },
    { id: 'splitPdf', icon: Scissors, label: t('tool_split') },
    { id: 'calculator', icon: Calculator, label: t('tool_calc') },
    { id: 'graph', icon: Activity, label: t('tool_graph') },
    { id: 'physics', icon: Atom, label: t('tool_physics') },
    { id: 'chemistry', icon: FlaskConical, label: t('tool_chemistry') },
    { id: 'contact', icon: User, label: t('contact') },
  ];

  return (
    <div className={`min-h-screen transition-colors duration-500 font-sans ${lang === 'ar' ? 'font-kufi' : ''}`} dir={lang === 'ar' ? 'rtl' : 'ltr'}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Noto+Kufi+Arabic:wght@300;500;700&display=swap');
        .font-kufi { font-family: 'Noto Kufi Arabic', sans-serif; }
        .custom-scrollbar::-webkit-scrollbar { width: 6px; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #444; border-radius: 4px; }
        @keyframes fade-in { from { opacity: 0; } to { opacity: 1; } }
        .animate-fade-in { animation: fade-in 0.5s ease-out; }
      `}</style>

      {page === 'home' && (
        <nav className="bg-white shadow-md p-4 flex justify-between items-center sticky top-0 z-50">
          <div className="flex items-center gap-3">
             <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold">IUM</div>
             <span className="font-bold text-gray-800 hidden md:block">{t('universityName')}</span>
          </div>
          <div className="flex items-center gap-3">
            <button onClick={() => setLang(prev => prev === 'ar' ? 'en' : 'ar')} className="flex items-center gap-2 px-3 py-1 rounded bg-gray-100 hover:bg-gray-200 text-gray-700">
              <Globe size={16} /> {lang === 'en' ? 'Arabic' : 'English'}
            </button>
            <button onClick={() => setIsMenuOpen(true)} className="bg-black text-yellow-500 px-4 py-2 rounded-lg font-bold flex items-center gap-2 hover:bg-gray-900 transition-all shadow-lg border border-yellow-600/50">
              <span>N9</span><Menu size={20} />
            </button>
          </div>
        </nav>
      )}

      {isMenuOpen && (
        <div className="fixed inset-0 z-[60] flex justify-end">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setIsMenuOpen(false)}></div>
          <div className={`w-80 bg-zinc-950 h-full shadow-2xl border-l border-yellow-600/30 overflow-y-auto transform transition-transform duration-300 p-6 ${lang === 'ar' ? 'border-r border-l-0' : ''}`}>
            <div className="flex justify-between items-center mb-8 border-b border-zinc-800 pb-4">
              <h2 className="text-2xl font-bold text-yellow-500 flex items-center gap-2"><Settings className="animate-spin-slow" /> {t('tools')}</h2>
              <button onClick={() => setIsMenuOpen(false)} className="text-gray-400 hover:text-white"><X /></button>
            </div>
            <div className="space-y-2">
              {toolsList.map((tool) => (
                <button key={tool.id} onClick={() => { setPage(tool.id); setIsMenuOpen(false); setSelectedFiles(null); setDownloadUrl(null); }} className="w-full flex items-center gap-4 p-3 rounded-xl hover:bg-zinc-800 text-gray-300 hover:text-yellow-400 transition-all group">
                  <div className="p-2 bg-zinc-900 rounded-lg group-hover:bg-black border border-zinc-800 group-hover:border-yellow-600/50"><tool.icon size={20} /></div>
                  <span className="font-medium">{tool.label}</span>
                  {lang === 'ar' ? <ChevronLeft className="mr-auto opacity-0 group-hover:opacity-100" size={16}/> : <ChevronRight className="ml-auto opacity-0 group-hover:opacity-100" size={16}/>}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      <main>
        {page === 'home' && renderHome()}
        {page === 'img2pdf' && renderFileTool('img-to-pdf', t('tool_img2pdf'), FileText, 'image/*')}
        {page === 'zip' && renderFileTool('create-zip', t('tool_zip'), Archive, '*/*')}
        {page === 'mergePdf' && renderFileTool('merge-pdf', t('tool_merge'), Combine, '.pdf')}
        {page === 'splitPdf' && renderFileTool('split-pdf', t('tool_split'), Scissors, '.pdf')}
        {page === 'schedule' && renderSchedule()}
        {page === 'calculator' && renderCalculator()}
        {page === 'graph' && renderGraph()}
        {page === 'physics' && renderSolver('physics')}
        {page === 'chemistry' && renderSolver('chemistry')}
        {page === 'contact' && renderContact()}
      </main>
    </div>
  );
}
