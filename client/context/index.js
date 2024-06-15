import React, { useEffect, useContext, createContext } from 'react';

import { useAddress, useContract, useMetamask, useContractWrite, useContractRead, useContractEvents } from '@thirdweb-dev/react';
import { ethers } from 'ethers';

const StateContext = createContext();

export const StateContextProvider = ({ children }) => {
    const { contract } = useContract("0x17e10bE10C8e75E2CBb0052e3DD7091776a725c3");
    const address = useAddress();
    const connect = useMetamask();

    const realEstate = "House MarketPlace";
    //Function property
    


    return (
        <StateContext.Provider value={{ address, connect, contract, realEstate }}>
            {children}
        </StateContext.Provider>
    );
};

export const useStateContext = () => useContext(StateContext);
