import { NextResponse } from "next/server";
import { getGeminiResponse } from "../../../../lib/gemini";
import { db } from "@/firebase/client";
import { doc, setDoc } from "firebase/firestore";

export async function GET(){
    return Response.json({ sucess: true, data: 'GREAT JOB'}, {status: 200});
}



export async function POST(req: Request) {
  try {
    const { sessionId, phoneNumber, responses, uid } = await req.json();
    const date = new Date().toISOString().split('T')[0]; // Get current date in YYYY-MM-DD format

    const summary = await getGeminiResponse(responses);

    await setDoc(doc(db, `users/${uid}/hydrationLogs/${date}`, sessionId), {
      phoneNumber,
      responses,
      summary,
      createdAt: new Date().toISOString(),
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error saving Vapi data:", error);
    return NextResponse.json({ success: false }, { status: 500 });
  }
}
