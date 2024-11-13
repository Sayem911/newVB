import { NextRequest } from 'next/server';
import { Product } from '@/lib/models/product.model';
import mongoose from 'mongoose';
import dbConnect from '@/lib/db/mongodb';

export async function GET(req: NextRequest) {
  try {
    await dbConnect();
    
    const { searchParams } = new URL(req.url);
    const category = searchParams.get('category');
    const popularity = searchParams.get('popularity');
    const countryCode = searchParams.get('countryCode');
    const resellerId = searchParams.get('resellerId');

    let query: any = {};
    if (category) query.category = category;
    if (popularity) query.popularity = popularity;
    if (countryCode) query.countryCode = countryCode;

    const products = await Product.find(query)
      .sort({ displayOrder: 1, createdAt: -1 });

    // If reseller ID is provided, we need to fetch their custom pricing
    if (resellerId) {
      // TODO: Implement reseller pricing logic
    }
      
    return Response.json(products);
  } catch (error) {
    console.error('Failed to fetch products:', error);
    return Response.json(
      { error: 'Failed to fetch products' },
      { status: 500 }
    );
  }
}