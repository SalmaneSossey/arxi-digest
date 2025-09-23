import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { toast } from "@/hooks/use-toast";
import { MessageCircle, ExternalLink, CheckCircle, Loader2 } from "lucide-react";

interface LinkTelegramModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

const LinkTelegramModal = ({ open, onOpenChange, onSuccess }: LinkTelegramModalProps) => {
  const [step, setStep] = useState<"generating" | "waiting" | "success">("generating");
  const [code, setCode] = useState("");
  const [timeLeft, setTimeLeft] = useState(60);

  useEffect(() => {
    if (open) {
      startLinkingProcess();
    } else {
      // Reset state when modal closes
      setStep("generating");
      setCode("");
      setTimeLeft(60);
    }
  }, [open]);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    let statusInterval: NodeJS.Timeout;

    if (step === "waiting" && timeLeft > 0) {
      // Countdown timer
      interval = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            setStep("generating");
            startLinkingProcess();
            return 60;
          }
          return prev - 1;
        });
      }, 1000);

      // Poll status every 2 seconds
      statusInterval = setInterval(checkLinkStatus, 2000);
    }

    return () => {
      if (interval) clearInterval(interval);
      if (statusInterval) clearInterval(statusInterval);
    };
  }, [step, timeLeft, code]);

  const startLinkingProcess = async () => {
    try {
      setStep("generating");
      
      // Mock API call - replace with actual backend call
      // const response = await fetch('/backend/api/telegram/link/start?user_id=demo_user', {
      //   method: 'POST'
      // });
      // const data = await response.json();
      
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock response
      const mockCode = Math.random().toString(36).substring(2, 8).toUpperCase();
      setCode(mockCode);
      setStep("waiting");
      setTimeLeft(60);
      
    } catch (err) {
      toast({
        title: "Failed to generate code", 
        description: "Please try again later",
        variant: "destructive",
      });
      onOpenChange(false);
    }
  };

  const checkLinkStatus = async () => {
    if (!code) return;
    
    try {
      // Mock API call - replace with actual backend call
      // const response = await fetch(`/backend/api/telegram/link/status?code=${code}`);
      // const data = await response.json();
      
      // Simulate random success (20% chance each check)
      const isLinked = Math.random() < 0.2;
      
      if (isLinked) {
        setStep("success");
        setTimeout(() => {
          onSuccess();
        }, 2000);
      }
    } catch (err) {
      // Silently handle errors in polling
      console.error("Status check failed:", err);
    }
  };

  const openTelegram = () => {
    // Replace with your actual bot username
    const botUsername = "ScholarBriefBot";
    const telegramUrl = `https://t.me/${botUsername}?start=${code}`;
    window.open(telegramUrl, "_blank");
  };

  const renderContent = () => {
    switch (step) {
      case "generating":
        return (
          <div className="text-center py-8">
            <div className="w-16 h-16 bg-academic-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Loader2 className="w-8 h-8 text-academic-indigo-600 animate-spin" />
            </div>
            <h3 className="text-lg font-semibold text-academic-slate-900 mb-2">
              Generating link code...
            </h3>
            <p className="text-academic-slate-600">
              Please wait while we prepare your Telegram link.
            </p>
          </div>
        );

      case "waiting":
        return (
          <div className="text-center py-6">
            <div className="w-16 h-16 bg-academic-indigo-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <MessageCircle className="w-8 h-8 text-academic-indigo-600" />
            </div>
            
            <h3 className="text-lg font-semibold text-academic-slate-900 mb-2">
              Link your Telegram account
            </h3>
            
            <div className="bg-academic-slate-50 rounded-lg p-6 mb-6">
              <p className="text-sm text-academic-slate-600 mb-4">
                Send this code to our Telegram bot:
              </p>
              <div className="text-3xl font-mono font-bold text-academic-slate-900 tracking-wider mb-4">
                {code}
              </div>
              <Button onClick={openTelegram} className="w-full">
                <ExternalLink className="w-4 h-4 mr-2" />
                Open Telegram
              </Button>
            </div>

            <div className="text-center">
              <p className="text-sm text-academic-slate-600 mb-2">
                Waiting for you to link your account...
              </p>
              <p className="text-xs text-academic-slate-500">
                Time remaining: {timeLeft}s
              </p>
            </div>
          </div>
        );

      case "success":
        return (
          <div className="text-center py-8">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
            <h3 className="text-lg font-semibold text-academic-slate-900 mb-2">
              Successfully linked!
            </h3>
            <p className="text-academic-slate-600">
              Your Telegram account is now connected. You can create subscriptions and receive digests.
            </p>
          </div>
        );
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-academic-slate-900">Link Telegram</DialogTitle>
          <DialogDescription className="text-academic-slate-600">
            Connect your Telegram account to receive paper digests.
          </DialogDescription>
        </DialogHeader>

        {renderContent()}

        {step === "waiting" && (
          <div className="flex justify-center pt-4">
            <Button
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default LinkTelegramModal;