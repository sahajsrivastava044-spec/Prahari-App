import { useEffect, useState } from 'react'
import API from '../services/api';
import Navbar from '../components/Navbar';
import { useNavigate } from 'react-router-dom';

const Report = () => {

  const navigate=useNavigate()

  const [formData,setFormData] = useState({
    incidentType:"",
    description:"",
    village:""
  });

  const [location,setLocation]=useState({
    lat:null,
    lng:null
  });

  const [loading, setLoading]=useState(false);

  useEffect(()=>{
    if(navigator.geolocation){
      navigator.geolocation.getCurrentPosition(
        (position)=>{
          setLocation({
            lat:position.coords.latitude,
            lng: position.coords.longitude,
          });
        },
        (error)=>{
          console.log(error);
          alert("Unable to fetch location. Please enter village manually");
        }
      )
    }
  },[]);

  const handleChange=(e)=>{
    const {name,value}=e.target
    setFormData({
      ...formData,
      [name]:value,
    });
  };

  const handleSubmit=async(e)=>{
    e.preventDefault();

    if(!formData.incidentType || !formData.description || !formData.village){
      return alert("Please fill all fields");
    }

    if(!location.lat || !location.lng){
      return alert("Location not available");
    }

    try {
      setLoading(true);
      const payload={
        ...formData,
        location,
      };

      await API.post("/incidents/report",payload);

      alert("Incident Reported Successfuly");

      navigate("/community-dashboard");

      setFormData({
        incidentType:"",
        description:"",
        village:"",
      });
    } catch (error) {
      console.log(error);

      alert(error.response?.data?.message || "Failed to report incident");
    }finally{
      setLoading(false);
    }
  };
  return (
    <>
      <Navbar />

      <div className='min-h-screen bg-green-50 p-6'>
        <div className='max-w-2xl mx-auto bg-white p-8 rounded-xl shadow'>
            <h1 className='text-3xl font-bold mb-6'>
              Report Wildlife Incident
            </h1>

            <form onSubmit={handleSubmit} className='space-y-4'>
              <select
                name='incidentType'
                value={formData.incidentType}
                onChange={handleChange}
                className='w-full border p-3 rounded'
              >
                <option value="">
                  Select Incident Type
                </option>

                <option value="sighting">
                  Tiger Sighting
                </option>

                <option value="livestock_attack">
                  Livestock Attack
                </option>

                <option value="roar">
                  Roaring Heard
                </option>

                <option value="human_encounter">
                  Human Encounter
                </option>
              </select>

                  <input
                  type="text"
                  name="village"
                  placeholder="Village"
                  value={formData.village}
                  onChange={handleChange}
                  className="w-full border p-3 rounded"
                />

                <textarea
                  name="description"
                  rows="5"
                  placeholder="Describe the incident"
                  value={formData.description}
                  onChange={handleChange}
                  className="w-full border p-3 rounded"
                />

                <div className="bg-gray-100 p-4 rounded">
                  <h2 className="font-semibold">
                    Captured Location
                  </h2>

                  {location.lat ? (
                    <>
                      <p>Latitude: {location.lat}</p>
                      <p>Longitude: {location.lng}</p>
                    </>
                  ) : (
                    <p>Fetching GPS...</p>
                  )}
                </div>

                <button
                  disabled={loading}
                  className="w-full bg-green-700 text-white p-3 rounded"
                >
                  {loading
                    ? "Submitting..."
                    : "Submit Report"}
                </button>
            </form>
        </div>
      </div>
    </>
  )
}

export default Report