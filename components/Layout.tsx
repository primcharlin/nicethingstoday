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

                <nav className='mt-2 flex justify-center gap-3 text-[10px] text-foreground/75'>
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
