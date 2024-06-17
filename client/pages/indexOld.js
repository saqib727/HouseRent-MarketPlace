import React, { useEffect, useState } from 'react';
import { ethers } from 'ethers';

import { useStateContext } from '@/context';
import { checkIfImage } from '@/utils';
import { setLazyProp } from 'next/dist/server/api-utils';

const IndexOld = () => {
  const { address, connect, contract, realEstate, createPropertyFunction ,getPropertiesData} = useStateContext();
  const [isLoading, setIsLoading] = useState(false);
  const [properties,setProperties]=useState([]);
  const [form, setForm] = useState({
    propertyTitle: "",
    description: "",
    category: "",
    price: "",
    images: "",
    propertyAddress: "",
  });

  const handleFromFieldChange = (fieldName, e) => {
    setForm({ ...form, [fieldName]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    checkIfImage(form.images, async (exists) => {
      if (exists) {
        setIsLoading(true);
        const parsedPrice = ethers.utils.parseUnits(form.price, 18); // Parse the price directly from the form
        await createPropertyFunction({
          ...form,
          price: parsedPrice,
        });
        setIsLoading(false);
      } else {
        alert("Please provide a valid image URL");
        setForm({ ...form, images: "" });
      }
    });
  };

  //get data
  const fetchProperty= async()=>{
    setIsLoading(true);
    const data= await getPropertiesData();
    setProperties(data);
    setIsLoading(false);
  };

  useEffect(()=>{
    if (contract){
      fetchProperty();
    }


  },[address,contract]);
  return (
    <div>
      <h1>Create {realEstate}</h1>
      <button onClick={()=>connect()}>
        Connect
      </button>
      <form onSubmit={handleSubmit}>
        <div>
          <input type='text' placeholder='Property Title' onChange={(e) => handleFromFieldChange("propertyTitle", e)} />
        </div>
        <div>
          <input type='text' placeholder='Description' onChange={(e) => handleFromFieldChange("description", e)} />
        </div>
        <div>
          <input type='text' placeholder='Category' onChange={(e) => handleFromFieldChange("category", e)} />
        </div>
        <div>
          <input type='number' placeholder='Price' onChange={(e) => handleFromFieldChange("price", e)} />
        </div>
        <div>
          <input type='url' placeholder='Images' onChange={(e) => handleFromFieldChange("images", e)} />
        </div>
        <div>
          <input type='text' placeholder='Property Address' onChange={(e) => handleFromFieldChange("propertyAddress", e)} />
        </div>
        <button type='submit' disabled={isLoading}>
          {isLoading ? "Submitting..." : "Submit"}
        </button>
      </form>
    </div>
  );
};

export default IndexOld;
