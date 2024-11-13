'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Plus, Trash2, Upload } from 'lucide-react';
import { ProductCategory, ProductPopularity } from '@/types/product';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

export default function AddProductButton() {
  const [open, setOpen] = useState(false);
  const [customFields, setCustomFields] = useState<Array<{ name: string; type: string; required: boolean; label: string }>>([]);
  const [subProducts, setSubProducts] = useState<Array<{ name: string; price: number; originalPrice: number; inStock: boolean }>>([]);
  const [isIDBased, setIsIDBased] = useState(false);
  const [idFields, setIdFields] = useState<Array<{ label: string }>>([]);
  const [loading, setLoading] = useState(false);
  const [imagePreview, setImagePreview] = useState('');

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const formData = new FormData(e.currentTarget);
      const productData = {
        title: formData.get('title'),
        description: formData.get('description'),
        guide: formData.get('guide'),
        guideEnabled: formData.get('guideEnabled') === 'true',
        imageUrl: imagePreview || formData.get('imageUrl'),
        region: formData.get('region'),
        instantDelivery: formData.get('instantDelivery') === 'true',
        importantNote: formData.get('importantNote'),
        customFields,
        subProducts,
        isIDBased,
        idFields: isIDBased ? idFields : [],
        category: formData.get('category'),
        popularity: formData.get('popularity'),
        countryCode: formData.get('countryCode'),
        displayOrder: parseInt(formData.get('displayOrder') as string) || 0,
      };

      const response = await fetch('/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(productData),
      });

      if (!response.ok) throw new Error('Failed to create product');

      setOpen(false);
      resetForm();
    } catch (error) {
      console.error('Error creating product:', error);
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setCustomFields([]);
    setSubProducts([]);
    setIsIDBased(false);
    setIdFields([]);
    setImagePreview('');
  };

  const addCustomField = () => {
    setCustomFields([...customFields, { name: '', type: 'text', required: false, label: '' }]);
  };

  const addSubProduct = () => {
    setSubProducts([...subProducts, { name: '', price: 0, originalPrice: 0, inStock: true }]);
  };

  const addIdField = () => {
    setIdFields([...idFields, { label: '' }]);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Add Product
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Add New Gaming Product</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information */}
          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <Label htmlFor="title">Product Title</Label>
                <Input required id="title" name="title" placeholder="e.g., Mobile Legends Diamonds" />
              </div>
              
              <div>
                <Label htmlFor="category">Category</Label>
                <Select name="category" required>
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.values(ProductCategory).map((category) => (
                      <SelectItem key={category} value={category}>
                        {category.replace(/_/g, ' ')}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="popularity">Popularity Status</Label>
                <Select name="popularity" defaultValue={ProductPopularity.REGULAR}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.values(ProductPopularity).map((status) => (
                      <SelectItem key={status} value={status}>
                        <div className="flex items-center">
                          <Badge variant="outline" className={cn(
                            status === ProductPopularity.FEATURED && "bg-yellow-100 text-yellow-800",
                            status === ProductPopularity.TRENDING && "bg-blue-100 text-blue-800",
                            status === ProductPopularity.NEW && "bg-green-100 text-green-800"
                          )}>
                            {status}
                          </Badge>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <Label>Product Image</Label>
                <div className="mt-2 flex justify-center rounded-lg border border-dashed border-gray-900/25 px-6 py-10">
                  <div className="text-center">
                    {imagePreview ? (
                      <div className="relative w-40 h-40 mx-auto">
                        <img
                          src={imagePreview}
                          alt="Preview"
                          className="object-cover rounded-lg"
                        />
                        <Button
                          type="button"
                          variant="destructive"
                          size="sm"
                          className="absolute -top-2 -right-2"
                          onClick={() => setImagePreview('')}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        <div className="flex justify-center">
                          <Upload className="h-12 w-12 text-gray-300" />
                        </div>
                        <div className="flex flex-col text-sm text-gray-600">
                          <label
                            htmlFor="image-upload"
                            className="relative cursor-pointer rounded-md bg-white font-semibold text-primary hover:text-primary/80"
                          >
                            <span>Upload a file</span>
                            <input
                              id="image-upload"
                              name="image"
                              type="file"
                              accept="image/*"
                              className="sr-only"
                              onChange={handleImageUpload}
                            />
                          </label>
                          <p className="text-xs">or drag and drop</p>
                        </div>
                        <p className="text-xs text-gray-600">
                          PNG, JPG, GIF up to 5MB
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Description and Details */}
          <div className="space-y-4">
            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea
                required
                id="description"
                name="description"
                placeholder="Detailed description of the product..."
                className="h-32"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="region">Region</Label>
                <Input required id="region" name="region" placeholder="e.g., Global, SEA, NA" />
              </div>
              <div>
                <Label htmlFor="countryCode">Country Code</Label>
                <Input required id="countryCode" name="countryCode" placeholder="e.g., US, SG, MY" />
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <Switch id="instantDelivery" name="instantDelivery" />
              <Label htmlFor="instantDelivery">Instant Delivery Available</Label>
            </div>

            <div className="flex items-center space-x-2">
              <Switch
                id="isIDBased"
                checked={isIDBased}
                onCheckedChange={setIsIDBased}
              />
              <Label htmlFor="isIDBased">ID-Based Product</Label>
            </div>
          </div>

          {/* Sub-Products */}
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <Label>Product Variants</Label>
              <Button type="button" variant="outline" size="sm" onClick={addSubProduct}>
                <Plus className="h-4 w-4 mr-2" />
                Add Variant
              </Button>
            </div>
            <div className="space-y-4">
              {subProducts.map((_, index) => (
                <div key={index} className="grid grid-cols-4 gap-4 items-end bg-gray-50 p-4 rounded-lg">
                  <div>
                    <Label>Variant Name</Label>
                    <Input
                      placeholder="e.g., 100 Diamonds"
                      value={subProducts[index].name}
                      onChange={(e) => {
                        const updated = [...subProducts];
                        updated[index].name = e.target.value;
                        setSubProducts(updated);
                      }}
                    />
                  </div>
                  <div>
                    <Label>Selling Price</Label>
                    <Input
                      type="number"
                      placeholder="Selling price"
                      value={subProducts[index].price}
                      onChange={(e) => {
                        const updated = [...subProducts];
                        updated[index].price = parseFloat(e.target.value);
                        setSubProducts(updated);
                      }}
                    />
                  </div>
                  <div>
                    <Label>Cost Price</Label>
                    <Input
                      type="number"
                      placeholder="Your cost"
                      value={subProducts[index].originalPrice}
                      onChange={(e) => {
                        const updated = [...subProducts];
                        updated[index].originalPrice = parseFloat(e.target.value);
                        setSubProducts(updated);
                      }}
                    />
                  </div>
                  <Button
                    type="button"
                    variant="destructive"
                    onClick={() => {
                      const updated = subProducts.filter((_, i) => i !== index);
                      setSubProducts(updated);
                    }}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          </div>

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? 'Creating Product...' : 'Create Product'}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}