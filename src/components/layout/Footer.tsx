import React, { useState, useEffect } from 'react';

const FALLBACK_QUOTES = [
    "Keep pushing forward!",
    "The secret of getting ahead is getting started.",
    "It does not matter how slowly you go as long as you do not stop.",
    "Everything you can imagine is real.",
    "Whatever you are, be a good one.",
    "Do what you can, with what you have, where you are."
];

const Footer: React.FC = () => {
    const [content, setContent] = useState('');

    useEffect(() => {
        fetch('https://dummyjson.com/quotes/random')
            .then(res => res.json())
            .then(data => {
                if (data && data.quote) {
                    setContent(`${data.quote} — ${data.author}`);
                } else {
                    throw new Error('Invalid format');
                }
            })
            .catch(() => {
                const randomIndex = Math.floor(Math.random() * FALLBACK_QUOTES.length);
                setContent(FALLBACK_QUOTES[randomIndex]);
            });
    }, []);

    return (
        <footer className="px-6 py-4 bg-white border-t border-indigo-100 flex-shrink-0 text-center shadow-[0_-1px_2px_rgba(0,0,0,0.02)] z-10">
            <p className="text-sm font-medium text-indigo-600 italic">
                {content ? `"${content}"` : "Loading inspiration..."}
            </p>
        </footer>
    );
};

export default Footer;
