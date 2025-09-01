import React, { useState } from 'react';
import {
  BookOpenIcon,
  UsersIcon,
  CreditCardIcon,
  BriefcaseIcon,
  HomeIcon,
  PanelLeft,
  XIcon,
} from 'lucide-react';

const Sidebar = () => {
  const [open, setOpen] = useState(false);

  const links = [
    {
      label: 'Home',
      icon: <HomeIcon size={20} className='text-blue-400' />,
      anchor: '/',
      color: 'from-blue-600/10 to-blue-700/10'
    },
    {
      label: 'Admissions',
      icon: <BookOpenIcon size={20} className='text-purple-400' />,
      anchor: 'https://www.neduet.edu.pk/admission',
      color: 'from-purple-600/10 to-purple-700/10'
    },
    {
      label: 'Departments',
      icon: <UsersIcon size={20} className='text-green-400' />,
      anchor: 'https://www.neduet.edu.pk/faculties_and_departments',
      color: 'from-green-600/10 to-green-700/10'
    },
    {
      label: 'Scholarships',
      icon: <CreditCardIcon size={20} className='text-yellow-400' />,
      anchor: 'https://www.neduet.edu.pk/scholarships-NED',
      color: 'from-yellow-600/10 to-yellow-700/10'
    },
    {
      label: 'Academic Calendar',
      icon: <BriefcaseIcon size={20} className='text-red-400' />,
      anchor: 'https://www.neduet.edu.pk/academic_calendar',
      color: 'from-red-600/10 to-red-700/10'
    },
  ];

  return (
    <>
      {/* Toggle button (always visible) */}
      <button
        onClick={() => setOpen(!open)}
        className='fixed top-3 right-6 z-50 bg-gray-800/50 backdrop-blur-sm text-white p-3 rounded-xl hover:bg-gray-700/50 transition-all duration-300 border border-gray-700/50 shadow-lg hover:shadow-xl transform hover:scale-[1.02] active:scale-[0.98]'
      >
        {open ? <XIcon size={20} /> : <PanelLeft size={20} />}
      </button>

      {/* Overlay */}
      {open && (
        <div
          className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40"
          onClick={() => setOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 h-screen w-80 z-50 transform ${open ? 'translate-x-0' : '-translate-x-full'
          } transition-all duration-300 ease-in-out`}
      >
        {/* Background with blur effect */}
        <div className="absolute inset-0 bg-gray-900/95 backdrop-blur-xl" />

        {/* Animated background elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute w-[500px] h-[500px] bg-blue-500/5 rounded-full blur-3xl -top-48 -left-48 animate-pulse" />
          <div className="absolute w-[500px] h-[500px] bg-purple-500/5 rounded-full blur-3xl -bottom-48 -right-48 animate-pulse delay-1000" />
        </div>

        <div className="relative h-full pt-20 pb-8 px-6">
          {/* Logo section */}
          <div className="flex items-center gap-3 px-4 mb-8">
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl p-2 shadow-lg">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" viewBox="0 0 20 20" fill="currentColor">
                <path d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 01.356-.257l4-1.714a1 1 0 11.788 1.838L7.667 9.088l1.94.831a1 1 0 00.787 0l7-3a1 1 0 000-1.838l-7-3z" />
                <path d="M3.31 9.397L5 10.12v4.102a8.969 8.969 0 00-1.05-.174 1 1 0 01-.89-.89 11.115 11.115 0 01.25-3.762z" />
              </svg>
            </div>
            <span className="text-xl font-bold text-white">NEDx</span>
          </div>

          {/* Navigation */}
          <nav className="space-y-3">
            {links.map((link, idx) => (
              <a
                key={idx}
                href={link.anchor}
                target='_blank'
                className="group flex items-center gap-3 p-4 rounded-xl transition-all duration-300 hover:bg-gray-800/50 relative overflow-hidden"
              >
                {/* Hover gradient background */}
                <div className={`absolute inset-0 bg-gradient-to-r ${link.color} opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />

                {/* Icon and label container */}
                <div className="relative flex items-center gap-3">
                  {/* Icon background */}
                  <div className={`p-2 rounded-lg bg-gradient-to-r ${link.color} group-hover:bg-opacity-100 transition-colors duration-300`}>
                    {link.icon}
                  </div>

                  {/* Label */}
                  <span className='text-gray-300 font-medium group-hover:text-white transition-colors duration-300'>
                    {link.label}
                  </span>
                </div>
              </a>
            ))}
          </nav>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
