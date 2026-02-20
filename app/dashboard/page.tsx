"use client";
import React, { useEffect, useState } from "react";
import { useUser } from "@clerk/nextjs";
import {Transaction,Budget} from "../../type"
import { getTotalTransactionAmount, getTransactionCount,getReachedBudget, getUserBudgetData,getLastBudgets, getLastTransactions } from "../action";
import Wrapper from "../components/Wrapper";
import { CircleDollarSign, Landmark, PiggyBank } from "lucide-react";
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import BudgetItem from '../components/BudgetItem';
import Link from 'next/link';
import TransactionItem from '../components/TransactionItem';

const page = () => {
  const { user } = useUser();
  const [loading, setLoading] = useState<Boolean>(true);
  const [totalCount,setTotalCount]=useState<number | null>(null)
  const [reachedBudgetRatio,setReachedBudgetRatio]=useState<string | undefined |null>(null);
  const [budgetData,setBudgetData]=useState<any[]>([])
  const [transactions,setTransactions]=useState<Transaction[]>([])
  const [budgets,setBudgets]=useState<Budget[]>([])
  const [totalAmount, setTotalAmount] = useState<number | null>(null);
  const fetchData = async () => {
    setLoading(true);

    try {
      const email = user?.primaryEmailAddress?.emailAddress as string;

      if (email) {
        const amount = await getTotalTransactionAmount(email);
        const count=await  getTransactionCount(email)
        const reachedBudgets=await getReachedBudget(email)
        const budgetsData= await getUserBudgetData(email)
         const lastTransactions = await getLastTransactions(email)
                const lastBudgets = await getLastBudgets(email)
        setReachedBudgetRatio(reachedBudgets)
 setTransactions(lastTransactions)
                setBudgets(lastBudgets)
        setBudgetData(budgetsData)
        setTotalAmount(amount);
        setTotalCount(count)
        setLoading(false);
      }
    } catch (error) {
      console.error("erreur lors de la recuperation des données", error);
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchData();
  }, [user]);
  return (
    <Wrapper>
      {loading ? (
        <div className="flex justify-center items-center">
          <span className="loading loading-spinner loading-lg"></span>
        </div>
      ) : (
        <div>
          <div className="grid md:grid-cols-3 gap-4 ">
            <div
              className="border-2 border-base-300 flex justify-between
                items-center rounded-xl p-5 min-h-[120px]"
            >
              <div className="flex flex-col">
                <span className="text-gray-500 text-sm">
                  Total des transactions
                </span>
                <span className="text-2xl font-bold text-accent">
                  {totalAmount !== null ? `${totalAmount}cfa` : "N/A"}
                </span>
              </div>
              <CircleDollarSign
                className="bg-accent w-9 h-9
              rounded-full p-1 text-white"
              />
            </div>
             <div
              className="border-2 border-base-300 flex justify-between
                items-center rounded-xl p-5 min-h-[120px]"
            >
              <div className="flex flex-col">
                <span className="text-gray-500 text-sm">
                  Nombre de transactions
                </span>
                <span className="text-2xl font-bold text-accent">
                  {totalCount !== null ? `${totalCount}` : "N/A"}
                </span>
              </div>
              <PiggyBank
                className="bg-accent w-9 h-9
              rounded-full p-1 text-white"
              />
            </div>
             <div
              className="border-2 border-base-300 flex justify-between
                items-center rounded-xl p-5 min-h-[120px]"
            >


              <div className="flex flex-col">
                <span className="text-gray-500 text-sm">
                  Budgets atteints
                </span>
                <span className="text-2xl font-bold text-accent">
                  {reachedBudgetRatio ||"N/A"}
                </span>
              </div>
              <Landmark
                className="bg-accent w-9 h-9
              rounded-full p-1 text-white"
              />
            </div>
          </div>
          <div className="w-full md:flex mt-4">
            <div className="rounded-xl   w-full min-w-0">
              <div className="border-2 border-base-300 p-5 rounded-xl " >
                 <h3 className='text-lg font-semibold mb-3'>
                                    Statistiques ( en cfa )
                                </h3>
                 <ResponsiveContainer height={250} width="100%">
                                    <BarChart width={730} height={250} data={budgetData}>
                                        <CartesianGrid vertical={false} strokeDasharray="3 3" />
                                        <XAxis dataKey="budgetName" />

                                        <Tooltip />

                                        <Bar
                                            name="Budget"
                                            dataKey="totalBudgetAmount"
                                            fill="#EF9FBC"
                                            radius={[10, 10, 0, 0]}
                                        />

                                        <Bar
                                            name="Dépensé"
                                            dataKey="totalTransactionAmount" fill="#EEAF3A"
                                            radius={[10, 10, 0, 0]}
                                        />
                                    </BarChart>
                                </ResponsiveContainer>
              </div>
              <div className='mt-4 border-2 border-base-300 p-5 rounded-xl'>
                <h3 className='text-lg font-semibold mb-3'>
                                    Dernieres Transactions
                                </h3>
                                 <ul className='divide-y divide-base-300'>
                                    {transactions.map((transaction) => (
                                        <TransactionItem
                                            key={transaction.id}
                                            transaction={transaction}>
                                        </TransactionItem>
                                    ))}
                                </ul>
              </div>
            </div>
            <div className="ml-4 ">
            <h3 className='text-lg font-semibold my-4 md:mb-3 md:mt-0'>
                                    Dernier Budgets
                                </h3>
                                <ul className="grid grid-cols-1 gap-4">
                                {budgets.map((budget) => (
                                    <Link href={`/manag/${budget.id}`} key={budget.id}>
                                        <BudgetItem budget={budget} enableHover={1}></BudgetItem>
                                    </Link>
                                ))}
                            </ul>
            </div>
          </div>
        </div>
      )}
    </Wrapper>
  );
};

export default page;
