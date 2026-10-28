import { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { Tag } from 'antd';
import { ChartNoAxesCombined, CalendarDays, ClipboardCheck, Menu, X } from 'lucide-react';

export default function Navbar({ watchlistCount = 0 }) {
    const [menuOpen, setMenuOpen] = useState(false);
    const closeMenu = () => setMenuOpen(false);

    return (
        <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-[#f0f0f0]">
            <nav className="max-w-7xl mx-auto px-2.5 sm:px-6 lg:px-8 h-16 flex items-center justify-between" aria-label="Main navigation">
                {/* Brand Logo */}
                <NavLink className="inline-flex items-center shrink-0" to="/" aria-label="IPOGMP Home">
                    <img src="/logo.png" alt="IPOGMP" className="h-11 sm:h-12 w-auto object-contain transition-opacity duration-200 hover:opacity-90" />
                </NavLink>

                {/* Primary Navigation Links */}
                <div
                    className={`${
                        menuOpen
                            ? 'flex flex-col absolute top-16 left-0 right-0 bg-white border-b border-[#f0f0f0] shadow-xl p-3 gap-1 z-50 md:static md:flex md:flex-row md:items-center md:gap-1 md:h-16 md:p-0 md:border-0 md:shadow-none'
                            : 'hidden md:flex items-center gap-1 h-16'
                    }`}
                    id="primary-navigation"
                >
                    <NavLink
                        onClick={closeMenu}
                        className={({ isActive }) =>
                            `relative inline-flex items-center gap-2 h-10 md:h-16 px-3 md:px-4 text-sm font-medium transition-colors duration-200 rounded-md md:rounded-none select-none ${
                                isActive
                                    ? 'text-primary-green font-semibold bg-emerald-50/60 md:bg-transparent md:after:absolute md:after:bottom-0 md:after:left-4 md:after:right-4 md:after:h-[2.5px] md:after:bg-primary-green md:after:rounded-t-sm'
                                    : 'text-slate-600 hover:text-primary-green hover:bg-slate-50 md:hover:bg-transparent'
                            }`
                        }
                        to="/"
                        end
                        title="Live GMP"
                    >
                        <ChartNoAxesCombined aria-hidden="true" size={16} />
                        <span>Live GMP</span>
                    </NavLink>

                    <NavLink
                        onClick={closeMenu}
                        className={({ isActive }) =>
                            `relative inline-flex items-center gap-2 h-10 md:h-16 px-3 md:px-4 text-sm font-medium transition-colors duration-200 rounded-md md:rounded-none select-none ${
                                isActive
                                    ? 'text-primary-green font-semibold bg-emerald-50/60 md:bg-transparent md:after:absolute md:after:bottom-0 md:after:left-4 md:after:right-4 md:after:h-[2.5px] md:after:bg-primary-green md:after:rounded-t-sm'
                                    : 'text-slate-600 hover:text-primary-green hover:bg-slate-50 md:hover:bg-transparent'
                            }`
                        }
                        to="/ipos"
                        title="All IPOs Calendar"
                    >
                        <CalendarDays aria-hidden="true" size={16} />
                        <span>All IPOs</span>
                    </NavLink>

                    {/* Disabled Check Allotment Item - User cannot open/click */}
                    <span
                        className="relative inline-flex items-center gap-2 h-10 md:h-16 px-3 md:px-4 text-sm font-medium text-slate-400 cursor-not-allowed select-none opacity-80"
                        aria-disabled="true"
                        title="Coming Soon - Check Allotment is currently unavailable"
                    >
                        <ClipboardCheck aria-hidden="true" size={16} className="text-slate-400" />
                        <span>Check Allotment</span>
                        <Tag
                            color="warning"
                            className="!m-0 !ms-1.5 !text-[11px] !font-semibold !px-1.5 !py-0 !leading-[18px] !rounded !bg-yellow-50 !border-yellow-300 !text-yellow-800 cursor-not-allowed inline-flex items-center"
                        >
                            Coming Soon
                        </Tag>
                    </span>
                </div>

                {/* Mobile Menu Toggle Button */}
                <button
                    className="md:hidden flex items-center justify-center w-9 h-9 rounded-md text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors focus:outline-none"
                    type="button"
                    aria-label={menuOpen ? 'Close navigation menu' : 'Open navigation menu'}
                    aria-expanded={menuOpen}
                    aria-controls="primary-navigation"
                    onClick={() => setMenuOpen((open) => !open)}
                >
                    {menuOpen ? <X aria-hidden="true" size={20} /> : <Menu aria-hidden="true" size={20} />}
                </button>
            </nav>
        </header>
    );
}