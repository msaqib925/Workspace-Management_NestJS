import {
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Req,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { UserService } from './user.service';
import { JwtAuthGuard } from 'src/auth/jwt-auth-guard';

@ApiTags('Users')
@Controller('users')
export class UserController {
  constructor(private userService: UserService) { }

  // ------------------ USERS LIST ------------------

  @Get()
  getAllUsers() {
    return this.userService.getAllUsers();
  }

  // ------------------ PROFILE ------------------

  @Get('me')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('jwt-auth')
  @ApiOperation({ summary: 'Get currently logged-in user info' })
  @ApiResponse({
    status: 200,
    description: ' Returns current user info',
  })
  getMe(@Req() req) {
    return this.userService.getMe(req.user.userId);
  }

  // ------------------ SINGLE USER ------------------

  @Get(':id')
  getUserById(@Param('id', ParseIntPipe) id: number) {
    return this.userService.getUserById(id);
  }

  // ------------------ DELETE USER ------------------

  @Delete(':id')
  deleteUser(@Param('id', ParseIntPipe) id: number) {
    return this.userService.deleteUser(id);
  }
}
