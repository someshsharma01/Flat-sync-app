import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../utils/axiosInstance';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';

const Onboarding = () => {
  const [formData, setFormData] = useState({
    gender: 'Male',
    organizedRoom: 'Yes',
    smokeOrDrink: 'No',
    foodPreference: 'Veg',
    profession: 'Working',
    sleepSchedule: 'Early Night'
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { user, setUser } = useAuth();

  const questions = [
    { id: 'gender', label: 'Select your gender', options: ['Male', 'Female'] },
    { id: 'organizedRoom', label: 'Do you like an organized room?', options: ['Yes', 'No'] },
    { id: 'smokeOrDrink', label: 'Do you smoke or drink?', options: ['Yes', 'No', 'Occasionally'] },
    { id: 'foodPreference', label: 'What is your food preference?', options: ['Veg', 'Non-Veg'] },
    { id: 'profession', label: 'What is your profession?', options: ['Student', 'Working'] },
    { id: 'sleepSchedule', label: 'When do you sleep?', options: ['Late Night', 'Early Night'] }
  ];

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await api.post('/auth/onboarding', formData);
      toast.success('Preferences saved!');
      setUser((prev) => ({ ...prev, onboardingComplete: true }));
      navigate('/');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to finish onboarding');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-64px)] flex items-center justify-center p-6 bg-gray-50">
      <div className="bg-white p-8 md:p-10 rounded-3xl shadow-xl w-full max-w-2xl border border-gray-100">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">Tell Us About Yourself</h2>
        <p className="text-gray-500 mb-8">This helps us find the best flatmates for you.</p>

        <form onSubmit={handleSubmit} className="flex flex-col gap-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {questions.map((q) => (
              <div key={q.id} className="flex flex-col gap-3">
                <label className="font-semibold text-gray-800">{q.label}</label>
                <div className="flex flex-wrap gap-3">
                  {q.options.map(opt => (
                    <label 
                      key={opt} 
                      className={`px-4 py-2 border rounded-full cursor-pointer transition-all ${
                        formData[q.id] === opt 
                          ? 'border-primary-500 bg-primary-50 text-primary-700 font-medium' 
                          : 'border-gray-200 hover:border-gray-300 text-gray-600'
                      }`}
                    >
                      <input 
                        type="radio" 
                        name={q.id} 
                        value={opt} 
                        checked={formData[q.id] === opt} 
                        onChange={handleChange} 
                        className="hidden" 
                      />
                      {opt}
                    </label>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div className="pt-6 border-t border-gray-100 mt-2">
            <button 
              disabled={loading} 
              type="submit" 
              className="w-full bg-primary-600 hover:bg-primary-700 text-white font-bold py-3.5 rounded-xl shadow-lg shadow-primary-500/30 transition-all active:scale-[0.98] disabled:opacity-70"
            >
              {loading ? 'Saving...' : 'Complete Onboarding'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Onboarding;
