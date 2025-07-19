import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import {
  BarChart3,
  PieChart,
  TrendingUp,
  TrendingDown,
  Users,
  Calendar,
  DollarSign,
  Activity,
  Download,
  Filter,
  RefreshCw,
  FileText,
  Target,
  Clock,
  Star,
  AlertTriangle,
  CheckCircle,
  ArrowUpRight,
  ArrowDownRight,
  Eye,
  Heart,
  Zap,
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
  format,
  subDays,
  subMonths,
  startOfMonth,
  endOfMonth,
  startOfYear,
  endOfYear,
  isWithinInterval,
  parseISO,
} from "date-fns";
import { fr } from "date-fns/locale";

interface AnalyticsData {
  patients: {
    total: number;
    nouveau: number;
    actifs: number;
    inactifs: number;
    ageGroups: { [key: string]: number };
    sexeDistribution: { M: number; F: number };
    trends: { month: string; count: number }[];
  };
  appointments: {
    total: number;
    completed: number;
    cancelled: number;
    noShow: number;
    byType: { [key: string]: number };
    byDoctor: { [key: string]: number };
    trends: { month: string; count: number }[];
    satisfaction: number;
  };
  financial: {
    revenue: number;
    revenueGrowth: number;
    outstanding: number;
    collectionRate: number;
    averagePayment: number;
    byPaymentMethod: { [key: string]: number };
    byServiceType: { [key: string]: number };
    trends: { month: string; amount: number }[];
  };
  performance: {
    utilizationRate: number;
    averageConsultationTime: number;
    patientRetentionRate: number;
    newPatientRate: number;
    cancellationRate: number;
    operatingDays: number;
  };
}

// Mock data for analytics
const mockAnalyticsData: AnalyticsData = {
  patients: {
    total: 248,
    nouveau: 23,
    actifs: 195,
    inactifs: 53,
    ageGroups: {
      "0-18": 32,
      "19-35": 78,
      "36-50": 89,
      "51-65": 35,
      "65+": 14,
    },
    sexeDistribution: { M: 118, F: 130 },
    trends: [
      { month: "Jan", count: 45 },
      { month: "Fév", count: 52 },
      { month: "Mar", count: 48 },
      { month: "Avr", count: 61 },
      { month: "Mai", count: 58 },
      { month: "Juin", count: 67 },
    ],
  },
  appointments: {
    total: 1247,
    completed: 1089,
    cancelled: 98,
    noShow: 60,
    byType: {
      "Consultation générale": 456,
      "Suivi cardiologique": 234,
      "Contrôle diabète": 187,
      "Consultation spécialisée": 145,
      "Bilan de santé": 89,
      Urgence: 78,
      Vaccination: 58,
    },
    byDoctor: {
      "Dr. Alami": 423,
      "Dr. Bennani": 389,
      "Dr. Tazi": 267,
      "Dr. Lazrak": 168,
    },
    trends: [
      { month: "Jan", count: 198 },
      { month: "Fév", count: 215 },
      { month: "Mar", count: 203 },
      { month: "Avr", count: 234 },
      { month: "Mai", count: 221 },
      { month: "Juin", count: 176 },
    ],
    satisfaction: 4.6,
  },
  financial: {
    revenue: 284750,
    revenueGrowth: 12.3,
    outstanding: 23480,
    collectionRate: 94.2,
    averagePayment: 485,
    byPaymentMethod: {
      "Carte bancaire": 45,
      Assurance: 28,
      Espèces: 18,
      Virement: 7,
      Chèque: 2,
    },
    byServiceType: {
      Consultation: 145800,
      Traitement: 89450,
      Examen: 34200,
      Médicament: 15300,
    },
    trends: [
      { month: "Jan", amount: 42300 },
      { month: "Fév", amount: 45700 },
      { month: "Mar", amount: 48900 },
      { month: "Avr", amount: 52100 },
      { month: "Mai", amount: 47800 },
      { month: "Juin", amount: 47950 },
    ],
  },
  performance: {
    utilizationRate: 87.5,
    averageConsultationTime: 32,
    patientRetentionRate: 91.2,
    newPatientRate: 9.3,
    cancellationRate: 7.9,
    operatingDays: 22,
  },
};

const timeRanges = [
  { value: "7d", label: "7 derniers jours" },
  { value: "30d", label: "30 derniers jours" },
  { value: "3m", label: "3 derniers mois" },
  { value: "6m", label: "6 derniers mois" },
  { value: "1y", label: "Cette année" },
];

export default function Reports() {
  const [timeRange, setTimeRange] = useState("30d");
  const [data] = useState<AnalyticsData>(mockAnalyticsData);
  const [isLoading, setIsLoading] = useState(false);

  const refreshData = () => {
    setIsLoading(true);
    setTimeout(() => setIsLoading(false), 1000);
  };

  const exportReport = (type: string) => {
    console.log(`Exporting ${type} report...`);
  };

  const KPICard = ({
    title,
    value,
    change,
    changeType,
    icon: Icon,
    color,
  }: {
    title: string;
    value: string | number;
    change?: string;
    changeType?: "increase" | "decrease" | "neutral";
    icon: any;
    color: string;
  }) => (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-muted-foreground">{title}</p>
            <p className="text-2xl font-bold">{value}</p>
            {change && (
              <p
                className={cn(
                  "text-xs flex items-center gap-1",
                  changeType === "increase"
                    ? "text-green-600"
                    : changeType === "decrease"
                      ? "text-red-600"
                      : "text-muted-foreground",
                )}
              >
                {changeType === "increase" ? (
                  <ArrowUpRight className="w-3 h-3" />
                ) : changeType === "decrease" ? (
                  <ArrowDownRight className="w-3 h-3" />
                ) : null}
                {change}
              </p>
            )}
          </div>
          <div className={cn("p-3 rounded-full", color)}>
            <Icon className="w-6 h-6" />
          </div>
        </div>
      </CardContent>
    </Card>
  );

  const ChartCard = ({
    title,
    children,
    actions,
  }: {
    title: string;
    children: React.ReactNode;
    actions?: React.ReactNode;
  }) => (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-base">{title}</CardTitle>
        {actions}
      </CardHeader>
      <CardContent>{children}</CardContent>
    </Card>
  );

  const SimpleBarChart = ({
    data,
    color = "bg-primary",
  }: {
    data: { label: string; value: number }[];
    color?: string;
  }) => {
    const maxValue = Math.max(...data.map((item) => item.value));
    return (
      <div className="space-y-3">
        {data.map((item, index) => (
          <div key={index} className="space-y-1">
            <div className="flex justify-between text-sm">
              <span>{item.label}</span>
              <span className="font-medium">{item.value}</span>
            </div>
            <div className="w-full bg-muted rounded-full h-2">
              <div
                className={cn("h-2 rounded-full", color)}
                style={{ width: `${(item.value / maxValue) * 100}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    );
  };

  const SimpleTrendChart = ({
    data,
  }: {
    data: { month: string; count: number }[];
  }) => (
    <div className="space-y-2">
      <div className="flex justify-between items-end h-32 gap-2">
        {data.map((item, index) => {
          const maxValue = Math.max(...data.map((d) => d.count));
          const height = (item.count / maxValue) * 100;
          return (
            <div key={index} className="flex flex-col items-center flex-1">
              <div
                className="w-full bg-primary rounded-t"
                style={{ height: `${height}%` }}
              />
              <span className="text-xs text-muted-foreground mt-1">
                {item.month}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Rapports et Analyses</h1>
          <p className="text-muted-foreground">
            Analyses complètes de la performance de votre clinique
          </p>
        </div>
        <div className="flex gap-2">
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-48">
              <Filter className="w-4 h-4 mr-2" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {timeRanges.map((range) => (
                <SelectItem key={range.value} value={range.value}>
                  {range.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button
            variant="outline"
            onClick={refreshData}
            disabled={isLoading}
            className="gap-2"
          >
            <RefreshCw className={cn("w-4 h-4", isLoading && "animate-spin")} />
            Actualiser
          </Button>
          <Button className="gap-2" onClick={() => exportReport("global")}>
            <Download className="w-4 h-4" />
            Exporter
          </Button>
        </div>
      </div>

      {/* Key Performance Indicators */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <KPICard
          title="Patients Total"
          value={data.patients.total}
          change="+12.3% ce mois"
          changeType="increase"
          icon={Users}
          color="bg-blue-100 text-blue-600"
        />
        <KPICard
          title="Taux de Satisfaction"
          value={`${data.appointments.satisfaction}/5`}
          change="Excellent"
          changeType="increase"
          icon={Star}
          color="bg-yellow-100 text-yellow-600"
        />
        <KPICard
          title="Revenus Totaux"
          value={`${(data.financial.revenue / 1000).toFixed(0)}k DH`}
          change={`+${data.financial.revenueGrowth}%`}
          changeType="increase"
          icon={DollarSign}
          color="bg-green-100 text-green-600"
        />
        <KPICard
          title="Taux d'Utilisation"
          value={`${data.performance.utilizationRate}%`}
          change="Optimal"
          changeType="increase"
          icon={Target}
          color="bg-purple-100 text-purple-600"
        />
      </div>

      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="overview">Vue d'ensemble</TabsTrigger>
          <TabsTrigger value="patients">Patients</TabsTrigger>
          <TabsTrigger value="appointments">Rendez-vous</TabsTrigger>
          <TabsTrigger value="financial">Financier</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <ChartCard
              title="Évolution des Patients"
              actions={
                <Button size="sm" variant="outline" className="gap-1">
                  <Eye className="w-3 h-3" />
                  Détails
                </Button>
              }
            >
              <SimpleTrendChart data={data.patients.trends} />
            </ChartCard>

            <ChartCard title="Rendez-vous par Statut">
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600">
                      {data.appointments.completed}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Terminés
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-red-600">
                      {data.appointments.cancelled + data.appointments.noShow}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Annulés/Absent
                    </div>
                  </div>
                </div>
                <Progress
                  value={
                    (data.appointments.completed / data.appointments.total) *
                    100
                  }
                  className="h-3"
                />
                <div className="text-center text-sm text-muted-foreground">
                  Taux de réussite:{" "}
                  {(
                    (data.appointments.completed / data.appointments.total) *
                    100
                  ).toFixed(1)}
                  %
                </div>
              </div>
            </ChartCard>

            <ChartCard title="Revenus par Mois">
              <SimpleTrendChart
                data={data.financial.trends.map((item) => ({
                  month: item.month,
                  count: item.amount / 1000,
                }))}
              />
              <div className="mt-4 text-center">
                <div className="text-sm text-muted-foreground">
                  Moyenne mensuelle:{" "}
                  {(data.financial.revenue / 6 / 1000).toFixed(0)}k DH
                </div>
              </div>
            </ChartCard>

            <ChartCard title="Indicateurs de Performance">
              <div className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Taux de rétention patients</span>
                    <span className="font-medium">
                      {data.performance.patientRetentionRate}%
                    </span>
                  </div>
                  <Progress
                    value={data.performance.patientRetentionRate}
                    className="h-2"
                  />
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Taux de recouvrement</span>
                    <span className="font-medium">
                      {data.financial.collectionRate}%
                    </span>
                  </div>
                  <Progress
                    value={data.financial.collectionRate}
                    className="h-2"
                  />
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Taux d'utilisation</span>
                    <span className="font-medium">
                      {data.performance.utilizationRate}%
                    </span>
                  </div>
                  <Progress
                    value={data.performance.utilizationRate}
                    className="h-2"
                  />
                </div>
              </div>
            </ChartCard>
          </div>
        </TabsContent>

        <TabsContent value="patients" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <ChartCard title="Répartition par Âge">
              <SimpleBarChart
                data={Object.entries(data.patients.ageGroups).map(
                  ([age, count]) => ({
                    label: age,
                    value: count,
                  }),
                )}
                color="bg-blue-500"
              />
            </ChartCard>

            <ChartCard title="Répartition par Sexe">
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-blue-600">
                      {data.patients.sexeDistribution.M}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Hommes (
                      {(
                        (data.patients.sexeDistribution.M /
                          data.patients.total) *
                        100
                      ).toFixed(1)}
                      %)
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-pink-600">
                      {data.patients.sexeDistribution.F}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Femmes (
                      {(
                        (data.patients.sexeDistribution.F /
                          data.patients.total) *
                        100
                      ).toFixed(1)}
                      %)
                    </div>
                  </div>
                </div>
              </div>
            </ChartCard>

            <ChartCard title="Statut des Patients">
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm">Patients actifs</span>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-green-500 rounded-full" />
                    <span className="font-medium">{data.patients.actifs}</span>
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Patients inactifs</span>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-gray-400 rounded-full" />
                    <span className="font-medium">
                      {data.patients.inactifs}
                    </span>
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Nouveaux ce mois</span>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-blue-500 rounded-full" />
                    <span className="font-medium">{data.patients.nouveau}</span>
                  </div>
                </div>
              </div>
            </ChartCard>

            <ChartCard title="Tendance d'Acquisition">
              <SimpleTrendChart data={data.patients.trends} />
              <div className="mt-4 text-center">
                <div className="text-sm text-muted-foreground">
                  Croissance moyenne: +
                  {(
                    (data.patients.nouveau / data.patients.total) *
                    100
                  ).toFixed(1)}
                  % par mois
                </div>
              </div>
            </ChartCard>
          </div>
        </TabsContent>

        <TabsContent value="appointments" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <ChartCard title="Rendez-vous par Type">
              <SimpleBarChart
                data={Object.entries(data.appointments.byType).map(
                  ([type, count]) => ({
                    label: type,
                    value: count,
                  }),
                )}
                color="bg-green-500"
              />
            </ChartCard>

            <ChartCard title="Rendez-vous par Médecin">
              <SimpleBarChart
                data={Object.entries(data.appointments.byDoctor).map(
                  ([doctor, count]) => ({
                    label: doctor,
                    value: count,
                  }),
                )}
                color="bg-purple-500"
              />
            </ChartCard>

            <ChartCard title="Évolution des Rendez-vous">
              <SimpleTrendChart data={data.appointments.trends} />
            </ChartCard>

            <ChartCard title="Métriques de Performance">
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm">Satisfaction moyenne</span>
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    <span className="font-medium">
                      {data.appointments.satisfaction}/5
                    </span>
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Taux de présence</span>
                  <span className="font-medium">
                    {(
                      ((data.appointments.total - data.appointments.noShow) /
                        data.appointments.total) *
                      100
                    ).toFixed(1)}
                    %
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Taux d'annulation</span>
                  <span className="font-medium">
                    {(
                      (data.appointments.cancelled / data.appointments.total) *
                      100
                    ).toFixed(1)}
                    %
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Temps moyen consultation</span>
                  <span className="font-medium">
                    {data.performance.averageConsultationTime} min
                  </span>
                </div>
              </div>
            </ChartCard>
          </div>
        </TabsContent>

        <TabsContent value="financial" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <ChartCard title="Revenus par Méthode de Paiement">
              <SimpleBarChart
                data={Object.entries(data.financial.byPaymentMethod).map(
                  ([method, percentage]) => ({
                    label: method,
                    value: percentage,
                  }),
                )}
                color="bg-green-500"
              />
            </ChartCard>

            <ChartCard title="Revenus par Type de Service">
              <SimpleBarChart
                data={Object.entries(data.financial.byServiceType).map(
                  ([service, amount]) => ({
                    label: service,
                    value: amount / 1000,
                  }),
                )}
                color="bg-blue-500"
              />
            </ChartCard>

            <ChartCard title="Évolution des Revenus">
              <SimpleTrendChart
                data={data.financial.trends.map((item) => ({
                  month: item.month,
                  count: item.amount / 1000,
                }))}
              />
              <div className="mt-4 grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-muted-foreground">Croissance:</span>
                  <span className="ml-2 font-medium text-green-600">
                    +{data.financial.revenueGrowth}%
                  </span>
                </div>
                <div>
                  <span className="text-muted-foreground">Prévision:</span>
                  <span className="ml-2 font-medium">
                    {((data.financial.revenue * 1.12) / 1000).toFixed(0)}k DH
                  </span>
                </div>
              </div>
            </ChartCard>

            <ChartCard title="Métriques Financières">
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600">
                      {data.financial.collectionRate}%
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Taux de recouvrement
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-600">
                      {data.financial.averagePayment} DH
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Paiement moyen
                    </div>
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-lg font-bold text-orange-600">
                    {(data.financial.outstanding / 1000).toFixed(1)}k DH
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Créances en cours
                  </div>
                </div>
              </div>
            </ChartCard>
          </div>
        </TabsContent>

        <TabsContent value="performance" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="w-5 h-5" />
                  Efficacité Opérationnelle
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Taux d'utilisation</span>
                      <span className="font-medium">
                        {data.performance.utilizationRate}%
                      </span>
                    </div>
                    <Progress
                      value={data.performance.utilizationRate}
                      className="h-2"
                    />
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Jours d'activité</span>
                      <span className="font-medium">
                        {data.performance.operatingDays}/30
                      </span>
                    </div>
                    <Progress
                      value={(data.performance.operatingDays / 30) * 100}
                      className="h-2"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="w-5 h-5" />
                  Rétention Patients
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-green-600">
                      {data.performance.patientRetentionRate}%
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Taux de rétention
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-xl font-bold text-blue-600">
                      {data.performance.newPatientRate}%
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Nouveaux patients
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="w-5 h-5" />
                  Temps & Qualité
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-purple-600">
                      {data.performance.averageConsultationTime} min
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Durée moyenne consultation
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-xl font-bold text-yellow-600">
                      {data.appointments.satisfaction}/5
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Satisfaction patient
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <ChartCard title="Alertes et Recommandations">
              <div className="space-y-3">
                <div className="flex items-start gap-3 p-3 bg-green-50 rounded-lg">
                  <CheckCircle className="w-5 h-5 text-green-600 mt-0.5" />
                  <div>
                    <div className="font-medium text-green-800">
                      Performance excellente
                    </div>
                    <div className="text-sm text-green-700">
                      Taux de satisfaction au-dessus de 4.5/5
                    </div>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-3 bg-yellow-50 rounded-lg">
                  <AlertTriangle className="w-5 h-5 text-yellow-600 mt-0.5" />
                  <div>
                    <div className="font-medium text-yellow-800">
                      Créances élevées
                    </div>
                    <div className="text-sm text-yellow-700">
                      {(data.financial.outstanding / 1000).toFixed(1)}k DH en
                      attente de paiement
                    </div>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-3 bg-blue-50 rounded-lg">
                  <Zap className="w-5 h-5 text-blue-600 mt-0.5" />
                  <div>
                    <div className="font-medium text-blue-800">
                      Optimisation possible
                    </div>
                    <div className="text-sm text-blue-700">
                      Réduire le taux d'annulation de{" "}
                      {data.performance.cancellationRate}% à 5%
                    </div>
                  </div>
                </div>
              </div>
            </ChartCard>

            <ChartCard title="Objectifs & Prévisions">
              <div className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Objectif revenus mensuel</span>
                    <span className="font-medium">60k DH</span>
                  </div>
                  <Progress
                    value={(data.financial.revenue / 6 / 60000) * 100}
                    className="h-2"
                  />
                  <div className="text-xs text-muted-foreground">
                    Atteint à{" "}
                    {((data.financial.revenue / 6 / 60000) * 100).toFixed(0)}%
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Objectif nouveaux patients</span>
                    <span className="font-medium">25/mois</span>
                  </div>
                  <Progress
                    value={(data.patients.nouveau / 25) * 100}
                    className="h-2"
                  />
                  <div className="text-xs text-muted-foreground">
                    Atteint à {((data.patients.nouveau / 25) * 100).toFixed(0)}%
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Objectif satisfaction</span>
                    <span className="font-medium">4.8/5</span>
                  </div>
                  <Progress
                    value={(data.appointments.satisfaction / 4.8) * 100}
                    className="h-2"
                  />
                  <div className="text-xs text-muted-foreground">
                    Atteint à{" "}
                    {((data.appointments.satisfaction / 4.8) * 100).toFixed(0)}%
                  </div>
                </div>
              </div>
            </ChartCard>
          </div>
        </TabsContent>
      </Tabs>

      {/* Export Options */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="w-5 h-5" />
            Options d'Export
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button
              variant="outline"
              className="gap-2"
              onClick={() => exportReport("patient")}
            >
              <Download className="w-4 h-4" />
              Rapport Patients
            </Button>
            <Button
              variant="outline"
              className="gap-2"
              onClick={() => exportReport("financial")}
            >
              <Download className="w-4 h-4" />
              Rapport Financier
            </Button>
            <Button
              variant="outline"
              className="gap-2"
              onClick={() => exportReport("performance")}
            >
              <Download className="w-4 h-4" />
              Rapport Performance
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
