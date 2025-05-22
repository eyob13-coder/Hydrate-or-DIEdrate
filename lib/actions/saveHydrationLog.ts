import { db } from "@/firebase/client";
import { format} from "date-fns"
import { doc, setDoc } from "firebase/firestore";
export async function saveHydrationLog(userId: string, waterDrank: number, goal: number) {
    const today = format(new Date(), "yyy-MM-dd");

    const logRef = doc(db, "users", userId, "hydrationLogs", today);

    await setDoc(logRef, {
        waterDrank,
        goal,
        date: today,

    })
}