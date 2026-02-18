"use server";
import { prisma } from "@/lib/prisma";
import { Budget,Transaction } from "@/type";
export async function checkAndAddUser(email: string | undefined) {
  if (!email) return;
  try {
    const existingUser = await prisma.user.findUnique({
      where: {
        email,
      },
    });
    if (!existingUser) {
      await prisma.user.create({
        data: { email },
      });
      console.log("nouvelle utilisateur ajouter dans la base de donnees");
    } else {
      console.log("utilisateur deja present dans la base de donnees");
    }
  } catch (error) {
    console.error("Erreur lors de la verification de l utilisateur", error);
  }
}
export async function addBudjets(
  email: string,
  name: string,
  amount: number,
  selectedEmoji: string,
) {
  try {
    const user = await prisma.user.findUnique({
      where: { email },
    });
    if (!user) {
      throw new Error("utilisateur non trouver");
    }
    await prisma.budget.create({
      data: {
        name,
        amount,
        emoji: selectedEmoji,
        userId: user.id,
      },
    });
  } catch (error) {
    console.log("error lors de l ajout du budjet:", error);
    throw error;
  }
}
export async function getBudgetByUser(email: string) {
  try {
    const user = await prisma.user.findUnique({
      where: {
        email,
      },
      include: {
        budgets: {
          include: {
            transactions: true,
          },
        },
      },
    });
    if (!user) {
      throw new Error("utilisateur non trouve");
    }
    return user.budgets;
  } catch (error) {
    console.error("erreur lors de la recuperation des budgets:", error);
    throw error;
  }
}
export async function getTransactionByBudgetId(budgetId: string) {
  try {
    const budget = await prisma.budget.findUnique({
      where: {
        id: budgetId,
      },
      include: {
        transactions: true,
      },
    });
    if (!budget) {
      throw new Error("budget non trouvé.");
    }
    return budget;
  } catch (error) {
    console.error("Erreur lors de la recuperation des transaction:", error);
    throw error;
  }
}
export async function getTrasactionsByBudgetId(budgetId: string) {
  try {
    const budget = await prisma.budget.findUnique({
      where: {
        id: budgetId,
      },
      include: {
        transactions: true,
      },
    });
    if (!budget) {
      throw new Error("Budget non trouvé.");
    }

    return budget;
  } catch (error) {
    console.error("Erreur lors de la récupération des transactions:", error);
    throw error;
  }
}

export async function addTransactionToBudget(
  budgetId: string,
  amount: number,
  description: string,
) {
  try {
    const budget = await prisma.budget.findUnique({
      where: {
        id: budgetId,
      },
      include: {
        transactions: true,
      },
    });

    if (!budget) {
      throw new Error("Budget non trouvé.");
    }

    const totalTransactions = budget.transactions.reduce((sum, transaction) => {
      return sum + transaction.amount;
    }, 0);

    const totalWithNewTransaction = totalTransactions + amount;

    if (totalWithNewTransaction > budget.amount) {
      throw new Error(
        "Le montant total des transactions dépasse le montant du budget.",
      );
    }

    const newTransaction = await prisma.transaction.create({
      data: {
        amount,
        description,
        emoji: budget.emoji,
        budget: {
          connect: {
            id: budget.id,
          },
        },
      },
    });
  } catch (error) {
    console.error("Erreur lors de l'ajout de la transaction:", error);
    throw error;
  }
}

export const deleteBudget = async (budgetId: string) => {
  try {
    await prisma.transaction.deleteMany({
      where: { budgetId },
    });
    await prisma.budget.delete({
      where: {
        id: budgetId,
      },
    });
  } catch (error) {
    console.error(
      "Erreur lors de la supression du budget et de ces transaction associer",
      error,
    );
    throw error;
  }
};
export async function deletTransaction(transactionId: string) {
  try {
    const transaction = await prisma.transaction.findUnique({
      where: {
        id: transactionId,
      },
    });
    if (!transaction) {
      throw new Error("transaction non trouver.");
    }
    await prisma.transaction.delete({
      where: {
        id: transactionId,
      },
    });
  } catch (error) {
    console.error("Erreur lors de la supression des transaction ", error);
    throw error;
  }
}

export async function getTransactionByEmailAndPeriod(
  email: string,
  period: string,
) {
  try {
    const now = new Date();
    let dateLimit;
    switch (period) {
      case "Last30":
        dateLimit = new Date(now);
        dateLimit.setDate(now.getDate() - 30);
        break;
      case "Last90":
        dateLimit = new Date(now);
        dateLimit.setDate(now.getDate() - 90);
        break;
      case "Last7":
        dateLimit = new Date(now);
        dateLimit.setDate(now.getDate() - 7);
        break;
 case "Last365":
        dateLimit = new Date(now);
        dateLimit.setFullYear(now.getDate() - 1);
        break;
      default:
        throw new Error("periode invalide.");
    }
    const user = await prisma.user.findUnique({
      where: { email },
      include: {
        budgets: {
          include: {
            transactions: {
              where: {
                createdAt: {
                  gte: dateLimit,
                },
              },
              orderBy: {
                createdAt: "desc",
              },
            },
          },
        },
      },
    });
    if(!user){
        throw new Error("utilisateur non trouver.")
    }
    const transactions = user.budgets.flatMap(budget=>
        budget.transactions.map(transaction => ({
            ...transaction,
            budgetName:budget.name,
            budgetId:budget.id
        }))
    )
    return transactions
  } catch (error) {
    console.error("Erreur lors de la recuperation des transaction:", error);
    throw error;
  }
}

//dashboard

export async function getTotalTransactionAmount(email:string){
try{
const user=await prisma.user.findUnique(
  {
    where:{email},
    include:{
      budgets:{
        include:{
          transactions:true
        }
      }
    }
  }
)
if(!user) throw new Error("utilisateur non trouve.")
  const totalAmount= user.budgets.reduce((sum,budgets)=>{
return sum + budgets.transactions.reduce((budjetsum, transaction)=>budjetsum +transaction.amount,
0
)
},0)
return totalAmount
}catch(error){
  console.error("Erreur lors du calcul du Montant total des transactions",error)
  throw error;
}
}