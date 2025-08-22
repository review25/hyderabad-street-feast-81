import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, MapPin, Clock, Star, Plus, Minus, ShoppingCart } from "lucide-react";
import { toast } from "sonner";

interface CustomerAppProps {
  onBack: () => void;
}

interface MenuItem {
  id: string;
  name: string;
  price: number;
  description: string;
  image?: string;
  rating: number;
  category: string;
}

interface Vendor {
  id: string;
  name: string;
  rating: number;
  deliveryTime: string;
  category: string;
  image?: string;
}

interface CartItem extends MenuItem {
  quantity: number;
}

const CustomerApp = ({ onBack }: CustomerAppProps) => {
  const [selectedVendor, setSelectedVendor] = useState<Vendor | null>(null);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [activeView, setActiveView] = useState<'vendors' | 'menu' | 'cart' | 'tracking'>('vendors');

  // Sample data
  const vendors: Vendor[] = [
    {
      id: "1",
      name: "Charminar Street Food",
      rating: 4.5,
      deliveryTime: "25-30 min",
      category: "Hyderabadi Street Food"
    },
    {
      id: "2", 
      name: "Irani Chai Point",
      rating: 4.3,
      deliveryTime: "15-20 min",
      category: "Chai & Snacks"
    },
    {
      id: "3",
      name: "Boti Kebab Corner", 
      rating: 4.7,
      deliveryTime: "30-35 min",
      category: "Kebabs & Grills"
    }
  ];

  const menuItems: MenuItem[] = [
    {
      id: "1",
      name: "Mirchi Bajji",
      price: 60,
      description: "Crispy fried green chilies stuffed with spiced potato filling",
      rating: 4.4,
      category: "Snacks"
    },
    {
      id: "2", 
      name: "Irani Chai",
      price: 25,
      description: "Traditional strong tea with milk, served hot",
      rating: 4.6,
      category: "Beverages"
    },
    {
      id: "3",
      name: "Boti Kebab",
      price: 180,
      description: "Succulent mutton pieces grilled to perfection with aromatic spices",
      rating: 4.8,  
      category: "Main Course"
    },
    {
      id: "4",
      name: "Pani Puri",
      price: 40,
      description: "Crispy puris filled with spicy tangy water and chutneys",
      rating: 4.3,
      category: "Snacks"
    }
  ];

  const addToCart = (item: MenuItem) => {
    const existingItem = cart.find(cartItem => cartItem.id === item.id);
    if (existingItem) {
      setCart(cart.map(cartItem => 
        cartItem.id === item.id 
          ? { ...cartItem, quantity: cartItem.quantity + 1 }
          : cartItem
      ));
    } else {
      setCart([...cart, { ...item, quantity: 1 }]);
    }
    toast.success(`Added ${item.name} to cart`);
  };

  const removeFromCart = (itemId: string) => {
    const existingItem = cart.find(cartItem => cartItem.id === itemId);
    if (existingItem && existingItem.quantity > 1) {
      setCart(cart.map(cartItem => 
        cartItem.id === itemId 
          ? { ...cartItem, quantity: cartItem.quantity - 1 }
          : cartItem
      ));
    } else {
      setCart(cart.filter(cartItem => cartItem.id !== itemId));
    }
  };

  const getTotalPrice = () => {
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const getTotalItems = () => {
    return cart.reduce((total, item) => total + item.quantity, 0);
  };

  const placeOrder = () => {
    if (cart.length === 0) {
      toast.error("Your cart is empty!");
      return;
    }
    toast.success("Order placed successfully! Tracking your order...");
    setActiveView('tracking');
  };

  if (activeView === 'tracking') {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center mb-6">
            <Button variant="ghost" onClick={() => setActiveView('vendors')} className="mr-4">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Vendors
            </Button>
            <h1 className="text-2xl font-bold">Order Tracking</h1>
          </div>

          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center">
                <MapPin className="w-5 h-5 mr-2 text-primary" />
                Live Tracking
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center text-success">
                  <div className="w-4 h-4 bg-success rounded-full mr-3"></div>
                  Order Confirmed - 12:30 PM
                </div>
                <div className="flex items-center text-success">
                  <div className="w-4 h-4 bg-success rounded-full mr-3"></div>
                  Preparing Your Order - 12:35 PM
                </div>
                <div className="flex items-center text-primary">
                  <div className="w-4 h-4 bg-primary rounded-full mr-3 animate-pulse"></div>
                  On the Way - 12:45 PM
                </div>
                <div className="flex items-center text-muted-foreground">
                  <div className="w-4 h-4 bg-muted rounded-full mr-3"></div>
                  Delivered
                </div>
              </div>
              <div className="mt-6 p-4 bg-muted/50 rounded-lg">
                <p className="text-sm text-muted-foreground">Estimated delivery time: 5-10 minutes</p>
                <p className="text-sm font-medium">Delivery Partner: Rajesh Kumar</p>
                <p className="text-sm text-muted-foreground">Contact: +91 98765 43210</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (activeView === 'cart') {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center">
              <Button variant="ghost" onClick={() => setActiveView('menu')} className="mr-4">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Menu
              </Button>
              <h1 className="text-2xl font-bold">Your Cart</h1>
            </div>
          </div>

          {cart.length === 0 ? (
            <div className="text-center py-12">
              <ShoppingCart className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
              <p className="text-muted-foreground">Your cart is empty</p>
            </div>
          ) : (
            <>
              <div className="space-y-4 mb-6">
                {cart.map((item) => (
                  <Card key={item.id}>
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <h3 className="font-semibold">{item.name}</h3>
                          <p className="text-sm text-muted-foreground">₹{item.price} each</p>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Button size="sm" variant="outline" onClick={() => removeFromCart(item.id)}>
                            <Minus className="w-3 h-3" />
                          </Button>
                          <span className="w-8 text-center">{item.quantity}</span>
                          <Button size="sm" variant="outline" onClick={() => addToCart(item)}>
                            <Plus className="w-3 h-3" />
                          </Button>
                          <div className="ml-4">
                            <p className="font-semibold">₹{item.price * item.quantity}</p>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              <Card className="mb-6">
                <CardContent className="p-4">
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-semibold">Total: ₹{getTotalPrice()}</span>
                    <Button onClick={placeOrder} size="lg">
                      Place Order ({getTotalItems()} items)
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </>
          )}
        </div>
      </div>
    );
  }

  if (activeView === 'menu' && selectedVendor) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center">
              <Button variant="ghost" onClick={() => setActiveView('vendors')} className="mr-4">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Vendors
              </Button>
              <div>
                <h1 className="text-2xl font-bold">{selectedVendor.name}</h1>
                <div className="flex items-center mt-1">
                  <Star className="w-4 h-4 text-yellow-500 mr-1" />
                  <span className="text-sm">{selectedVendor.rating}</span>
                  <Clock className="w-4 h-4 text-muted-foreground ml-4 mr-1" />
                  <span className="text-sm text-muted-foreground">{selectedVendor.deliveryTime}</span>
                </div>
              </div>
            </div>
            {cart.length > 0 && (
              <Button onClick={() => setActiveView('cart')} className="relative">
                <ShoppingCart className="w-4 h-4 mr-2" />
                Cart ({getTotalItems()})
              </Button>
            )}
          </div>

          <div className="grid gap-4">
            {menuItems.map((item) => (
              <Card key={item.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-4">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center mb-2">
                        <h3 className="font-semibold text-lg mr-2">{item.name}</h3>
                        <Badge variant="secondary">{item.category}</Badge>
                      </div>
                      <p className="text-muted-foreground text-sm mb-2">{item.description}</p>
                      <div className="flex items-center">
                        <Star className="w-4 h-4 text-yellow-500 mr-1" />
                        <span className="text-sm mr-4">{item.rating}</span>
                        <span className="font-semibold text-lg">₹{item.price}</span>
                      </div>
                    </div>
                    <Button onClick={() => addToCart(item)} className="ml-4">
                      <Plus className="w-4 h-4 mr-2" />
                      Add
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-6">
        <div className="flex items-center mb-6">
          <Button variant="ghost" onClick={onBack} className="mr-4">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
          <div>
            <h1 className="text-2xl font-bold">Browse Vendors</h1>
            <p className="text-muted-foreground">Discover authentic Hyderabad street food</p>
          </div>
        </div>

        <div className="grid gap-4">
          {vendors.map((vendor) => (
            <Card 
              key={vendor.id} 
              className="hover:shadow-lg transition-shadow cursor-pointer"
              onClick={() => {
                setSelectedVendor(vendor);
                setActiveView('menu');
              }}
            >
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold mb-2">{vendor.name}</h3>
                    <p className="text-muted-foreground mb-3">{vendor.category}</p>
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center">
                        <Star className="w-4 h-4 text-yellow-500 mr-1" />
                        <span className="font-medium">{vendor.rating}</span>
                      </div>
                      <div className="flex items-center">
                        <Clock className="w-4 h-4 text-muted-foreground mr-1" />
                        <span className="text-muted-foreground">{vendor.deliveryTime}</span>
                      </div>
                      <div className="flex items-center">
                        <MapPin className="w-4 h-4 text-muted-foreground mr-1" />
                        <span className="text-muted-foreground">2.3 km</span>
                      </div>
                    </div>
                  </div>
                  <div className="ml-4">
                    <Button>View Menu</Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CustomerApp;