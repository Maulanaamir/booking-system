import { Leaf } from 'lucide-react';

export default function AppLogo() {
    return (
        <>
            <div className="flex aspect-square size-8 items-center justify-center rounded-md bg-sidebar-primary text-sidebar-primary-foreground">
                <Leaf className="size-4 fill-current text-sidebar-primary-foreground" />
            </div>
            <div className="ml-1 grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-semibold text-neutral-800 dark:text-neutral-100">
                    Home Care Therapy
                </span>
                <span className="truncate text-[10px] leading-none text-muted-foreground">
                    Safe Soft Wellness Admin
                </span>
            </div>
        </>
    );
}
