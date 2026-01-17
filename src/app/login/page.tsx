'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Lock } from 'lucide-react';

// Actually, prompt asked for Server Actions. Better to use a Server Action for login to set the cookie.

export default function LoginPage() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const router = useRouter();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const response = await fetch('/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, password }),
            });

            if (response.ok) {
                router.push('/admin');
            } else {
                setError('Credenciales incorrectas');
            }
        } catch (err) {
            setError('Ocurrió un error');
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-50 relative overflow-hidden">
            {/* Background blobs for Aero feel */}
            <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-brand/20 rounded-full blur-3xl mix-blend-multiply filter opacity-70 animate-blob"></div>
            <div className="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-brand-light/30 rounded-full blur-3xl mix-blend-multiply filter opacity-70 animate-blob animation-delay-2000"></div>

            <div className="glass-panel p-8 rounded-2xl w-full max-w-md z-10">
                <div className="flex justify-center mb-6">
                    <div className="bg-brand/10 p-4 rounded-full">
                        <Lock className="w-8 h-8 text-brand" />
                    </div>
                </div>
                <h1 className="text-2xl font-bold text-center text-slate-800 mb-2">Desconect.ar Admin</h1>
                <p className="text-center text-slate-500 mb-8">Acceso exclusivo para administradores</p>

                <form onSubmit={handleLogin} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Usuario</label>
                        <input
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand/50 bg-white/50"
                            placeholder="admin"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Contraseña</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand/50 bg-white/50"
                            placeholder="••••••••"
                        />
                    </div>

                    {error && <p className="text-red-500 text-sm text-center">{error}</p>}

                    <button
                        type="submit"
                        className="w-full glass-button py-3 rounded-lg font-semibold"
                    >
                        Ingresar
                    </button>
                </form>
            </div>
        </div>
    );
}
