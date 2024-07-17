interface NotificationStore {
    number: number;
    fetch: () => Promise<void>;
    decrease: () => void;
    reset: () => void;
}

export type {
    NotificationStore
}