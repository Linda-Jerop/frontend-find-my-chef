import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';

const Dashboard = () => {
    const { user, handleLogout } = useAuth();
    const [error, setError] = useState(null);

    const onLogout = async () => {
        try {
            await handleLogout();
        } catch (err) {
            setError('Failed to logout');
        }
    };

    return (
      <>
        <div className="p-6">
          <h1 className="text-3xl font-bold mb-4">Find My Chef - Dashboard</h1>
          <p>Welcome! Here you can manage your account and view your chef bookings.</p>
           <button onClick={onLogout} className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
              <span className="w-5 h-5 inline-block mr-2" aria-hidden="true" />
              <span>Logout</span>
           </button>
        </div>

        <div className="space-y-6">
        {error && <div className="p-3 bg-red-100 text-red-700 rounded-md text-sm">{error}</div>}
        <div className="bg-gray-50 p-6 rounded-xl border-gray-200 shadow-inner">
            <h2 className="text-2xl font-semibold mb-2">Recent Activities</h2>
            <span className="w-6 h-6 mr-2" aria-hidden="true" />
            <p className="text-gray-600">You have no recent activities.</p>
        </div>
         <div className="bg-gray-50 p-6 rounded-lg border-gray-200 ">
            <h2 className="text-2xl font-semibold text-amber-600 mb-3">
                Welcome <span className="text-gray-700 font-medium">{user?.email || 'Guest'}</span>!
            </h2>
            <p className="text-gray-600">
                This is your personalized dashboard where you can access all your information.
            </p>
         </div>
         <div className="grid md:grid-cols-2 gap-4">
        <div className="bg-indigo-50 p-6 rounded-lg border-gray-200 ">
            <h3 className="text-xl font-semibold text-indigo-600 mb-2">Profile Overview</h3>
            <p className="text-indigo-700">Find the chef of your choice.</p>
            <button className="mt-4 py-2 px-4 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-500 transition">Browse</button>
            </div>
            <div className="bg-fuchsia-500 p-6 rounded-lg border border-fuchsia-200 shadow-md hover:shadow-lg transition duration-200">
            <h3 className="text-xl font-semibold text-fuchsia-700 mb-3 flex items-center">Planner</h3>
            <p className="text-fuchsia-600">Book your appointment today.</p>
            <button className="mt-4 py-2 px-4 text-sm font-medium text-white bg-fuchsia-600 rounded-lg hover:bg-fuchsia-500 transition">Book Now</button>
            </div>
         </div>
        </div>
      </>
    );
}

export default Dashboard;