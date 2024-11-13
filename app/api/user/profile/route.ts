import { NextRequest } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { User } from '@/lib/models/user.model';
import dbConnect from '@/lib/db/mongodb';

export async function PATCH(req: NextRequest) {
  try {
    await dbConnect();
    
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return Response.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const data = await req.json();
    const user = await User.findById(session.user.id);

    if (!user) {
      return Response.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // Update allowed fields
    if (data.name) user.name = data.name;
    if (data.phone) user.phoneNumber = data.phone;

    await user.save();

    return Response.json(user);
  } catch (error) {
    console.error('Profile update error:', error);
    return Response.json(
      { error: 'Failed to update profile' },
      { status: 500 }
    );
  }
}