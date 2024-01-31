import { NextResponse } from "next/server";
import { cookies } from 'next/headers'

import bcrypt from "bcrypt";
import { db } from "@/app/firebaseConfig";
import { ref, get, set } from "firebase/database";
//login
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
    cookies().set('token', existingUser, {
      path: '/',
      maxAge: 60 * 60 * 24 * 7 
    })
    return NextResponse.json({ message: "Login Successful" }, { status: 200 })

  }
  return NextResponse.json(
    { message: "Invalid Password or Email/Username" },
    { status: 409 }
  );
}
