import { Head, Link } from '@inertiajs/react';
import {
    CalendarCheck,
    CheckCircle,
    Clock,
    CreditCard,
    Home,
    Lock,
    ReceiptText,
} from 'lucide-react';
import { useState } from 'react';
import { show as bookingShow } from '@/routes/booking';

type AppointmentSummary = {
    id: string;
    start_at: string;
    service_end_at: string;
    total_price: number;
    dp_amount: number;
    remaining_payment: number;
    status: string;
    payment_status: string;
    xendit_invoice_url: string | null;
};

function formatPrice(price: number): string {
    return `Rp ${price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.')}`;
}

function formatDate(dateStr: string, lang: 'id' | 'en'): string {
    return new Date(dateStr).toLocaleString(lang === 'id' ? 'id-ID' : 'en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
    });
}

function formatTime(dateStr: string, lang: 'id' | 'en'): string {
    return new Date(dateStr).toLocaleTimeString(
        lang === 'id' ? 'id-ID' : 'en-US',
        {
            hour: '2-digit',
            minute: '2-digit',
        },
    );
}

const T = {
    id: {
        title: 'Pemesanan Diterima — Home Care Therapy',
        receivedTag: 'Pemesanan Diterima',
        allSetTitle: 'Semua Sudah Siap',
        successDesc:
            'Permintaan pemesanan terapi di rumah Anda telah kami terima. Kami akan menghubungi Anda segera melalui WhatsApp untuk mengonfirmasi sesi dan metode pembayaran DP.',
        reference: 'Nomor Referensi',
        schedule: 'Jadwal Sesi',
        endsApprox: (timeStr: string) => `Selesai sekitar jam ${timeStr}`,
        paymentDetails: 'Rincian Pembayaran',
        total: 'Total Biaya',
        dpToConfirm: 'DP untuk Konfirmasi',
        remaining: 'Sisa Pembayaran',
        safetyNotice:
            'Alamat Anda hanya digunakan untuk janji temu ini. Keamanan dan kenyamanan Anda adalah prioritas kami.',
        nextStepsTitle: 'Langkah Selanjutnya: Pembayaran DP',
        nextStepsDesc: (priceStr: string) =>
            `Silakan selesaikan pembayaran DP sebesar ${priceStr} untuk mengamankan slot jadwal Anda. Anda dapat membayar menggunakan tombol di bawah ini.`,
        bookAnother: 'Pesan Sesi Lainnya',
        backToHome: 'Kembali ke Beranda',
        payDpNow: 'Bayar DP Sekarang',
        paymentStatusLabel: 'Status Pembayaran',
        unpaidStatus: 'Belum Dibayar',
        paidStatus: 'Sudah Dibayar',
        fallbackMessage:
            'Link pembayaran otomatis belum tersedia. Silakan hubungi admin untuk konfirmasi pembayaran DP.',
    },
    en: {
        title: 'Booking Received — Home Care Therapy',
        receivedTag: 'Booking received',
        allSetTitle: "You're all set",
        successDesc:
            "Your booking request has been received. We'll contact you via WhatsApp to confirm your session and DP payment.",
        reference: 'Reference',
        schedule: 'Schedule',
        endsApprox: (timeStr: string) => `Ends approx. ${timeStr}`,
        paymentDetails: 'Payment details',
        total: 'Total',
        dpToConfirm: 'DP to confirm',
        remaining: 'Remaining',
        safetyNotice:
            'Your address is used only for this appointment. Your comfort and safety come first.',
        nextStepsTitle: 'Next: Complete DP Payment',
        nextStepsDesc: (priceStr: string) =>
            `Please complete the DP payment of ${priceStr} to secure your slot. You can pay using the button below.`,
        bookAnother: 'Book Another Session',
        backToHome: 'Back to Home',
        payDpNow: 'Pay DP Now',
        paymentStatusLabel: 'Payment Status',
        unpaidStatus: 'Unpaid',
        paidStatus: 'Paid',
        fallbackMessage:
            'Automatic payment link is not available yet. Please contact admin to confirm your DP payment.',
    },
};

export default function Success({
    appointment,
}: {
    appointment: AppointmentSummary;
}) {
    const shortId = appointment.id.slice(0, 8).toUpperCase();

    const [lang, setLang] = useState<'id' | 'en'>(() => {
        if (typeof window !== 'undefined') {
            return (localStorage.getItem('pub-lang') as 'id' | 'en') || 'id';
        }

        return 'id';
    });

    const changeLang = (newLang: 'id' | 'en') => {
        setLang(newLang);
        localStorage.setItem('pub-lang', newLang);
    };

    return (
        <>
            <Head>
                <title>{T[lang].title}</title>
                <meta name="description" content={T[lang].successDesc} />
            </Head>

            <div className="public-page relative min-h-screen overflow-hidden px-5 py-10">
                {/* Ambient background */}
                <div
                    aria-hidden
                    className="pub-blob pub-blob-rose fixed -top-24 -right-24 h-[360px] w-[360px]"
                />
                <div
                    aria-hidden
                    className="pub-blob pub-blob-lavender fixed -bottom-24 -left-24 h-[320px] w-[320px]"
                />

                {/* Header-like row inside page for mobile/tablet language toggle */}
                <div className="absolute top-5 right-5 z-20">
                    <div
                        className="flex items-center gap-1 rounded-full border p-1"
                        style={{
                            borderColor: 'var(--pub-border)',
                            backgroundColor: 'var(--pub-surface)',
                        }}
                    >
                        <button
                            type="button"
                            onClick={() => changeLang('id')}
                            className={`rounded-full px-2 py-0.5 text-[10px] font-bold transition-all ${
                                lang === 'id'
                                    ? 'bg-violet-600 text-white'
                                    : 'text-neutral-500 hover:opacity-80'
                            }`}
                        >
                            ID
                        </button>
                        <button
                            type="button"
                            onClick={() => changeLang('en')}
                            className={`rounded-full px-2 py-0.5 text-[10px] font-bold transition-all ${
                                lang === 'en'
                                    ? 'bg-violet-600 text-white'
                                    : 'text-neutral-500 hover:opacity-80'
                            }`}
                        >
                            EN
                        </button>
                    </div>
                </div>

                <main className="relative z-10 mx-auto flex min-h-[calc(100vh-5rem)] w-full max-w-md flex-col justify-center">
                    {/* Brand label */}
                    <div className="mb-5 text-center">
                        <Link
                            href="/"
                            className="pub-heading text-2xl font-semibold italic transition-opacity hover:opacity-80"
                            style={{ color: 'var(--pub-lavender)' }}
                        >
                            Home Care Therapy
                        </Link>
                    </div>

                    {/* Main success card */}
                    <section
                        className="overflow-hidden rounded-3xl"
                        style={{
                            backgroundColor: 'var(--pub-surface)',
                            boxShadow:
                                '0 18px 60px -18px rgba(114,70,180,0.18)',
                            border: '1px solid rgba(204,195,212,0.35)',
                        }}
                    >
                        {/* Top visual */}
                        <div
                            className="relative px-6 pt-8 pb-7 text-center"
                            style={{
                                backgroundColor: 'var(--pub-surface-low)',
                            }}
                        >
                            <div
                                aria-hidden
                                className="absolute -top-16 -right-12 h-40 w-40 rounded-full blur-3xl"
                                style={{
                                    backgroundColor: 'rgba(223,168,168,0.32)',
                                }}
                            />
                            <div
                                aria-hidden
                                className="absolute -bottom-16 -left-12 h-36 w-36 rounded-full blur-3xl"
                                style={{
                                    backgroundColor: 'rgba(236,220,255,0.7)',
                                }}
                            />

                            <div
                                className="relative mx-auto mb-5 flex size-20 items-center justify-center rounded-full"
                                style={{
                                    backgroundColor: 'var(--pub-cta-fixed)',
                                    color: 'var(--pub-lavender)',
                                }}
                            >
                                <CheckCircle className="size-10" />
                            </div>

                            <p
                                className="mb-2 text-xs font-bold tracking-[0.18em] uppercase"
                                style={{ color: 'var(--pub-rose)' }}
                            >
                                {T[lang].receivedTag}
                            </p>
                            <h1
                                className="pub-heading text-3xl font-semibold italic"
                                style={{ color: 'var(--pub-text)' }}
                            >
                                {T[lang].allSetTitle}
                            </h1>
                            <p
                                className="mx-auto mt-3 max-w-sm text-sm leading-relaxed"
                                style={{ color: 'var(--pub-text-muted)' }}
                            >
                                {T[lang].successDesc}
                            </p>
                        </div>

                        {/* Details */}
                        <div className="space-y-5 px-6 py-6">
                            {/* Reference */}
                            <div
                                className="rounded-2xl p-4"
                                style={{
                                    backgroundColor:
                                        'var(--pub-surface-container)',
                                }}
                            >
                                <p
                                    className="mb-1 flex items-center gap-2 text-xs font-semibold tracking-wider uppercase"
                                    style={{ color: 'var(--pub-text-muted)' }}
                                >
                                    <ReceiptText className="size-3.5" />
                                    {T[lang].reference}
                                </p>
                                <p
                                    className="font-mono text-lg font-bold tracking-[0.22em]"
                                    style={{ color: 'var(--pub-text)' }}
                                >
                                    #{shortId}
                                </p>
                            </div>

                            {/* Schedule */}
                            <div
                                className="rounded-2xl p-4"
                                style={{
                                    backgroundColor: 'var(--pub-surface)',
                                    border: '1px solid rgba(204,195,212,0.45)',
                                }}
                            >
                                <p
                                    className="mb-3 flex items-center gap-2 text-xs font-semibold tracking-wider uppercase"
                                    style={{ color: 'var(--pub-text-muted)' }}
                                >
                                    <CalendarCheck className="size-3.5" />
                                    {T[lang].schedule}
                                </p>

                                <p
                                    className="text-sm leading-relaxed font-semibold"
                                    style={{ color: 'var(--pub-text)' }}
                                >
                                    {formatDate(appointment.start_at, lang)}
                                </p>
                                <p
                                    className="mt-1 flex items-center gap-1.5 text-xs"
                                    style={{ color: 'var(--pub-text-muted)' }}
                                >
                                    <Clock className="size-3.5" />
                                    {T[lang].endsApprox(
                                        formatTime(
                                            appointment.service_end_at,
                                            lang,
                                        ),
                                    )}
                                </p>
                            </div>

                            {/* Payment */}
                            <div
                                className="rounded-2xl p-4"
                                style={{
                                    backgroundColor: 'var(--pub-surface)',
                                    border: '1px solid rgba(204,195,212,0.45)',
                                }}
                            >
                                <p
                                    className="mb-3 flex items-center gap-2 text-xs font-semibold tracking-wider uppercase"
                                    style={{ color: 'var(--pub-text-muted)' }}
                                >
                                    <CreditCard className="size-3.5" />
                                    {T[lang].paymentDetails}
                                </p>

                                <div className="space-y-2 text-sm">
                                    <div className="flex justify-between gap-4">
                                        <span
                                            style={{
                                                color: 'var(--pub-text-sub)',
                                            }}
                                        >
                                            {T[lang].total}
                                        </span>
                                        <span
                                            className="font-semibold"
                                            style={{ color: 'var(--pub-text)' }}
                                        >
                                            {formatPrice(
                                                appointment.total_price,
                                            )}
                                        </span>
                                    </div>
                                    <div className="flex justify-between gap-4">
                                        <span
                                            style={{
                                                color: 'var(--pub-text-sub)',
                                            }}
                                        >
                                            {T[lang].dpToConfirm}
                                        </span>
                                        <span
                                            className="font-semibold"
                                            style={{
                                                color: 'var(--pub-lavender)',
                                            }}
                                        >
                                            {formatPrice(appointment.dp_amount)}
                                        </span>
                                    </div>
                                    <div className="flex justify-between gap-4">
                                        <span
                                            style={{
                                                color: 'var(--pub-text-sub)',
                                            }}
                                        >
                                            {T[lang].remaining}
                                        </span>
                                        <span
                                            className="font-medium"
                                            style={{
                                                color: 'var(--pub-text-muted)',
                                            }}
                                        >
                                            {formatPrice(
                                                appointment.remaining_payment,
                                            )}
                                        </span>
                                    </div>
                                    <div
                                        className="mt-2 flex justify-between gap-4 border-t pt-2"
                                        style={{
                                            borderColor:
                                                'rgba(204,195,212,0.25)',
                                        }}
                                    >
                                        <span
                                            style={{
                                                color: 'var(--pub-text-sub)',
                                            }}
                                        >
                                            {T[lang].paymentStatusLabel}
                                        </span>
                                        <span
                                            className="rounded-full px-2 py-0.5 text-xs font-semibold"
                                            style={{
                                                color:
                                                    appointment.payment_status ===
                                                    'paid'
                                                        ? '#166534'
                                                        : '#991b1b',
                                                backgroundColor:
                                                    appointment.payment_status ===
                                                    'paid'
                                                        ? '#dcfce7'
                                                        : '#fee2e2',
                                            }}
                                        >
                                            {appointment.payment_status ===
                                            'paid'
                                                ? T[lang].paidStatus
                                                : T[lang].unpaidStatus}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* Safety note */}
                            <div
                                className="flex items-start gap-3 rounded-2xl p-4"
                                style={{
                                    backgroundColor: 'rgba(149,170,130,0.12)',
                                    border: '1px solid var(--pub-sage-container)',
                                }}
                            >
                                <Lock
                                    className="mt-0.5 size-4 shrink-0"
                                    style={{ color: 'var(--pub-sage)' }}
                                />
                                <p
                                    className="text-xs leading-relaxed"
                                    style={{ color: 'var(--pub-sage)' }}
                                >
                                    {T[lang].safetyNotice}
                                </p>
                            </div>

                            {/* DP instruction */}
                            {appointment.xendit_invoice_url ? (
                                <div
                                    className="rounded-2xl p-4"
                                    style={{
                                        backgroundColor:
                                            'rgba(255,218,169,0.28)',
                                        border: '1px solid rgba(217,119,6,0.25)',
                                    }}
                                >
                                    <p
                                        className="mb-1 text-sm font-semibold"
                                        style={{ color: '#92400e' }}
                                    >
                                        {T[lang].nextStepsTitle}
                                    </p>
                                    <p
                                        className="text-sm leading-relaxed"
                                        style={{ color: '#a16207' }}
                                    >
                                        {T[lang].nextStepsDesc(
                                            formatPrice(appointment.dp_amount),
                                        )}
                                    </p>
                                </div>
                            ) : (
                                <div
                                    className="rounded-2xl border p-4"
                                    style={{
                                        backgroundColor:
                                            'rgba(239, 68, 68, 0.08)',
                                        borderColor: 'rgba(239, 68, 68, 0.25)',
                                    }}
                                >
                                    <p
                                        className="mb-1 text-sm font-semibold"
                                        style={{ color: '#b91c1c' }}
                                    >
                                        ⚠️{' '}
                                        {lang === 'id'
                                            ? 'Link Pembayaran Belum Tersedia'
                                            : 'Payment Link Unavailable'}
                                    </p>
                                    <p
                                        className="text-sm leading-relaxed"
                                        style={{ color: '#b91c1c' }}
                                    >
                                        {T[lang].fallbackMessage}
                                    </p>
                                </div>
                            )}
                        </div>
                    </section>

                    {/* Actions */}
                    <div className="mt-5 flex flex-col gap-3">
                        {appointment.xendit_invoice_url &&
                            appointment.payment_status !== 'paid' && (
                                <a
                                    href={appointment.xendit_invoice_url}
                                    className="block w-full rounded-full px-6 py-4 text-center text-sm font-bold text-white shadow-md transition-all hover:-translate-y-1 hover:shadow-lg hover:brightness-110"
                                    style={{
                                        backgroundColor: 'var(--pub-lavender)',
                                    }}
                                >
                                    💳 {T[lang].payDpNow}
                                </a>
                            )}

                        <Link
                            href={bookingShow()}
                            className="block w-full rounded-full px-6 py-4 text-center text-sm font-semibold text-white shadow-md transition-all hover:-translate-y-1 hover:shadow-lg"
                            style={{ backgroundColor: 'var(--pub-cta)' }}
                        >
                            {T[lang].bookAnother}
                        </Link>
                        <Link
                            href="/"
                            className="flex w-full items-center justify-center gap-2 rounded-full px-6 py-3 text-center text-sm font-semibold transition-all hover:opacity-75"
                            style={{
                                color: 'var(--pub-lavender)',
                                backgroundColor: 'var(--pub-surface)',
                                border: '1px solid rgba(204,195,212,0.45)',
                            }}
                        >
                            <Home className="size-4" />
                            {T[lang].backToHome}
                        </Link>
                    </div>

                    <p
                        className="mt-8 text-center text-xs"
                        style={{ color: 'var(--pub-text-muted)' }}
                    >
                        © {new Date().getFullYear()} Home Care Therapy Service
                    </p>
                </main>
            </div>
        </>
    );
}
