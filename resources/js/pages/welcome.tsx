import { Head, Link } from '@inertiajs/react';
import { Clock, Home, MessageCircle, ShieldCheck } from 'lucide-react';
import { show as bookingShow } from '@/routes/booking';

type Service = {
    id: number;
    name: string;
    description: string | null;
    duration_minutes: number;
    price: number;
};

function formatPrice(price: number): string {
    return `Rp ${price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.')}`;
}

const HOW_IT_WORKS = [
    { step: 1, title: 'Select Service', desc: 'Choose your preferred relaxation style.' },
    { step: 2, title: 'Pick a Time', desc: 'Find a slot that fits your evening.' },
    { step: 3, title: 'Fill Your Address', desc: 'Enter your home address so we can come to you.' },
    { step: 4, title: 'Wait for Confirmation', desc: "We'll send confirmation and next steps via WhatsApp." },
];

const TRUST_ITEMS = [
    { icon: ShieldCheck, title: 'Your comfort and safety come first', desc: 'Your address is only used for this appointment.' },
    { icon: Home, title: 'At your doorstep', desc: 'Our therapist comes to you — no clinic visit needed.' },
    { icon: Clock, title: 'Flexible scheduling', desc: 'Choose your date, time, and service combination.' },
    { icon: MessageCircle, title: 'Confirmation by WhatsApp', desc: "We'll contact you once your booking is reviewed." },
];

const HERO_GRADIENT = 'linear-gradient(160deg, #EFE6E2 0%, #F5ECE7 40%, #FFDAD9 80%, #F1B8B8 100%)';
const CARD_GRADIENT = 'linear-gradient(160deg, #EFE6E2 0%, #F5ECE7 60%, #FFDAD9 100%)';

export default function Welcome({ services }: { services: Service[] }) {
    const currentYear = new Date().getFullYear();

    return (
        <>
            <Head>
                <title>Home Care Therapy — Professional Home Visit Therapy</title>
                <meta
                    name="description"
                    content="Book a calm therapy session at home. Designed for women and couples who want care without leaving home."
                />
            </Head>

            <div className="public-page relative min-h-screen overflow-x-hidden">

                {/* Ambient blobs */}
                <div aria-hidden className="pub-blob pub-blob-rose fixed -right-24 -top-24 h-[500px] w-[500px]" />
                <div aria-hidden className="pub-blob pub-blob-lavender fixed -left-28 top-[42%] h-[380px] w-[380px]" />

                {/* ── Header ──────────────────────────────────────────── */}
                <header
                    className="sticky top-0 z-50 w-full"
                    style={{
                        backgroundColor: 'rgba(255,248,241,0.95)',
                        backdropFilter: 'blur(12px)',
                        WebkitBackdropFilter: 'blur(12px)',
                    }}
                >
                    <div className="mx-auto flex max-w-[1200px] items-center justify-between px-5 py-4 md:px-10">
                        <div className="flex items-center gap-2">
                            <span className="text-2xl" style={{ color: 'var(--pub-lavender)' }}>✦</span>
                            <span
                                className="pub-heading text-xl font-semibold italic md:text-2xl"
                                style={{ color: 'var(--pub-lavender)' }}
                            >
                                Home Care Therapy
                            </span>
                        </div>

                        {/* Desktop nav */}
                        <nav className="hidden items-center gap-6 md:flex">
                            <span
                                className="border-b-2 pb-0.5 text-sm font-bold"
                                style={{ color: 'var(--pub-lavender)', borderColor: 'var(--pub-lavender)' }}
                            >
                                Home
                            </span>
                            <Link
                                href={bookingShow()}
                                className="text-sm font-semibold tracking-wide transition-colors hover:opacity-70"
                                style={{ color: 'var(--pub-text-sub)' }}
                            >
                                Book
                            </Link>
                        </nav>

                        {/* Mobile: pill CTA */}
                        <Link
                            href={bookingShow()}
                            className="rounded-full px-5 py-2 text-sm font-semibold text-white transition-all hover:-translate-y-0.5 md:hidden"
                            style={{ backgroundColor: 'var(--pub-cta)' }}
                        >
                            Book
                        </Link>
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
                                <span style={{ color: 'var(--pub-sage)' }}>✦</span>
                                A Sanctuary for Your Soul
                            </div>

                            <h1
                                className="pub-heading text-5xl font-semibold leading-tight"
                                style={{ color: 'var(--pub-text)', letterSpacing: '-0.02em' }}
                            >
                                Find your quiet space<br />in a loud world.
                            </h1>

                            <p
                                className="max-w-md text-lg leading-relaxed"
                                style={{ color: 'var(--pub-text-sub)', lineHeight: '1.6' }}
                            >
                                Tired after work? Book a calm therapy session at home.
                                Designed for women and couples who want care without leaving home.
                            </p>

                            <Link
                                href={bookingShow()}
                                className="rounded-full px-8 py-4 text-sm font-semibold text-white shadow-md transition-all hover:-translate-y-1 hover:shadow-lg"
                                style={{ backgroundColor: 'var(--pub-cta)' }}
                            >
                                Begin Your Journey
                            </Link>
                        </div>

                        {/* Right: hero image container */}
                        <div className="relative w-1/2">
                            <div
                                className="relative overflow-hidden rounded-xl"
                                style={{
                                    background: HERO_GRADIENT,
                                    aspectRatio: '4/3',
                                    boxShadow: '0 10px 40px -10px rgba(114,70,180,0.1)',
                                }}
                            >
                                <div
                                    aria-hidden
                                    style={{
                                        position: 'absolute', top: '-20%', right: '-10%',
                                        width: '300px', height: '300px',
                                        background: '#DFA8A8', opacity: 0.12,
                                        filter: 'blur(40px)', borderRadius: '50%',
                                    }}
                                />
                                <div
                                    aria-hidden
                                    style={{
                                        position: 'absolute', bottom: '-10%', left: '-10%',
                                        width: '240px', height: '240px',
                                        background: '#ECDCFF', opacity: 0.3,
                                        filter: 'blur(35px)', borderRadius: '50%',
                                    }}
                                />
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <span
                                        className="pub-heading text-2xl italic opacity-20"
                                        style={{ color: 'var(--pub-rose)' }}
                                    >
                                        Cozy wellness setting
                                    </span>
                                </div>
                            </div>

                            {/* Floating badge */}
                            <div className="pub-card-solid absolute -bottom-5 -left-5 flex items-center gap-3 rounded-xl px-4 py-3">
                                <div
                                    className="flex size-11 shrink-0 items-center justify-center rounded-full"
                                    style={{ backgroundColor: 'var(--pub-cta-fixed)' }}
                                >
                                    <span style={{ fontSize: '20px', color: 'var(--pub-lavender)' }}>♡</span>
                                </div>
                                <div>
                                    <p className="text-sm font-semibold" style={{ color: 'var(--pub-text)' }}>Your safety first</p>
                                    <p className="text-xs" style={{ color: 'var(--pub-text-muted)' }}>by our community</p>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* ══ MOBILE HERO ════════════════════════════════════════ */}
                    <section className="relative px-5 pb-16 pt-6 md:hidden">
                        <div
                            className="relative h-[400px] w-full overflow-hidden rounded-3xl"
                            style={{
                                background: HERO_GRADIENT,
                                boxShadow: '0 10px 30px -8px rgba(114,70,180,0.1)',
                            }}
                        >
                            <div
                                aria-hidden
                                style={{
                                    position: 'absolute', top: '-15%', right: '-15%',
                                    width: '250px', height: '250px',
                                    background: '#DFA8A8', opacity: 0.15,
                                    filter: 'blur(35px)', borderRadius: '50%',
                                }}
                            />
                            <div
                                className="absolute inset-0"
                                style={{
                                    background: 'linear-gradient(to top, rgba(255,248,241,0.92) 0%, rgba(255,248,241,0.45) 50%, transparent 100%)',
                                }}
                            />
                            <div className="absolute bottom-0 left-0 flex w-full flex-col items-center p-6 pb-8 text-center">
                                <h2
                                    className="pub-heading mb-3 max-w-[280px] text-3xl font-semibold"
                                    style={{ color: 'var(--pub-text)' }}
                                >
                                    Tired after work?
                                </h2>
                                <p
                                    className="mb-6 max-w-[300px] text-sm leading-relaxed"
                                    style={{ color: 'var(--pub-text-sub)' }}
                                >
                                    Book a calm therapy session at home. Designed for women
                                    and couples who want care without leaving home.
                                </p>
                                <Link
                                    href={bookingShow()}
                                    className="w-full max-w-[240px] rounded-full py-4 text-sm font-semibold text-white shadow-md transition-all hover:-translate-y-1"
                                    style={{ backgroundColor: 'var(--pub-cta)' }}
                                >
                                    Book Now
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
                                <div key={title} className="flex flex-col items-center gap-3 text-center">
                                    <Icon className="size-8" style={{ color: 'var(--pub-sage)' }} />
                                    <h3 className="text-base font-semibold" style={{ color: 'var(--pub-text)', lineHeight: '1.5' }}>
                                        {title}
                                    </h3>
                                    <p className="text-sm leading-relaxed" style={{ color: 'var(--pub-text-sub)' }}>
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
                                        Our Gentle Offerings
                                    </h2>
                                    <p
                                        className="mx-auto max-w-2xl text-lg leading-relaxed"
                                        style={{ color: 'var(--pub-text-sub)', lineHeight: '1.6' }}
                                    >
                                        Professional home therapy services designed to help you
                                        disconnect from stress and reconnect with your softest self.
                                    </p>
                                </div>

                                <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
                                    {services.map((service) => (
                                        <div
                                            key={service.id}
                                            className="pub-card-solid pub-hover-lift flex flex-col overflow-hidden rounded-xl"
                                        >
                                            {/* h-48 image area — matches reference proportions */}
                                            <div
                                                className="relative h-48 w-full overflow-hidden"
                                                style={{ background: CARD_GRADIENT }}
                                            >
                                                <div
                                                    aria-hidden
                                                    style={{
                                                        position: 'absolute', top: '-20%', right: '-10%',
                                                        width: '180px', height: '180px',
                                                        background: '#DFA8A8', opacity: 0.13,
                                                        filter: 'blur(30px)', borderRadius: '50%',
                                                    }}
                                                />
                                            </div>

                                            <div className="flex flex-grow flex-col p-6">
                                                {/* Name + duration badge — matches reference layout */}
                                                <div className="mb-4 flex items-start justify-between gap-3">
                                                    <h3
                                                        className="pub-heading text-2xl leading-snug"
                                                        style={{ color: 'var(--pub-text)', fontWeight: 500, lineHeight: '1.3' }}
                                                    >
                                                        {service.name}
                                                    </h3>
                                                    <span
                                                        className="shrink-0 rounded-full px-3 py-1 text-xs font-semibold"
                                                        style={{
                                                            backgroundColor: 'rgba(241,184,184,0.2)',
                                                            color: 'var(--pub-text-sub)',
                                                        }}
                                                    >
                                                        {service.duration_minutes} Min
                                                    </span>
                                                </div>

                                                {service.description && (
                                                    <p
                                                        className="mb-6 flex-grow text-sm leading-relaxed"
                                                        style={{ color: 'var(--pub-text-sub)', lineHeight: '1.6' }}
                                                    >
                                                        {service.description}
                                                    </p>
                                                )}

                                                <p className="mb-4 text-base font-semibold" style={{ color: 'var(--pub-lavender)' }}>
                                                    {formatPrice(service.price)}
                                                </p>

                                                {/* Outlined button — matches reference "Learn More" style */}
                                                <Link
                                                    href={bookingShow()}
                                                    className="w-full rounded-full py-3 text-center text-sm font-semibold transition-all hover:opacity-80"
                                                    style={{
                                                        border: '1px solid var(--pub-border)',
                                                        color: 'var(--pub-lavender)',
                                                    }}
                                                >
                                                    Book Now
                                                </Link>
                                            </div>
                                        </div>
                                    ))}
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
                                How it works
                            </h2>

                            {/* Desktop: 4 columns */}
                            <div className="hidden gap-6 md:grid md:grid-cols-4">
                                {HOW_IT_WORKS.map(({ step, title, desc }) => (
                                    <div key={step} className="flex flex-col items-center gap-3 text-center">
                                        <span
                                            className="pub-heading flex size-12 items-center justify-center rounded-full text-xl font-bold"
                                            style={{ backgroundColor: 'var(--pub-rose-fixed)', color: 'var(--pub-rose)' }}
                                        >
                                            {step}
                                        </span>
                                        <h4 className="text-base font-semibold" style={{ color: 'var(--pub-text)', lineHeight: '1.5' }}>
                                            {title}
                                        </h4>
                                        <p className="text-sm leading-relaxed" style={{ color: 'var(--pub-text-sub)' }}>
                                            {desc}
                                        </p>
                                    </div>
                                ))}
                            </div>

                            {/* Mobile: vertical timeline */}
                            <div className="relative flex flex-col gap-6 md:hidden">
                                <div
                                    aria-hidden
                                    className="absolute bottom-8 left-6 top-8 w-px"
                                    style={{ backgroundColor: 'var(--pub-border)', opacity: 0.5 }}
                                />
                                {HOW_IT_WORKS.map(({ step, title, desc }) => (
                                    <div key={step} className="relative z-10 flex items-start gap-5">
                                        <span
                                            className="pub-heading flex size-12 shrink-0 items-center justify-center rounded-full text-xl font-bold"
                                            style={{ backgroundColor: 'var(--pub-rose-fixed)', color: 'var(--pub-rose)' }}
                                        >
                                            {step}
                                        </span>
                                        <div className="pt-2">
                                            <h4 className="font-semibold" style={{ color: 'var(--pub-text)', lineHeight: '1.5' }}>
                                                {title}
                                            </h4>
                                            <p className="mt-1 text-sm leading-relaxed" style={{ color: 'var(--pub-text-sub)' }}>
                                                {desc}
                                            </p>
                                        </div>
                                    </div>
                                ))}
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
                                Book a Session
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
                            <p className="text-sm leading-relaxed" style={{ color: 'var(--pub-text-sub)', opacity: 0.8 }}>
                                © {currentYear} Home Care Therapy Service.
                                A sanctuary at your doorstep.
                            </p>
                        </div>

                        <div className="grid grid-cols-2 gap-8">
                            <div className="flex flex-col gap-3">
                                <h4
                                    className="mb-2 text-sm font-bold uppercase tracking-wider"
                                    style={{ color: 'var(--pub-rose)' }}
                                >
                                    Explore
                                </h4>
                                <Link
                                    href={bookingShow()}
                                    className="text-sm transition-all hover:opacity-70"
                                    style={{ color: 'var(--pub-text-sub)' }}
                                >
                                    Book a Session
                                </Link>
                                <a
                                    href="#services"
                                    className="text-sm transition-all hover:opacity-70"
                                    style={{ color: 'var(--pub-text-sub)' }}
                                >
                                    Our Services
                                </a>
                            </div>
                            <div className="flex flex-col gap-3">
                                <h4
                                    className="mb-2 text-sm font-bold uppercase tracking-wider"
                                    style={{ color: 'var(--pub-rose)' }}
                                >
                                    Support
                                </h4>
                                <a
                                    href="#"
                                    onClick={(e) => {
                                        e.preventDefault(); window.scrollTo({ top: 0, behavior: 'smooth' });
                                    }}
                                    className="text-sm transition-all hover:opacity-70"
                                    style={{ color: 'var(--pub-text-sub)' }}
                                >
                                    Back to Top
                                </a>
                            </div>
                        </div>
                    </div>
                </footer>
            </div>
        </>
    );
}
