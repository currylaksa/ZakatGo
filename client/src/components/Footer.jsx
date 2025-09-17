import React from 'react';
import logo from '../../images/zakat_utm.png';
import { FaGithub } from 'react-icons/fa'; // Import GitHub icon

const Footer = () => {
  const currentYear = new Date().getFullYear();
 // const teamMembers = ["Chan Qing Yee", "Cheng See Chee", "Ong Jia Yu", "Tham Ren Sheng", "Tai Hui Shan"];

  return (
    <footer className="w-full bg-gradient-to-r from-[#5f0220] to-[#400017] text-white py-6">
      <div className="container mx-auto px-4 text-center">

        {/* Logo and GitHub Link */}
        <div className="flex justify-center items-center mb-4">
          {/* <a
            href="https://github.com/currylaksa/ZakatGo"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2" // Added gap for spacing
          > */}
            <img
              src={logo}
              alt="ZakatGo Logo"
              className="w-32 mb-0 mr-2 opacity-80 hover:opacity-100 transition-opacity" // Increased size, removed mb
            />
       {/* /   </a> */}
        </div>

        {/* Team Acknowledgment */}
        <div className="mb-4">
          <p className="text-sm text-[#f4ccd6]">
            Developed with passion By UTM
          </p>
          {/* <p className="text-md font-semibold text-white mt-1">
            {teamMembers.join(' | ')}
          </p> */}
        </div>

        {/* Copyright */}
        <p className="text-xs text-[#dc6e85]">
          © {currentYear} Zakat UTM. All rights reserved.
        </p>

        {/* Optional: Minimal Legal Links */}
        <div className="flex justify-center space-x-4 mt-3 text-xs">
          <a href="/privacy" className="hover:text-green-300 transition-colors">Privacy Policy</a>
          <a href="/terms" className="hover:text-green-300 transition-colors">Terms of Service</a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
