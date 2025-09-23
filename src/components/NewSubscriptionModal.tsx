import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { toast } from "@/hooks/use-toast";
import { MessageCircle, Link as LinkIcon } from "lucide-react";
import LinkTelegramModal from "./LinkTelegramModal";

interface NewSubscriptionModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
  prefillTopic?: string;
}

const NewSubscriptionModal = ({
  open,
  onOpenChange,
  onSuccess,
  prefillTopic = "",
}: NewSubscriptionModalProps) => {
  const [topic, setTopic] = useState(prefillTopic);
  const [frequency, setFrequency] = useState<"daily" | "weekly">("daily");
  const [submitting, setSubmitting] = useState(false);
  const [showLinkTelegram, setShowLinkTelegram] = useState(false);
  const [telegramLinked, setTelegramLinked] = useState(false); // Mock state

  // Reset form when modal opens/closes
  React.useEffect(() => {
    if (open) {
      setTopic(prefillTopic);
      setFrequency("daily");
      setSubmitting(false);
    }
  }, [open, prefillTopic]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!topic.trim()) {
      toast({
        title: "Topic required",
        description: "Please enter a topic to subscribe to",
        variant: "destructive",
      });
      return;
    }

    if (!telegramLinked) {
      setShowLinkTelegram(true);
      return;
    }

    try {
      setSubmitting(true);

      // Mock API call - replace with actual backend call
      // const response = await fetch('/backend/api/subscriptions?user_id=demo_user', {
      //   method: 'POST',
      //   headers: {
      //     'Content-Type': 'application/json',
      //   },
      //   body: JSON.stringify({
      //     query: topic.trim(),
      //     frequency,
      //     channel: 'telegram'
      //   })
      // });

      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 1000));

      toast({
        title: "Subscription created!",
        description: `You'll receive ${frequency} digests for "${topic}"`,
      });

      onSuccess();
    } catch (err) {
      toast({
        title: "Failed to create subscription",
        description: "Please try again later",
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-academic-slate-900">New Subscription</DialogTitle>
            <DialogDescription className="text-academic-slate-600">
              Create a subscription to receive regular digests of the latest papers.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="topic" className="text-academic-slate-900 font-medium">
                Topic
              </Label>
              <Input
                id="topic"
                placeholder="e.g., vision transformer, RAG, diffusion"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                className="border-academic-slate-600/20 focus:border-primary"
              />
            </div>

            <div className="space-y-3">
              <Label className="text-academic-slate-900 font-medium">Frequency</Label>
              <RadioGroup value={frequency} onValueChange={(value: "daily" | "weekly") => setFrequency(value)}>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="daily" id="daily" />
                  <Label htmlFor="daily" className="font-normal cursor-pointer">
                    Daily - Every morning
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="weekly" id="weekly" />
                  <Label htmlFor="weekly" className="font-normal cursor-pointer">
                    Weekly - Monday mornings
                  </Label>
                </div>
              </RadioGroup>
            </div>

            <div className="space-y-2">
              <Label className="text-academic-slate-900 font-medium">Channel</Label>
              <div className="p-3 border border-academic-slate-600/20 rounded-md bg-academic-indigo-50/50">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <MessageCircle className="w-4 h-4 text-academic-indigo-600" />
                    <span className="text-sm text-academic-slate-900">Telegram</span>
                    {telegramLinked && (
                      <span className="text-xs text-green-600 bg-green-100 px-2 py-1 rounded">
                        Linked
                      </span>
                    )}
                  </div>
                  {!telegramLinked && (
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => setShowLinkTelegram(true)}
                      className="text-xs"
                    >
                      <LinkIcon className="w-3 h-3 mr-1" />
                      Link
                    </Button>
                  )}
                </div>
                {!telegramLinked && (
                  <p className="text-xs text-academic-slate-600 mt-1">
                    Link your Telegram account to receive digests
                  </p>
                )}
              </div>
            </div>

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                disabled={submitting}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={submitting}>
                {submitting ? "Creating..." : "Create subscription"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <LinkTelegramModal
        open={showLinkTelegram}
        onOpenChange={setShowLinkTelegram}
        onSuccess={() => {
          setTelegramLinked(true);
          setShowLinkTelegram(false);
          toast({
            title: "Telegram linked!",
            description: "You can now create subscriptions",
          });
        }}
      />
    </>
  );
};

export default NewSubscriptionModal;