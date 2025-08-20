"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  BookOpen, 
  MessageCircle, 
  Phone, 
  Mail, 
  FileText, 
  Users,
  Search,
  ExternalLink
} from "lucide-react";

export default function HelpPage() {
  const helpCategories = [
    {
      title: "Getting Started",
      description: "Learn the basics of using Blupay",
      icon: BookOpen,
      items: [
        "Account Setup",
        "First Transaction",
        "Dashboard Overview",
        "User Roles",
      ]
    },
    {
      title: "Transactions",
      description: "Understanding transaction processing",
      icon: FileText,
      items: [
        "Processing Payments",
        "Transaction Status",
        "Refunds & Reversals",
        "Transaction Fees",
      ]
    },
    {
      title: "Merchants",
      description: "Managing merchant accounts",
      icon: Users,
      items: [
        "Adding Merchants",
        "Merchant Settings",
        "KYC Requirements",
        "Account Verification",
      ]
    }
  ];

  const contactOptions = [
    {
      title: "Live Chat",
      description: "Chat with our support team",
      icon: MessageCircle,
      action: "Start Chat",
      available: "24/7"
    },
    {
      title: "Phone Support",
      description: "Call our support hotline",
      icon: Phone,
      action: "+1 (555) 123-4567",
      available: "Mon-Fri 9AM-6PM"
    },
    {
      title: "Email Support",
      description: "Send us an email",
      icon: Mail,
      action: "support@blupay.africa",
      available: "Response within 24h"
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Help & Support</h1>
          <p className="text-muted-foreground">
            Find answers to your questions and get help when you need it
          </p>
        </div>
      </div>

      {/* Search */}
      <Card>
        <CardContent className="pt-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search for help articles..."
              className="pl-9"
            />
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <div className="grid gap-4 md:grid-cols-3">
        {contactOptions.map((option, index) => (
          <Card key={index} className="cursor-pointer hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center space-y-0 pb-2">
              <option.icon className="h-5 w-5 text-blue-600 mr-3" />
              <div className="flex-1">
                <CardTitle className="text-base">{option.title}</CardTitle>
                <CardDescription className="text-sm">
                  {option.description}
                </CardDescription>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-sm">{option.action}</p>
                  <p className="text-xs text-muted-foreground">{option.available}</p>
                </div>
                <ExternalLink className="h-4 w-4 text-muted-foreground" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Help Categories */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {helpCategories.map((category, index) => (
          <Card key={index}>
            <CardHeader>
              <div className="flex items-center space-x-2">
                <category.icon className="h-5 w-5 text-blue-600" />
                <CardTitle className="text-lg">{category.title}</CardTitle>
              </div>
              <CardDescription>{category.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {category.items.map((item, itemIndex) => (
                  <li key={itemIndex} className="text-sm hover:text-blue-600 cursor-pointer">
                    {item}
                  </li>
                ))}
              </ul>
              <Button variant="outline" size="sm" className="w-full mt-4">
                View All Articles
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* FAQ Section */}
      <Card>
        <CardHeader>
          <CardTitle>Frequently Asked Questions</CardTitle>
          <CardDescription>
            Quick answers to common questions
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="border-b pb-4">
              <h4 className="font-medium mb-2">How do I reset my password?</h4>
              <p className="text-sm text-muted-foreground">
                You can reset your password by clicking the &quot;Forgot Password&quot; link on the login page.
              </p>
            </div>
            <div className="border-b pb-4">
              <h4 className="font-medium mb-2">How long do transactions take to process?</h4>
              <p className="text-sm text-muted-foreground">
                Most transactions are processed instantly, but some may take up to 24 hours depending on the payment method.
              </p>
            </div>
            <div className="border-b pb-4">
              <h4 className="font-medium mb-2">What are the transaction fees?</h4>
              <p className="text-sm text-muted-foreground">
                Transaction fees vary based on your merchant agreement and payment method. Check your dashboard for detailed fee information.
              </p>
            </div>
            <div>
              <h4 className="font-medium mb-2">How do I add a new merchant?</h4>
              <p className="text-sm text-muted-foreground">
                Navigate to the Merchants page and click &quot;Add Merchant&quot;. Fill in the required information and submit for approval.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* System Status */}
      <Card>
        <CardHeader>
          <CardTitle>System Status</CardTitle>
          <CardDescription>
            Current status of Blupay services
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm">Payment Processing</span>
              <div className="flex items-center space-x-2">
                <div className="h-2 w-2 bg-green-500 rounded-full"></div>
                <span className="text-sm text-green-600">Operational</span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">API Services</span>
              <div className="flex items-center space-x-2">
                <div className="h-2 w-2 bg-green-500 rounded-full"></div>
                <span className="text-sm text-green-600">Operational</span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">Dashboard</span>
              <div className="flex items-center space-x-2">
                <div className="h-2 w-2 bg-green-500 rounded-full"></div>
                <span className="text-sm text-green-600">Operational</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}