import PieChart from "@/components/PieChart";
import DrinkButton from "@/components/DrinkWater";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import Image from "next/image";

export default function Home() {
  return (
    <>
      {/* HERO SECTION */}
      <div className="flex flex-row blue-gradient-purple rounded-3xl px-16 py-6 items-center justify-between max-sm:flex-col max-sm:px-4">
        <div className="flex flex-col gap-6 max-w-lg">
          <h2 className="font-bold text-2xl">
            Hydrate Better, with{" "}
            <span className="font-bold text-xl bg-gradient-to-r from-cyan-600 to-blue-800 bg-clip-text text-transparent">
              AI Tracking & Feedback
            </span>
          </h2>
          <p className="text-lg">Let AI help you reach your hydration goals</p>
          <Button
            asChild
            className="max-sm:w-full w-fit bg-primary-200 text-blue-300 hover:bg-primary-200/80 rounded-full font-bold px-5 cursor-pointer min-h-10"
          >
            <Link href="/assistant">Start your Hydration</Link>
          </Button>
        </div>
        <Image
          src="/hero.png"
          alt="hero"
          width={350}
          height={350}
          className="max-sm:mt-6"
          priority
        />
      </div>

      {/* WHY WATER MATTERS SECTION */}
      <div className="container mx-auto p-4 mt-10">
        <h3 className="text-2xl font-bold text-center mb-6">💧 Why Water Matters</h3>

        {/* Illustration */}
        <div className="flex justify-center mb-6">
          <Image
            src="/hydration-benefits.png" 
            alt="Hydration Benefits"
            width={700}
            height={400}
            className="rounded-xl shadow-lg"
          />
        </div>

        {/* Four Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white rounded-2xl shadow p-4 flex flex-col items-center text-center">
            <Image src="/brain.jpg" alt="brain" width={40} height={40} />
            <h4 className="text-lg font-semibold mt-2">Boosts Brain Power</h4>
            <p className="text-sm text-gray-500">
              Staying hydrated helps you focus and think clearly.
            </p>
          </div>

          <div className="bg-white rounded-2xl shadow p-4 flex flex-col items-center text-center">
            <Image src="/muscle.jpg" alt="muscle" width={40} height={40} />
            <h4 className="text-lg font-semibold mt-2">Supports Muscles</h4>
            <p className="text-sm text-gray-500">
              Water keeps your muscles energized and prevents cramps.
            </p>
          </div>

          <div className="bg-white rounded-2xl shadow p-4 flex flex-col items-center text-center">
            <Image src="/fire.jpg" alt="metabolism" width={40} height={40} />
            <h4 className="text-lg font-semibold mt-2">Improves Metabolism</h4>
            <p className="text-sm text-gray-500">
              It helps break down food and burn energy efficiently.
            </p>
          </div>

          <div className="bg-white rounded-2xl shadow p-4 flex flex-col items-center text-center">
            <Image src="/drop.jpg" alt="flush" width={40} height={40} />
            <h4 className="text-lg font-semibold mt-2">Flushes Toxins</h4>
            <p className="text-sm text-gray-500">
              Hydration helps your body remove waste naturally.
            </p>
          </div>
        </div>
      </div>

      {/* DASHBOARD SECTION */}
      <div className="container mx-auto p-4 mt-10">
        <h1 className="text-4xl font-bold mb-6">
          Welcome to Your{" "}
          <span className="font-bold text-4xl bg-gradient-to-r from-cyan-600 to-blue-800 bg-clip-text text-transparent">
            Hydration Dashboard
          </span>
        </h1>
        <PieChart />
        <DrinkButton />
      </div>
    </>
  );
}
