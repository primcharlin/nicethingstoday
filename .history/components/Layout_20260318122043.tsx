import Link from "next/link";
import type { ReactNode } from "react";

type LayoutProps = {
    children: ReactNode;
};

export function Layout({ children }: LayoutProps) {
    return (
        <div className='min-h-screen bg-background text-foreground flex items-center justify-center'>
            <div className='relative flex w-full max-w-xs sm:max-w-sm md:max-w-2xl lg:max-w-4xl flex-col px-4 py-6'>
                <div className='absolute left-4 top-4 flex items-center gap-2 text-[10px] text-foreground/70'>
                    <Link
                        href='/'
                        className='font-semibold tracking-wide'>
                        NiceThingsToday
                    </Link>
                    <span className='hidden sm:inline'>
                        · small, cozy moments
                    </span>
                </div>

                <main className='mt-6 sm:mt-10 flex-1'>{children}</main>

                <nav className='mt-4 flex justify-center gap-3 text-[11px] text-foreground/75'>
                    <Link
                        href='/'
                        className='underline-offset-2 hover:underline'>
                        Today
                    </Link>
                    <span>·</span>
                    <Link
                        href='/year'
                        className='underline-offset-2 hover:underline'>
                        Year
                    </Link>
                </nav>
            </div>
        </div>
    );
}
