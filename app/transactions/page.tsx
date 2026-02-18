"use client";
import { useUser } from "@clerk/nextjs";
import React, { useEffect } from "react";
import { Transaction } from "@/type";
import { useState } from "react";
import { getTransactionByEmailAndPeriod } from "../action";
import Wrapper from "../components/Wrapper";
import TransactionItem from "../components/TransactionItem";
const page = () => {
  const { user } = useUser();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState<Boolean>(false);
  const fetchTransactions = async (period: string) => {
    if (user?.primaryEmailAddress?.emailAddress) {
      setLoading(true);
      try {
        const transactionData = await getTransactionByEmailAndPeriod(
          user?.primaryEmailAddress?.emailAddress,
          period,
        );
        setTransactions(transactionData);
        setLoading(false);
      } catch (err) {
        console.error("Erreur lors de la recuperation des transactions:", err);
        setLoading(false);
      }
    }
  };
  useEffect(() => {
    fetchTransactions("Last30");
  }, [user?.primaryEmailAddress?.emailAddress]);
  return (
    
    <Wrapper>
      <div className="flex justify-center mb-5">
        <select 
        className="input input-bordered input-md flex items-center px-4"
        defaultValue="Last30"
        onChange={(e)=>fetchTransactions(e.target.value)}
        >
           <option value="Last7">Derniers 7 jours</option>
          <option value="Last30">Derniers 30 jours</option>
          <option value="Last90">Derniers 90 jours</option>
          <option value="Last365">Derniers 365 jours</option>

        </select>

      </div>
      <div className="overflow-x-auto w-full bg-base-200/35 p-5
      rounded-xl">
        {loading ? (
          <div className="flex justify-center items-center">
            <span className="loading loading-spinner loading-md"></span>
          </div>
        ) : transactions.length === 0 ? (
          <div className="flex justify-center items-center h-full">
            <span className="text-gray-500 text-sm">Aucune transaction a afficher </span>
          </div>
        ) : (
          <div>
            <ul className="divide-y divide-base-300">
              {transactions.map((transaction)=>(
                <TransactionItem 
                key={transaction.id}
                 transaction={transaction}>

                </TransactionItem>
              )) }
            </ul>
          </div>
        )}
      </div>
    </Wrapper>
  );
};

export default page;
