import { Head, Link, router } from '@inertiajs/react';
import { ClipboardList } from 'lucide-react';
import Heading from '@/components/heading';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { dashboard } from '@/routes';
import {
    create,
    index as servicesIndex,
    edit,
    toggleActive,
} from '@/routes/admin/services';
import type { BreadcrumbItem } from '@/types';

type Service = {
    id: number;
    name: string;
    description: string | null;
    duration_minutes: number;
    price: number;
    is_main_service: boolean;
    is_active: boolean;
    sort_order: number;
};

function formatPrice(price: number): string {
    return `Rp ${price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.')}`;
}

export default function Index({ services }: { services: Service[] }) {
    function handleToggleActive(service: Service) {
        if (
            confirm(
                `Are you sure you want to ${service.is_active ? 'deactivate' : 'activate'} "${service.name}"?`,
            )
        ) {
            router.patch(toggleActive.url(service.id));
        }
    }

    return (
        <>
            <Head title="Services" />

            <div className="flex items-center justify-between">
                <Heading
                    title="Services"
                    description="Manage your service offerings"
                />
                <Button asChild>
                    <Link href={create()}>Create Service</Link>
                </Button>
            </div>

            {services.length === 0 ? (
                <Card className="mt-6">
                    <CardContent className="flex flex-col items-center gap-2 py-12">
                        <ClipboardList className="size-12 text-muted-foreground" />
                        <p className="text-sm text-muted-foreground">
                            No services yet.
                        </p>
                        <Button asChild variant="outline">
                            <Link href={create()}>
                                Create your first service
                            </Link>
                        </Button>
                    </CardContent>
                </Card>
            ) : (
                <>
                    {/* Desktop Table View */}
                    <div className="mt-6 hidden overflow-x-auto rounded-xl border border-sidebar-border/70 bg-white md:block dark:border-sidebar-border dark:bg-neutral-900/50">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="border-b border-sidebar-border/70 dark:border-sidebar-border">
                                    <th className="px-4 py-3 text-left font-medium text-muted-foreground">
                                        Name
                                    </th>
                                    <th className="px-4 py-3 text-left font-medium text-muted-foreground">
                                        Type
                                    </th>
                                    <th className="px-4 py-3 text-left font-medium text-muted-foreground">
                                        Duration
                                    </th>
                                    <th className="px-4 py-3 text-left font-medium text-muted-foreground">
                                        Price
                                    </th>
                                    <th className="px-4 py-3 text-left font-medium text-muted-foreground">
                                        Status
                                    </th>
                                    <th className="px-4 py-3 text-left font-medium text-muted-foreground">
                                        Order
                                    </th>
                                    <th className="px-4 py-3 text-right font-medium text-muted-foreground">
                                        Actions
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {services.map((service) => (
                                    <tr
                                        key={service.id}
                                        className="border-b border-sidebar-border/70 last:border-b-0 dark:border-sidebar-border"
                                    >
                                        <td className="px-4 py-3">
                                            <div className="font-medium">
                                                {service.name}
                                            </div>
                                            {service.description && (
                                                <div className="line-clamp-1 text-xs text-muted-foreground">
                                                    {service.description}
                                                </div>
                                            )}
                                        </td>
                                        <td className="px-4 py-3">
                                            <Badge
                                                variant={
                                                    service.is_main_service
                                                        ? 'default'
                                                        : 'secondary'
                                                }
                                            >
                                                {service.is_main_service
                                                    ? 'Main'
                                                    : 'Add-on'}
                                            </Badge>
                                        </td>
                                        <td className="px-4 py-3 text-muted-foreground">
                                            {service.duration_minutes} min
                                        </td>
                                        <td className="px-4 py-3">
                                            {formatPrice(service.price)}
                                        </td>
                                        <td className="px-4 py-3">
                                            <Badge
                                                variant={
                                                    service.is_active
                                                        ? 'default'
                                                        : 'destructive'
                                                }
                                            >
                                                {service.is_active
                                                    ? 'Active'
                                                    : 'Inactive'}
                                            </Badge>
                                        </td>
                                        <td className="px-4 py-3 text-muted-foreground">
                                            {service.sort_order}
                                        </td>
                                        <td className="px-4 py-3 text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    asChild
                                                >
                                                    <Link
                                                        href={edit(service.id)}
                                                    >
                                                        Edit
                                                    </Link>
                                                </Button>
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={() =>
                                                        handleToggleActive(
                                                            service,
                                                        )
                                                    }
                                                >
                                                    {service.is_active
                                                        ? 'Deactivate'
                                                        : 'Activate'}
                                                </Button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Mobile Card Grid View */}
                    <div className="mt-6 grid grid-cols-1 gap-4 md:hidden">
                        {services.map((service) => (
                            <Card
                                key={service.id}
                                className="overflow-hidden rounded-2xl border border-neutral-100 bg-white shadow-sm dark:border-neutral-800 dark:bg-neutral-900/50"
                            >
                                <div className="space-y-4 p-5">
                                    <div className="flex items-start justify-between gap-4">
                                        <div className="min-w-0">
                                            <h3 className="text-neutral-800 truncate text-sm font-semibold dark:text-neutral-200">
                                                {service.name}
                                            </h3>
                                            <div className="mt-1.5 flex items-center gap-1.5">
                                                <Badge
                                                    variant={
                                                        service.is_main_service
                                                            ? 'default'
                                                            : 'secondary'
                                                    }
                                                    className="rounded-full px-1.5 py-0 text-[10px]"
                                                >
                                                    {service.is_main_service
                                                        ? 'Main'
                                                        : 'Add-on'}
                                                </Badge>
                                                <Badge
                                                    variant={
                                                        service.is_active
                                                            ? 'default'
                                                            : 'destructive'
                                                    }
                                                    className="rounded-full px-1.5 py-0 text-[10px]"
                                                >
                                                    {service.is_active
                                                        ? 'Active'
                                                        : 'Inactive'}
                                                </Badge>
                                            </div>
                                        </div>
                                        <span className="shrink-0 rounded-md bg-neutral-50 px-2 py-0.5 text-[10px] font-medium text-muted-foreground dark:bg-neutral-800">
                                            Order: {service.sort_order}
                                        </span>
                                    </div>

                                    {service.description && (
                                        <p className="line-clamp-2 rounded-xl bg-neutral-50/50 p-2.5 text-xs leading-relaxed text-muted-foreground dark:bg-neutral-950/20">
                                            {service.description}
                                        </p>
                                    )}

                                    <div className="flex items-center justify-between border-t border-neutral-50 pt-3 text-xs dark:border-neutral-800/60">
                                        <div className="flex items-center gap-1 text-muted-foreground">
                                            <span>Duration:</span>
                                            <span className="font-medium text-neutral-700 dark:text-neutral-300">
                                                {service.duration_minutes} min
                                            </span>
                                        </div>
                                        <div className="text-right">
                                            <span className="text-sm font-bold text-neutral-800 dark:text-neutral-100">
                                                {formatPrice(service.price)}
                                            </span>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-2 pt-1">
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            className="dark:border-neutral-800 h-9 flex-1 rounded-xl border-neutral-200"
                                            asChild
                                        >
                                            <Link href={edit(service.id)}>
                                                Edit
                                            </Link>
                                        </Button>
                                        <Button
                                            variant={
                                                service.is_active
                                                    ? 'outline'
                                                    : 'default'
                                            }
                                            size="sm"
                                            className={`h-9 flex-1 rounded-xl ${
                                                service.is_active
                                                    ? 'dark:text-rose-400 dark:hover:bg-rose-950/10 border-rose-200 text-rose-600 shadow-none hover:bg-rose-50/30 hover:text-rose-700 dark:border-rose-900/40'
                                                    : 'border-none bg-emerald-600 text-white shadow-none hover:bg-emerald-700 dark:bg-emerald-700 dark:hover:bg-emerald-800'
                                            }`}
                                            onClick={() =>
                                                handleToggleActive(service)
                                            }
                                        >
                                            {service.is_active
                                                ? 'Deactivate'
                                                : 'Activate'}
                                        </Button>
                                    </div>
                                </div>
                            </Card>
                        ))}
                    </div>
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
            title: 'Services',
            href: servicesIndex(),
        },
    ] satisfies BreadcrumbItem[],
};
