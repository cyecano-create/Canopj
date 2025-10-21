import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../user/users.service';
import * as bcrypt from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';
import * as Jwt from 'jsonwebtoken';

@Injectable()
export class AuthService {
    refreshToken(refreshToken: string) {
        throw new Error('Method not implemented.');
    }
    constructor(private usersService: UsersService, private jwtService: JwtService) {}

    async validateUser(username: string, pass: string,) {
        const user = await this.usersService.findByUsername(username);
        if (!user) return null;
        const valid = await bcrypt.compare(pass, user.password);
        if (valid) return { id: user.id, username: user.username, gender: user.gender, role: user.role};
        return null;
    }   

    async login(user: {id: number; username: string; role: string }) {
        const payload = { sub: user.id, username: user.username, role: user.role };
        const accesToken = this.jwtService.sign(payload);
    
        const refreshToken = Jwt.sign(payload, process.env.JWT_REFRESH_TOKEN_SECRET || 'refresh_secret', {
            expiresIn: process.env.REFRESH_TOKEN_EXPIRES_IN || '7d',
        });

        await this.usersService.setRefreshToken(user.id, refreshToken);

        return {accesToken, refreshToken };
    }


    async logout(userId: number) {
        await this.usersService.setRefreshToken(userId, null);
        return { ok: true };
    }

    async refreshTokens(refreshToken: string) {
        try {
            const decoded: any = Jwt.verify(refreshToken, process.env.JWT_REFRESH_TOKEN_SECRET || 'refresh_secret');
            const user = await this.usersService.findById(decoded.sub);
            if (!user) throw new UnauthorizedException('Invalid refresh token');

            const stored = await this.usersService.findById(decoded.sub);
            const poolUser = await this.usersService.findById(decoded.sub);

            const u = await this.usersService.findById(decoded.sub);

            const found = await this.usersService.findByRefreshToken(refreshToken);
            if (!found) throw new UnauthorizedException('Invalid refresh token (not found)');

            const payload = { sub: found.id, username: found.username, role: found.role };
            const accessToken = this.jwtService.sign(payload);
            const newRefresh = Jwt.sign(payload, process.env.JWT_REFRESH_TOKEN_SECRET || 'refresh_secret', {
                expiresIn: process.env.REFRESH_TOKEN_EXPIRES_IN || '7d',
            });
            await this.usersService.setRefreshToken(found.id, newRefresh);
            return { accessToken, refreshToken: newRefresh};
         } catch (err) {
            throw new UnauthorizedException('Could not refresh tokens');
         }
        }
    
}



