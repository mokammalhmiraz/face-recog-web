'use client'
export async function POST(req){
    const reqBody = await req.json();
    const {email} = reqBody;
    return NextResponse.json(email, { status: 200 });
}