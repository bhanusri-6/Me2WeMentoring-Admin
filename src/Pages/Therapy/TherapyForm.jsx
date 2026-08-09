import { useState } from "react";
import { useNavigate } from "react-router-dom";
import AdminLayout from "../../Common/AdminLayout";
import "./Therapy.css";
const emptyProgram = {
  program_title: "",
  program_description: "",
  youtube_link: "",
};

const TherapyForm = ({ edit = false }) => {
  const navigate = useNavigate();

  const [therapy, setTherapy] = useState({
    title: "",
    tagline: "",
    description: "",
    thumbnail: null,
    programs: [{ ...emptyProgram }],
  });

  const handleTherapyChange = (e) => {
    const { name, value } = e.target;

    setTherapy((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleThumbnailChange = (e) => {
    setTherapy((prev) => ({
      ...prev,
      thumbnail: e.target.files[0],
    }));
  };

  const handleProgramChange = (index, e) => {
    const { name, value } = e.target;

    setTherapy((prev) => {
      const programs = [...prev.programs];

      programs[index] = {
        ...programs[index],
        [name]: value,
      };

      return {
        ...prev,
        programs,
      };
    });
  };

  const addProgram = () => {
    setTherapy((prev) => ({
      ...prev,
      programs: [
        ...prev.programs,
        { ...emptyProgram },
      ],
    }));
  };

  const removeProgram = (index) => {
    setTherapy((prev) => ({
      ...prev,
      programs: prev.programs.filter(
        (_, i) => i !== index
      ),
    }));
  };

const handleSubmit = async (e) => {
  e.preventDefault();

  try {
    const formData = new FormData();

    formData.append("title", therapy.title);
    formData.append("tagline", therapy.tagline);
    formData.append(
      "description",
      therapy.description
    );

    if (therapy.thumbnail) {
      formData.append(
        "thumbnail",
        therapy.thumbnail
      );
    }

    formData.append(
      "programs",
      JSON.stringify(
        therapy.programs.map((program, index) => ({
          program_number: index + 1,
          program_title:
            program.program_title,
          program_description:
            program.program_description,
          youtube_link:
            program.youtube_link,
          sort_order: index + 1,
        }))
      )
    );

    const response = await fetch(
      `${import.meta.env.Vite_Api_Url}/api/therapies`,
      {
        method: "POST",
        body: formData,
      }
    );

    const data = await response.json();

    if (data.success) {
      alert("Therapy added successfully");

      navigate("/admin/therapy");
    } else {
      alert(data.message);
    }

  } catch (error) {
    console.error(
      "Error creating therapy:",
      error
    );
  }
};
  return (
    <AdminLayout>
    <div className="therapy-form-page">

      {/* Header */}

      <div className="therapy-form-header">
        <div>
          <h1>
            {edit ? "Edit Therapy" : "Add Therapy"}
          </h1>

          <p>
            {edit
              ? "Update therapy and its programs"
              : "Create a new therapy and add its programs"}
          </p>
        </div>

        <button
          type="button"
          className="therapy-back-btn"
          onClick={() => navigate("/admin/therapy")}
        >
          ← Back
        </button>
      </div>

      <form onSubmit={handleSubmit}>

        {/* ========================= */}
        {/* Program Details */}
        {/* ========================= */}

        <div className="therapy-form-card">

          <div className="therapy-section-title">
            <h2>Program Details</h2>
            <p>
              Add the basic information about this therapy.
            </p>
          </div>

          <div className="therapy-form-grid">

            {/* Title */}

            <div className="therapy-field full">
              <label>
                Program Title <span>*</span>
              </label>

              <input
                type="text"
                name="title"
                value={therapy.title}
                onChange={handleTherapyChange}
                placeholder="Enter Program Title"
                required
              />
            </div>

            {/* Tagline */}

            <div className="therapy-field full">
              <label>Tagline</label>

              <input
                type="text"
                name="tagline"
                value={therapy.tagline}
                onChange={handleTherapyChange}
                placeholder="Enter a short tagline"
              />
            </div>

            {/* Description */}

            <div className="therapy-field full">
              <label>Description</label>

              <textarea
                name="description"
                value={therapy.description}
                onChange={handleTherapyChange}
                placeholder="Enter therapy description"
                rows="6"
              />
            </div>

            {/* Thumbnail */}

            <div className="therapy-field full">
              <label>Thumbnail Image</label>

              <input
                type="file"
                accept="image/png,image/jpeg,image/jpg,image/webp"
                onChange={handleThumbnailChange}
              />

              {therapy.thumbnail && (
                <div className="thumbnail-preview">
                  <img
                    src={URL.createObjectURL(
                      therapy.thumbnail
                    )}
                    alt="Therapy preview"
                  />
                </div>
              )}
            </div>

          </div>
        </div>

        {/* ========================= */}
        {/* Sub-PROGRAMS */}
        {/* ========================= */}

        <div className="therapy-form-card">

          <div className="therapy-program-header">

            <div>
              <h2>Sub-Programs</h2>

              <p>
                Add the programs and their related
                YouTube videos.
              </p>
            </div>

            <button
              type="button"
              className="add-program-btn"
              onClick={addProgram}
            >
              + Add Program
            </button>

          </div>

          {/* Program Cards */}

          <div className="program-list">

            {therapy.programs.map((program, index) => (

              <div
                className="program-card"
                key={index}
              >

                <div className="program-card-header">

                  <div>
                    <span>
                      PROGRAM {String(index + 1).padStart(2, "0")}
                    </span>

                    <h3>
                      Program Details
                    </h3>
                  </div>

                  {therapy.programs.length > 1 && (
                    <button
                      type="button"
                      className="remove-program-btn"
                      onClick={() =>
                        removeProgram(index)
                      }
                    >
                      Remove
                    </button>
                  )}

                </div>

                <div className="therapy-form-grid">

                  {/* Program Title */}

                  <div className="therapy-field full">
                    <label>
                      Program Title <span>*</span>
                    </label>

                    <input
                      type="text"
                      name="program_title"
                      value={program.program_title}
                      onChange={(e) =>
                        handleProgramChange(
                          index,
                          e
                        )
                      }
                      placeholder="Enter program title"
                      required
                    />
                  </div>

                  {/* Program Description */}

                  <div className="therapy-field full">
                    <label>
                      Short Description
                    </label>

                    <textarea
                      name="program_description"
                      value={
                        program.program_description
                      }
                      onChange={(e) =>
                        handleProgramChange(
                          index,
                          e
                        )
                      }
                      placeholder="Enter a short description for this program"
                      rows="4"
                    />
                  </div>

                  {/* YouTube */}

                  <div className="therapy-field full">
                    <label>
                      YouTube Video Link
                    </label>

                    <input
                      type="url"
                      name="youtube_link"
                      value={
                        program.youtube_link
                      }
                      onChange={(e) =>
                        handleProgramChange(
                          index,
                          e
                        )
                      }
                      placeholder="https://youtube.com/watch?v=..."
                    />
                  </div>

                </div>

              </div>

            ))}

          </div>

        </div>

        {/* ========================= */}
        {/* ACTIONS */}
        {/* ========================= */}

        <div className="therapy-form-actions">

          <button
            type="button"
            className="cancel-btn"
            onClick={() =>
              navigate("/admin/therapy")
            }
          >
            Cancel
          </button>

          <button
            type="submit"
            className="save-btn"
          >
            {edit
              ? "Update Therapy"
              : "Save Therapy"}
          </button>

        </div>

      </form>

    </div>
    </AdminLayout>
  );
};

export const TherapyCreate = () => (
  <TherapyForm />
);

export const TherapyEdit = () => (
  <TherapyForm edit />
);

export default TherapyForm;