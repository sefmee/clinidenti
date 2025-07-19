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
import {
  Plus,
  Search,
  Filter,
  Eye,
  Edit,
  Download,
  Pill,
  FileText,
  User,
  Calendar,
  Trash2,
  PrinterIcon,
  Send,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { format, parseISO } from "date-fns";
import { fr } from "date-fns/locale";

interface Medication {
  id: string;
  name: string;
  dosage: string;
  frequency: string;
  duration: string;
  instructions: string;
  category: string;
  contraindications?: string;
  sideEffects?: string;
}

interface Prescription {
  id: string;
  patientId: string;
  patientName: string;
  patientAge: number;
  patientWeight?: number;
  date: string;
  doctor: string;
  medications: PrescribedMedication[];
  diagnosis: string;
  symptoms: string;
  notes: string;
  status: "brouillon" | "envoyee" | "delivree" | "annulee";
  pharmacie?: string;
  dateDelivery?: string;
}

interface PrescribedMedication extends Medication {
  prescriptionId: string;
  customDosage?: string;
  customFrequency?: string;
  customDuration?: string;
  customInstructions?: string;
}

const medicationDatabase: Medication[] = [
  {
    id: "1",
    name: "Amoxicilline",
    dosage: "500mg",
    frequency: "3 fois par jour",
    duration: "7 jours",
    instructions: "À prendre après les repas",
    category: "Antibiotique",
    contraindications: "Allergie aux pénicillines",
    sideEffects: "Nausées, diarrhée, éruptions cutanées",
  },
  {
    id: "2",
    name: "Ibuprofène",
    dosage: "400mg",
    frequency: "3 fois par jour",
    duration: "5 jours",
    instructions: "À prendre avec de la nourriture",
    category: "Anti-inflammatoire",
    contraindications: "Ulcère gastrique, insuffisance rénale",
    sideEffects: "Maux d'estomac, vertiges",
  },
  {
    id: "3",
    name: "Paracétamol",
    dosage: "1000mg",
    frequency: "3 fois par jour",
    duration: "5 jours",
    instructions: "Maximum 4g par jour",
    category: "Antalgique",
    contraindications: "Insuffisance hépatique sévère",
    sideEffects: "Rares aux doses thérapeutiques",
  },
  {
    id: "4",
    name: "Chlorhexidine",
    dosage: "0.12%",
    frequency: "2 fois par jour",
    duration: "10 jours",
    instructions: "Bain de bouche après brossage",
    category: "Antiseptique",
    contraindications: "Hypersensibilité à la chlorhexidine",
    sideEffects: "Coloration des dents, altération du goût",
  },
  {
    id: "5",
    name: "Codéine",
    dosage: "30mg",
    frequency: "4 fois par jour",
    duration: "3 jours",
    instructions: "En cas de douleur intense",
    category: "Antalgique opiacé",
    contraindications: "Insuffisance respiratoire, enfants < 12 ans",
    sideEffects: "Somnolence, constipation, nausées",
  },
  {
    id: "6",
    name: "Métronidazole",
    dosage: "500mg",
    frequency: "2 fois par jour",
    duration: "7 jours",
    instructions: "Éviter l'alcool",
    category: "Antibiotique",
    contraindications: "Grossesse 1er trimestre",
    sideEffects: "Goût métallique, nausées",
  },
  {
    id: "7",
    name: "Diclofénac",
    dosage: "50mg",
    frequency: "2 fois par jour",
    duration: "5 jours",
    instructions: "Après les repas",
    category: "Anti-inflammatoire",
    contraindications: "Ulcère gastroduodénal",
    sideEffects: "Troubles digestifs",
  },
  {
    id: "8",
    name: "Prednisolone",
    dosage: "20mg",
    frequency: "1 fois par jour",
    duration: "5 jours",
    instructions: "Le matin avec de la nourriture",
    category: "Corticoïde",
    contraindications: "Infections virales, mycosiques",
    sideEffects: "Insomnie, augmentation de l'appétit",
  },
];

const mockPrescriptions: Prescription[] = [
  {
    id: "ORD-2024-001",
    patientId: "1",
    patientName: "Amina Benali",
    patientAge: 39,
    patientWeight: 65,
    date: "2024-01-15",
    doctor: "Dr. Zahir",
    medications: [
      {
        ...medicationDatabase[0],
        prescriptionId: "ORD-2024-001",
        customInstructions: "Bien terminer le traitement même si amélioration",
      },
      {
        ...medicationDatabase[1],
        prescriptionId: "ORD-2024-001",
        customDuration: "3 jours",
      },
    ],
    diagnosis: "Infection dentaire",
    symptoms: "Douleur intense, gonflement",
    notes: "Patient allergique à l'aspirine",
    status: "envoyee",
    pharmacie: "Pharmacie Centrale",
    dateDelivery: "2024-01-15",
  },
  {
    id: "ORD-2024-002",
    patientId: "2",
    patientName: "Mohammed Alami",
    patientAge: 45,
    date: "2024-01-12",
    doctor: "Dr. Lahlou",
    medications: [
      {
        ...medicationDatabase[3],
        prescriptionId: "ORD-2024-002",
      },
    ],
    diagnosis: "Gingivite",
    symptoms: "Saignement gingival",
    notes: "Améliorer l'hygiène bucco-dentaire",
    status: "delivree",
    pharmacie: "Pharmacie Atlas",
    dateDelivery: "2024-01-12",
  },
];

export default function Prescriptions() {
  const [prescriptions, setPrescriptions] =
    useState<Prescription[]>(mockPrescriptions);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState<string>("tous");
  const [selectedPrescription, setSelectedPrescription] =
    useState<Prescription | null>(null);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [selectedMedications, setSelectedMedications] = useState<Medication[]>(
    [],
  );
  const [currentPatient, setCurrentPatient] = useState<string>("");

  const filteredPrescriptions = prescriptions.filter((prescription) => {
    const matchesSearch =
      prescription.patientName
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      prescription.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      prescription.diagnosis.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      filterStatus === "tous" || prescription.status === filterStatus;

    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "brouillon":
        return (
          <Badge className="bg-gray-100 text-gray-800 hover:bg-gray-100">
            Brouillon
          </Badge>
        );
      case "envoyee":
        return (
          <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100">
            <Send className="w-3 h-3 mr-1" />
            Envoyée
          </Badge>
        );
      case "delivree":
        return (
          <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
            <FileText className="w-3 h-3 mr-1" />
            Délivrée
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

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "Antibiotique":
        return "bg-red-100 text-red-800";
      case "Anti-inflammatoire":
        return "bg-orange-100 text-orange-800";
      case "Antalgique":
        return "bg-blue-100 text-blue-800";
      case "Antiseptique":
        return "bg-green-100 text-green-800";
      case "Corticoïde":
        return "bg-purple-100 text-purple-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const addMedication = (medication: Medication) => {
    if (!selectedMedications.find((m) => m.id === medication.id)) {
      setSelectedMedications([...selectedMedications, medication]);
    }
  };

  const removeMedication = (medicationId: string) => {
    setSelectedMedications(
      selectedMedications.filter((m) => m.id !== medicationId),
    );
  };

  const PrescriptionForm = () => (
    <div className="space-y-6">
      {/* Patient Info */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="patient">Patient *</Label>
          <Select value={currentPatient} onValueChange={setCurrentPatient}>
            <SelectTrigger>
              <SelectValue placeholder="Sélectionner un patient" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1">Amina Benali (39 ans)</SelectItem>
              <SelectItem value="2">Mohammed Alami (45 ans)</SelectItem>
              <SelectItem value="3">Fatima Zahara (31 ans)</SelectItem>
            </SelectContent>
          </Select>
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

      {/* Diagnosis */}
      <div className="grid grid-cols-1 gap-4">
        <div>
          <Label htmlFor="diagnosis">Diagnostic *</Label>
          <Input id="diagnosis" placeholder="Diagnostic principal" />
        </div>
        <div>
          <Label htmlFor="symptoms">Symptômes</Label>
          <Textarea id="symptoms" placeholder="Description des symptômes" />
        </div>
      </div>

      {/* Medication Database */}
      <div>
        <Label>Base de données de médicaments</Label>
        <div className="mt-2 max-h-80 overflow-y-auto border rounded-lg">
          <div className="grid gap-2 p-4">
            {medicationDatabase.map((med) => (
              <div
                key={med.id}
                className="flex items-start justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
              >
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="font-medium">{med.name}</span>
                    <Badge className={getCategoryColor(med.category)}>
                      {med.category}
                    </Badge>
                  </div>
                  <div className="text-sm text-muted-foreground space-y-1">
                    <div>
                      <strong>Dosage:</strong> {med.dosage} • {med.frequency} •{" "}
                      {med.duration}
                    </div>
                    <div>
                      <strong>Instructions:</strong> {med.instructions}
                    </div>
                    {med.contraindications && (
                      <div className="text-red-600">
                        <strong>Contre-indications:</strong>{" "}
                        {med.contraindications}
                      </div>
                    )}
                    {med.sideEffects && (
                      <div className="text-orange-600">
                        <strong>Effets secondaires:</strong> {med.sideEffects}
                      </div>
                    )}
                  </div>
                </div>
                <Button
                  size="sm"
                  onClick={() => addMedication(med)}
                  disabled={selectedMedications.some((m) => m.id === med.id)}
                >
                  {selectedMedications.some((m) => m.id === med.id)
                    ? "Ajouté"
                    : "Ajouter"}
                </Button>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Selected Medications */}
      {selectedMedications.length > 0 && (
        <div>
          <Label>Médicaments prescrits ({selectedMedications.length})</Label>
          <div className="space-y-3 mt-2">
            {selectedMedications.map((med, index) => (
              <div key={med.id} className="border rounded-lg p-4 bg-blue-50/50">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <span className="font-medium">
                      {index + 1}. {med.name}
                    </span>
                    <Badge className={getCategoryColor(med.category)}>
                      {med.category}
                    </Badge>
                  </div>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => removeMedication(med.id)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <Label className="text-xs">Dosage</Label>
                    <Input
                      defaultValue={med.dosage}
                      className="text-sm"
                      placeholder="Ex: 500mg"
                    />
                  </div>
                  <div>
                    <Label className="text-xs">Fréquence</Label>
                    <Input
                      defaultValue={med.frequency}
                      className="text-sm"
                      placeholder="Ex: 3 fois par jour"
                    />
                  </div>
                  <div>
                    <Label className="text-xs">Durée</Label>
                    <Input
                      defaultValue={med.duration}
                      className="text-sm"
                      placeholder="Ex: 7 jours"
                    />
                  </div>
                </div>

                <div className="mt-3">
                  <Label className="text-xs">Instructions personnalisées</Label>
                  <Textarea
                    defaultValue={med.instructions}
                    className="text-sm"
                    placeholder="Instructions spéciales pour ce patient"
                    rows={2}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Notes */}
      <div>
        <Label htmlFor="prescriptionNotes">Notes et recommandations</Label>
        <Textarea
          id="prescriptionNotes"
          placeholder="Notes supplémentaires, recommandations, allergies connues..."
          rows={3}
        />
      </div>

      {/* Actions */}
      <div className="flex justify-between pt-4">
        <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
          Annuler
        </Button>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={() => setIsAddDialogOpen(false)}
            disabled={selectedMedications.length === 0}
          >
            Sauvegarder brouillon
          </Button>
          <Button
            onClick={() => setIsAddDialogOpen(false)}
            disabled={selectedMedications.length === 0}
          >
            Générer l'ordonnance
          </Button>
        </div>
      </div>
    </div>
  );

  const PrescriptionDetailsDialog = ({
    prescription,
  }: {
    prescription: Prescription;
  }) => (
    <div className="space-y-6">
      {/* Header */}
      <div className="border-b pb-4">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="text-lg font-semibold">
              Ordonnance {prescription.id}
            </h3>
            <div className="text-sm text-muted-foreground mt-1">
              {format(parseISO(prescription.date), "dd MMMM yyyy", {
                locale: fr,
              })}{" "}
              • {prescription.doctor}
            </div>
          </div>
          {getStatusBadge(prescription.status)}
        </div>
      </div>

      {/* Patient Info */}
      <div className="grid grid-cols-2 gap-6">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <User className="w-4 h-4" />
              Informations Patient
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Nom:</span>
              <span className="font-medium">{prescription.patientName}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Âge:</span>
              <span>{prescription.patientAge} ans</span>
            </div>
            {prescription.patientWeight && (
              <div className="flex justify-between">
                <span className="text-muted-foreground">Poids:</span>
                <span>{prescription.patientWeight} kg</span>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <FileText className="w-4 h-4" />
              Diagnostic
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div>
              <span className="text-muted-foreground">Diagnostic:</span>
              <p className="font-medium">{prescription.diagnosis}</p>
            </div>
            {prescription.symptoms && (
              <div>
                <span className="text-muted-foreground">Symptômes:</span>
                <p>{prescription.symptoms}</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Medications */}
      <div>
        <h4 className="font-semibold mb-4 flex items-center gap-2">
          <Pill className="w-4 h-4" />
          Médicaments prescrits ({prescription.medications.length})
        </h4>
        <div className="space-y-3">
          {prescription.medications.map((med, index) => (
            <div key={med.id} className="border rounded-lg p-4">
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span className="font-medium">
                    {index + 1}. {med.name}
                  </span>
                  <Badge className={getCategoryColor(med.category)}>
                    {med.category}
                  </Badge>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4 text-sm mb-2">
                <div>
                  <span className="text-muted-foreground">Dosage:</span>
                  <div className="font-medium">
                    {med.customDosage || med.dosage}
                  </div>
                </div>
                <div>
                  <span className="text-muted-foreground">Fréquence:</span>
                  <div className="font-medium">
                    {med.customFrequency || med.frequency}
                  </div>
                </div>
                <div>
                  <span className="text-muted-foreground">Durée:</span>
                  <div className="font-medium">
                    {med.customDuration || med.duration}
                  </div>
                </div>
              </div>

              <div className="text-sm">
                <span className="text-muted-foreground">Instructions:</span>
                <p className="italic">
                  {med.customInstructions || med.instructions}
                </p>
              </div>

              {med.contraindications && (
                <div className="text-sm mt-2 p-2 bg-red-50 rounded text-red-700">
                  <strong>Attention:</strong> {med.contraindications}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Notes */}
      {prescription.notes && (
        <div>
          <h4 className="font-semibold mb-2">Notes et recommandations</h4>
          <div className="p-4 bg-muted rounded-lg">
            <p className="text-sm">{prescription.notes}</p>
          </div>
        </div>
      )}

      {/* Delivery Info */}
      {prescription.pharmacie && (
        <div>
          <h4 className="font-semibold mb-2">Informations de délivrance</h4>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-muted-foreground">Pharmacie:</span>
              <div className="font-medium">{prescription.pharmacie}</div>
            </div>
            {prescription.dateDelivery && (
              <div>
                <span className="text-muted-foreground">
                  Date de délivrance:
                </span>
                <div className="font-medium">
                  {format(parseISO(prescription.dateDelivery), "dd MMMM yyyy", {
                    locale: fr,
                  })}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Actions */}
      <div className="flex justify-between pt-4 border-t">
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Edit className="w-4 h-4 mr-2" />
            Modifier
          </Button>
          <Button variant="outline" size="sm">
            <PrinterIcon className="w-4 h-4 mr-2" />
            Imprimer
          </Button>
        </div>
        <div className="flex gap-2">
          {prescription.status === "brouillon" && (
            <Button size="sm">
              <Send className="w-4 h-4 mr-2" />
              Envoyer
            </Button>
          )}
          <Button variant="outline" size="sm">
            <Download className="w-4 h-4 mr-2" />
            PDF
          </Button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Ordonnances</h1>
          <p className="text-muted-foreground">
            Gestion des prescriptions médicales
          </p>
        </div>

        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus className="w-4 h-4" />
              Nouvelle Ordonnance
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Rédiger une nouvelle ordonnance</DialogTitle>
            </DialogHeader>
            <PrescriptionForm />
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <FileText className="w-5 h-5 text-blue-600" />
              <div>
                <div className="text-sm text-muted-foreground">Total</div>
                <div className="text-xl font-bold">{prescriptions.length}</div>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Send className="w-5 h-5 text-green-600" />
              <div>
                <div className="text-sm text-muted-foreground">Envoyées</div>
                <div className="text-xl font-bold">
                  {prescriptions.filter((p) => p.status === "envoyee").length}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <FileText className="w-5 h-5 text-purple-600" />
              <div>
                <div className="text-sm text-muted-foreground">Délivrées</div>
                <div className="text-xl font-bold">
                  {prescriptions.filter((p) => p.status === "delivree").length}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Edit className="w-5 h-5 text-orange-600" />
              <div>
                <div className="text-sm text-muted-foreground">Brouillons</div>
                <div className="text-xl font-bold">
                  {prescriptions.filter((p) => p.status === "brouillon").length}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Rechercher par patient, numéro d'ordonnance ou diagnostic..."
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
                <SelectItem value="brouillon">Brouillon</SelectItem>
                <SelectItem value="envoyee">Envoyée</SelectItem>
                <SelectItem value="delivree">Délivrée</SelectItem>
                <SelectItem value="annulee">Annulée</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Prescriptions Table */}
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>N° Ordonnance</TableHead>
                <TableHead>Patient</TableHead>
                <TableHead>Diagnostic</TableHead>
                <TableHead>Médicaments</TableHead>
                <TableHead>Médecin</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Statut</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredPrescriptions.map((prescription) => (
                <TableRow key={prescription.id}>
                  <TableCell>
                    <div className="font-medium">{prescription.id}</div>
                  </TableCell>
                  <TableCell>
                    <div className="font-medium">
                      {prescription.patientName}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {prescription.patientAge} ans
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="max-w-48 truncate">
                      {prescription.diagnosis}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm">
                      {prescription.medications.length} médicament(s)
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {prescription.medications
                        .slice(0, 2)
                        .map((m) => m.name)
                        .join(", ")}
                      {prescription.medications.length > 2 && "..."}
                    </div>
                  </TableCell>
                  <TableCell>{prescription.doctor}</TableCell>
                  <TableCell>
                    {format(parseISO(prescription.date), "dd/MM/yyyy")}
                  </TableCell>
                  <TableCell>{getStatusBadge(prescription.status)}</TableCell>
                  <TableCell className="text-right">
                    <Dialog
                      open={
                        isViewDialogOpen &&
                        selectedPrescription?.id === prescription.id
                      }
                      onOpenChange={(open) => {
                        setIsViewDialogOpen(open);
                        if (!open) setSelectedPrescription(null);
                      }}
                    >
                      <DialogTrigger asChild>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setSelectedPrescription(prescription)}
                        >
                          <Eye className="w-4 h-4" />
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                        <DialogHeader>
                          <DialogTitle>
                            Détails de l'ordonnance - {prescription.id}
                          </DialogTitle>
                        </DialogHeader>
                        {selectedPrescription && (
                          <PrescriptionDetailsDialog
                            prescription={selectedPrescription}
                          />
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

      {/* Empty State */}
      {filteredPrescriptions.length === 0 && (
        <Card>
          <CardContent className="text-center py-8">
            <Pill className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium mb-2">
              Aucune ordonnance trouvée
            </h3>
            <p className="text-muted-foreground mb-4">
              {searchTerm
                ? "Aucune ordonnance ne correspond à votre recherche"
                : "Commencez par rédiger votre première ordonnance"}
            </p>
            <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="w-4 h-4 mr-2" />
                  Nouvelle Ordonnance
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>Rédiger une nouvelle ordonnance</DialogTitle>
                </DialogHeader>
                <PrescriptionForm />
              </DialogContent>
            </Dialog>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
