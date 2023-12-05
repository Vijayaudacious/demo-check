export interface MenuItem {
    label: React.ReactNode;
    key: string;
    icon: React.ReactNode;
    id: string;
    children?: MenuItem[];
  }