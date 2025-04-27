
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Users, CreditCard, CheckCircle, AlertCircle } from "lucide-react";
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
    <Card>
      <CardHeader>
        <CardTitle>Recent Activity</CardTitle>
        <CardDescription>Latest student badging activities</CardDescription>
      </CardHeader>
      <CardContent>
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
      </CardContent>
    </Card>
  );
};

const Index = () => {
  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <Link to="/badge-flow">
          <Button>New Badge Process</Button>
        </Link>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-6">
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
        <DashboardCard 
          title="Integration Errors" 
          value="3" 
          description="Needs attention" 
          icon={AlertCircle}
          color="bg-badgeflow-error" 
        />
      </div>

      <div className="grid gap-4 md:grid-cols-2 mb-6">
        <RecentActivity />
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Frequently used badge flow tasks</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Link to="/badge-flow">
              <Button className="w-full">Start New Badge Process</Button>
            </Link>
            <Link to="/export">
              <Button className="w-full" variant="outline">Export NFC Serial Data</Button>
            </Link>
            <Link to="/students">
              <Button className="w-full" variant="outline">View Student Database</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Index;
