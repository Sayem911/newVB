import { NextRequest } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { User } from '@/lib/models/user.model';

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== 'reseller') {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { multiplier } = await req.json();
    if (!multiplier || multiplier < 1) {
      return Response.json(
        { error: 'Invalid price multiplier' },
        { status: 400 }
      );
    }

    // Update reseller's product pricing
    const reseller = await User.findById(session.user.id);
    if (!reseller) {
      return Response.json(
        { error: 'Reseller not found' },
        { status: 404 }
      );
    }

    // Update or add pricing for this product
    if (!reseller.productPricing) {
      reseller.productPricing = {};
    }
    reseller.productPricing[params.id] = multiplier;
    await reseller.save();

    return Response.json({ success: true });
  } catch (error) {
    console.error('Failed to update product pricing:', error);
    return Response.json(
      { error: 'Failed to update product pricing' },
      { status: 500 }
    );
  }
}