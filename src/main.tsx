import { StrictMode, Fragment } from "react";
import { createRoot } from "react-dom/client";
import App from "@/App.tsx";
import "@/index.css";

import { store } from "@/store/store.ts";
import { Provider } from "react-redux";

import { BrowserRouter, Routes, Route } from "react-router-dom";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Fragment>
      <Provider store={store}>
        <BrowserRouter>
          <Routes>
            <Route path="/*" element={<App />} />
          </Routes>
        </BrowserRouter>
      </Provider>
    </Fragment>
  </StrictMode>
);
