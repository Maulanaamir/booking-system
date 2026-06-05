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
                <div className="mt-6 overflow-x-auto rounded-xl border border-sidebar-border/70 dark:border-sidebar-border">
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
                                                <Link href={edit(service.id)}>
                                                    Edit
                                                </Link>
                                            </Button>
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={() =>
                                                    handleToggleActive(service)
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
