
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "@/hooks/use-toast";
import { Save, Key } from "lucide-react";

const Settings = () => {
  const [isLoading, setIsLoading] = useState(false);
  
  const handleSaveSettings = () => {
    setIsLoading(true);
    
    // Simulate API call to save settings
    setTimeout(() => {
      setIsLoading(false);
      toast({
        title: "Settings saved",
        description: "Your settings have been updated successfully.",
      });
    }, 1000);
  };
  
  return (
    <div className="p-6 max-w-5xl mx-auto">
      <h1 className="text-3xl font-bold tracking-tight mb-6">Settings</h1>
      
      <Tabs defaultValue="integrations">
        <TabsList className="mb-4">
          <TabsTrigger value="integrations">Integrations</TabsTrigger>
          <TabsTrigger value="badge">Badge Settings</TabsTrigger>
          <TabsTrigger value="preferences">Preferences</TabsTrigger>
        </TabsList>
        
        <TabsContent value="integrations">
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>HubSpot Integration</CardTitle>
                <CardDescription>
                  Configure your HubSpot API connection to fetch student data.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4">
                  <div>
                    <Label htmlFor="hubspot-api-key">HubSpot API Key</Label>
                    <div className="flex mt-1.5">
                      <Input 
                        id="hubspot-api-key" 
                        type="password" 
                        placeholder="••••••••••••••••" 
                        className="flex-1"
                      />
                      <Button variant="outline" size="icon" className="ml-2">
                        <Key className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Connection Status</Label>
                      <p className="text-sm text-green-600">Connected</p>
                    </div>
                    <div>
                      <Button variant="outline" size="sm">Test Connection</Button>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <Label htmlFor="hubspot-auto-sync">Auto-sync with HubSpot</Label>
                    <Switch id="hubspot-auto-sync" defaultChecked />
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Salto Integration</CardTitle>
                <CardDescription>
                  Configure your Salto API connection for access management.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4">
                  <div>
                    <Label htmlFor="salto-api-endpoint">Salto API Endpoint</Label>
                    <Input 
                      id="salto-api-endpoint" 
                      placeholder="https://api.salto.io/v1/" 
                      className="mt-1.5"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="salto-api-key">Salto API Key</Label>
                    <div className="flex mt-1.5">
                      <Input 
                        id="salto-api-key" 
                        type="password" 
                        placeholder="••••••••••••••••" 
                        className="flex-1"
                      />
                      <Button variant="outline" size="icon" className="ml-2">
                        <Key className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Connection Status</Label>
                      <p className="text-sm text-green-600">Connected</p>
                    </div>
                    <div>
                      <Button variant="outline" size="sm">Test Connection</Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>MyCard NFC Integration</CardTitle>
                <CardDescription>
                  Configure your MyCard NFC reader settings.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="mycard-device-detection">Enable Device Auto-detection</Label>
                    <Switch id="mycard-device-detection" defaultChecked />
                  </div>
                  
                  <div>
                    <Label htmlFor="mycard-device-id">MyCard Device ID</Label>
                    <Input 
                      id="mycard-device-id" 
                      placeholder="MC-12345-NFC" 
                      className="mt-1.5" 
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Device Status</Label>
                      <p className="text-sm text-yellow-600">Not Detected</p>
                    </div>
                    <div>
                      <Button variant="outline" size="sm">Scan for Devices</Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="badge">
          <Card>
            <CardHeader>
              <CardTitle>Badge Design</CardTitle>
              <CardDescription>
                Configure the appearance and information displayed on student badges.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4">
                <div>
                  <Label htmlFor="badge-template">Badge Template</Label>
                  <select 
                    id="badge-template" 
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 mt-1.5"
                  >
                    <option value="standard">Standard Template</option>
                    <option value="premium">Premium Template</option>
                    <option value="faculty">Faculty Template</option>
                  </select>
                </div>
                
                <div>
                  <Label htmlFor="badge-logo">Upload Logo</Label>
                  <Input 
                    id="badge-logo" 
                    type="file"
                    className="mt-1.5" 
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <Label htmlFor="badge-show-expiry">Show Expiry Date</Label>
                  <Switch id="badge-show-expiry" defaultChecked />
                </div>
                
                <div className="flex items-center justify-between">
                  <Label htmlFor="badge-show-qr">Include QR Code</Label>
                  <Switch id="badge-show-qr" />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="preferences">
          <Card>
            <CardHeader>
              <CardTitle>User Preferences</CardTitle>
              <CardDescription>
                Customize your experience with Badgeflow.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4">
                <div className="flex items-center justify-between">
                  <Label htmlFor="pref-auto-save">Auto-save drafts</Label>
                  <Switch id="pref-auto-save" defaultChecked />
                </div>
                
                <div className="flex items-center justify-between">
                  <Label htmlFor="pref-notifications">Desktop notifications</Label>
                  <Switch id="pref-notifications" defaultChecked />
                </div>
                
                <div>
                  <Label htmlFor="pref-default-tab">Default view</Label>
                  <select 
                    id="pref-default-tab" 
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 mt-1.5"
                  >
                    <option value="dashboard">Dashboard</option>
                    <option value="students">Students</option>
                    <option value="badge-flow">Badge Flow</option>
                  </select>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      
      <div className="mt-6 flex justify-end">
        <Button onClick={handleSaveSettings} disabled={isLoading}>
          <Save className="h-4 w-4 mr-2" />
          {isLoading ? "Saving..." : "Save Settings"}
        </Button>
      </div>
    </div>
  );
};

export default Settings;
