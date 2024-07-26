export interface ReactTableProps<T extends Cols> {
    data: T[];
}

export type Cols = {
    id: number;
    roleId: number;
    username: string;
    fullName: string;
    email: string;
    address: string;
    status: string;
};