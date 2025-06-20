
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface PaymentConfig {
  id: string;
  provider: string;
  public_key: string | null;
  secret_key: string | null;
  enabled: boolean;
}

const PaymentSettingsManager = () => {
  const [stripeConfig, setStripeConfig] = useState<PaymentConfig | null>(null);
  const [paystackConfig, setPaystackConfig] = useState<PaymentConfig | null>(null);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchPaymentConfigs();
  }, []);

  const fetchPaymentConfigs = async () => {
    try {
      const { data, error } = await supabase
        .from('payment_config')
        .select('*');

      if (error) throw error;

      const stripe = data?.find(config => config.provider === 'stripe');
      const paystack = data?.find(config => config.provider === 'paystack');

      setStripeConfig(stripe || null);
      setPaystackConfig(paystack || null);
    } catch (error) {
      console.error('Error fetching payment configs:', error);
    }
  };

  const saveConfig = async (provider: string, publicKey: string, secretKey: string, enabled: boolean) => {
    setLoading(true);
    try {
      const { error } = await supabase
        .from('payment_config')
        .upsert({
          provider,
          public_key: publicKey,
          secret_key: secretKey,
          enabled
        });

      if (error) throw error;

      toast({
        title: `${provider} configuration saved successfully`
      });

      fetchPaymentConfigs();
    } catch (error) {
      console.error('Error saving payment config:', error);
      toast({
        title: "Error saving configuration",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const PaymentConfigForm = ({ 
    provider, 
    config, 
    onSave 
  }: { 
    provider: string; 
    config: PaymentConfig | null; 
    onSave: (publicKey: string, secretKey: string, enabled: boolean) => void;
  }) => {
    const [publicKey, setPublicKey] = useState(config?.public_key || '');
    const [secretKey, setSecretKey] = useState(config?.secret_key || '');
    const [enabled, setEnabled] = useState(config?.enabled || false);

    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <Label className="text-white">Enable {provider}</Label>
          <Switch
            checked={enabled}
            onCheckedChange={setEnabled}
          />
        </div>

        <div className="space-y-2">
          <Label className="text-white">Public Key</Label>
          <Input
            value={publicKey}
            onChange={(e) => setPublicKey(e.target.value)}
            placeholder={`Enter ${provider} public key`}
            className="bg-gray-800 border-gray-600 text-white"
          />
        </div>

        <div className="space-y-2">
          <Label className="text-white">Secret Key</Label>
          <Input
            type="password"
            value={secretKey}
            onChange={(e) => setSecretKey(e.target.value)}
            placeholder={`Enter ${provider} secret key`}
            className="bg-gray-800 border-gray-600 text-white"
          />
        </div>

        <Button
          onClick={() => onSave(publicKey, secretKey, enabled)}
          disabled={loading}
          className="w-full"
        >
          Save {provider} Configuration
        </Button>
      </div>
    );
  };

  return (
    <Card className="bg-slate-900 border-gray-700">
      <CardHeader>
        <CardTitle className="text-white">Payment Settings</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="stripe" className="w-full">
          <TabsList className="grid w-full grid-cols-2 bg-slate-800">
            <TabsTrigger value="stripe" className="text-white">Stripe</TabsTrigger>
            <TabsTrigger value="paystack" className="text-white">Paystack</TabsTrigger>
          </TabsList>

          <TabsContent value="stripe" className="mt-6">
            <PaymentConfigForm
              provider="Stripe"
              config={stripeConfig}
              onSave={(publicKey, secretKey, enabled) => 
                saveConfig('stripe', publicKey, secretKey, enabled)
              }
            />
          </TabsContent>

          <TabsContent value="paystack" className="mt-6">
            <PaymentConfigForm
              provider="Paystack"
              config={paystackConfig}
              onSave={(publicKey, secretKey, enabled) => 
                saveConfig('paystack', publicKey, secretKey, enabled)
              }
            />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default PaymentSettingsManager;
