import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Users, CreditCard, CheckCircle, AlertCircle, User, Camera, Printer } from "lucide-react";
import { Link } from "react-router-dom";

const DashboardCard = ({ title, value, description, icon: Icon, color }: { 
  title: string, 
  value: string | number, 
  description: string, 
  icon: any,
  color: string
}) => {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <div className={`p-2 rounded-full ${color}`}>
          <Icon className="h-4 w-4 text-white" />
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        <p className="text-xs text-muted-foreground">{description}</p>
      </CardContent>
    </Card>
  );
};

const RecentActivity = () => {
  const activities = [
    { id: 1, student: "Jane Smith", action: "Badge printed", timestamp: "10 minutes ago", status: "success" },
    { id: 2, student: "John Doe", action: "Profile updated", timestamp: "25 minutes ago", status: "success" },
    { id: 3, student: "Sarah Johnson", action: "Waiting for photo", timestamp: "1 hour ago", status: "pending" },
    { id: 4, student: "Michael Brown", action: "NFC encoding failed", timestamp: "2 hours ago", status: "error" },
  ];

  return (
    <div className="space-y-4">
      {activities.map((activity) => (
        <div key={activity.id} className="flex items-center justify-between p-2 border rounded">
          <div>
            <p className="font-medium">{activity.student}</p>
            <p className="text-sm text-muted-foreground">{activity.action}</p>
          </div>
          <div className="flex items-center gap-2">
            {activity.status === "success" && <CheckCircle className="h-4 w-4 text-badgeflow-success" />}
            {activity.status === "pending" && <AlertCircle className="h-4 w-4 text-badgeflow-warning" />}
            {activity.status === "error" && <AlertCircle className="h-4 w-4 text-badgeflow-error" />}
            <span className="text-xs text-muted-foreground">{activity.timestamp}</span>
          </div>
        </div>
      ))}
    </div>
  );
};

const Index = () => {
  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="mb-12 animate-fade-in">
        <h1 className="text-3xl font-bold tracking-tight mb-8">Badge Issuance Flow</h1>
        <div className="flex items-center justify-between mb-6">
          <div className="flex-1 flex items-center justify-between max-w-3xl mx-auto relative">
            <div className="flex flex-col items-center">
              <div className="w-16 h-16 rounded-full bg-badgeflow-accent flex items-center justify-center shadow-md">
                <User className="h-8 w-8 text-white" />
              </div>
              <span className="text-xs mt-2 text-gray-600">Student</span>
            </div>
            
            <div className="hidden md:block w-full h-0.5 bg-gray-200 absolute" style={{ top: '2rem' }} />
            
            <div className="flex flex-col items-center">
              <div className="w-16 h-16 rounded-full bg-gray-100 border-2 border-gray-200 flex items-center justify-center shadow-sm">
                <Camera className="h-8 w-8 text-gray-400" />
              </div>
              <span className="text-xs mt-2 text-gray-600">Photo</span>
            </div>
            
            <div className="flex flex-col items-center">
              <div className="w-16 h-16 rounded-full bg-gray-100 border-2 border-gray-200 flex items-center justify-center shadow-sm">
                <Printer className="h-8 w-8 text-gray-400" />
              </div>
              <span className="text-xs mt-2 text-gray-600">Print</span>
            </div>
            
            <div className="flex flex-col items-center">
              <div className="w-16 h-16 rounded-full bg-gray-100 border-2 border-gray-200 flex items-center justify-center shadow-sm">
                <CreditCard className="h-8 w-8 text-gray-400" />
              </div>
              <span className="text-xs mt-2 text-gray-600">Encode</span>
            </div>
            
            <div className="flex flex-col items-center">
              <div className="w-16 h-16 rounded-full bg-gray-100 border-2 border-gray-200 flex items-center justify-center shadow-sm">
                <CheckCircle className="h-8 w-8 text-gray-400" />
              </div>
              <span className="text-xs mt-2 text-gray-600">Complete</span>
            </div>
          </div>
        </div>
        <div className="text-center mt-8">
          <Link to="/badge-flow">
            <Button size="lg" className="bg-badgeflow-accent hover:bg-badgeflow-accent/90 text-white font-medium gap-2 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-0.5">
              <CreditCard className="h-5 w-5" />
              Start New Badge Process
            </Button>
          </Link>
        </div>
      </div>

      <div className="mb-8">
        <h2 className="text-2xl font-bold tracking-tight mb-6">Dashboard Overview</h2>
        <div className="grid gap-4 md:grid-cols-3 mb-6">
          <DashboardCard 
            title="Total Students" 
            value="248" 
            description="Registered in HubSpot" 
            icon={Users}
            color="bg-badgeflow-accent" 
          />
          <DashboardCard 
            title="Badges Issued" 
            value="186" 
            description="Last 30 days" 
            icon={CreditCard}
            color="bg-badgeflow-success" 
          />
          <DashboardCard 
            title="Pending Photos" 
            value="12" 
            description="Waiting for capture" 
            icon={AlertCircle}
            color="bg-badgeflow-warning" 
          />
        </div>
      </div>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
          <CardDescription>Latest student badging activities</CardDescription>
        </CardHeader>
        <CardContent>
          <RecentActivity />
        </CardContent>
      </Card>
    </div>
  );
};

export default Index;
