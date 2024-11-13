'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { IProduct } from '@/types/product';
import { formatCurrency } from '@/lib/utils';
import { ShoppingCart, Zap, AlertCircle } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import Image from 'next/image';

export default function ProductPage() {
  const { id } = useParams();
  const [product, setProduct] = useState<IProduct | null>(null);
  const [selectedVariant, setSelectedVariant] = useState('');
  const [loading, setLoading] = useState(true);
  const [customFields, setCustomFields] = useState<Record<string, string>>({});

  useEffect(() => {
    fetchProduct();
  }, [id]);

  const fetchProduct = async () => {
    try {
      const response = await fetch(`/api/products/${id}`);
      const data = await response.json();
      setProduct(data);
      if (data.subProducts.length > 0) {
        setSelectedVariant(data.subProducts[0].name);
      }
    } catch (error) {
      console.error('Failed to fetch product:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div>Loading product...</div>;
  }

  if (!product) {
    return <div>Product not found</div>;
  }

  const selectedSubProduct = product.subProducts.find(
    (sp) => sp.name === selectedVariant
  );

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Product Image */}
          <div className="relative h-96 lg:h-[600px]">
            <Image
              src={product.imageUrl}
              alt={product.title}
              fill
              className="object-cover rounded-lg"
            />
            {product.instantDelivery && (
              <Badge className="absolute top-4 right-4" variant="secondary">
                <Zap className="w-4 h-4 mr-1" />
                Instant Delivery
              </Badge>
            )}
          </div>

          {/* Product Details */}
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold">{product.title}</h1>
              <p className="text-lg text-muted-foreground mt-2">
                {product.region} • {product.category.replace(/_/g, ' ')}
              </p>
            </div>

            <Separator />

            <div className="space-y-4">
              <div>
                <Label>Select Package</Label>
                <Select
                  value={selectedVariant}
                  onValueChange={setSelectedVariant}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a package" />
                  </SelectTrigger>
                  <SelectContent>
                    {product.subProducts.map((subProduct) => (
                      <SelectItem key={subProduct.name} value={subProduct.name}>
                        <div className="flex justify-between items-center w-full">
                          <span>{subProduct.name}</span>
                          <span className="font-semibold">
                            {formatCurrency(subProduct.price, 'USD')}
                          </span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {product.isIDBased && (
                <div className="space-y-4">
                  {product.idFields?.map((field, index) => (
                    <div key={index}>
                      <Label>{field.label}</Label>
                      <Input
                        placeholder={`Enter your ${field.label.toLowerCase()}`}
                        value={customFields[field.label] || ''}
                        onChange={(e) =>
                          setCustomFields({
                            ...customFields,
                            [field.label]: e.target.value,
                          })
                        }
                      />
                    </div>
                  ))}
                </div>
              )}

              {product.customFields.map((field) => (
                <div key={field.name}>
                  <Label>{field.label}</Label>
                  <Input
                    type={field.type}
                    placeholder={field.label}
                    required={field.required}
                    value={customFields[field.name] || ''}
                    onChange={(e) =>
                      setCustomFields({
                        ...customFields,
                        [field.name]: e.target.value,
                      })
                    }
                  />
                </div>
              ))}
            </div>

            {product.importantNote && (
              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{product.importantNote}</AlertDescription>
              </Alert>
            )}

            {selectedSubProduct && (
              <div className="bg-primary/5 p-4 rounded-lg">
                <div className="flex justify-between items-center">
                  <span className="text-lg">Total Price:</span>
                  <span className="text-2xl font-bold">
                    {formatCurrency(selectedSubProduct.price, 'USD')}
                  </span>
                </div>
              </div>
            )}

            <Button size="lg" className="w-full">
              <ShoppingCart className="w-5 h-5 mr-2" />
              Buy Now
            </Button>

            {product.guideEnabled && product.guide && (
              <div className="mt-8">
                <h3 className="text-lg font-semibold mb-2">How to Use</h3>
                <div className="prose dark:prose-invert max-w-none">
                  {product.guide}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}