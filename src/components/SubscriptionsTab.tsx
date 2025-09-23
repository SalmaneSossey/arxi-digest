import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "@/hooks/use-toast";
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
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Plus, Send, Pause, Play, Trash2, MessageCircle } from "lucide-react";
import NewSubscriptionModal from "./NewSubscriptionModal";

export interface Subscription {
  id: string;
  query: string;
  frequency: "daily" | "weekly";
  channel: "telegram";
  active: boolean;
  next_run_at?: string;
  created_at: string;
}

// Mock data for development
const MOCK_SUBSCRIPTIONS: Subscription[] = [
  {
    id: "sub_abc123",
    query: "vision transformer",
    frequency: "daily",
    channel: "telegram",
    active: true,
    next_run_at: "2025-09-24T09:00:00Z",
    created_at: "2025-09-23T12:00:00Z"
  },
  {
    id: "sub_def456",
    query: "retrieval augmented generation",
    frequency: "weekly", 
    channel: "telegram",
    active: true,
    next_run_at: "2025-09-27T09:00:00Z",
    created_at: "2025-09-23T12:05:00Z"
  }
];

const SubscriptionsTab = () => {
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [loading, setLoading] = useState(true);
  const [showNewSubscription, setShowNewSubscription] = useState(false);

  useEffect(() => {
    fetchSubscriptions();
  }, []);

  const fetchSubscriptions = async () => {
    try {
      setLoading(true);
      
      // Mock API call - replace with actual backend call
      // const response = await fetch('/backend/api/subscriptions?user_id=demo_user');
      
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      setSubscriptions(MOCK_SUBSCRIPTIONS);
    } catch (err) {
      toast({
        title: "Failed to load subscriptions",
        description: "Please try again later",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleToggleActive = async (id: string, active: boolean) => {
    try {
      // Mock API call
      // await fetch(`/backend/api/subscriptions/${id}?user_id=demo_user`, {
      //   method: 'PATCH',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ active })
      // });

      setSubscriptions(prev =>
        prev.map(sub => sub.id === id ? { ...sub, active } : sub)
      );

      toast({
        title: active ? "Subscription resumed" : "Subscription paused",
        description: `"${subscriptions.find(s => s.id === id)?.query}" subscription ${active ? 'resumed' : 'paused'}`,
      });
    } catch (err) {
      toast({
        title: "Update failed",
        description: "Please try again later",
        variant: "destructive",
      });
    }
  };

  const handleSendNow = async (subscription: Subscription) => {
    try {
      // Mock API call
      // const response = await fetch(`/backend/api/subscriptions/${subscription.id}/send_now?user_id=demo_user`, {
      //   method: 'POST'
      // });
      
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast({
        title: "Digest sent!",
        description: `Latest papers for "${subscription.query}" sent to Telegram`,
      });
    } catch (err) {
      toast({
        title: "Send failed", 
        description: "Please try again later",
        variant: "destructive",
      });
    }
  };

  const handleDelete = async (id: string) => {
    try {
      // Mock API call
      // await fetch(`/backend/api/subscriptions/${id}?user_id=demo_user`, {
      //   method: 'DELETE'
      // });

      setSubscriptions(prev => prev.filter(sub => sub.id !== id));
      
      toast({
        title: "Subscription deleted",
        description: "The subscription has been removed",
      });
    } catch (err) {
      toast({
        title: "Delete failed",
        description: "Please try again later", 
        variant: "destructive",
      });
    }
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return "Not scheduled";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const renderEmptyState = () => (
    <Card className="shadow-soft border-sky-light/20 bg-gradient-to-br from-cloud-white to-sky-light/10">
      <CardContent className="flex flex-col items-center justify-center py-16">
        <div className="w-16 h-16 bg-gradient-to-br from-sunset-pink/20 to-sunset-orange/20 rounded-full flex items-center justify-center mb-4 shadow-soft">
          <MessageCircle className="w-8 h-8 text-sunset-orange" />
        </div>
        <h3 className="text-lg font-semibold text-text-primary mb-2">
          No subscriptions yet
        </h3>
        <p className="text-text-secondary text-center mb-6 max-w-md">
          Create your first subscription to receive regular digests of the latest papers in your field.
        </p>
        <Button 
          onClick={() => setShowNewSubscription(true)}
          className="bg-gradient-to-r from-sky-blue to-sky-deep hover:from-sky-deep hover:to-sky-twilight transition-smooth shadow-soft hover:shadow-glow"
        >
          <Plus className="w-4 h-4 mr-2" />
          Create subscription
        </Button>
      </CardContent>
    </Card>
  );

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <div className="h-8 w-48 bg-academic-slate-100 rounded animate-pulse" />
          <div className="h-10 w-36 bg-academic-slate-100 rounded animate-pulse" />
        </div>
        <Card>
          <CardContent className="p-0">
            <div className="space-y-4 p-6">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="flex items-center justify-between">
                  <div className="space-y-2">
                    <div className="h-4 w-48 bg-academic-slate-100 rounded animate-pulse" />
                    <div className="h-3 w-32 bg-academic-slate-100 rounded animate-pulse" />
                  </div>
                  <div className="flex gap-2">
                    <div className="h-8 w-16 bg-academic-slate-100 rounded animate-pulse" />
                    <div className="h-8 w-16 bg-academic-slate-100 rounded animate-pulse" />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold text-academic-slate-900">
          Subscriptions
        </h2>
        <Button onClick={() => setShowNewSubscription(true)}>
          <Plus className="w-4 h-4 mr-2" />
          New subscription
        </Button>
      </div>

      {subscriptions.length === 0 ? (
        renderEmptyState()
      ) : (
        <Card className="shadow-card border-sky-light/20 bg-gradient-to-br from-cloud-white to-sky-light/10">
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow className="border-sky-light/20">
                  <TableHead className="text-text-primary font-medium">Topic</TableHead>
                  <TableHead className="text-text-primary font-medium">Frequency</TableHead>
                  <TableHead className="text-text-primary font-medium">Channel</TableHead>
                  <TableHead className="text-text-primary font-medium">Next Delivery</TableHead>
                  <TableHead className="text-text-primary font-medium">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {subscriptions.map((subscription) => (
                  <TableRow key={subscription.id} className="border-sky-light/20 hover:bg-sky-light/20 transition-smooth">
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-text-primary">
                          {subscription.query}
                        </span>
                        {!subscription.active && (
                          <Badge variant="secondary" className="text-xs bg-sunset-orange/20 text-sunset-orange border-sunset-orange/30">
                            Paused
                          </Badge>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge 
                        variant="outline" 
                        className="capitalize bg-gradient-to-r from-sky-light/50 to-accent/50 text-sky-deep border-sky-light/30"
                      >
                        {subscription.frequency}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <MessageCircle className="w-4 h-4 text-sky-deep" />
                        <span className="text-text-secondary capitalize">
                          {subscription.channel}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="text-text-secondary">
                      {subscription.active ? formatDate(subscription.next_run_at) : "Paused"}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleSendNow(subscription)}
                          className="flex items-center gap-1 border-sky-blue/50 text-sky-blue hover:bg-sky-blue/10 hover:border-sky-blue transition-smooth"
                        >
                          <Send className="w-3 h-3" />
                          Send now
                        </Button>
                        
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleToggleActive(subscription.id, !subscription.active)}
                          className="flex items-center gap-1 border-sky-twilight/50 text-sky-twilight hover:bg-sky-twilight/10 hover:border-sky-twilight transition-smooth"
                        >
                          {subscription.active ? (
                            <>
                              <Pause className="w-3 h-3" />
                              Pause
                            </>
                          ) : (
                            <>
                              <Play className="w-3 h-3" />
                              Resume
                            </>
                          )}
                        </Button>

                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button
                              variant="outline"
                              size="sm"
                              className="text-destructive hover:text-destructive hover:bg-destructive/5 border-destructive/30 hover:border-destructive/50 transition-smooth"
                            >
                              <Trash2 className="w-3 h-3" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent className="border-sky-light/30 bg-gradient-to-br from-cloud-white to-sky-light/10">
                            <AlertDialogHeader>
                              <AlertDialogTitle className="text-text-primary">Delete subscription</AlertDialogTitle>
                              <AlertDialogDescription className="text-text-secondary">
                                Are you sure you want to delete the subscription for "{subscription.query}"? 
                                This action cannot be undone.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel className="border-sky-light/50 text-text-secondary hover:bg-sky-light/20">
                                Cancel
                              </AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => handleDelete(subscription.id)}
                                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                              >
                                Delete
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}

      <NewSubscriptionModal 
        open={showNewSubscription}
        onOpenChange={setShowNewSubscription}
        onSuccess={() => {
          setShowNewSubscription(false);
          fetchSubscriptions();
        }}
      />
    </div>
  );
};

export default SubscriptionsTab;