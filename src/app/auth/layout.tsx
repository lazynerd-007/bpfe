import Link from 'next/link';
import Image from 'next/image';
import {ROUTES} from '@/lib/constants';

interface AuthLayoutProps {
    children: React.ReactNode;
}

export default function AuthLayout({children}: AuthLayoutProps) {
    return (
        <div className="grid min-h-svh lg:grid-cols-2">
            <div className="flex flex-col gap-4 p-6 md:p-10">
                <div className="flex justify-center items-center gap-1 md:justify-start">
                    <Link href={ROUTES.DASHBOARD} className="flex items-center gap-2 font-medium">
                        <Image
                            src="/logo.png"
                            alt="Blupay Africa Logo"
                            width={32}
                            height={32}
                        />
                        <span className=" font-medium">Blupay Africa</span>
                    </Link>
                </div>
                <div className="flex flex-1 items-center justify-center">
                    <div className="w-full max-w-xs">
                        {children}
                    </div>
                </div>
            </div>
            <div className="bg-muted relative hidden lg:block">
                <div
                    className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
                    <Image
                        src="/logo.png"
                        alt="Blupay Africa"
                        width={300}
                        height={300}
                        className="opacity-10"
                    />
                </div>
            </div>
        </div>
    );
}