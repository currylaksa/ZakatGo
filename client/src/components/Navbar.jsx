import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { HiMenuAlt4 } from "react-icons/hi";
import { AiOutlineClose } from "react-icons/ai";
// Removed LanguageToggle import for simplicity, add back if needed
// import LanguageToggle from './LanguageToggle'; 

// ZakatGo logo imported
import logo from "../../images/ZakatGoLogo.png"; 

// --- NavbarItem Component ---
// Handles navigation link clicks using react-router-dom
const NavbarItem = ({ title, classProps, to, onClick }) => {
  const navigate = useNavigate();
  
  const handleClick = (e) => {
    e.preventDefault(); // Prevent default anchor tag behavior
    if (onClick) onClick(); // Close mobile menu if function is provided
    navigate(to); // Navigate using react-router
  };

  return (
    // Use anchor tags for semantics, but navigation is handled by onClick
    <a href={to} onClick={handleClick} className="no-underline">
      {/* Base styling for nav items + any additional classes */}
      <li className={`mx-4 cursor-pointer text-white hover:text-gray-300 transition duration-200 ${classProps}`}>{title}</li>
    </a>
  );
};

// --- ZakatGo Navigation Items ---
// *** CORRECTED: Added "Donations" and "Donation History" back ***
const zakatGoNavItems = [
  { title: "Home", path: "/" }, // Link to the homepage
  { title: "Donate", path: "/donate" }, // Link to donation page/section (can also be /campaigns if preferred)
  { title: "Donations", path: "/campaigns" }, // Kept from original clone
  { title: "Donation History", path: "/donation-history" }, // Kept from original clone
  { title: "Zakat Calculator", path: "/calculator" }, // Link to calculator
  { title: "Blockchain-ledger", path: "/blockchain-ledger" },
  { title: "Impact Dashboard", path: "/dashboard" }, // Link to see donation impact
  // { title: "About Us", path: "/about" }, // Optional: Add an about page
  { title: "Profile", path: "/profile" } // User profile/settings
];

// --- Navbar Component ---
const Navbar = () => {
  const [toggleMenu, setToggleMenu] = useState(false);
  // Placeholder for login status - replace with context or state management
  const isLoggedIn = false; 

  const handleCloseMenu = () => {
    setToggleMenu(false);
  };
  
  return (
    // --- Main Navigation Bar ---
    // Added navy blue background (bg-blue-900), fixed position, full width, padding, flex layout
    <nav className="w-full flex md:justify-center justify-between items-center p-4 fixed top-0 left-0 z-50 bg-blue-900 shadow-md">
      
      {/* --- Logo --- */}
      <div className="md:flex-[0.5] pr-4 md:pl-6"> 
        <Link to="/"> {/* Link logo to homepage */}
          <img src={logo} alt="ZakatGo Logo" className="w-36 md:w-40 cursor-pointer" />
        </Link>
      </div>

      {/* --- Desktop Navigation Links --- */}
      <ul className="text-white md:flex hidden list-none flex-row justify-between items-center flex-initial">
        {zakatGoNavItems.map((item, index) => (
          <NavbarItem 
            key={item.title + index} 
            title={item.title} 
            to={item.path}
          />
        ))}
        
        {/* --- Login/Signup Button --- */}
        {isLoggedIn ? (
           // Optionally show something else if logged in, like a profile link/icon
           <NavbarItem title="My Account" to="/profile" classProps="ml-5" /> 
        ) : (
          <NavbarItem
            title="Login / Sign Up"
            to="/login" // Link to your login/signup page
            // Styling for the login button: light background, navy text
            classProps="bg-white text-blue-900 py-2 px-6 mx-4 rounded-full cursor-pointer hover:bg-gray-200 transition duration-200 font-medium"
          />
        )}

        {/* Optional: Add Language Toggle back here if needed */}
        {/* <div className="mx-4"> <LanguageToggle /> </div> */}
      </ul>

      {/* --- Mobile Menu Button --- */}
      <div className="flex relative md:hidden"> {/* Only show on smaller screens */}
        {toggleMenu ? (
          <AiOutlineClose
            fontSize={28}
            className="text-white cursor-pointer"
            onClick={handleCloseMenu}
          />
        ) : (
          <HiMenuAlt4
            fontSize={28}
            className="text-white cursor-pointer"
            onClick={() => setToggleMenu(true)}
          />
        )}

        {/* --- Mobile Menu Panel --- */}
        {toggleMenu && (
          // Added navy blue background (bg-blue-800), slightly lighter than navbar
          <ul className="z-50 fixed top-0 -right-2 p-4 w-[70vw] h-screen shadow-2xl list-none
            flex flex-col justify-start items-end rounded-md bg-blue-800 text-white animate-slide-in"> {/* Added bg-blue-800 */}
            <li className="text-xl w-full my-2">
              <AiOutlineClose onClick={handleCloseMenu} className="cursor-pointer" />
            </li>
            {/* Map through ZakatGo specific nav items */}
            {zakatGoNavItems.map((item, index) => (
              <NavbarItem
                key={item.title + index}
                title={item.title}
                to={item.path}
                classProps="my-3 text-lg w-full text-right pr-2" // Adjusted styling for mobile
                onClick={handleCloseMenu} // Close menu on click
              />
            ))}
             {/* Mobile Login/Signup Button */}
             <li className="w-full mt-4 flex justify-end pr-2">
                <NavbarItem
                  title={isLoggedIn ? "My Account" : "Login / Sign Up"}
                  to={isLoggedIn ? "/profile" : "/login"}
                  // Simple text link for mobile menu
                  classProps="my-2 text-lg font-medium text-teal-300" // Accent color for mobile login
                  onClick={handleCloseMenu}
                />
             </li>

            {/* Optional: Add Language Toggle back here for mobile if needed */}
            {/* <div className="my-4 w-full flex justify-end pr-2"> <LanguageToggle /> </div> */}
          </ul>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
