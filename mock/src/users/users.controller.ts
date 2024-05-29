import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  SerializeOptions,
  HttpCode,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import {
  ApiBearerAuth,
  ApiBody,
  ApiCreatedResponse,
  ApiExtraModels,
  ApiForbiddenResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
  getSchemaPath,
} from '@nestjs/swagger';
import { AuthUser } from 'src/auth/decorators/auth-user.decorator';
import { User } from './entities/user.entity';
import { BaseResponseDto } from 'src/shared/dto/base-response.dto';
import { AdminGuard } from 'src/auth/admin.guard';
import { AuthGuard } from 'src/auth/auth.guard';
import _ from 'lodash';

@ApiUnauthorizedResponse({
  description: 'Invalid token!',
  schema: {
    $ref: getSchemaPath(BaseResponseDto),
  },
})
@ApiBearerAuth('accessToken')
@ApiTags('User')
@Controller('users')
@ApiExtraModels(BaseResponseDto, User)
@UseGuards(AuthGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @ApiForbiddenResponse({
    description: 'Forbidden! Administration role required',
    schema: {
      $ref: getSchemaPath(BaseResponseDto),
    },
  })
  @ApiOperation({
    summary: 'Create an user',
  })
  @SerializeOptions({ strategy: 'exposeAll' })
  @ApiCreatedResponse({
    description: 'User successfully created!',
    schema: {
      allOf: [
        {
          $ref: getSchemaPath(BaseResponseDto),
        },
        {
          type: 'object',
          properties: {
            data: {
              $ref: getSchemaPath(User),
            },
          },
        },
      ],
    },
  })
  @UseGuards(AdminGuard)
  async create(@AuthUser() user, @Body() createUserDto: CreateUserDto) {
    const newUser = await this.usersService.create(user.id, createUserDto);
    return newUser;
  }

  @Get()
  @ApiOkResponse({
    schema: {
      allOf: [
        {
          $ref: getSchemaPath(BaseResponseDto),
        },
        {
          properties: {
            data: {
              type: 'array',
              items: {
                $ref: getSchemaPath(User),
              },
            },
          },
        },
      ],
    },
  })
  @ApiOperation({
    summary: 'Get all users',
  })
  findAll(): Promise<User[]> {
    return this.usersService.findAll();
  }

  @ApiOkResponse({
    schema: {
      allOf: [
        {
          $ref: getSchemaPath(BaseResponseDto),
        },
        {
          properties: {
            data: {
              $ref: getSchemaPath(User),
            },
          },
        },
      ],
    },
  })
  @ApiOperation({
    summary: 'Get an user detail',
  })
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.usersService.findById(+id);
  }

  @ApiOperation({
    summary: 'Update user info',
  })
  @ApiForbiddenResponse({
    description: 'Forbidden! Administration role required',
    schema: {
      $ref: getSchemaPath(BaseResponseDto),
    },
  })
  @ApiBody({
    type: CreateUserDto,
  })
  @UseGuards(AdminGuard)
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(+id, _.omit(updateUserDto, ['email']));
  }

  @ApiOperation({
    summary: 'Delete an user',
  })
  @ApiForbiddenResponse({
    description: 'Forbidden! Administration role required',
    schema: {
      $ref: getSchemaPath(BaseResponseDto),
    },
  })
  @UseGuards(AdminGuard)
  @Delete(':id')
  @HttpCode(200)
  async remove(@Param('id') id: string) {
    await this.usersService.remove(+id);
  }
}
