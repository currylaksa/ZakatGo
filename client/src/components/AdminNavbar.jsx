import { Link, useLocation } from "react-router-dom";
import logo from "../../images/zakat_utm.png";

const AdminNavbar = () => {
  const location = useLocation();

  return (
    <nav className="w-full flex md:justify-center justify-between items-center p-4 fixed top-0 left-0 z-50 bg-[#5f0220] shadow-md">
      {/* Logo */}
      <div className="md:flex-[0.5] pr-4 md:pl-6">
        <Link to="/admin/dashboard">
          <img src={logo} alt="Zakat UTM Logo" className="w-36 md:w-40 cursor-pointer" />
        </Link>
      </div>

      {/* Admin-only navigation: Profile */}
      <ul className="text-white md:flex hidden list-none flex-row justify-between items-center flex-initial">
        <li className="mx-4 cursor-pointer text-white hover:text-gray-300 transition duration-200">
          <Link to="/admin/profile" className="no-underline">Admin Profile</Link>
        </li>
      </ul>

      {/* Simple mobile menu: just a button to profile */}
      <div className="flex relative md:hidden">
        <Link
          to="/admin/profile"
          className="text-white bg-[#6f162e] py-2 px-4 rounded-md hover:bg-[#871f39] transition"
        >
          Admin Profile
        </Link>
      </div>
    </nav>
  );
};

export default AdminNavbar;