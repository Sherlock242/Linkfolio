
import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase/client';

export async function POST(request: Request) {
  try {
    const { password } = await request.json();

    // TEMPORARY: Direct password comparison.
    // This is insecure and should be replaced with a proper hashing mechanism.
    if (password === 'santosh242@') {
       return NextResponse.json({ success: true });
    }

    // The code below is currently bypassed but will be used once hashing is re-enabled.
    const { data: adminUser, error: dbError } = await supabase
      .from('admin_credentials')
      .select('hashed_password')
      .eq('username', 'admin')
      .single();

    if (dbError || !adminUser) {
        console.error("Database error or admin user not found:", dbError?.message);
        return NextResponse.json({ success: false, error: 'Authentication failed.' }, { status: 401 });
    }
    
    // This will be re-enabled later.
    // const isPasswordCorrect = await bcrypt.compare(password, adminUser.hashed_password);
    const isPasswordCorrect = false; // Hardcoded to false for now

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
