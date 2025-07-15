import ReactDOM from "react-dom/client";
// import { Provider } from 'react-redux';
import { BrowserRouter } from "react-router-dom";
import { store } from "./app/store";
import { ThemeProvider } from "./theme/ThemeProvider";
import App from "./App";
import { Provider } from "react-redux";
import "./index.css"

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);

root.render(
  <BrowserRouter>
    <Provider store={store}>
      <ThemeProvider>
        <App />
      </ThemeProvider>
    </Provider>
  </BrowserRouter>
);
