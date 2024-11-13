'use client';

import { useProducts } from './ProductsContext';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Edit, Trash2, Star, Zap, Clock } from 'lucide-react';
import Image from 'next/image';
import { ProductPopularity } from '@/types/product';

export default function ProductList() {
  const { products, loading } = useProducts();

  if (loading) {
    return <div>Loading products...</div>;
  }

  const getPopularityIcon = (popularity: ProductPopularity) => {
    switch (popularity) {
      case ProductPopularity.FEATURED:
        return <Star className="h-4 w-4 text-yellow-500" />;
      case ProductPopularity.TRENDING:
        return <Zap className="h-4 w-4 text-blue-500" />;
      case ProductPopularity.NEW:
        return <Clock className="h-4 w-4 text-green-500" />;
      default:
        return null;
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {products.map((product) => (
        <Card key={product._id} className="overflow-hidden">
          <CardHeader className="p-0">
            <div className="relative w-full h-48">
              <Image
                src={product.imageUrl}
                alt={product.title}
                fill
                className="object-cover"
              />
              {product.instantDelivery && (
                <Badge className="absolute top-2 right-2" variant="secondary">
                  Instant Delivery
                </Badge>
              )}
            </div>
          </CardHeader>
          <CardContent className="p-4">
            <div className="flex justify-between items-start mb-2">
              <div>
                <CardTitle className="text-lg">{product.title}</CardTitle>
                <CardDescription className="text-sm">
                  {product.region} • {product.category.replace(/_/g, ' ')}
                </CardDescription>
              </div>
              {getPopularityIcon(product.popularity as ProductPopularity)}
            </div>
            
            <div className="mt-4 space-y-2">
              {product.subProducts.length > 0 && (
                <div className="text-sm text-muted-foreground">
                  {product.subProducts.length} variants available
                </div>
              )}
              
              <div className="flex justify-between items-center">
                <div className="text-sm">
                  {product.isIDBased ? 'ID-based' : 'Standard'} delivery
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="icon">
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button variant="destructive" size="icon">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}