import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { Plus, Upload, FileText } from "lucide-react";

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
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
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

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Check file type
    const allowedTypes = ['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
    if (!allowedTypes.includes(file.type)) {
      toast({
        title: "Invalid File Type",
        description: "Please upload a PDF or DOCX file",
        variant: "destructive",
      });
      return;
    }

    setUploadedFile(file);
    setIsProcessing(true);

    // Simulate AI processing
    setTimeout(() => {
      // Mock extracted data
      const extractedData = {
        name: "John Doe",
        email: "john.doe@example.com",
        phone: "+1 (555) 123-4567",
      };

      setFormData(extractedData);
      setIsProcessing(false);

      toast({
        title: "File Processed",
        description: "Lead information extracted successfully! Please review and submit.",
      });
    }, 2000);
  };

  const handleDocumentSubmit = () => {
    if (!uploadedFile) return;

    const newLead: Lead = {
      id: Date.now().toString(),
      ...formData,
      status: "New",
      source: "Document",
      createdAt: new Date(),
    };

    onLeadAdded(newLead);
    setFormData({ name: "", email: "", phone: "" });
    setUploadedFile(null);
    
    toast({
      title: "Lead Added Successfully",
      description: `${formData.name} has been added to your leads from document`,
    });
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
      <CardContent className="pt-6 space-y-6">
        {/* Manual Entry Form */}
        <div>
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Plus className="h-4 w-4" />
            Manual Entry
          </h3>
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
              Add Lead Manually
            </Button>
          </form>
        </div>

        <Separator className="my-6" />

        {/* Document Upload Section */}
        <div>
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <FileText className="h-4 w-4" />
            Upload Document
          </h3>
          <div className="space-y-4">
            <div className="border-2 border-dashed border-muted rounded-lg p-6 text-center hover:border-primary/50 transition-colors">
              <Upload className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
              <Label htmlFor="file-upload" className="cursor-pointer">
                <span className="text-sm font-medium">Upload PDF or DOCX</span>
                <br />
                <span className="text-xs text-muted-foreground">AI will extract lead information automatically</span>
              </Label>
              <Input
                id="file-upload"
                type="file"
                accept=".pdf,.docx"
                onChange={handleFileUpload}
                className="hidden"
              />
            </div>

            {uploadedFile && (
              <div className="bg-muted/30 p-4 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <FileText className="h-4 w-4 text-primary" />
                  <span className="text-sm font-medium">{uploadedFile.name}</span>
                </div>
                {isProcessing ? (
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <div className="animate-spin h-3 w-3 border border-primary border-t-transparent rounded-full"></div>
                    Processing document...
                  </div>
                ) : (
                  <div className="space-y-2">
                    <p className="text-sm text-success">✓ Document processed successfully</p>
                    <Button 
                      onClick={handleDocumentSubmit}
                      className="w-full bg-gradient-to-r from-success to-success-foreground hover:shadow-glow transition-all duration-300"
                    >
                      Add Lead from Document
                    </Button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
