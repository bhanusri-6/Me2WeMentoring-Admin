import { Link } from "react-router-dom";

export default function Sidebar() {
  return (
    <div className="sidebar">
      <h2 className="logo">ME2WE Admin</h2>

      <ul>
        <li><Link to="/">Dashboard</Link></li>
        <li><Link to="/admin/testimonials">Testimonials</Link></li>
        <li><Link to="/admin/therapy">Programs</Link></li>
      </ul>
    </div>
  );
}