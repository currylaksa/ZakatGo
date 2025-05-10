import React from 'react';
import logo from '../../images/ZakatGoLogo.png';
import { FaGithub } from 'react-icons/fa'; // Import GitHub icon

const Footer = () => {
  const currentYear = new Date().getFullYear();
  const teamMembers = ["Chan Qing Yee", "Cheng See Chee", "Ong Jia Yu", "Tham Ren Sheng", "Tai Hui Shan"];

  return (
    <footer className="w-full bg-gradient-to-r from-blue-800 to-blue-900 text-white py-6">
      <div className="container mx-auto px-4 text-center">

        {/* Logo and GitHub Link */}
        <div className="flex justify-center items-center mb-4">
          <a
            href="https://github.com/currylaksa/ZakatGo"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2" // Added gap for spacing
          >
            <img
              src={logo}
              alt="ZakatGo Logo"
              className="w-32 mb-0 mr-2 opacity-80 hover:opacity-100 transition-opacity" // Increased size, removed mb
            />
            <FaGithub className="text-3xl text-white hover:text-green-400 transition-colors" /> {/* Added icon */}
             <span className="sr-only">View our GitHub Repository</span> {/* Accessibility */}
          </a>
        </div>

        {/* Team Acknowledgment */}
        <div className="mb-4">
          <p className="text-sm text-blue-200">
            Developed with passion for UTM by Team Oversized Minions.
          </p>
        </div>

        {/* Copyright */}
        <p className="text-xs text-blue-300">
          © {currentYear} ZakatGo. All rights reserved.
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
