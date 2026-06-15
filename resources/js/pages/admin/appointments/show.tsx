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
    AlertCircle
} from 'lucide-react';
import { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
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

// Premium Soft Wellness colors (matching index page)
const STATUS_BADGES: Record<string, { label: string; className: string }> = {
    pending_approval: {
        label: 'Pending Approval',
        className: 'text-amber-700 bg-amber-50 border-amber-200/60 dark:text-amber-400 dark:bg-amber-950/20 dark:border-amber-900/40 font-semibold',
    },
    pending_dp: {
        label: 'Pending DP',
        className: 'text-orange-700 bg-orange-50 border-orange-200/60 dark:text-orange-450 dark:bg-orange-950/20 dark:border-orange-900/40 font-semibold',
    },
    confirmed: {
        label: 'Confirmed',
        className: 'text-emerald-700 bg-emerald-50 border-emerald-200/60 dark:text-emerald-450 dark:bg-emerald-950/20 dark:border-emerald-900/40 font-semibold',
    },
    completed: {
        label: 'Completed',
        className: 'text-blue-700 bg-blue-50 border-blue-200/60 dark:text-blue-455 dark:bg-blue-950/20 dark:border-blue-900/40 font-semibold',
    },
    cancelled: {
        label: 'Cancelled',
        className: 'text-rose-700 bg-rose-50 border-rose-200/60 dark:text-rose-455 dark:bg-rose-950/20 dark:border-rose-900/40 font-semibold',
    },
    expired: {
        label: 'Expired',
        className: 'text-gray-600 bg-gray-50 border-gray-200/60 dark:text-gray-450 dark:bg-gray-950/20 dark:border-gray-900/40 font-semibold',
    },
};

const PAYMENT_BADGES: Record<string, { label: string; className: string }> = {
    unpaid: {
        label: 'Unpaid',
        className: 'text-rose-700 bg-rose-50 border-rose-200/60 dark:text-rose-455 dark:bg-rose-950/20 dark:border-rose-900/40 font-semibold',
    },
    dp_paid: {
        label: 'DP Paid',
        className: 'text-blue-700 bg-blue-50 border-blue-200/60 dark:text-blue-455 dark:bg-blue-950/20 dark:border-blue-900/40 font-semibold',
    },
    fully_paid: {
        label: 'Fully Paid',
        className: 'text-emerald-700 bg-emerald-50 border-emerald-200/60 dark:text-emerald-450 dark:bg-emerald-950/20 dark:border-emerald-900/40 font-semibold',
    },
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
            <div className="flex items-center justify-between mb-4">
                <Button variant="ghost" className="rounded-xl hover:bg-neutral-100 dark:hover:bg-neutral-800 px-3 pl-2 text-muted-foreground" asChild>
                    <Link href={appointmentsIndex()}>
                        <ChevronLeft className="size-4 mr-1" />
                        <span>Back to Appointments</span>
                    </Link>
                </Button>
            </div>

            {/* Summary Header Card */}
            <Card className="mb-6 border-neutral-100 bg-white shadow-sm dark:border-neutral-800 dark:bg-neutral-900/50 rounded-2xl">
                <CardContent className="p-6">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
                        <div className="space-y-1.5">
                            <div className="flex items-center gap-2 text-xs text-muted-foreground uppercase tracking-wider font-semibold">
                                <span>Appointment #{shortId}</span>
                                <span>•</span>
                                <span className="normal-case">{appointment.id}</span>
                            </div>
                            <h1 className="text-2xl md:text-3xl font-semibold text-neutral-800 dark:text-neutral-100">
                                {appointment.customer.name}
                            </h1>
                            <div className="flex flex-wrap items-center gap-2 mt-1">
                                <Badge variant="outline" className={`rounded-full px-2.5 py-0.5 ${statusConfig.className}`}>
                                    {statusConfig.label}
                                </Badge>
                                <Badge variant="outline" className={`rounded-full px-2.5 py-0.5 ${paymentConfig.className}`}>
                                    {paymentConfig.label}
                                </Badge>
                            </div>
                        </div>

                        <div className="flex flex-col md:text-right md:justify-end">
                            <span className="text-sm text-muted-foreground">Total Price</span>
                            <span className="text-2xl md:text-3xl font-bold text-neutral-800 dark:text-neutral-100">
                                {formatPrice(appointment.total_price)}
                            </span>
                            <span className="text-xs text-muted-foreground mt-0.5">
                                Scheduled for {formatDate(appointment.start_at)} ({formatTime(appointment.start_at)})
                            </span>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Quick Action Banner */}
            {['pending_approval', 'pending_dp', 'confirmed'].includes(appointment.status) && (
                <Card className="mb-6 border-violet-100 bg-violet-50/20 dark:border-violet-900/30 dark:bg-violet-955/10 rounded-2xl">
                    <CardContent className="p-4 md:p-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                        <div className="flex items-start gap-3">
                            <div className="p-2 bg-violet-100 dark:bg-violet-900/30 text-violet-750 dark:text-violet-400 rounded-xl shrink-0">
                                <AlertCircle className="size-5" />
                            </div>
                            <div>
                                <h3 className="font-semibold text-neutral-800 dark:text-neutral-200">
                                    Required Action
                                </h3>
                                <p className="text-sm text-muted-foreground mt-0.5">
                                    {appointment.status === 'pending_approval' && 'This booking is awaiting approval. Select an action below.'}
                                    {appointment.status === 'pending_dp' && 'This booking is awaiting down payment verification.'}
                                    {appointment.status === 'confirmed' && 'This booking is confirmed. Mark as completed once the session is done.'}
                                </p>
                            </div>
                        </div>
                        <div className="flex flex-wrap items-center gap-2">
                            {appointment.status === 'pending_approval' && (
                                <>
                                    <Button
                                        onClick={() => submitStatusUpdate('pending_dp')}
                                        disabled={processing}
                                        className="h-10 rounded-xl bg-amber-600 hover:bg-amber-700 text-white dark:bg-amber-700 dark:hover:bg-amber-800 font-semibold border-none shadow-none"
                                    >
                                        Approve (Request DP)
                                    </Button>
                                    <Button
                                        onClick={() => submitStatusUpdate('confirmed')}
                                        disabled={processing}
                                        className="h-10 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white dark:bg-emerald-700 dark:hover:bg-emerald-800 font-semibold border-none shadow-none"
                                    >
                                        Confirm Booking
                                    </Button>
                                    <Button
                                        onClick={() => submitStatusUpdate('cancelled')}
                                        disabled={processing}
                                        variant="destructive"
                                        className="h-10 rounded-xl font-semibold shadow-none"
                                    >
                                        Cancel Booking
                                    </Button>
                                </>
                            )}

                            {appointment.status === 'pending_dp' && (
                                <>
                                    <Button
                                        onClick={() => submitStatusUpdate('confirmed')}
                                        disabled={processing}
                                        className="h-10 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white dark:bg-emerald-700 dark:hover:bg-emerald-800 font-semibold border-none shadow-none"
                                    >
                                        Confirm Booking
                                    </Button>
                                    <Button
                                        onClick={() => submitStatusUpdate('cancelled')}
                                        disabled={processing}
                                        variant="destructive"
                                        className="h-10 rounded-xl font-semibold shadow-none"
                                    >
                                        Cancel Booking
                                    </Button>
                                </>
                            )}

                            {appointment.status === 'confirmed' && (
                                <>
                                    <Button
                                        onClick={() => submitStatusUpdate('completed')}
                                        disabled={processing}
                                        className="h-10 rounded-xl bg-blue-600 hover:bg-blue-700 text-white dark:bg-blue-700 dark:hover:bg-blue-800 font-semibold border-none shadow-none"
                                    >
                                        Complete Booking
                                    </Button>
                                    <Button
                                        onClick={() => submitStatusUpdate('cancelled')}
                                        disabled={processing}
                                        variant="destructive"
                                        className="h-10 rounded-xl font-semibold shadow-none"
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
                <div className="lg:col-span-2 space-y-6">
                    {/* Booked Services Card */}
                    <Card className="border-neutral-100 bg-white shadow-sm dark:border-neutral-800 dark:bg-neutral-900/50 rounded-2xl">
                        <CardHeader className="pb-3">
                            <CardTitle className="text-base font-semibold text-neutral-800 dark:text-neutral-200">
                                Booked Services
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            {appointment.appointment_services.length === 0 ? (
                                <p className="text-sm text-muted-foreground py-4 text-center">
                                    No services recorded.
                                </p>
                            ) : (
                                <div className="overflow-hidden rounded-xl border border-neutral-100 dark:border-neutral-800 bg-white dark:bg-neutral-900/20">
                                    <table className="w-full text-sm">
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
                                            {appointment.appointment_services.map((svc) => (
                                                <tr
                                                    key={svc.id}
                                                    className="border-b border-neutral-100 last:border-b-0 dark:border-neutral-800"
                                                >
                                                    <td className="px-4 py-3 font-semibold text-neutral-850 dark:text-neutral-250">
                                                        {svc.service_name_snapshot}
                                                    </td>
                                                    <td className="px-4 py-3">
                                                        <Badge
                                                            variant="outline"
                                                            className={`rounded-full ${
                                                                svc.is_main_service_snapshot
                                                                    ? 'text-violet-750 bg-violet-50 border-violet-200 dark:text-violet-450 dark:bg-violet-955/20 dark:border-violet-900/40'
                                                                    : 'text-neutral-600 bg-neutral-50 border-neutral-200 dark:text-neutral-450 dark:bg-neutral-955/10'
                                                            }`}
                                                        >
                                                            {svc.is_main_service_snapshot ? 'Main' : 'Add-on'}
                                                        </Badge>
                                                    </td>
                                                    <td className="px-4 py-3 text-muted-foreground font-medium">
                                                        <div className="flex items-center gap-1">
                                                            <Clock className="size-3.5" />
                                                            <span>{svc.duration_minutes_snapshot} mins</span>
                                                        </div>
                                                    </td>
                                                    <td className="px-4 py-3 text-right font-semibold text-neutral-800 dark:text-neutral-200">
                                                        {formatPrice(svc.price_snapshot)}
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    {/* Customer Location Snapshot */}
                    <Card className="border-neutral-100 bg-white shadow-sm dark:border-neutral-800 dark:bg-neutral-900/50 rounded-2xl">
                        <CardHeader className="pb-3">
                            <CardTitle className="text-base font-semibold text-neutral-800 dark:text-neutral-200">
                                Service Location
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex items-start gap-3">
                                <div className="p-2 bg-emerald-50 dark:bg-emerald-955/20 text-emerald-600 dark:text-emerald-450 rounded-xl shrink-0 mt-0.5">
                                    <MapPin className="size-4" />
                                </div>
                                <div>
                                    <span className="text-xs text-muted-foreground block mb-0.5">Address Snapshot</span>
                                    <p className="text-sm font-medium text-neutral-700 dark:text-neutral-300 leading-relaxed">
                                        {appointment.customer_address_snapshot}
                                    </p>
                                </div>
                            </div>

                            {appointment.customer_location_note_snapshot && (
                                <div className="p-3.5 bg-emerald-50/40 border border-emerald-100 rounded-xl text-sm text-emerald-850 dark:bg-emerald-955/10 dark:border-emerald-900/30 dark:text-emerald-450">
                                    <span className="font-semibold block text-xs uppercase tracking-wider mb-1">
                                        Location Note / Landmark
                                    </span>
                                    {appointment.customer_location_note_snapshot}
                                </div>
                            )}

                            {appointment.customer_latitude_snapshot !== null && appointment.customer_longitude_snapshot !== null && (
                                <div className="flex items-start gap-3">
                                    <div className="p-2 bg-emerald-50 dark:bg-emerald-955/20 text-emerald-600 dark:text-emerald-450 rounded-xl shrink-0 mt-0.5">
                                        <MapPin className="size-4 opacity-75" />
                                    </div>
                                    <div>
                                        <span className="text-xs text-muted-foreground block mb-0.5">Coordinates</span>
                                        <p className="text-sm font-medium text-neutral-700 dark:text-neutral-300">
                                            {appointment.customer_latitude_snapshot}, {appointment.customer_longitude_snapshot}
                                        </p>
                                    </div>
                                </div>
                            )}

                            {appointment.customer_maps_url_snapshot && (
                                <div className="pt-2">
                                    <a
                                        href={appointment.customer_maps_url_snapshot}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-emerald-700 transition-colors dark:bg-emerald-700 dark:hover:bg-emerald-800"
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
                    <Card className="border-neutral-100 bg-white shadow-sm dark:border-neutral-800 dark:bg-neutral-900/50 rounded-2xl">
                        <CardHeader className="pb-3">
                            <CardTitle className="text-base font-semibold text-neutral-800 dark:text-neutral-200">
                                Booking Notes
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div>
                                <span className="text-xs font-semibold text-neutral-400 uppercase tracking-wider block mb-1.5">
                                    Customer Note
                                </span>
                                {appointment.customer_note ? (
                                    <div className="p-3.5 bg-neutral-50/50 border border-neutral-100 rounded-xl text-sm text-neutral-700 dark:bg-neutral-900/30 dark:border-neutral-800 dark:text-neutral-300 italic">
                                        "{appointment.customer_note}"
                                    </div>
                                ) : (
                                    <p className="text-sm text-muted-foreground italic pl-1">
                                        No notes provided by customer.
                                    </p>
                                )}
                            </div>

                            <div className="border-t border-neutral-50 pt-4 dark:border-neutral-900">
                                <span className="text-xs font-semibold text-neutral-400 uppercase tracking-wider block mb-1.5">
                                    Internal Admin Note
                                </span>
                                {appointment.admin_note ? (
                                    <div className="p-3.5 bg-violet-50/20 border border-violet-100/40 rounded-xl text-sm text-neutral-700 dark:bg-violet-955/5 dark:border-violet-900/20 dark:text-neutral-300">
                                        {appointment.admin_note}
                                    </div>
                                ) : (
                                    <p className="text-sm text-muted-foreground italic pl-1">
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
                    <Card className="border-neutral-100 bg-white shadow-sm dark:border-neutral-800 dark:bg-neutral-900/50 rounded-2xl">
                        <CardHeader className="pb-3">
                            <CardTitle className="text-base font-semibold text-neutral-800 dark:text-neutral-200">
                                Assigned Information
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex items-start gap-3">
                                <div className="p-2 bg-violet-50 dark:bg-violet-955/20 text-violet-600 dark:text-violet-400 rounded-xl shrink-0">
                                    <User className="size-4" />
                                </div>
                                <div className="min-w-0">
                                    <span className="text-xs text-muted-foreground block">Customer Name</span>
                                    <span className="font-semibold text-neutral-800 dark:text-neutral-200 truncate block">
                                        {appointment.customer.name}
                                    </span>
                                </div>
                            </div>

                            <div className="flex items-start gap-3">
                                <div className="p-2 bg-violet-50 dark:bg-violet-955/20 text-violet-600 dark:text-violet-400 rounded-xl shrink-0">
                                    <Phone className="size-4" />
                                </div>
                                <div>
                                    <span className="text-xs text-muted-foreground block">Phone Number</span>
                                    <a 
                                        href={`tel:${appointment.customer.phone_number}`}
                                        className="font-semibold text-violet-600 hover:text-violet-750 dark:text-violet-400 hover:underline"
                                    >
                                        {appointment.customer.phone_number}
                                    </a>
                                </div>
                            </div>

                            <div className="flex items-start gap-3 border-t border-neutral-50 pt-4 dark:border-neutral-900">
                                <div className="p-2 bg-emerald-50 dark:bg-emerald-955/20 text-emerald-600 dark:text-emerald-400 rounded-xl shrink-0">
                                    <HeartHandshake className="size-4" />
                                </div>
                                <div className="min-w-0">
                                    <span className="text-xs text-muted-foreground block">Assigned Therapist</span>
                                    <span className="font-semibold text-neutral-800 dark:text-neutral-200 truncate block">
                                        {appointment.therapist.name}
                                    </span>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Schedule & Timeline Card */}
                    <Card className="border-neutral-100 bg-white shadow-sm dark:border-neutral-800 dark:bg-neutral-900/50 rounded-2xl">
                        <CardHeader className="pb-3">
                            <CardTitle className="text-base font-semibold text-neutral-800 dark:text-neutral-200">
                                Timeline &amp; Buffers
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex items-start gap-3">
                                <div className="p-2 bg-violet-50 dark:bg-violet-955/20 text-violet-600 dark:text-violet-400 rounded-xl shrink-0">
                                    <Calendar className="size-4" />
                                </div>
                                <div>
                                    <span className="text-xs text-muted-foreground block">Start Date &amp; Time</span>
                                    <span className="font-semibold text-neutral-800 dark:text-neutral-200 block">
                                        {formatDate(appointment.start_at)}
                                    </span>
                                    <span className="text-xs text-neutral-500 font-medium mt-0.5 block">
                                        {formatTime(appointment.start_at)}
                                    </span>
                                </div>
                            </div>

                            <div className="flex items-start gap-3">
                                <div className="p-2 bg-neutral-50 dark:bg-neutral-900 text-neutral-605 dark:text-neutral-450 rounded-xl shrink-0">
                                    <Clock className="size-4" />
                                </div>
                                <div>
                                    <span className="text-xs text-muted-foreground block">Service End (Estimated)</span>
                                    <span className="font-medium text-neutral-800 dark:text-neutral-200 block">
                                        {formatDate(appointment.service_end_at)}
                                    </span>
                                    <span className="text-xs text-neutral-500 mt-0.5 block">
                                        {formatTime(appointment.service_end_at)}
                                    </span>
                                </div>
                            </div>

                            <div className="flex items-start gap-3 border-t border-neutral-50 pt-4 dark:border-neutral-900">
                                <div className="p-2 bg-amber-50 dark:bg-amber-955/20 text-amber-600 dark:text-amber-400 rounded-xl shrink-0">
                                    <Clock className="size-4" />
                                </div>
                                <div>
                                    <span className="text-xs text-muted-foreground block">Buffer Block</span>
                                    <span className="text-sm font-medium text-neutral-700 dark:text-neutral-300">
                                        +{appointment.buffer_minutes} mins (Blocked until {formatTime(appointment.blocked_until_at)})
                                    </span>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Payment Summary Card */}
                    <Card className="border-neutral-100 bg-white shadow-sm dark:border-neutral-800 dark:bg-neutral-900/50 rounded-2xl overflow-hidden">
                        <CardHeader className="pb-3">
                            <CardTitle className="text-base font-semibold text-neutral-800 dark:text-neutral-200">
                                Payment Details
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2.5 text-sm">
                                <div className="flex justify-between text-neutral-600 dark:text-neutral-450">
                                    <span>Services Total</span>
                                    <span className="font-medium">{formatPrice(appointment.service_total_price)}</span>
                                </div>
                                
                                <div className="flex justify-between text-neutral-600 dark:text-neutral-450">
                                    <span>Transport Fee</span>
                                    <span className="font-medium">{formatPrice(appointment.transport_fee)}</span>
                                </div>
                                
                                <div className="flex justify-between border-t border-neutral-100 pt-2.5 dark:border-neutral-800 font-semibold text-neutral-850 dark:text-neutral-150">
                                    <span>Total Price</span>
                                    <span>{formatPrice(appointment.total_price)}</span>
                                </div>
                                
                                <div className="flex justify-between text-neutral-600 dark:text-neutral-455">
                                    <span>Down Payment (DP)</span>
                                    <span className="font-medium text-emerald-600 dark:text-emerald-450">
                                        -{formatPrice(appointment.dp_amount)}
                                    </span>
                                </div>
                            </div>

                            {/* Highlight remaining amount to collect */}
                            <div className="bg-amber-50/70 border border-amber-100 p-4 rounded-xl dark:bg-amber-950/10 dark:border-amber-900/30 mt-2">
                                <span className="text-xs font-semibold text-amber-800 dark:text-amber-400 uppercase tracking-wider block">
                                    Remaining Balance
                                </span>
                                <span className="text-xs text-amber-700 dark:text-amber-500 block mt-0.5">
                                    To collect in-person / manually
                                </span>
                                <span className="text-2xl font-bold text-amber-800 dark:text-amber-450 block mt-2">
                                    {formatPrice(appointment.remaining_payment)}
                                </span>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Change Status Card (Fallback / Picker) */}
                    <Card className="border-neutral-100 bg-white shadow-sm dark:border-neutral-800 dark:bg-neutral-900/50 rounded-2xl">
                        <CardHeader className="pb-3">
                            <CardTitle className="text-base font-semibold text-neutral-800 dark:text-neutral-200">
                                Change Status
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={handleStatusUpdate} className="flex flex-col gap-3">
                                <div className="grid gap-1.5">
                                    <label htmlFor="status" className="text-xs font-semibold text-neutral-400 uppercase tracking-wider">
                                        All Status options
                                    </label>
                                    <select
                                        id="status"
                                        name="status"
                                        value={selectedStatus}
                                        onChange={(e) => setSelectedStatus(e.target.value)}
                                        className="h-10 w-full rounded-xl border border-neutral-200/80 bg-neutral-50/50 px-3 py-1 text-sm shadow-xs transition-[color,box-shadow] outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 focus:bg-white dark:border-neutral-800 dark:bg-neutral-900/30 text-neutral-800 dark:text-neutral-200"
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
                                    disabled={processing || selectedStatus === appointment.status}
                                    className="h-10 w-full rounded-xl bg-neutral-900 hover:bg-neutral-800 text-white dark:bg-neutral-800 dark:hover:bg-neutral-700 transition-colors"
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
