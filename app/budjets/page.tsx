"use client";
import React from "react";
import { useState, useEffect } from "react";
import Wrapper from "../components/Wrapper";
import { useUser } from "@clerk/nextjs";
import EmojiPicker from "emoji-picker-react";
import  {addBudjets, getBudgetByUser} from "../action"
import Notification from "../components/Notification";
import {Budget} from "@/type"
import Link from 'next/link';
import BudgetItem from "../components/BudgetItem";
import { Landmark } from "lucide-react";
const page = () => {
  const { user } = useUser();
  const [budgetName, setBudjetName] = useState<string>("");
  const [budgetAmount, setBudjetAmount] = useState<string>("");
  const [showEmojiPicker, setShowEmojiPicker] = useState<boolean>(false);
  const [selectedEmoji, setSelectedEmoji] = useState<string>("");
  const handleEmojiSelected = (emojiObject: { emoji: string }) => {
    setSelectedEmoji(emojiObject.emoji);
    setShowEmojiPicker(false);
  };
  const handleAddBudget=async ()=>{
    try{
const amount= parseFloat(budgetAmount)
if (isNaN(amount) || amount <=0){
  throw new Error("le montant doit etre un nombre positif");
}
await  addBudjets(
  user?.primaryEmailAddress?.emailAddress as string,
  budgetName,
  amount,
  selectedEmoji
)
fetchBudgets()
const modal =document.getElementById("my_modal_3") as HTMLDialogElement
if(modal){
  modal.close()
}
setNotification("Nouveau Budjet creer avec succes")
    }catch(error){
setNotification(`Erreur:${error}`)
    }
  }
  const [notification, setNotification]=useState<string>("");
  const closeNotification=()=>{
    setNotification("")
    setBudjetName("")
    setBudjetAmount("")
    setSelectedEmoji("")
    setShowEmojiPicker(false)
  }
  const [budgets,setbudgets]=useState<Budget[]>([])
  const fetchBudgets=async()=>{
    if(user?.primaryEmailAddress?.emailAddress){
      try{
const userBudgets= await getBudgetByUser(user?.primaryEmailAddress?.emailAddress)
setbudgets(userBudgets)
      }catch(error){
        setNotification(`Erreur lors de la recuperation du budgets:${error}`)
      }
    }
  };
useEffect(()=>{
  fetchBudgets()
},[user?.primaryEmailAddress?.emailAddress])

  return (
    <Wrapper>
      {notification && (
        <Notification message={notification} onclose={closeNotification}></Notification>
        )}
      {}
      <button
        className="btn mb-4"
        onClick={() =>
          (
            document.getElementById("my_modal_3") as HTMLDialogElement
          ).showModal()
        }
      >
        Nouveau Budgets
        <Landmark className="w-4"/>
      </button>
      <dialog id="my_modal_3" className="modal">
        <div className="modal-box">
          <form method="dialog">
            {}
            <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">
              ✕
            </button>
          </form>
          <h3 className="font-bold text-lg">Creation d'un budget</h3>
          <p className="py-4">Permet de controler ces depenses facilement</p>
          <div className="w-full flex flex-col">
            <input
              type="text"
              value={budgetName}
              placeholder="nom du budget"
              onChange={(e) => setBudjetName(e.target.value)}
              className="input input-bordered mb-3 w-full"
              required
            />

            <input
              type="number"
              value={budgetAmount}
              placeholder="Montant du budget"
              onChange={(e) => setBudjetAmount(e.target.value)}
              className="input input-bordered mb-3 w-full"
              required
            />

            <button
              onClick={() => setShowEmojiPicker(!showEmojiPicker)}
              className="btn mb-4"
            >
              {selectedEmoji || "selectionne un emodji 🙏"}
            </button>
            {showEmojiPicker && (
              <div className="flex justify-center items-center my-4">
                <EmojiPicker onEmojiClick={handleEmojiSelected} />
              </div>
            )}

            <button className="btn"
            onClick={handleAddBudget}
            >Ajouter budjet</button>
          </div>
        </div>
      </dialog>
         <ul className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {
                budgets.map((budget)=>(
                  <Link href={"/S"} key={budget.id}>
                    <BudgetItem budget={budget}
                    enableHover={1}
                    >

                    </BudgetItem>
                    </Link>
                ))
              }
         </ul>

    </Wrapper>
  );
};
export default page;
