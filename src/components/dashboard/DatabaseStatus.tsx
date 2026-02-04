import React, { useState, useEffect } from 'react';
import api from '@/lib/api';

const DatabaseStatus: React.FC = () => {
    const [status, setStatus] = useState<'connected' | 'disconnected' | 'checking'>('checking');

    const checkConnection = async () => {
        try {
            const response = await api.get('/health', {
                timeout: 5000
            });
            if (response.data.database === 'connected') {
                setStatus('connected');
            } else {
                setStatus('disconnected');
            }
        } catch (error) {
            setStatus('disconnected');
        }
    };

    useEffect(() => {
        checkConnection();
        const interval = setInterval(checkConnection, 30000); // Check every 30 seconds
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="flex items-center gap-2 px-3 py-1.5 bg-white/10 rounded-lg backdrop-blur-sm border border-white/20 shadow-inner">
            <div className={`w-2.5 h-2.5 rounded-full ${status === 'connected' ? 'bg-green-400 shadow-[0_0_8px_rgba(74,222,128,0.6)] animate-pulse' :
                status === 'disconnected' ? 'bg-red-400 shadow-[0_0_8px_rgba(248,113,113,0.6)]' :
                    'bg-yellow-400 animate-bounce'
                }`} />
            <span className="text-[10px] uppercase tracking-widest font-bold text-white/90">
                DB {status === 'connected' ? 'LIVE' : status === 'disconnected' ? 'OFFLINE' : 'SYNCING'}
            </span>
        </div>
    );
};

export default DatabaseStatus;
