
import React, { useState } from 'react';
import { CabinetSpecs, DesignResult, AppStatus } from './types';
import { generateCabinetDesign } from './services/geminiService';

const STYLES = ['مدرن', 'کلاسیک', 'نئوکلاسیک', 'مینیمال', 'ایرانی', 'لوکس'];
const MATERIALS = ['MDF', 'هایگلاس', 'ممبران', 'چوب طبیعی', 'پولیشی'];
const HANDLES = ['مخفی', 'شاخه‌ای', 'کلاسیک', 'بدون دستگیره (مگنتی)'];

const App: React.FC = () => {
  const [image, setImage] = useState<string | null>(null);
  const [specs, setSpecs] = useState<CabinetSpecs>({
    style: 'مدرن',
    color: '',
    material: 'MDF',
    handleType: 'مخفی',
    hasIsland: false,
    cabinetType: 'معمولی',
    extraNotes: '',
  });
  const [status, setStatus] = useState<AppStatus>(AppStatus.IDLE);
  const [result, setResult] = useState<DesignResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!image) {
      alert('لطفاً ابتدا تصویر آشپزخانه را آپلود کنید.');
      return;
    }

    try {
      setStatus(AppStatus.LOADING_IMAGE);
      setError(null);
      const res = await generateCabinetDesign(image, specs);
      setResult(res);
      setStatus(AppStatus.SUCCESS);
    } catch (err) {
      console.error(err);
      setError('خطایی در ارتباط با هوش مصنوعی رخ داد. لطفاً دوباره تلاش کنید.');
      setStatus(AppStatus.ERROR);
    }
  };

  return (
    <div className="min-h-screen pb-12 bg-slate-50">
      <header className="bg-white shadow-sm py-4 px-4 mb-8 sticky top-0 z-50 border-b border-slate-200">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="bg-blue-600 p-2 rounded-lg shadow-blue-200 shadow-lg">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
            </div>
            <h1 className="text-xl font-bold text-slate-800">طراح هوشمند کابینت</h1>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          <section className="lg:col-span-5 space-y-6 print:hidden">
            <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-200">
              <h2 className="text-lg font-bold mb-5 flex items-center gap-2 text-slate-800">
                <span className="bg-blue-600 text-white w-6 h-6 rounded-full flex items-center justify-center text-xs shadow-md shadow-blue-100">۱</span>
                آپلود تصویر آشپزخانه
              </h2>
              <div className="relative group border-2 border-dashed border-slate-200 rounded-2xl overflow-hidden hover:border-blue-400 transition-all bg-slate-50/50">
                {image ? (
                  <div className="relative group">
                    <img src={image} alt="Original Kitchen" className="w-full aspect-video object-cover" />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <button onClick={() => setImage(null)} className="bg-white text-red-600 px-4 py-2 rounded-full font-bold text-sm shadow-xl">تغییر عکس</button>
                    </div>
                  </div>
                ) : (
                  <label className="flex flex-col items-center justify-center py-16 cursor-pointer">
                    <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                      <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                    </div>
                    <span className="text-slate-700 font-bold">انتخاب تصویر واقعی</span>
                    <input type="file" className="hidden" accept="image/*" onChange={handleImageUpload} />
                  </label>
                )}
              </div>
            </div>

            <form onSubmit={handleSubmit} className="bg-white p-6 rounded-3xl shadow-sm border border-slate-200 space-y-5">
              <h2 className="text-lg font-bold mb-2 flex items-center gap-2 text-slate-800">
                <span className="bg-blue-600 text-white w-6 h-6 rounded-full flex items-center justify-center text-xs shadow-md shadow-blue-100">۲</span>
                تنظیمات طراحی
              </h2>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide">سبک</label>
                  <select value={specs.style} onChange={(e) => setSpecs({...specs, style: e.target.value})} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-sm outline-none">
                    {STYLES.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide">متریال</label>
                  <select value={specs.material} onChange={(e) => setSpecs({...specs, material: e.target.value})} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-sm outline-none">
                    {MATERIALS.map(m => <option key={m} value={m}>{m}</option>)}
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 mb-1.5 uppercase">رنگ‌بندی</label>
                <input type="text" placeholder="مثال: سفید هایگلاس" value={specs.color} onChange={(e) => setSpecs({...specs, color: e.target.value})} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm outline-none" />
              </div>
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-slate-500 mb-1.5 uppercase tracking-wide">توضیحات تکمیلی</label>
                <textarea rows={3} placeholder="اندازه‌ها و محدودیت‌ها..." value={specs.extraNotes} onChange={(e) => setSpecs({...specs, extraNotes: e.target.value})} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm outline-none resize-none" />
              </div>
              <button type="submit" disabled={status === AppStatus.LOADING_IMAGE} className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white font-bold py-4 px-4 rounded-2xl transition-all shadow-xl flex items-center justify-center gap-3">
                {status === AppStatus.LOADING_IMAGE ? (
                  <svg className="animate-spin h-5 w-5 text-white" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                ) : 'شروع طراحی و آنالیز'}
              </button>
            </form>
          </section>

          <section className="lg:col-span-7 space-y-6">
            <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-200 min-h-[600px] flex flex-col print:border-none print:shadow-none print:p-0">
              <h2 className="text-lg font-bold mb-6 flex items-center gap-2 text-slate-800 print:hidden">
                <span className="bg-emerald-600 text-white w-6 h-6 rounded-full flex items-center justify-center text-xs shadow-md shadow-emerald-100">۳</span>
                خروجی نهایی و نقشه اجرایی
              </h2>

              {!result && status === AppStatus.IDLE && (
                <div className="flex-1 flex flex-col items-center justify-center text-slate-400 space-y-6">
                  <div className="w-32 h-32 bg-slate-50 rounded-full flex items-center justify-center border border-slate-100">
                    <svg className="w-16 h-16 text-slate-200" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" /></svg>
                  </div>
                  <p className="text-center">اطلاعات را وارد کنید تا طرح آماده شود.</p>
                </div>
              )}

              {result && (
                <div className="space-y-8 animate-in fade-in duration-700">
                  <div className="rounded-2xl overflow-hidden shadow-xl shadow-slate-200 bg-slate-900 border border-slate-200 print:hidden">
                    <div className="p-4 flex justify-between items-center bg-white border-b border-slate-100">
                      <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">رندر اختصاصی پروژه</p>
                    </div>
                    <img src={result.imageUrl} alt="Result" className="w-full aspect-video object-cover" />
                  </div>

                  <div className="space-y-4">
                    <h3 className="text-lg font-bold text-slate-800 border-r-4 border-blue-600 pr-3">توضیحات فنی پروژه</h3>
                    <div className="p-5 bg-white rounded-2xl border border-slate-100 text-sm leading-relaxed text-slate-700 whitespace-pre-wrap shadow-sm">
                      {result.technicalDescription}
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h3 className="text-lg font-bold text-slate-800 border-r-4 border-emerald-600 pr-3">جدول لیست برش (Cut List)</h3>
                    <div className="overflow-x-auto rounded-2xl border border-slate-200 shadow-sm">
                      <table className="w-full text-sm text-right">
                        <thead className="bg-slate-800 text-white text-xs uppercase">
                          <tr>
                            <th className="px-4 py-3 font-bold border-l border-slate-700">ردیف</th>
                            <th className="px-4 py-3 font-bold border-l border-slate-700">نام قطعه</th>
                            <th className="px-4 py-3 font-bold border-l border-slate-700">طول (cm)</th>
                            <th className="px-4 py-3 font-bold border-l border-slate-700">عرض (cm)</th>
                            <th className="px-4 py-3 font-bold border-l border-slate-700">تعداد</th>
                            <th className="px-4 py-3 font-bold">PVC</th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-slate-100">
                          {result.cutList.map((item, idx) => (
                            <tr key={idx} className="hover:bg-slate-50 transition-colors">
                              <td className="px-4 py-3 border-l border-slate-100 text-slate-400 font-mono text-center">{item.row}</td>
                              <td className="px-4 py-3 border-l border-slate-100 font-bold text-slate-800">{item.partName}</td>
                              <td className="px-4 py-3 border-l border-slate-100 text-center">{item.length}</td>
                              <td className="px-4 py-3 border-l border-slate-100 text-center">{item.width}</td>
                              <td className="px-4 py-3 border-l border-slate-100 text-center font-bold text-blue-600">{item.count}</td>
                              <td className="px-4 py-3 text-slate-500 text-xs">{item.pvc}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  <button onClick={() => window.print()} className="w-full bg-slate-800 hover:bg-slate-900 text-white font-bold py-4 px-8 rounded-2xl transition-all shadow-lg flex items-center justify-center gap-3 text-sm print:hidden">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" /></svg>
                    چاپ نهایی نقشه و لیست برش
                  </button>
                </div>
              )}
            </div>
          </section>
        </div>
      </main>

      <footer className="mt-16 text-center text-slate-500 text-xs px-4 pb-12 print:hidden">
        <div className="h-px bg-slate-200 max-w-2xl mx-auto mb-6"></div>
        <p className="font-bold text-slate-700">سامانه هوشمند طراحی کابینت ایران</p>
        <p className="mt-1 opacity-70 italic">ابعاد جدول فوق طبق استانداردهای نجاران ایرانی و توضیحات کاربر استخراج شده است.</p>
      </footer>
    </div>
  );
};

export default App;
