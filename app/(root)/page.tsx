import  PieChart from "@/components/PieChart";
import DrinkButton from "@/components/DrinkWater";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import Image from "next/image";

export default function Home() {
  return (
    
   <>
   <div className="flex flex-row rounded-3xl px-16 py-6 items-center justify-between max-sm:px-4">
    <div className="flex flex-col gap-6 max-w-lg">
      <h2 className="font-bold">Hydrate Better,with <span className="font-bold text-xl bg-gradient-to-r from-cyan-600 to-blue-800 bg-clip-text text-transparent">AI Tracking & Feedback</span></h2>
      <p className = "text-lg">Let AI help you reach your hydration goals</p>
      <Button asChild className="max-sm:w-full w-fit bg-primary-200 text-blue-100 hover:bg-primary-200/80 rounded-full font-bold px-5 cursor-pointer min-h-10">
        <Link href="/assistant">Start your Hydration.</Link>

      </Button>
    </div>
    <Image src="/hero.png" alt="hero" width={400} height={400} className="max-sm:hidden" priority/>

   </div>
    <div className="container mx-auto p-4">
      <h1 className="text-4xl font-bold mb-6">Welcome to Your <span className="font-bold text-4xl bg-gradient-to-r from-cyan-600 to-blue-800 bg-clip-text text-transparent">Hydration Dashboard</span> </h1>
      <PieChart/>
      <DrinkButton/>
    </div>
  </>
    
  );
}
