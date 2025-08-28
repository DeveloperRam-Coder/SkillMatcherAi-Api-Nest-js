"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const bcrypt = __importStar(require("bcrypt"));
const users_service_1 = require("../users/users.service");
let AuthService = class AuthService {
    users;
    jwt;
    constructor(users, jwt) {
        this.users = users;
        this.jwt = jwt;
    }
    async register(dto) {
        const { name, email, password, role } = dto;
        const existingUser = await this.users.findByEmail(email, true);
        if (existingUser) {
            const samePassword = await bcrypt.compare(password, existingUser.password);
            if (samePassword) {
                const accessToken = await this.sign(existingUser._id.toString(), existingUser.email);
                const refreshToken = await this.generateRefreshToken(existingUser._id.toString());
                await this.users.updateRefreshToken(existingUser._id.toString(), refreshToken);
                return {
                    _id: existingUser._id,
                    name: existingUser.name,
                    email: existingUser.email,
                    role: existingUser.role,
                    token: accessToken,
                };
            }
            throw new common_1.ConflictException('User already exists');
        }
        const userData = {
            name: name && name.trim() ? name : (email?.split('@')[0] || 'User'),
            email,
            password,
            role: role || 'candidate',
        };
        const user = await this.users.create(userData);
        const accessToken = await this.sign(user._id.toString(), user.email);
        const refreshToken = await this.generateRefreshToken(user._id.toString());
        await this.users.updateRefreshToken(user._id.toString(), refreshToken);
        return {
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            token: accessToken,
        };
    }
    async login(dto) {
        const { email, password } = dto;
        const user = await this.users.findByEmail(email, true);
        if (!user) {
            throw new common_1.UnauthorizedException('Invalid email or password');
        }
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            throw new common_1.UnauthorizedException('Invalid email or password');
        }
        const accessToken = await this.sign(user._id.toString(), user.email);
        const refreshToken = await this.generateRefreshToken(user._id.toString());
        await this.users.updateRefreshToken(user._id.toString(), refreshToken);
        return {
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            token: accessToken,
        };
    }
    async getCurrentUser(userId) {
        const user = await this.users.findById(userId);
        return {
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
        };
    }
    async refreshToken(refreshToken) {
        try {
            const decoded = await this.jwt.verifyAsync(refreshToken);
            const user = await this.users.findById(decoded.sub);
            if (!user) {
                throw new common_1.UnauthorizedException('Invalid refresh token');
            }
            const newAccessToken = await this.sign(user._id.toString(), user.email);
            const newRefreshToken = await this.generateRefreshToken(user._id.toString());
            await this.users.updateRefreshToken(user._id.toString(), newRefreshToken);
            return { token: newAccessToken };
        }
        catch (err) {
            throw new common_1.UnauthorizedException('Could not refresh token');
        }
    }
    async logout(userId) {
        await this.users.updateRefreshToken(userId, '');
        return { message: 'Logged out' };
    }
    async sign(sub, email) {
        return this.jwt.signAsync({ sub, email });
    }
    async generateRefreshToken(sub) {
        return this.jwt.signAsync({ sub }, { expiresIn: '7d' });
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [users_service_1.UsersService, jwt_1.JwtService])
], AuthService);
//# sourceMappingURL=auth.service.js.map