
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

export interface Events {
    id: number;
    title: string;
    start: Date;
    end: Date;
    description: string;  
}

export interface User {
  id: number;
  roleId: number;
  username: string;
  fullName: string;
  password: string;
  photography: File | null;
  address: string;
  email: string;
  status: string;
  isAdmin: boolean;
  isFirefighter: boolean;
}


export interface FirefighterI {
  id: number;
  userId: number;
  shiftPreference: string;
  createdAt: string;
  updatedAt: string;
  user: User;
}

export interface TableFirefightersProps {
  data: FirefighterI[];
  firefighter: FirefighterI;
  setVisible: React.Dispatch<React.SetStateAction<boolean>>;
  loading: boolean;
  viewActiveFirefighters: boolean;
  setViewActiveFirefighters: React.Dispatch<React.SetStateAction<boolean>>;
}