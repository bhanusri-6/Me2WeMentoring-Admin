import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import AdminLayout from "../../Common/AdminLayout";
import "./Therapy.css";

const API_URL = `${import.meta.env.VITE_API_URL}/api/therapies`;

const TherapyList = () => {
  const navigate = useNavigate();

  const [therapies, setTherapies] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch therapies
  const fetchTherapies = async () => {
    try {
      setLoading(true);

      const response = await fetch(API_URL);
      const data = await response.json();

      if (data.success) {
        setTherapies(data.data || []);
      }
    } catch (error) {
      console.error("Error fetching therapies:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTherapies();
  }, []);

  // Delete therapy
  const handleDelete = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this therapy?"
    );

    if (!confirmed) return;

    try {
      const response = await fetch(`${API_URL}/${id}`, {
        method: "DELETE",
      });

      const data = await response.json();

      if (data.success) {
        setTherapies((prev) =>
          prev.filter((therapy) => therapy._id !== id)
        );

        alert("Therapy deleted successfully");
      }
    } catch (error) {
      console.error("Error deleting therapy:", error);
    }
  };

  return (
    <AdminLayout>
      <div className="therapy-list-container">

        {/* Header */}
        <div className="therapy-list-header">
          <div>
            <h1>Programs</h1>
            <p>
              Manage your programs and related videos.
            </p>
          </div>

          <button
            type="button"
            className="add-therapy-btn"
            onClick={() =>
              navigate("/admin/therapy/create")
            }
          >
            + Add Program
          </button>
        </div>

        {/* Loading */}
        {loading && (
          <p>Loading programs...</p>
        )}

        {/* Empty */}
        {!loading && therapies.length === 0 && (
          <p>No programs found.</p>
        )}

        {/* Therapy Cards */}
        {!loading && therapies.length > 0 && (
          <div className="therapy-list-grid">

            {therapies.map((therapy) => (
              <div
                className="therapy-admin-card"
                key={therapy._id}
              >

                {/* Image */}
                <div className="therapy-admin-image">
                  <img
                    src={`http://localhost:5000${therapy.thumbnail}`}
                    alt={therapy.title}
                  />
                </div>

                {/* Content */}
                <div className="therapy-admin-content">

                  <h2>{therapy.title}</h2>

                  <p className="therapy-admin-tagline">
                    {therapy.tagline}
                  </p>

                  <div className="therapy-admin-meta">
                    <span>
                      {therapy.programCount} Programs
                    </span>
                  </div>

                  {/* Actions */}
                  <div className="therapy-admin-actions">

                    <button
                      type="button"
                      className="edit-therapy-btn"
                      onClick={() =>
                        navigate(
                          `/admin/therapy/${therapy._id}/edit`
                        )
                      }
                    >
                      Edit
                    </button>

                    <button
                      type="button"
                      className="delete-therapy-btn"
                      onClick={() =>
                        handleDelete(therapy._id)
                      }
                    >
                      Delete
                    </button>

                  </div>

                </div>

              </div>
            ))}

          </div>
        )}

      </div>
    </AdminLayout>
  );
};

export default TherapyList;