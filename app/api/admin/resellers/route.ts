import { NextRequest } from 'next/server';
import { User } from '@/lib/models/user.model';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../auth/[...nextauth]/route';

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== 'admin') {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const status = searchParams.get('status') || 'active';

    const resellers = await User.find({
      role: 'reseller',
      status,
    }).sort({ createdAt: -1 });

    return Response.json(resellers);
  } catch (error) {
    console.error('Failed to fetch resellers:', error);
    return Response.json(
      { error: 'Failed to fetch resellers' },
      { status: 500 }
    );
  }
}