import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ConfigService } from '@nestjs/config';
import { HeaderAPIKeyStrategy } from 'passport-headerapikey';

@Injectable()
export class APIKeyStrategy extends PassportStrategy(HeaderAPIKeyStrategy, 'api-key') {
    constructor(
        private readonly configService: ConfigService
    ) {
        super({ header: 'api-key', prefix: '' },
            true,
            async (apiKey, done) => {
                return this.validate(apiKey, done);
            });
    }

    async validate(apiKey: string, done: (error: Error, data) => {}) {
        const envApiKey = this.configService.get<string>('API_KEY');

        if (envApiKey && envApiKey === apiKey) {
            done(null, true);
        }

        done(new UnauthorizedException(), null);
    }
}