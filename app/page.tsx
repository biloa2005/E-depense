import { UserButton } from "@clerk/nextjs";
import Image from "next/image";
import Navbar from "./components/Navbar";


import Link from "next/link";
export default function Home() {
  return (
    <div>
      <Navbar/>
       
      <div className="flex items-center justify-center flex-col py-10 w-full ">
<div>
  <div className="flex flex-col">
  <h1 className="text-4xl md:text-5xl font-bold text-center  ">
    Prenez le controle <br /> de vos finances
  </h1>
   <p className="py-6 text-gray-800 text-center">
              Suivez vos budgets et vos dépenses <br /> en toute simplicité avec
              notre application intuitive !
            </p>
            <div className="flex justify-center items-center">
              <Link href={"/sign-in"}
              className="btn btn-sm md:btn-md btn-outline btn-accent"
              >Se connecter</Link>
                <Link href={"/sign-up"}
              className="btn btn-sm md:btn-md ml-2 btn-accent"
              >S'inscrire</Link>
            </div>
  </div>
</div>
      </div>
    </div>
  );
}
