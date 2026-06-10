import { Head, Link } from '@inertiajs/react';
import { CalendarCheck, CheckCircle } from 'lucide-react';
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

export default function Success({
    appointment,
}: {
    appointment: AppointmentSummary;
}) {
    const shortId = appointment.id.slice(0, 8).toUpperCase();

    return (
        <>
            <Head title="Booking Confirmed" />

            <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-slate-50 to-violet-50 px-4 py-12 dark:from-slate-950 dark:to-violet-950/20">
                <div className="w-full max-w-md">
                    {/* Success icon */}
                    <div className="mb-6 flex justify-center">
                        <div className="flex size-20 items-center justify-center rounded-full bg-emerald-100 dark:bg-emerald-900/30">
                            <CheckCircle className="size-10 text-emerald-600 dark:text-emerald-400" />
                        </div>
                    </div>

                    {/* Title */}
                    <h1 className="mb-2 text-center text-2xl font-bold text-slate-900 dark:text-slate-100">
                        Booking Submitted!
                    </h1>
                    <p className="mb-8 text-center text-sm text-slate-500 dark:text-slate-400">
                        We have received your booking. Please complete the down
                        payment to confirm your session.
                    </p>

                    {/* Reference card */}
                    <div className="mb-6 rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
                        {/* Booking ID */}
                        <div className="border-b border-slate-100 px-6 py-4 dark:border-slate-800">
                            <p className="mb-0.5 text-xs text-slate-500 dark:text-slate-400">
                                Booking Reference
                            </p>
                            <p className="font-mono text-lg font-semibold tracking-widest text-slate-900 dark:text-slate-100">
                                #{shortId}
                            </p>
                        </div>

                        {/* Schedule */}
                        <div className="border-b border-slate-100 px-6 py-4 dark:border-slate-800">
                            <p className="mb-1 flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400">
                                <CalendarCheck className="size-3.5" />
                                Schedule
                            </p>
                            <p className="text-sm font-medium text-slate-800 dark:text-slate-200">
                                {formatDate(appointment.start_at)}
                            </p>
                            <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
                                Ends approx.{' '}
                                {formatDate(appointment.service_end_at)}
                            </p>
                        </div>

                        {/* Pricing */}
                        <div className="px-6 py-4">
                            <p className="mb-3 text-xs text-slate-500 dark:text-slate-400">
                                Payment Details
                            </p>
                            <div className="space-y-2 text-sm">
                                <div className="flex justify-between">
                                    <span className="text-slate-600 dark:text-slate-400">
                                        Total
                                    </span>
                                    <span className="font-semibold text-slate-900 dark:text-slate-100">
                                        {formatPrice(appointment.total_price)}
                                    </span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-slate-600 dark:text-slate-400">
                                        DP (down payment)
                                    </span>
                                    <span className="font-semibold text-violet-700 dark:text-violet-400">
                                        {formatPrice(appointment.dp_amount)}
                                    </span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-slate-600 dark:text-slate-400">
                                        Remaining (to therapist)
                                    </span>
                                    <span className="font-medium text-slate-700 dark:text-slate-300">
                                        {formatPrice(
                                            appointment.remaining_payment,
                                        )}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* DP payment instruction placeholder */}
                    <div className="mb-6 rounded-xl border border-amber-200 bg-amber-50 px-5 py-4 dark:border-amber-900/40 dark:bg-amber-950/30">
                        <p className="mb-1 text-sm font-semibold text-amber-800 dark:text-amber-400">
                            Next Step: Complete Your Down Payment
                        </p>
                        <p className="text-sm text-amber-700 dark:text-amber-500">
                            Pay the DP of{' '}
                            <strong>
                                {formatPrice(appointment.dp_amount)}
                            </strong>{' '}
                            to confirm your slot. Our team will contact you via
                            WhatsApp with payment instructions shortly.
                        </p>
                    </div>

                    {/* Actions */}
                    <div className="flex flex-col gap-3">
                        <Link
                            href={bookingShow()}
                            className="block w-full rounded-xl border border-violet-200 bg-violet-50 px-6 py-3 text-center text-sm font-semibold text-violet-700 transition hover:bg-violet-100 dark:border-violet-800 dark:bg-violet-900/20 dark:text-violet-400 dark:hover:bg-violet-900/40"
                        >
                            Book Another Session
                        </Link>
                        <Link
                            href="/"
                            className="block w-full rounded-xl border border-slate-200 px-6 py-3 text-center text-sm font-medium text-slate-600 transition hover:bg-slate-50 dark:border-slate-700 dark:text-slate-400 dark:hover:bg-slate-800"
                        >
                            Back to Home
                        </Link>
                    </div>
                </div>
            </div>
        </>
    );
}
