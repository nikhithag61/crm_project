import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Lead } from "./LeadCreationForm";

interface LeadInteractionModalProps {
  lead: Lead;
  isOpen: boolean;
  onClose: () => void;
}

type ChatMessage = {
  id: string;
  text: string;
  sender: "user" | "ai";
  timestamp: Date;
};

export const LeadInteractionModal = ({ lead, isOpen, onClose }: LeadInteractionModalProps) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "1",
      text: `Hi! I'm your AI assistant. I can help you with suggestions for following up with ${lead.name}. What would you like to know?`,
      sender: "ai",
      timestamp: new Date(),
    }
  ]);
  const [inputMessage, setInputMessage] = useState("");

  const mockAIResponses = [
    `Based on ${lead.name}'s profile, I suggest sending a personalized email highlighting your key value propositions.`,
    `Consider reaching out via ${lead.phone ? 'phone call' : 'email'} within the next 24-48 hours for optimal engagement.`,
    `${lead.name} appears to be a ${lead.status === 'New' ? 'fresh' : 'previously contacted'} lead. Here's my recommended approach...`,
    `I notice this lead came from ${lead.source.toLowerCase()} entry. This suggests they might be more engaged if contacted soon.`,
    `For leads like ${lead.name}, try mentioning specific pain points related to their industry or role.`,
  ];

  const handleSendMessage = () => {
    if (!inputMessage.trim()) return;

    // Add user message
    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      text: inputMessage,
      sender: "user",
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);

    // Simulate AI response
    setTimeout(() => {
      const aiResponse: ChatMessage = {
        id: (Date.now() + 1).toString(),
        text: mockAIResponses[Math.floor(Math.random() * mockAIResponses.length)],
        sender: "ai",
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, aiResponse]);
    }, 1000);

    setInputMessage("");
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl h-[80vh] flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <span>AI Lead Assistant</span>
            <div className="flex gap-2">
              <Badge variant="outline">{lead.source}</Badge>
              <Badge variant={lead.status === "New" ? "default" : "secondary"}>
                {lead.status}
              </Badge>
            </div>
          </DialogTitle>
          <DialogDescription>
            Get AI-powered suggestions for interacting with {lead.name}
          </DialogDescription>
        </DialogHeader>

        {/* Lead Info Card */}
        <Card className="mb-4">
          <CardContent className="p-4">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="font-medium text-muted-foreground">Name:</span>
                <p className="font-medium">{lead.name}</p>
              </div>
              <div>
                <span className="font-medium text-muted-foreground">Email:</span>
                <p className="font-medium">{lead.email}</p>
              </div>
              <div>
                <span className="font-medium text-muted-foreground">Phone:</span>
                <p className="font-medium">{lead.phone || 'Not provided'}</p>
              </div>
              <div>
                <span className="font-medium text-muted-foreground">Added:</span>
                <p className="font-medium">{lead.createdAt.toLocaleDateString()}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Chat Area */}
        <ScrollArea className="flex-1 border rounded-md p-4 mb-4">
          <div className="space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.sender === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[80%] p-3 rounded-lg ${
                    message.sender === "user"
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted"
                  }`}
                >
                  <p className="text-sm">{message.text}</p>
                  <p className="text-xs opacity-70 mt-1">
                    {message.timestamp.toLocaleTimeString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>

        {/* Input Area */}
        <div className="flex gap-2">
          <Input
            placeholder="Ask me anything about this lead..."
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            className="flex-1"
          />
          <Button 
            onClick={handleSendMessage}
            disabled={!inputMessage.trim()}
            className="bg-gradient-to-r from-primary to-primary-glow"
          >
            Send
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};