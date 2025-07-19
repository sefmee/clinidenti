import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import {
  Plus,
  Search,
  Filter,
  Eye,
  Edit,
  Download,
  DollarSign,
  TrendingUp,
  TrendingDown,
  AlertCircle,
  CheckCircle,
  Clock,
  User,
  Calendar,
  CreditCard,
  Receipt,
  FileText,
  PieChart,
  BarChart3,
  Wallet,
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
  format,
  addDays,
  subDays,
  startOfMonth,
  endOfMonth,
  parseISO,
  isWithinInterval,
} from "date-fns";
import { fr } from "date-fns/locale";

interface Payment {
  id: string;
  patientId: string;
  patientName: string;
  patientPhone: string;
  montant: number;
  montantDu: number;
  montantPaye: number;
  montantRestant: number;
  date: string;
  dateDue: string;
  methode: "especes" | "carte" | "cheque" | "virement" | "assurance";
  statut: "paye" | "partiel" | "en_attente" | "en_retard" | "annule";
  type: "consultation" | "traitement" | "medicament" | "examen" | "autre";
  description: string;
  numeroFacture: string;
  notes?: string;
  rappelEnvoye: boolean;
}

interface FinancialStats {
  revenusTotal: number;
  revenusJour: number;
  revenusMois: number;
  revenusEnAttente: number;
  montantRetard: number;
  nombrePaiements: number;
  tauxRecouvrement: number;
  moyennePaiement: number;
}

const mockPayments: Payment[] = [
  {
    id: "1",
    patientId: "1",
    patientName: "Amina Benali",
    patientPhone: "+212 6 12 34 56 78",
    montant: 500,
    montantDu: 500,
    montantPaye: 350,
    montantRestant: 150,
    date: new Date().toISOString().split("T")[0],
    dateDue: new Date().toISOString().split("T")[0],
    methode: "carte",
    statut: "partiel",
    type: "consultation",
    description: "Consultation cardiologique + ECG",
    numeroFacture: "F-2024-001",
    notes: "Paiement partiel, reste à régler",
    rappelEnvoye: false,
  },
  {
    id: "2",
    patientId: "2",
    patientName: "Mohammed Alami",
    patientPhone: "+212 6 98 76 54 32",
    montant: 800,
    montantDu: 800,
    montantPaye: 800,
    montantRestant: 0,
    date: subDays(new Date(), 1).toISOString().split("T")[0],
    dateDue: subDays(new Date(), 1).toISOString().split("T")[0],
    methode: "assurance",
    statut: "paye",
    type: "traitement",
    description: "Traitement diabète - Suivi mensuel",
    numeroFacture: "F-2024-002",
    notes: "Paiement via assurance maladie",
    rappelEnvoye: false,
  },
  {
    id: "3",
    patientId: "3",
    patientName: "Fatima Zahara",
    patientPhone: "+212 6 11 22 33 44",
    montant: 300,
    montantDu: 300,
    montantPaye: 0,
    montantRestant: 300,
    date: subDays(new Date(), 5).toISOString().split("T")[0],
    dateDue: subDays(new Date(), 2).toISOString().split("T")[0],
    methode: "especes",
    statut: "en_retard",
    type: "consultation",
    description: "Consultation dermatologie",
    numeroFacture: "F-2024-003",
    notes: "Patient à rappeler",
    rappelEnvoye: true,
  },
  {
    id: "4",
    patientId: "1",
    patientName: "Amina Benali",
    patientPhone: "+212 6 12 34 56 78",
    montant: 250,
    montantDu: 250,
    montantPaye: 0,
    montantRestant: 250,
    date: addDays(new Date(), 3).toISOString().split("T")[0],
    dateDue: addDays(new Date(), 7).toISOString().split("T")[0],
    methode: "carte",
    statut: "en_attente",
    type: "examen",
    description: "Analyses de laboratoire",
    numeroFacture: "F-2024-004",
    notes: "",
    rappelEnvoye: false,
  },
  {
    id: "5",
    patientId: "2",
    patientName: "Mohammed Alami",
    patientPhone: "+212 6 98 76 54 32",
    montant: 450,
    montantDu: 450,
    montantPaye: 450,
    montantRestant: 0,
    date: subDays(new Date(), 10).toISOString().split("T")[0],
    dateDue: subDays(new Date(), 10).toISOString().split("T")[0],
    methode: "virement",
    statut: "paye",
    type: "medicament",
    description: "Prescription médicaments",
    numeroFacture: "F-2024-005",
    notes: "Paiement par virement bancaire",
    rappelEnvoye: false,
  },
];

export default function Finances() {
  const [payments, setPayments] = useState<Payment[]>(mockPayments);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState<string>("tous");
  const [filterType, setFilterType] = useState<string>("tous");
  const [filterPeriod, setFilterPeriod] = useState<string>("mois");
  const [selectedPayment, setSelectedPayment] = useState<Payment | null>(null);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);

  // Calculate financial statistics
  const calculateStats = (): FinancialStats => {
    const today = new Date();
    const thisMonth = {
      start: startOfMonth(today),
      end: endOfMonth(today),
    };

    const revenusTotal = payments.reduce((sum, p) => sum + p.montantPaye, 0);
    const revenusJour = payments
      .filter((p) => p.date === today.toISOString().split("T")[0])
      .reduce((sum, p) => sum + p.montantPaye, 0);
    const revenusMois = payments
      .filter((p) =>
        isWithinInterval(parseISO(p.date), {
          start: thisMonth.start,
          end: thisMonth.end,
        }),
      )
      .reduce((sum, p) => sum + p.montantPaye, 0);
    const revenusEnAttente = payments
      .filter((p) => p.statut === "en_attente" || p.statut === "partiel")
      .reduce((sum, p) => sum + p.montantRestant, 0);
    const montantRetard = payments
      .filter((p) => p.statut === "en_retard")
      .reduce((sum, p) => sum + p.montantRestant, 0);
    const nombrePaiements = payments.length;
    const totalDu = payments.reduce((sum, p) => sum + p.montantDu, 0);
    const tauxRecouvrement = totalDu > 0 ? (revenusTotal / totalDu) * 100 : 0;
    const moyennePaiement =
      nombrePaiements > 0 ? revenusTotal / nombrePaiements : 0;

    return {
      revenusTotal,
      revenusJour,
      revenusMois,
      revenusEnAttente,
      montantRetard,
      nombrePaiements,
      tauxRecouvrement,
      moyennePaiement,
    };
  };

  const stats = calculateStats();

  const filteredPayments = payments.filter((payment) => {
    const matchesSearch =
      payment.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      payment.numeroFacture.toLowerCase().includes(searchTerm.toLowerCase()) ||
      payment.description.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      filterStatus === "tous" || payment.statut === filterStatus;

    const matchesType = filterType === "tous" || payment.type === filterType;

    return matchesSearch && matchesStatus && matchesType;
  });

  const getStatusBadge = (statut: string) => {
    switch (statut) {
      case "paye":
        return (
          <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
            <CheckCircle className="w-3 h-3 mr-1" />
            Payé
          </Badge>
        );
      case "partiel":
        return (
          <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">
            <Clock className="w-3 h-3 mr-1" />
            Partiel
          </Badge>
        );
      case "en_attente":
        return (
          <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100">
            <Clock className="w-3 h-3 mr-1" />
            En attente
          </Badge>
        );
      case "en_retard":
        return (
          <Badge className="bg-red-100 text-red-800 hover:bg-red-100">
            <AlertCircle className="w-3 h-3 mr-1" />
            En retard
          </Badge>
        );
      case "annule":
        return (
          <Badge className="bg-gray-100 text-gray-800 hover:bg-gray-100">
            Annulé
          </Badge>
        );
      default:
        return null;
    }
  };

  const getPaymentMethodIcon = (methode: string) => {
    switch (methode) {
      case "carte":
        return <CreditCard className="w-4 h-4" />;
      case "especes":
        return <Wallet className="w-4 h-4" />;
      case "cheque":
        return <Receipt className="w-4 h-4" />;
      case "virement":
        return <DollarSign className="w-4 h-4" />;
      case "assurance":
        return <FileText className="w-4 h-4" />;
      default:
        return <DollarSign className="w-4 h-4" />;
    }
  };

  const updatePaymentStatus = (
    paymentId: string,
    newStatus: Payment["statut"],
    montantPaye?: number,
  ) => {
    setPayments((prev) =>
      prev.map((payment) => {
        if (payment.id === paymentId) {
          const updatedPayment = { ...payment, statut: newStatus };
          if (montantPaye !== undefined) {
            updatedPayment.montantPaye = montantPaye;
            updatedPayment.montantRestant = payment.montantDu - montantPaye;
          }
          return updatedPayment;
        }
        return payment;
      }),
    );
  };

  const AddPaymentForm = () => (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="patientSelect">Patient *</Label>
          <Select>
            <SelectTrigger>
              <SelectValue placeholder="Sélectionner un patient" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1">Amina Benali</SelectItem>
              <SelectItem value="2">Mohammed Alami</SelectItem>
              <SelectItem value="3">Fatima Zahara</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label htmlFor="numeroFacture">N° Facture *</Label>
          <Input
            id="numeroFacture"
            placeholder="F-2024-XXX"
            defaultValue={`F-2024-${String(payments.length + 1).padStart(3, "0")}`}
          />
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div>
          <Label htmlFor="montantDu">Montant dû (DH) *</Label>
          <Input id="montantDu" type="number" placeholder="0.00" />
        </div>
        <div>
          <Label htmlFor="montantPaye">Montant payé (DH)</Label>
          <Input id="montantPaye" type="number" placeholder="0.00" />
        </div>
        <div>
          <Label htmlFor="methode">Méthode de paiement *</Label>
          <Select>
            <SelectTrigger>
              <SelectValue placeholder="Méthode" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="especes">Espèces</SelectItem>
              <SelectItem value="carte">Carte bancaire</SelectItem>
              <SelectItem value="cheque">Chèque</SelectItem>
              <SelectItem value="virement">Virement</SelectItem>
              <SelectItem value="assurance">Assurance</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="type">Type de service *</Label>
          <Select>
            <SelectTrigger>
              <SelectValue placeholder="Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="consultation">Consultation</SelectItem>
              <SelectItem value="traitement">Traitement</SelectItem>
              <SelectItem value="medicament">Médicament</SelectItem>
              <SelectItem value="examen">Examen</SelectItem>
              <SelectItem value="autre">Autre</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label htmlFor="dateDue">Date d'échéance</Label>
          <Input id="dateDue" type="date" />
        </div>
      </div>

      <div>
        <Label htmlFor="description">Description *</Label>
        <Input id="description" placeholder="Description du service" />
      </div>

      <div>
        <Label htmlFor="notes">Notes (optionnel)</Label>
        <Textarea id="notes" placeholder="Notes supplémentaires" />
      </div>

      <div className="flex justify-end gap-2 pt-4">
        <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
          Annuler
        </Button>
        <Button onClick={() => setIsAddDialogOpen(false)}>
          Enregistrer le paiement
        </Button>
      </div>
    </div>
  );

  const PaymentDetailsDialog = ({ payment }: { payment: Payment }) => (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <User className="w-4 h-4" />
              Informations Patient
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Nom:</span>
              <span className="font-medium">{payment.patientName}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Téléphone:</span>
              <span>{payment.patientPhone}</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Receipt className="w-4 h-4" />
              Détails Facture
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="flex justify-between">
              <span className="text-muted-foreground">N° Facture:</span>
              <span className="font-medium">{payment.numeroFacture}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Date:</span>
              <span>
                {format(parseISO(payment.date), "dd MMMM yyyy", {
                  locale: fr,
                })}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Type:</span>
              <span className="capitalize">{payment.type}</span>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <DollarSign className="w-4 h-4" />
            Détails Financiers
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="space-y-2">
            <div className="flex justify-between text-lg">
              <span className="text-muted-foreground">Montant dû:</span>
              <span className="font-bold">{payment.montantDu} DH</span>
            </div>
            <div className="flex justify-between text-lg">
              <span className="text-muted-foreground">Montant payé:</span>
              <span className="font-bold text-green-600">
                {payment.montantPaye} DH
              </span>
            </div>
            <div className="flex justify-between text-lg">
              <span className="text-muted-foreground">Montant restant:</span>
              <span
                className={cn(
                  "font-bold",
                  payment.montantRestant > 0
                    ? "text-red-600"
                    : "text-green-600",
                )}
              >
                {payment.montantRestant} DH
              </span>
            </div>
          </div>

          <div className="py-2">
            <div className="flex justify-between text-sm mb-1">
              <span>Progression du paiement</span>
              <span>
                {Math.round((payment.montantPaye / payment.montantDu) * 100)}%
              </span>
            </div>
            <Progress
              value={(payment.montantPaye / payment.montantDu) * 100}
              className="h-2"
            />
          </div>

          <div className="space-y-2 pt-2 border-t">
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">Statut:</span>
              {getStatusBadge(payment.statut)}
            </div>
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">Méthode:</span>
              <div className="flex items-center gap-2">
                {getPaymentMethodIcon(payment.methode)}
                <span className="capitalize">{payment.methode}</span>
              </div>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Date d'échéance:</span>
              <span>
                {format(parseISO(payment.dateDue), "dd MMMM yyyy", {
                  locale: fr,
                })}
              </span>
            </div>
          </div>

          <div className="pt-2 border-t">
            <span className="text-muted-foreground">Description:</span>
            <p className="mt-1">{payment.description}</p>
          </div>

          {payment.notes && (
            <div>
              <span className="text-muted-foreground">Notes:</span>
              <p className="mt-1 text-sm">{payment.notes}</p>
            </div>
          )}
        </CardContent>
      </Card>

      <div className="flex justify-between pt-4">
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Edit className="w-4 h-4 mr-2" />
            Modifier
          </Button>
          <Button variant="outline" size="sm">
            <Download className="w-4 h-4 mr-2" />
            Imprimer facture
          </Button>
        </div>
        <div className="flex gap-2">
          {payment.statut === "en_attente" && (
            <Button
              size="sm"
              onClick={() =>
                updatePaymentStatus(payment.id, "paye", payment.montantDu)
              }
            >
              Marquer comme payé
            </Button>
          )}
          {payment.statut === "partiel" && (
            <Button
              size="sm"
              onClick={() =>
                updatePaymentStatus(payment.id, "paye", payment.montantDu)
              }
            >
              Compléter paiement
            </Button>
          )}
          {payment.statut === "en_retard" && !payment.rappelEnvoye && (
            <Button variant="outline" size="sm">
              Envoyer rappel
            </Button>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Header Actions */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Suivi Financier</h1>
          <p className="text-muted-foreground">
            {filteredPayments.length} transaction(s) •{" "}
            {stats.revenusTotal.toFixed(2)} DH total
          </p>
        </div>

        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus className="w-4 h-4" />
              Nouveau Paiement
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Enregistrer un nouveau paiement</DialogTitle>
            </DialogHeader>
            <AddPaymentForm />
          </DialogContent>
        </Dialog>
      </div>

      {/* Financial Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Revenus Total
                </p>
                <p className="text-2xl font-bold">
                  {stats.revenusTotal.toFixed(0)} DH
                </p>
                <p className="text-xs text-green-600 flex items-center gap-1">
                  <TrendingUp className="w-3 h-3" />
                  Taux: {stats.tauxRecouvrement.toFixed(1)}%
                </p>
              </div>
              <div className="bg-green-100 p-3 rounded-full">
                <DollarSign className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Ce Mois
                </p>
                <p className="text-2xl font-bold">
                  {stats.revenusMois.toFixed(0)} DH
                </p>
                <p className="text-xs text-muted-foreground">
                  Moy: {stats.moyennePaiement.toFixed(0)} DH
                </p>
              </div>
              <div className="bg-blue-100 p-3 rounded-full">
                <BarChart3 className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  En Attente
                </p>
                <p className="text-2xl font-bold text-orange-600">
                  {stats.revenusEnAttente.toFixed(0)} DH
                </p>
                <p className="text-xs text-muted-foreground">À encaisser</p>
              </div>
              <div className="bg-orange-100 p-3 rounded-full">
                <Clock className="w-6 h-6 text-orange-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  En Retard
                </p>
                <p className="text-2xl font-bold text-red-600">
                  {stats.montantRetard.toFixed(0)} DH
                </p>
                <p className="text-xs text-red-600 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" />
                  Action requise
                </p>
              </div>
              <div className="bg-red-100 p-3 rounded-full">
                <AlertCircle className="w-6 h-6 text-red-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="payments" className="w-full">
        <TabsList>
          <TabsTrigger value="payments">Paiements</TabsTrigger>
          <TabsTrigger value="outstanding">Créances</TabsTrigger>
          <TabsTrigger value="reports">Rapports</TabsTrigger>
        </TabsList>

        <TabsContent value="payments" className="space-y-4">
          {/* Search and Filters */}
          <Card>
            <CardContent className="p-4">
              <div className="flex gap-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Rechercher par patient, facture ou description..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <Select value={filterStatus} onValueChange={setFilterStatus}>
                  <SelectTrigger className="w-48">
                    <Filter className="w-4 h-4 mr-2" />
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="tous">Tous les statuts</SelectItem>
                    <SelectItem value="paye">Payé</SelectItem>
                    <SelectItem value="partiel">Partiel</SelectItem>
                    <SelectItem value="en_attente">En attente</SelectItem>
                    <SelectItem value="en_retard">En retard</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={filterType} onValueChange={setFilterType}>
                  <SelectTrigger className="w-48">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="tous">Tous les types</SelectItem>
                    <SelectItem value="consultation">Consultation</SelectItem>
                    <SelectItem value="traitement">Traitement</SelectItem>
                    <SelectItem value="medicament">Médicament</SelectItem>
                    <SelectItem value="examen">Examen</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Payments Table */}
          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Facture</TableHead>
                    <TableHead>Patient</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead>Montant</TableHead>
                    <TableHead>Payé</TableHead>
                    <TableHead>Restant</TableHead>
                    <TableHead>Statut</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredPayments.map((payment) => (
                    <TableRow key={payment.id}>
                      <TableCell>
                        <div className="font-medium">
                          {payment.numeroFacture}
                        </div>
                        <div className="text-xs text-muted-foreground capitalize">
                          {payment.type}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="font-medium">{payment.patientName}</div>
                        <div className="text-xs text-muted-foreground">
                          {payment.patientPhone}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="max-w-48 truncate">
                          {payment.description}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="font-medium">
                          {payment.montantDu} DH
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="text-green-600 font-medium">
                          {payment.montantPaye} DH
                        </div>
                        <div className="flex items-center gap-1 text-xs">
                          {getPaymentMethodIcon(payment.methode)}
                          <span className="capitalize">{payment.methode}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div
                          className={cn(
                            "font-medium",
                            payment.montantRestant > 0
                              ? "text-red-600"
                              : "text-green-600",
                          )}
                        >
                          {payment.montantRestant} DH
                        </div>
                      </TableCell>
                      <TableCell>{getStatusBadge(payment.statut)}</TableCell>
                      <TableCell>
                        <div>
                          {format(parseISO(payment.date), "dd/MM/yyyy")}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          Échéance: {format(parseISO(payment.dateDue), "dd/MM")}
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <Dialog
                          open={
                            isViewDialogOpen &&
                            selectedPayment?.id === payment.id
                          }
                          onOpenChange={(open) => {
                            setIsViewDialogOpen(open);
                            if (!open) setSelectedPayment(null);
                          }}
                        >
                          <DialogTrigger asChild>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => setSelectedPayment(payment)}
                            >
                              <Eye className="w-4 h-4" />
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-4xl">
                            <DialogHeader>
                              <DialogTitle>
                                Détails du paiement - {payment.numeroFacture}
                              </DialogTitle>
                            </DialogHeader>
                            {selectedPayment && (
                              <PaymentDetailsDialog payment={selectedPayment} />
                            )}
                          </DialogContent>
                        </Dialog>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="outstanding" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Créances en cours</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {payments
                  .filter((p) => p.montantRestant > 0)
                  .map((payment) => (
                    <div
                      key={payment.id}
                      className="flex items-center justify-between p-4 border rounded-lg"
                    >
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <span className="font-medium">
                            {payment.patientName}
                          </span>
                          {payment.statut === "en_retard" && (
                            <Badge variant="destructive" className="text-xs">
                              En retard
                            </Badge>
                          )}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {payment.description} • {payment.numeroFacture}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          Échéance:{" "}
                          {format(parseISO(payment.dateDue), "dd MMMM yyyy", {
                            locale: fr,
                          })}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-lg font-bold text-red-600">
                          {payment.montantRestant} DH
                        </div>
                        <div className="text-sm text-muted-foreground">
                          sur {payment.montantDu} DH
                        </div>
                      </div>
                      <div className="ml-4">
                        <Button size="sm" variant="outline">
                          Rappeler
                        </Button>
                      </div>
                    </div>
                  ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="reports" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <PieChart className="w-5 h-5" />
                  Répartition par méthode de paiement
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {["carte", "especes", "assurance", "virement", "cheque"].map(
                    (methode) => {
                      const count = payments.filter(
                        (p) => p.methode === methode,
                      ).length;
                      const percentage = (count / payments.length) * 100;
                      return (
                        <div key={methode} className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span className="capitalize">{methode}</span>
                            <span>
                              {count} ({percentage.toFixed(1)}%)
                            </span>
                          </div>
                          <Progress value={percentage} className="h-2" />
                        </div>
                      );
                    },
                  )}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="w-5 h-5" />
                  Répartition par type de service
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {[
                    "consultation",
                    "traitement",
                    "examen",
                    "medicament",
                    "autre",
                  ].map((type) => {
                    const total = payments
                      .filter((p) => p.type === type)
                      .reduce((sum, p) => sum + p.montantPaye, 0);
                    const maxTotal = Math.max(
                      ...[
                        "consultation",
                        "traitement",
                        "examen",
                        "medicament",
                        "autre",
                      ].map((t) =>
                        payments
                          .filter((p) => p.type === t)
                          .reduce((sum, p) => sum + p.montantPaye, 0),
                      ),
                    );
                    const percentage =
                      maxTotal > 0 ? (total / maxTotal) * 100 : 0;
                    return (
                      <div key={type} className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="capitalize">{type}</span>
                          <span>{total.toFixed(0)} DH</span>
                        </div>
                        <Progress value={percentage} className="h-2" />
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {/* Empty State */}
      {filteredPayments.length === 0 && (
        <Card>
          <CardContent className="text-center py-8">
            <DollarSign className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium mb-2">Aucun paiement trouvé</h3>
            <p className="text-muted-foreground mb-4">
              {searchTerm
                ? "Aucun paiement ne correspond à votre recherche"
                : "Commencez par enregistrer votre premier paiement"}
            </p>
            <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="w-4 h-4 mr-2" />
                  Nouveau Paiement
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>Enregistrer un nouveau paiement</DialogTitle>
                </DialogHeader>
                <AddPaymentForm />
              </DialogContent>
            </Dialog>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
