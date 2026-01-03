import AppRoutes from "./AppRoutes";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const App = () => {
  return (
    <>
      <AppRoutes />
      <ToastContainer theme="dark" position="top-right" autoClose={3000} />
    </>
  );
};

export default App;
