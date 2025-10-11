// src/App.tsx

import { useEffect, useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { Layout } from "@/components/Layout/Layout";
import { Home } from "@/pages/Home";
import { HomeMobile } from "@/pages/HomeMobile";
import { Results } from "@/pages/Results";
import { ResultsMobile } from "@/pages/ResultsMobile";
import { FindMyJob } from "@/pages/FindMyJob";
import { FindMyJobMobile } from "@/pages/FindMyJobMobile";
import { AddSalary } from "@/pages/AddSalary";
import { CameroonSalaries } from "@/pages/CameroonSalaries";
import { config } from "@/config";

function App() {
  const [isMobile, setIsMobile] = useState(false);

  // Détection mobile au montage + resize
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < config.ui.mobileBreakpoint);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);

    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  return (
    <Router>
      <Layout>
        <Routes>
          {/* Home — Desktop vs Mobile */}
          <Route path="/" element={isMobile ? <HomeMobile /> : <Home />} />

          {/* Results — Desktop vs Mobile */}
          <Route
            path="/results"
            element={isMobile ? <ResultsMobile /> : <Results />}
          />

          {/* FindMyJob — Desktop vs Mobile */}
          <Route
            path="/find-my-job"
            element={isMobile ? <FindMyJobMobile /> : <FindMyJob />}
          />

          {/* AddSalary — Même composant */}
          <Route path="/add-salary" element={<AddSalary />} />

          {/* CameroonSalaries — Même composant */}
          <Route path="/cameroon" element={<CameroonSalaries />} />

          {/* 404 — Redirection vers Home */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;
