import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App.tsx";
import { AppProvider } from "./context/AppContext";
import { AuthContextProvider } from "./context/AuthContext";
import "./index.css";

createRoot(document.getElementById("root")!).render(
  <BrowserRouter>
    <AuthContextProvider>
      <AppProvider>
        <App />
      </AppProvider>
    </AuthContextProvider>
  </BrowserRouter>
);
