import React, { useState } from 'react';

const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <nav className="bg-gray-900 text-white shadow-lg w-full fixed top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    {/* Logo / Brand */}
                    <div className="flex-shrink-0">
                        <div className="flex items-center">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-blue-500" viewBox="0 0 20 20" fill="currentColor">
                                <path d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 01.356-.257l4-1.714a1 1 0 11.788 1.838L7.667 9.088l1.94.831a1 1 0 00.787 0l7-3a1 1 0 000-1.838l-7-3zM3.31 9.397L5 10.12v4.102a8.969 8.969 0 00-1.05-.174 1 1 0 01-.89-.89 11.115 11.115 0 01.25-3.762zM9.3 16.573A9.026 9.026 0 007 14.935v-3.957l1.818.78a3 3 0 002.364 0l5.508-2.361a11.026 11.026 0 01.25 3.762 1 1 0 01-.89.89 8.968 8.968 0 00-5.35 2.524 1 1 0 01-1.4 0zM6 18a1 1 0 001-1v-2.065a8.935 8.935 0 00-2-.712V17a1 1 0 001 1z" />
                            </svg>
                            <span className="ml-2 text-xl font-bold tracking-wider text-white">NEDx</span>
                        </div>
                    </div>

                    {/* Desktop Navigation */}
                    <div className="hidden md:block">
                        <div className="ml-10 flex items-baseline space-x-6">
                            <a href="/" className="px-3 py-2 rounded-md text-sm font-medium text-gray-300 hover:text-white hover:bg-gray-800 transition-all duration-150 ease-in-out">Home</a>
                            <a href="https://www.neduet.edu.pk/vice_chancellor_message" target='_blank' rel="noopener noreferrer" className="px-3 py-2 rounded-md text-sm font-medium text-gray-300 hover:text-white hover:bg-gray-800 transition-all duration-150 ease-in-out">About</a>
                            <a href="https://www.neduet.edu.pk/faculties_and_departments" target='_blank' rel="noopener noreferrer" className="px-3 py-2 rounded-md text-sm font-medium text-gray-300 hover:text-white hover:bg-gray-800 transition-all duration-150 ease-in-out">Departments</a>
                            <a href="#contact" className="px-3 py-2 rounded-md text-sm font-medium text-gray-300 hover:text-white hover:bg-gray-800 transition-all duration-150 ease-in-out">Contact</a>
                        </div>
                    </div>

                    {/* Mobile menu button */}
                    <div className="md:hidden">
                        <button
                            onClick={() => setIsOpen(!isOpen)}
                            className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-white"
                            aria-expanded="false"
                        >
                            <span className="sr-only">Open main menu</span>
                            {!isOpen ? (
                                <svg className="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                                </svg>
                            ) : (
                                <svg className="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            )}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile menu */}
            <div className={`${isOpen ? 'block' : 'hidden'} md:hidden`}>
                <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-gray-800">
                    <a href="/" className="block px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:text-white hover:bg-gray-700 transition-all duration-150 ease-in-out">Home</a>
                    <a href="https://www.neduet.edu.pk/vice_chancellor_message" target='_blank' rel="noopener noreferrer" className="block px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:text-white hover:bg-gray-700 transition-all duration-150 ease-in-out">About</a>
                    <a href="https://www.neduet.edu.pk/faculties_and_departments" target='_blank' rel="noopener noreferrer" className="block px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:text-white hover:bg-gray-700 transition-all duration-150 ease-in-out">Departments</a>
                    <a href="#contact" className="block px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:text-white hover:bg-gray-700 transition-all duration-150 ease-in-out">Contact</a>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
