import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, MapPin, Navigation, Phone, Clock, Package, DollarSign, CheckCircle } from "lucide-react";
import { toast } from "sonner";

interface DeliveryAppProps {
  onBack: () => void;
}

interface DeliveryTask {
  id: string;
  orderId: string;
  customerName: string;
  customerPhone: string;
  pickupAddress: string;
  deliveryAddress: string;
  items: { name: string; quantity: number }[];
  amount: number;
  distance: string;
  estimatedTime: string;
  status: 'available' | 'accepted' | 'picked_up' | 'delivered';
  pickupTime?: string;
  deliveryTime?: string;
}

const DeliveryApp = ({ onBack }: DeliveryAppProps) => {
  const [activeView, setActiveView] = useState<'dashboard' | 'available' | 'active' | 'earnings'>('dashboard');
  const [isOnline, setIsOnline] = useState(true);
  
  const [tasks, setTasks] = useState<DeliveryTask[]>([
    {
      id: "1",
      orderId: "ORD001",
      customerName: "Rajesh Kumar",
      customerPhone: "+91 98765 43210",
      pickupAddress: "Charminar Street Food, Charminar Road",
      deliveryAddress: "Flat 301, Greenfield Apartments, Banjara Hills",
      items: [
        { name: "Mirchi Bajji", quantity: 2 },
        { name: "Irani Chai", quantity: 1 }
      ],
      amount: 145,
      distance: "3.2 km",
      estimatedTime: "15 min",
      status: 'available'
    },
    {
      id: "2",
      orderId: "ORD002", 
      customerName: "Priya Sharma",
      customerPhone: "+91 87654 32109",
      pickupAddress: "Boti Kebab Corner, Jubilee Hills",
      deliveryAddress: "Office Complex, HITEC City",
      items: [
        { name: "Boti Kebab", quantity: 1 }
      ],
      amount: 180,
      distance: "4.5 km", 
      estimatedTime: "20 min",
      status: 'accepted',
      pickupTime: "2:45 PM"
    }
  ]);

  const acceptTask = (taskId: string) => {
    setTasks(tasks.map(task => 
      task.id === taskId ? { ...task, status: 'accepted', pickupTime: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) } : task
    ));
    toast.success("Task accepted! Navigate to pickup location.");
  };

  const updateTaskStatus = (taskId: string, newStatus: DeliveryTask['status']) => {
    setTasks(tasks.map(task => {
      if (task.id === taskId) {
        const updatedTask = { ...task, status: newStatus };
        if (newStatus === 'picked_up') {
          updatedTask.pickupTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        } else if (newStatus === 'delivered') {
          updatedTask.deliveryTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        }
        return updatedTask;
      }
      return task;
    }));
    
    const statusMessages = {
      picked_up: "Order picked up! Navigate to delivery location.",
      delivered: "Order delivered successfully!"
    };
    
    toast.success(statusMessages[newStatus as keyof typeof statusMessages]);
  };

  const getStatusColor = (status: DeliveryTask['status']) => {
    switch (status) {
      case 'available': return 'bg-blue-500';
      case 'accepted': return 'bg-yellow-500';
      case 'picked_up': return 'bg-orange-500';
      case 'delivered': return 'bg-green-500';
      default: return 'bg-gray-500';
    }
  };

  const getDashboardStats = () => {
    const todayTasks = tasks.filter(task => task.status === 'delivered').length;
    const todayEarnings = tasks.filter(task => task.status === 'delivered').reduce((sum, task) => sum + (task.amount * 0.1), 0);
    const activeTasks = tasks.filter(task => task.status === 'accepted' || task.status === 'picked_up').length;
    
    return { todayTasks, todayEarnings: Math.round(todayEarnings), activeTasks };
  };

  const stats = getDashboardStats();

  if (activeView === 'active') {
    const activeTasks = tasks.filter(task => task.status === 'accepted' || task.status === 'picked_up');
    
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center mb-6">
            <Button variant="ghost" onClick={() => setActiveView('dashboard')} className="mr-4">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Dashboard
            </Button>
            <h1 className="text-2xl font-bold">Active Deliveries</h1>
          </div>

          {activeTasks.length === 0 ? (
            <div className="text-center py-12">
              <Package className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
              <p className="text-muted-foreground">No active deliveries</p>
            </div>
          ) : (
            <div className="space-y-4">
              {activeTasks.map((task) => (
                <Card key={task.id}>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg">Order #{task.orderId}</CardTitle>
                      <Badge className={getStatusColor(task.status)}>
                        {task.status.replace('_', ' ').toUpperCase()}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    {/* Customer Info */}
                    <div className="mb-4 p-4 bg-muted/50 rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-semibold">{task.customerName}</h4>
                        <Button size="sm" variant="outline">
                          <Phone className="w-4 h-4 mr-2" />
                          Call
                        </Button>
                      </div>
                      <p className="text-sm text-muted-foreground">{task.customerPhone}</p>
                    </div>

                    {/* Addresses */}
                    <div className="space-y-3 mb-4">
                      <div className="flex items-start">
                        <MapPin className="w-5 h-5 text-primary mt-0.5 mr-3" />
                        <div>
                          <p className="font-medium text-sm">Pickup</p>
                          <p className="text-sm text-muted-foreground">{task.pickupAddress}</p>
                        </div>
                      </div>
                      <div className="flex items-start">
                        <MapPin className="w-5 h-5 text-success mt-0.5 mr-3" />
                        <div>
                          <p className="font-medium text-sm">Delivery</p>
                          <p className="text-sm text-muted-foreground">{task.deliveryAddress}</p>
                        </div>
                      </div>
                    </div>

                    {/* Items */}
                    <div className="mb-4">
                      <p className="font-medium text-sm mb-2">Items:</p>
                      <div className="text-sm text-muted-foreground">
                        {task.items.map((item, index) => (
                          <span key={index}>
                            {item.quantity}x {item.name}
                            {index < task.items.length - 1 ? ', ' : ''}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex space-x-2">
                      <Button variant="outline" className="flex-1">
                        <Navigation className="w-4 h-4 mr-2" />
                        Navigate
                      </Button>
                      
                      {task.status === 'accepted' && (
                        <Button 
                          className="flex-1"
                          onClick={() => updateTaskStatus(task.id, 'picked_up')}
                        >
                          Mark Picked Up
                        </Button>
                      )}
                      
                      {task.status === 'picked_up' && (
                        <Button 
                          className="flex-1"
                          onClick={() => updateTaskStatus(task.id, 'delivered')}
                        >
                          Mark Delivered
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  }

  if (activeView === 'available') {
    const availableTasks = tasks.filter(task => task.status === 'available');
    
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center mb-6">
            <Button variant="ghost" onClick={() => setActiveView('dashboard')} className="mr-4">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Dashboard
            </Button>
            <h1 className="text-2xl font-bold">Available Tasks</h1>
          </div>

          {!isOnline && (
            <Card className="mb-6 border-warning">
              <CardContent className="p-4">
                <p className="text-warning font-medium">You're offline. Go online to see available delivery tasks.</p>
              </CardContent>
            </Card>
          )}

          {availableTasks.length === 0 ? (
            <div className="text-center py-12">
              <Package className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
              <p className="text-muted-foreground">No available tasks at the moment</p>
            </div>
          ) : (
            <div className="space-y-4">
              {availableTasks.map((task) => (
                <Card key={task.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="font-semibold text-lg mb-1">Order #{task.orderId}</h3>
                        <div className="flex items-center text-sm text-muted-foreground">
                          <MapPin className="w-4 h-4 mr-1" />
                          <span>{task.distance}</span>
                          <Clock className="w-4 h-4 ml-4 mr-1" />
                          <span>{task.estimatedTime}</span>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-lg">₹{Math.round(task.amount * 0.1)}</p>
                        <p className="text-sm text-muted-foreground">Delivery Fee</p>
                      </div>
                    </div>

                    <div className="space-y-2 mb-4">
                      <div className="text-sm">
                        <span className="font-medium">Pickup: </span>
                        <span className="text-muted-foreground">{task.pickupAddress}</span>
                      </div>
                      <div className="text-sm">
                        <span className="font-medium">Delivery: </span>
                        <span className="text-muted-foreground">{task.deliveryAddress}</span>
                      </div>
                    </div>

                    <Button 
                      className="w-full" 
                      onClick={() => acceptTask(task.id)}
                      disabled={!isOnline}
                    >
                      Accept Task
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center">
            <Button variant="ghost" onClick={onBack} className="mr-4">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
            <div>
              <h1 className="text-2xl font-bold">Delivery Dashboard</h1>
              <p className="text-muted-foreground">Manage your delivery tasks and earnings</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-sm">{isOnline ? 'Online' : 'Offline'}</span>
            <div 
              className={`w-3 h-3 rounded-full ${isOnline ? 'bg-green-500' : 'bg-red-500'}`}
              onClick={() => setIsOnline(!isOnline)}
            />
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <CheckCircle className="w-8 h-8 text-success mr-3" />
                <div>
                  <p className="text-2xl font-bold">{stats.todayTasks}</p>
                  <p className="text-sm text-muted-foreground">Completed Today</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <DollarSign className="w-8 h-8 text-food-secondary mr-3" />
                <div>
                  <p className="text-2xl font-bold">₹{stats.todayEarnings}</p>
                  <p className="text-sm text-muted-foreground">Earnings Today</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Package className="w-8 h-8 text-primary mr-3" />
                <div>
                  <p className="text-2xl font-bold">{stats.activeTasks}</p>
                  <p className="text-sm text-muted-foreground">Active Tasks</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="grid md:grid-cols-2 gap-6">
          <Card 
            className="cursor-pointer hover:shadow-lg transition-shadow" 
            onClick={() => setActiveView('available')}
          >
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-semibold mb-2">Available Tasks</h3>
                  <p className="text-muted-foreground">Browse and accept new delivery tasks</p>
                </div>
                <Package className="w-12 h-12 text-primary" />
              </div>
            </CardContent>
          </Card>

          <Card 
            className="cursor-pointer hover:shadow-lg transition-shadow"
            onClick={() => setActiveView('active')}
          >
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-semibold mb-2">Active Deliveries</h3>
                  <p className="text-muted-foreground">Track and complete your current tasks</p>
                  {stats.activeTasks > 0 && (
                    <Badge className="mt-2">{stats.activeTasks} Active</Badge>
                  )}
                </div>
                <Navigation className="w-12 h-12 text-success" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recent Activity */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {tasks.filter(task => task.status !== 'available').slice(0, 3).map((task) => (
                <div key={task.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <p className="font-semibold">Order #{task.orderId}</p>
                    <p className="text-sm text-muted-foreground">
                      {task.customerName} • {task.distance} • ₹{Math.round(task.amount * 0.1)}
                    </p>
                  </div>
                  <Badge className={getStatusColor(task.status)}>
                    {task.status.replace('_', ' ').toUpperCase()}
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

export default DeliveryApp;