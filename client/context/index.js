import React, { useEffect, useContext, createContext } from 'react';

import { useAddress, useContract, useMetamask, useContractWrite, useContractRead, useContractEvents } from '@thirdweb-dev/react';
import { ethers } from 'ethers';
import { prepareContractCall, resolveMethod } from "thirdweb"
import { useSendTransaction } from "thirdweb/react";

const StateContext = createContext();

export const StateContextProvider = ({ children }) => {
    const { contract } = useContract("0x17e10bE10C8e75E2CBb0052e3DD7091776a725c3");
    const address = useAddress();
    const connect = useMetamask();

    const realEstate = "House MarketPlace";
    //Function property
    // 1.listproperty
    const { mutateAsync: listproperty, isLoading, isError } = useContractWrite(contract, "listproperty");
    const createPropertyFunction = async (form) => {

        const {
            propertyTitle,
            description,
            category,
            price,
            images,
            propertyAddress,
        } = form;

        try {
            const data = await listproperty({args:[

                address,
                price,
                propertyTitle,
                category,
                images,
                propertyAddress,
                description,]

            }
            );
            console.info("Contract call success", data)
        }
        catch (err) {
            console.error("Contract call Failure", err);
        }

    }


    return (
        <StateContext.Provider value={{ address, connect, contract, realEstate, createPropertyFunction }}>
            {children}
        </StateContext.Provider>
    );
};

export const useStateContext = () => useContext(StateContext);
