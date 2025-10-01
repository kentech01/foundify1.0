import { Routes, Route, Navigate, useNavigate } from "react-router-dom";
import { DashboardLayout } from "../components/DashboardLayout";
import { PitchDashboard } from "./PitchDashboard";
import { InvoicesPage } from "./InvoicesPage";
import { FounderEssentialsPage } from "./FounderEssentialsPage";
import { useApp } from "../context/AppContext";

export function DashboardMain() {
  const navigate = useNavigate();
  const { isPremium, pitches } = useApp();

  return (
    <DashboardLayout
      onCreatePitch={() => navigate("/builder")}
      isPremium={isPremium}
    >
      <Routes>
        <Route index element={<Navigate to="/dashboard/pitches" replace />} />
        <Route
          path="pitches"
          element={
            <PitchDashboard
              initialPitch={pitches[0]}
              isPremium={isPremium}
              onUpgrade={() => navigate("/upgrade")}
            />
          }
        />
        <Route path="invoices" element={<InvoicesPage />} />
        <Route
          path="essentials"
          element={
            <FounderEssentialsPage
              isPremium={isPremium}
              onUpgrade={() => navigate("/upgrade")}
            />
          }
        />
      </Routes>
    </DashboardLayout>
  );
}
