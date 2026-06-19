import { Head, Link } from '@inertiajs/react';
import {
    CalendarDays,
    Clock,
    CreditCard,
    BadgeCheck,
    Users,
    ClipboardList,
    Calendar,
    ChevronRight,
    Leaf,
} from 'lucide-react';
import Heading from '@/components/heading';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { STATUS_BADGES } from '@/lib/admin-colors';
import { dashboard } from '@/routes';
import {
    index as appointmentsIndex,
    show as appointmentsShow,
} from '@/routes/admin/appointments';
import { index as servicesIndex } from '@/routes/admin/services';
import { index as therapistsIndex } from '@/routes/admin/therapists';
import type { BreadcrumbItem } from '@/types';

type DashboardStats = {
    total_appointments: number;
    pending_approval_count: number;
    pending_dp_count: number;
    confirmed_count: number;
    completed_count: number;
};

type UpcomingAppointmentItem = {
    id: string;
    customer: {
        id: number;
        name: string;
        phone_number: string;
    };
    therapist: {
        id: number;
        name: string;
    };
    start_at: string;
    status: string;
    payment_status: string;
    total_price: number;
};


function formatDate(dateStr: string): string {
    return new Date(dateStr).toLocaleDateString('id-ID', {
        weekday: 'short',
        day: 'numeric',
        month: 'short',
    });
}

function formatTime(dateStr: string): string {
    return new Date(dateStr).toLocaleTimeString('id-ID', {
        hour: '2-digit',
        minute: '2-digit',
    });
}

export default function Dashboard({
    stats = {
        total_appointments: 0,
        pending_approval_count: 0,
        pending_dp_count: 0,
        confirmed_count: 0,
        completed_count: 0,
    },
    upcomingAppointments = [],
}: {
    stats?: DashboardStats;
    upcomingAppointments?: UpcomingAppointmentItem[];
}) {
    return (
        <>
            <Head title="Dashboard" />

            <div className="mb-4 flex items-center justify-between">
                <Heading
                    title="Dashboard"
                    description="Operational overview of Home Care Therapy bookings"
                />
            </div>

            {/* Main Dashboard Workspace */}
            <div className="flex h-full flex-1 flex-col gap-6">
                {/* Stats Cards Grid */}
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    {/* Total Bookings */}
                    <Card className="overflow-hidden rounded-2xl border-neutral-100 bg-white shadow-sm dark:border-neutral-800 dark:bg-neutral-900/50">
                        <CardContent className="flex items-center justify-between p-5">
                            <div className="space-y-1">
                                <span className="block text-xs font-semibold tracking-wider text-neutral-400 uppercase">
                                    Total Bookings
                                </span>
                                <span className="block text-2xl font-bold text-neutral-800 dark:text-neutral-100">
                                    {stats.total_appointments}
                                </span>
                                <span className="block text-[10px] text-muted-foreground">
                                    All-time cumulative bookings
                                </span>
                            </div>
                            <div className="dark:bg-violet-950/20 text-violet-600 rounded-2xl bg-violet-50 p-3 dark:text-violet-400">
                                <CalendarDays className="size-5" />
                            </div>
                        </CardContent>
                    </Card>

                    {/* Pending Approvals */}
                    <Card className="overflow-hidden rounded-2xl border-neutral-100 bg-white shadow-sm dark:border-neutral-800 dark:bg-neutral-900/50">
                        <CardContent className="flex items-center justify-between p-5">
                            <div className="space-y-1">
                                <span className="block text-xs font-semibold tracking-wider text-neutral-400 uppercase">
                                    Pending Approval
                                </span>
                                <span className="block text-2xl font-bold text-amber-700 dark:text-amber-400">
                                    {stats.pending_approval_count}
                                </span>
                                <span className="block text-[10px] text-muted-foreground">
                                    Awaiting administrator review
                                </span>
                            </div>
                            <div className="dark:bg-amber-950/20 rounded-2xl bg-amber-50 p-3 text-amber-600 dark:text-amber-400">
                                <Clock className="size-5" />
                            </div>
                        </CardContent>
                    </Card>

                    {/* Pending Deposit */}
                    <Card className="overflow-hidden rounded-2xl border-neutral-100 bg-white shadow-sm dark:border-neutral-800 dark:bg-neutral-900/50">
                        <CardContent className="flex items-center justify-between p-5">
                            <div className="space-y-1">
                                <span className="block text-xs font-semibold tracking-wider text-neutral-400 uppercase">
                                    Pending Deposit
                                </span>
                                <span className="dark:text-amber-400 block text-2xl font-bold text-amber-700">
                                    {stats.pending_dp_count}
                                </span>
                                <span className="block text-[10px] text-muted-foreground">
                                    Awaiting client DP confirmation
                                </span>
                            </div>
                            <div className="dark:bg-amber-950/20 rounded-2xl bg-amber-50 p-3 text-amber-600 dark:text-amber-400">
                                <CreditCard className="size-5" />
                            </div>
                        </CardContent>
                    </Card>

                    {/* Confirmed Upcoming */}
                    <Card className="overflow-hidden rounded-2xl border-neutral-100 bg-white shadow-sm dark:border-neutral-800 dark:bg-neutral-900/50">
                        <CardContent className="flex items-center justify-between p-5">
                            <div className="space-y-1">
                                <span className="block text-xs font-semibold tracking-wider text-neutral-400 uppercase">
                                    Confirmed / Active
                                </span>
                                <span className="dark:text-emerald-400 block text-2xl font-bold text-emerald-700">
                                    {stats.confirmed_count}
                                </span>
                                <span className="block text-[10px] text-muted-foreground">
                                    Scheduled sessions upcoming
                                </span>
                            </div>
                            <div className="dark:bg-emerald-950/20 dark:text-emerald-400 rounded-2xl bg-emerald-50 p-3 text-emerald-600">
                                <BadgeCheck className="size-5" />
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Secondary operational splits */}
                <div className="grid gap-6 lg:grid-cols-3">
                    {/* Upcoming / Active Bookings list */}
                    <Card className="rounded-2xl border-neutral-100 bg-white shadow-sm lg:col-span-2 dark:border-neutral-800 dark:bg-neutral-900/50">
                        <CardHeader className="flex flex-row items-center justify-between pb-3">
                            <CardTitle className="text-base font-semibold text-neutral-800 dark:text-neutral-200">
                                Upcoming &amp; Active Bookings
                            </CardTitle>
                            <Button
                                variant="link"
                                className="h-auto p-0 font-medium text-violet-600 dark:text-violet-400"
                                asChild
                            >
                                <Link href={appointmentsIndex()}>View All</Link>
                            </Button>
                        </CardHeader>
                        <CardContent>
                            {upcomingAppointments.length === 0 ? (
                                <div className="py-12 text-center text-sm text-muted-foreground italic">
                                    No upcoming active appointments.
                                </div>
                            ) : (
                                <div className="divide-y divide-neutral-100 dark:divide-neutral-800">
                                    {upcomingAppointments.map((app) => (
                                        <div
                                            key={app.id}
                                            className="flex flex-col gap-3 py-3.5 first:pt-0 last:pb-0 sm:flex-row sm:items-center sm:justify-between sm:gap-4"
                                        >
                                            <div className="min-w-0 flex-1">
                                                <div className="flex flex-wrap items-center gap-2">
                                                    <span className="truncate font-semibold text-neutral-800 dark:text-neutral-200">
                                                        {app.customer.name}
                                                    </span>
                                                    <Badge
                                                        variant="outline"
                                                        className={`rounded-full px-1.5 py-0 text-[10px] ${
                                                            STATUS_BADGES[
                                                                app.status
                                                            ]?.className || ''
                                                        }`}
                                                    >
                                                        {STATUS_BADGES[
                                                            app.status
                                                        ]?.label || app.status}
                                                    </Badge>
                                                </div>
                                                <div className="mt-1.5 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted-foreground">
                                                    <span className="flex items-center gap-1">
                                                        <Calendar className="text-neutral-400 size-3.5" />
                                                        {formatDate(
                                                            app.start_at,
                                                        )}
                                                    </span>
                                                    <span className="flex items-center gap-1">
                                                        <Clock className="text-neutral-400 size-3.5" />
                                                        {formatTime(
                                                            app.start_at,
                                                        )}
                                                    </span>
                                                    <span className="font-medium text-neutral-400 dark:text-neutral-500">
                                                        Therapist:{' '}
                                                        {app.therapist.name}
                                                    </span>
                                                </div>
                                            </div>
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                className="hover:text-violet-700 flex h-9 w-full shrink-0 items-center justify-center gap-1 rounded-xl border-neutral-200 shadow-none transition-all hover:border-violet-300 hover:bg-violet-50/50 sm:h-8 sm:w-auto dark:border-neutral-800 dark:hover:border-violet-950/20"
                                                asChild
                                            >
                                                <Link
                                                    href={appointmentsShow(
                                                        app.id,
                                                    )}
                                                >
                                                    <span>View Details</span>
                                                    <ChevronRight className="size-3.5" />
                                                </Link>
                                            </Button>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    {/* Quick navigation actions panel */}
                    <div className="space-y-6">
                        <Card className="rounded-2xl border-neutral-100 bg-white shadow-sm dark:border-neutral-800 dark:bg-neutral-900/50">
                            <CardHeader className="flex flex-row items-center justify-between pb-3">
                                <CardTitle className="text-base font-semibold text-neutral-800 dark:text-neutral-200">
                                    Quick Directory Access
                                </CardTitle>
                                <Leaf className="size-4 text-violet-500" />
                            </CardHeader>
                            <CardContent className="grid gap-3">
                                <Button
                                    variant="outline"
                                    className="border-neutral-200 hover:text-violet-700 dark:border-neutral-800 dark:hover:bg-violet-950/20 dark:text-neutral-300 h-12 w-full justify-start rounded-xl text-neutral-700 transition-colors hover:bg-violet-50/50"
                                    asChild
                                >
                                    <Link href={appointmentsIndex()}>
                                        <Calendar className="mr-2.5 size-4 shrink-0 text-violet-500" />
                                        <span className="text-sm font-semibold">
                                            Appointments Ledger
                                        </span>
                                    </Link>
                                </Button>

                                <Button
                                    variant="outline"
                                    className="border-neutral-200 hover:text-emerald-700 dark:border-neutral-800 dark:hover:bg-emerald-950/20 dark:text-neutral-300 h-12 w-full justify-start rounded-xl text-neutral-700 transition-colors hover:bg-emerald-50/50"
                                    asChild
                                >
                                    <Link href={servicesIndex()}>
                                        <ClipboardList className="mr-2.5 size-4 shrink-0 text-emerald-500" />
                                        <span className="text-sm font-semibold">
                                            Services Configuration
                                        </span>
                                    </Link>
                                </Button>

                                <Button
                                    variant="outline"
                                    className="border-neutral-200 hover:text-amber-700 dark:border-neutral-800 dark:hover:bg-amber-950/20 dark:text-neutral-300 h-12 w-full justify-start rounded-xl text-neutral-700 transition-colors hover:bg-amber-50/50"
                                    asChild
                                >
                                    <Link href={therapistsIndex()}>
                                        <Users className="mr-2.5 size-4 shrink-0 text-amber-500" />
                                        <span className="text-sm font-semibold">
                                            Therapists Registry
                                        </span>
                                    </Link>
                                </Button>
                            </CardContent>
                        </Card>

                        {/* Completed Sessions Count Card */}
                        <Card className="overflow-hidden rounded-2xl border-neutral-100 bg-white shadow-sm dark:border-neutral-800 dark:bg-neutral-900/50">
                            <CardContent className="flex items-center justify-between p-5">
                                <div className="space-y-1">
                                    <span className="block text-xs font-semibold tracking-wider text-neutral-400 uppercase">
                                        Completed Sessions
                                    </span>
                                    <span className="block text-xl font-bold text-neutral-700 dark:text-neutral-300">
                                        {stats.completed_count} sessions
                                    </span>
                                    <span className="block text-[10px] text-muted-foreground">
                                        Total therapies completed successfully
                                    </span>
                                </div>
                                <div className="dark:bg-neutral-800 text-neutral-500 rounded-xl bg-neutral-100 p-2.5 dark:text-neutral-400">
                                    <BadgeCheck className="size-4" />
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </>
    );
}

Dashboard.layout = {
    breadcrumbs: [
        {
            title: 'Dashboard',
            href: dashboard(),
        },
    ] satisfies BreadcrumbItem[],
};
