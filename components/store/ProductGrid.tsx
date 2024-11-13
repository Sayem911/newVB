'use client';

import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { IProduct } from '@/types/product';
import { formatCurrency } from '@/lib/utils';
import { ShoppingCart, Zap } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

interface ProductGridProps {
  search: string;
}

export function ProductGrid({ search }: ProductGridProps) {
  const [products, setProducts] = useState<IProduct[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await fetch('/api/products');
      const data = await response.json();
      setProducts(data);
    } catch (error) {
      console.error('Failed to fetch products:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredProducts = products.filter((product) =>
    product.title.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) {
    return <div>Loading products...</div>;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {filteredProducts.map((product) => (
        <Link key={product._id} href={`/product/${product._id}`}>
          <Card className="overflow-hidden transition-transform hover:scale-105">
            <div className="relative h-48">
              <Image
                src={product.imageUrl}
                alt={product.title}
                fill
                className="object-cover"
              />
              {product.instantDelivery && (
                <Badge className="absolute top-2 right-2" variant="secondary">
                  <Zap className="w-3 h-3 mr-1" />
                  Instant
                </Badge>
              )}
            </div>
            <div className="p-4">
              <h3 className="font-semibold text-lg">{product.title}</h3>
              <p className="text-sm text-muted-foreground mb-4">
                {product.region} • {product.category.replace(/_/g, ' ')}
              </p>
              
              {product.subProducts.length > 0 && (
                <div className="space-y-2">
                  <div className="flex justify-between items-center text-sm">
                    <span>{product.subProducts[0].name}</span>
                    <span className="font-semibold">
                      {formatCurrency(product.subProducts[0].price, 'USD')}
                    </span>
                  </div>
                  {product.subProducts.length > 1 && (
                    <div className="text-xs text-muted-foreground">
                      +{product.subProducts.length - 1} more options
                    </div>
                  )}
                </div>
              )}

              <Button className="w-full mt-4">
                <ShoppingCart className="w-4 h-4 mr-2" />
                Buy Now
              </Button>
            </div>
          </Card>
        </Link>
      ))}
    </div>
  );
}