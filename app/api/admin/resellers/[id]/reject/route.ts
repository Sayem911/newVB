import { NextRequest } from 'next/server';
import { User } from '@/lib/models/user.model';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== 'admin') {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const reseller = await User.findById(params.id);
    if (!reseller) {
      return Response.json(
        { error: 'Reseller not found' },
        { status: 404 }
      );
    }

    reseller.status = 'suspended';
    await reseller.save();

    return Response.json(reseller);
  } catch (error) {
    console.error('Failed to reject reseller:', error);
    return Response.json(
      { error: 'Failed to reject reseller' },
      { status: 500 }
    );
  }
}