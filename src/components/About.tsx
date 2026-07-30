import { useEffect, useState } from "react";
import { IconX } from "./icons";

type Lang = "en" | "fr" | "fa";

const LANGS: { id: Lang; label: string; native: string }[] = [
  { id: "en", label: "English", native: "English" },
  { id: "fr", label: "French", native: "Français" },
  { id: "fa", label: "Farsi", native: "فارسی" },
];

type Section = { heading: string; body: string };
type Content = { title: string; tagline: string; sections: Section[]; outro: string };

const CONTENT: Record<Lang, Content> = {
  en: {
    title: "About Petit Carnet",
    tagline: "A calm, offline notebook for learning French — one true phrase at a time.",
    sections: [
      {
        heading: "Learn",
        body: "Browse a library of hundreds of useful French phrases across dozens of categories — greetings, food, travel, love, slang and more. Each card shows the phrase, its meaning, a pronunciation hint and a memory note.",
      },
      {
        heading: "Your notebook",
        body: "Save any phrase — from the library or your own — into a personal notebook. Everything lives on your device. Nothing is uploaded, and it all works with no internet.",
      },
      {
        heading: "Practice",
        body: "Review saved phrases with flashcards and spaced repetition. A little every day beats cramming, and your streak keeps you honest.",
      },
      {
        heading: "Grammar, verbs & sounds",
        body: "Short lessons on the structures that unlock most everyday French, a verb conjugator, and a guide to the sounds and pronunciation of the language.",
      },
    ],
    outro: "Made with care. Long may the sunshine.",
  },
  fr: {
    title: "À propos de Petit Carnet",
    tagline: "Un carnet calme et hors-ligne pour apprendre le français — une vraie phrase à la fois.",
    sections: [
      {
        heading: "Apprendre",
        body: "Parcourez une bibliothèque de centaines de phrases françaises utiles, réparties en dizaines de catégories — salutations, nourriture, voyage, amour, argot et plus. Chaque carte montre la phrase, son sens, une aide à la prononciation et une note mémoire.",
      },
      {
        heading: "Votre carnet",
        body: "Enregistrez n'importe quelle phrase — de la bibliothèque ou la vôtre — dans un carnet personnel. Tout reste sur votre appareil. Rien n'est envoyé, et tout fonctionne sans internet.",
      },
      {
        heading: "S'entraîner",
        body: "Révisez vos phrases avec des cartes et la répétition espacée. Un peu chaque jour vaut mieux que tout d'un coup, et votre série vous garde motivé.",
      },
      {
        heading: "Grammaire, verbes & sons",
        body: "De courtes leçons sur les structures essentielles du français quotidien, un conjugueur de verbes, et un guide des sons et de la prononciation.",
      },
    ],
    outro: "Fait avec soin. Que le soleil brille longtemps.",
  },
  fa: {
    title: "درباره‌ی پُتی کارنه",
    tagline: "دفترچه‌ای آرام و آفلاین برای یادگیری فرانسه — هر بار یک عبارت واقعی.",
    sections: [
      {
        heading: "یادگیری",
        body: "کتابخانه‌ای از صدها عبارت کاربردی فرانسوی را در ده‌ها دسته‌بندی مرور کنید — احوال‌پرسی، غذا، سفر، عشق، زبان عامیانه و بیشتر. هر کارت عبارت، معنی، راهنمای تلفظ و یک یادداشت کمک‌حافظه را نشان می‌دهد.",
      },
      {
        heading: "دفترچه‌ی شما",
        body: "هر عبارتی را — از کتابخانه یا ساخته‌ی خودتان — در یک دفترچه‌ی شخصی ذخیره کنید. همه‌چیز روی دستگاه شما می‌ماند. چیزی آپلود نمی‌شود و همه‌چیز بدون اینترنت کار می‌کند.",
      },
      {
        heading: "تمرین",
        body: "عبارت‌های ذخیره‌شده را با فلش‌کارت و مرور فاصله‌دار دوره کنید. کمی هر روز بهتر از فشار یک‌باره است، و زنجیره‌ی روزانه شما را پایبند نگه می‌دارد.",
      },
      {
        heading: "دستور، فعل‌ها و صداها",
        body: "درس‌های کوتاه درباره‌ی ساختارهایی که بیشتر فرانسه‌ی روزمره را باز می‌کنند، یک صرف‌کننده‌ی فعل، و راهنمایی برای صداها و تلفظ زبان.",
      },
    ],
    outro: "با دقت ساخته شده. آفتاب همیشه بتابد.",
  },
};

export default function About({ onClose }: { onClose: () => void }) {
  const [lang, setLang] = useState<Lang>("en");
  const content = CONTENT[lang];
  const rtl = lang === "fa";

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-[70] flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-label="About Petit Carnet"
    >
      {/* Backdrop */}
      <button
        type="button"
        aria-label="Close"
        onClick={onClose}
        className="absolute inset-0 bg-ink/40 backdrop-blur-sm"
      />

      {/* Dialog */}
      <div className="panel animate-soft-in relative flex max-h-[85vh] w-full max-w-lg flex-col overflow-hidden rounded-[1.5rem]">
        {/* Header */}
        <div className="flex items-center justify-between gap-3 border-b border-line p-5">
          <div className="segmented" role="group" aria-label="Language">
            {LANGS.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => setLang(item.id)}
                data-active={lang === item.id}
                lang={item.id}
              >
                {item.native}
              </button>
            ))}
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="grid h-9 w-9 shrink-0 place-items-center rounded-full text-mute transition hover:bg-ink/[0.06] hover:text-ink dark:hover:bg-white/[0.06]"
          >
            <IconX className="h-4 w-4" />
          </button>
        </div>

        {/* Body */}
        <div
          className="scroll-soft overflow-y-auto p-6 sm:p-7"
          dir={rtl ? "rtl" : "ltr"}
          lang={lang}
          style={rtl ? { fontFamily: "Vazirmatn, Tahoma, sans-serif" } : undefined}
        >
          <h2 className={`text-2xl font-semibold tracking-tight text-ink ${rtl ? "" : "font-display italic"}`}>
            {content.title}
          </h2>
          <p className="mt-2 text-[15px] leading-relaxed text-mute">{content.tagline}</p>

          <div className="mt-6 space-y-5">
            {content.sections.map((section) => (
              <div key={section.heading}>
                <h3 className="flex items-center gap-2 text-sm font-bold text-pine">
                  <span className="h-1.5 w-1.5 rounded-full bg-pine" />
                  {section.heading}
                </h3>
                <p className="mt-1.5 text-[14px] leading-relaxed text-ink/80">{section.body}</p>
              </div>
            ))}
          </div>

          <p className="mt-7 border-t border-line pt-5 text-sm font-medium text-gold">
            {content.outro}
          </p>
        </div>
      </div>
    </div>
  );
}
