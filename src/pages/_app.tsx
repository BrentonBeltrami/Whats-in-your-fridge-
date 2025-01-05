import { GeistSans } from "geist/font/sans";
import { type AppType } from "next/app";
import { Toaster } from "~/components/ui/sonner";

import { api } from "~/utils/api";

import "~/styles/globals.css";

const MyApp: AppType = ({ Component, pageProps }) => {
  return (
    <div className={GeistSans.className}>
      <Component {...pageProps} />
      <Toaster richColors />
    </div>
  );
};

export default api.withTRPC(MyApp);
