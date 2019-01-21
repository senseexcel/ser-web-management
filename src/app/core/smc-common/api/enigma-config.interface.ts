export interface IJwt {

    endpoint: string;

    singOptions?: 'RS256' | 'RS512';
}

export interface IEnigmaConfig {
    host: string;

    userId?: string;

    userDirectory?: string;

    virtualProxy: string;

    jwt?: IJwt;
}
