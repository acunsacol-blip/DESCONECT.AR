import Link from 'next/link';
import { Home, Users, Calendar, LogOut } from 'lucide-react';
import { redirect } from 'next/navigation';

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="min-h-screen bg-slate-50 flex flex-col md:flex-row">
            {/* Sidebar */}
            <aside className="w-full md:w-64 bg-white border-b md:border-b-0 md:border-r border-slate-200 md:fixed md:h-full z-10">
                <div className="p-4 md:p-6 flex justify-between items-center">
                    <h2 className="text-xl md:text-2xl font-bold text-brand">Admin Panel</h2>
                    <div className="md:hidden">
                        {/* Mobile logout or toggle could go here, for now keeping it simple */}
                    </div>
                </div>
                <nav className="px-4 pb-4 md:space-y-2 flex md:block overflow-x-auto md:overflow-visible gap-2 md:gap-0">
                    <Link href="/admin/owners" className="flex items-center space-x-2 md:space-x-3 px-3 py-2 md:px-4 md:py-3 text-slate-600 hover:bg-brand/10 hover:text-brand rounded-lg transition-colors whitespace-nowrap">
                        <Users size={20} />
                        <span>Dueños</span>
                    </Link>
                    <Link href="/admin/properties" className="flex items-center space-x-2 md:space-x-3 px-3 py-2 md:px-4 md:py-3 text-slate-600 hover:bg-brand/10 hover:text-brand rounded-lg transition-colors whitespace-nowrap">
                        <Home size={20} />
                        <span>Propiedades</span>
                    </Link>

                    <div className="md:mt-8 flex-1 md:flex-none flex justify-end md:block">
                        <form action={async () => {
                            'use server';
                            redirect('/login');
                        }}>
                            <button className="flex items-center space-x-2 md:space-x-3 px-3 py-2 md:px-4 md:py-3 text-red-500 hover:bg-red-50 rounded-lg transition-colors w-full">
                                <LogOut size={20} />
                                <span className="hidden md:inline">Salir</span>
                            </button>
                        </form>
                    </div>
                </nav>
            </aside>

            {/* Main Content */}
            <main className="flex-1 ml-0 md:ml-64 p-4 md:p-8">
                {children}
            </main>
        </div>
    );
}
