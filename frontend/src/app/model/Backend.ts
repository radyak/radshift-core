export interface Backend {

    status: string;
    name: string;
    description: string;
    label: string;
    image: string;
    isInstalled: boolean;
    entry?: string;
    
}
