
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

const AppSettingsManager = () => {
  const [showPrices, setShowPrices] = useState(true);
  const [requireSecurityDeposit, setRequireSecurityDeposit] = useState(true);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const { data, error } = await supabase
        .from('app_settings')
        .select('setting_key, setting_value');

      if (error) throw error;

      data?.forEach(setting => {
        if (setting.setting_key === 'show_prices') {
          setShowPrices(setting.setting_value === 'true');
        }
        if (setting.setting_key === 'require_security_deposit') {
          setRequireSecurityDeposit(setting.setting_value === 'true');
        }
      });
    } catch (error) {
      console.error('Error fetching settings:', error);
    }
  };

  const updateSetting = async (key: string, value: string) => {
    setLoading(true);
    try {
      const { error } = await supabase
        .from('app_settings')
        .upsert({ setting_key: key, setting_value: value });

      if (error) throw error;

      toast({
        title: "Setting updated successfully"
      });
    } catch (error) {
      console.error('Error updating setting:', error);
      toast({
        title: "Error updating setting",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="bg-slate-900 border-gray-700">
      <CardHeader>
        <CardTitle className="text-white">App Settings</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label className="text-white">Show Prices</Label>
            <p className="text-sm text-gray-400">Display prices in booking and rental forms</p>
          </div>
          <Switch
            checked={showPrices}
            onCheckedChange={(checked) => {
              setShowPrices(checked);
              updateSetting('show_prices', checked.toString());
            }}
            disabled={loading}
          />
        </div>

        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label className="text-white">Require Security Deposit</Label>
            <p className="text-sm text-gray-400">Require security deposit for rental services</p>
          </div>
          <Switch
            checked={requireSecurityDeposit}
            onCheckedChange={(checked) => {
              setRequireSecurityDeposit(checked);
              updateSetting('require_security_deposit', checked.toString());
            }}
            disabled={loading}
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default AppSettingsManager;
