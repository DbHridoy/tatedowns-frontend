import { createRoot } from "react-dom/client";
import "./index.css";
import { router } from "./router/Routes";
import { RouterProvider } from "react-router-dom";
import { Provider } from "react-redux";
import AuthInitializer from "./router/AuthInitializer";
import { store } from "./redux/store";

createRoot(document.getElementById("root")).render(
  <Provider store={store}>
    <AuthInitializer>
      <RouterProvider router={router} />
    </AuthInitializer>
  </Provider>
);
