"use client";
import { useState } from "react";
import { saveHydrationLog } from "@/lib/actions/saveHydrationLog";
import { auth } from "@/firebase/client";

const DrinkButton = () => {
  const [loading, setLoading] = useState(false);

  const handleDrink = async () => {
    const user = auth.currentUser;
    if (!user) return alert("Not signed in!");

    setLoading(true);

    // Example: Add 250ml to today’s log
    await saveHydrationLog(user.uid, 250, 2000);

    setLoading(false);
    alert("Hydration logged!");
  };

  return (
    <button onClick={handleDrink} disabled={loading}>
      {loading ? "Saving..." : "Drink 250ml"}
    </button>
  );
};

export default DrinkButton;
