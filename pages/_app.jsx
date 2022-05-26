import { AuthContextProvider } from "@contexts/AuthContext";
import { DashboardContextProvider } from "@contexts/DashboardContext";
import { ToastProvider } from "react-toast-notifications";
import Router from "next/router";
import 'bootstrap/dist/css/bootstrap.min.css';
import NProgress from "nprogress";
import "@css/style.css";
import "@css/nprogress.css";
NProgress.configure({ showSpinner: false });

Router.events.on("routeChangeStart", () => NProgress.start());
Router.events.on("routeChangeComplete", () => NProgress.done());
Router.events.on("routeChangeError", () => NProgress.done());

const PhoneixProxies = ({ Component, pageProps }) => {
  return (
    <AuthContextProvider>
      <DashboardContextProvider>
        <ToastProvider>
          <Component {...pageProps} />
        </ToastProvider>
      </DashboardContextProvider>
    </AuthContextProvider>
  );
};

export default PhoneixProxies;
