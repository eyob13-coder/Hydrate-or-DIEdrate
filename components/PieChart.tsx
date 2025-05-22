'use client';

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  Label,
} from "recharts";
import { useEffect, useState } from "react";
import { auth, db} from "@/firebase/client"
import { doc, getDoc } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import { format } from "date-fns";

const PieChartCard = () => {
  const [hydrationData, setHydrationData] = useState({ drank: 0, goal: 2000 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const today = format(new Date(), "yyyy-MM-dd");
        const docRef = doc(db, "users", user.uid, "hydrationLogs", today);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const data = docSnap.data();
          setHydrationData({ drank: data.waterDrank, goal: data.goal });
        } else {
          setHydrationData({ drank: 0, goal: 2000 });
        }
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  const { drank, goal } = hydrationData;
  const remaining = Math.max(goal - drank, 0);
  const percentage = ((drank / goal) * 100).toFixed(0);

  const data = [
    { name: "Drank", value: drank },
    { name: "Remaining", value: remaining },
  ];
  const COLORS = ["#00C49F", "#FF8042"];

  if (loading) return <p className="text-center">Loading chart...</p>;

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Hydration Progress</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              outerRadius={100}
              dataKey="value"
              label={({ percent }) => `${(percent * 100).toFixed(0)}%`}
              labelLine={false}
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
              <Label value={`${percentage}%`} position="center" fontSize={24} fill="#333" />
            </Pie>
            <Tooltip formatter={(value: number) => `${value} ml`} />
          </PieChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

export default PieChartCard;
