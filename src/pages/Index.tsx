import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ShoppingBag, Store, Truck, MapPin } from "lucide-react";
import CustomerApp from "@/components/CustomerApp";
import VendorApp from "@/components/VendorApp";
import DeliveryApp from "@/components/DeliveryApp";

type UserRole = 'customer' | 'vendor' | 'delivery' | null;

const Index = () => {
  const [userRole, setUserRole] = useState<UserRole>(null);

  if (userRole === 'customer') {
    return <CustomerApp onBack={() => setUserRole(null)} />;
  }

  if (userRole === 'vendor') {
    return <VendorApp onBack={() => setUserRole(null)} />;
  }

  if (userRole === 'delivery') {
    return <DeliveryApp onBack={() => setUserRole(null)} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-food-accent/10 to-food-secondary/20">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-4">
            <MapPin className="w-8 h-8 text-primary mr-2" />
            <h1 className="text-4xl font-bold text-foreground">RV FOOD QUARTER</h1>
          </div>
          <p className="text-xl text-muted-foreground mb-2">Hyderabad Street Food Delivery</p>
          <p className="text-muted-foreground">Authentic flavors, delivered fresh to your doorstep</p>
        </div>

        {/* Role Selection Cards */}
        <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
          <Card 
            className="hover:shadow-lg transition-all duration-300 cursor-pointer group hover:scale-105 border-2 hover:border-primary/50"
            onClick={() => setUserRole('customer')}
          >
            <CardContent className="p-8 text-center">
              <div className="bg-primary/10 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:bg-primary/20 transition-colors">
                <ShoppingBag className="w-10 h-10 text-primary" />
              </div>
              <h3 className="text-2xl font-semibold mb-4 text-foreground">Customer</h3>
              <p className="text-muted-foreground mb-6">
                Browse menus, place orders, and track your favorite Hyderabad street food
              </p>
              <Button className="w-full" size="lg">
                Order Food
              </Button>
              <div className="mt-4 text-sm text-muted-foreground">
                • Browse local vendors
                • Real-time tracking
                • Order history
              </div>
            </CardContent>
          </Card>

          <Card 
            className="hover:shadow-lg transition-all duration-300 cursor-pointer group hover:scale-105 border-2 hover:border-primary/50"
            onClick={() => setUserRole('vendor')}
          >
            <CardContent className="p-8 text-center">
              <div className="bg-food-secondary/20 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:bg-food-secondary/30 transition-colors">
                <Store className="w-10 h-10 text-food-secondary" />
              </div>
              <h3 className="text-2xl font-semibold mb-4 text-foreground">Vendor</h3>
              <p className="text-muted-foreground mb-6">
                Manage your menu, accept orders, and grow your street food business
              </p>
              <Button variant="secondary" className="w-full" size="lg">
                Manage Store
              </Button>
              <div className="mt-4 text-sm text-muted-foreground">
                • Menu management
                • Order processing
                • Business analytics
              </div>
            </CardContent>
          </Card>

          <Card 
            className="hover:shadow-lg transition-all duration-300 cursor-pointer group hover:scale-105 border-2 hover:border-primary/50"
            onClick={() => setUserRole('delivery')}
          >
            <CardContent className="p-8 text-center">
              <div className="bg-success/20 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:bg-success/30 transition-colors">
                <Truck className="w-10 h-10 text-success" />
              </div>
              <h3 className="text-2xl font-semibold mb-4 text-foreground">Delivery Partner</h3>
              <p className="text-muted-foreground mb-6">
                Accept delivery tasks, navigate efficiently, and earn money
              </p>
              <Button 
                variant="outline" 
                className="w-full border-success text-success hover:bg-success hover:text-success-foreground" 
                size="lg"
              >
                Start Delivering
              </Button>
              <div className="mt-4 text-sm text-muted-foreground">
                • Task management
                • GPS navigation
                • Earnings tracking
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Features */}
        <div className="mt-16 text-center">
          <h2 className="text-2xl font-semibold mb-8 text-foreground">Why Choose RV Food Quarter?</h2>
          <div className="grid md:grid-cols-3 gap-8 max-w-3xl mx-auto">
            <div className="text-center">
              <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <MapPin className="w-8 h-8 text-primary" />
              </div>
              <h3 className="font-semibold mb-2 text-foreground">Live Tracking</h3>
              <p className="text-sm text-muted-foreground">Track your order in real-time from kitchen to doorstep</p>
            </div>
            <div className="text-center">
              <div className="bg-food-secondary/20 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Store className="w-8 h-8 text-food-secondary" />
              </div>
              <h3 className="font-semibold mb-2 text-foreground">Local Vendors</h3>
              <p className="text-sm text-muted-foreground">Support local Hyderabad street food vendors</p>
            </div>
            <div className="text-center">
              <div className="bg-success/20 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Truck className="w-8 h-8 text-success" />
              </div>
              <h3 className="font-semibold mb-2 text-foreground">Fast Delivery</h3>
              <p className="text-sm text-muted-foreground">Quick and reliable delivery to your location</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;