import { SignOptions } from 'jsonwebtoken';

export interface IJwt {

    endpoint: string;

    singOptions?: 'RS256' | 'RS512';
}

export interface ISerEngineConfig {
    host: string;

    userId?: string;

    userDirectory?: string;

    virtualProxy: string;

    jwt?: IJwt;
}
