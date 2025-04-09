import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { HiMenuAlt4 } from "react-icons/hi";
import { AiOutlineClose } from "react-icons/ai";
import LanguageToggle from './LanguageToggle';

import logo from "../../images/ZakatGoLogo.png";

const NavbarItem = ({ title, classProps, to, onClick }) => {
  const navigate = useNavigate();
  
  const handleClick = (e) => {
    e.preventDefault();
    if (onClick) onClick();
    navigate(to);
  };

  return (
    <a href={to} onClick={handleClick} className="no-underline">
      <li className={`mx-4 cursor-pointer ${classProps}`}>{title}</li>
    </a>
  );
};

const navItems = [
  { title: "Loan", path: "/loan" },
  { title: "Donations", path: "/campaigns" },
  { title: "Donation History", path: "/donation-history" },
  { title: "Transactions", path: "/transactions" },
  //{ title: "Onboarding", path: "/onboarding" },
  { title: "Profile", path: "/profile" }
];

const Navbar = () => {
  const [toggleMenu, setToggleMenu] = useState(false);
  const [isPremium] = useState(true); // In a real app, this would come from a context/API
  
  const handleCloseMenu = () => {
    setToggleMenu(false);
  };
  
  return (
    <nav className="w-full flex md:justify-center justify-between items-center p-4 fixed top-0 left-0 z-50 bg-primary">
      <div className="md:flex-[0.5] pr-4 md:pl-6">
        <Link to="/dashboard">
          <img src={logo} alt="logo" className="w-48 md:w-48 cursor-pointer" />
        </Link>
      </div>
      <ul className="text-white md:flex hidden list-none flex-row justify-between items-center flex-initial">
        {navItems.map((item, index) => (
          <NavbarItem 
            key={item.title + index} 
            title={item.title} 
            to={item.path}
          />
        ))}
        
        {/* Premium section */}
        {isPremium ? (
          <NavbarItem
            title={
              <div className="flex items-center">
                <svg className="h-4 w-4 mr-1" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                </svg>
                Premium
              </div>
            }
            to="/lender-reports"
            classProps="bg-gradient-to-r from-yellow-400 to-yellow-500 text-white py-1.5 px-4 mx-4 rounded-full cursor-pointer hover:opacity-90"
          />
        ) : (
          <NavbarItem
            title={
              <div className="flex items-center">
                <svg className="h-4 w-4 mr-1" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                </svg>
                Upgrade
              </div>
            }
            to="/premium"
            classProps="bg-gray-700 text-white py-1.5 px-4 mx-4 rounded-full cursor-pointer hover:bg-gray-600"
          />
        )}
        
        {/* Language Toggle */}
        <div className="mx-4">
          <LanguageToggle />
        </div>
        
        <NavbarItem
          title="Login"
          to="/login"
          classProps="bg-white text-primary py-2 px-7 mx-4 rounded-full cursor-pointer hover:bg-gray-100"
        />
      </ul>
      <div className="flex relative">
        {toggleMenu ? (
          <AiOutlineClose
            fontSize={28}
            className="text-white md:hidden cursor-pointer"
            onClick={handleCloseMenu}
          />
        ) : (
          <HiMenuAlt4
            fontSize={28}
            className="text-white md:hidden cursor-pointer"
            onClick={() => setToggleMenu(true)}
          />
        )}
        {toggleMenu && (
          <ul className="z-10 fixed top-0 -right-2 p-3 w-[70vw] h-screen shadow-2xl md:hidden list-none
            flex flex-col justify-start items-end rounded-md secondary-glassmorphism text-white animate-slide-in">
            <li className="text-xl w-full my-2">
              <AiOutlineClose onClick={handleCloseMenu} />
            </li>
            {navItems.map((item, index) => (
              <NavbarItem
                key={item.title + index}
                title={item.title}
                to={item.path}
                classProps="my-2 text-lg"
                onClick={handleCloseMenu}
              />
            ))}
            
            {/* Mobile premium link */}
            {isPremium ? (
              <NavbarItem
                title="Premium Reports"
                to="/lender-reports"
                classProps="my-2 text-lg text-yellow-400 font-medium"
                onClick={handleCloseMenu}
              />
            ) : (
              <NavbarItem
                title="Upgrade to Premium"
                to="/premium"
                classProps="my-2 text-lg text-yellow-400 font-medium"
                onClick={handleCloseMenu}
              />
            )}
            
            {/* Language Toggle in mobile menu */}
            <div className="my-4 w-full flex justify-end">
              <LanguageToggle />
            </div>
          </ul>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
