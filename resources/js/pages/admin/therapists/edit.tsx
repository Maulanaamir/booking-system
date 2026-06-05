import { Form, Head, Link } from '@inertiajs/react';
import TherapistController from '@/actions/App/Http/Controllers/Admin/TherapistController';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { dashboard } from '@/routes';
import { index as therapistsIndex } from '@/routes/admin/therapists';
import type { BreadcrumbItem } from '@/types';

type Therapist = {
    id: number;
    name: string;
    phone_number: string;
    is_active: boolean;
};

export default function Edit({ therapist }: { therapist: Therapist }) {
    return (
        <>
            <Head title={`Edit ${therapist.name}`} />

            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-xl font-semibold tracking-tight">
                        Edit Therapist
                    </h2>
                    <p className="text-sm text-muted-foreground">
                        {therapist.name}
                    </p>
                </div>
                <Button variant="ghost" asChild>
                    <Link href={therapistsIndex()}>Back</Link>
                </Button>
            </div>

            <div className="mt-6 max-w-xl">
                <Form
                    {...TherapistController.update.form(therapist.id)}
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
                                    defaultValue={therapist.name}
                                    placeholder="Therapist name"
                                />
                                <InputError message={errors.name} />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="phone_number">
                                    Phone Number
                                </Label>
                                <Input
                                    id="phone_number"
                                    name="phone_number"
                                    required
                                    defaultValue={therapist.phone_number}
                                    placeholder="+62 812 3456 7890"
                                />
                                <InputError message={errors.phone_number} />
                            </div>

                            <div className="flex items-center gap-2">
                                <input
                                    type="hidden"
                                    name="is_active"
                                    value="0"
                                />
                                <input
                                    id="is_active"
                                    name="is_active"
                                    type="checkbox"
                                    value="1"
                                    defaultChecked={therapist.is_active}
                                    className="size-4 rounded border-input accent-primary"
                                />
                                <Label htmlFor="is_active">Active</Label>
                            </div>

                            <div className="flex items-center gap-4">
                                <Button disabled={processing}>
                                    {processing ? 'Saving...' : 'Save'}
                                </Button>
                            </div>
                        </>
                    )}
                </Form>
            </div>
        </>
    );
}

Edit.layout = {
    breadcrumbs: [
        { title: 'Dashboard', href: dashboard() },
        { title: 'Therapists', href: therapistsIndex() },
        { title: 'Edit Therapist', href: therapistsIndex() },
    ] satisfies BreadcrumbItem[],
};
