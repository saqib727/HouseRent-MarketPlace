import "@/styles/globals.css";
import { ThirdwebProvider } from "@thirdweb-dev/react";
import { PolygonAmoyTestnet } from "@thirdweb-dev/chains";

import { StateContextProvider } from "@/context";

const App = ({ Component, pageProps }) => {
  return (
    <ThirdwebProvider clientId={process.env.NEXT_PUBLIC_TEMPLATE_CLIENT_ID} activeChain={PolygonAmoyTestnet}>
      <StateContextProvider>
        <Component {...pageProps} />
      </StateContextProvider>
    </ThirdwebProvider>
  );
};

export default App;
