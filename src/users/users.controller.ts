import { Controller, Get, Param } from '@nestjs/common';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  // demo public endpoint (do not expose in real prod without auth)
  @Get(':id')
  async getById(@Param('id') id: string) {
    const user = await this.usersService.findById(id);
    return this.usersService.toPublic(user);
  }
}
