import { useState } from "react";
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
import {
  Plus,
  Search,
  Filter,
  Eye,
  Edit,
  Phone,
  Mail,
  Calendar,
  MapPin,
  FileText,
  Stethoscope,
  Clock,
  DollarSign,
  User,
  Heart,
  Activity,
} from "lucide-react";

interface Patient {
  id: string;
  nom: string;
  prenom: string;
  dateNaissance: string;
  age: number;
  telephone: string;
  email: string;
  adresse: string;
  sexe: "M" | "F";
  groupeSanguin: string;
  dateInscription: string;
  statut: "actif" | "inactif";
  dernierRendezVous: string;
  prochainRendezVous?: string;
  allergies: string[];
  antecedents: string;
  traitements: Treatment[];
  seances: Session[];
  paiements: Payment[];
}

interface Treatment {
  id: string;
  nom: string;
  description: string;
  dateDebut: string;
  dateFin?: string;
  statut: "en_cours" | "termine" | "suspendu";
  medecin: string;
  notes: string;
}

interface Session {
  id: string;
  date: string;
  heure: string;
  type: string;
  duree: number;
  medecin: string;
  notes: string;
  statut: "programmee" | "terminee" | "annulee";
}

interface Payment {
  id: string;
  date: string;
  montant: number;
  methode: "especes" | "carte" | "cheque" | "virement";
  description: string;
  statut: "paye" | "en_attente" | "partiel";
}

const mockPatients: Patient[] = [
  {
    id: "1",
    nom: "Benali",
    prenom: "Amina",
    dateNaissance: "1985-03-15",
    age: 39,
    telephone: "+212 6 12 34 56 78",
    email: "amina.benali@email.com",
    adresse: "123 Rue Hassan II, Casablanca",
    sexe: "F",
    groupeSanguin: "A+",
    dateInscription: "2023-01-15",
    statut: "actif",
    dernierRendezVous: "2024-01-15",
    prochainRendezVous: "2024-01-22",
    allergies: ["Pénicilline"],
    antecedents: "Hypertension",
    traitements: [
      {
        id: "t1",
        nom: "Traitement Hypertension",
        description: "Contrôle de la tension artérielle",
        dateDebut: "2023-06-01",
        statut: "en_cours",
        medecin: "Dr. Alami",
        notes: "Surveillance régulière",
      },
    ],
    seances: [
      {
        id: "s1",
        date: "2024-01-15",
        heure: "10:00",
        type: "Consultation",
        duree: 30,
        medecin: "Dr. Alami",
        notes: "Contrôle tension",
        statut: "terminee",
      },
    ],
    paiements: [
      {
        id: "p1",
        date: "2024-01-15",
        montant: 300,
        methode: "carte",
        description: "Consultation",
        statut: "paye",
      },
    ],
  },
  {
    id: "2",
    nom: "Alami",
    prenom: "Mohammed",
    dateNaissance: "1978-07-22",
    age: 45,
    telephone: "+212 6 98 76 54 32",
    email: "mohammed.alami@email.com",
    adresse: "456 Avenue Mohammed V, Rabat",
    sexe: "M",
    groupeSanguin: "O-",
    dateInscription: "2023-03-10",
    statut: "actif",
    dernierRendezVous: "2024-01-10",
    allergies: [],
    antecedents: "Diabète type 2",
    traitements: [
      {
        id: "t2",
        nom: "Traitement Diabète",
        description: "Gestion du diabète type 2",
        dateDebut: "2023-03-10",
        statut: "en_cours",
        medecin: "Dr. Bennani",
        notes: "Régime alimentaire strict",
      },
    ],
    seances: [],
    paiements: [],
  },
  {
    id: "3",
    nom: "Zahara",
    prenom: "Fatima",
    dateNaissance: "1992-11-08",
    age: 31,
    telephone: "+212 6 11 22 33 44",
    email: "fatima.zahara@email.com",
    adresse: "789 Rue Allal Ben Abdellah, Fès",
    sexe: "F",
    groupeSanguin: "B+",
    dateInscription: "2023-05-20",
    statut: "actif",
    dernierRendezVous: "2024-01-08",
    prochainRendezVous: "2024-01-25",
    allergies: ["Aspirine"],
    antecedents: "Aucun",
    traitements: [],
    seances: [],
    paiements: [],
  },
];

export default function Patients() {
  const [patients] = useState<Patient[]>(mockPatients);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState<string>("tous");
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);

  const filteredPatients = patients.filter((patient) => {
    const matchesSearch =
      patient.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
      patient.prenom.toLowerCase().includes(searchTerm.toLowerCase()) ||
      patient.telephone.includes(searchTerm);

    const matchesFilter =
      filterStatus === "tous" || patient.statut === filterStatus;

    return matchesSearch && matchesFilter;
  });

  const getStatusBadge = (statut: string) => {
    switch (statut) {
      case "actif":
        return (
          <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
            Actif
          </Badge>
        );
      case "inactif":
        return (
          <Badge className="bg-gray-100 text-gray-800 hover:bg-gray-100">
            Inactif
          </Badge>
        );
      default:
        return null;
    }
  };

  const getTreatmentStatusBadge = (statut: string) => {
    switch (statut) {
      case "en_cours":
        return (
          <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100">
            En cours
          </Badge>
        );
      case "termine":
        return (
          <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
            Terminé
          </Badge>
        );
      case "suspendu":
        return (
          <Badge className="bg-orange-100 text-orange-800 hover:bg-orange-100">
            Suspendu
          </Badge>
        );
      default:
        return null;
    }
  };

  const getSessionStatusBadge = (statut: string) => {
    switch (statut) {
      case "programmee":
        return (
          <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100">
            Programmée
          </Badge>
        );
      case "terminee":
        return (
          <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
            Terminée
          </Badge>
        );
      case "annulee":
        return (
          <Badge className="bg-red-100 text-red-800 hover:bg-red-100">
            Annulée
          </Badge>
        );
      default:
        return null;
    }
  };

  const AddPatientForm = () => (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="nom">Nom *</Label>
          <Input id="nom" placeholder="Nom de famille" />
        </div>
        <div>
          <Label htmlFor="prenom">Prénom *</Label>
          <Input id="prenom" placeholder="Prénom" />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="dateNaissance">Date de naissance *</Label>
          <Input id="dateNaissance" type="date" />
        </div>
        <div>
          <Label htmlFor="sexe">Sexe *</Label>
          <Select>
            <SelectTrigger>
              <SelectValue placeholder="Sélectionner" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="M">Masculin</SelectItem>
              <SelectItem value="F">Féminin</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="telephone">Téléphone *</Label>
          <Input id="telephone" placeholder="+212 6 XX XX XX XX" />
        </div>
        <div>
          <Label htmlFor="email">Email</Label>
          <Input id="email" type="email" placeholder="email@exemple.com" />
        </div>
      </div>

      <div>
        <Label htmlFor="adresse">Adresse</Label>
        <Input id="adresse" placeholder="Adresse complète" />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="groupeSanguin">Groupe sanguin</Label>
          <Select>
            <SelectTrigger>
              <SelectValue placeholder="Sélectionner" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="A+">A+</SelectItem>
              <SelectItem value="A-">A-</SelectItem>
              <SelectItem value="B+">B+</SelectItem>
              <SelectItem value="B-">B-</SelectItem>
              <SelectItem value="AB+">AB+</SelectItem>
              <SelectItem value="AB-">AB-</SelectItem>
              <SelectItem value="O+">O+</SelectItem>
              <SelectItem value="O-">O-</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div>
        <Label htmlFor="allergies">Allergies connues</Label>
        <Input id="allergies" placeholder="Séparer par des virgules" />
      </div>

      <div>
        <Label htmlFor="antecedents">Antécédents médicaux</Label>
        <Textarea id="antecedents" placeholder="Historique médical pertinent" />
      </div>

      <div className="flex justify-end gap-2 pt-4">
        <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
          Annuler
        </Button>
        <Button onClick={() => setIsAddDialogOpen(false)}>
          Enregistrer le patient
        </Button>
      </div>
    </div>
  );

  const PatientDetailsDialog = ({ patient }: { patient: Patient }) => (
    <div className="max-w-4xl">
      <Tabs defaultValue="infos" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="infos">Informations</TabsTrigger>
          <TabsTrigger value="traitements">Traitements</TabsTrigger>
          <TabsTrigger value="seances">Séances</TabsTrigger>
          <TabsTrigger value="paiements">Paiements</TabsTrigger>
        </TabsList>

        <TabsContent value="infos" className="space-y-4">
          <div className="grid grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="w-5 h-5" />
                  Informations personnelles
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Nom complet:</span>
                  <span className="font-medium">
                    {patient.prenom} {patient.nom}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Âge:</span>
                  <span>{patient.age} ans</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Sexe:</span>
                  <span>{patient.sexe === "M" ? "Masculin" : "Féminin"}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Groupe sanguin:</span>
                  <span>{patient.groupeSanguin}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Statut:</span>
                  {getStatusBadge(patient.statut)}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Phone className="w-5 h-5" />
                  Contact
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center gap-2">
                  <Phone className="w-4 h-4 text-muted-foreground" />
                  <span>{patient.telephone}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Mail className="w-4 h-4 text-muted-foreground" />
                  <span>{patient.email}</span>
                </div>
                <div className="flex items-start gap-2">
                  <MapPin className="w-4 h-4 text-muted-foreground mt-1" />
                  <span className="text-sm">{patient.adresse}</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Heart className="w-5 h-5" />
                  Informations médicales
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <span className="text-muted-foreground text-sm">
                    Allergies:
                  </span>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {patient.allergies.length > 0 ? (
                      patient.allergies.map((allergie, index) => (
                        <Badge key={index} variant="destructive">
                          {allergie}
                        </Badge>
                      ))
                    ) : (
                      <span className="text-sm text-muted-foreground">
                        Aucune allergie connue
                      </span>
                    )}
                  </div>
                </div>
                <div>
                  <span className="text-muted-foreground text-sm">
                    Antécédents:
                  </span>
                  <p className="text-sm mt-1">
                    {patient.antecedents || "Aucun antécédent"}
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="w-5 h-5" />
                  Rendez-vous
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Dernier RDV:</span>
                  <span className="text-sm">
                    {new Date(patient.dernierRendezVous).toLocaleDateString(
                      "fr-FR",
                    )}
                  </span>
                </div>
                {patient.prochainRendezVous && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Prochain RDV:</span>
                    <span className="text-sm font-medium text-primary">
                      {new Date(patient.prochainRendezVous).toLocaleDateString(
                        "fr-FR",
                      )}
                    </span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-muted-foreground">
                    Date d'inscription:
                  </span>
                  <span className="text-sm">
                    {new Date(patient.dateInscription).toLocaleDateString(
                      "fr-FR",
                    )}
                  </span>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="traitements" className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold">Traitements en cours</h3>
            <Button size="sm">
              <Plus className="w-4 h-4 mr-2" />
              Nouveau traitement
            </Button>
          </div>
          <div className="space-y-3">
            {patient.traitements.map((traitement) => (
              <Card key={traitement.id}>
                <CardContent className="p-4">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h4 className="font-medium">{traitement.nom}</h4>
                        {getTreatmentStatusBadge(traitement.statut)}
                      </div>
                      <p className="text-sm text-muted-foreground mb-2">
                        {traitement.description}
                      </p>
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="text-muted-foreground">
                            Date début:
                          </span>
                          <span className="ml-2">
                            {new Date(traitement.dateDebut).toLocaleDateString(
                              "fr-FR",
                            )}
                          </span>
                        </div>
                        <div>
                          <span className="text-muted-foreground">
                            Médecin:
                          </span>
                          <span className="ml-2">{traitement.medecin}</span>
                        </div>
                      </div>
                      {traitement.notes && (
                        <p className="text-sm text-muted-foreground mt-2">
                          Notes: {traitement.notes}
                        </p>
                      )}
                    </div>
                    <Button variant="outline" size="sm">
                      <Edit className="w-4 h-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
            {patient.traitements.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                Aucun traitement enregistré
              </div>
            )}
          </div>
        </TabsContent>

        <TabsContent value="seances" className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold">Historique des séances</h3>
            <Button size="sm">
              <Plus className="w-4 h-4 mr-2" />
              Nouvelle séance
            </Button>
          </div>
          <div className="space-y-3">
            {patient.seances.map((seance) => (
              <Card key={seance.id}>
                <CardContent className="p-4">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h4 className="font-medium">{seance.type}</h4>
                        {getSessionStatusBadge(seance.statut)}
                      </div>
                      <div className="grid grid-cols-3 gap-4 text-sm">
                        <div>
                          <span className="text-muted-foreground">Date:</span>
                          <span className="ml-2">
                            {new Date(seance.date).toLocaleDateString("fr-FR")}
                          </span>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Heure:</span>
                          <span className="ml-2">{seance.heure}</span>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Durée:</span>
                          <span className="ml-2">{seance.duree} min</span>
                        </div>
                      </div>
                      <div className="text-sm mt-2">
                        <span className="text-muted-foreground">Médecin:</span>
                        <span className="ml-2">{seance.medecin}</span>
                      </div>
                      {seance.notes && (
                        <p className="text-sm text-muted-foreground mt-2">
                          Notes: {seance.notes}
                        </p>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
            {patient.seances.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                Aucune séance enregistrée
              </div>
            )}
          </div>
        </TabsContent>

        <TabsContent value="paiements" className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold">Historique des paiements</h3>
            <Button size="sm">
              <Plus className="w-4 h-4 mr-2" />
              Nouveau paiement
            </Button>
          </div>
          <div className="space-y-3">
            {patient.paiements.map((paiement) => (
              <Card key={paiement.id}>
                <CardContent className="p-4">
                  <div className="flex justify-between items-center">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-medium">
                          {paiement.montant} DH
                        </span>
                        <Badge
                          className={
                            paiement.statut === "paye"
                              ? "bg-green-100 text-green-800 hover:bg-green-100"
                              : "bg-orange-100 text-orange-800 hover:bg-orange-100"
                          }
                        >
                          {paiement.statut === "paye" ? "Payé" : "En attente"}
                        </Badge>
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {paiement.description} •{" "}
                        {new Date(paiement.date).toLocaleDateString("fr-FR")} •{" "}
                        {paiement.methode}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
            {patient.paiements.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                Aucun paiement enregistré
              </div>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Header Actions */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Gestion des Patients</h1>
          <p className="text-muted-foreground">
            {filteredPatients.length} patient(s) trouvé(s)
          </p>
        </div>

        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus className="w-4 h-4" />
              Nouveau Patient
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Ajouter un nouveau patient</DialogTitle>
            </DialogHeader>
            <AddPatientForm />
          </DialogContent>
        </Dialog>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Rechercher par nom, prénom ou téléphone..."
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
                <SelectItem value="actif">Actif</SelectItem>
                <SelectItem value="inactif">Inactif</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Patients Table */}
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Patient</TableHead>
                <TableHead>Contact</TableHead>
                <TableHead>Âge</TableHead>
                <TableHead>Statut</TableHead>
                <TableHead>Dernier RDV</TableHead>
                <TableHead>Prochain RDV</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredPatients.map((patient) => (
                <TableRow key={patient.id}>
                  <TableCell>
                    <div>
                      <div className="font-medium">
                        {patient.prenom} {patient.nom}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {patient.sexe === "M" ? "Masculin" : "Féminin"} •{" "}
                        {patient.groupeSanguin}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm">
                      <div className="flex items-center gap-1">
                        <Phone className="w-3 h-3" />
                        {patient.telephone}
                      </div>
                      <div className="flex items-center gap-1 text-muted-foreground">
                        <Mail className="w-3 h-3" />
                        {patient.email}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>{patient.age} ans</TableCell>
                  <TableCell>{getStatusBadge(patient.statut)}</TableCell>
                  <TableCell>
                    {new Date(patient.dernierRendezVous).toLocaleDateString(
                      "fr-FR",
                    )}
                  </TableCell>
                  <TableCell>
                    {patient.prochainRendezVous ? (
                      <span className="text-primary font-medium">
                        {new Date(
                          patient.prochainRendezVous,
                        ).toLocaleDateString("fr-FR")}
                      </span>
                    ) : (
                      <span className="text-muted-foreground">-</span>
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex gap-2 justify-end">
                      <Dialog
                        open={
                          isViewDialogOpen && selectedPatient?.id === patient.id
                        }
                        onOpenChange={(open) => {
                          setIsViewDialogOpen(open);
                          if (!open) setSelectedPatient(null);
                        }}
                      >
                        <DialogTrigger asChild>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setSelectedPatient(patient)}
                          >
                            <Eye className="w-4 h-4" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
                          <DialogHeader>
                            <DialogTitle>
                              Dossier de {patient.prenom} {patient.nom}
                            </DialogTitle>
                          </DialogHeader>
                          {selectedPatient && (
                            <PatientDetailsDialog patient={selectedPatient} />
                          )}
                        </DialogContent>
                      </Dialog>
                      <Button variant="outline" size="sm">
                        <Edit className="w-4 h-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {filteredPatients.length === 0 && (
        <Card>
          <CardContent className="text-center py-8">
            <User className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium mb-2">Aucun patient trouvé</h3>
            <p className="text-muted-foreground mb-4">
              {searchTerm
                ? "Aucun patient ne correspond à votre recherche"
                : "Commencez par ajouter votre premier patient"}
            </p>
            <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="w-4 h-4 mr-2" />
                  Ajouter un patient
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>Ajouter un nouveau patient</DialogTitle>
                </DialogHeader>
                <AddPatientForm />
              </DialogContent>
            </Dialog>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
