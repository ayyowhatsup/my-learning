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
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiExtraModels,
  ApiForbiddenResponse,
  ApiOkResponse,
  ApiTags,
  ApiUnauthorizedResponse,
  getSchemaPath,
} from '@nestjs/swagger';
import { AuthUser } from 'src/auth/decorators/auth-user.decorator';
import { User } from './entities/user.entity';
import { BaseResponseDto } from 'src/shared/dto/base-response.dto';
import { AdminGuard } from 'src/auth/admin.guard';
import { MailService } from 'src/mail/mail.service';

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
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly mailService: MailService,
  ) {}

  @Post()
  @ApiForbiddenResponse({
    description: 'Forbidden! Administration role required',
    schema: {
      $ref: getSchemaPath(BaseResponseDto),
    },
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
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.usersService.findById(+id);
  }

  @ApiForbiddenResponse({
    description: 'Forbidden! Administration role required',
    schema: {
      $ref: getSchemaPath(BaseResponseDto),
    },
  })
  @UseGuards(AdminGuard)
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(+id, updateUserDto);
  }

  @ApiForbiddenResponse({
    description: 'Forbidden! Administration role required',
    schema: {
      $ref: getSchemaPath(BaseResponseDto),
    },
  })
  @UseGuards(AdminGuard)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.usersService.remove(+id);
  }
}
