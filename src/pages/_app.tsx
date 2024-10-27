import { GeistSans } from "geist/font/sans";
import { type Session } from "next-auth";
import { type AppProps, type AppType } from "next/app";

import { api } from "~/utils/api";

import "~/styles/globals.css";
import { type ReactElement, type ReactNode } from "react";
import { type NextPage } from "next";
import { AuthProvider } from "./providers";

export type NextPageWithLayout<P = object, IP = P> = NextPage<P, IP> & {
  getLayout?: (page: ReactElement) => ReactNode;
};

type AppPropsWithLayout = AppProps & {
  Component: NextPageWithLayout;
};

const MyApp: AppType<{ session: Session | null }> = ({
  Component,
  pageProps,
}: AppPropsWithLayout) => {
  const getLayout = Component.getLayout ?? ((page) => page);

  return getLayout(
    <>
      <AuthProvider>
        <>
          <style jsx global>{`
            html {
              font-family: ${GeistSans.style.fontFamily};
            }
          `}</style>
          <Component {...pageProps} />
        </>
      </AuthProvider>
    </>,
  );
  // return (
  //   <SessionProvider session={session}>
  //     <div className={GeistSans.className}>
  //       <Component {...pageProps} />
  //     </div>
  //   </SessionProvider>
  // );
};

export default api.withTRPC(MyApp);
