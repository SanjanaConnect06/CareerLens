import { useEffect, useState } from "react";
import Sidebar from "../components/dashboard/Sidebar";
import Topbar from "../components/dashboard/Topbar";
import CareerGoalModal from "../components/common/CareerGoalModal";
import { getCareerGoal } from "../api/careerGoalApi";

function DashboardLayout({ children }) {
  const [careerGoal, setCareerGoal] = useState(null);
  const [checkingGoal, setCheckingGoal] = useState(true);

  useEffect(() => {
    const loadCareerGoal = async () => {
      try {
        const token = localStorage.getItem("token");

        if (!token) {
          setCheckingGoal(false);
          return;
        }

        const data = await getCareerGoal();

        setCareerGoal(data.career_goal || "");
      } catch (error) {
      console.error(
        "Failed to load career goal:",
        error
      );

      if (error?.response?.status === 401) {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        window.location.href = "/login";
        return;
      }

      setCareerGoal("");
    } finally {
        setCheckingGoal(false);
      }
    };

    loadCareerGoal();
  }, []);

  const handleCareerGoalSaved = (goal) => {
    setCareerGoal(goal);
  };

  return (
    <div
      className="min-h-screen transition-colors duration-200"
      style={{
        backgroundColor: "var(--bg-primary)",
        color: "var(--text-primary)",
      }}
    >
      <div className="flex min-h-screen">

        {/* Sidebar */}
        <Sidebar />

        {/* Main Area */}
        <div className="flex min-w-0 flex-1 flex-col">

          {/* Topbar */}
          <Topbar />

          {/* Content */}
          <main className="flex-1 overflow-y-auto">
            <div className="mx-auto w-full max-w-[1600px] px-6 py-8 lg:px-8">
              {children}
            </div>
          </main>

        </div>

      </div>

      {/* First-time Career Goal */}
      {!checkingGoal && !careerGoal && (
        <CareerGoalModal
          onSaved={handleCareerGoalSaved}
        />
      )}
    </div>
  );
}

export default DashboardLayout;