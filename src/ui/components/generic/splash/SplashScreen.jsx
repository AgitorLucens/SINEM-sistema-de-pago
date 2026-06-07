import { useState, useEffect } from 'react';
import './splash.css';

const SplashScreen = ({ onFinish }) => {
    const [fadeOut, setFadeOut] = useState(false);

    useEffect(() => {
        const timer = setTimeout(() => {
            setFadeOut(true);
            setTimeout(onFinish, 500);
        }, 1500);
        return () => clearTimeout(timer);
    }, [onFinish]);

    return (
        <div className={`splash-overlay${fadeOut ? ' splash-fade-out' : ''}`}>
            <div className="splash-content">
                <div className="splash-logo">
                    <svg width="64" height="64" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <rect width="64" height="64" rx="16" fill="#4f46e5"/>
                        <path d="M20 44V20h8l8 12 8-12h8v24h-8V32l-8 12-8-12v12H20z" fill="white"/>
                    </svg>
                </div>
                <h1 className="splash-title">SINEM</h1>
                <p className="splash-subtitle">Sistema de Gesti&oacute;n de Pagos</p>
                <div className="splash-spinner">
                    <div className="splash-spinner-dot" />
                    <div className="splash-spinner-dot" />
                    <div className="splash-spinner-dot" />
                </div>
            </div>
        </div>
    );
};

export default SplashScreen;
