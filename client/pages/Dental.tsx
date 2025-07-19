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
  Eye,
  Edit,
  Trash2,
  AlertCircle,
  CheckCircle,
  Clock,
  FileText,
  Stethoscope,
  Pill,
  Calendar,
  User,
  MapPin,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { format, addDays, parseISO } from "date-fns";
import { fr } from "date-fns/locale";

interface ToothProblem {
  id: string;
  toothNumber: number;
  patientId: string;
  patientName: string;
  problem: string;
  severity: "leger" | "moyen" | "severe" | "urgent";
  treatment: string;
  status: "en_attente" | "en_cours" | "termine" | "annule";
  sessions: ToothSession[];
  dateCreated: string;
  dateUpdated: string;
  notes: string;
  cost: number;
  paid: number;
}

interface ToothSession {
  id: string;
  date: string;
  duration: number;
  treatment: string;
  notes: string;
  status: "programmee" | "terminee" | "annulee";
  doctor: string;
  cost: number;
}

interface Prescription {
  id: string;
  patientId: string;
  patientName: string;
  date: string;
  doctor: string;
  medications: Medication[];
  diagnosis: string;
  notes: string;
  status: "brouillon" | "envoyee" | "delivree";
}

interface Medication {
  id: string;
  name: string;
  dosage: string;
  frequency: string;
  duration: string;
  instructions: string;
  category: string;
}

// Numérotation des dents selon le système FDI
const adultTeeth = [
  // Maxillaire droit
  { number: 18, name: "3ème molaire", quadrant: "maxillaire-droite" },
  { number: 17, name: "2ème molaire", quadrant: "maxillaire-droite" },
  { number: 16, name: "1ère molaire", quadrant: "maxillaire-droite" },
  { number: 15, name: "2ème prémolaire", quadrant: "maxillaire-droite" },
  { number: 14, name: "1ère prémolaire", quadrant: "maxillaire-droite" },
  { number: 13, name: "Canine", quadrant: "maxillaire-droite" },
  { number: 12, name: "Incisive latérale", quadrant: "maxillaire-droite" },
  { number: 11, name: "Incisive centrale", quadrant: "maxillaire-droite" },

  // Maxillaire gauche
  { number: 21, name: "Incisive centrale", quadrant: "maxillaire-gauche" },
  { number: 22, name: "Incisive latérale", quadrant: "maxillaire-gauche" },
  { number: 23, name: "Canine", quadrant: "maxillaire-gauche" },
  { number: 24, name: "1ère prémolaire", quadrant: "maxillaire-gauche" },
  { number: 25, name: "2ème prémolaire", quadrant: "maxillaire-gauche" },
  { number: 26, name: "1ère molaire", quadrant: "maxillaire-gauche" },
  { number: 27, name: "2ème molaire", quadrant: "maxillaire-gauche" },
  { number: 28, name: "3ème molaire", quadrant: "maxillaire-gauche" },

  // Mandibulaire gauche
  { number: 38, name: "3ème molaire", quadrant: "mandibulaire-gauche" },
  { number: 37, name: "2ème molaire", quadrant: "mandibulaire-gauche" },
  { number: 36, name: "1ère molaire", quadrant: "mandibulaire-gauche" },
  { number: 35, name: "2ème prémolaire", quadrant: "mandibulaire-gauche" },
  { number: 34, name: "1ère prémolaire", quadrant: "mandibulaire-gauche" },
  { number: 33, name: "Canine", quadrant: "mandibulaire-gauche" },
  { number: 32, name: "Incisive latérale", quadrant: "mandibulaire-gauche" },
  { number: 31, name: "Incisive centrale", quadrant: "mandibulaire-gauche" },

  // Mandibulaire droite
  { number: 41, name: "Incisive centrale", quadrant: "mandibulaire-droite" },
  { number: 42, name: "Incisive latérale", quadrant: "mandibulaire-droite" },
  { number: 43, name: "Canine", quadrant: "mandibulaire-droite" },
  { number: 44, name: "1ère prémolaire", quadrant: "mandibulaire-droite" },
  { number: 45, name: "2ème prémolaire", quadrant: "mandibulaire-droite" },
  { number: 46, name: "1ère molaire", quadrant: "mandibulaire-droite" },
  { number: 47, name: "2ème molaire", quadrant: "mandibulaire-droite" },
  { number: 48, name: "3ème molaire", quadrant: "mandibulaire-droite" },
];

const commonProblems = [
  "Carie superficielle",
  "Carie profonde",
  "Pulpite",
  "Gingivite",
  "Parodontite",
  "Abcès",
  "Fracture",
  "Sensibilité",
  "Usure",
  "Tartre",
];

const commonTreatments = [
  "Obturation",
  "Traitement de canal",
  "Couronne",
  "Bridge",
  "Extraction",
  "Détartrage",
  "Blanchiment",
  "Prothèse",
  "Implant",
  "Surveillance",
];

const medicationDatabase: Medication[] = [
  {
    id: "1",
    name: "Amoxicilline",
    dosage: "500mg",
    frequency: "3 fois par jour",
    duration: "7 jours",
    instructions: "À prendre après les repas",
    category: "Antibiotique",
  },
  {
    id: "2",
    name: "Ibuprofène",
    dosage: "400mg",
    frequency: "3 fois par jour",
    duration: "5 jours",
    instructions: "À prendre avec de la nourriture",
    category: "Anti-inflammatoire",
  },
  {
    id: "3",
    name: "Paracétamol",
    dosage: "1000mg",
    frequency: "3 fois par jour",
    duration: "5 jours",
    instructions: "Maximum 4g par jour",
    category: "Antalgique",
  },
  {
    id: "4",
    name: "Chlorhexidine",
    dosage: "0.12%",
    frequency: "2 fois par jour",
    duration: "10 jours",
    instructions: "Bain de bouche après brossage",
    category: "Antiseptique",
  },
  {
    id: "5",
    name: "Codéine",
    dosage: "30mg",
    frequency: "4 fois par jour",
    duration: "3 jours",
    instructions: "En cas de douleur intense",
    category: "Antalgique",
  },
  {
    id: "6",
    name: "Métronidazole",
    dosage: "500mg",
    frequency: "2 fois par jour",
    duration: "7 jours",
    instructions: "Éviter l'alcool",
    category: "Antibiotique",
  },
];

const mockToothProblems: ToothProblem[] = [
  {
    id: "1",
    toothNumber: 16,
    patientId: "1",
    patientName: "Amina Benali",
    problem: "Carie profonde",
    severity: "severe",
    treatment: "Traitement de canal",
    status: "en_cours",
    sessions: [
      {
        id: "s1",
        date: "2024-01-10",
        duration: 60,
        treatment: "Ouverture de la chambre pulpaire",
        notes: "Première séance de traitement endodontique",
        status: "terminee",
        doctor: "Dr. Zahir",
        cost: 800,
      },
      {
        id: "s2",
        date: "2024-01-24",
        duration: 45,
        treatment: "Mise en forme canalaire",
        notes: "Deuxième séance prévue",
        status: "programmee",
        doctor: "Dr. Zahir",
        cost: 600,
      },
    ],
    dateCreated: "2024-01-08",
    dateUpdated: "2024-01-10",
    notes: "Patient avec antécédents de douleurs nocturnes",
    cost: 1400,
    paid: 800,
  },
  {
    id: "2",
    toothNumber: 36,
    patientId: "2",
    patientName: "Mohammed Alami",
    problem: "Gingivite",
    severity: "moyen",
    treatment: "Détartrage",
    status: "termine",
    sessions: [
      {
        id: "s3",
        date: "2024-01-15",
        duration: 30,
        treatment: "Détartrage complet",
        notes: "Détartrage supra et sous-gingival",
        status: "terminee",
        doctor: "Dr. Lahlou",
        cost: 400,
      },
    ],
    dateCreated: "2024-01-12",
    dateUpdated: "2024-01-15",
    notes: "Amélioration de l'hygiène bucco-dentaire recommandée",
    cost: 400,
    paid: 400,
  },
];

export default function Dental() {
  const [toothProblems, setToothProblems] =
    useState<ToothProblem[]>(mockToothProblems);
  const [selectedTooth, setSelectedTooth] = useState<number | null>(null);
  const [selectedPatient, setSelectedPatient] = useState<string>("1");
  const [isAddProblemDialogOpen, setIsAddProblemDialogOpen] = useState(false);
  const [isPrescriptionDialogOpen, setIsPrescriptionDialogOpen] =
    useState(false);
  const [selectedMedications, setSelectedMedications] = useState<Medication[]>(
    [],
  );

  const getToothStatus = (toothNumber: number) => {
    const problems = toothProblems.filter(
      (p) => p.toothNumber === toothNumber && p.patientId === selectedPatient,
    );
    if (problems.length === 0) return "healthy";

    const hasUrgent = problems.some((p) => p.severity === "urgent");
    const hasSevere = problems.some((p) => p.severity === "severe");
    const hasActive = problems.some((p) => p.status === "en_cours");

    if (hasUrgent) return "urgent";
    if (hasSevere) return "severe";
    if (hasActive) return "treatment";
    return "problem";
  };

  const getToothColor = (status: string) => {
    switch (status) {
      case "healthy":
        return "fill-green-200 stroke-green-400";
      case "problem":
        return "fill-yellow-200 stroke-yellow-500";
      case "treatment":
        return "fill-blue-200 stroke-blue-500";
      case "severe":
        return "fill-orange-200 stroke-orange-500";
      case "urgent":
        return "fill-red-200 stroke-red-500";
      default:
        return "fill-gray-200 stroke-gray-400";
    }
  };

  const getSeverityBadge = (severity: string) => {
    switch (severity) {
      case "urgent":
        return (
          <Badge className="bg-red-100 text-red-800 hover:bg-red-100">
            Urgent
          </Badge>
        );
      case "severe":
        return (
          <Badge className="bg-orange-100 text-orange-800 hover:bg-orange-100">
            Sévère
          </Badge>
        );
      case "moyen":
        return (
          <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">
            Moyen
          </Badge>
        );
      case "leger":
        return (
          <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
            Léger
          </Badge>
        );
      default:
        return null;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "en_attente":
        return (
          <Badge className="bg-gray-100 text-gray-800 hover:bg-gray-100">
            <Clock className="w-3 h-3 mr-1" />
            En attente
          </Badge>
        );
      case "en_cours":
        return (
          <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100">
            <Stethoscope className="w-3 h-3 mr-1" />
            En cours
          </Badge>
        );
      case "termine":
        return (
          <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
            <CheckCircle className="w-3 h-3 mr-1" />
            Terminé
          </Badge>
        );
      case "annule":
        return (
          <Badge className="bg-red-100 text-red-800 hover:bg-red-100">
            Annulé
          </Badge>
        );
      default:
        return null;
    }
  };

  const ToothSVG = ({
    tooth,
    onClick,
  }: {
    tooth: any;
    onClick: () => void;
  }) => {
    const status = getToothStatus(tooth.number);
    const colorClass = getToothColor(status);

    return (
      <g
        onClick={onClick}
        className="cursor-pointer hover:opacity-80 transition-opacity"
        transform={`translate(${getToothPosition(tooth.number).x}, ${getToothPosition(tooth.number).y})`}
      >
        <rect
          width="25"
          height="35"
          rx="3"
          className={cn(colorClass, "transition-colors")}
          strokeWidth="2"
        />
        <text
          x="12.5"
          y="20"
          textAnchor="middle"
          className="text-xs font-medium fill-current"
          dy="0.35em"
        >
          {tooth.number}
        </text>
        {status !== "healthy" && (
          <circle cx="20" cy="5" r="3" className="fill-red-500" />
        )}
      </g>
    );
  };

  const getToothPosition = (toothNumber: number) => {
    // Positions pour organiser les dents en arcade
    const positions: { [key: number]: { x: number; y: number } } = {
      // Maxillaire droit (en haut à droite)
      18: { x: 250, y: 50 },
      17: { x: 220, y: 50 },
      16: { x: 190, y: 50 },
      15: { x: 160, y: 50 },
      14: { x: 130, y: 50 },
      13: { x: 100, y: 50 },
      12: { x: 70, y: 50 },
      11: { x: 40, y: 50 },

      // Maxillaire gauche (en haut à gauche)
      21: { x: 10, y: 50 },
      22: { x: -20, y: 50 },
      23: { x: -50, y: 50 },
      24: { x: -80, y: 50 },
      25: { x: -110, y: 50 },
      26: { x: -140, y: 50 },
      27: { x: -170, y: 50 },
      28: { x: -200, y: 50 },

      // Mandibulaire droite (en bas à droite)
      48: { x: 250, y: 150 },
      47: { x: 220, y: 150 },
      46: { x: 190, y: 150 },
      45: { x: 160, y: 150 },
      44: { x: 130, y: 150 },
      43: { x: 100, y: 150 },
      42: { x: 70, y: 150 },
      41: { x: 40, y: 150 },

      // Mandibulaire gauche (en bas à gauche)
      31: { x: 10, y: 150 },
      32: { x: -20, y: 150 },
      33: { x: -50, y: 150 },
      34: { x: -80, y: 150 },
      35: { x: -110, y: 150 },
      36: { x: -140, y: 150 },
      37: { x: -170, y: 150 },
      38: { x: -200, y: 150 },
    };

    return positions[toothNumber] || { x: 0, y: 0 };
  };

  const AddProblemForm = () => (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="toothNumber">Dent concernée *</Label>
          <Input
            id="toothNumber"
            type="number"
            value={selectedTooth || ""}
            onChange={(e) => setSelectedTooth(Number(e.target.value))}
            placeholder="Numéro de la dent"
          />
        </div>
        <div>
          <Label htmlFor="problem">Problème *</Label>
          <Select>
            <SelectTrigger>
              <SelectValue placeholder="Sélectionner le problème" />
            </SelectTrigger>
            <SelectContent>
              {commonProblems.map((problem) => (
                <SelectItem key={problem} value={problem}>
                  {problem}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="severity">Sévérité *</Label>
          <Select>
            <SelectTrigger>
              <SelectValue placeholder="Niveau de sévérité" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="leger">Léger</SelectItem>
              <SelectItem value="moyen">Moyen</SelectItem>
              <SelectItem value="severe">Sévère</SelectItem>
              <SelectItem value="urgent">Urgent</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label htmlFor="treatment">Traitement prévu *</Label>
          <Select>
            <SelectTrigger>
              <SelectValue placeholder="Sélectionner le traitement" />
            </SelectTrigger>
            <SelectContent>
              {commonTreatments.map((treatment) => (
                <SelectItem key={treatment} value={treatment}>
                  {treatment}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="cost">Coût estimé (DH)</Label>
          <Input id="cost" type="number" placeholder="0.00" />
        </div>
        <div>
          <Label htmlFor="sessions">Nombre de séances</Label>
          <Input id="sessions" type="number" placeholder="1" />
        </div>
      </div>

      <div>
        <Label htmlFor="notes">Notes et observations</Label>
        <Textarea
          id="notes"
          placeholder="Notes supplémentaires sur le diagnostic"
        />
      </div>

      <div className="flex justify-end gap-2 pt-4">
        <Button
          variant="outline"
          onClick={() => setIsAddProblemDialogOpen(false)}
        >
          Annuler
        </Button>
        <Button onClick={() => setIsAddProblemDialogOpen(false)}>
          Enregistrer le problème
        </Button>
      </div>
    </div>
  );

  const PrescriptionForm = () => (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="diagnosis">Diagnostic *</Label>
          <Input id="diagnosis" placeholder="Diagnostic principal" />
        </div>
        <div>
          <Label htmlFor="doctor">Médecin prescripteur *</Label>
          <Select>
            <SelectTrigger>
              <SelectValue placeholder="Sélectionner le médecin" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="dr-zahir">Dr. Zahir</SelectItem>
              <SelectItem value="dr-lahlou">Dr. Lahlou</SelectItem>
              <SelectItem value="dr-bennani">Dr. Bennani</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div>
        <Label>Médicaments suggérés</Label>
        <div className="grid grid-cols-1 gap-2 mt-2 max-h-60 overflow-y-auto">
          {medicationDatabase.map((med) => (
            <div
              key={med.id}
              className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50 cursor-pointer"
              onClick={() => {
                if (!selectedMedications.find((m) => m.id === med.id)) {
                  setSelectedMedications([...selectedMedications, med]);
                }
              }}
            >
              <div className="flex-1">
                <div className="font-medium">{med.name}</div>
                <div className="text-sm text-muted-foreground">
                  {med.dosage} • {med.frequency} • {med.category}
                </div>
              </div>
              <Button
                size="sm"
                variant={
                  selectedMedications.find((m) => m.id === med.id)
                    ? "default"
                    : "outline"
                }
              >
                {selectedMedications.find((m) => m.id === med.id)
                  ? "Ajouté"
                  : "Ajouter"}
              </Button>
            </div>
          ))}
        </div>
      </div>

      {selectedMedications.length > 0 && (
        <div>
          <Label>Médicaments sélectionnés</Label>
          <div className="space-y-2 mt-2">
            {selectedMedications.map((med) => (
              <div
                key={med.id}
                className="flex items-center justify-between p-3 bg-muted rounded-lg"
              >
                <div className="flex-1">
                  <div className="font-medium">
                    {med.name} {med.dosage}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {med.frequency} pendant {med.duration}
                  </div>
                  <div className="text-xs text-muted-foreground italic">
                    {med.instructions}
                  </div>
                </div>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() =>
                    setSelectedMedications(
                      selectedMedications.filter((m) => m.id !== med.id),
                    )
                  }
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            ))}
          </div>
        </div>
      )}

      <div>
        <Label htmlFor="prescriptionNotes">Instructions particulières</Label>
        <Textarea
          id="prescriptionNotes"
          placeholder="Instructions spéciales pour le patient"
        />
      </div>

      <div className="flex justify-end gap-2 pt-4">
        <Button
          variant="outline"
          onClick={() => setIsPrescriptionDialogOpen(false)}
        >
          Annuler
        </Button>
        <Button onClick={() => setIsPrescriptionDialogOpen(false)}>
          Générer l'ordonnance
        </Button>
      </div>
    </div>
  );

  const selectedPatientProblems = toothProblems.filter(
    (p) => p.patientId === selectedPatient,
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Interface Dentaire</h1>
          <p className="text-muted-foreground">
            Gestion des problèmes dentaires et prescriptions
          </p>
        </div>
        <div className="flex gap-2">
          <Dialog
            open={isPrescriptionDialogOpen}
            onOpenChange={setIsPrescriptionDialogOpen}
          >
            <DialogTrigger asChild>
              <Button variant="outline" className="gap-2">
                <Pill className="w-4 h-4" />
                Nouvelle Ordonnance
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-4xl">
              <DialogHeader>
                <DialogTitle>Rédiger une ordonnance</DialogTitle>
              </DialogHeader>
              <PrescriptionForm />
            </DialogContent>
          </Dialog>

          <Dialog
            open={isAddProblemDialogOpen}
            onOpenChange={setIsAddProblemDialogOpen}
          >
            <DialogTrigger asChild>
              <Button className="gap-2">
                <Plus className="w-4 h-4" />
                Nouveau Problème
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Ajouter un problème dentaire</DialogTitle>
              </DialogHeader>
              <AddProblemForm />
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Patient Selection */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center gap-4">
            <Label htmlFor="patientSelect">Patient sélectionné:</Label>
            <Select value={selectedPatient} onValueChange={setSelectedPatient}>
              <SelectTrigger className="w-64">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1">Amina Benali</SelectItem>
                <SelectItem value="2">Mohammed Alami</SelectItem>
                <SelectItem value="3">Fatima Zahara</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Dental Chart */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="w-5 h-5" />
              Diagramme Dentaire
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex justify-center">
              <svg viewBox="-250 0 500 250" className="w-full max-w-2xl h-64">
                {/* Background */}
                <rect x="-250" y="0" width="500" height="250" fill="#f8fafc" />

                {/* Quadrant labels */}
                <text
                  x="-100"
                  y="30"
                  textAnchor="middle"
                  className="text-sm font-medium fill-muted-foreground"
                >
                  Maxillaire Gauche
                </text>
                <text
                  x="100"
                  y="30"
                  textAnchor="middle"
                  className="text-sm font-medium fill-muted-foreground"
                >
                  Maxillaire Droite
                </text>
                <text
                  x="-100"
                  y="230"
                  textAnchor="middle"
                  className="text-sm font-medium fill-muted-foreground"
                >
                  Mandibulaire Gauche
                </text>
                <text
                  x="100"
                  y="230"
                  textAnchor="middle"
                  className="text-sm font-medium fill-muted-foreground"
                >
                  Mandibulaire Droite
                </text>

                {/* Center line */}
                <line
                  x1="0"
                  y1="40"
                  x2="0"
                  y2="210"
                  stroke="#e2e8f0"
                  strokeWidth="2"
                  strokeDasharray="5,5"
                />

                {/* Teeth */}
                {adultTeeth.map((tooth) => (
                  <ToothSVG
                    key={tooth.number}
                    tooth={tooth}
                    onClick={() => setSelectedTooth(tooth.number)}
                  />
                ))}
              </svg>
            </div>

            {/* Legend */}
            <div className="flex justify-center gap-6 mt-4 text-sm">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-green-200 border border-green-400 rounded"></div>
                <span>Saine</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-yellow-200 border border-yellow-500 rounded"></div>
                <span>Problème</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-blue-200 border border-blue-500 rounded"></div>
                <span>Traitement</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-orange-200 border border-orange-500 rounded"></div>
                <span>Sévère</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-red-200 border border-red-500 rounded"></div>
                <span>Urgent</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Tooth Details */}
        <Card>
          <CardHeader>
            <CardTitle>
              {selectedTooth
                ? `Dent ${selectedTooth}`
                : "Sélectionner une dent"}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {selectedTooth ? (
              <div className="space-y-4">
                {selectedPatientProblems
                  .filter((p) => p.toothNumber === selectedTooth)
                  .map((problem) => (
                    <div key={problem.id} className="border rounded-lg p-4">
                      <div className="flex items-start justify-between mb-2">
                        <div className="font-medium">{problem.problem}</div>
                        {getSeverityBadge(problem.severity)}
                      </div>
                      <div className="text-sm text-muted-foreground mb-2">
                        Traitement: {problem.treatment}
                      </div>
                      <div className="flex items-center gap-2 mb-2">
                        {getStatusBadge(problem.status)}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {problem.sessions.length} séance(s) • {problem.paid}/
                        {problem.cost} DH
                      </div>
                      {problem.notes && (
                        <div className="text-sm mt-2 p-2 bg-muted rounded">
                          {problem.notes}
                        </div>
                      )}
                    </div>
                  ))}

                {selectedPatientProblems.filter(
                  (p) => p.toothNumber === selectedTooth,
                ).length === 0 && (
                  <div className="text-center py-8 text-muted-foreground">
                    <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-2" />
                    <p>Dent saine</p>
                    <p className="text-xs">Aucun problème identifié</p>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <Eye className="w-12 h-12 mx-auto mb-2" />
                <p>Cliquez sur une dent pour voir les détails</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Problems List */}
      <Card>
        <CardHeader>
          <CardTitle>Problèmes actifs du patient</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {selectedPatientProblems.map((problem) => (
              <div
                key={problem.id}
                className="flex items-center justify-between p-4 border rounded-lg"
              >
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-medium">
                      Dent {problem.toothNumber}
                    </span>
                    <span className="text-muted-foreground">•</span>
                    <span>{problem.problem}</span>
                    {getSeverityBadge(problem.severity)}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {problem.treatment} • {problem.sessions.length} séance(s)
                  </div>
                  <div className="text-xs text-muted-foreground">
                    Créé le{" "}
                    {format(parseISO(problem.dateCreated), "dd MMMM yyyy", {
                      locale: fr,
                    })}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {getStatusBadge(problem.status)}
                  <Button variant="outline" size="sm">
                    <Eye className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ))}
            {selectedPatientProblems.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-4" />
                <h3 className="text-lg font-medium mb-2">
                  Aucun problème dentaire
                </h3>
                <p>
                  Ce patient n'a actuellement aucun problème dentaire
                  enregistré.
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
