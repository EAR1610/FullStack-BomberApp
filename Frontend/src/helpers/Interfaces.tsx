
export interface FirefighterShift {
    id: number;
    firefighterId: number;
    name: string;
    description: string;
    shiftStart: string;
    shiftEnd: string;
    status: 'active' | 'inactive';
    createdAt: string;
    updatedAt: string;
}

export interface SidebarProps {
  sidebarOpen: boolean;
  setSidebarOpen: (arg: boolean) => void;
}

export interface Events {
    id: number;
    title: string;
    start: Date;
    end: Date;
    description: string;  
}

export interface MapProps {
  latitude: number;
  longitude: number;
}

export interface User {
  id: number;
  roleId: number;
  username: string;
  fullName: string;
  dpi: string;
  password: string;
  photography: File | null;
  address: string;
  email: string;
  status: string;
  isAdmin: boolean;
  isFirefighter: boolean;
  isUser: boolean;
}


export interface FirefighterI {
  id: number;
  userId: number;
  shiftPreference: string;
  createdAt: string;
  updatedAt: string;
  user: User;
}

export interface Firefighter {
  id: number;
  userId: number;
  shiftPreference: string;
  createdAt: string;
  updatedAt: string;
}

export interface CurrentTokenI {
  type: string;
  token: string;
  user: User;
  firefighter: Firefighter | null;
}

export interface TableFirefightersProps {
  data: FirefighterI[];
  firefighter: FirefighterI;
  setVisible: React.Dispatch<React.SetStateAction<boolean>>;
  loading: boolean;
  viewActiveFirefighters: boolean;
  isChangedFirefighter: boolean;
  setIsChangedFirefighter: React.Dispatch<React.SetStateAction<boolean>>;
  setViewActiveFirefighters: React.Dispatch<React.SetStateAction<boolean>>;
}

export interface EmergencyType {
  id: number;
  name: string;
  status: 'active' | 'inactive';
  createdAt: string;
  updatedAt: string;
}

export interface Emergency {
  id: number;
  emergencyTypeId: number;
  applicant: string | null;
  address: string | null;
  latitude: number | null;
  longitude: number | null;
  description: string | null;
  status: 'Registrada' | 'En proceso' | 'Atendida' | 'Cancelada' | 'Rechazada';
  emergencyType: EmergencyType;
  createdAt: string;
  updatedAt: string;
}

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export interface EmergencyCardProps {
  applicant: string;
  address: string;
  description: string;
  user: User;
  onShowDetails: () => void;
}

export interface ToolPerEmergencyTypeProps {
  applicant: string;
  address: string;
  description: string;
  user: User;
  onShowDetails: () => void;
}

export interface SupplyPerEmergencyProps {
  name: string;
  quantity: number;
  onShowDetails: () => void;
}

export interface EmergencyModalProps {
  isOpen: boolean;
  onClose: () => void;
  emergencyData: any;
  isFirefighter: boolean;
  isUser: boolean;
}

export interface ViewStatusEmergency {
  id: number;
}

export interface MapComponentProps extends MapProps {
  onLocationChange: (latitude: number, longitude: number) => void;
  isUser: boolean;
}

export interface Comment {
  id: number;
  postId: number;
  userId: number;
  user: User;
  content: string;
  createdAt: string;
}

export interface ColumnMeta{
  field: string;
  header: string;
}