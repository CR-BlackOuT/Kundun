import React from 'react';

type IconProps = { className?: string };

export const HeaderIcon: React.FC<IconProps> = ({ className }) => (
    <svg className={className || "w-12 h-12 text-cyan-400"} viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
        <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2zM8 11a1 1 0 100 2h8a1 1 0 100-2H8zm-3 5a1 1 0 011-1h10a1 1 0 110 2H6a1 1 0 01-1-1zm1-9a1 1 0 100 2h10a1 1 0 100-2H6z" />
    </svg>
);

export const SkipIcon: React.FC<IconProps> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-8.707l-3-3a1 1 0 00-1.414 1.414L10.586 9H7a1 1 0 100 2h3.586l-1.293 1.293a1 1 0 101.414 1.414l3-3a1 1 0 000-1.414z" clipRule="evenodd" />
    </svg>
);
