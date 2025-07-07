import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Plus } from "lucide-react";

export type Lead = {
  id: string;
  name: string;
  email: string;
  phone: string;
  status: "New" | "Contacted";
  source: "Manual" | "Document";
  createdAt: Date;
};

interface LeadCreationFormProps {
  onLeadAdded: (lead: Lead) => void;
}

export const LeadCreationForm = ({ onLeadAdded }: LeadCreationFormProps) => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
  });
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.email) {
      toast({
        title: "Missing Information",
        description: "Please fill in at least name and email",
        variant: "destructive",
      });
      return;
    }

    const newLead: Lead = {
      id: Date.now().toString(),
      ...formData,
      status: "New",
      source: "Manual",
      createdAt: new Date(),
    };

    onLeadAdded(newLead);
    setFormData({ name: "", email: "", phone: "" });
    
    toast({
      title: "Lead Added Successfully",
      description: `${formData.name} has been added to your leads`,
    });
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <Card className="shadow-card hover:shadow-hover transition-all duration-300">
      <CardHeader className="bg-gradient-to-r from-card to-muted/30">
        <CardTitle className="flex items-center gap-2">
          <Plus className="h-5 w-5 text-primary" />
          Add New Lead
        </CardTitle>
        <CardDescription>
          Manually enter lead information to get started
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => handleInputChange("name", e.target.value)}
                placeholder="Enter full name"
                className="transition-all duration-200 focus:shadow-md"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email Address *</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange("email", e.target.value)}
                placeholder="Enter email address"
                className="transition-all duration-200 focus:shadow-md"
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="phone">Phone Number</Label>
            <Input
              id="phone"
              value={formData.phone}
              onChange={(e) => handleInputChange("phone", e.target.value)}
              placeholder="Enter phone number"
              className="transition-all duration-200 focus:shadow-md"
            />
          </div>
          <Button 
            type="submit" 
            className="w-full bg-gradient-to-r from-primary to-primary-glow hover:shadow-glow transition-all duration-300"
          >
            Add Lead
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};