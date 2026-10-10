"use client";
import React, { useState } from 'react';
import { 
  ListChecks, Plus, FileText, Edit, Trash2, 
  Printer, Share2, UserCheck, Droplets, Utensils, 
  Sparkles, CheckCircle2, ArrowRight, X, Save, Stethoscope 
} from 'lucide-react';
import { useClinic, DietTemplate, Patient } from '@/context/ClinicContext';
import PrescriptionDietPdfModal from '@/components/PrescriptionDietPdfModal';

export default function DietTemplatesPage() {
  const { 
    dietTemplates: templates, 
    addDietTemplate, 
    updateDietTemplate, 
    deleteDietTemplate,
    patients,
    assignDietToPatient
  } = useClinic();

  const [editingId, setEditingId] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // Assign to Patient Modal
  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);
  const [selectedTemplateForAssign, setSelectedTemplateForAssign] = useState<DietTemplate | null>(null);
  const [selectedPatientId, setSelectedPatientId] = useState<string>('');
  const [customDoctorNotes, setCustomDoctorNotes] = useState<string>('');
  const [assignSuccessMsg, setAssignSuccessMsg] = useState<string>('');

  // PDF Preview & Print Modal
  const [isPdfModalOpen, setIsPdfModalOpen] = useState(false);
  const [selectedTemplateForPdf, setSelectedTemplateForPdf] = useState<DietTemplate | null>(null);

  const [formData, setFormData] = useState<Partial<DietTemplate>>({
    name: '',
    description: '',
    instructions: '',
    type: 'loss',
    waterTarget: 3.5,
    targetCalories: 1500,
    dailyMeals: {
      breakfast: '',
      lunch: '',
      dinner: '',
      snacks: '',
    },
    postSessionGuidelines: '',
  });

  const handleOpenAdd = () => {
    setEditingId(null);
    setFormData({
      name: '',
      description: '',
      instructions: '',
      type: 'loss',
      waterTarget: 3.5,
      targetCalories: 1500,
      dailyMeals: {
        breakfast: '',
        lunch: '',
        dinner: '',
        snacks: '',
      },
      postSessionGuidelines: '',
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (t: DietTemplate) => {
    setEditingId(t.id);
    setFormData({
      name: t.name,
      description: t.description,
      instructions: t.instructions,
      type: t.type,
      waterTarget: t.waterTarget || 3.5,
      targetCalories: t.targetCalories || 1500,
      dailyMeals: t.dailyMeals || { breakfast: '', lunch: '', dinner: '', snacks: '' },
      postSessionGuidelines: t.postSessionGuidelines || '',
    });
    setIsModalOpen(true);
  };

  const handleSaveDiet = async (e: React.FormEvent) => {
    e.preventDefault();
    const templateData: DietTemplate = {
      id: editingId || `tmpl_${Date.now()}`,
      name: formData.name || 'قالب غذائي جديد',
      description: formData.description || '',
      instructions: formData.instructions || '',
      type: (formData.type as any) || 'loss',
      waterTarget: Number(formData.waterTarget) || 3.5,
      targetCalories: Number(formData.targetCalories) || 1500,
      dailyMeals: formData.dailyMeals,
      postSessionGuidelines: formData.postSessionGuidelines,
    };

    if (editingId) {
      await updateDietTemplate(editingId, templateData);
    } else {
      await addDietTemplate(templateData);
    }

    setIsModalOpen(false);
    setEditingId(null);
  };

  const handleOpenAssign = (t: DietTemplate) => {
    setSelectedTemplateForAssign(t);
    setSelectedPatientId(patients[0]?.id || '');
    setCustomDoctorNotes('');
    setAssignSuccessMsg('');
    setIsAssignModalOpen(true);
  };

  const handleExecuteAssign = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTemplateForAssign || !selectedPatientId) return;

    await assignDietToPatient(selectedPatientId, selectedTemplateForAssign, customDoctorNotes);
    const targetPat = patients.find(p => p.id === selectedPatientId);
    setAssignSuccessMsg(`تم إسناد القالب إلى العميل (${targetPat?.name}) بنجاح وإرسال الروشتة للشات ✓`);
    setTimeout(() => {
      setIsAssignModalOpen(false);
      setAssignSuccessMsg('');
    }, 1500);
  };

  const handleOpenPdf = (t: DietTemplate) => {
    setSelectedTemplateForPdf(t);
    setIsPdfModalOpen(true);
  };

  const handleShareWhatsApp = (t: DietTemplate) => {
    const text = `📋 *قالب ونظام غذائي من مركز سيرا (فرع إهناسيا)*\n\n` +
      `📌 *اسم النظام:* ${t.name}\n` +
      `💧 *الماء المستهدف:* ${t.waterTarget || 3.5} لتر يومياً\n\n` +
      `🍳 *الإفطار:* ${t.dailyMeals?.breakfast || 'حسب الخطة'}\n` +
      `🥗 *الغداء:* ${t.dailyMeals?.lunch || 'حسب الخطة'}\n` +
      `🥣 *العشاء:* ${t.dailyMeals?.dinner || 'حسب الخطة'}\n\n` +
      `⚠️ *التعليمات:* ${t.instructions}\n\n` +
      `🏥 عيادة سيرا - بني سويف`;

    const encoded = encodeURIComponent(text);
    window.open(`https://wa.me/?text=${encoded}`, '_blank');
  };

  return (
    <div className="animate-[fadeIn_0.3s_ease-out] space-y-8 pb-16">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="bg-[#8DC63F]/20 text-[#8DC63F] text-[11px] font-black px-3 py-1 rounded-full border border-[#8DC63F]/30">
              نظام القوالب الغذائية الجاهزة (Template System) 📋
            </span>
          </div>
          <h1 className="text-3xl font-black text-white flex items-center gap-3">
            <ListChecks className="text-[#8DC63F]" size={32} /> قوالب الأنظمة الغذائية والروشتات
          </h1>
          <p className="text-green-100/70 font-bold text-xs sm:text-sm mt-1">
            قوالب جاهزة للطباعة، المشاركة عبر واتساب، التعديل المباشر، والربط الفوري مع ملفات المرضى وطلبات التعديل.
          </p>
        </div>

        <button 
          onClick={handleOpenAdd}
          className="bg-[#8DC63F] text-black hover:bg-[#7ab036] px-5 py-3 rounded-2xl font-black flex items-center gap-2 transition-all shadow-xl shadow-[#8DC63F]/20 cursor-pointer text-xs sm:text-sm"
        >
          <Plus size={20} /> إنشاء قالب غذائي جديد
        </button>
      </div>

      {/* Templates Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {templates.map(template => (
          <div 
            key={template.id} 
            className="glass-card p-6 sm:p-7 rounded-[28px] flex flex-col justify-between border border-white/10 hover:border-[#8DC63F]/40 transition-all bg-[#08150c] shadow-2xl group relative"
          >
            <div>
              <div className="flex justify-between items-start mb-4">
                <div className="bg-[#8DC63F]/15 p-3 rounded-2xl text-[#8DC63F] border border-[#8DC63F]/30">
                  <FileText size={24} />
                </div>
                
                <div className="flex items-center gap-1.5 opacity-100 lg:opacity-0 group-hover:opacity-100 transition-opacity">
                  <button 
                    onClick={() => handleOpenPdf(template)} 
                    title="معاينة وطباعة الروشتة (PDF)" 
                    className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-white transition-colors cursor-pointer"
                  >
                    <Printer size={16} />
                  </button>
                  <button 
                    onClick={() => handleShareWhatsApp(template)} 
                    title="مشاركة واتساب" 
                    className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-emerald-400 transition-colors cursor-pointer"
                  >
                    <Share2 size={16} />
                  </button>
                  <button 
                    onClick={() => handleOpenEdit(template)} 
                    title="تعديل القالب" 
                    className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-[#8DC63F] transition-colors cursor-pointer"
                  >
                    <Edit size={16} />
                  </button>
                  <button 
                    onClick={() => deleteDietTemplate(template.id)} 
                    title="حذف القالب" 
                    className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-red-400 transition-colors cursor-pointer"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>

              <div className="flex items-center gap-2 mb-2">
                <span className={`text-[10px] font-black px-2.5 py-0.5 rounded-full border ${
                  template.type === 'loss' ? 'bg-amber-500/20 text-amber-300 border-amber-500/40' :
                  template.type === 'rehab' ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40' :
                  'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                }`}>
                  {template.type === 'loss' ? 'خسارة دهون ونحت' : template.type === 'rehab' ? 'تصريف سوائل وتأهيل' : 'تثبيت وزن'}
                </span>
                <span className="text-[10px] font-bold text-blue-400 flex items-center gap-1">
                  <Droplets size={12} /> {template.waterTarget || 3.5}L ماء
                </span>
              </div>
              
              <h3 className="text-lg font-black text-white mb-2">{template.name}</h3>
              <p className="text-xs text-green-100/70 font-semibold mb-4 leading-relaxed line-clamp-2">
                {template.description}
              </p>
              
              {/* Meals Preview */}
              {template.dailyMeals && (
                <div className="bg-black/40 p-3.5 rounded-xl border border-white/5 space-y-1.5 mb-4 text-[11px]">
                  <p className="text-white/80 font-bold truncate">
                    🍳 <span className="text-white/50">إفطار:</span> {template.dailyMeals.breakfast || 'وجبة بروتينية'}
                  </p>
                  <p className="text-white/80 font-bold truncate">
                    🥩 <span className="text-white/50">غداء:</span> {template.dailyMeals.lunch || 'بروتين + خضار'}
                  </p>
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="pt-4 border-t border-white/5 grid grid-cols-2 gap-2">
              <button 
                onClick={() => handleOpenAssign(template)}
                className="py-2.5 px-3 bg-[#8DC63F] hover:bg-[#7ab036] text-black font-black text-xs rounded-xl flex items-center justify-center gap-1.5 transition-all cursor-pointer shadow-md"
              >
                <UserCheck size={14} /> إسناد لعميل
              </button>

              <button 
                onClick={() => handleOpenPdf(template)}
                className="py-2.5 px-3 bg-white/5 hover:bg-white/10 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 transition-all border border-white/10 cursor-pointer"
              >
                <Printer size={14} /> طباعة PDF
              </button>
            </div>

          </div>
        ))}
      </div>

      {/* Create / Edit Template Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-[fadeIn_0.2s_ease-out]">
          <div className="relative w-full max-w-2xl bg-[#08150c] border border-[#8DC63F]/30 rounded-[32px] overflow-hidden shadow-2xl p-6 sm:p-8 max-h-[92vh] overflow-y-auto">
            
            <div className="flex justify-between items-center pb-4 border-b border-white/10 mb-6">
              <h2 className="text-xl font-black text-white flex items-center gap-2">
                <FileText size={22} className="text-[#8DC63F]" />
                {editingId ? 'تعديل القالب الغذائي' : 'إنشاء قالب غذائي جديد'}
              </h2>
              <button onClick={() => setIsModalOpen(false)} className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-white/70 hover:text-white transition-colors cursor-pointer">
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSaveDiet} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-green-100/70 mb-2">اسم القالب والنظام الغذائي *</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="مثال: دايت كيتو متقدم لنحت الخصر"
                  className="w-full bg-black/50 border border-white/10 rounded-xl p-3 text-white text-xs font-bold outline-none focus:border-[#8DC63F]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-bold text-green-100/70 mb-2">نوع الخطة</label>
                  <select
                    value={formData.type}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value as any })}
                    className="w-full bg-black/50 border border-white/10 rounded-xl p-3 text-white text-xs font-bold outline-none focus:border-[#8DC63F]"
                  >
                    <option value="loss">خسارة دهون وتخسيس</option>
                    <option value="rehab">تصريف سوائل وسيلوليت</option>
                    <option value="maintenance">تثبيت وزن</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-green-100/70 mb-2">الماء المستهدف (لتر)</label>
                  <input
                    type="number"
                    step="0.5"
                    value={formData.waterTarget}
                    onChange={(e) => setFormData({ ...formData, waterTarget: Number(e.target.value) })}
                    className="w-full bg-black/50 border border-white/10 rounded-xl p-3 text-white text-xs font-bold text-center outline-none focus:border-[#8DC63F]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-green-100/70 mb-2">السعرات التقريبية</label>
                  <input
                    type="number"
                    value={formData.targetCalories}
                    onChange={(e) => setFormData({ ...formData, targetCalories: Number(e.target.value) })}
                    className="w-full bg-black/50 border border-white/10 rounded-xl p-3 text-white text-xs font-bold text-center outline-none focus:border-[#8DC63F]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-green-100/70 mb-2">وصف مختصر للخطة</label>
                <input
                  type="text"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="وصف الهدف من النظام والمدة المقترحة"
                  className="w-full bg-black/50 border border-white/10 rounded-xl p-3 text-white text-xs font-bold outline-none focus:border-[#8DC63F]"
                />
              </div>

              {/* Daily Meals Breakdown */}
              <div className="pt-2 border-t border-white/5 space-y-3">
                <label className="block text-xs font-black text-[#8DC63F]">تفاصيل جدول الوجبات اليومي:</label>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] text-white/70 font-bold mb-1">🍳 الإفطار (Breakfast)</label>
                    <textarea
                      rows={2}
                      value={formData.dailyMeals?.breakfast}
                      onChange={(e) => setFormData({
                        ...formData,
                        dailyMeals: { ...formData.dailyMeals, breakfast: e.target.value }
                      })}
                      className="w-full bg-black/50 border border-white/10 rounded-xl p-2.5 text-white text-xs font-semibold outline-none focus:border-[#8DC63F]"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] text-white/70 font-bold mb-1">🥩 الغداء (Lunch)</label>
                    <textarea
                      rows={2}
                      value={formData.dailyMeals?.lunch}
                      onChange={(e) => setFormData({
                        ...formData,
                        dailyMeals: { ...formData.dailyMeals, lunch: e.target.value }
                      })}
                      className="w-full bg-black/50 border border-white/10 rounded-xl p-2.5 text-white text-xs font-semibold outline-none focus:border-[#8DC63F]"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] text-white/70 font-bold mb-1">🥣 العشاء (Dinner)</label>
                    <textarea
                      rows={2}
                      value={formData.dailyMeals?.dinner}
                      onChange={(e) => setFormData({
                        ...formData,
                        dailyMeals: { ...formData.dailyMeals, dinner: e.target.value }
                      })}
                      className="w-full bg-black/50 border border-white/10 rounded-xl p-2.5 text-white text-xs font-semibold outline-none focus:border-[#8DC63F]"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] text-white/70 font-bold mb-1">🥜 السناك (Snacks)</label>
                    <textarea
                      rows={2}
                      value={formData.dailyMeals?.snacks}
                      onChange={(e) => setFormData({
                        ...formData,
                        dailyMeals: { ...formData.dailyMeals, snacks: e.target.value }
                      })}
                      className="w-full bg-black/50 border border-white/10 rounded-xl p-2.5 text-white text-xs font-semibold outline-none focus:border-[#8DC63F]"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-green-100/70 mb-2">تعليمات طبية وبروتوكول ما بعد الجلسات</label>
                <textarea
                  rows={3}
                  value={formData.instructions}
                  onChange={(e) => setFormData({ ...formData, instructions: e.target.value })}
                  placeholder="تعليمات الطبيب الخاصة بشرب الماء ومواعيد الوجبات..."
                  className="w-full bg-black/50 border border-white/10 rounded-xl p-3 text-white text-xs font-semibold outline-none focus:border-[#8DC63F]"
                />
              </div>

              <div className="pt-3 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-5 py-3 bg-white/5 hover:bg-white/10 text-white font-bold text-xs rounded-xl transition-all cursor-pointer"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  className="px-6 py-3 bg-[#8DC63F] hover:bg-[#7ab036] text-black font-black text-xs rounded-xl flex items-center gap-2 transition-all shadow-lg shadow-[#8DC63F]/20 cursor-pointer"
                >
                  <Save size={16} /> حفظ القالب
                </button>
              </div>
            </form>

          </div>
        </div>
      )}

      {/* Assign Template to Patient Modal */}
      {isAssignModalOpen && selectedTemplateForAssign && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-[fadeIn_0.2s_ease-out]">
          <div className="relative w-full max-w-lg bg-[#08150c] border border-[#8DC63F]/30 rounded-[32px] overflow-hidden shadow-2xl p-6 sm:p-8">
            
            <div className="flex justify-between items-center pb-4 border-b border-white/10 mb-5">
              <div>
                <h3 className="text-lg font-black text-white flex items-center gap-2">
                  <UserCheck size={20} className="text-[#8DC63F]" /> إسناد القالب إلى عميل
                </h3>
                <p className="text-xs text-green-100/60 font-semibold mt-0.5">
                  القالب المختار: <strong className="text-white">{selectedTemplateForAssign.name}</strong>
                </p>
              </div>
              <button onClick={() => setIsAssignModalOpen(false)} className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-white/70 hover:text-white transition-colors cursor-pointer">
                <X size={18} />
              </button>
            </div>

            {assignSuccessMsg ? (
              <div className="p-4 bg-emerald-500/20 border border-emerald-500/40 rounded-2xl flex items-center gap-3 text-xs text-emerald-200 font-bold">
                <CheckCircle2 size={20} className="text-emerald-400 shrink-0" />
                <span>{assignSuccessMsg}</span>
              </div>
            ) : (
              <form onSubmit={handleExecuteAssign} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-green-100/70 mb-2">اختر العميل المستهدف *</label>
                  <select
                    required
                    value={selectedPatientId}
                    onChange={(e) => setSelectedPatientId(e.target.value)}
                    className="w-full bg-black/50 border border-white/10 rounded-xl p-3.5 text-white text-xs font-bold outline-none focus:border-[#8DC63F]"
                  >
                    {patients.map(p => (
                      <option key={p.id} value={p.id}>
                        {p.name} - ({p.phone}) {p.diet?.name ? `[الدايت الحالي: ${p.diet.name}]` : '[بدون دايت]'}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-green-100/70 mb-2">
                    توجيهات وملاحظات الطبيب المخصصة لهذا العميل
                  </label>
                  <textarea
                    rows={3}
                    value={customDoctorNotes}
                    onChange={(e) => setCustomDoctorNotes(e.target.value)}
                    placeholder="ملاحظات إضافية مخصصة للعميل ستظهر في روشتته الطبية وفي رسالة الشات..."
                    className="w-full bg-black/50 border border-white/10 rounded-xl p-3 text-white text-xs font-semibold outline-none focus:border-[#8DC63F]"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3.5 bg-[#8DC63F] hover:bg-[#7ab036] text-black font-black text-xs rounded-xl flex items-center justify-center gap-2 transition-all shadow-lg shadow-[#8DC63F]/20 cursor-pointer"
                >
                  <Save size={16} /> تأكيد إسناد الخطة وتحديث روشتة العميل
                </button>
              </form>
            )}

          </div>
        </div>
      )}

      {/* PDF Modal */}
      <PrescriptionDietPdfModal
        isOpen={isPdfModalOpen}
        onClose={() => setIsPdfModalOpen(false)}
        template={selectedTemplateForPdf}
      />

    </div>
  );
}