import { Form, Head, Link } from '@inertiajs/react';
import ServiceController from '@/actions/App/Http/Controllers/Admin/ServiceController';
import Heading from '@/components/heading';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { dashboard } from '@/routes';
import { index as servicesIndex } from '@/routes/admin/services';
import type { BreadcrumbItem } from '@/types';

export default function Create() {
    return (
        <>
            <Head title="Create Service" />

            <div className="flex items-center justify-between">
                <Heading
                    title="Create Service"
                    description="Add a new service offering"
                />
                <Button variant="ghost" asChild>
                    <Link href={servicesIndex()}>Back</Link>
                </Button>
            </div>

            <div className="mt-6 max-w-xl">
                <Form
                    {...ServiceController.store.form()}
                    resetOnSuccess
                    className="space-y-6"
                >
                    {({ processing, errors }) => (
                        <>
                            <div className="grid gap-2">
                                <Label htmlFor="name">Name</Label>
                                <Input
                                    id="name"
                                    name="name"
                                    required
                                    placeholder="Service name"
                                />
                                <InputError message={errors.name} />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="description">Description</Label>
                                <textarea
                                    id="description"
                                    name="description"
                                    className="border-input bg-background focus-visible:border-ring focus-visible:ring-ring/50 flex min-h-[80px] w-full rounded-md border px-3 py-2 text-sm shadow-xs transition-[color,box-shadow] outline-none focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50"
                                    placeholder="Service description (optional)"
                                />
                                <InputError message={errors.description} />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="grid gap-2">
                                    <Label htmlFor="duration_minutes">Duration (minutes)</Label>
                                    <Input
                                        id="duration_minutes"
                                        name="duration_minutes"
                                        type="number"
                                        min="1"
                                        required
                                        placeholder="60"
                                    />
                                    <InputError message={errors.duration_minutes} />
                                </div>

                                <div className="grid gap-2">
                                    <Label htmlFor="price">Price (IDR)</Label>
                                    <Input
                                        id="price"
                                        name="price"
                                        type="number"
                                        min="0"
                                        required
                                        placeholder="120000"
                                    />
                                    <InputError message={errors.price} />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="flex items-center gap-2">
                                    <input type="hidden" name="is_main_service" value="0" />
                                    <input
                                        id="is_main_service"
                                        name="is_main_service"
                                        type="checkbox"
                                        value="1"
                                        defaultChecked
                                        className="size-4 rounded border-input accent-primary"
                                    />
                                    <Label htmlFor="is_main_service">Main service</Label>
                                </div>

                                <div className="grid gap-2">
                                    <Label htmlFor="sort_order">Sort order</Label>
                                    <Input
                                        id="sort_order"
                                        name="sort_order"
                                        type="number"
                                        min="0"
                                        placeholder="0"
                                    />
                                    <InputError message={errors.sort_order} />
                                </div>
                            </div>

                            <div className="flex items-center gap-4">
                                <Button disabled={processing}>
                                    {processing ? 'Creating...' : 'Create Service'}
                                </Button>
                            </div>
                        </>
                    )}
                </Form>
            </div>
        </>
    );
}

Create.layout = {
    breadcrumbs: [
        { title: 'Dashboard', href: dashboard() },
        { title: 'Services', href: servicesIndex() },
        { title: 'Create Service', href: servicesIndex() },
    ] satisfies BreadcrumbItem[],
};