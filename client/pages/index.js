import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';

import { useStateContext } from '@/context';

const Index = () => {
  const {  address, connect, contract,realEstate } = useStateContext();
  
  return (
    <div>
      <h1>
      {realEstate}
      </h1>
      <button onClick={()=>connect()}>
      List
      </button>
      <h2>
        Address of the user is :{address}
      </h2>
     
    </div>
  );
};

export default Index;