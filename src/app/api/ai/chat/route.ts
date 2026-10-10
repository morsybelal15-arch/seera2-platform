import { NextResponse } from 'next/server';
import { GoogleGenAI } from '@google/genai';
import { db } from '@/db/index';
import { aiConsultations } from '@/db/schema';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { message, userId, userRole } = body;

    if (!message || typeof message !== 'string') {
      return NextResponse.json({ error: 'Message is required' }, { status: 400 });
    }

    let aiReply = '';
    const apiKey = process.env.GEMINI_API_KEY;

    if (apiKey) {
      try {
        const ai = new GoogleGenAI({ apiKey });
        const systemInstruction = `
أنت المساعد الطبي الذكي لعيادة CERRAH (عيادة متخصصة في العلاج الطبيعي والتغذية العلاجية وتنسيق القوام ونحت الدهون بدون جراحة).
طبيعة الخدمات في عيادة سيرا:
1. العلاج الطبيعي والتأهيل: إصابات الملاعب، آلام العمود الفقري، تأهيل المفاصل بعد العمليات.
2. التغذية العلاجية: أنظمة دايت مخصصة (كيتو، صيام متقطع، دايت متوازن)، تحليل InBody و BMI.
3. نحت القوام الموضعي بأحدث التقنيات:
   - جهاز Onda (Microwave): لشد الترهلات العميقة، علاج السيلوليت ونحت الدهون بموجات الميكروويف الباردة.
   - جهاز Scizer (HIFU): لتفتيت الدهون الصعبة في البطن والأجناب بالموجات المركزة.
   - حقن الميزوثيرابي: لتسريع حرق الدهون الموضعية.
4. المحاكي الفيزيائي 3D: فحص قوام المريض وتحديد توزيع الدهون في البطن والجوانب والظهر والمؤخرة.

إرشادات الإجابة:
- أجب باللغة العربية بأسلوب طبي مهني وودود ومطمئن.
- قدم معلومات دقيقة وموجزة (فقرة أو فقرتين).
- شجع المستخدم دائماً على حجز استشارة بالعيادة أو استخدام المحاكي 3D لتحديد خطته العلاجية بدقة.
        `;

        const response = await ai.models.generateContent({
          model: 'gemini-2.5-flash',
          contents: message,
          config: {
            systemInstruction,
            temperature: 0.6,
          },
        });

        aiReply = response.text || '';
      } catch (geminiError) {
        console.warn('Gemini API call failed, using intelligent clinical fallback:', geminiError);
      }
    }

    // Fallback clinical response engine if GEMINI_API_KEY is not configured or rate-limited
    if (!aiReply) {
      const lower = message.toLowerCase();
      if (lower.includes('حجز') || lower.includes('موعد') || lower.includes('سعر') || lower.includes('تكلفة')) {
        aiReply = 'أهلاً بك! يمكنك حجز موعدك أو استشارتك مباشرة عبر زر "احجز استشارة" في الموقع أو الاتصال بنا على 01108080564. يتم تحديد التكلفة بدقة حسب الخطة العلاجية وعدد الجلسات بعد الفحص الأولي.';
      } else if (lower.includes('جهاز') || lower.includes('onda') || lower.includes('scizer') || lower.includes('نحت') || lower.includes('تخسيس') || lower.includes('دهون')) {
        aiReply = 'نستخدم في عيادة سيرا أحدث تقنيات تفتيت الدهون غير الجراحية: جهاز Onda بموجات الميكروويف لشد الترهلات والسيلوليت، وجهاز Scizer بتقنية الـ HIFU لتدمير الخلايا الدهنية في البطن والأجناب بأمان تام.';
      } else if (lower.includes('دايت') || lower.includes('وزن') || lower.includes('تغذية') || lower.includes('bmi') || lower.includes('اكل')) {
        aiReply = 'خطط التغذية لدينا مصممة خصيصاً بناءً على مؤشر كتلة الجسم ومكونات دهونك. يمكنك تجربة "المحاكي الفيزيائي 3D" في الصفحة الرئيسية لتحديد فئتك والبدء في نظام علاجي بدون حرمان قاسي.';
      } else if (lower.includes('علاج طبيعي') || lower.includes('ظهر') || lower.includes('ألم') || lower.includes('فقرات') || lower.includes('مفاصل')) {
        aiReply = 'فريق العلاج الطبيعي في سيرا يوفر بروتوكولات تأهيل حديثة لتخفيف آلام الظهر والمفاصل وإصابات الرياضيين بأجهزة تحفيز متقدمة تظهر نتائجها من الجلسة الأولى.';
      } else {
        aiReply = `مرحباً بك في عيادة CERRAH! أنا هنا لمساعدتك بخصوص أي استفسار طبي عن العلاج الطبيعي، التغذية، وأجهزة نحت القوام (Onda و Scizer). يمكنك أيضاً استخدام المحاكي ثلاثي الأبعاد أو حجز موعد كشف للبدء فوراً.`;
      }
    }

    // Persist to PostgreSQL ai_consultations table
    try {
      await db.insert(aiConsultations).values({
        id: `ai_${Date.now()}`,
        userId: userId || null,
        userRole: userRole || 'guest',
        message: message.trim(),
        response: aiReply.trim(),
      });
    } catch (dbErr) {
      console.warn('Could not record ai consultation to DB:', dbErr);
    }

    return NextResponse.json({ reply: aiReply });
  } catch (error) {
    console.error('Error in AI Chat route:', error);
    return NextResponse.json({ error: 'Failed to process AI chat' }, { status: 500 });
  }
}
