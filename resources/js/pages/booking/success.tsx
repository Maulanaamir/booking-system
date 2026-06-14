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
import { show as bookingShow } from '@/routes/booking';

type AppointmentSummary = {
    id: string;
    start_at: string;
    service_end_at: string;
    total_price: number;
    dp_amount: number;
    remaining_payment: number;
    status: string;
};

function formatPrice(price: number): string {
    return `Rp ${price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.')}`;
}

function formatDate(dateStr: string): string {
    return new Date(dateStr).toLocaleString('id-ID', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
    });
}

function formatTime(dateStr: string): string {
    return new Date(dateStr).toLocaleTimeString('id-ID', {
        hour: '2-digit',
        minute: '2-digit',
    });
}

export default function Success({
    appointment,
}: {
    appointment: AppointmentSummary;
}) {
    const shortId = appointment.id.slice(0, 8).toUpperCase();

    return (
        <>
            <Head>
                <title>Booking Received — Home Care Therapy</title>
                <meta
                    name="description"
                    content="Your home therapy booking request has been received. We will contact you via WhatsApp to confirm your session."
                />
            </Head>

            <div className="public-page relative min-h-screen overflow-hidden px-5 py-10">
                {/* Ambient background */}
                <div
                    aria-hidden
                    className="pub-blob pub-blob-rose fixed -right-24 -top-24 h-[360px] w-[360px]"
                />
                <div
                    aria-hidden
                    className="pub-blob pub-blob-lavender fixed -bottom-24 -left-24 h-[320px] w-[320px]"
                />

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
                            className="relative px-6 pb-7 pt-8 text-center"
                            style={{ backgroundColor: 'var(--pub-surface-low)' }}
                        >
                            <div
                                aria-hidden
                                className="absolute -right-12 -top-16 h-40 w-40 rounded-full blur-3xl"
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
                                className="mb-2 text-xs font-bold uppercase tracking-[0.18em]"
                                style={{ color: 'var(--pub-rose)' }}
                            >
                                Booking received
                            </p>
                            <h1
                                className="pub-heading text-3xl font-semibold italic"
                                style={{ color: 'var(--pub-text)' }}
                            >
                                You're all set
                            </h1>
                            <p
                                className="mx-auto mt-3 max-w-sm text-sm leading-relaxed"
                                style={{ color: 'var(--pub-text-muted)' }}
                            >
                                Your booking request has been received. We'll
                                contact you via WhatsApp to confirm your session
                                and DP payment.
                            </p>
                        </div>

                        {/* Details */}
                        <div className="space-y-5 px-6 py-6">
                            {/* Reference */}
                            <div
                                className="rounded-2xl p-4"
                                style={{
                                    backgroundColor: 'var(--pub-surface-container)',
                                }}
                            >
                                <p
                                    className="mb-1 flex items-center gap-2 text-xs font-semibold uppercase tracking-wider"
                                    style={{ color: 'var(--pub-text-muted)' }}
                                >
                                    <ReceiptText className="size-3.5" />
                                    Reference
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
                                    className="mb-3 flex items-center gap-2 text-xs font-semibold uppercase tracking-wider"
                                    style={{ color: 'var(--pub-text-muted)' }}
                                >
                                    <CalendarCheck className="size-3.5" />
                                    Schedule
                                </p>

                                <p
                                    className="text-sm font-semibold leading-relaxed"
                                    style={{ color: 'var(--pub-text)' }}
                                >
                                    {formatDate(appointment.start_at)}
                                </p>
                                <p
                                    className="mt-1 flex items-center gap-1.5 text-xs"
                                    style={{ color: 'var(--pub-text-muted)' }}
                                >
                                    <Clock className="size-3.5" />
                                    Ends approx.{' '}
                                    {formatTime(appointment.service_end_at)}
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
                                    className="mb-3 flex items-center gap-2 text-xs font-semibold uppercase tracking-wider"
                                    style={{ color: 'var(--pub-text-muted)' }}
                                >
                                    <CreditCard className="size-3.5" />
                                    Payment details
                                </p>

                                <div className="space-y-2 text-sm">
                                    <div className="flex justify-between gap-4">
                                        <span style={{ color: 'var(--pub-text-sub)' }}>
                                            Total
                                        </span>
                                        <span
                                            className="font-semibold"
                                            style={{ color: 'var(--pub-text)' }}
                                        >
                                            {formatPrice(appointment.total_price)}
                                        </span>
                                    </div>
                                    <div className="flex justify-between gap-4">
                                        <span style={{ color: 'var(--pub-text-sub)' }}>
                                            DP to confirm
                                        </span>
                                        <span
                                            className="font-semibold"
                                            style={{ color: 'var(--pub-lavender)' }}
                                        >
                                            {formatPrice(appointment.dp_amount)}
                                        </span>
                                    </div>
                                    <div className="flex justify-between gap-4">
                                        <span style={{ color: 'var(--pub-text-sub)' }}>
                                            Remaining
                                        </span>
                                        <span
                                            className="font-medium"
                                            style={{ color: 'var(--pub-text-muted)' }}
                                        >
                                            {formatPrice(
                                                appointment.remaining_payment,
                                            )}
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
                                    Your address is used only for this appointment.
                                    Your comfort and safety come first.
                                </p>
                            </div>

                            {/* DP instruction */}
                            <div
                                className="rounded-2xl p-4"
                                style={{
                                    backgroundColor: 'rgba(255,218,169,0.28)',
                                    border: '1px solid rgba(217,119,6,0.25)',
                                }}
                            >
                                <p
                                    className="mb-1 text-sm font-semibold"
                                    style={{ color: '#92400e' }}
                                >
                                    Next: complete your DP payment
                                </p>
                                <p
                                    className="text-sm leading-relaxed"
                                    style={{ color: '#a16207' }}
                                >
                                    Pay the DP of{' '}
                                    <strong>
                                        {formatPrice(appointment.dp_amount)}
                                    </strong>{' '}
                                    to secure your slot. Our team will send the
                                    payment instructions via WhatsApp shortly.
                                </p>
                            </div>
                        </div>
                    </section>

                    {/* Actions */}
                    <div className="mt-5 flex flex-col gap-3">
                        <Link
                            href={bookingShow()}
                            className="block w-full rounded-full px-6 py-4 text-center text-sm font-semibold text-white shadow-md transition-all hover:-translate-y-1 hover:shadow-lg"
                            style={{ backgroundColor: 'var(--pub-cta)' }}
                        >
                            Book Another Session
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
                            Back to Home
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
