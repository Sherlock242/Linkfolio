
import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase/client';
import bcrypt from 'bcryptjs';

export async function POST(request: Request) {
  try {
    const { password } = await request.json();

    // --- TEMPORARY CODE TO GENERATE HASH ---
    // This will generate a hash for the password you enter and log it.
    // Copy the hash from your server logs and update it in your Supabase 'admin_credentials' table.
    // After you've updated the database, I will remove this code.
    const tempHash = await bcrypt.hash(password, 10);
    console.log(`Your secure password hash is: ${tempHash}`);
    // --- END TEMPORARY CODE ---


    const { data: adminUser, error: dbError } = await supabase
      .from('admin_credentials')
      .select('hashed_password')
      .eq('username', 'admin')
      .single();

    if (dbError || !adminUser) {
        console.error("Database error or admin user not found:", dbError?.message);
        return NextResponse.json({ success: false, error: 'Authentication failed.' }, { status: 401 });
    }
    
    const isPasswordCorrect = await bcrypt.compare(password, adminUser.hashed_password);

    if (isPasswordCorrect) {
      return NextResponse.json({ success: true });
    } else {
      return NextResponse.json({ success: false, error: 'Invalid password' }, { status: 401 });
    }
  } catch (error) {
    console.error("An unexpected error occurred:", error);
    return NextResponse.json({ success: false, error: 'An unexpected error occurred.' }, { status: 500 });
  }
}
