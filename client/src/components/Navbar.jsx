import { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { HiMenuAlt4 } from "react-icons/hi";
import { AiOutlineClose } from "react-icons/ai";
import { MdKeyboardArrowDown } from "react-icons/md";

// ZakatGo logo imported
import logo from "../../images/ZakatGoLogo.png"; 

// --- NavbarItem Component ---
// Handles navigation link clicks using react-router-dom
const NavbarItem = ({ title, classProps, to, onClick, hasSubmenu = false, children }) => {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef(null);
  
  // Handle click outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);
  
  const handleClick = (e) => {
    if (hasSubmenu) {
      e.preventDefault();
      setIsOpen(!isOpen);
    } else {
      e.preventDefault(); // Prevent default anchor tag behavior
      if (onClick) onClick(); // Close mobile menu if function is provided
      navigate(to); // Navigate using react-router
    }
  };

  return (
    <div className="relative" ref={menuRef}>
      {/* Use anchor tags for semantics, but navigation is handled by onClick */}
      <a href={to} onClick={handleClick} className="no-underline flex items-center">
        {/* Base styling for nav items + any additional classes */}
        <li className={`mx-4 cursor-pointer text-white hover:text-gray-300 transition duration-200 flex items-center ${classProps}`}>
          {title}
          {hasSubmenu && <MdKeyboardArrowDown className={`ml-1 transition-transform ${isOpen ? 'rotate-180' : ''}`} />}
        </li>
      </a>
      
      {/* Submenu */}
      {hasSubmenu && isOpen && (
        <div className="absolute mt-2 bg-blue-800 rounded-md shadow-lg z-50 min-w-max py-2">
          {children}
        </div>
      )}
    </div>
  );
};

// --- Submenu Item Component ---
const SubmenuItem = ({ title, to, onClick }) => {
  const navigate = useNavigate();
  
  const handleClick = (e) => {
    e.preventDefault();
    if (onClick) onClick();
    navigate(to);
  };
  
  return (
    <a href={to} onClick={handleClick} className="no-underline block">
      <div className="px-4 py-2 text-white hover:bg-blue-700 transition duration-200">
        {title}
      </div>
    </a>
  );
};

// --- ZakatGo Navigation Items ---
// Updated to match the prototype documentation with Zakat submenu
const zakatGoNavItems = [
  { title: "Home", path: "/" }, // Link to the homepage
  { 
    title: "Zakat Services", 
    hasSubmenu: true,
    submenuItems: [
      { title: "Zakat Payment System", path: "/zakat-payment" },
      { title: "Zakat Assistance System", path: "/zakat-assistance" }
    ]
  },
  { title: "Donation Campaigns", path: "/campaigns" }, // Updated name to match doc
  { title: "Impact Dashboard", path: "/dashboard" }, // For tracking donation impact
  { title: "Help", path: "/help" }, // FAQ and support
  { title: "Profile", path: "/profile" } // User profile/account settings
];

// --- Navbar Component ---
const Navbar = () => {
  const [toggleMenu, setToggleMenu] = useState(false);
  const navigate = useNavigate();
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
          item.hasSubmenu ? (
            <NavbarItem 
              key={item.title + index} 
              title={item.title} 
              hasSubmenu={true}
            >
              {item.submenuItems.map((subItem, subIndex) => (
                <SubmenuItem
                  key={subItem.title + subIndex}
                  title={subItem.title}
                  to={subItem.path}
                />
              ))}
            </NavbarItem>
          ) : (
            <NavbarItem 
              key={item.title + index} 
              title={item.title} 
              to={item.path}
            />
          )
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
            classProps="bg-green-600 text-white py-2 px-6 mx-4 rounded-full cursor-pointer hover:bg-green-700 transition duration-200 font-medium shadow-md"
          />
        )}
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
        // Updated mobile menu styling
        <ul className="z-50 fixed top-0 right-0 p-6 w-[70vw] h-screen shadow-2xl list-none
          flex flex-col justify-start items-start rounded-l-xl bg-gradient-to-b from-blue-900 to-blue-800 text-white animate-slide-in">
          {/* Header with close button */}
          <div className="w-full flex justify-between items-center mb-8">
            <img src={logo} alt="ZakatGo Logo" className="w-28" />
            <AiOutlineClose 
              fontSize={24} 
              onClick={handleCloseMenu} 
              className="cursor-pointer text-gray-300 hover:text-white" 
            />
          </div>

          {/* Divider */}
          <div className="w-full h-px bg-blue-700 mb-6"></div>

          {/* Navigation links */}
          {zakatGoNavItems.map((item, index) => 
            item.hasSubmenu ? (
              <div key={item.title + index} className="w-full">
                <div className="my-3 text-lg w-full font-medium py-2 pl-2 text-white">
                  {item.title}
                </div>
                <div className="pl-4">
                  {item.submenuItems.map((subItem, subIndex) => (
                    <NavbarItem
                      key={subItem.title + subIndex}
                      title={subItem.title}
                      to={subItem.path}
                      classProps="my-2 text-base w-full font-medium py-2 pl-2 hover:bg-blue-700 hover:pl-4 rounded-md transition-all duration-200" 
                      onClick={handleCloseMenu}
                    />
                  ))}
                </div>
              </div>
            ) : (
              <NavbarItem
                key={item.title + index}
                title={item.title}
                to={item.path}
                classProps="my-3 text-lg w-full font-medium py-2 pl-2 hover:bg-blue-700 hover:pl-4 rounded-md transition-all duration-200" 
                onClick={handleCloseMenu}
              />
            )
          )}

          {/* Divider */}
          <div className="w-full h-px bg-blue-700 my-4"></div>

          {/* Login button */}
          <div className="w-full mt-4">
            <button 
              onClick={() => {
                handleCloseMenu();
                navigate(isLoggedIn ? "/profile" : "/login");
              }}
              className="w-full bg-green-600 text-white py-3 rounded-lg font-medium text-center hover:bg-green-700 transition duration-200 shadow-md"
            >
              {isLoggedIn ? "My Account" : "Login / Sign Up"}
            </button>
          </div>
        </ul>
      )}
      </div>
    </nav>
  );
};

export default Navbar;
