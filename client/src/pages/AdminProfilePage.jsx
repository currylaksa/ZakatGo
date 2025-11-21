import { Link } from 'react-router-dom';

const AdminProfilePage = () => {
  // Dummy admin data
  const admin = {
    name: 'Ahmad Fauzi',
    profession: 'Zakat Administrator',
    email: 'ahmad.fauzi@zakatgo.org',
    phone: '+60 12-345 6789',
    office: 'PPZ Kuala Lumpur',
    joined: 'Jan 2023',
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800 pt-20 md:pt-24 p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-xl shadow p-6 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-[#5f0220]">Admin Profile</h1>
              <p className="text-gray-600">Manage your admin information</p>
            </div>
            <Link
              to="/admin/dashboard"
              className="text-white bg-green-600 hover:bg-green-700 py-2 px-4 rounded-lg"
            >
              Go to Dashboard
            </Link>
          </div>
        </div>

        {/* Profile Card */}
        <div className="bg-white rounded-xl shadow p-6 border border-gray-200 mt-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-[#fbe9ed] text-[#5f0220] rounded-full flex items-center justify-center text-2xl font-bold">
              AF
            </div>
            <div>
              <h2 className="text-xl font-semibold">{admin.name}</h2>
              <p className="text-sm text-gray-600">{admin.profession}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
            <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
              <p className="text-sm text-gray-500">Email</p>
              <p className="font-medium">{admin.email}</p>
            </div>
            <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
              <p className="text-sm text-gray-500">Phone</p>
              <p className="font-medium">{admin.phone}</p>
            </div>
            <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
              <p className="text-sm text-gray-500">Office</p>
              <p className="font-medium">{admin.office}</p>
            </div>
            <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
              <p className="text-sm text-gray-500">Joined</p>
              <p className="font-medium">{admin.joined}</p>
            </div>
          </div>

          <div className="mt-6 flex gap-3">
            <Link to="/admin/deduction" className="px-4 py-2 bg-[#5f0220] text-white rounded-lg hover:bg-[#6f162e]">
              Monthly Deduction
            </Link>
            <Link to="/admin/zakat" className="px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-900">
              Zakat Management
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminProfilePage;