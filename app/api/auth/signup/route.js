import { NextResponse } from "next/server";
import bcrypt from "bcrypt";
import { db } from "@/app/firebaseConfig";
import { ref, get, set } from "firebase/database";

export async function POST(request) {
  const { name, email, username, role, password } = await request.json();
  const salt = await bcrypt.genSalt();
  const hashedPassword = await bcrypt.hash(password, salt);
  const userRef = ref(db, "Users");
  const snapshot = await get(userRef);
  const users = snapshot.val();
  const existingUser = Object.values(users).find((user) => user.email === email || user.username === username);
  if (existingUser) {
    return NextResponse.json({ message: "Email or Username already exists" }, { status: 409 });
  }
  
  const newUser = {
    name,
    email,
    username,
    role,
    password: hashedPassword,
  };
  const rff = ref(db, "Users/" + username);

  set(rff, newUser);

  return NextResponse.json(
    { message: "Account created successfully" },
    { status: 201 }
  );
}
