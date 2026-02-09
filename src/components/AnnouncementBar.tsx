import React from 'react';
import './AnnouncementBar.css';

const announcements = [
    'FREE SHIPPING ON ALL PREPAID ORDERS',
    'FREE COD ON ORDERS ABOVE ₹299',
    'FREE CHYAWANPRASH SAMPLE ON ORDERS ABOVE ₹1149',
    'AUTHENTIC AYURVEDIC MEDICINES - 100% NATURAL',
    'FREE SHIPPING ON ALL PREPAID ORDERS',
    'FREE COD ON ORDERS ABOVE ₹299',
];

const AnnouncementBar: React.FC = () => {
    return (
        <div className="announcement-bar">
            <div className="announcement-content">
                {announcements.map((text, index) => (
                    <span key={index} className="announcement-item">
                        {text}
                        <span className="announcement-separator">•</span>
                    </span>
                ))}
            </div>
        </div>
    );
};

export default AnnouncementBar;
