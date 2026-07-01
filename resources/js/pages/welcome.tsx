import { Head, Link } from '@inertiajs/react';
import {
    ChevronDown,
    Clock,
    Home,
    MessageCircle,
    ShieldCheck,
} from 'lucide-react';
import { useState } from 'react';
import { TextAnimate } from '@/components/ui/text-animate';
import { TWelcome as T } from '@/lib/public-translations';
import { show as bookingShow } from '@/routes/booking';

type Service = {
    id: number;
    name: string;
    name_en?: string | null;
    description: string | null;
    description_en?: string | null;
    duration_minutes: number;
    price: number;
};

function formatPrice(price: number): string {
    return `Rp ${price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.')}`;
}

function getServiceImage(service: Service): string | null {
    const name = (service.name || '').toLowerCase();

    if (name.includes('relaksasi') || name.includes('relaxing')) {
        return '/images/services/relaksasi.png';
    }

    if (name.includes('tradisional') || name.includes('traditional')) {
        return '/images/services/tradisional.png';
    }

    if (name.includes('fisioterapi') || name.includes('physiotherapy')) {
        return '/images/services/fisioterapi.png';
    }

    if (name.includes('totok') || name.includes('acupressure')) {
        return '/images/services/totok-wajah.png';
    }

    if (
        name.includes('ibu nifas') ||
        name.includes('postnatal') ||
        name.includes('postpartum')
    ) {
        return '/images/services/ibu-nifas.png';
    }

    if (name.includes('bekam') || name.includes('cupping')) {
        return '/images/services/bekam.png';
    }

    return null;
}
const CARD_GRADIENT =
    'linear-gradient(160deg, #EFE6E2 0%, #F5ECE7 60%, #FFDAD9 100%)';
const HERO_IMAGE =
    'https://images.unsplash.com/photo-1600334129128-685c5582fd35?auto=format&fit=crop&w=1800&q=85';

const LANG_OPTIONS = [
    { value: 'id', flag: '🇮🇩', short: 'ID', label: 'Indonesia' },
    { value: 'en', flag: '🇺🇸', short: 'EN', label: 'English' },
] as const;

function LanguageDropdown({
    lang,
    changeLang,
    isLangOpen,
    setIsLangOpen,
    compact,
}: {
    lang: 'id' | 'en';
    changeLang: (l: 'id' | 'en') => void;
    isLangOpen: boolean;
    setIsLangOpen: (open: boolean) => void;
    compact?: boolean;
}) {
    const currentOption =
        LANG_OPTIONS.find((opt) => opt.value === lang) || LANG_OPTIONS[0];

    return (
        <div className="relative inline-block text-left">
            <button
                type="button"
                onClick={() => setIsLangOpen(!isLangOpen)}
                aria-label="Select language"
                aria-expanded={isLangOpen}
                aria-haspopup="menu"
                className="flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-semibold transition-all outline-none"
                style={{
                    borderColor: 'rgba(223,168,168,0.55)',
                    backgroundColor: 'rgba(255,248,241,0.85)',
                    color: 'var(--pub-text-sub)',
                }}
                onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor =
                        'rgba(223,168,168,0.14)';
                }}
                onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor =
                        'rgba(255,248,241,0.85)';
                }}
            >
                <span>{currentOption.flag}</span>
                <span>
                    {compact ? currentOption.short : currentOption.label}
                </span>
                <ChevronDown
                    className="size-3 transition-transform duration-250"
                    style={{
                        transform: isLangOpen ? 'rotate(180deg)' : undefined,
                        color: 'var(--pub-text-muted)',
                    }}
                />
            </button>

            {isLangOpen && (
                <div
                    role="menu"
                    className="absolute top-full right-0 z-50 mt-2 overflow-hidden rounded-2xl border shadow-lg transition-all"
                    style={{
                        minWidth: compact ? '118px' : '150px',
                        borderColor: 'var(--pub-border)',
                        backgroundColor: 'rgba(255,255,255,0.95)',
                        backdropFilter: 'blur(8px)',
                        WebkitBackdropFilter: 'blur(8px)',
                    }}
                >
                    {LANG_OPTIONS.map((opt) => {
                        const active = opt.value === lang;

                        return (
                            <button
                                key={opt.value}
                                type="button"
                                role="menuitem"
                                onClick={() => {
                                    changeLang(opt.value);
                                    setIsLangOpen(false);
                                }}
                                className="flex w-full items-center gap-2 px-3 py-2 text-left transition-colors"
                                style={{
                                    fontSize: compact ? '12px' : '14px',
                                    backgroundColor: active
                                        ? 'rgba(223,168,168,0.18)'
                                        : 'transparent',
                                    color: active
                                        ? 'var(--pub-rose)'
                                        : 'var(--pub-text)',
                                }}
                                onMouseEnter={(e) => {
                                    if (!active) {
                                        e.currentTarget.style.backgroundColor =
                                            'rgba(223,168,168,0.12)';
                                    }
                                }}
                                onMouseLeave={(e) => {
                                    if (!active) {
                                        e.currentTarget.style.backgroundColor =
                                            'transparent';
                                    }
                                }}
                            >
                                <span>{opt.flag}</span>
                                <span>{compact ? opt.short : opt.label}</span>
                            </button>
                        );
                    })}
                </div>
            )}
        </div>
    );
}

export default function Welcome({ services }: { services: Service[] }) {
    const currentYear = new Date().getFullYear();

    const [lang, setLang] = useState<'id' | 'en'>(() => {
        if (typeof window !== 'undefined') {
            return (localStorage.getItem('pub-lang') as 'id' | 'en') || 'id';
        }

        return 'id';
    });

    const [isLangOpen, setIsLangOpen] = useState(false);
    const [activeFaq, setActiveFaq] = useState<number | null>(null);
    const [showAllServices, setShowAllServices] = useState(false);

    const changeLang = (newLang: 'id' | 'en') => {
        setLang(newLang);
        localStorage.setItem('pub-lang', newLang);
    };

    const TRUST_ITEMS = [
        {
            icon: ShieldCheck,
            title: T[lang].trustSafetyTitle,
            desc: T[lang].trustSafetyDesc,
        },
        {
            icon: Home,
            title: T[lang].trustDoorstepTitle,
            desc: T[lang].trustDoorstepDesc,
        },
        {
            icon: Clock,
            title: T[lang].trustFlexibleTitle,
            desc: T[lang].trustFlexibleDesc,
        },
        {
            icon: MessageCircle,
            title: T[lang].trustWhatsappTitle,
            desc: T[lang].trustWhatsappDesc,
        },
    ];

    return (
        <>
            <Head>
                <title>
                    {lang === 'id'
                        ? 'Home Care Therapy | Terapi & Pijat Panggilan ke Rumah Tangerang'
                        : 'Home Care Therapy | Home Therapy & Massage Booking'}
                </title>
                <meta
                    name="description"
                    content={
                        lang === 'id'
                            ? 'Pesan layanan terapi dan pijat panggilan ke rumah untuk wilayah Tangerang dan beberapa area Jakarta. Pilih layanan, tentukan jadwal, isi alamat, dan tunggu konfirmasi melalui WhatsApp.'
                            : 'Book a home therapy visit around Tangerang and selected Jakarta areas. Choose a treatment, select a schedule, enter your address, and wait for WhatsApp confirmation.'
                    }
                />
            </Head>

            <div
                id="top"
                className="public-page relative min-h-screen overflow-x-hidden pb-20 md:pb-0"
            >
                {/* ── Header ──────────────────────────────────────────── */}
                <header className="absolute top-0 left-0 z-50 w-full px-5 pt-5 md:px-10 md:pt-7">
                    <div
                        className="mx-auto flex max-w-[1200px] items-center justify-between rounded-full px-5 py-3 md:px-7"
                        style={{
                            backgroundColor: 'rgba(255,248,241,0.86)',
                            border: '1px solid rgba(255,255,255,0.72)',
                            boxShadow: '0 14px 38px rgba(61,42,38,0.08)',
                            backdropFilter: 'blur(16px)',
                            WebkitBackdropFilter: 'blur(16px)',
                        }}
                    >
                        <Link
                            href="/"
                            className="flex min-w-0 items-center gap-3"
                        >
                            <span />
                            <span
                                className="truncate text-sm font-semibold tracking-[0.16em] md:text-base"
                                style={{ color: '#8F5FB7' }}
                            >
                                TherapistKu
                            </span>
                        </Link>

                        <div className="hidden items-center gap-7 md:flex">
                            <nav className="flex items-center gap-6">
                                <a
                                    href="#top"
                                    className="border-b pb-1 text-sm font-semibold"
                                    style={{
                                        color: 'var(--pub-lavender)',
                                        borderColor: 'var(--pub-lavender)',
                                    }}
                                >
                                    {T[lang].home}
                                </a>
                                <a
                                    href="#services"
                                    className="text-sm font-medium transition-opacity hover:opacity-70"
                                    style={{ color: 'var(--pub-text)' }}
                                >
                                    {T[lang].ourOfferings}
                                </a>
                                <Link
                                    href={bookingShow()}
                                    className="text-sm font-medium transition-opacity hover:opacity-70"
                                    style={{ color: 'var(--pub-text)' }}
                                >
                                    {T[lang].book}
                                </Link>
                            </nav>

                            <LanguageDropdown
                                lang={lang}
                                changeLang={changeLang}
                                isLangOpen={isLangOpen}
                                setIsLangOpen={setIsLangOpen}
                            />

                            <Link
                                href={bookingShow()}
                                className="rounded-full px-5 py-2.5 text-sm font-semibold text-white shadow-md transition-all hover:-translate-y-0.5 hover:shadow-lg"
                                style={{ backgroundColor: 'var(--pub-cta)' }}
                            >
                                {T[lang].heroCta}
                            </Link>
                        </div>

                        <div className="md:hidden">
                            <LanguageDropdown
                                lang={lang}
                                changeLang={changeLang}
                                isLangOpen={isLangOpen}
                                setIsLangOpen={setIsLangOpen}
                                compact
                            />
                        </div>
                    </div>
                </header>
                <main>
                    {/* ══ HERO SECTION ═══════════════════════════════════════ */}
                    <section className="relative min-h-[620px] overflow-hidden md:min-h-[760px]">
                        <img
                            src={HERO_IMAGE}
                            alt="Home therapy session in a calm room"
                            className="absolute inset-0 h-full w-full object-cover object-center md:object-[58%_center]"
                            onError={(e) => {
                                e.currentTarget.style.display = 'none';
                            }}
                        />

                        <div
                            className="absolute inset-0"
                            style={{
                                background:
                                    'linear-gradient(90deg, rgba(255,248,241,0.96) 0%, rgba(255,248,241,0.86) 30%, rgba(255,248,241,0.42) 52%, rgba(255,248,241,0.06) 78%)',
                            }}
                        />
                        <div
                            className="absolute inset-0"
                            style={{
                                background:
                                    'linear-gradient(180deg, rgba(46,42,39,0.12) 0%, rgba(255,248,241,0.04) 28%, rgba(255,248,241,0.18) 100%)',
                            }}
                        />
                        <div
                            className="absolute inset-x-0 bottom-0 h-32"
                            style={{
                                background:
                                    'linear-gradient(180deg, rgba(255,248,241,0) 0%, var(--pub-bg) 100%)',
                            }}
                        />

                        <div className="relative mx-auto flex min-h-[620px] max-w-[1200px] items-center px-5 pt-28 pb-12 md:min-h-[760px] md:px-10 md:pt-28">
                            <div className="max-w-[560px]">
                                <p
                                    className="mb-5 text-[11px] font-semibold tracking-[0.22em] uppercase md:text-xs"
                                    style={{ color: '#A87377' }}
                                >
                                    {lang === 'id'
                                        ? 'Home therapy untuk perempuan & pasangan'
                                        : 'Home therapy for women & couples'}
                                </p>

                                <h1
                                    className="mb-6 text-[4rem] leading-[0.93] font-semibold tracking-[-0.06em] md:text-[6rem]"
                                    style={{ color: '#2E2A27' }}
                                >
                                    {T[lang].heroTitle}
                                </h1>

                                <p
                                    className="mb-8 max-w-[470px] text-base leading-[1.75] md:text-xl"
                                    style={{ color: '#6B625D' }}
                                >
                                    {T[lang].heroDesc}
                                </p>

                                <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                                    <Link
                                        href={bookingShow()}
                                        className="inline-flex items-center justify-center rounded-full px-8 py-3.5 text-sm font-semibold text-white shadow-lg transition-all hover:-translate-y-0.5 hover:shadow-xl"
                                        style={{
                                            backgroundColor: 'var(--pub-cta)',
                                        }}
                                    >
                                        {T[lang].heroCta}
                                    </Link>
                                    <a
                                        href="#services"
                                        className="inline-flex items-center justify-center rounded-full border px-8 py-3.5 text-sm font-semibold transition-all hover:bg-white/70"
                                        style={{
                                            color: 'var(--pub-text)',
                                            borderColor:
                                                'rgba(173, 135, 139, 0.42)',
                                            backgroundColor:
                                                'rgba(255,248,241,0.48)',
                                            backdropFilter: 'blur(10px)',
                                            WebkitBackdropFilter: 'blur(10px)',
                                        }}
                                    >
                                        {lang === 'id'
                                            ? 'Lihat Layanan'
                                            : 'View Services'}
                                    </a>
                                </div>
                            </div>

                            <div
                                className="absolute right-5 bottom-20 hidden w-[330px] rounded-[2rem] border p-6 md:block lg:right-10"
                                style={{
                                    backgroundColor: 'rgba(255,248,241,0.76)',
                                    borderColor: 'rgba(255,255,255,0.65)',
                                    boxShadow:
                                        '0 22px 50px rgba(56,40,35,0.14)',
                                    backdropFilter: 'blur(16px)',
                                    WebkitBackdropFilter: 'blur(16px)',
                                }}
                            >
                                <p
                                    className="mb-3 text-[11px] font-semibold tracking-[0.18em] uppercase"
                                    style={{ color: '#A87377' }}
                                >
                                    Home Visit Therapy
                                </p>
                                <p
                                    className="mb-3 text-2xl leading-snug font-semibold"
                                    style={{ color: '#2E2A27' }}
                                >
                                    {lang === 'id'
                                        ? 'Perawatan datang ke tempat Anda merasa paling nyaman.'
                                        : 'Care that comes to you, where you feel safest.'}
                                </p>
                                <p
                                    className="text-sm leading-relaxed"
                                    style={{ color: '#6B625D' }}
                                >
                                    {lang === 'id'
                                        ? 'Pilih layanan, tentukan jadwal, lalu kami bantu konfirmasi melalui WhatsApp.'
                                        : 'Choose a treatment, pick a schedule, and we will confirm it via WhatsApp.'}
                                </p>
                            </div>
                        </div>
                    </section>
                    {/* ══ TRUST STRIP ════════════════════════════════════════ */}
                    <section
                        className="py-10 md:py-12"
                        style={{
                            borderTop: '1px solid rgba(204,195,212,0.4)',
                            borderBottom: '1px solid rgba(204,195,212,0.4)',
                        }}
                    >
                        <div className="mx-auto grid max-w-[1200px] grid-cols-2 gap-6 px-5 md:grid-cols-4 md:gap-8 md:px-10">
                            {TRUST_ITEMS.map(({ icon: Icon, title, desc }) => (
                                <div
                                    key={title}
                                    className="flex flex-col items-center gap-2 text-center md:gap-3"
                                >
                                    <Icon
                                        className="size-6 md:size-8"
                                        style={{ color: 'var(--pub-sage)' }}
                                    />
                                    <h3
                                        className="text-sm font-semibold md:text-base"
                                        style={{
                                            color: 'var(--pub-text)',
                                            lineHeight: '1.4',
                                        }}
                                    >
                                        {title}
                                    </h3>
                                    <p
                                        className="text-xs leading-relaxed md:text-sm"
                                        style={{ color: 'var(--pub-text-sub)' }}
                                    >
                                        {desc}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </section>

                    {/* ══ PHILOSOPHY / STORY ══════════════════════════════════ */}
                    <section
                        id="about"
                        className="px-5 py-16 md:px-10 md:py-24"
                    >
                        <div className="mx-auto max-w-[980px] text-center">
                            <p
                                className="mb-5 inline-flex rounded-full px-3 py-1 text-[10px] font-bold tracking-[0.22em] uppercase md:text-[11px]"
                                style={{
                                    backgroundColor: 'rgba(156,175,136,0.16)',
                                    color: '#7D916B',
                                }}
                            >
                                {lang === 'id'
                                    ? 'Tentang Kami'
                                    : 'Our Philosophy'}
                            </p>

                            <TextAnimate
                                animation="blurIn"
                                as="h2"
                                className="pub-heading mx-auto max-w-[920px] text-[2.1rem] leading-[1.16] font-semibold tracking-[-0.035em] md:text-[3.25rem]"
                                style={{ color: '#2E2A27' }}
                            >
                                {T[lang].philosophyTitle}
                            </TextAnimate>

                            <p
                                className="mx-auto mt-6 max-w-[760px] text-base leading-[1.85] md:text-[1.18rem]"
                                style={{ color: '#7A716A' }}
                            >
                                {T[lang].philosophyText
                                    .split(/(terjaga|respected)/)
                                    .map((part, i) =>
                                        part === 'terjaga' ||
                                            part === 'respected' ? (
                                            <span
                                                key={i}
                                                className="dusty-highlight"
                                            >
                                                {part}
                                            </span>
                                        ) : (
                                            <span key={i}>{part}</span>
                                        ),
                                    )}
                            </p>
                        </div>
                    </section>

                    {/* ══ SERVICES ═══════════════════════════════════════════ */}
                    {services.length > 0 && (
                        <section id="services" className="px-5 py-20 md:px-10">
                            <div className="mx-auto max-w-[1200px]">
                                <div className="mb-12 text-center">
                                    <h2
                                        className="pub-heading mb-4 text-4xl font-semibold md:text-5xl"
                                        style={{ color: 'var(--pub-text)' }}
                                    >
                                        {T[lang].ourOfferings}
                                    </h2>
                                    <p
                                        className="mx-auto max-w-2xl text-lg leading-relaxed"
                                        style={{
                                            color: 'var(--pub-text-sub)',
                                            lineHeight: '1.6',
                                        }}
                                    >
                                        {T[lang].offeringsSub}
                                    </p>
                                </div>

                                <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
                                    {services.map((service, index) => {
                                        const serviceImg =
                                            getServiceImage(service);
                                        const serviceName =
                                            lang === 'en' && service.name_en
                                                ? service.name_en
                                                : service.name;
                                        const serviceDesc =
                                            lang === 'en' &&
                                                service.description_en
                                                ? service.description_en
                                                : service.description;

                                        const isHiddenOnMobile =
                                            index >= 4 && !showAllServices;

                                        return (
                                            <div
                                                key={service.id}
                                                className={`pub-card-solid pub-hover-lift flex-col overflow-hidden rounded-xl md:flex ${isHiddenOnMobile
                                                        ? 'hidden'
                                                        : 'flex'
                                                    }`}
                                            >
                                                {/* Image area */}
                                                <div
                                                    className="relative h-28 w-full overflow-hidden md:h-44"
                                                    style={{
                                                        background:
                                                            CARD_GRADIENT,
                                                    }}
                                                >
                                                    {serviceImg && (
                                                        <img
                                                            src={serviceImg}
                                                            alt={serviceName}
                                                            className="h-full w-full object-cover transition-transform duration-500 hover:scale-105"
                                                            onError={(e) => {
                                                                e.currentTarget.style.display =
                                                                    'none';
                                                            }}
                                                        />
                                                    )}
                                                    <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#f5ece7]/50 to-transparent" />
                                                </div>

                                                <div className="flex flex-grow flex-col p-4 md:p-6">
                                                    {/* Name + duration badge */}
                                                    <div className="mb-2 flex items-start justify-between gap-3 md:mb-4">
                                                        <h3
                                                            className="pub-heading text-lg leading-snug md:text-2xl"
                                                            style={{
                                                                color: 'var(--pub-text)',
                                                                fontWeight: 500,
                                                                lineHeight:
                                                                    '1.3',
                                                            }}
                                                        >
                                                            {serviceName}
                                                        </h3>
                                                        <span
                                                            className="shrink-0 rounded-full px-2.5 py-0.5 text-[10px] font-semibold md:px-3 md:py-1 md:text-xs"
                                                            style={{
                                                                backgroundColor:
                                                                    'rgba(241,184,184,0.2)',
                                                                color: 'var(--pub-text-sub)',
                                                            }}
                                                        >
                                                            {
                                                                service.duration_minutes
                                                            }{' '}
                                                            Min
                                                        </span>
                                                    </div>

                                                    {serviceDesc && (
                                                        <p
                                                            className="mb-3 line-clamp-2 flex-grow text-xs leading-relaxed md:mb-6 md:text-sm"
                                                            style={{
                                                                color: 'var(--pub-text-sub)',
                                                                lineHeight:
                                                                    '1.6',
                                                            }}
                                                        >
                                                            {serviceDesc}
                                                        </p>
                                                    )}

                                                    <p
                                                        className="mb-3 text-sm font-semibold md:mb-4 md:text-base"
                                                        style={{
                                                            color: 'var(--pub-lavender)',
                                                        }}
                                                    >
                                                        {formatPrice(
                                                            service.price,
                                                        )}
                                                    </p>

                                                    {/* Outlined button */}
                                                    <Link
                                                        href={bookingShow()}
                                                        className="mt-auto w-full rounded-full py-2 text-center text-xs font-semibold transition-all hover:opacity-80 md:py-3 md:text-sm"
                                                        style={{
                                                            border: '1px solid var(--pub-border)',
                                                            color: 'var(--pub-lavender)',
                                                        }}
                                                    >
                                                        {T[lang].heroCta}
                                                    </Link>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>

                                {/* Mobile only Show More / Show Less Button */}
                                {services.length > 4 && (
                                    <div className="mt-8 flex justify-center md:hidden">
                                        <button
                                            onClick={() =>
                                                setShowAllServices(
                                                    !showAllServices,
                                                )
                                            }
                                            className="pub-card-solid pub-heading flex items-center gap-2 rounded-full px-6 py-2.5 text-xs font-semibold shadow-sm transition-all hover:opacity-80"
                                            style={{
                                                border: '1px solid var(--pub-border)',
                                                color: 'var(--pub-lavender)',
                                            }}
                                        >
                                            {showAllServices
                                                ? T[lang].showFewerServices
                                                : T[lang].showMoreServices}
                                            <ChevronDown
                                                className={`size-4 transition-transform duration-300 ${showAllServices
                                                        ? 'rotate-180'
                                                        : ''
                                                    }`}
                                            />
                                        </button>
                                    </div>
                                )}
                            </div>
                        </section>
                    )}

                    {/* ══ HOW IT WORKS ════════════════════════════════════════ */}
                    <section
                        className="px-5 py-16 md:px-10 md:py-20"
                        style={{ backgroundColor: 'rgba(255,248,241,0.35)' }}
                    >
                        <div className="mx-auto max-w-[1200px]">
                            <h2
                                className="pub-heading mb-10 text-center text-3xl font-semibold"
                                style={{ color: 'var(--pub-text)' }}
                            >
                                {T[lang].howItWorks}
                            </h2>

                            {/* Desktop: 4 columns */}
                            <div className="hidden gap-6 md:grid md:grid-cols-4">
                                {T[lang].howItWorksSteps.map(
                                    ({ step, title, desc }) => (
                                        <div
                                            key={step}
                                            className="flex flex-col items-center gap-3 text-center"
                                        >
                                            <span
                                                className="pub-heading flex size-12 items-center justify-center rounded-full text-xl font-bold"
                                                style={{
                                                    backgroundColor:
                                                        'var(--pub-rose-fixed)',
                                                    color: 'var(--pub-rose)',
                                                }}
                                            >
                                                {step}
                                            </span>
                                            <h4
                                                className="text-base font-semibold"
                                                style={{
                                                    color: 'var(--pub-text)',
                                                    lineHeight: '1.5',
                                                }}
                                            >
                                                {title}
                                            </h4>
                                            <p
                                                className="text-sm leading-relaxed"
                                                style={{
                                                    color: 'var(--pub-text-sub)',
                                                }}
                                            >
                                                {desc}
                                            </p>
                                        </div>
                                    ),
                                )}
                            </div>

                            {/* Mobile: vertical timeline */}
                            <div className="relative flex flex-col gap-6 md:hidden">
                                <div
                                    aria-hidden
                                    className="absolute top-8 bottom-8 left-6 w-px"
                                    style={{
                                        backgroundColor: 'var(--pub-border)',
                                        opacity: 0.5,
                                    }}
                                />
                                {T[lang].howItWorksSteps.map(
                                    ({ step, title, desc }) => (
                                        <div
                                            key={step}
                                            className="relative z-10 flex items-start gap-5"
                                        >
                                            <span
                                                className="pub-heading flex size-12 shrink-0 items-center justify-center rounded-full text-xl font-bold"
                                                style={{
                                                    backgroundColor:
                                                        'var(--pub-rose-fixed)',
                                                    color: 'var(--pub-rose)',
                                                }}
                                            >
                                                {step}
                                            </span>
                                            <div className="pt-2">
                                                <h4
                                                    className="font-semibold"
                                                    style={{
                                                        color: 'var(--pub-text)',
                                                        lineHeight: '1.5',
                                                    }}
                                                >
                                                    {title}
                                                </h4>
                                                <p
                                                    className="mt-1 text-sm leading-relaxed"
                                                    style={{
                                                        color: 'var(--pub-text-sub)',
                                                    }}
                                                >
                                                    {desc}
                                                </p>
                                            </div>
                                        </div>
                                    ),
                                )}
                            </div>
                        </div>
                    </section>

                    {/* ══ ABOUT, AREA, TERMS ═════════════════════════════════ */}
                    <section
                        className="px-5 py-14 md:px-10 md:py-16"
                        style={{ backgroundColor: 'rgba(255,248,241,0.5)' }}
                    >
                        <div className="mx-auto max-w-[1200px]">
                            <p
                                className="mb-8 text-center text-[11px] font-bold tracking-[0.22em] uppercase"
                                style={{ color: '#9CAF88' }}
                            >
                                {lang === 'id'
                                    ? 'Info Layanan'
                                    : 'Service Info'}
                            </p>
                            <div className="grid grid-cols-1 gap-4 md:grid-cols-3 md:gap-6">
                                {/* About */}
                                <div
                                    className="rounded-2xl p-6"
                                    style={{
                                        backgroundColor: '#FFF',
                                        border: '1px solid rgba(223,168,168,0.22)',
                                    }}
                                >
                                    <h3
                                        className="pub-heading mb-3 text-base font-semibold"
                                        style={{ color: '#DFA8A8' }}
                                    >
                                        {T[lang].aboutTitle}
                                    </h3>
                                    <p
                                        className="text-sm leading-[1.75]"
                                        style={{ color: '#7A716A' }}
                                    >
                                        {T[lang].aboutText}
                                    </p>
                                </div>
                                {/* Area */}
                                <div
                                    className="rounded-2xl p-6"
                                    style={{
                                        backgroundColor: '#FFF',
                                        border: '1px solid rgba(223,168,168,0.22)',
                                    }}
                                >
                                    <h3
                                        className="pub-heading mb-3 text-base font-semibold"
                                        style={{ color: '#DFA8A8' }}
                                    >
                                        {T[lang].areaTitle}
                                    </h3>
                                    <p
                                        className="text-sm leading-[1.75]"
                                        style={{ color: '#7A716A' }}
                                    >
                                        {T[lang].areaText}
                                    </p>
                                </div>
                                {/* Terms */}
                                <div
                                    className="rounded-2xl p-6"
                                    style={{
                                        backgroundColor: '#FFF',
                                        border: '1px solid rgba(223,168,168,0.22)',
                                    }}
                                >
                                    <h3
                                        className="pub-heading mb-3 text-base font-semibold"
                                        style={{ color: '#DFA8A8' }}
                                    >
                                        {T[lang].termsTitle}
                                    </h3>
                                    <p
                                        className="text-sm leading-[1.75]"
                                        style={{ color: '#7A716A' }}
                                    >
                                        {T[lang].termsText}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* ══ FAQ ════════════════════════════════════════════════ */}
                    <section className="px-5 py-14 md:px-10 md:py-20">
                        <div className="mx-auto max-w-[800px]">
                            <h2
                                className="pub-heading mb-10 text-center text-2xl font-semibold md:text-3xl"
                                style={{ color: 'var(--pub-text)' }}
                            >
                                {T[lang].faqTitle}
                            </h2>
                            <div
                                className="flex flex-col divide-y"
                                style={{
                                    borderColor: 'rgba(204,195,212,0.35)',
                                }}
                            >
                                {T[lang].faqItems.map((item, idx) => {
                                    const isOpen = activeFaq === idx;

                                    return (
                                        <div key={idx}>
                                            <button
                                                onClick={() =>
                                                    setActiveFaq(
                                                        isOpen ? null : idx,
                                                    )
                                                }
                                                className="flex w-full items-center justify-between gap-4 py-5 text-left transition-colors"
                                                style={{
                                                    color: 'var(--pub-text)',
                                                }}
                                            >
                                                <span className="text-sm font-semibold md:text-base">
                                                    {item.q}
                                                </span>
                                                <ChevronDown
                                                    className={`size-4 shrink-0 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}
                                                    style={{ color: '#DFA8A8' }}
                                                />
                                            </button>
                                            <div
                                                className={`overflow-hidden transition-all duration-300 ease-in-out ${isOpen ? 'max-h-96 pb-5 opacity-100' : 'max-h-0 opacity-0'}`}
                                            >
                                                <p
                                                    className="text-sm leading-[1.75]"
                                                    style={{ color: '#7A716A' }}
                                                >
                                                    {item.a}
                                                </p>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </section>

                    {/* ══ FINAL CTA ══════════════════════════════════════════ */}
                    <section className="px-5 py-16 md:px-10 md:py-20">
                        <div
                            className="mx-auto flex max-w-[1200px] flex-col items-center justify-between gap-8 overflow-hidden rounded-[2rem] p-10 md:flex-row md:p-14"
                            style={{
                                background:
                                    'linear-gradient(135deg, #FFF3EC 0%, #FAE8E8 60%, #F3E8FF 100%)',
                                border: '1px solid rgba(255,255,255,0.8)',
                            }}
                        >
                            <div>
                                <h2
                                    className="pub-heading mb-3 text-2xl font-semibold md:text-3xl"
                                    style={{
                                        color: '#2E2A27',
                                        letterSpacing: '-0.02em',
                                    }}
                                >
                                    {T[lang].finalCtaTitle}
                                </h2>
                                <p
                                    className="text-sm leading-relaxed md:text-base"
                                    style={{ color: '#7A716A' }}
                                >
                                    {T[lang].finalCtaDesc}
                                </p>
                            </div>
                            <Link
                                href={bookingShow()}
                                className="inline-flex shrink-0 items-center justify-center rounded-full px-9 py-4 text-sm font-bold text-white shadow-lg transition-transform hover:-translate-y-0.5 hover:shadow-xl"
                                style={{ backgroundColor: '#B98CFF' }}
                            >
                                {T[lang].heroCta}
                            </Link>
                        </div>
                    </section>

                    {services.length === 0 && (
                        <section className="py-12 text-center">
                            <Link
                                href={bookingShow()}
                                className="inline-block rounded-full px-10 py-4 text-sm font-semibold text-white shadow-md transition-all hover:-translate-y-1"
                                style={{ backgroundColor: 'var(--pub-cta)' }}
                            >
                                {T[lang].bookSession}
                            </Link>
                        </section>
                    )}
                </main>

                {/* ══ FOOTER ═════════════════════════════════════════════ */}
                <footer
                    className="relative z-10 mt-auto w-full rounded-t-xl"
                    style={{ backgroundColor: 'var(--pub-surface-low)' }}
                >
                    <div className="mx-auto flex max-w-[1200px] flex-col items-start justify-between gap-8 px-5 py-16 md:flex-row md:px-10">
                        <div className="flex max-w-xs flex-col gap-3">
                            <span
                                className="pub-heading text-2xl font-semibold"
                                style={{ color: 'var(--pub-rose)' }}
                            >
                                Home Care Therapy
                            </span>
                            <p
                                className="text-sm leading-relaxed"
                                style={{
                                    color: 'var(--pub-text-sub)',
                                    opacity: 0.8,
                                }}
                            >
                                © {currentYear} Home Care Therapy Service.{' '}
                                {T[lang].footerDesc}
                            </p>
                        </div>

                        <div className="grid grid-cols-2 gap-8">
                            <div className="flex flex-col gap-3">
                                <h4
                                    className="mb-2 text-sm font-bold tracking-wider uppercase"
                                    style={{ color: 'var(--pub-rose)' }}
                                >
                                    {T[lang].explore}
                                </h4>
                                <Link
                                    href={bookingShow()}
                                    className="text-sm transition-all hover:opacity-70"
                                    style={{ color: 'var(--pub-text-sub)' }}
                                >
                                    {T[lang].bookSession}
                                </Link>
                                <a
                                    href="#services"
                                    className="text-sm transition-all hover:opacity-70"
                                    style={{ color: 'var(--pub-text-sub)' }}
                                >
                                    {T[lang].ourOfferings}
                                </a>
                            </div>
                            <div className="flex flex-col gap-3">
                                <h4
                                    className="mb-2 text-sm font-bold tracking-wider uppercase"
                                    style={{ color: 'var(--pub-rose)' }}
                                >
                                    {T[lang].support}
                                </h4>
                                <a
                                    href="#"
                                    onClick={(e) => {
                                        e.preventDefault();
                                        window.scrollTo({
                                            top: 0,
                                            behavior: 'smooth',
                                        });
                                    }}
                                    className="text-sm transition-all hover:opacity-70"
                                    style={{ color: 'var(--pub-text-sub)' }}
                                >
                                    {T[lang].backToTop}
                                </a>
                            </div>
                        </div>
                    </div>
                    {/* Mobile sticky booking CTA */}
                    <div
                        className="fixed inset-x-0 bottom-0 z-50 border-t bg-white/80 px-5 py-3 backdrop-blur-md md:hidden"
                        style={{ borderColor: 'rgba(204,195,212,0.45)' }}
                    >
                        <Link
                            href={bookingShow()}
                            className="block w-full rounded-full py-3.5 text-center text-sm font-semibold text-white shadow-lg"
                            style={{ backgroundColor: 'var(--pub-cta)' }}
                        >
                            {T[lang].heroCta}
                        </Link>
                    </div>
                </footer>
            </div>
        </>
    );
}
