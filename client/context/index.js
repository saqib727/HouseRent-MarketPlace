import React, { useEffect, useContext, createContext } from 'react';

import { useAddress, useContract, useMetamask, useContractWrite, useContractRead, useContractEvents } from '@thirdweb-dev/react';
import { Contract, ethers } from 'ethers';
import { prepareContractCall, resolveMethod } from "thirdweb"
import { useSendTransaction } from "thirdweb/react";

const StateContext = createContext();

export const StateContextProvider = ({ children }) => {
    const { contract } = useContract("0xa334F7D61368c53A3591599aa22F85501920D2BA");
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
            const data = await listproperty({
                args: [

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
    const getPropertiesData = async () => {

        try {
            const properties = await contract.call("getAllProperty");

            const parsedProperties = properties.map((property, i) => ({
                owner: property.owner,
                title: property.propertyTitle,
                description: property.description,
                category: property.category,
                price: ethers.utils.formatEther(property.price.toString()),
                productid: property.productid.toNumber(),
                reviewers: property.reviewers,
                reviews: property.reviews,
                image: property.images,
                address: property.propertyAddress,

            }));

            return parsedProperties;
        }
        catch (err) {
            console.log("Error While lOading data", err)
        }
    }

    //getSingle Property : getProperty
    const getOnePropertyData = async (id) => {
        try {
            const {
                data: getProperty,
                isLoading: getPropertyLoading
            } = useContractRead("getProperty", [id]);
            return (getProperty, getPropertyLoading);


        }
        catch (error) {
            console.log("Can't fetch the Property Data!");

        }
    }

    //getUserProperties
    const getUserPropertiesFunction = () => {
        try {
            const { data, isLoading } = useReadContract({ 
                contract, 
                method: "function getUserProperties(address user) view returns ((uint256 productid, address owner, uint256 price, string propertyTitle, string category, string images, string propertyAddress, string description, address[] reviwers, string[] reviews)[])", 
                params: [user] 
              });
                return(data,isLoading);
        }
        catch (error) {
            console.log("Can't get the User Properties",error
            );
        }

    }

    //highestratedProduct: gethighestratedProduct
    const { data: gethighestratedProduct, isLoading: gethighestratedProductLoading } = useContractRead(contract, "gethighestratedProduct");

    //getProductReviews
    const getProductReviewsFunction = (productid) => {
        try {
            const {
                data: getProductReviews, isLoading: getProductReviewsLoading
            } = useContractRead(contract, "getProductReviews");



            return (getProductReviews, getProductReviewsLoading);
        }
        catch (error) {
            console.log("Can't get the Product Reviews! ", error);
        }


    }

    const getUserReviewsFunction=()=>{
        try{
            const { data, isLoading } = useReadContract({ 
                contract, 
                method: "function getUserReviews(address user) view returns ((address reviewer, uint256 productid, uint256 rating, string comment, uint256 likes)[])", 
                params: [user] 
              });
            return(data,isLoading);

        }
        catch(error){
            console.log("can't get the user reviews");
        }

    }
    //propertyIndex
    const totalPropertyFunction=()=>{

        try{
            const {data:totalProperty,isLoading:totalPropertyLoading}=useContractRead(contract,"propertyIndex");
            return (totalProperty,totalPropertyFunction);

        }
        catch(error){
            console.log("Can't get the Property Index");

        }
    }
    //totalreviews
    const totalReviewFunction=()=>{
        try{
            const {data:totalreviewCount,isLoading:totaleviewCountloading}=useContractRead(contract,"reviewsCounter");
            return (totalreviewCount,totaleviewCountloading);


        }
        catch(error){
            console.log("Error in Total Reviews",error);
        }
    }


    //Update property functions: updateProperty
    const { mutateAsync: updateProperty, isLoading: updatePropertyLoading } = useContractWrite(contract, "updateProperty");
    const updatePropertyFunction = async (form) => {
        const { productid, propertyTitle, description, category, images, propertyAddress } = form;
        try {
            const data = await updateProperty({
                args: [
                    address, productid, propertyTitle, category, images, propertyAddress, description


                ],
            });
            console.log("Property Data is Updated !!!", data);


        }
        catch (err) {
            console.log("Error While Updating : ", err);

        }



    };

    //update price: updatePrice(owner,id,Price);

    const { mutateAsync: updatePrice, isLoading: updatePriceLoading } = useContractWrite(contract, "updatePrice");
    const updatePriceFunction = async (form) => {
        const { address, productid, price } = form;

        try {
            const data = await updatePrice({
                args: [
                    address, productid, price
                ]
            });

            console.log("The Price is Updated: ", data);


        }
        catch (err) {
            console.log("Can't Update the Price: ", err);

        }
    };

    //buyproperty (buyer, id)
    const { mutateAsync: buyproperty, isLoading: buypropertyLoading } = useContractWrite(contract, "buyproperty");
    const buyPropertyFunction = async (form) => {
        const { productid } = form;
        try {

            const data = await buyproperty({
                args: [
                    address, productid

                ]
            });
            console.log("The Property is sold Xd:)");

        }
        catch (error) {
            console.log("The Error is : ", error);

        }
    }

    //review function
    // addReview (id,rating,comment,address);
    const { mutateAsync: addReview, isLoading: addReviewLoading } = useContractWrite(contract, "addReview");
    const addReviewFunction = async (form) => {
        const { productid, rating, comment } = form;
        try {
            const data = await addReview({
                args: [
                    productid, rating, comment, address
                ]
            });
            console.log("The Review is Added!! ", data);
        }
        catch (err) {
            console.log("Can't Add the Review", err);
        }
    };

    //LikeReview (productid, reviewindex,user)
    const { mutateAsync: LikeReview, isLoading: LikeReviewLoading } = useContractWrite(contract, "LikeReview");
    const LikeReviewFunction = async (form) => {
        const { productid, reviewindex } = form;
        try {
            const data = await LikeReview({
                args: [
                    productid, reviewindex, address
                ]
            });
            console.log("The Like is Added! ", data);
        }
        catch (err) {
            console.log("Like is not Added Successfully! ", err);
        }


    }

    //events
    // Get Specific Event 
    const {data:listedEvent}=useContractEvents(contract,"PropertyListed");

    //review add event ReviewAdded
    const {data:ReviewAdded_event}=useContractEvents(contract,"ReviewAdded");

    //reviewliked event
    const {data:ReviewLiked_event}=useContractEvents(contract,"ReviewLiked");

    //propertysold
    const {data:PropertySold_event}=useContractEvents(contract,"PropertySold");

    //property resold
    const {data:PropertyReSold_event}=useContractEvents(contract,"PropertyReSold");
    console.log(listedEvent);

    return (
        <StateContext.Provider value={{ address, connect, contract, realEstate, createPropertyFunction,getUserReviewsFunction ,getPropertiesData, updatePropertyFunction, updatePriceFunction, buyPropertyFunction, totalReviewFunction,addReviewFunction, LikeReviewFunction, getProductReviewsFunction, gethighestratedProduct, getOnePropertyData,getUserPropertiesFunction }}>
            {children}
        </StateContext.Provider>
    );
};

export const useStateContext = () => useContext(StateContext);
