import { NextResponse } from "next/server";
import Cookies from 'js-cookie'
import bcrypt from "bcrypt";
import { db } from "@/app/firebaseConfig";
import { ref, get, set } from "firebase/database";

export async function POST(request) {
  const { email_username, password } = await request.json();
  const userRef = ref(db, "Users");
  const snapshot = await get(userRef);
  const users = snapshot.val();
  const existingUser = Object.values(users).find(
    (user) => user.email === email_username || user.username === email_username
  );
  if (existingUser) {
    const isPasswordValid = await bcrypt.compare(
      password,
      existingUser.password
    );
    if (!isPasswordValid) {
      return NextResponse.json(
        { message: "Invalid Password or Email/Username" },
        { status: 409 }
      );
    }
    return NextResponse.json({ message: "Login Successful", data: existingUser}, { status: 200 })

  }
  return NextResponse.json(
    { message: "Invalid Password or Email/Username" },
    { status: 409 }
  );
}
