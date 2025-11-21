import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { HiArrowLeft, HiChevronDown } from 'react-icons/hi';

const JobInfoPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    faculty: '',
    position: '',
    staffId: '',
    studentId: '',
    researchGroup: ''
  });

  // UTM Faculties
  const utmFaculties = [
    'Computing',
    'Engineering',
    'Science',
    'Business',
    'Medicine',
    'Education',
    'Built Environment',
    'Social Sciences',
    'Islamic Civilization',
    'Management',
    'Chemical and Energy Engineering',
    'Electrical Engineering',
    'Mechanical Engineering',
    'Civil Engineering',
    'Architecture',
    'Geoinformation and Real Estate',
    'Other'
  ];

  // UTM Position Types
  const utmPositions = [
    'Professor',
    'Associate Professor',
    'Senior Lecturer',
    'Lecturer',
    'Assistant Lecturer',
    'Research Officer',
    'Administrative Staff',
    'Student (Undergraduate)',
    'Student (Postgraduate)',
    'Other'
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleContinue = () => {
    // In a real app, you would validate the form data here
    // After completing step 2, show success page
    navigate('/onboarding/success');
  };

  return (
    <div className="flex flex-col min-h-screen bg-white">
      {/* Header */}
      <div className="px-4 py-3 flex items-center border-b border-gray-100">
        <button 
          onClick={() => navigate(-1)} 
          className="p-2 rounded-full hover:bg-gray-100"
          aria-label="Go back"
        >
          <HiArrowLeft className="w-5 h-5" />
        </button>
        
        {/* Progress bar */}
        <div className="flex-1 px-4 flex flex-col justify-center mt-5">
          <div className="h-1 bg-gray-200 rounded-full">
            <div className="h-1 bg-secondary rounded-full" style={{ width: '100%' }}></div>
          </div>
          <div className="text-xs text-right text-gray-500 mt-1">2/2</div>
        </div>
      </div>

      <div className="flex-1 px-6 py-6">
        <h1 className="text-2xl font-bold mb-2">UTM Information</h1>
        <p className="text-gray-600 mb-6">Please provide your UTM affiliation details. Your privacy is our priority.</p>

        <form className="space-y-5">
          {/* Faculty */}
          <div>
            <label htmlFor="faculty" className="block text-sm font-medium text-gray-700 mb-1">
              Faculty <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <select
                id="faculty"
                name="faculty"
                value={formData.faculty}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg appearance-none focus:ring-2 focus:ring-secondary focus:border-transparent outline-none transition bg-white"
              >
                <option value="" disabled>Select your faculty</option>
                {utmFaculties.map((faculty, index) => (
                  <option key={index} value={faculty}>
                    {faculty}
                  </option>
                ))}
              </select>
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none">
                <HiChevronDown className="w-5 h-5" />
              </div>
            </div>
          </div>

          {/* Position */}
          <div>
            <label htmlFor="position" className="block text-sm font-medium text-gray-700 mb-1">
              Position <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <select
                id="position"
                name="position"
                value={formData.position}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg appearance-none focus:ring-2 focus:ring-secondary focus:border-transparent outline-none transition bg-white"
              >
                <option value="" disabled>Select your position</option>
                {utmPositions.map((position, index) => (
                  <option key={index} value={position}>
                    {position}
                  </option>
                ))}
              </select>
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none">
                <HiChevronDown className="w-5 h-5" />
              </div>
            </div>
          </div>

          {/* Staff ID or Student ID */}
          <div>
            <label htmlFor="staffId" className="block text-sm font-medium text-gray-700 mb-1">
              Staff ID / Student ID <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="staffId"
              name="staffId"
              value={formData.staffId}
              onChange={handleInputChange}
              placeholder="Enter your Staff ID or Student ID"
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-secondary focus:border-transparent outline-none transition"
            />
            <p className="text-xs text-gray-500 mt-1">For staff: Enter your Staff ID. For students: Enter your Student ID.</p>
          </div>

          {/* Research Group (Optional) */}
          <div>
            <label htmlFor="researchGroup" className="block text-sm font-medium text-gray-700 mb-1">
              Research Group (Optional)
            </label>
            <input
              type="text"
              id="researchGroup"
              name="researchGroup"
              value={formData.researchGroup}
              onChange={handleInputChange}
              placeholder="Enter your research group name if applicable"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-secondary focus:border-transparent outline-none transition"
            />
            <p className="text-xs text-gray-500 mt-1">Leave blank if not applicable.</p>
          </div>
        </form>
      </div>

      {/* Bottom button */}
      <div className="px-6 py-4 border-t border-gray-100">
        <button
          onClick={handleContinue}
          className="w-full bg-secondary text-white font-semibold py-4 rounded-lg hover:bg-secondaryLight transition duration-200"
        >
          Continue
        </button>
      </div>
    </div>
  );
};

export default JobInfoPage; 