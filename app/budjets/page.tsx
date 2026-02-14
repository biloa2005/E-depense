"use client"
import React from 'react'
import { useState,useEffect } from 'react'
import Wrapper from '../components/Wrapper'
import { useUser } from '@clerk/nextjs'

const page = () => {
  const{user}=useUser()
  const [budgetName, setBudjetName]=useState<string>("")
  const [budgetAmount, setBudjetAmount]=useState<string>("")
  return (
    <Wrapper>
      {}
<button className="btn" onClick={()=>(document.getElementById('my_modal_3') as HTMLDialogElement).showModal()}>
  Nouveau Budgets
  </button>
<dialog id="my_modal_3" className="modal">
  <div className="modal-box">
    <form method="dialog">
      {}
      <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>
    </form>
    <h3 className="font-bold text-lg">Creation d'un budget</h3>
    <p className="py-4">Permet de controler ces depenses facilement</p>
    <div className='w-full flex flex-col'>
      <input type="text"
      value={budgetName}
      placeholder='nom du budget'
      onChange={(e)=>setBudjetName(e.target.value)}
      className='input input-bordered mb-3 w-full'
      required
      />

      <input type="number"
      value={budgetAmount}
      placeholder='nom du budget'
      onChange={(e)=>setBudjetAmount(e.target.value)}
      className='input input-bordered mb-3 w-full'
      required
      />
      <button className='btn'>
        Ajouter budjet
      </button>
    </div>
  </div>
</dialog>
      </Wrapper>
  )
}
export default page