"use client";
import Link from "next/link";
import { UserButton, useUser } from "@clerk/nextjs";

const Navbar = () => {
  const { isLoaded, isSignedIn, user } = useUser();
  return (
    <div className="bg-base-200/30 px-5 md:px-[10%] py-4">
      {isLoaded &&
        (isSignedIn ? (
          <>
            <div className="flex justify-between items-center">
              <div className="flex text-2xl items-center font-bold">
                <p>
                  e <span className="text-accent">.Depense</span>
                </p>
              </div>
              <div className="md:flex hidden">
                <Link href={""} className="btn ">
                  Mes budjets
                </Link>
                <Link href={""} className="btn mx-4">
                  Tableau de bord
                </Link>
                <Link href={""} className="btn ">
                  Mes Trasaction
                </Link>
              </div>
              <UserButton />
            </div>
            <div className=" md:hidden flex mt-2 justify-center">
              <Link href={""} className="btn btn-sm">
                Mes budjets
              </Link>
              <Link href={""} className="btn btn-sm mx-4">
                Tableau de bord
              </Link>
              <Link href={""} className="btn btn-sm">
                Mes Trasaction
              </Link>
            </div>
          </>
        ) : (
          <div>
            <div className=" md:hidden flex mt-2 justify-center">
              <Link href={""} className="btn btn-sm">
                Se connecter
              </Link>
              <Link href={""} className="btn btn-sm mx-4">
                S'inscrire
              </Link>
            </div>
          </div>
        ))}
    </div>
  );
};
export default Navbar;
