import React from "react";
import logo from "../../images/logo.png";
import { FaFacebookSquare, FaTwitterSquare, FaLinkedin, FaInstagram } from "react-icons/fa";
import { HiMail, HiPhone } from "react-icons/hi";

const Footer = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="w-full bg-gradient-to-r from-blue-800 to-blue-900 text-white">
      <div className="container mx-auto px-4 py-8">
        {/* Top section with logo and navigation */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-6">
          {/* Logo and about section */}
          <div className="flex flex-col space-y-4">
            <img src={logo} alt="ZakatGo Logo" className="w-40 mb-3" />
            <p className="text-sm text-gray-200">
              ZakatGo: A transparent, blockchain-powered platform for Zakat payments and charitable donations.
            </p>
            <div className="flex space-x-4 mt-4">
              <FaFacebookSquare className="text-2xl cursor-pointer hover:text-green-300 transition-colors" />
              <FaTwitterSquare className="text-2xl cursor-pointer hover:text-green-300 transition-colors" />
              <FaLinkedin className="text-2xl cursor-pointer hover:text-green-300 transition-colors" />
              <FaInstagram className="text-2xl cursor-pointer hover:text-green-300 transition-colors" />
            </div>
          </div>
          
          {/* Quick links */}
          <div>
            <h3 className="text-lg font-semibold mb-4 border-b border-green-600 pb-2">Zakat Services</h3>
            <ul className="space-y-2">
              <li><a href="/calculator" className="hover:text-green-300 transition-colors">Zakat Calculator</a></li>
              <li><a href="/payment" className="hover:text-green-300 transition-colors">Make Payment</a></li>
              <li><a href="/tracking" className="hover:text-green-300 transition-colors">Track Donations</a></li>
              <li><a href="/categories" className="hover:text-green-300 transition-colors">Eligible Categories</a></li>
            </ul>
          </div>
          
          {/* Resources */}
          <div>
            <h3 className="text-lg font-semibold mb-4 border-b border-green-600 pb-2">Resources</h3>
            <ul className="space-y-2">
              <li><a href="/campaigns" className="hover:text-green-300 transition-colors">NGO Campaigns</a></li>
              <li><a href="/sadaqah" className="hover:text-green-300 transition-colors">Sadaqah</a></li>
              <li><a href="/waqf" className="hover:text-green-300 transition-colors">Waqf</a></li>
              <li><a href="/blockchain" className="hover:text-green-300 transition-colors">Blockchain FAQ</a></li>
            </ul>
          </div>
          
          {/* Contact information */}
          <div>
            <h3 className="text-lg font-semibold mb-4 border-b border-green-600 pb-2">Contact Us</h3>
            <ul className="space-y-3">
              <li className="flex items-center">
                <HiMail className="mr-2 text-green-300" />
                <a href="mailto:support@zakatgo.my" className="hover:text-green-300 transition-colors">support@zakatgo.my</a>
              </li>
              <li className="flex items-center">
                <HiPhone className="mr-2 text-green-300" />
                <a href="tel:+60312345678" className="hover:text-green-300 transition-colors">+603 1234 5678</a>
              </li>
              <li className="mt-4">
                <a href="/contact" className="bg-green-600 hover:bg-green-500 px-4 py-2 rounded-md transition-colors text-sm">
                  Send Message
                </a>
              </li>
            </ul>
          </div>
        </div>
        
        {/* Middle section with newsletter */}
        <div className="border-t border-b border-green-600 py-6 my-6">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-4 md:mb-0">
              <h3 className="text-lg font-semibold mb-2">Subscribe to Our Newsletter</h3>
              <p className="text-sm text-gray-200">Stay updated with our latest campaigns and initiatives</p>
            </div>
            <div className="flex w-full md:w-auto">
              <input 
                type="email" 
                placeholder="Your email address" 
                className="px-4 py-2 rounded-l-md text-gray-800 focus:outline-none w-full md:w-64"
              />
              <button className="bg-green-600 hover:bg-green-500 px-4 py-2 rounded-r-md transition-colors">
                Subscribe
              </button>
            </div>
          </div>
        </div>
        
        {/* Bottom section with copyright and legal links */}
        <div className="flex flex-col md:flex-row justify-between items-center text-sm">
          <p>© {currentYear} ZakatGo. All rights reserved.</p>
          <div className="flex space-x-4 mt-3 md:mt-0">
            <a href="/privacy" className="hover:text-green-300 transition-colors">Privacy Policy</a>
            <a href="/terms" className="hover:text-green-300 transition-colors">Terms of Service</a>
            <a href="/shariah" className="hover:text-green-300 transition-colors">Shariah Compliance</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
