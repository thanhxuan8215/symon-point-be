import { Strategy } from "passport-local";
import { PassportStrategy } from "@nestjs/passport";
import { Injectable, UnauthorizedException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
    constructor(private configService: ConfigService) {
        super({
            usernameField: "username",
            passwordField: "password",
        });
    }

    async validate(username: string, password: string): Promise<any> {
        const adminUsername = this.configService.get('ADMIN_USERNAME');
        const adminPassword = this.configService.get('ADMIN_PASSWORD');

        if (adminUsername && adminPassword && adminUsername === username && adminPassword === password) {
            return { username };
        }

        throw new UnauthorizedException();
    }
}
