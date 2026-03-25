import Link from "next/link";
import type { ReactNode } from "react";
import { GravityBackground } from "@/components/GravityBackground";

type LayoutProps = {
    children: ReactNode;
};

export function Layout({ children }: LayoutProps) {
    return (
        <div className='frame'>
            <GravityBackground />
            <div className='content'>
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
