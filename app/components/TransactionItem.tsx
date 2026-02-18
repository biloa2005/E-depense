import React from "react";
import { Transaction } from "@/type";
import Link from 'next/link'
interface TransactionItemProps {
  transaction: Transaction;
}

const TransactionItem: React.FC<TransactionItemProps> = ({ transaction }) => {
  return (
    <li  className="flex justify-between items-center">
      <div className="my-4">
        <button className="btn">
          <div
            style={{
              
              color: "#eeaf3a",
              padding: "4px",
              borderRadius: "8px",
            }}
          >
            {transaction.amount}
          </div>
          {transaction.budgetName}
        </button>
      </div>
      <div className="md:hidden flex flex-col items-end">
<span className="font-bold text-sm">{transaction.description}</span>
<span className="text-sm">
  {new Date(transaction.createdAt).toLocaleDateString("fr-FR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  })}{" "}
  {new Date(transaction.createdAt).toLocaleTimeString("fr-FR", {
    hour: "2-digit",
    minute: "2-digit",
  })}
</span>

      </div>
      <div className="hidden md:flex">
           <span className="font-bold text-sm">
            {transaction.description}
           </span>
      </div>
      <div className="hidden md:flex">
          
  {new Date(transaction.createdAt).toLocaleDateString("fr-FR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  })}{" "}
  {new Date(transaction.createdAt).toLocaleTimeString("fr-FR", {
    hour: "2-digit",
    minute: "2-digit",
  })}


      </div>

       <div className="hidden md:flex">
        <Link href={`/manag/${transaction.budgetId}`} className="btn">Voir plus</Link>
       </div>
    </li>
  );
};

export default TransactionItem;
