import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Plus, Edit, Trash2, Search, Star, Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { VendorBottomNav } from "@/components/VendorBottomNav";
import { toast } from "sonner";

const VendorMenu = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [menuItems, setMenuItems] = useState([
    { id: "1", name: "Butter Chicken", price: 180, description: "Creamy tomato-based curry", category: "Main Course", popular: true, available: true, image: "" },
    { id: "2", name: "Paneer Tikka", price: 120, description: "Grilled cottage cheese", category: "Appetizer", popular: true, available: true, image: "" },
    { id: "3", name: "Dal Makhani", price: 140, description: "Creamy black lentils", category: "Main Course", popular: false, available: true, image: "" },
    { id: "4", name: "Naan Basket", price: 60, description: "Assorted fresh naans", category: "Bread", popular: false, available: false, image: "" },
    { id: "5", name: "Biryani", price: 250, description: "Fragrant basmati rice with spices", category: "Main Course", popular: true, available: true, image: "" },
    { id: "6", name: "Samosa", price: 30, description: "Crispy fried pastry", category: "Snack", popular: false, available: true, image: "" },
  ]);

  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<any>(null);

  const toggleAvailability = (id: string) => {
    setMenuItems(items =>
      items.map(item =>
        item.id === id ? { ...item, available: !item.available } : item
      )
    );
    toast.success("Availability updated");
  };

  const togglePopular = (id: string) => {
    setMenuItems(items =>
      items.map(item =>
        item.id === id ? { ...item, popular: !item.popular } : item
      )
    );
    toast.success("Popular status updated");
  };

  const handleDelete = (id: string) => {
    setMenuItems(items => items.filter(item => item.id !== id));
    toast.success("Item deleted");
  };

  const filteredItems = menuItems.filter(item =>
    item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const categories = ["All", "Main Course", "Appetizer", "Bread", "Snack", "Dessert"];

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-white border-b border-gray-100 shadow-sm">
        <div className="px-4 py-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <Button variant="ghost" size="icon" onClick={() => navigate("/vendor/home")}>
                <ArrowLeft className="w-5 h-5" />
              </Button>
              <h1 className="text-2xl font-bold text-gray-900">Menu Management</h1>
            </div>
            <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
              <DialogTrigger asChild>
                <Button size="sm" className="bg-primary hover:bg-primary/90">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Item
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add New Menu Item</DialogTitle>
                  <DialogDescription>Add a new item to your menu</DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label>Item Name</Label>
                    <Input placeholder="e.g., Butter Chicken" />
                  </div>
                  <div>
                    <Label>Price (₹)</Label>
                    <Input type="number" placeholder="180" />
                  </div>
                  <div>
                    <Label>Description</Label>
                    <Textarea placeholder="Describe your dish..." />
                  </div>
                  <div>
                    <Label>Category</Label>
                    <Input placeholder="Main Course" />
                  </div>
                  <Button className="w-full" onClick={() => {
                    setIsAddDialogOpen(false);
                    toast.success("Item added successfully");
                  }}>
                    Add Item
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <Input
              placeholder="Search menu items..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 rounded-xl"
            />
          </div>
        </div>
      </div>

      <div className="p-4 space-y-4">
        {/* Category Filter */}
        <div className="flex gap-2 overflow-x-auto pb-2">
          {categories.map((cat) => (
            <Badge
              key={cat}
              variant="secondary"
              className="whitespace-nowrap cursor-pointer hover:bg-primary hover:text-white"
            >
              {cat}
            </Badge>
          ))}
        </div>

        {/* Menu Items */}
        <div className="space-y-3">
          {filteredItems.map((item) => (
            <Card key={item.id} className="border-0 shadow-food-card rounded-xl">
              <div className="p-4">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-bold text-gray-900">{item.name}</h3>
                      {item.popular && (
                        <Badge variant="secondary" className="bg-orange-100 text-orange-700">
                          <Star className="w-3 h-3 mr-1 fill-orange-700" />
                          Popular
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm text-gray-600 mb-1">{item.description}</p>
                    <div className="flex items-center gap-2">
                      <p className="font-bold text-primary">₹{item.price}</p>
                      <Badge variant="outline" className="text-xs">{item.category}</Badge>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium text-gray-700">Available</span>
                      <Switch
                        checked={item.available}
                        onCheckedChange={() => toggleAvailability(item.id)}
                        className="data-[state=checked]:bg-green-500"
                      />
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium text-gray-700">Popular</span>
                      <Switch
                        checked={item.popular}
                        onCheckedChange={() => togglePopular(item.id)}
                      />
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button variant="ghost" size="icon" onClick={() => setEditingItem(item)}>
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDelete(item.id)}
                      className="text-red-500 hover:text-red-600"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {filteredItems.length === 0 && (
          <Card className="border-0 shadow-food-card rounded-xl p-8 text-center">
            <p className="text-gray-500">No items found</p>
          </Card>
        )}
      </div>

      <VendorBottomNav />
    </div>
  );
};

export default VendorMenu;

