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
                <main className='main-shell'>{children}</main>

                <nav className='mt-2 flex justify-center gap-3'>
                    <Link
                        href='/'
                        className='inline-flex items-center justify-center rounded-[32px] border-0 bg-card px-4 py-2.5 text-sm text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-500 focus-visible:ring-offset-2 focus-visible:ring-offset-background'>
                        Today
                    </Link>
                    <span className='self-center text-foreground/70'>·</span>
                    <Link
                        href='/year'
                        className='inline-flex items-center justify-center rounded-[32px] border-0 bg-card px-4 py-2.5 text-sm text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-500 focus-visible:ring-offset-2 focus-visible:ring-offset-background'>
                        Year
                    </Link>
                </nav>
            </div>
        </div>
    );
}
