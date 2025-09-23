import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import HeaderBar from "@/components/HeaderBar";
import DiscoverTab from "@/components/DiscoverTab";
import SubscriptionsTab from "@/components/SubscriptionsTab";
import NewSubscriptionModal from "@/components/NewSubscriptionModal";
import { Paper } from "@/components/PaperCard";
import { toast } from "@/hooks/use-toast";

const Index = () => {
  const [showNewSubscription, setShowNewSubscription] = useState(false);
  const [subscriptionTopic, setSubscriptionTopic] = useState("");

  const handleSubscribeFromPaper = (query: string) => {
    setSubscriptionTopic(query);
    setShowNewSubscription(true);
  };

  const handleSendToTelegram = (paper: Paper) => {
    // Mock Telegram send - replace with actual logic
    toast({
      title: "Sent to Telegram!",
      description: `"${paper.title}" has been sent to your Telegram`,
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <HeaderBar />
      
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-7xl mx-auto">
          {/* Hero Section */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-academic-slate-900 mb-4">
              Discover Latest Academic Papers
            </h1>
            <p className="text-lg text-academic-slate-600 max-w-2xl mx-auto">
              Stay up-to-date with cutting-edge research from arXiv. Search papers, 
              create subscriptions, and receive curated digests directly in Telegram.
            </p>
          </div>

          {/* Main Tabs */}
          <Tabs defaultValue="discover" className="w-full">
            <TabsList className="grid w-full grid-cols-2 max-w-md mx-auto mb-8 bg-academic-slate-100">
              <TabsTrigger 
                value="discover" 
                className="data-[state=active]:bg-background data-[state=active]:text-academic-slate-900 text-academic-slate-600"
              >
                Discover
              </TabsTrigger>
              <TabsTrigger 
                value="subscriptions"
                className="data-[state=active]:bg-background data-[state=active]:text-academic-slate-900 text-academic-slate-600"
              >
                Subscriptions
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="discover" className="mt-0">
              <DiscoverTab 
                onSubscribe={handleSubscribeFromPaper}
                onSendToTelegram={handleSendToTelegram}
              />
            </TabsContent>
            
            <TabsContent value="subscriptions" className="mt-0">
              <SubscriptionsTab />
            </TabsContent>
          </Tabs>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-academic-slate-600/10 mt-16">
        <div className="container mx-auto px-4 py-6">
          <div className="text-center text-sm text-academic-slate-600">
            ScholarBrief v1.0.0 • Academic paper discovery platform
          </div>
        </div>
      </footer>

      {/* New Subscription Modal */}
      <NewSubscriptionModal
        open={showNewSubscription}
        onOpenChange={setShowNewSubscription}
        onSuccess={() => {
          setShowNewSubscription(false);
          setSubscriptionTopic("");
          toast({
            title: "Subscription created!",
            description: "You'll start receiving paper digests soon",
          });
        }}
        prefillTopic={subscriptionTopic}
      />
    </div>
  );
};

export default Index;