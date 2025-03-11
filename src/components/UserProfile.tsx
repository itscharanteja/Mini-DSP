import { useAuth } from '../contexts/AuthContext';
import { toast } from 'react-hot-toast';
import { LogOut, User } from 'lucide-react';

export default function UserProfile() {
  const { user, signOut } = useAuth();

  const handleSignOut = async () => {
    try {
      await signOut();
      toast.success('Successfully signed out!');
    } catch (error) {
      toast.error('Error signing out');
    }
  };

  if (!user) return null;

  return (
    <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
      <div className="flex items-center space-x-4">
        <div className="bg-blue-100 dark:bg-blue-900 p-3 rounded-full">
          <User className="h-6 w-6 text-blue-600 dark:text-blue-300" />
        </div>
        <div>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            Profile
          </h2>
          <p className="text-gray-500 dark:text-gray-400">{user.email}</p>
        </div>
      </div>

      <div className="mt-6">
        <button
          onClick={handleSignOut}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
        >
          <LogOut className="h-4 w-4 mr-2" />
          Sign Out
        </button>
      </div>
    </div>
  );
}