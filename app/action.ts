'use server'
import {prisma} from "@/lib/prisma"

export async function checkAndAddUser(email:string | undefined){
    if(!email) return
    try{
 const existingUser=await prisma.user.findUnique({
    where:{
        email
    } 
   
 })
  if(!existingUser){
        await prisma.user.create(
            {
                data: {email}
            }
        )
        console.log("nouvelle utilisateur ajouter dans la base de donnees")
    }else{
console.log("utilisateur deja present dans la base de donnees")
    }
    }catch(error){
        console.error("Erreur lors de la verification de l utilisateur",error);
    }
}
export async function addBudjets(email:string,name:string,amount:number,selectedEmoji:string){
    try{
const user= await prisma.user.findUnique({
    where:{email}
})
if(!user){
    throw new Error ("utilisateur non trouver")
}
await prisma.budget.create({
    data:{
        name,
        amount,
        emoji:selectedEmoji,
        userId:user.id
    }
})
    }catch(error){
        console.log("error lors de l ajout du budjet:",error)
        throw error
    }
}
export async function getBudgetByUser(email:string){
    try{
const user=await prisma.user.findUnique({
    where:{
        email
    },
    include:{
        budgets:{
            include:{
                transactions:true
            }
        }
    }
})
if(!user){
    throw new Error("utilisateur non trouve")
}
return user.budgets
    }catch(error){
        console.error("erreur lors de la recuperation des budgets:", error);
        throw error;
    }
}
export async function getTransactionByBudgetId(budgetId:string){
    try{
const budget= await prisma.budget.findUnique({
    where:{
        id:budgetId
    },
    include:{
        transactions:true
    }
})
  if(!budget){
    throw new Error("budget non trouvé.")
  }
  return budget
    }catch(error){
        console.error("Erreur lors de la recuperation des transaction:",error);
        throw error;
    }
}
export async function getTransactionToBudgetId(
    budgetId:string,
    amount:number,
    description:string
){
    try{
          const budget= await prisma.budget.findUnique({
            where: {
                id:budgetId
            },
            include:{
                transactions:true
            }
          })
          if(!budget){
            throw new Error('Budget non trouvé');
        }
            const totalTransactions= budget.transactions.reduce((sum,transaction)=>{ 
                return sum + transaction.amount},0)
 
                     const totalWithNewTransaction= totalTransactions+ amount
                     if(totalTransactions>budget.amount){
                        throw new Error("Le montant total des transactions depasse le montant du budget.");

                     }
                     const newtransaction= await prisma.transaction.create({
                        data:{
                            amount,
                            description,
                            emoji:budget.emoji,
                            budget:{
                                connect:{
                                    id:budget.id
                                }
                            }
                        }
                     })
          
    }catch(error){
              console.error("Erreur lors de la recuperation des transaction:",error);
        throw error;

    }

}