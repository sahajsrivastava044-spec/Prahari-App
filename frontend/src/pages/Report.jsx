import { useEffect, useState } from 'react'
import API from '../services/api';
import Navbar from '../components/Navbar';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { Mic, MicOff, MapPin } from 'lucide-react';

const Report = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    incidentType: "",
    description: "",
    village: ""
  });

  const [location, setLocation] = useState({
    lat: null,
    lng: null
  });

  const [loading, setLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
        },
        (error) => {
          console.log(error);
          toast.error("Unable to fetch location. Please enter village manually", { duration: 4000 });
        }
      )
    }
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleVoiceInput = () => {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      toast.error("Speech Recognition is not supported in this browser.");
      return;
    }

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();

    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = 'en-IN'; // Indian English to capture local nuances better

    recognition.onstart = () => {
      setIsListening(true);
      toast("Listening...", { icon: '🎙️' });
    };

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      setFormData(prev => ({
        ...prev,
        description: prev.description ? `${prev.description} ${transcript}` : transcript
      }));
      toast.success("Voice transcribed!");
    };

    recognition.onerror = (event) => {
      console.error(event.error);
      setIsListening(false);
      toast.error("Voice input failed. Please try again.");
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognition.start();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.incidentType || !formData.description || !formData.village) {
      return toast.error("Please fill all fields");
    }

    if (!location.lat || !location.lng) {
      return toast.error("Location not available. Ensure GPS is allowed.");
    }

    try {
      setLoading(true);
      const payload = {
        ...formData,
        location,
      };

      await API.post("/incidents/report", payload);

      toast.success("Incident Reported Successfully");

      navigate("/community-dashboard");

      setFormData({
        incidentType: "",
        description: "",
        village: "",
      });
    } catch (error) {
      console.log(error);
      toast.error(error.response?.data?.message || "Failed to report incident");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-green-50/30">
      <Navbar />

      <div className='p-6 lg:p-12'>
        <div className='max-w-2xl mx-auto bg-white p-8 rounded-2xl shadow-sm border border-green-100'>
          <h1 className='text-3xl font-extrabold mb-8 text-green-900'>
            Report Wildlife Incident
          </h1>

          <form onSubmit={handleSubmit} className='space-y-6'>
            
            {/* Incident Type */}
            <div className="flex flex-col space-y-2">
              <label htmlFor="incidentType" className="font-semibold text-green-900">Incident Type</label>
              <select
                id="incidentType"
                name='incidentType'
                value={formData.incidentType}
                onChange={handleChange}
                className='w-full border border-gray-200 bg-gray-50 p-3 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all'
              >
                <option value="">Select Incident Type</option>
                <option value="sighting">Tiger Sighting</option>
                <option value="livestock_attack">Livestock Attack</option>
                <option value="roar">Roaring Heard</option>
                <option value="human_encounter">Human Encounter</option>
              </select>
            </div>

            {/* Village */}
            <div className="flex flex-col space-y-2">
              <label htmlFor="village" className="font-semibold text-green-900">Village / Area Name</label>
              <input
                id="village"
                type="text"
                name="village"
                placeholder="e.g. Ramnagar"
                value={formData.village}
                onChange={handleChange}
                className='w-full border border-gray-200 bg-gray-50 p-3 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all'
              />
            </div>

            {/* Description */}
            <div className="flex flex-col space-y-2 relative">
              <div className="flex justify-between items-end">
                <label htmlFor="description" className="font-semibold text-green-900">Incident Description</label>
                <button
                  type="button"
                  onClick={handleVoiceInput}
                  className={`flex items-center gap-1.5 text-sm font-semibold px-3 py-1.5 rounded-full transition-all shadow-sm border ${isListening ? 'bg-red-50 text-red-600 border-red-200 animate-pulse' : 'bg-green-50 text-green-700 border-green-200 hover:bg-green-100'}`}
                >
                  {isListening ? <MicOff size={16} /> : <Mic size={16} />}
                  {isListening ? "Listening..." : "Speak"}
                </button>
              </div>
              
              <textarea
                id="description"
                name="description"
                rows="5"
                placeholder="Describe what you saw or heard..."
                value={formData.description}
                onChange={handleChange}
                className='w-full border border-gray-200 bg-gray-50 p-3 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all resize-none'
              />
            </div>

            {/* GPS Location */}
            <div className="bg-green-50/50 border border-green-100 p-5 rounded-xl flex items-start gap-4">
              <MapPin className="text-green-600 mt-0.5" size={24} />
              <div>
                <h2 className="font-bold text-green-900">
                  Captured Location
                </h2>
                {location.lat ? (
                  <div className="text-sm text-green-700 mt-1 font-medium">
                    <p>Latitude: {location.lat}</p>
                    <p>Longitude: {location.lng}</p>
                  </div>
                ) : (
                  <p className="text-sm text-yellow-600 mt-1 animate-pulse">Fetching GPS coordinates...</p>
                )}
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-green-700 hover:bg-green-800 text-white p-4 rounded-xl font-bold shadow-md transition-colors disabled:opacity-70 disabled:cursor-not-allowed text-lg"
            >
              {loading ? "Submitting Report..." : "Submit Report"}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}

export default Report