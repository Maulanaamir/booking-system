import { Head, Link, router } from '@inertiajs/react';
import { ExternalLink, MapPin } from 'lucide-react';
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

type BadgeVariant = 'default' | 'secondary' | 'destructive' | 'outline';

function statusVariant(status: string): BadgeVariant {
    switch (status) {
        case 'confirmed':
        case 'completed':
            return 'default';
        case 'cancelled':
        case 'expired':
            return 'destructive';
        default:
            return 'secondary';
    }
}

function formatPrice(price: number): string {
    return `Rp ${price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.')}`;
}

function formatDate(dateStr: string): string {
    return new Date(dateStr).toLocaleString('id-ID', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
    });
}

function InfoRow({ label, value }: { label: string; value: React.ReactNode }) {
    return (
        <div className="flex flex-col gap-0.5 sm:flex-row sm:gap-4">
            <dt className="w-full text-sm text-muted-foreground sm:w-44 sm:shrink-0">
                {label}
            </dt>
            <dd className="text-sm font-medium">{value}</dd>
        </div>
    );
}

export default function Show({
    appointment,
}: {
    appointment: AppointmentDetail;
}) {
    const shortId = appointment.id.slice(0, 8).toUpperCase();
    const [selectedStatus, setSelectedStatus] = useState(appointment.status);
    const [processing, setProcessing] = useState(false);

    function handleStatusUpdate(e: React.FormEvent) {
        e.preventDefault();
        if (selectedStatus === appointment.status) return;

        setProcessing(true);
        router.patch(
            updateStatus.url(appointment.id),
            { status: selectedStatus },
            {
                onFinish: () => setProcessing(false),
            },
        );
    }

    return (
        <>
            <Head title={`Appointment #${shortId}`} />

            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-xl font-semibold tracking-tight">
                        Appointment #{shortId}
                    </h2>
                    <p className="text-sm text-muted-foreground">
                        {appointment.id}
                    </p>
                </div>
                <Button variant="ghost" asChild>
                    <Link href={appointmentsIndex()}>Back</Link>
                </Button>
            </div>

            <div className="mt-6 grid gap-6 lg:grid-cols-2">
                {/* Customer & Therapist */}
                <Card>
                    <CardHeader>
                        <CardTitle className="text-base">
                            Customer &amp; Therapist
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <dl className="space-y-3">
                            <InfoRow
                                label="Customer"
                                value={appointment.customer.name}
                            />
                            <InfoRow
                                label="Customer Phone"
                                value={appointment.customer.phone_number}
                            />
                            <InfoRow
                                label="Therapist"
                                value={appointment.therapist.name}
                            />
                        </dl>
                    </CardContent>
                </Card>

                {/* Schedule */}
                <Card>
                    <CardHeader>
                        <CardTitle className="text-base">Schedule</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <dl className="space-y-3">
                            <InfoRow
                                label="Start"
                                value={formatDate(appointment.start_at)}
                            />
                            <InfoRow
                                label="Service End"
                                value={formatDate(appointment.service_end_at)}
                            />
                            <InfoRow
                                label="Blocked Until"
                                value={formatDate(appointment.blocked_until_at)}
                            />
                            <InfoRow
                                label="Buffer"
                                value={`${appointment.buffer_minutes} min`}
                            />
                        </dl>
                    </CardContent>
                </Card>

                {/* Selected Services */}
                <Card className="lg:col-span-2">
                    <CardHeader>
                        <CardTitle className="text-base">
                            Selected Services
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        {appointment.appointment_services.length === 0 ? (
                            <p className="text-sm text-muted-foreground">
                                No services recorded.
                            </p>
                        ) : (
                            <div className="overflow-x-auto rounded-lg border border-sidebar-border/70 dark:border-sidebar-border">
                                <table className="w-full text-sm">
                                    <thead>
                                        <tr className="border-b border-sidebar-border/70 dark:border-sidebar-border">
                                            <th className="px-4 py-2 text-left font-medium text-muted-foreground">
                                                Service
                                            </th>
                                            <th className="px-4 py-2 text-left font-medium text-muted-foreground">
                                                Type
                                            </th>
                                            <th className="px-4 py-2 text-left font-medium text-muted-foreground">
                                                Duration
                                            </th>
                                            <th className="px-4 py-2 text-left font-medium text-muted-foreground">
                                                Price
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {appointment.appointment_services.map(
                                            (svc) => (
                                                <tr
                                                    key={svc.id}
                                                    className="border-b border-sidebar-border/70 last:border-b-0 dark:border-sidebar-border"
                                                >
                                                    <td className="px-4 py-2 font-medium">
                                                        {
                                                            svc.service_name_snapshot
                                                        }
                                                    </td>
                                                    <td className="px-4 py-2">
                                                        <Badge
                                                            variant={
                                                                svc.is_main_service_snapshot
                                                                    ? 'default'
                                                                    : 'secondary'
                                                            }
                                                        >
                                                            {svc.is_main_service_snapshot
                                                                ? 'Main'
                                                                : 'Add-on'}
                                                        </Badge>
                                                    </td>
                                                    <td className="px-4 py-2 text-muted-foreground">
                                                        {
                                                            svc.duration_minutes_snapshot
                                                        }{' '}
                                                        min
                                                    </td>
                                                    <td className="px-4 py-2">
                                                        {formatPrice(
                                                            svc.price_snapshot,
                                                        )}
                                                    </td>
                                                </tr>
                                            ),
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </CardContent>
                </Card>

                {/* Payment Summary */}
                <Card>
                    <CardHeader>
                        <CardTitle className="text-base">
                            Payment Summary
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <dl className="space-y-3">
                            <InfoRow
                                label="Service Total"
                                value={formatPrice(
                                    appointment.service_total_price,
                                )}
                            />
                            <InfoRow
                                label="Transport Fee"
                                value={formatPrice(appointment.transport_fee)}
                            />
                            <InfoRow
                                label="Total"
                                value={
                                    <span className="font-semibold">
                                        {formatPrice(appointment.total_price)}
                                    </span>
                                }
                            />
                            <InfoRow
                                label="DP Amount"
                                value={formatPrice(appointment.dp_amount)}
                            />
                            <InfoRow
                                label="Remaining"
                                value={formatPrice(
                                    appointment.remaining_payment,
                                )}
                            />
                            <InfoRow
                                label="Payment Status"
                                value={
                                    <Badge variant="outline">
                                        {appointment.payment_status}
                                    </Badge>
                                }
                            />
                        </dl>
                    </CardContent>
                </Card>

                {/* Location */}
                <Card>
                    <CardHeader>
                        <CardTitle className="text-base">
                            Customer Location
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <dl className="space-y-3">
                            <InfoRow
                                label="Address"
                                value={appointment.customer_address_snapshot}
                            />
                            {appointment.customer_location_note_snapshot && (
                                <InfoRow
                                    label="Location Note"
                                    value={
                                        appointment.customer_location_note_snapshot
                                    }
                                />
                            )}
                        </dl>
                        {appointment.customer_maps_url_snapshot && (
                            <div className="mt-4">
                                <a
                                    href={
                                        appointment.customer_maps_url_snapshot
                                    }
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center gap-2 rounded-md border border-input bg-background px-3 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground"
                                >
                                    <MapPin className="size-4" />
                                    Open in Google Maps
                                    <ExternalLink className="size-3 text-muted-foreground" />
                                </a>
                            </div>
                        )}
                    </CardContent>
                </Card>

                {/* Notes */}
                <Card>
                    <CardHeader>
                        <CardTitle className="text-base">Notes</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <dl className="space-y-3">
                            <InfoRow
                                label="Customer Note"
                                value={
                                    appointment.customer_note ?? (
                                        <span className="text-muted-foreground">
                                            —
                                        </span>
                                    )
                                }
                            />
                            <InfoRow
                                label="Admin Note"
                                value={
                                    appointment.admin_note ?? (
                                        <span className="text-muted-foreground">
                                            —
                                        </span>
                                    )
                                }
                            />
                        </dl>
                    </CardContent>
                </Card>

                {/* Status Update */}
                <Card>
                    <CardHeader>
                        <CardTitle className="text-base">
                            Update Status
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="mb-4 flex items-center gap-2">
                            <span className="text-sm text-muted-foreground">
                                Current:
                            </span>
                            <Badge variant={statusVariant(appointment.status)}>
                                {STATUS_LABELS[appointment.status] ??
                                    appointment.status}
                            </Badge>
                        </div>
                        <form
                            onSubmit={handleStatusUpdate}
                            className="flex items-end gap-3"
                        >
                            <div className="grid flex-1 gap-1.5">
                                <label
                                    htmlFor="status"
                                    className="text-sm font-medium"
                                >
                                    New Status
                                </label>
                                <select
                                    id="status"
                                    name="status"
                                    value={selectedStatus}
                                    onChange={(e) =>
                                        setSelectedStatus(e.target.value)
                                    }
                                    className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-xs transition-[color,box-shadow] outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50"
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
                            >
                                {processing ? 'Saving...' : 'Save'}
                            </Button>
                        </form>
                    </CardContent>
                </Card>
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
