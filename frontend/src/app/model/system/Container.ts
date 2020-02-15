export interface Container {
    name: string;
    image: string;
    created: number;
    started: number;
    state: string;
    restartCount: number;
    mem_usage: number;
    mem_percent: number;
    cpu_percent: number;
}
