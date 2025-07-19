import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Users,
  Calendar,
  DollarSign,
  TrendingUp,
  Clock,
  AlertCircle,
  CheckCircle,
  Plus,
  Eye,
  Phone,
  MapPin,
} from "lucide-react";

export default function Index() {
  const stats = [
    {
      title: "Patients Totaux",
      value: "248",
      change: "+12%",
      changeType: "increase" as const,
      icon: Users,
      color: "text-blue-600",
      bgColor: "bg-blue-100",
    },
    {
      title: "RDV Aujourd'hui",
      value: "18",
      change: "3 en attente",
      changeType: "neutral" as const,
      icon: Calendar,
      color: "text-green-600",
      bgColor: "bg-green-100",
    },
    {
      title: "Revenus ce mois",
      value: "24,580 DH",
      change: "+8.2%",
      changeType: "increase" as const,
      icon: DollarSign,
      color: "text-emerald-600",
      bgColor: "bg-emerald-100",
    },
    {
      title: "Taux de satisfaction",
      value: "96%",
      change: "+2.1%",
      changeType: "increase" as const,
      icon: TrendingUp,
      color: "text-purple-600",
      bgColor: "bg-purple-100",
    },
  ];

  const todayAppointments = [
    {
      time: "09:00",
      patient: "Amina Benali",
      treatment: "Consultation générale",
      status: "completed" as const,
      phone: "+212 6 12 34 56 78",
    },
    {
      time: "10:30",
      patient: "Mohammed Alami",
      treatment: "Suivi cardiologique",
      status: "in-progress" as const,
      phone: "+212 6 98 76 54 32",
    },
    {
      time: "11:15",
      patient: "Fatima Zahara",
      treatment: "Contrôle diabète",
      status: "pending" as const,
      phone: "+212 6 11 22 33 44",
    },
    {
      time: "14:00",
      patient: "Youssef Tazi",
      treatment: "Bilan sanguin",
      status: "pending" as const,
      phone: "+212 6 55 66 77 88",
    },
    {
      time: "15:30",
      patient: "Laila Bennani",
      treatment: "Consultation dermatologie",
      status: "pending" as const,
      phone: "+212 6 99 88 77 66",
    },
  ];

  const recentFinancials = [
    {
      patient: "Amina Benali",
      total: "850 DH",
      paid: "600 DH",
      remaining: "250 DH",
      progress: 70,
    },
    {
      patient: "Mohammed Alami",
      total: "1,200 DH",
      paid: "1,200 DH",
      remaining: "0 DH",
      progress: 100,
    },
    {
      patient: "Fatima Zahara",
      total: "450 DH",
      paid: "150 DH",
      remaining: "300 DH",
      progress: 33,
    },
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "completed":
        return (
          <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
            <CheckCircle className="w-3 h-3 mr-1" />
            Terminé
          </Badge>
        );
      case "in-progress":
        return (
          <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100">
            <Clock className="w-3 h-3 mr-1" />
            En cours
          </Badge>
        );
      case "pending":
        return (
          <Badge className="bg-orange-100 text-orange-800 hover:bg-orange-100">
            <AlertCircle className="w-3 h-3 mr-1" />
            En attente
          </Badge>
        );
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <Card key={index} className="transition-all hover:shadow-md">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    {stat.title}
                  </p>
                  <p className="text-2xl font-bold">{stat.value}</p>
                  <p
                    className={`text-xs ${
                      stat.changeType === "increase"
                        ? "text-green-600"
                        : "text-muted-foreground"
                    }`}
                  >
                    {stat.change}
                  </p>
                </div>
                <div className={`${stat.bgColor} p-3 rounded-full`}>
                  <stat.icon className={`w-6 h-6 ${stat.color}`} />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Today's Appointments */}
        <Card className="lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Rendez-vous d'aujourd'hui</CardTitle>
            <Button size="sm" className="gap-2">
              <Plus className="w-4 h-4" />
              Nouveau RDV
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {todayAppointments.map((appointment, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-4 rounded-lg border bg-card/50 hover:bg-card transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <div className="text-center">
                      <div className="text-sm font-medium">
                        {appointment.time}
                      </div>
                    </div>
                    <div className="flex-1">
                      <div className="font-medium">{appointment.patient}</div>
                      <div className="text-sm text-muted-foreground">
                        {appointment.treatment}
                      </div>
                      <div className="flex items-center gap-1 text-xs text-muted-foreground mt-1">
                        <Phone className="w-3 h-3" />
                        {appointment.phone}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {getStatusBadge(appointment.status)}
                    <Button variant="outline" size="sm">
                      <Eye className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Financial Overview */}
        <Card>
          <CardHeader>
            <CardTitle>Suivi Financier</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentFinancials.map((financial, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="font-medium text-sm">
                      {financial.patient}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {financial.paid} / {financial.total}
                    </span>
                  </div>
                  <Progress value={financial.progress} className="h-2" />
                  <div className="flex justify-between text-xs">
                    <span className="text-green-600">
                      Payé: {financial.paid}
                    </span>
                    <span className="text-orange-600">
                      Restant: {financial.remaining}
                    </span>
                  </div>
                </div>
              ))}
              <Button variant="outline" className="w-full mt-4">
                Voir tous les paiements
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Actions Rapides</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button className="h-20 flex-col gap-2" variant="outline">
              <Users className="w-6 h-6" />
              <span>Ajouter Patient</span>
            </Button>
            <Button className="h-20 flex-col gap-2" variant="outline">
              <Calendar className="w-6 h-6" />
              <span>Planifier RDV</span>
            </Button>
            <Button className="h-20 flex-col gap-2" variant="outline">
              <DollarSign className="w-6 h-6" />
              <span>Enregistrer Paiement</span>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Clinic Information */}
      <Card>
        <CardHeader>
          <CardTitle>Informations de la Clinique</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="flex items-center gap-3">
              <MapPin className="w-5 h-5 text-muted-foreground" />
              <div>
                <div className="font-medium">Adresse</div>
                <div className="text-sm text-muted-foreground">
                  123 Rue de la Santé, Casablanca
                </div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Phone className="w-5 h-5 text-muted-foreground" />
              <div>
                <div className="font-medium">Téléphone</div>
                <div className="text-sm text-muted-foreground">
                  +212 5 22 12 34 56
                </div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Clock className="w-5 h-5 text-muted-foreground" />
              <div>
                <div className="font-medium">Horaires</div>
                <div className="text-sm text-muted-foreground">
                  Lun-Ven: 8h-18h, Sam: 8h-14h
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
