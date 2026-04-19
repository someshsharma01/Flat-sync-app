import { ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Home = ({ onRegisterClick }) => {
  const navigate = useNavigate();

  const developers = [
    { initials: 'SM', name: 'Somesh', role: 'Backend & DB', color: 'bg-blue-500' },
    { initials: 'KD', name: 'Kandarp', role: 'Web Sockets', color: 'bg-purple-500' },
    { initials: 'YS', name: 'Yash', role: 'Frontend', color: 'bg-green-500' },
    { initials: 'AS', name: 'Aashish', role: 'Design', color: 'bg-rose-500' },
    { initials: 'TR', name: 'Tarang', role: 'Deployment', color: 'bg-amber-500' }
  ];

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative pt-20 pb-32 flex items-center justify-center overflow-hidden bg-white">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary-50 via-white to-white"></div>
        </div>
        
        <div className="container mx-auto px-6 relative z-10 text-center max-w-4xl pt-16">
          <h1 className="text-5xl md:text-7xl font-extrabold text-gray-900 tracking-tight leading-tight mb-6">
            Find Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-600 to-primary-400">Perfect Flatmate</span>
          </h1>
          <p className="text-xl text-gray-600 mb-10 max-w-2xl mx-auto leading-relaxed">
            FlatSync helps you connect with compatible flatmates and find the perfect place to live, tailored specifically to your lifestyle and preferences.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button 
              onClick={() => navigate('/find-flat')} 
              className="w-full sm:w-auto px-8 py-4 bg-primary-600 hover:bg-primary-700 text-white rounded-full font-bold text-lg shadow-lg shadow-primary-500/30 transition-all flex items-center justify-center gap-2 group transform hover:-translate-y-1"
            >
              Get Started <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
            <button 
              onClick={() => navigate('/list-flat')} 
              className="w-full sm:w-auto px-8 py-4 bg-white hover:bg-gray-50 text-gray-900 border-2 border-gray-200 hover:border-primary-200 rounded-full font-bold text-lg transition-all"
            >
              List a New Flat
            </button>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-20 bg-gray-50 border-t border-gray-100">
        <div className="container mx-auto px-6 max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Meet the Team</h2>
            <div className="w-20 h-1.5 bg-primary-500 mx-auto rounded-full"></div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6">
            {developers.map((dev, i) => (
              <div key={i} className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow border border-gray-100 flex flex-col items-center text-center">
                <div className={`w-16 h-16 rounded-full ${dev.color} text-white flex items-center justify-center text-xl font-bold mb-4 shadow-inner`}>
                  {dev.initials}
                </div>
                <h3 className="font-bold text-gray-900 text-lg mb-1">{dev.name}</h3>
                <p className="text-primary-600 font-medium text-sm mb-3">{dev.role}</p>
                <p className="text-gray-500 text-sm">Building the core of FlatSync.</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-20 bg-white border-t border-gray-100 mt-auto">
        <div className="container mx-auto px-6 max-w-4xl text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-10">Get in Touch</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-left max-w-3xl mx-auto">
            <div className="p-6 bg-gray-50 rounded-2xl border border-gray-100 flex flex-col items-center text-center">
               <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center mb-4"><span className="text-xl">✉️</span></div>
               <h3 className="font-bold text-gray-900 mb-2">Email</h3>
               <p className="text-gray-600">support@flatsync.in</p>
            </div>
            <div className="p-6 bg-gray-50 rounded-2xl border border-gray-100 flex flex-col items-center text-center">
               <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center mb-4"><span className="text-xl">📞</span></div>
               <h3 className="font-bold text-gray-900 mb-2">Phone</h3>
               <p className="text-gray-600">+91 98765 43210</p>
            </div>
            <div className="p-6 bg-gray-50 rounded-2xl border border-gray-100 flex flex-col items-center text-center">
               <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center mb-4"><span className="text-xl">📍</span></div>
               <h3 className="font-bold text-gray-900 mb-2">Office</h3>
               <p className="text-gray-600">204 Tech Park Sector 62<br/>Noida UP 201309</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
