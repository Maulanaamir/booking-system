import { Head, Link } from '@inertiajs/react';
import {
    ChevronDown,
    Clock,
    Home,
    MessageCircle,
    ShieldCheck,
} from 'lucide-react';
import { useState } from 'react';
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

    if (name.includes('ibu nifas') || name.includes('postnatal') || name.includes('postpartum')) {
        return '/images/services/ibu-nifas.png';
    }

    if (name.includes('bekam') || name.includes('cupping')) {
        return '/images/services/bekam.png';
    }

    return null;
}
const HERO_GRADIENT =
    'linear-gradient(160deg, #EFE6E2 0%, #F5ECE7 40%, #FFDAD9 80%, #F1B8B8 100%)';
const CARD_GRADIENT =
    'linear-gradient(160deg, #EFE6E2 0%, #F5ECE7 60%, #FFDAD9 100%)';

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
                        ? 'Home Care Therapy — Terapi Panggilan Profesional di Rumah'
                        : 'Home Care Therapy — Professional Home Visit Therapy'}
                </title>
                <meta name="description" content={T[lang].heroDesc} />
            </Head>

            <div
                id="top"
                className="public-page relative min-h-screen overflow-x-hidden pb-20 md:pb-0"
            >
                {/* Ambient blobs */}
                <div
                    aria-hidden
                    className="pub-blob pub-blob-rose fixed -top-24 -right-24 h-[500px] w-[500px]"
                />
                <div
                    aria-hidden
                    className="pub-blob pub-blob-lavender fixed top-[42%] -left-28 h-[380px] w-[380px]"
                />

                {/* ── Header ──────────────────────────────────────────── */}
                <header
                    className="sticky top-0 z-50 w-full border-b"
                    style={{
                        backgroundColor: 'rgba(255,248,241,0.92)',
                        borderColor: 'rgba(204,195,212,0.4)',
                        backdropFilter: 'blur(14px)',
                        WebkitBackdropFilter: 'blur(14px)',
                    }}
                >
                    <div className="mx-auto flex max-w-[1200px] items-center justify-between px-5 py-4 md:px-10">
                        {/* Brand */}
                        <Link
                            href="/"
                            className="flex min-w-0 items-center gap-2.5"
                        >
                            <span
                                className="flex size-8 shrink-0 items-center justify-center rounded-full text-xs"
                                style={{
                                    backgroundColor: 'var(--pub-cta-fixed)',
                                    color: 'var(--pub-lavender)',
                                }}
                            >
                                ✦
                            </span>

                            <span
                                className="pub-heading truncate text-lg font-semibold italic md:text-2xl"
                                style={{ color: 'var(--pub-lavender)' }}
                            >
                                Home Care Therapy
                            </span>
                        </Link>

                        {/* Desktop nav */}
                        <div className="hidden items-center gap-7 md:flex">
                            <nav className="flex items-center gap-6">
                                <a
                                    href="#top"
                                    className="border-b-2 pb-1 text-sm font-bold"
                                    style={{
                                        color: 'var(--pub-lavender)',
                                        borderColor: 'var(--pub-lavender)',
                                    }}
                                >
                                    {T[lang].home}
                                </a>

                                <a
                                    href="#services"
                                    className="text-sm font-semibold transition-opacity hover:opacity-70"
                                    style={{ color: 'var(--pub-text-sub)' }}
                                >
                                    {T[lang].ourOfferings}
                                </a>

                                <Link
                                    href={bookingShow()}
                                    className="text-sm font-semibold transition-opacity hover:opacity-70"
                                    style={{ color: 'var(--pub-text-sub)' }}
                                >
                                    {T[lang].book}
                                </Link>
                            </nav>

                            {/* Desktop language selector */}
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

                        {/* Mobile language selector only */}
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
                    {/* ══ DESKTOP HERO ═══════════════════════════════════════ */}
                    <section className="mx-auto hidden max-w-[1200px] items-center justify-between gap-12 px-10 py-20 md:flex">
                        {/* Left: text */}
                        <div className="flex w-1/2 flex-col items-start gap-6">
                            <div
                                className="inline-flex items-center gap-2 rounded-full px-4 py-2 text-xs font-semibold"
                                style={{
                                    backgroundColor: 'rgba(241,184,184,0.2)',
                                    color: 'var(--pub-rose)',
                                    letterSpacing: '0.05em',
                                }}
                            >
                                <span style={{ color: 'var(--pub-sage)' }}>
                                    ✦
                                </span>
                                {T[lang].heroSub}
                            </div>

                            <h1
                                className="pub-heading text-5xl leading-tight font-semibold"
                                style={{
                                    color: 'var(--pub-text)',
                                    letterSpacing: '-0.02em',
                                }}
                            >
                                {T[lang].heroTitle}
                            </h1>

                            <p
                                className="max-w-md text-lg leading-relaxed"
                                style={{
                                    color: 'var(--pub-text-sub)',
                                    lineHeight: '1.6',
                                }}
                            >
                                {T[lang].heroDesc}
                            </p>

                            <Link
                                href={bookingShow()}
                                className="rounded-full px-8 py-4 text-sm font-semibold text-white shadow-md transition-all hover:-translate-y-1 hover:shadow-lg"
                                style={{ backgroundColor: 'var(--pub-cta)' }}
                            >
                                {T[lang].heroCta}
                            </Link>
                        </div>

                        {/* Right: hero image container */}
                        <div className="relative w-1/2">
                            <div
                                className="relative overflow-hidden rounded-xl"
                                style={{
                                    background: HERO_GRADIENT,
                                    aspectRatio: '4/3',
                                    boxShadow:
                                        '0 10px 40px -10px rgba(114,70,180,0.1)',
                                }}
                            >
                                <img
                                    src="/images/landing/hero.webp"
                                    alt="Cozy wellness setting"
                                    className="h-full w-full object-cover"
                                    onError={(e) => {
                                        e.currentTarget.style.display = 'none';
                                    }}
                                />
                                <div
                                    aria-hidden
                                    style={{
                                        position: 'absolute',
                                        top: '-20%',
                                        right: '-10%',
                                        width: '300px',
                                        height: '300px',
                                        background: '#DFA8A8',
                                        opacity: 0.12,
                                        filter: 'blur(40px)',
                                        borderRadius: '50%',
                                    }}
                                />
                                <div
                                    aria-hidden
                                    style={{
                                        position: 'absolute',
                                        bottom: '-10%',
                                        left: '-10%',
                                        width: '240px',
                                        height: '240px',
                                        background: '#ECDCFF',
                                        opacity: 0.3,
                                        filter: 'blur(35px)',
                                        borderRadius: '50%',
                                    }}
                                />
                                <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
                                    <span
                                        className="pub-heading text-2xl italic opacity-20"
                                        style={{ color: 'var(--pub-rose)' }}
                                    >
                                        {T[lang].cozyWellnessSetting}
                                    </span>
                                </div>
                            </div>

                            {/* Floating badge */}
                            <div className="pub-card-solid absolute -bottom-5 -left-5 flex items-center gap-3 rounded-xl px-4 py-3">
                                <div
                                    className="flex size-11 shrink-0 items-center justify-center rounded-full"
                                    style={{
                                        backgroundColor: 'var(--pub-cta-fixed)',
                                    }}
                                >
                                    <span
                                        style={{
                                            fontSize: '20px',
                                            color: 'var(--pub-lavender)',
                                        }}
                                    >
                                        ♡
                                    </span>
                                </div>
                                <div>
                                    <p
                                        className="text-sm font-semibold"
                                        style={{ color: 'var(--pub-text)' }}
                                    >
                                        {T[lang].safetyFirstTitle}
                                    </p>
                                    <p
                                        className="text-xs"
                                        style={{
                                            color: 'var(--pub-text-muted)',
                                        }}
                                    >
                                        {T[lang].safetyFirstSub}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* ══ MOBILE HERO ════════════════════════════════════════ */}
                    <section className="relative px-5 pt-6 pb-16 md:hidden">
                        <div
                            className="relative h-[400px] w-full overflow-hidden rounded-3xl"
                            style={{
                                background: HERO_GRADIENT,
                                boxShadow:
                                    '0 10px 30px -8px rgba(114,70,180,0.1)',
                            }}
                        >
                            <img
                                src="/images/landing/hero.webp"
                                alt="Cozy wellness setting"
                                className="absolute inset-0 h-full w-full object-cover"
                                onError={(e) => {
                                    e.currentTarget.style.display = 'none';
                                }}
                            />
                            <div
                                aria-hidden
                                style={{
                                    position: 'absolute',
                                    top: '-15%',
                                    right: '-15%',
                                    width: '250px',
                                    height: '250px',
                                    background: '#DFA8A8',
                                    opacity: 0.15,
                                    filter: 'blur(35px)',
                                    borderRadius: '50%',
                                }}
                            />
                            <div
                                className="absolute inset-0"
                                style={{
                                    background:
                                        'linear-gradient(to top, rgba(255,248,241,0.92) 0%, rgba(255,248,241,0.45) 50%, transparent 100%)',
                                }}
                            />
                            <div className="absolute bottom-0 left-0 flex w-full flex-col items-center p-6 pb-8 text-center">
                                <h2
                                    className="pub-heading mb-3 max-w-[280px] text-3xl font-semibold"
                                    style={{ color: 'var(--pub-text)' }}
                                >
                                    {T[lang].heroTitle}
                                </h2>
                                <p
                                    className="mb-6 max-w-[300px] text-sm leading-relaxed"
                                    style={{ color: 'var(--pub-text-sub)' }}
                                >
                                    {T[lang].heroDesc}
                                </p>
                                <Link
                                    href={bookingShow()}
                                    className="w-full max-w-[240px] rounded-full py-4 text-sm font-semibold text-white shadow-md transition-all hover:-translate-y-1"
                                    style={{
                                        backgroundColor: 'var(--pub-cta)',
                                    }}
                                >
                                    {T[lang].heroCta}
                                </Link>
                            </div>
                        </div>
                    </section>

                    {/* ══ TRUST STRIP ════════════════════════════════════════ */}
                    <section
                        className="py-12"
                        style={{
                            borderTop: '1px solid rgba(204,195,212,0.4)',
                            borderBottom: '1px solid rgba(204,195,212,0.4)',
                        }}
                    >
                        <div className="mx-auto grid max-w-[1200px] grid-cols-1 gap-8 px-5 sm:grid-cols-2 md:grid-cols-4 md:px-10">
                            {TRUST_ITEMS.map(({ icon: Icon, title, desc }) => (
                                <div
                                    key={title}
                                    className="flex flex-col items-center gap-3 text-center"
                                >
                                    <Icon
                                        className="size-8"
                                        style={{ color: 'var(--pub-sage)' }}
                                    />
                                    <h3
                                        className="text-base font-semibold"
                                        style={{
                                            color: 'var(--pub-text)',
                                            lineHeight: '1.5',
                                        }}
                                    >
                                        {title}
                                    </h3>
                                    <p
                                        className="text-sm leading-relaxed"
                                        style={{ color: 'var(--pub-text-sub)' }}
                                    >
                                        {desc}
                                    </p>
                                </div>
                            ))}
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
                                    {services.map((service) => {
                                        const serviceImg =
                                            getServiceImage(service);
                                        const serviceName = lang === 'en' && service.name_en ? service.name_en : service.name;
                                        const serviceDesc = lang === 'en' && service.description_en ? service.description_en : service.description;

                                        return (
                                            <div
                                                key={service.id}
                                                className="pub-card-solid pub-hover-lift flex flex-col overflow-hidden rounded-xl"
                                            >
                                                {/* h-40 image area */}
                                                <div
                                                    className="relative h-40 w-full overflow-hidden"
                                                    style={{
                                                        background:
                                                            CARD_GRADIENT,
                                                    }}
                                                >
                                                    {serviceImg && (
                                                        <>
                                                            <img
                                                                src={serviceImg}
                                                                alt={serviceName}
                                                                className="h-full w-full object-cover"
                                                                onError={(e) => {
                                                                    e.currentTarget.style.display =
                                                                        'none';
                                                                }}
                                                            />
                                                            {/* Soft warm overlay to blend image with brand colors */}
                                                            <div className="absolute inset-0 bg-[#fff8f1]/15 mix-blend-multiply pointer-events-none" />
                                                            <div className="absolute inset-0 bg-gradient-to-t from-[#f5ece7]/60 via-transparent to-transparent pointer-events-none" />
                                                        </>
                                                    )}
                                                    <div
                                                        aria-hidden
                                                        style={{
                                                            position:
                                                                'absolute',
                                                            top: '-20%',
                                                            right: '-10%',
                                                            width: '180px',
                                                            height: '180px',
                                                            background:
                                                                '#DFA8A8',
                                                            opacity: 0.13,
                                                            filter: 'blur(30px)',
                                                            borderRadius: '50%',
                                                        }}
                                                    />
                                                </div>

                                                <div className="flex flex-grow flex-col p-6">
                                                    {/* Name + duration badge */}
                                                    <div className="mb-4 flex items-start justify-between gap-3">
                                                        <h3
                                                            className="pub-heading text-2xl leading-snug"
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
                                                            className="shrink-0 rounded-full px-3 py-1 text-xs font-semibold"
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
                                                            className="mb-6 flex-grow text-sm leading-relaxed"
                                                            style={{
                                                                color: 'var(--pub-text-sub)',
                                                                lineHeight:
                                                                    '1.6',
                                                            }}
                                                        >
                                                            {
                                                                serviceDesc
                                                            }
                                                        </p>
                                                    )}

                                                    <p
                                                        className="mb-4 text-base font-semibold"
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
                                                        className="w-full rounded-full py-3 text-center text-sm font-semibold transition-all hover:opacity-80"
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
                            </div>
                        </section>
                    )}

                    {/* ══ HOW IT WORKS ═══════════════════════════════════════ */}
                    <section className="px-5 py-16 md:px-10 md:py-20">
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
