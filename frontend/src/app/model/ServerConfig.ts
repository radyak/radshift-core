export interface ServerConfig {
    hostDomain?: string;
    adminEmail?: string;
    dynDnsProviderUsername?: string;
    dynDnsProviderPassword?: string;
    dynDnsProviderHost?: string;
    dynDnsUpdateIntervalMinutes?: number;
}