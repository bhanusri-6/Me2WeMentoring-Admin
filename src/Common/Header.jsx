import { useNavigate } from "react-router-dom";

export default function Header() {
  const navigate = useNavigate();

  const admin = JSON.parse(
    localStorage.getItem("admin") || "null"
  );

  const handleLogout = () => {
    localStorage.removeItem("admin");
    navigate("/login", { replace: true });
  };

  return (
    <header className="admin-header">

      <div className="header-left">
        <div className="header-title">
          <h1>Dashboard</h1>
          <p>Welcome back to your admin panel</p>
        </div>
      </div>

      <div className="admin-user">

        <div className="admin-avatar">
          {admin?.name?.charAt(0)?.toUpperCase() || "A"}
        </div>

        <div className="admin-info">
          <h3>{admin?.name || "Admin"}</h3>
          <span>Administrator</span>
        </div>

        <button
          className="logout-btn"
          onClick={handleLogout}
          title="Logout"
        >
          <span className="logout-icon">↪</span>
          <span>Logout</span>
        </button>

      </div>

    </header>
  );
}