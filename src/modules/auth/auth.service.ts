import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {

    constructor(private readonly jwtService: JwtService) { }

    async login(user: { username: string }) {
        const payload = { sub: user.username };
        return {
            access_token: this.jwtService.sign(payload),
        };
    }
}
