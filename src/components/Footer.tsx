import React from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../types';

const Footer: React.FC = () => {
    const { theme } = useSelector((state: RootState) => state.theme);

    return (
        <footer className={`py-3 mt-auto ${theme === 'dark' ? 'bg-dark text-light' : 'bg-light text-dark'}`}>
            <div className="container-fluid d-flex justify-content-center align-items-center">
                <span className="small">
                    &copy; {new Date().getFullYear()} TrackWise. All rights reserved.
                </span>
            </div>
        </footer>
    );
};

export default Footer;
