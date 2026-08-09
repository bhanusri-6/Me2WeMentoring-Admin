import { Routes, Route } from "react-router-dom";

import Dashboard from "./Pages/Dashboard";
import Testimonals from "./Pages/Testimonals/Testimonals";

import TherapyList from "./Pages/Therapy/TherapyList";
import {
  TherapyCreate,
  TherapyEdit,
} from "./Pages/Therapy/TherapyForm";

const PageRoutes = () => {
  return (
    <div>
      <Routes>
        {/* Dashboard */}
        <Route path="/" element={<Dashboard />} />

        {/* Testimonials */}
        <Route
          path="/admin/testimonials"
          element={<Testimonals />}
        />

        {/* Therapies */}
        <Route
          path="/admin/therapy"
          element={<TherapyList />}
        />

        {/* Add Therapy */}
        <Route
          path="/admin/therapy/create"
          element={<TherapyCreate />}
        />

        {/* Edit Therapy */}
        <Route
          path="/admin/therapy/:id/edit"
          element={<TherapyEdit />}
        />
      </Routes>
    </div>
  );
};

export default PageRoutes;