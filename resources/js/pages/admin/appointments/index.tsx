import { Head, Link } from '@inertiajs/react';
import { CalendarDays } from 'lucide-react';
import Heading from '@/components/heading';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { dashboard } from '@/routes';
import {
    index as appointmentsIndex,
    show as appointmentsShow,
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

type AppointmentListItem = {
    id: string;
    customer: Customer;
    therapist: Therapist;
    start_at: string;
    status: string;
    payment_status: string;
    total_price: number;
};

type PaginatedAppointments = {
    data: AppointmentListItem[];
    links: {
        url: string | null;
        label: string;
        active: boolean;
    }[];
    current_page: number;
    last_page: number;
    total: number;
};

function formatPrice(price: number): string {
    return `Rp ${price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.')}`;
}

function formatDate(dateStr: string): string {
    return new Date(dateStr).toLocaleDateString('id-ID', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
    });
}

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

export default function Index({
    appointments,
}: {
    appointments: PaginatedAppointments;
}) {
    return (
        <>
            <Head title="Appointments" />

            <div className="flex items-center justify-between">
                <Heading
                    title="Appointments"
                    description="View and manage customer appointments"
                />
            </div>

            {appointments.data.length === 0 ? (
                <Card className="mt-6">
                    <CardContent className="flex flex-col items-center gap-2 py-12">
                        <CalendarDays className="size-12 text-muted-foreground" />
                        <p className="text-sm text-muted-foreground">
                            No appointments yet.
                        </p>
                    </CardContent>
                </Card>
            ) : (
                <>
                    <div className="mt-6 overflow-x-auto rounded-xl border border-sidebar-border/70 dark:border-sidebar-border">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="border-b border-sidebar-border/70 dark:border-sidebar-border">
                                    <th className="px-4 py-3 text-left font-medium text-muted-foreground">
                                        Customer
                                    </th>
                                    <th className="px-4 py-3 text-left font-medium text-muted-foreground">
                                        Therapist
                                    </th>
                                    <th className="px-4 py-3 text-left font-medium text-muted-foreground">
                                        Schedule
                                    </th>
                                    <th className="px-4 py-3 text-left font-medium text-muted-foreground">
                                        Status
                                    </th>
                                    <th className="px-4 py-3 text-left font-medium text-muted-foreground">
                                        Payment
                                    </th>
                                    <th className="px-4 py-3 text-left font-medium text-muted-foreground">
                                        Total
                                    </th>
                                    <th className="px-4 py-3 text-right font-medium text-muted-foreground">
                                        Actions
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {appointments.data.map((appointment) => (
                                    <tr
                                        key={appointment.id}
                                        className="border-b border-sidebar-border/70 last:border-b-0 dark:border-sidebar-border"
                                    >
                                        <td className="px-4 py-3">
                                            <div className="font-medium">
                                                {appointment.customer.name}
                                            </div>
                                            <div className="text-xs text-muted-foreground">
                                                {
                                                    appointment.customer
                                                        .phone_number
                                                }
                                            </div>
                                        </td>
                                        <td className="px-4 py-3 text-muted-foreground">
                                            {appointment.therapist.name}
                                        </td>
                                        <td className="px-4 py-3 text-muted-foreground">
                                            {formatDate(appointment.start_at)}
                                        </td>
                                        <td className="px-4 py-3">
                                            <Badge
                                                variant={statusVariant(
                                                    appointment.status,
                                                )}
                                            >
                                                {STATUS_LABELS[
                                                    appointment.status
                                                ] ?? appointment.status}
                                            </Badge>
                                        </td>
                                        <td className="px-4 py-3 text-muted-foreground">
                                            {appointment.payment_status}
                                        </td>
                                        <td className="px-4 py-3">
                                            {formatPrice(
                                                appointment.total_price,
                                            )}
                                        </td>
                                        <td className="px-4 py-3 text-right">
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                asChild
                                            >
                                                <Link
                                                    href={appointmentsShow(
                                                        appointment.id,
                                                    )}
                                                >
                                                    View
                                                </Link>
                                            </Button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {appointments.last_page > 1 && (
                        <div className="mt-4 flex items-center justify-center gap-1">
                            {appointments.links.map((link, i) => (
                                <Button
                                    key={i}
                                    variant={link.active ? 'default' : 'ghost'}
                                    size="sm"
                                    asChild={link.url !== null}
                                    disabled={link.url === null}
                                >
                                    {link.url !== null ? (
                                        <Link
                                            href={link.url}
                                            dangerouslySetInnerHTML={{
                                                __html: link.label,
                                            }}
                                        />
                                    ) : (
                                        <span
                                            dangerouslySetInnerHTML={{
                                                __html: link.label,
                                            }}
                                        />
                                    )}
                                </Button>
                            ))}
                        </div>
                    )}
                </>
            )}
        </>
    );
}

Index.layout = {
    breadcrumbs: [
        {
            title: 'Dashboard',
            href: dashboard(),
        },
        {
            title: 'Appointments',
            href: appointmentsIndex(),
        },
    ] satisfies BreadcrumbItem[],
};
