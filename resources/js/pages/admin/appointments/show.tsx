import { Head, Link, router } from '@inertiajs/react';
import {
    ChevronLeft,
    Calendar,
    Clock,
    User,
    Phone,
    HeartHandshake,
    MapPin,
    ExternalLink,
    AlertCircle,
} from 'lucide-react';
import { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { STATUS_BADGES, PAYMENT_BADGES } from '@/lib/admin-colors';
import { dashboard } from '@/routes';
import {
    index as appointmentsIndex,
    show as appointmentsShow,
    updateStatus,
} from '@/routes/admin/appointments';
import type { BreadcrumbItem } from '@/types';

type Customer = {
    id: number;
    name: string;
    phone_number: string;
};

type Therapist = {
    id: number;
    name: string;
};

type AppointmentServiceItem = {
    id: number;
    service_name_snapshot: string;
    duration_minutes_snapshot: number;
    price_snapshot: number;
    is_main_service_snapshot: boolean;
};

type AppointmentDetail = {
    id: string;
    customer: Customer;
    therapist: Therapist;
    start_at: string;
    service_end_at: string;
    blocked_until_at: string;
    buffer_minutes: number;
    status: string;
    payment_status: string;
    service_total_price: number;
    transport_fee: number;
    total_price: number;
    dp_amount: number;
    remaining_payment: number;
    customer_address_snapshot: string;
    customer_latitude_snapshot: number | null;
    customer_longitude_snapshot: number | null;
    customer_maps_url_snapshot: string | null;
    customer_location_note_snapshot: string | null;
    customer_note: string | null;
    admin_note: string | null;
    appointment_services: AppointmentServiceItem[];
};

const ALLOWED_STATUSES = [
    'pending_approval',
    'pending_dp',
    'confirmed',
    'completed',
    'cancelled',
    'expired',
] as const;

const STATUS_LABELS: Record<string, string> = {
    pending_approval: 'Pending Approval',
    pending_dp: 'Pending DP',
    confirmed: 'Confirmed',
    completed: 'Completed',
    cancelled: 'Cancelled',
    expired: 'Expired',
};



function formatPrice(price: number): string {
    return `Rp ${price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.')}`;
}

function formatDate(dateStr: string): string {
    return new Date(dateStr).toLocaleDateString('id-ID', {
        weekday: 'short',
        year: 'numeric',
        month: 'short',
        day: 'numeric',
    });
}

function formatTime(dateStr: string): string {
    return new Date(dateStr).toLocaleTimeString('id-ID', {
        hour: '2-digit',
        minute: '2-digit',
    });
}

export default function Show({
    appointment,
}: {
    appointment: AppointmentDetail;
}) {
    const shortId = appointment.id.slice(0, 8).toUpperCase();
    const [selectedStatus, setSelectedStatus] = useState(appointment.status);
    const [processing, setProcessing] = useState(false);

    function submitStatusUpdate(newStatus: string) {
        if (newStatus === appointment.status) {
            return;
        }

        setProcessing(true);
        router.patch(
            updateStatus.url(appointment.id),
            { status: newStatus },
            {
                onFinish: () => {
                    setProcessing(false);
                    setSelectedStatus(newStatus);
                },
            },
        );
    }

    function handleStatusUpdate(e: React.FormEvent) {
        e.preventDefault();
        submitStatusUpdate(selectedStatus);
    }

    const statusConfig = STATUS_BADGES[appointment.status] || {
        label: appointment.status,
        className: 'text-neutral-700 bg-neutral-50 border-neutral-200',
    };
    const paymentConfig = PAYMENT_BADGES[appointment.payment_status] || {
        label: appointment.payment_status,
        className: 'text-neutral-700 bg-neutral-50 border-neutral-200',
    };

    return (
        <>
            <Head title={`Appointment #${shortId}`} />

            {/* Back Button */}
            <div className="mb-4 flex items-center justify-between">
                <Button
                    variant="ghost"
                    className="rounded-xl px-3 pl-2 text-muted-foreground hover:bg-neutral-100 dark:hover:bg-neutral-800"
                    asChild
                >
                    <Link href={appointmentsIndex()}>
                        <ChevronLeft className="mr-1 size-4" />
                        <span>Back to Appointments</span>
                    </Link>
                </Button>
            </div>

            {/* Summary Header Card */}
            <Card className="mb-6 rounded-2xl border-neutral-100 bg-white shadow-sm dark:border-neutral-800 dark:bg-neutral-900/50">
                <CardContent className="p-6">
                    <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
                        <div className="space-y-1.5">
                            <div className="flex items-center gap-2 text-xs font-semibold tracking-wider text-muted-foreground uppercase">
                                <span>Appointment #{shortId}</span>
                                <span className="hidden sm:inline">•</span>
                                <span className="hidden normal-case sm:inline">
                                    {appointment.id}
                                </span>
                            </div>
                            <h1 className="text-2xl font-semibold text-neutral-800 md:text-3xl dark:text-neutral-100">
                                {appointment.customer.name}
                            </h1>
                            <div className="mt-1 flex flex-wrap items-center gap-2">
                                <Badge
                                    variant="outline"
                                    className={`rounded-full px-2.5 py-0.5 ${statusConfig.className}`}
                                >
                                    {statusConfig.label}
                                </Badge>
                                <Badge
                                    variant="outline"
                                    className={`rounded-full px-2.5 py-0.5 ${paymentConfig.className}`}
                                >
                                    {paymentConfig.label}
                                </Badge>
                            </div>
                        </div>

                        <div className="flex flex-col md:justify-end md:text-right">
                            <span className="text-sm text-muted-foreground">
                                Total Price
                            </span>
                            <span className="text-2xl font-bold text-neutral-800 md:text-3xl dark:text-neutral-100">
                                {formatPrice(appointment.total_price)}
                            </span>
                            <span className="mt-0.5 text-xs text-muted-foreground">
                                Scheduled for {formatDate(appointment.start_at)}{' '}
                                ({formatTime(appointment.start_at)})
                            </span>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Quick Action Banner */}
            {['pending_approval', 'pending_dp', 'confirmed'].includes(
                appointment.status,
            ) && (
                <Card className="dark:bg-violet-900/10 mb-6 rounded-2xl border-violet-100 bg-violet-50/20 dark:border-violet-900/30">
                    <CardContent className="flex flex-col gap-4 p-4 md:flex-row md:items-center md:justify-between md:p-6">
                        <div className="flex items-start gap-3">
                            <div className="text-violet-750 shrink-0 rounded-xl bg-violet-100 p-2 dark:bg-violet-900/30 dark:text-violet-400">
                                <AlertCircle className="size-5" />
                            </div>
                            <div>
                                <h3 className="font-semibold text-neutral-800 dark:text-neutral-200">
                                    Required Action
                                </h3>
                                <p className="mt-0.5 text-sm text-muted-foreground">
                                    {appointment.status ===
                                        'pending_approval' &&
                                        'This booking is awaiting approval. Select an action below.'}
                                    {appointment.status === 'pending_dp' &&
                                        'This booking is awaiting down payment verification.'}
                                    {appointment.status === 'confirmed' &&
                                        'This booking is confirmed. Mark as completed once the session is done.'}
                                </p>
                            </div>
                        </div>
                        <div className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row sm:items-center">
                            {appointment.status === 'pending_approval' && (
                                <>
                                    <Button
                                        onClick={() =>
                                            submitStatusUpdate('pending_dp')
                                        }
                                        disabled={processing}
                                        className="h-10 w-full rounded-xl border-none bg-amber-600 font-semibold text-white shadow-none hover:bg-amber-700 sm:w-auto dark:bg-amber-700 dark:hover:bg-amber-800"
                                    >
                                        Approve (Request DP)
                                    </Button>
                                    <Button
                                        onClick={() =>
                                            submitStatusUpdate('confirmed')
                                        }
                                        disabled={processing}
                                        className="h-10 w-full rounded-xl border-none bg-emerald-600 font-semibold text-white shadow-none hover:bg-emerald-700 sm:w-auto dark:bg-emerald-700 dark:hover:bg-emerald-800"
                                    >
                                        Confirm Booking
                                    </Button>
                                    <Button
                                        onClick={() =>
                                            submitStatusUpdate('cancelled')
                                        }
                                        disabled={processing}
                                        variant="destructive"
                                        className="h-10 w-full rounded-xl font-semibold shadow-none sm:w-auto"
                                    >
                                        Cancel Booking
                                    </Button>
                                </>
                            )}

                            {appointment.status === 'pending_dp' && (
                                <>
                                    <Button
                                        onClick={() =>
                                            submitStatusUpdate('confirmed')
                                        }
                                        disabled={processing}
                                        className="h-10 w-full rounded-xl border-none bg-emerald-600 font-semibold text-white shadow-none hover:bg-emerald-700 sm:w-auto dark:bg-emerald-700 dark:hover:bg-emerald-800"
                                    >
                                        Confirm Booking
                                    </Button>
                                    <Button
                                        onClick={() =>
                                            submitStatusUpdate('cancelled')
                                        }
                                        disabled={processing}
                                        variant="destructive"
                                        className="h-10 w-full rounded-xl font-semibold shadow-none sm:w-auto"
                                    >
                                        Cancel Booking
                                    </Button>
                                </>
                            )}

                            {appointment.status === 'confirmed' && (
                                <>
                                    <Button
                                        onClick={() =>
                                            submitStatusUpdate('completed')
                                        }
                                        disabled={processing}
                                        className="h-10 w-full rounded-xl border-none bg-blue-600 font-semibold text-white shadow-none hover:bg-blue-700 sm:w-auto dark:bg-blue-700 dark:hover:bg-blue-800"
                                    >
                                        Complete Booking
                                    </Button>
                                    <Button
                                        onClick={() =>
                                            submitStatusUpdate('cancelled')
                                        }
                                        disabled={processing}
                                        variant="destructive"
                                        className="h-10 w-full rounded-xl font-semibold shadow-none sm:w-auto"
                                    >
                                        Cancel Booking
                                    </Button>
                                </>
                            )}
                        </div>
                    </CardContent>
                </Card>
            )}

            {/* Layout Grid */}
            <div className="grid gap-6 lg:grid-cols-3">
                {/* Left & Center Column (Col span 2) */}
                <div className="space-y-6 lg:col-span-2">
                    {/* Booked Services Card */}
                    <Card className="rounded-2xl border-neutral-100 bg-white shadow-sm dark:border-neutral-800 dark:bg-neutral-900/50">
                        <CardHeader className="pb-3">
                            <CardTitle className="text-base font-semibold text-neutral-800 dark:text-neutral-200">
                                Booked Services
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            {appointment.appointment_services.length === 0 ? (
                                <p className="py-4 text-center text-sm text-muted-foreground">
                                    No services recorded.
                                </p>
                            ) : (
                                <div className="overflow-hidden rounded-xl border border-neutral-100 bg-white dark:border-neutral-800 dark:bg-neutral-900/20">
                                    {/* Desktop Table View */}
                                    <table className="hidden w-full text-sm md:table">
                                        <thead>
                                            <tr className="border-b border-neutral-100 bg-neutral-50/50 dark:border-neutral-800 dark:bg-neutral-900/20">
                                                <th className="px-4 py-3 text-left font-semibold text-neutral-600 dark:text-neutral-400">
                                                    Service
                                                </th>
                                                <th className="px-4 py-3 text-left font-semibold text-neutral-600 dark:text-neutral-400">
                                                    Type
                                                </th>
                                                <th className="px-4 py-3 text-left font-semibold text-neutral-600 dark:text-neutral-400">
                                                    Duration
                                                </th>
                                                <th className="px-4 py-3 text-right font-semibold text-neutral-600 dark:text-neutral-400">
                                                    Price
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {appointment.appointment_services.map(
                                                (svc) => (
                                                    <tr
                                                        key={svc.id}
                                                        className="border-b border-neutral-100 last:border-b-0 dark:border-neutral-800"
                                                    >
                                                        <td className="text-neutral-800 dark:text-neutral-200 px-4 py-3 font-semibold">
                                                            {
                                                                svc.service_name_snapshot
                                                            }
                                                        </td>
                                                        <td className="px-4 py-3">
                                                            <Badge
                                                                variant="outline"
                                                                className={`rounded-full ${
                                                                    svc.is_main_service_snapshot
                                                                        ? 'text-violet-700 dark:text-violet-400 dark:bg-violet-950/20 border-violet-200 bg-violet-50 dark:border-violet-900/40'
                                                                        : 'dark:text-neutral-400 dark:bg-neutral-950/10 border-neutral-200 bg-neutral-50 text-neutral-600'
                                                                }`}
                                                            >
                                                                {svc.is_main_service_snapshot
                                                                    ? 'Main'
                                                                    : 'Add-on'}
                                                            </Badge>
                                                        </td>
                                                        <td className="px-4 py-3 font-medium text-muted-foreground">
                                                            <div className="flex items-center gap-1">
                                                                <Clock className="size-3.5" />
                                                                <span>
                                                                    {
                                                                        svc.duration_minutes_snapshot
                                                                    }{' '}
                                                                    mins
                                                                </span>
                                                            </div>
                                                        </td>
                                                        <td className="px-4 py-3 text-right font-semibold text-neutral-800 dark:text-neutral-200">
                                                            {formatPrice(
                                                                svc.price_snapshot,
                                                            )}
                                                        </td>
                                                    </tr>
                                                ),
                                            )}
                                        </tbody>
                                    </table>

                                    {/* Mobile List View */}
                                    <div className="divide-y divide-neutral-100 md:hidden dark:divide-neutral-800">
                                        {appointment.appointment_services.map(
                                            (svc) => (
                                                <div
                                                    key={svc.id}
                                                    className="flex flex-col gap-2 p-4"
                                                >
                                                    <div className="flex items-start justify-between gap-2">
                                                        <span className="text-neutral-800 text-sm font-semibold dark:text-neutral-200">
                                                            {
                                                                svc.service_name_snapshot
                                                            }
                                                        </span>
                                                        <span className="text-neutral-800 text-sm font-semibold dark:text-neutral-100">
                                                            {formatPrice(
                                                                svc.price_snapshot,
                                                            )}
                                                        </span>
                                                    </div>
                                                    <div className="mt-0.5 flex items-center justify-between text-xs text-muted-foreground">
                                                        <Badge
                                                            variant="outline"
                                                            className={`rounded-full px-1.5 py-0 text-[10px] ${
                                                                svc.is_main_service_snapshot
                                                                    ? 'text-violet-700 dark:text-violet-400 dark:bg-violet-950/20 border-violet-200 bg-violet-50 dark:border-violet-900/40'
                                                                    : 'dark:text-neutral-400 dark:bg-neutral-90/10 border-neutral-200 bg-neutral-50 text-neutral-600'
                                                            }`}
                                                        >
                                                            {svc.is_main_service_snapshot
                                                                ? 'Main'
                                                                : 'Add-on'}
                                                        </Badge>
                                                        <div className="flex items-center gap-1">
                                                            <Clock className="size-3" />
                                                            <span>
                                                                {
                                                                    svc.duration_minutes_snapshot
                                                                }{' '}
                                                                mins
                                                            </span>
                                                        </div>
                                                    </div>
                                                </div>
                                            ),
                                        )}
                                    </div>
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    {/* Customer Location Snapshot */}
                    <Card className="rounded-2xl border-neutral-100 bg-white shadow-sm dark:border-neutral-800 dark:bg-neutral-900/50">
                        <CardHeader className="pb-3">
                            <CardTitle className="text-base font-semibold text-neutral-800 dark:text-neutral-200">
                                Service Location
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex items-start gap-3">
                                <div className="dark:bg-emerald-950/20 dark:text-emerald-400 mt-0.5 shrink-0 rounded-xl bg-emerald-50 p-2 text-emerald-600">
                                    <MapPin className="size-4" />
                                </div>
                                <div>
                                    <span className="mb-0.5 block text-xs text-muted-foreground">
                                        Address Snapshot
                                    </span>
                                    <p className="text-sm leading-relaxed font-medium text-neutral-700 dark:text-neutral-300">
                                        {appointment.customer_address_snapshot}
                                    </p>
                                </div>
                            </div>

                            {appointment.customer_location_note_snapshot && (
                                <div className="text-emerald-700 dark:bg-emerald-950/10 dark:text-emerald-400 rounded-xl border border-emerald-100 bg-emerald-50/40 p-3.5 text-sm dark:border-emerald-900/30">
                                    <span className="mb-1 block text-xs font-semibold tracking-wider uppercase">
                                        Location Note / Landmark
                                    </span>
                                    {
                                        appointment.customer_location_note_snapshot
                                    }
                                </div>
                            )}

                            {appointment.customer_latitude_snapshot !== null &&
                                appointment.customer_longitude_snapshot !==
                                    null && (
                                    <div className="flex items-start gap-3">
                                        <div className="dark:bg-emerald-950/20 dark:text-emerald-400 mt-0.5 shrink-0 rounded-xl bg-emerald-50 p-2 text-emerald-600">
                                            <MapPin className="size-4 opacity-75" />
                                        </div>
                                        <div>
                                            <span className="mb-0.5 block text-xs text-muted-foreground">
                                                Coordinates
                                            </span>
                                            <p className="text-sm font-medium text-neutral-700 dark:text-neutral-300">
                                                {
                                                    appointment.customer_latitude_snapshot
                                                }
                                                ,{' '}
                                                {
                                                    appointment.customer_longitude_snapshot
                                                }
                                            </p>
                                        </div>
                                    </div>
                                )}

                            {appointment.customer_maps_url_snapshot && (
                                <div className="pt-2">
                                    <a
                                        href={
                                            appointment.customer_maps_url_snapshot
                                        }
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-emerald-700 dark:bg-emerald-700 dark:hover:bg-emerald-800"
                                    >
                                        <MapPin className="size-4 shrink-0" />
                                        <span>Open in Google Maps</span>
                                        <ExternalLink className="size-3.5 shrink-0 opacity-80" />
                                    </a>
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    {/* Notes Display Card */}
                    <Card className="rounded-2xl border-neutral-100 bg-white shadow-sm dark:border-neutral-800 dark:bg-neutral-900/50">
                        <CardHeader className="pb-3">
                            <CardTitle className="text-base font-semibold text-neutral-800 dark:text-neutral-200">
                                Booking Notes
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div>
                                <span className="mb-1.5 block text-xs font-semibold tracking-wider text-neutral-400 uppercase">
                                    Customer Note
                                </span>
                                {appointment.customer_note ? (
                                    <div className="rounded-xl border border-neutral-100 bg-neutral-50/50 p-3.5 text-sm text-neutral-700 italic dark:border-neutral-800 dark:bg-neutral-900/30 dark:text-neutral-300">
                                        "{appointment.customer_note}"
                                    </div>
                                ) : (
                                    <p className="pl-1 text-sm text-muted-foreground italic">
                                        No notes provided by customer.
                                    </p>
                                )}
                            </div>

                            <div className="border-t border-neutral-50 pt-4 dark:border-neutral-900">
                                <span className="mb-1.5 block text-xs font-semibold tracking-wider text-neutral-400 uppercase">
                                    Internal Admin Note
                                </span>
                                {appointment.admin_note ? (
                                    <div className="dark:bg-violet-905/5 rounded-xl border border-violet-100/40 bg-violet-50/20 p-3.5 text-sm text-neutral-700 dark:border-violet-900/20 dark:text-neutral-300">
                                        {appointment.admin_note}
                                    </div>
                                ) : (
                                    <p className="pl-1 text-sm text-muted-foreground italic">
                                        No internal admin notes.
                                    </p>
                                )}
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Right Column (Col span 1) */}
                <div className="space-y-6">
                    {/* Customer & Therapist Info Card */}
                    <Card className="rounded-2xl border-neutral-100 bg-white shadow-sm dark:border-neutral-800 dark:bg-neutral-900/50">
                        <CardHeader className="pb-3">
                            <CardTitle className="text-base font-semibold text-neutral-800 dark:text-neutral-200">
                                Assigned Information
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex items-start gap-3">
                                <div className="dark:bg-violet-950/20 shrink-0 rounded-xl bg-violet-50 p-2 text-violet-600 dark:text-violet-400">
                                    <User className="size-4" />
                                </div>
                                <div className="min-w-0">
                                    <span className="block text-xs text-muted-foreground">
                                        Customer Name
                                    </span>
                                    <span className="block truncate font-semibold text-neutral-800 dark:text-neutral-200">
                                        {appointment.customer.name}
                                    </span>
                                </div>
                            </div>

                            <div className="flex items-start gap-3">
                                <div className="dark:bg-violet-950/20 shrink-0 rounded-xl bg-violet-50 p-2 text-violet-600 dark:text-violet-400">
                                    <Phone className="size-4" />
                                </div>
                                <div>
                                    <span className="block text-xs text-muted-foreground">
                                        Phone Number
                                    </span>
                                    <a
                                        href={`tel:${appointment.customer.phone_number}`}
                                        className="hover:text-violet-750 font-semibold text-violet-600 hover:underline dark:text-violet-400"
                                    >
                                        {appointment.customer.phone_number}
                                    </a>
                                </div>
                            </div>

                            <div className="flex items-start gap-3 border-t border-neutral-50 pt-4 dark:border-neutral-900">
                                <div className="dark:bg-emerald-950/20 shrink-0 rounded-xl bg-emerald-50 p-2 text-emerald-600 dark:text-emerald-400">
                                    <HeartHandshake className="size-4" />
                                </div>
                                <div className="min-w-0">
                                    <span className="block text-xs text-muted-foreground">
                                        Assigned Therapist
                                    </span>
                                    <span className="block truncate font-semibold text-neutral-800 dark:text-neutral-200">
                                        {appointment.therapist.name}
                                    </span>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Schedule & Timeline Card */}
                    <Card className="rounded-2xl border-neutral-100 bg-white shadow-sm dark:border-neutral-800 dark:bg-neutral-900/50">
                        <CardHeader className="pb-3">
                            <CardTitle className="text-base font-semibold text-neutral-800 dark:text-neutral-200">
                                Timeline &amp; Buffers
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex items-start gap-3">
                                <div className="dark:bg-violet-950/20 shrink-0 rounded-xl bg-violet-50 p-2 text-violet-600 dark:text-violet-400">
                                    <Calendar className="size-4" />
                                </div>
                                <div>
                                    <span className="block text-xs text-muted-foreground">
                                        Start Date &amp; Time
                                    </span>
                                    <span className="block font-semibold text-neutral-800 dark:text-neutral-200">
                                        {formatDate(appointment.start_at)}
                                    </span>
                                    <span className="mt-0.5 block text-xs font-medium text-neutral-500">
                                        {formatTime(appointment.start_at)}
                                    </span>
                                </div>
                            </div>

                            <div className="flex items-start gap-3">
                                <div className="text-neutral-600 dark:text-neutral-400 shrink-0 rounded-xl bg-neutral-50 p-2 dark:bg-neutral-900">
                                    <Clock className="size-4" />
                                </div>
                                <div>
                                    <span className="block text-xs text-muted-foreground">
                                        Service End (Estimated)
                                    </span>
                                    <span className="block font-medium text-neutral-800 dark:text-neutral-200">
                                        {formatDate(appointment.service_end_at)}
                                    </span>
                                    <span className="mt-0.5 block text-xs text-neutral-500">
                                        {formatTime(appointment.service_end_at)}
                                    </span>
                                </div>
                            </div>

                            <div className="flex items-start gap-3 border-t border-neutral-50 pt-4 dark:border-neutral-900">
                                <div className="dark:bg-amber-950/20 shrink-0 rounded-xl bg-amber-50 p-2 text-amber-600 dark:text-amber-400">
                                    <Clock className="size-4" />
                                </div>
                                <div>
                                    <span className="block text-xs text-muted-foreground">
                                        Buffer Block
                                    </span>
                                    <span className="text-sm font-medium text-neutral-700 dark:text-neutral-300">
                                        +{appointment.buffer_minutes} mins
                                        (Blocked until{' '}
                                        {formatTime(
                                            appointment.blocked_until_at,
                                        )}
                                        )
                                    </span>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Payment Summary Card */}
                    <Card className="overflow-hidden rounded-2xl border-neutral-100 bg-white shadow-sm dark:border-neutral-800 dark:bg-neutral-900/50">
                        <CardHeader className="pb-3">
                            <CardTitle className="text-base font-semibold text-neutral-800 dark:text-neutral-200">
                                Payment Details
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2.5 text-sm">
                                <div className="dark:text-neutral-400 flex justify-between text-neutral-600">
                                    <span>Services Total</span>
                                    <span className="font-medium">
                                        {formatPrice(
                                            appointment.service_total_price,
                                        )}
                                    </span>
                                </div>

                                <div className="dark:text-neutral-400 flex justify-between text-neutral-600">
                                    <span>Transport Fee</span>
                                    <span className="font-medium">
                                        {formatPrice(appointment.transport_fee)}
                                    </span>
                                </div>

                                <div className="text-neutral-800 dark:text-neutral-300 flex justify-between border-t border-neutral-100 pt-2.5 font-semibold dark:border-neutral-800">
                                    <span>Total Price</span>
                                    <span>
                                        {formatPrice(appointment.total_price)}
                                    </span>
                                </div>

                                <div className="dark:text-neutral-400 flex justify-between text-neutral-600">
                                    <span>Down Payment (DP)</span>
                                    <span className="dark:text-emerald-400 font-medium text-emerald-600">
                                        -{formatPrice(appointment.dp_amount)}
                                    </span>
                                </div>
                            </div>

                            {/* Highlight remaining amount to collect */}
                            <div className="mt-2 rounded-xl border border-amber-100 bg-amber-50/70 p-4 dark:border-amber-900/30 dark:bg-amber-950/10">
                                <span className="block text-xs font-semibold tracking-wider text-amber-800 uppercase dark:text-amber-400">
                                    Remaining Balance
                                </span>
                                <span className="mt-0.5 block text-xs text-amber-700 dark:text-amber-500">
                                    To collect in-person / manually
                                </span>
                                <span className="dark:text-amber-400 mt-2 block text-2xl font-bold text-amber-800">
                                    {formatPrice(appointment.remaining_payment)}
                                </span>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Change Status Card (Fallback / Picker) */}
                    <Card className="rounded-2xl border-neutral-100 bg-white shadow-sm dark:border-neutral-800 dark:bg-neutral-900/50">
                        <CardHeader className="pb-3">
                            <CardTitle className="text-base font-semibold text-neutral-800 dark:text-neutral-200">
                                Change Status
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <form
                                onSubmit={handleStatusUpdate}
                                className="flex flex-col gap-3"
                            >
                                <div className="grid gap-1.5">
                                    <label
                                        htmlFor="status"
                                        className="text-xs font-semibold tracking-wider text-neutral-400 uppercase"
                                    >
                                        All Status options
                                    </label>
                                    <select
                                        id="status"
                                        name="status"
                                        value={selectedStatus}
                                        onChange={(e) =>
                                            setSelectedStatus(e.target.value)
                                        }
                                        className="h-10 w-full rounded-xl border border-neutral-200/80 bg-neutral-50/50 px-3 py-1 text-sm text-neutral-800 shadow-xs transition-[color,box-shadow] outline-none focus:bg-white focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 dark:border-neutral-800 dark:bg-neutral-900/30 dark:text-neutral-200"
                                    >
                                        {ALLOWED_STATUSES.map((s) => (
                                            <option key={s} value={s}>
                                                {STATUS_LABELS[s]}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                <Button
                                    type="submit"
                                    disabled={
                                        processing ||
                                        selectedStatus === appointment.status
                                    }
                                    className="h-10 w-full rounded-xl bg-neutral-900 text-white transition-colors hover:bg-neutral-800 dark:bg-neutral-800 dark:hover:bg-neutral-700"
                                >
                                    {processing ? 'Saving...' : 'Save Status'}
                                </Button>
                            </form>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </>
    );
}

Show.layout = {
    breadcrumbs: [
        { title: 'Dashboard', href: dashboard() },
        { title: 'Appointments', href: appointmentsIndex() },
        {
            title: 'Detail',
            href: appointmentsShow(''),
        },
    ] satisfies BreadcrumbItem[],
};
