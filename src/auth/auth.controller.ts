import { Body, Controller, Get, Post, Res, UseGuards } from '@nestjs/common';
import { Response } from 'express';
import { Role } from 'src/user/entities/role/role.enum';
import { AuthDto } from './auth.dto';
import { AuthService } from './auth.service';
import { Roles } from './decorators/roles.decorator';
import { JwtAuthGuard } from './jwt-auth.guard';
import { LoginDto } from './login.dto';
import { RolesGuard } from './roles.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('authorize')
  async validateUser(@Body() authDto: AuthDto, @Res() response: Response) {
    const getToken = await this.authService.validateUser(authDto);

    const convertCookieSecureEnvVariable = () => {
      if (process.env.COOKIE_SECURE.toLocaleLowerCase() == 'true') {
        return true;
      }
      if (process.env.COOKIE_SECURE.toLocaleLowerCase() == 'false') {
        return false;
      }
    };
    response.cookie('access_token', getToken.token, {
      httpOnly: true,
      maxAge: 1000 * 60 * 60 * 24 * 7,
      secure: convertCookieSecureEnvVariable(),
      sameSite: 'none',
    });

    return response.status(200).send({
      message: 'User logged successfully',
      token: getToken.token,
    });
  }

  @UseGuards(JwtAuthGuard)
  @Get('logout')
  async logout(@Res() response: Response) {
    const convertCookieSecureEnvVariable = () => {
      if (process.env.COOKIE_SECURE.toLocaleLowerCase() == 'true') {
        return true;
      }
      if (process.env.COOKIE_SECURE.toLocaleLowerCase() == 'false') {
        return false;
      }
    };
    response.cookie('access_token', '', {
      httpOnly: true,
      maxAge: 0,
      secure: convertCookieSecureEnvVariable(),
      sameSite: 'none',
    });

    return response.status(200).send({
      message: 'logout was successfully',
    });
  }

  @Post('login')
  async login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }

  @Roles(Role.SELLER)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Get('dashboard')
  dashboard() {
    return 'Secret page';
  }
}