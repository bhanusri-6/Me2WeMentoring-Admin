import { useEffect, useState } from "react";
import "./Testimonals.css";
import AdminLayout from "../../Common/AdminLayout";

const API_URL = `${import.meta.env.Vite_Api_Url}/api`;
const IMAGE_URL = `${import.meta.env.Vite_Api_Url}`;

export default function Testimonals() {
  const [testimonials, setTestimonials] = useState([]);

  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const [formData, setFormData] = useState({
    image: null,
    name: "",
    designation: "",
    review: "",
    rating: 5,
    status: "Active",
  });

  const [preview, setPreview] = useState("");
  const [loading, setLoading] = useState(false);

  // ==============================
  // GET TESTIMONIALS
  // ==============================

  const fetchTestimonials = async () => {
    try {
      setLoading(true);

      const response = await fetch(
        `${API_URL}/testimonials`
      );

      const result = await response.json();

      if (result.success) {
        setTestimonials(result.data);
      }
    } catch (error) {
      console.error("Fetch testimonials error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTestimonials();
  }, []);

  // ==============================
  // IMAGE CHANGE
  // ==============================

  const handleImageChange = (e) => {
    const file = e.target.files[0];

    if (file) {
      setFormData({
        ...formData,
        image: file,
      });

      setPreview(URL.createObjectURL(file));
    }
  };

  // ==============================
  // INPUT CHANGE
  // ==============================

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // ==============================
  // RESET
  // ==============================

  const resetForm = () => {
    setEditingId(null);

    setFormData({
      image: null,
      name: "",
      designation: "",
      review: "",
      rating: 5,
      status: "Active",
    });

    setPreview("");
    setShowModal(false);
  };

  // ==============================
  // ADD / UPDATE
  // ==============================

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const data = new FormData();

      data.append("name", formData.name);
      data.append("designation", formData.designation);
      data.append("review", formData.review);
      data.append("rating", formData.rating);
      data.append("status", formData.status);

      if (formData.image instanceof File) {
        data.append("image", formData.image);
      }

      const url = editingId
        ? `${API_URL}/testimonials/${editingId}`
        : `${API_URL}/testimonials`;

      const method = editingId ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        body: data,
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(
          result.message || "Failed to save testimonial"
        );
      }

      alert(
        editingId
          ? "Testimonial updated successfully"
          : "Testimonial added successfully"
      );

      await fetchTestimonials();

      resetForm();
    } catch (error) {
      console.error("Save testimonial error:", error);
      alert(error.message);
    }
  };

  // ==============================
  // EDIT
  // ==============================

  const handleEdit = (item) => {
    setEditingId(item.id);

    setFormData({
      image: null,
      name: item.name,
      designation: item.designation,
      review: item.review,
      rating: item.rating,
      status: item.status,
    });

    if (item.image) {
      setPreview(`${IMAGE_URL}${item.image}`);
    } else {
      setPreview("");
    }

    setShowModal(true);
  };

  // ==============================
  // DELETE
  // ==============================

  const handleDelete = async (id) => {
    if (!window.confirm("Delete testimonial?")) {
      return;
    }

    try {
      const response = await fetch(
        `${API_URL}/testimonials/${id}`,
        {
          method: "DELETE",
        }
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(
          result.message || "Failed to delete testimonial"
        );
      }

      await fetchTestimonials();

      alert("Testimonial deleted successfully");
    } catch (error) {
      console.error("Delete testimonial error:", error);
      alert(error.message);
    }
  };

  return (
    <AdminLayout>
      <div>

        <div className="header">
          <h2>Testimonials Management</h2>

          <button
            className="add-btn"
            onClick={() => {
              setEditingId(null);
              setFormData({
                image: null,
                name: "",
                designation: "",
                review: "",
                rating: 5,
                status: "Active",
              });
              setPreview("");
              setShowModal(true);
            }}
          >
            + Add Testimonial
          </button>
        </div>

        <div className="table-wrapper">

          {loading ? (
            <p>Loading testimonials...</p>
          ) : (
            <table>

              <thead>
                <tr>
                  <th>Name</th>
                  <th>Image</th>
                  <th>Designation</th>
                  <th>Review</th>
                  <th>Rating</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>

              <tbody>

                {testimonials.map((item) => (
                  <tr key={item.id}>

                    <td>
                      {item.name}
                    </td>

                    <td>
                      {item.image ? (
                        <img
                          src={`${IMAGE_URL}${item.image}`}
                          alt={item.name}
                          className="table-avatar"
                        />
                      ) : (
                        "-"
                      )}
                    </td>

                    <td>
                      {item.designation}
                    </td>

                    <td className="review-cell">
                      {item.review}
                    </td>

                    <td>
                      {"⭐".repeat(
                        Number(item.rating)
                      )}
                    </td>

                    <td>
                      <span className="status">
                        {item.status}
                      </span>
                    </td>

                    <td>

                      <button
                        className="edit-btn"
                        onClick={() =>
                          handleEdit(item)
                        }
                      >
                        Edit
                      </button>

                      <button
                        className="delete-btn"
                        onClick={() =>
                          handleDelete(item.id)
                        }
                      >
                        Delete
                      </button>

                    </td>

                  </tr>
                ))}

              </tbody>

            </table>
          )}

        </div>

        {showModal && (
          <div className="modal-overlay">

            <div className="modal">

              <h3>
                {editingId
                  ? "Edit Testimonial"
                  : "Add Testimonial"}
              </h3>

              <form onSubmit={handleSubmit}>

                <input
                  type="text"
                  name="name"
                  placeholder="Name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />

                <input
                  type="text"
                  name="designation"
                  placeholder="Designation"
                  value={formData.designation}
                  onChange={handleChange}
                  required
                />

                <textarea
                  name="review"
                  rows="4"
                  placeholder="Review"
                  value={formData.review}
                  onChange={handleChange}
                  required
                />

                <select
                  name="rating"
                  value={formData.rating}
                  onChange={handleChange}
                >
                  <option value="5">
                    5 Stars
                  </option>

                  <option value="4">
                    4 Stars
                  </option>

                  <option value="3">
                    3 Stars
                  </option>

                  <option value="2">
                    2 Stars
                  </option>

                  <option value="1">
                    1 Star
                  </option>
                </select>

                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                />

                {preview && (
                  <div>
                    <img
                      src={preview}
                      alt="Preview"
                      className="table-avatar"
                    />
                  </div>
                )}

                <select
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                >
                  <option value="Active">
                    Active
                  </option>

                  <option value="Inactive">
                    Inactive
                  </option>
                </select>

                <div className="modal-actions">

                  <button
                    type="button"
                    className="cancel-btn"
                    onClick={resetForm}
                  >
                    Cancel
                  </button>

                  <button
                    type="submit"
                    className="save-btn"
                  >
                    {editingId
                      ? "Update"
                      : "Save"}
                  </button>

                </div>

              </form>

            </div>

          </div>
        )}

      </div>
    </AdminLayout>
  );
}