import { HashRouter, Route, Routes } from "react-router-dom";
import Layout from "./components/Layout";
import Dashboard from "./pages/Dashboard";
import SystemAnalysis from "./pages/SystemAnalysis";
import FuzzyRules from "./pages/FuzzyRules";
import History from "./pages/History";
import Reports from "./pages/Reports";
import Settings from "./pages/Settings";
import About from "./pages/About";
import { AnalysisProvider } from "./context/AnalysisContext";
import { ConnectionProvider } from "./context/ConnectionContext";

export default function App() {
  return (
    <ConnectionProvider>
      <AnalysisProvider>
        <HashRouter>
          <Routes>
            <Route element={<Layout />}>
              <Route index element={<Dashboard />} />
              <Route path="analysis" element={<SystemAnalysis />} />
              <Route path="rules" element={<FuzzyRules />} />
              <Route path="history" element={<History />} />
              <Route path="reports" element={<Reports />} />
              <Route path="settings" element={<Settings />} />
              <Route path="about" element={<About />} />
            </Route>
          </Routes>
        </HashRouter>
      </AnalysisProvider>
    </ConnectionProvider>
  );
}
