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
export async function addBudjets(email:string,name:string,amount:number,selectedEmodji:string){
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
        amount ,
       
        emodji:selectedEmodji,
        userId:user.id
    }
})
    }catch(error){
        console.log("error lors de l ajout du budjet:",error)
        throw error
    }
}