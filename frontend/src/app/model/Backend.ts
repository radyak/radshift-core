import { BackendState } from './BackendState';

export interface Backend {

    status: BackendState;
    name: string;
    description: string;
    label: string;
    
}
