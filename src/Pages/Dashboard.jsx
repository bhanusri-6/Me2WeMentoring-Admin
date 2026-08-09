import AdminLayout from "../Common/AdminLayout"

export default function Dashboard() {
  return (
    <AdminLayout>
      <div className="stats-grid">
        <div className="card">
          <h3>Videos</h3>
          <p>9</p>
        </div>

        <div className="card">
          <h3>Testimonials</h3>
          <p>18</p>
        </div>

        <div className="card">
          <h3>Programs</h3>
          <p>12</p>
        </div>
      </div>
    </AdminLayout>
  );
}