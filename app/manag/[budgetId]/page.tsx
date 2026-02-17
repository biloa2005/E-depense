"use client";
import React, { useEffect, useState } from "react";
import { getTransactionByBudgetId, addTransactionToBudget, deleteBudget,deletTransaction } from "../../action";
import { Budget } from "@/type";
import BudgetItem from "../../components/BudgetItem";
import Wrapper from "@/app/components/Wrapper";
import Notification from "@/app/components/Notification";
import { Send, Trash } from "lucide-react";
import { redirect } from "next/navigation";
import { deepEqual } from "assert";
const page = ({ params }: { params: Promise<{ budgetId: string }> }) => {
  const [budgetId, setBudgetId] = useState<string>("");
  const [budget, setBudget] = useState<Budget>();
  const [description, setDescription] = useState<string>("");
  const [amount, setAmount] = useState<string>("");
  const [notification, setNotification] = useState<string>("");
  const closeNotification = () => {
    setNotification("");
  };

  async function fetchBudgetData(budgetId: string) {
    try {
      if (budgetId) {
        const budgetData = await getTransactionByBudgetId(budgetId);
        setBudget(budgetData);
      }
    } catch (error) {
      console.error(
        "erreur lors de la recuperation du budget des transactions",
        error,
      );
    }
  }

  useEffect(() => {
    const getId = async () => {
      const resolvedParams = await params;
      setBudgetId(resolvedParams.budgetId);
      fetchBudgetData(resolvedParams.budgetId);
    };
    getId();
  }, [params]);
  const handleAddTransaction = async () => {
    if (!amount || !description) {
      setNotification("veuillez remplir tous les champ");
      return;
    }
    try {
      const amountNumber = parseFloat(amount);
      if (isNaN(amountNumber) || amountNumber <= 0) {
        throw new Error("Le montant doit etre un nombre positif.");
      }
      const newTransaction = await addTransactionToBudget(
        budgetId,
        amountNumber,
        description,
      );
      setNotification("transaction effectuer avec succes");
      fetchBudgetData(budgetId);
      setAmount("");
      setDescription("");
    } catch (error) {
      setNotification("vous avez depasse votre budget");
    }
  };
const handleDeleteBudget= async ()=>{
  const confirmed=window.confirm("Etes vous sur de vouloir supprimer ce budget et toutes ses transaction associées?")
  if(confirmed){
    try{
await deleteBudget(budgetId)
    }catch(error){
      console.error("Erreur lors de la suppression du buget",error )
    }
    redirect("/budjets")
  }
}
const handleDeleteTransaction=async (TransactionId:string)=>{
  const confirmed=window.confirm("Etes vous sur de vouloir supprimer cette transaction ?")
  if(confirmed){
    try{
await deletTransaction(TransactionId)
fetchBudgetData(budgetId)
setNotification("depense suprimée")

    }catch(error){
      console.error("Erreur lors de la suppression du buget",error )
    }
   
  }
}
  return (
    <div>
      <Wrapper>
        {notification && (
          <Notification
            message={notification}
            onclose={closeNotification}
          ></Notification>
        )}
        {budget && (
          <div className="flex md:flex-row flex-col">
            <div className="md:w-1/3">
              <BudgetItem budget={budget} enableHover={0} />
              <button className="btn mt-4"
              onClick={handleDeleteBudget}
              >Supprimer le budget</button>
              <div className=" flex flex-col gap-4 mt-4">
                <input
                  type="text"
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Description"
                  required
                  className="input input bordered w-full"
                />

                <input
                  type="number"
                  id="amount"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="Montant"
                  required
                  className="input input bordered  w-full"
                />
                <button onClick={handleAddTransaction} className="btn">
                  Ajouter une transaction
                </button>
              </div>
            </div>
            {budget?.transactions && budget.transactions.length > 0 ? (
              <div>
                <div className="overflow-x-auto md:mt-0 mt-4 md:w-2/3 ml-4">
                  <table className="table">
                    {/* head */}
                    <thead>
                      <tr>
                        <th></th>
                        <th>Montant</th>
                        <th>Description</th>
                        <th>Heure</th>
                        <th>Date</th>
                        <th>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {/* row 1 */}
                      {budget.transactions.map((transaction) => (
                        <tr key={transaction.id}>
                          <td className="text-lg md:text-3xl">
                            {transaction.emoji}
                          </td>
                          <td>
                            <span
                              style={{
                                backgroundColor: "#eeaf3a",
                                color: "white",
                                padding: "4px",
                                borderRadius: "8px",
                              }}
                            >
                              -{transaction.amount}cfa
                            </span>
                          </td>
                          <td>{transaction.description}</td>
                          <td>
                            {transaction.createdAt.toLocaleTimeString("fr-FR",{
                              hour:"2-digit",
                              minute:"2-digit",
                              second:"2-digit",
                            })}
                          </td>
                          <td>
                             {transaction.createdAt.toLocaleDateString("fr-FR")}
                          
                          </td>
                          <td>
                            <button className="btn btn-sm"
                            onClick={()=>handleDeleteTransaction(transaction.id)}
                            >
                                 <Trash className="w-4"/> 
                            </button>
                          </td>
                        </tr>

                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            ) : (
              <div
                className="md:w-2/3 mt-10 md;ml-4 flex items center 
              justify-center"
              >
                <Send strokeWidth={1.5} className="w-8 h-8 text-accent " />
                <span className="text-gray-500 ml-2">aucune transaction.</span>
              </div>
            )}
          </div>
        )}
      </Wrapper>
    </div>
  );
};

export default page;
