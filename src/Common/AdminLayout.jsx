import Sidebar from "./Sidebar";
import Header from "./Header";
import "../assets/CSS/admin.css";

export default function AdminLayout({ children }) {
  return (
    <div className="admin-container">
      <Sidebar />

      <div className="admin-main">
        <Header />

        <div className="admin-content">
          {children}
        </div>
      </div>
    </div>
  );
}