"use client"
import React, { useEffect, useState } from 'react'
import { getTransactionByBudgetId } from '../../action'
import { Budget } from '@/type'
import BudgetItem from '../../components/BudgetItem'
import Wrapper from '@/app/components/Wrapper'
const page = ({params} : {params:Promise<{budgetId:string}>}) => {
  const [budgetId,setBudgetId]=useState<string>("")
  const [budget,setBudget]=useState<Budget>()
async function   fetchBudgetData(budgetId:string){
  try{
  if(budgetId){
    const budgetData= await getTransactionByBudgetId(budgetId)
    setBudget(budgetData)
  }
  }catch(error){
    console.error("erreur lors de la recuperation du budget des transactions", 
      error)
  }
}
  
  
  useEffect(()=>{
const getId=async ()=>{
  const resolvedParams= await params;
  setBudgetId(resolvedParams.budgetId)
  fetchBudgetData(resolvedParams.budgetId)
}
getId()
  },[params])
  
  return (
    <div>
   <Wrapper>
      {budget && (
     <div className='flex md:flex-row flex-col'>
      <div className='md:w-1/3'>
         <BudgetItem budget={budget} enableHover={0} />
         <button className='btn mt-4'>Supprimer le budget</button>
      </div>
     </div>
     )

     }   

   </Wrapper>
    </div>
  )
}

export default page