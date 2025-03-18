import { useEffect, useState } from "react";
import { getActivities } from "../../services/apiService";
import { Link } from "react-router-dom";
import Navbar from "../../components/Navbar/Navbar";
import './Activities.module.css'
import bg from '../../assets/bg.webp'
const Activities = () => {
  const [activities, setActivities] = useState([]);

  useEffect(() => {
    loadActivities();
  }, []);

  const loadActivities = async () => {
    const response = await getActivities();
    setActivities(response.data);
  };

  return (
    <div className="h-screen" style={{
      backgroundImage: `url(${bg})`,
      backgroundSize: "cover", // ปรับให้เต็มพื้นที่
      backgroundPosition: "center", // จัดให้อยู่กึ่งกลาง
      backgroundRepeat: "no-repeat", // ป้องกันการซ้ำของภาพ
    }}>
      <Navbar />
      <div className="container mx-auto p-6">
        <h2 className="text-2xl font-bold mb-4">Available Activities</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {activities.map((activity) => (
            <Link
              key={activity.id}
              to={`/activities/${activity.id}`}
              className="card bg-white shadow-md p-4"
            >
              <h3 className="text-xl font-semibold">{activity.name}</h3>
              <p>Max People: {activity.maxPeople}</p>
              <p>Price: ${activity.price}</p>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Activities;
