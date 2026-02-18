import React, { useState } from 'react'
import { useUser } from '@clerk/nextjs';
const page = () => {
    const { user } = useUser();
    const [totalAmount,setTotalAmount]=useState<number|null>(null)
    const fetchData=async()=>{
        
    }
  return (
    <div>page</div>
  )
}

export default page