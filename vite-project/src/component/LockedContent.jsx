import React from 'react';
import { Lock } from 'lucide-react';
import PaymentButton from './premiumButton';

const LockedContent = ({ title, description }) => {
    return (
        <div className="flex flex-col items-center justify-center p-12 text-center space-y-6 bg-base-200/50 rounded-xl border border-base-300">
            <div className="p-4 bg-base-300 rounded-full">
                <Lock size={48} className="text-primary opacity-80" />
            </div>

            <div className="space-y-2 max-w-md">
                <h3 className="text-2xl font-bold">{title || "Premium Content Locked"}</h3>
                <p className="text-base-content/70">
                    {description || "Subscribe to Premium to access this content, including video solutions and reference code."}
                </p>
            </div>

            <div className="pt-4">
                <PaymentButton />
            </div>
        </div>
    );
};

export default LockedContent;
