import { Leaf } from 'lucide-react';

export default function AppLogo() {
    return (
        <>
            <div className="flex aspect-square size-8 items-center justify-center rounded-md bg-violet-600 text-white dark:bg-violet-750">
                <Leaf className="size-4 fill-current text-white" />
            </div>
            <div className="ml-1 grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-semibold text-neutral-800 dark:text-neutral-100">
                    Home Therapy Admin
                </span>
                <span className="text-[10px] text-muted-foreground truncate leading-none">
                    Safe Soft Wellness
                </span>
            </div>
        </>
    );
}
