import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App.tsx";
import { AppProvider } from "./context/AppContext";
import { AuthContextProvider } from "./context/AuthContext";
import "./styles/globals.css";
import { RecoilRoot } from "recoil";

createRoot(document.getElementById("root")!).render(
  <BrowserRouter>
    <RecoilRoot>
      <AuthContextProvider>
        <AppProvider>
          <App />
        </AppProvider>
      </AuthContextProvider>
    </RecoilRoot>
  </BrowserRouter>
);
