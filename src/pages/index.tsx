import { Link } from "react-router";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Users,
  UserCircle,
  Monitor,
  BarChart,
  ChevronRight,
  Calendar,
} from "lucide-react";
import "../index.css";

const Index = () => {
  const navigationCards = [
    {
      title: "Teams",
      description: "Manage teams, colors, leagues, and team information",
      icon: Users,
      href: "/teams",
      color: "from-red-500/10 to-red-600/10",
      iconColor: "text-red-600",
    },
    {
      title: "Players",
      description: "Manage player profiles, jersey numbers, and information",
      icon: UserCircle,
      href: "/players",
      color: "from-blue-500/10 to-blue-600/10",
      iconColor: "text-blue-600",
    },
    {
      title: "Rosters",
      description: "Create and manage team rosters with player assignments",
      icon: Users,
      href: "/rosters",
      color: "from-green-500/10 to-green-600/10",
      iconColor: "text-green-600",
    },
    {
      title: "Controller",
      description: "Control live match scoreboard and game statistics",
      icon: Monitor,
      href: "/controller",
      color: "from-purple-500/10 to-purple-600/10",
      iconColor: "text-purple-600",
    },
    {
      title: "Scoreboard",
      description: "View the live scoreboard display for presentations",
      icon: BarChart,
      href: "/scoreboard/pv",
      color: "from-orange-500/10 to-orange-600/10",
      iconColor: "text-orange-600",
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <div className="bg-linear-to-b from-primary/5 to-background border-b">
        <div className="container mx-auto px-4 py-16 lg:py-24">
          <div className="max-w-3xl mx-auto text-center space-y-4">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight">
              KorfHub
            </h1>
            <p className="text-xl text-muted-foreground">
              Manage your korfball matches, teams, and statistics all in one
              place
            </p>
          </div>
        </div>
      </div>

      {/* Navigation Cards */}
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-6xl mx-auto space-y-8">
          <div>
            <h2 className="text-2xl font-semibold mb-2">Quick Access</h2>
            <p className="text-muted-foreground">
              Navigate to different sections of the application
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {navigationCards.map((card) => {
              const Icon = card.icon;
              return (
                <Link key={card.href} to={card.href}>
                  <Card
                    className={`h-full transition-all hover:shadow-lg hover:scale-[1.02] cursor-pointer bg-linear-to-br ${card.color}`}
                  >
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div
                          className={`p-3 rounded-lg bg-background/80 ${card.iconColor}`}
                        >
                          <Icon size={28} />
                        </div>
                        <ChevronRight
                          className="text-muted-foreground"
                          size={20}
                        />
                      </div>
                      <CardTitle className="text-2xl">{card.title}</CardTitle>
                      <CardDescription className="text-base">
                        {card.description}
                      </CardDescription>
                    </CardHeader>
                  </Card>
                </Link>
              );
            })}
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="container mx-auto px-4 py-12 border-t">
        <div className="max-w-6xl mx-auto space-y-8">
          <div className="text-center space-y-2">
            <h2 className="text-2xl font-semibold">Features</h2>
            <p className="text-muted-foreground">
              Everything you need to manage korfball matches
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <UserCircle className="mb-2 text-blue-600" size={32} />
                <CardTitle>Player Management</CardTitle>
                <CardDescription>
                  Create and manage player profiles with detailed information
                  including jersey numbers, birthdays, and team assignments.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card>
              <CardHeader>
                <Users className="mb-2 text-green-600" size={32} />
                <CardTitle>Roster Building</CardTitle>
                <CardDescription>
                  Build team rosters with up to 16 players. Easily assign
                  players to teams and manage multiple roster configurations.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card>
              <CardHeader>
                <Monitor className="mb-2 text-purple-600" size={32} />
                <CardTitle>Live Scoreboard</CardTitle>
                <CardDescription>
                  Control live match scoreboards with real-time updates for
                  scores, time, events, and game statistics.
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
