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
import { Calendar } from "@/components/ui/calendar";
import {
  Plus,
  Search,
  Filter,
  Eye,
  Edit,
  Clock,
  User,
  Calendar as CalendarIcon,
  Phone,
  MapPin,
  CheckCircle,
  AlertCircle,
  XCircle,
  Stethoscope,
  FileText,
  Trash2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
  format,
  addDays,
  startOfWeek,
  endOfWeek,
  isSameDay,
  parseISO,
  isToday,
} from "date-fns";
import { fr } from "date-fns/locale";

interface Appointment {
  id: string;
  patientId: string;
  patientName: string;
  patientPhone: string;
  date: string;
  time: string;
  duration: number; // in minutes
  type: string;
  doctor: string;
  status:
    | "programmee"
    | "confirmee"
    | "en_cours"
    | "terminee"
    | "annulee"
    | "no_show";
  notes?: string;
  urgence: "normale" | "urgente" | "critique";
  salle?: string;
  motif: string;
  rappelEnvoye: boolean;
}

interface TimeSlot {
  time: string;
  available: boolean;
  appointmentId?: string;
}

const mockAppointments: Appointment[] = [
  {
    id: "1",
    patientId: "1",
    patientName: "Amina Benali",
    patientPhone: "+212 6 12 34 56 78",
    date: new Date().toISOString().split("T")[0],
    time: "09:00",
    duration: 30,
    type: "Consultation générale",
    doctor: "Dr. Alami",
    status: "confirmee",
    notes: "Contrôle routine",
    urgence: "normale",
    salle: "Cabinet 1",
    motif: "Consultation de routine",
    rappelEnvoye: true,
  },
  {
    id: "2",
    patientId: "2",
    patientName: "Mohammed Alami",
    patientPhone: "+212 6 98 76 54 32",
    date: new Date().toISOString().split("T")[0],
    time: "10:30",
    duration: 45,
    type: "Suivi cardiologique",
    doctor: "Dr. Bennani",
    status: "en_cours",
    notes: "Patient avec antécédents cardiaques",
    urgence: "urgente",
    salle: "Cabinet 2",
    motif: "Suivi cardiologique",
    rappelEnvoye: true,
  },
  {
    id: "3",
    patientId: "3",
    patientName: "Fatima Zahara",
    patientPhone: "+212 6 11 22 33 44",
    date: new Date().toISOString().split("T")[0],
    time: "14:00",
    duration: 30,
    type: "Contrôle diabète",
    doctor: "Dr. Alami",
    status: "programmee",
    notes: "",
    urgence: "normale",
    salle: "Cabinet 1",
    motif: "Contrôle glycémie",
    rappelEnvoye: false,
  },
  {
    id: "4",
    patientId: "1",
    patientName: "Amina Benali",
    patientPhone: "+212 6 12 34 56 78",
    date: addDays(new Date(), 1).toISOString().split("T")[0],
    time: "11:00",
    duration: 30,
    type: "Suivi traitement",
    doctor: "Dr. Alami",
    status: "programmee",
    notes: "Suivi hypertension",
    urgence: "normale",
    salle: "Cabinet 1",
    motif: "Suivi traitement hypertension",
    rappelEnvoye: false,
  },
  {
    id: "5",
    patientId: "2",
    patientName: "Mohammed Alami",
    patientPhone: "+212 6 98 76 54 32",
    date: addDays(new Date(), 2).toISOString().split("T")[0],
    time: "15:30",
    duration: 60,
    type: "Bilan complet",
    doctor: "Dr. Bennani",
    status: "programmee",
    notes: "Bilan annuel",
    urgence: "normale",
    salle: "Cabinet 2",
    motif: "Bilan de santé annuel",
    rappelEnvoye: false,
  },
];

const timeSlots = [
  "08:00",
  "08:30",
  "09:00",
  "09:30",
  "10:00",
  "10:30",
  "11:00",
  "11:30",
  "12:00",
  "12:30",
  "14:00",
  "14:30",
  "15:00",
  "15:30",
  "16:00",
  "16:30",
  "17:00",
  "17:30",
];

const consultationTypes = [
  "Consultation générale",
  "Consultation spécialisée",
  "Suivi traitement",
  "Contrôle",
  "Urgence",
  "Bilan de santé",
  "Vaccination",
  "Certificat médical",
];

const doctors = ["Dr. Alami", "Dr. Bennani", "Dr. Tazi", "Dr. Lazrak"];

const salles = [
  "Cabinet 1",
  "Cabinet 2",
  "Salle d'examen",
  "Salle de consultation",
];

export default function Appointments() {
  const [appointments, setAppointments] =
    useState<Appointment[]>(mockAppointments);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState<string>("tous");
  const [filterDoctor, setFilterDoctor] = useState<string>("tous");
  const [selectedAppointment, setSelectedAppointment] =
    useState<Appointment | null>(null);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [viewMode, setViewMode] = useState<"list" | "calendar" | "day">("list");

  const filteredAppointments = appointments.filter((appointment) => {
    const matchesSearch =
      appointment.patientName
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      appointment.patientPhone.includes(searchTerm) ||
      appointment.type.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      filterStatus === "tous" || appointment.status === filterStatus;

    const matchesDoctor =
      filterDoctor === "tous" || appointment.doctor === filterDoctor;

    return matchesSearch && matchesStatus && matchesDoctor;
  });

  const todayAppointments = appointments.filter((apt) =>
    isSameDay(parseISO(apt.date), new Date()),
  );

  const selectedDayAppointments = appointments
    .filter((apt) => isSameDay(parseISO(apt.date), selectedDate))
    .sort((a, b) => a.time.localeCompare(b.time));

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "programmee":
        return (
          <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100">
            <Clock className="w-3 h-3 mr-1" />
            Programmé
          </Badge>
        );
      case "confirmee":
        return (
          <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
            <CheckCircle className="w-3 h-3 mr-1" />
            Confirmé
          </Badge>
        );
      case "en_cours":
        return (
          <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">
            <AlertCircle className="w-3 h-3 mr-1" />
            En cours
          </Badge>
        );
      case "terminee":
        return (
          <Badge className="bg-gray-100 text-gray-800 hover:bg-gray-100">
            <CheckCircle className="w-3 h-3 mr-1" />
            Terminé
          </Badge>
        );
      case "annulee":
        return (
          <Badge className="bg-red-100 text-red-800 hover:bg-red-100">
            <XCircle className="w-3 h-3 mr-1" />
            Annulé
          </Badge>
        );
      case "no_show":
        return (
          <Badge className="bg-orange-100 text-orange-800 hover:bg-orange-100">
            <XCircle className="w-3 h-3 mr-1" />
            Absent
          </Badge>
        );
      default:
        return null;
    }
  };

  const getUrgencyBadge = (urgence: string) => {
    switch (urgence) {
      case "urgente":
        return (
          <Badge variant="destructive" className="text-xs">
            Urgent
          </Badge>
        );
      case "critique":
        return (
          <Badge className="bg-red-600 text-white hover:bg-red-600 text-xs">
            Critique
          </Badge>
        );
      default:
        return null;
    }
  };

  const updateAppointmentStatus = (
    appointmentId: string,
    newStatus: Appointment["status"],
  ) => {
    setAppointments((prev) =>
      prev.map((apt) =>
        apt.id === appointmentId ? { ...apt, status: newStatus } : apt,
      ),
    );
  };

  const AddAppointmentForm = () => (
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
          <Label htmlFor="doctor">Médecin *</Label>
          <Select>
            <SelectTrigger>
              <SelectValue placeholder="Sélectionner un médecin" />
            </SelectTrigger>
            <SelectContent>
              {doctors.map((doctor) => (
                <SelectItem key={doctor} value={doctor}>
                  {doctor}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="date">Date *</Label>
          <Input
            id="date"
            type="date"
            min={new Date().toISOString().split("T")[0]}
          />
        </div>
        <div>
          <Label htmlFor="time">Heure *</Label>
          <Select>
            <SelectTrigger>
              <SelectValue placeholder="Sélectionner l'heure" />
            </SelectTrigger>
            <SelectContent>
              {timeSlots.map((time) => (
                <SelectItem key={time} value={time}>
                  {time}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="type">Type de consultation *</Label>
          <Select>
            <SelectTrigger>
              <SelectValue placeholder="Sélectionner le type" />
            </SelectTrigger>
            <SelectContent>
              {consultationTypes.map((type) => (
                <SelectItem key={type} value={type}>
                  {type}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label htmlFor="duration">Durée (minutes) *</Label>
          <Select>
            <SelectTrigger>
              <SelectValue placeholder="Durée" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="15">15 minutes</SelectItem>
              <SelectItem value="30">30 minutes</SelectItem>
              <SelectItem value="45">45 minutes</SelectItem>
              <SelectItem value="60">60 minutes</SelectItem>
              <SelectItem value="90">90 minutes</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="urgence">Niveau d'urgence</Label>
          <Select defaultValue="normale">
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="normale">Normale</SelectItem>
              <SelectItem value="urgente">Urgente</SelectItem>
              <SelectItem value="critique">Critique</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label htmlFor="salle">Salle</Label>
          <Select>
            <SelectTrigger>
              <SelectValue placeholder="Sélectionner une salle" />
            </SelectTrigger>
            <SelectContent>
              {salles.map((salle) => (
                <SelectItem key={salle} value={salle}>
                  {salle}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div>
        <Label htmlFor="motif">Motif de consultation *</Label>
        <Input id="motif" placeholder="Raison de la visite" />
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
          Programmer le rendez-vous
        </Button>
      </div>
    </div>
  );

  const AppointmentDetailsDialog = ({
    appointment,
  }: {
    appointment: Appointment;
  }) => (
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
              <span className="font-medium">{appointment.patientName}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Téléphone:</span>
              <span>{appointment.patientPhone}</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <CalendarIcon className="w-4 h-4" />
              Détails RDV
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Date:</span>
              <span>
                {format(parseISO(appointment.date), "dd MMMM yyyy", {
                  locale: fr,
                })}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Heure:</span>
              <span>{appointment.time}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Durée:</span>
              <span>{appointment.duration} min</span>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <Stethoscope className="w-4 h-4" />
            Consultation
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-muted-foreground">Type:</span>
            <span>{appointment.type}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-muted-foreground">Médecin:</span>
            <span>{appointment.doctor}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-muted-foreground">Salle:</span>
            <span>{appointment.salle}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-muted-foreground">Statut:</span>
            {getStatusBadge(appointment.status)}
          </div>
          <div className="flex justify-between items-center">
            <span className="text-muted-foreground">Urgence:</span>
            <div className="flex gap-2">
              {getUrgencyBadge(appointment.urgence) || (
                <Badge variant="outline" className="text-xs">
                  Normale
                </Badge>
              )}
            </div>
          </div>
          <div>
            <span className="text-muted-foreground">Motif:</span>
            <p className="mt-1">{appointment.motif}</p>
          </div>
          {appointment.notes && (
            <div>
              <span className="text-muted-foreground">Notes:</span>
              <p className="mt-1 text-sm">{appointment.notes}</p>
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
            <Phone className="w-4 h-4 mr-2" />
            Appeler
          </Button>
        </div>
        <div className="flex gap-2">
          {appointment.status === "programmee" && (
            <Button
              size="sm"
              onClick={() =>
                updateAppointmentStatus(appointment.id, "confirmee")
              }
            >
              Confirmer
            </Button>
          )}
          {appointment.status === "confirmee" && (
            <Button
              size="sm"
              onClick={() =>
                updateAppointmentStatus(appointment.id, "en_cours")
              }
            >
              Démarrer
            </Button>
          )}
          {appointment.status === "en_cours" && (
            <Button
              size="sm"
              onClick={() =>
                updateAppointmentStatus(appointment.id, "terminee")
              }
            >
              Terminer
            </Button>
          )}
          <Button
            variant="destructive"
            size="sm"
            onClick={() => updateAppointmentStatus(appointment.id, "annulee")}
          >
            Annuler
          </Button>
        </div>
      </div>
    </div>
  );

  const CalendarView = () => (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <Card>
        <CardHeader>
          <CardTitle>Calendrier</CardTitle>
        </CardHeader>
        <CardContent>
          <Calendar
            mode="single"
            selected={selectedDate}
            onSelect={(date) => date && setSelectedDate(date)}
            locale={fr}
            className="rounded-md border"
          />
        </CardContent>
      </Card>

      <Card className="lg:col-span-2">
        <CardHeader>
          <CardTitle>
            Rendez-vous du{" "}
            {format(selectedDate, "dd MMMM yyyy", { locale: fr })}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {selectedDayAppointments.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                Aucun rendez-vous prévu pour cette date
              </div>
            ) : (
              selectedDayAppointments.map((appointment) => (
                <div
                  key={appointment.id}
                  className="flex items-center justify-between p-4 rounded-lg border bg-card/50 hover:bg-card transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <div className="text-center">
                      <div className="text-sm font-medium">
                        {appointment.time}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {appointment.duration}min
                      </div>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="font-medium">
                          {appointment.patientName}
                        </span>
                        {getUrgencyBadge(appointment.urgence)}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {appointment.type} • {appointment.doctor}
                      </div>
                      <div className="text-xs text-muted-foreground mt-1">
                        {appointment.salle}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {getStatusBadge(appointment.status)}
                    <Dialog
                      open={
                        isViewDialogOpen &&
                        selectedAppointment?.id === appointment.id
                      }
                      onOpenChange={(open) => {
                        setIsViewDialogOpen(open);
                        if (!open) setSelectedAppointment(null);
                      }}
                    >
                      <DialogTrigger asChild>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setSelectedAppointment(appointment)}
                        >
                          <Eye className="w-4 h-4" />
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-4xl">
                        <DialogHeader>
                          <DialogTitle>
                            Détails du rendez-vous - {appointment.patientName}
                          </DialogTitle>
                        </DialogHeader>
                        {selectedAppointment && (
                          <AppointmentDetailsDialog
                            appointment={selectedAppointment}
                          />
                        )}
                      </DialogContent>
                    </Dialog>
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const ListView = () => (
    <Card>
      <CardContent className="p-0">
        <div className="divide-y">
          {filteredAppointments.map((appointment) => (
            <div
              key={appointment.id}
              className="p-4 hover:bg-muted/50 transition-colors"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="text-center">
                    <div className="text-sm font-medium">
                      {format(parseISO(appointment.date), "dd MMM", {
                        locale: fr,
                      })}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {appointment.time}
                    </div>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-medium">
                        {appointment.patientName}
                      </span>
                      {getUrgencyBadge(appointment.urgence)}
                      {isToday(parseISO(appointment.date)) && (
                        <Badge variant="outline" className="text-xs">
                          Aujourd'hui
                        </Badge>
                      )}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {appointment.type} • {appointment.doctor} •{" "}
                      {appointment.salle}
                    </div>
                    <div className="text-xs text-muted-foreground mt-1">
                      {appointment.motif}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  {getStatusBadge(appointment.status)}
                  <Dialog
                    open={
                      isViewDialogOpen &&
                      selectedAppointment?.id === appointment.id
                    }
                    onOpenChange={(open) => {
                      setIsViewDialogOpen(open);
                      if (!open) setSelectedAppointment(null);
                    }}
                  >
                    <DialogTrigger asChild>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setSelectedAppointment(appointment)}
                      >
                        <Eye className="w-4 h-4" />
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-4xl">
                      <DialogHeader>
                        <DialogTitle>
                          Détails du rendez-vous - {appointment.patientName}
                        </DialogTitle>
                      </DialogHeader>
                      {selectedAppointment && (
                        <AppointmentDetailsDialog
                          appointment={selectedAppointment}
                        />
                      )}
                    </DialogContent>
                  </Dialog>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-6">
      {/* Header Actions */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Gestion des Rendez-vous</h1>
          <p className="text-muted-foreground">
            {todayAppointments.length} rendez-vous aujourd'hui •{" "}
            {filteredAppointments.length} total
          </p>
        </div>

        <div className="flex gap-2">
          <Tabs
            value={viewMode}
            onValueChange={(value: any) => setViewMode(value)}
          >
            <TabsList>
              <TabsTrigger value="list">Liste</TabsTrigger>
              <TabsTrigger value="calendar">Calendrier</TabsTrigger>
            </TabsList>
          </Tabs>

          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button className="gap-2">
                <Plus className="w-4 h-4" />
                Nouveau RDV
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Programmer un nouveau rendez-vous</DialogTitle>
              </DialogHeader>
              <AddAppointmentForm />
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <CalendarIcon className="w-5 h-5 text-blue-600" />
              <div>
                <div className="text-sm text-muted-foreground">Aujourd'hui</div>
                <div className="text-xl font-bold">
                  {todayAppointments.length}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-green-600" />
              <div>
                <div className="text-sm text-muted-foreground">Confirmés</div>
                <div className="text-xl font-bold">
                  {
                    appointments.filter((apt) => apt.status === "confirmee")
                      .length
                  }
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-yellow-600" />
              <div>
                <div className="text-sm text-muted-foreground">En attente</div>
                <div className="text-xl font-bold">
                  {
                    appointments.filter((apt) => apt.status === "programmee")
                      .length
                  }
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <XCircle className="w-5 h-5 text-red-600" />
              <div>
                <div className="text-sm text-muted-foreground">Annulés</div>
                <div className="text-xl font-bold">
                  {
                    appointments.filter((apt) => apt.status === "annulee")
                      .length
                  }
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filters */}
      {viewMode === "list" && (
        <Card>
          <CardContent className="p-4">
            <div className="flex gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Rechercher par patient, téléphone ou type..."
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
                  <SelectItem value="programmee">Programmé</SelectItem>
                  <SelectItem value="confirmee">Confirmé</SelectItem>
                  <SelectItem value="en_cours">En cours</SelectItem>
                  <SelectItem value="terminee">Terminé</SelectItem>
                  <SelectItem value="annulee">Annulé</SelectItem>
                </SelectContent>
              </Select>
              <Select value={filterDoctor} onValueChange={setFilterDoctor}>
                <SelectTrigger className="w-48">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="tous">Tous les médecins</SelectItem>
                  {doctors.map((doctor) => (
                    <SelectItem key={doctor} value={doctor}>
                      {doctor}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Main Content */}
      {viewMode === "calendar" ? <CalendarView /> : <ListView />}

      {/* Empty State */}
      {viewMode === "list" && filteredAppointments.length === 0 && (
        <Card>
          <CardContent className="text-center py-8">
            <CalendarIcon className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium mb-2">
              Aucun rendez-vous trouvé
            </h3>
            <p className="text-muted-foreground mb-4">
              {searchTerm
                ? "Aucun rendez-vous ne correspond à votre recherche"
                : "Commencez par programmer votre premier rendez-vous"}
            </p>
            <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="w-4 h-4 mr-2" />
                  Programmer un RDV
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>Programmer un nouveau rendez-vous</DialogTitle>
                </DialogHeader>
                <AddAppointmentForm />
              </DialogContent>
            </Dialog>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
