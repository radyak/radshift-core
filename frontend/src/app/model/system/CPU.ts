export interface CPU {
    speed: {
        min: number;
        max: number;
        avg: number;
        cores: number[];
    };
    temperature: {
        main: number;
        cores: number[];
        max: number;
    };
}
