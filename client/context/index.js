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

    //get properties data
    const getPropertiesData=async()=>{

        try{
            const properties=await contract.call("getAllProperty");

            const parsedProperties=properties.map((property,i)=>({
                owner: property.owner,
                title: property.propertyTitle,
                description: property.description,
                category: property.category,
                price: ethers.utils.formatEther(property.price.toString()),
                productid:property.productid.toNumber(),
                reviewers:property.reviewers,
                reviews:property.reviews,
                image:property.images,
                address: property.propertyAddress,

            }));

            return parsedProperties;
        }
        catch(err){
            console.log("Error While lOading data",err)
        }
    }


    return (
        <StateContext.Provider value={{ address, connect, contract, realEstate, createPropertyFunction ,getPropertiesData}}>
            {children}
        </StateContext.Provider>
    );
};

export const useStateContext = () => useContext(StateContext);
