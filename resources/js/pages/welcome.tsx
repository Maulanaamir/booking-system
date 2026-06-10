import { Head, Link } from '@inertiajs/react';
import { Bell, CalendarDays, Clock, ListChecks, MapPin } from 'lucide-react';
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
    {
        step: 1,
        icon: ListChecks,
        title: 'Choose Your Service',
        desc: 'Select one or more therapy services that suit your needs.',
    },
    {
        step: 2,
        icon: CalendarDays,
        title: 'Pick Date & Time',
        desc: 'Choose a convenient schedule for your home visit.',
    },
    {
        step: 3,
        icon: MapPin,
        title: 'Fill Your Address',
        desc: 'Enter your home address so our therapist can come to you.',
    },
    {
        step: 4,
        icon: Bell,
        title: 'Wait for Confirmation',
        desc: 'We will contact you to confirm your booking and DP payment.',
    },
];

export default function Welcome({ services }: { services: Service[] }) {
    const currentYear = new Date().getFullYear();

    return (
        <>
            <Head>
                <title>Home Care Therapy — Professional Home Visit Therapy</title>
                <meta
                    name="description"
                    content="Book professional home care therapy services. Relaxation massage, physiotherapy, and more — delivered to your doorstep."
                />
            </Head>

            <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 text-slate-900 dark:from-slate-950 dark:to-slate-900 dark:text-slate-100">
                {/* ── Sticky Header ──────────────────────────────────────── */}
                <header className="sticky top-0 z-50 border-b border-slate-200/80 bg-white/80 backdrop-blur-md dark:border-slate-800/80 dark:bg-slate-950/80">
                    <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-4">
                        <span className="text-base font-semibold tracking-tight text-slate-900 dark:text-slate-100">
                            Home Care Therapy
                        </span>
                        <Link
                            href={bookingShow()}
                            className="rounded-full bg-violet-600 px-5 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-violet-700 dark:bg-violet-700 dark:hover:bg-violet-600"
                        >
                            Book Now
                        </Link>
                    </div>
                </header>

                <main>
                    {/* ── Hero ─────────────────────────────────────────────── */}
                    <section className="relative overflow-hidden px-4 py-20 sm:py-28">
                        {/* Background decoration */}
                        <div
                            aria-hidden
                            className="pointer-events-none absolute -top-32 -right-32 size-96 rounded-full bg-violet-200/50 blur-3xl dark:bg-violet-900/20"
                        />
                        <div
                            aria-hidden
                            className="pointer-events-none absolute -bottom-24 -left-24 size-72 rounded-full bg-teal-200/40 blur-3xl dark:bg-teal-900/15"
                        />

                        <div className="relative mx-auto max-w-3xl text-center">
                            <span className="mb-4 inline-block rounded-full border border-violet-200 bg-violet-50 px-3 py-1 text-xs font-semibold tracking-wider text-violet-700 uppercase dark:border-violet-800 dark:bg-violet-900/30 dark:text-violet-400">
                                Home Visit · No Registration Required
                            </span>

                            <h1 className="mt-4 text-4xl font-bold leading-tight tracking-tight text-slate-900 sm:text-5xl dark:text-white">
                                Professional Therapy,{' '}
                                <span className="text-violet-600 dark:text-violet-400">
                                    At Your Doorstep
                                </span>
                            </h1>

                            <p className="mx-auto mt-5 max-w-xl text-lg text-slate-600 dark:text-slate-400">
                                Book a qualified home care therapist in minutes.
                                No clinic visit needed — we come to you.
                            </p>

                            <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
                                <Link
                                    href={bookingShow()}
                                    className="w-full rounded-xl bg-violet-600 px-8 py-3.5 text-sm font-semibold text-white shadow-md transition hover:bg-violet-700 sm:w-auto dark:bg-violet-700 dark:hover:bg-violet-600"
                                >
                                    Book a Session
                                </Link>
                                <a
                                    href="#services"
                                    className="w-full rounded-xl border border-slate-300 bg-white px-8 py-3.5 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50 sm:w-auto dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700"
                                >
                                    See Our Services
                                </a>
                            </div>
                        </div>
                    </section>

                    {/* ── How It Works ────────────────────────────────────── */}
                    <section className="px-4 py-16">
                        <div className="mx-auto max-w-5xl">
                            <h2 className="mb-2 text-center text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
                                How It Works
                            </h2>
                            <p className="mb-10 text-center text-sm text-slate-500 dark:text-slate-400">
                                Book in 4 simple steps. No account needed.
                            </p>

                            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                                {HOW_IT_WORKS.map(({ step, icon: Icon, title, desc }) => (
                                    <div
                                        key={step}
                                        className="flex flex-col gap-3 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900"
                                    >
                                        <div className="flex items-center gap-3">
                                            <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-violet-100 text-xs font-bold text-violet-700 dark:bg-violet-900/40 dark:text-violet-400">
                                                {step}
                                            </span>
                                            <Icon className="size-5 text-violet-600 dark:text-violet-400" />
                                        </div>
                                        <p className="font-semibold text-slate-900 dark:text-slate-100">
                                            {title}
                                        </p>
                                        <p className="text-sm leading-relaxed text-slate-500 dark:text-slate-400">
                                            {desc}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </section>

                    {/* ── Services Preview ────────────────────────────────── */}
                    {services.length > 0 && (
                        <section
                            id="services"
                            className="px-4 py-16"
                        >
                            <div className="mx-auto max-w-5xl">
                                <h2 className="mb-2 text-center text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
                                    Our Services
                                </h2>
                                <p className="mb-10 text-center text-sm text-slate-500 dark:text-slate-400">
                                    Choose from our range of professional home
                                    therapy services.
                                </p>

                                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                                    {services.map((service) => (
                                        <div
                                            key={service.id}
                                            className="flex flex-col gap-3 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:shadow-md dark:border-slate-800 dark:bg-slate-900"
                                        >
                                            <p className="font-semibold text-slate-900 dark:text-slate-100">
                                                {service.name}
                                            </p>
                                            {service.description && (
                                                <p className="text-sm leading-relaxed text-slate-500 dark:text-slate-400">
                                                    {service.description}
                                                </p>
                                            )}
                                            <div className="mt-auto flex items-center justify-between pt-3">
                                                <span className="flex items-center gap-1 text-xs text-slate-400 dark:text-slate-500">
                                                    <Clock className="size-3.5" />
                                                    {service.duration_minutes} min
                                                </span>
                                                <span className="text-sm font-semibold text-violet-700 dark:text-violet-400">
                                                    {formatPrice(service.price)}
                                                </span>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                <div className="mt-10 text-center">
                                    <Link
                                        href={bookingShow()}
                                        className="inline-block rounded-xl bg-violet-600 px-8 py-3.5 text-sm font-semibold text-white shadow-md transition hover:bg-violet-700 dark:bg-violet-700 dark:hover:bg-violet-600"
                                    >
                                        Book Now
                                    </Link>
                                </div>
                            </div>
                        </section>
                    )}
                </main>

                {/* ── Footer ───────────────────────────────────────────────── */}
                <footer className="mt-8 border-t border-slate-200 py-6 text-center text-xs text-slate-400 dark:border-slate-800 dark:text-slate-600">
                    <p>© {currentYear} Home Care Therapy Service</p>
                </footer>
            </div>
        </>
    );
}
