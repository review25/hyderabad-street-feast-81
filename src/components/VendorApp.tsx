import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { ArrowLeft, Plus, Edit, Trash2, Clock, DollarSign, Package } from "lucide-react";
import { toast } from "sonner";

interface VendorAppProps {
  onBack: () => void;
}

interface MenuItem {
  id: string;
  name: string;
  price: number;
  description: string;
  category: string;
  available: boolean;
}

interface Order {
  id: string;
  customerName: string;
  items: { name: string; quantity: number; price: number }[];
  total: number;
  status: 'pending' | 'accepted' | 'preparing' | 'ready' | 'completed';
  orderTime: string;
}

const VendorApp = ({ onBack }: VendorAppProps) => {
  const [activeView, setActiveView] = useState<'dashboard' | 'menu' | 'orders'>('dashboard');
  const [menuItems, setMenuItems] = useState<MenuItem[]>([
    {
      id: "1",
      name: "Mirchi Bajji",
      price: 60,
      description: "Crispy fried green chilies stuffed with spiced potato filling",
      category: "Snacks",
      available: true
    },
    {
      id: "2",
      name: "Irani Chai",
      price: 25,
      description: "Traditional strong tea with milk, served hot",
      category: "Beverages", 
      available: true
    },
    {
      id: "3",
      name: "Boti Kebab",
      price: 180,
      description: "Succulent mutton pieces grilled to perfection",
      category: "Main Course",
      available: false
    }
  ]);

  const [orders, setOrders] = useState<Order[]>([
    {
      id: "1",
      customerName: "Rajesh Kumar",
      items: [
        { name: "Mirchi Bajji", quantity: 2, price: 60 },
        { name: "Irani Chai", quantity: 1, price: 25 }
      ],
      total: 145,
      status: 'pending',
      orderTime: "2:30 PM"
    },
    {
      id: "2", 
      customerName: "Priya Sharma",
      items: [
        { name: "Boti Kebab", quantity: 1, price: 180 }
      ],
      total: 180,
      status: 'preparing',
      orderTime: "2:15 PM"
    }
  ]);

  const toggleItemAvailability = (itemId: string) => {
    setMenuItems(menuItems.map(item => 
      item.id === itemId ? { ...item, available: !item.available } : item
    ));
    toast.success("Item availability updated");
  };

  const updateOrderStatus = (orderId: string, newStatus: Order['status']) => {
    setOrders(orders.map(order => 
      order.id === orderId ? { ...order, status: newStatus } : order
    ));
    toast.success(`Order ${newStatus}`);
  };

  const getStatusColor = (status: Order['status']) => {
    switch (status) {
      case 'pending': return 'bg-yellow-500';
      case 'accepted': return 'bg-blue-500';
      case 'preparing': return 'bg-orange-500';
      case 'ready': return 'bg-green-500';
      case 'completed': return 'bg-gray-500';
      default: return 'bg-gray-500';
    }
  };

  const getDashboardStats = () => {
    const todayOrders = orders.length;
    const todayRevenue = orders.reduce((sum, order) => sum + order.total, 0);
    const pendingOrders = orders.filter(order => order.status === 'pending').length;
    
    return { todayOrders, todayRevenue, pendingOrders };
  };

  const stats = getDashboardStats();

  if (activeView === 'orders') {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center mb-6">
            <Button variant="ghost" onClick={() => setActiveView('dashboard')} className="mr-4">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Dashboard
            </Button>
            <h1 className="text-2xl font-bold">Order Management</h1>
          </div>

          <div className="space-y-4">
            {orders.map((order) => (
              <Card key={order.id}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">Order #{order.id}</CardTitle>
                    <Badge className={getStatusColor(order.status)}>
                      {order.status.toUpperCase()}  
                    </Badge>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {order.customerName} • {order.orderTime}
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 mb-4">
                    {order.items.map((item, index) => (
                      <div key={index} className="flex justify-between text-sm">
                        <span>{item.quantity}x {item.name}</span>
                        <span>₹{item.price * item.quantity}</span>
                      </div>
                    ))}
                    <div className="border-t pt-2 flex justify-between font-semibold">
                      <span>Total</span>
                      <span>₹{order.total}</span>
                    </div>
                  </div>

                  <div className="flex space-x-2">
                    {order.status === 'pending' && (
                      <>
                        <Button size="sm" onClick={() => updateOrderStatus(order.id, 'accepted')}>
                          Accept
                        </Button>
                        <Button size="sm" variant="destructive">
                          Reject
                        </Button>
                      </>
                    )}
                    {order.status === 'accepted' && (
                      <Button size="sm" onClick={() => updateOrderStatus(order.id, 'preparing')}>
                        Start Preparing
                      </Button>
                    )}
                    {order.status === 'preparing' && (
                      <Button size="sm" onClick={() => updateOrderStatus(order.id, 'ready')}>
                        Mark Ready
                      </Button>
                    )}
                    {order.status === 'ready' && (
                      <Button size="sm" onClick={() => updateOrderStatus(order.id, 'completed')}>
                        Complete Order
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (activeView === 'menu') {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center">
              <Button variant="ghost" onClick={() => setActiveView('dashboard')} className="mr-4">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Dashboard
              </Button>
              <h1 className="text-2xl font-bold">Menu Management</h1>
            </div>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Add Item
            </Button>
          </div>

          <div className="grid gap-4">
            {menuItems.map((item) => (
              <Card key={item.id}>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center mb-2">
                        <h3 className="font-semibold text-lg mr-2">{item.name}</h3>
                        <Badge variant="secondary">{item.category}</Badge>
                        <Badge 
                          variant={item.available ? "default" : "destructive"}
                          className="ml-2"
                        >
                          {item.available ? "Available" : "Unavailable"}
                        </Badge>
                      </div>
                      <p className="text-muted-foreground text-sm mb-2">{item.description}</p>
                      <p className="font-semibold text-lg">₹{item.price}</p>
                    </div>
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center space-x-2">
                        <span className="text-sm">Available</span>
                        <Switch 
                          checked={item.available}
                          onCheckedChange={() => toggleItemAvailability(item.id)}
                        />
                      </div>
                      <Button variant="outline" size="sm">
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button variant="outline" size="sm">
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
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
            <h1 className="text-2xl font-bold">Vendor Dashboard</h1>
            <p className="text-muted-foreground">Manage your street food business</p>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Package className="w-8 h-8 text-primary mr-3" />
                <div>
                  <p className="text-2xl font-bold">{stats.todayOrders}</p>
                  <p className="text-sm text-muted-foreground">Orders Today</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <DollarSign className="w-8 h-8 text-food-secondary mr-3" />
                <div>
                  <p className="text-2xl font-bold">₹{stats.todayRevenue}</p>
                  <p className="text-sm text-muted-foreground">Revenue Today</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Clock className="w-8 h-8 text-warning mr-3" />
                <div>
                  <p className="text-2xl font-bold">{stats.pendingOrders}</p>
                  <p className="text-sm text-muted-foreground">Pending Orders</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="grid md:grid-cols-2 gap-6">
          <Card className="cursor-pointer hover:shadow-lg transition-shadow" onClick={() => setActiveView('orders')}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-semibold mb-2">Manage Orders</h3>
                  <p className="text-muted-foreground">Accept, prepare, and complete customer orders</p>
                </div>
                <Package className="w-12 h-12 text-primary" />
              </div>
            </CardContent>
          </Card>

          <Card className="cursor-pointer hover:shadow-lg transition-shadow" onClick={() => setActiveView('menu')}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-semibold mb-2">Menu Management</h3>
                  <p className="text-muted-foreground">Add, edit, and manage your food items</p>
                </div>
                <Edit className="w-12 h-12 text-food-secondary" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recent Orders */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Recent Orders</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {orders.slice(0, 3).map((order) => (
                <div key={order.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <p className="font-semibold">Order #{order.id}</p>
                    <p className="text-sm text-muted-foreground">{order.customerName} • ₹{order.total}</p>
                  </div>
                  <Badge className={getStatusColor(order.status)}>
                    {order.status.toUpperCase()}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default VendorApp;