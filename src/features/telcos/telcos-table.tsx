"use client";

import { useState } from "react";
import { MoreHorizontal, Plus, Trash2, Edit, Play } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useTelcos, useSelectedTelco } from "./hooks";
import { TelcoManagement } from "@/sdk/types";
import { CreateTelcoForm } from "./create-telco-form";
import { useToast } from "@/hooks/use-toast";

export function TelcosTable() {
  const { telcos, loading, deleteTelco, testTelco } = useTelcos();
  const { selectTelco } = useSelectedTelco();
  const { toast } = useToast();
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [testingId, setTestingId] = useState<string | null>(null);

  const handleDelete = async (telco: TelcoManagement) => {
    if (window.confirm(`Are you sure you want to delete "${telco.name}" configuration?`)) {
      try {
        await deleteTelco(telco.uuid);
        toast({
          title: "Success",
          description: "Telco configuration deleted successfully",
        });
      } catch {
        toast({
          title: "Error",
          description: "Failed to delete telco configuration",
          variant: "destructive",
        });
      }
    }
  };

  const handleTest = async (telco: TelcoManagement) => {
    setTestingId(telco.uuid);
    try {
      const result = await testTelco(telco.uuid);
      toast({
        title: result.success ? "Test Successful" : "Test Failed",
        description: `${result.message} (${result.responseTime}ms)`,
        variant: result.success ? "default" : "destructive",
      });
    } catch {
      toast({
        title: "Test Failed",
        description: "Failed to test telco configuration",
        variant: "destructive",
      });
    } finally {
      setTestingId(null);
    }
  };

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case "ACTIVE":
        return "default";
      case "INACTIVE":
        return "secondary";
      case "MAINTENANCE":
        return "outline";
      case "TESTING":
        return "destructive";
      default:
        return "outline";
    }
  };

  const getTelcoBadgeColor = (telco: string) => {
    const colors = {
      MTN: "bg-yellow-100 text-yellow-800",
      VODAFONE: "bg-red-100 text-red-800",
      AIRTEL: "bg-red-100 text-red-800",
      TIGO: "bg-blue-100 text-blue-800",
      ORANGE: "bg-orange-100 text-orange-800"
    };
    return colors[telco as keyof typeof colors] || "bg-gray-100 text-gray-800";
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Telco Configurations</h3>
        <Button onClick={() => setShowCreateDialog(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Add Telco Config
        </Button>
      </div>

      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Telco</TableHead>
              <TableHead>API URL</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Active</TableHead>
              <TableHead>Created At</TableHead>
              <TableHead className="w-[50px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {telcos.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-12 text-muted-foreground">
                  No telco configurations found
                </TableCell>
              </TableRow>
            ) : (
              telcos.map((telco) => (
                <TableRow key={telco.uuid}>
                  <TableCell className="font-medium">{telco.name}</TableCell>
                  <TableCell>
                    <Badge className={getTelcoBadgeColor(telco.telco)}>
                      {telco.telco}
                    </Badge>
                  </TableCell>
                  <TableCell className="truncate max-w-xs">{telco.apiUrl}</TableCell>
                  <TableCell>
                    <Badge variant={getStatusBadgeVariant(telco.status)}>
                      {telco.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant={telco.isActive ? "default" : "secondary"}>
                      {telco.isActive ? "Yes" : "No"}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {new Date(telco.createdAt).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          onClick={() => handleTest(telco)}
                          disabled={testingId === telco.uuid}
                        >
                          <Play className="h-4 w-4 mr-2" />
                          {testingId === telco.uuid ? "Testing..." : "Test"}
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => {
                            selectTelco(telco);
                          }}
                        >
                          <Edit className="h-4 w-4 mr-2" />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          onClick={() => handleDelete(telco)}
                          className="text-red-600"
                        >
                          <Trash2 className="h-4 w-4 mr-2" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Create Telco Configuration</DialogTitle>
            <DialogDescription>
              Configure a new mobile network operator API connection.
            </DialogDescription>
          </DialogHeader>
          <CreateTelcoForm onSuccess={() => setShowCreateDialog(false)} />
        </DialogContent>
      </Dialog>
    </div>
  );
}