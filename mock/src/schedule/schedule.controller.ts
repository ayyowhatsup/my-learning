import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  NotFoundException,
  BadRequestException,
  HttpCode,
} from '@nestjs/common';
import { ScheduleService } from './schedule.service';
import { CreateScheduleDto } from './dto/create-schedule.dto';
import { UpdateScheduleDto } from './dto/update-schedule.dto';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiExtraModels,
  ApiForbiddenResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
  getSchemaPath,
} from '@nestjs/swagger';
import { AuthGuard } from 'src/auth/auth.guard';
import { AdminGuard } from 'src/auth/admin.guard';
import { AuthUser } from 'src/auth/decorators/auth-user.decorator';
import { BaseResponseDto } from 'src/shared/dto/base-response.dto';
import { ScheduleDto } from './dto/schedule.dto';

@ApiTags('Schedule')
@Controller('schedule')
@UseGuards(AuthGuard, AdminGuard)
@ApiBearerAuth('accessToken')
@ApiExtraModels(ScheduleDto)
@ApiForbiddenResponse({
  description: 'Administration role required!',
  type: BaseResponseDto,
})
@ApiUnauthorizedResponse({
  description: 'Authentication required!',
  type: BaseResponseDto,
})
export class ScheduleController {
  constructor(private readonly scheduleService: ScheduleService) {}

  @Post()
  @ApiOperation({
    summary: 'Create a schedule',
  })
  @ApiCreatedResponse({
    description: 'Create a schedule successfully',
    schema: {
      allOf: [
        { $ref: getSchemaPath(BaseResponseDto) },
        { properties: { data: { $ref: getSchemaPath(ScheduleDto) } } },
      ],
    },
  })
  async create(@AuthUser() user, @Body() createScheduleDto: CreateScheduleDto) {
    const schedule = await this.scheduleService.create(
      user.id,
      createScheduleDto,
    );
    this.scheduleService.scheduleEvent(schedule);
    return schedule;
  }

  @Get()
  @ApiOperation({
    summary: 'Get all schedules',
  })
  @ApiOkResponse({
    description: 'Operation success',
    schema: {
      allOf: [
        { $ref: getSchemaPath(BaseResponseDto) },
        {
          properties: { data: { items: { $ref: getSchemaPath(ScheduleDto) } } },
        },
      ],
    },
  })
  findAll() {
    return this.scheduleService.findAll();
  }

  @ApiOperation({
    summary: 'Get a schedule',
  })
  @ApiOkResponse({
    description: 'Operation success',
    schema: {
      allOf: [
        { $ref: getSchemaPath(BaseResponseDto) },
        { properties: { data: { $ref: getSchemaPath(ScheduleDto) } } },
      ],
    },
  })
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.scheduleService.findOne(+id);
  }

  @ApiOperation({
    summary: 'Update a schedule',
  })
  @ApiOkResponse({
    description: 'Update schedule successfully',
    schema: {
      allOf: [
        { $ref: getSchemaPath(BaseResponseDto) },
        { properties: { data: { $ref: getSchemaPath(ScheduleDto) } } },
      ],
    },
  })
  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateScheduleDto: UpdateScheduleDto,
  ) {
    const schedule = await this.scheduleService.findByIdWithRelation(+id);
    if (schedule.timeExecute < new Date()) {
      throw new BadRequestException(
        'Changes cannot be made to the schedule for event that have already occurred!',
      );
    }
    const updatedSchedule = await this.scheduleService.update(
      +id,
      updateScheduleDto,
    );
    this.scheduleService.reScheduleEvent(updatedSchedule);
    return updatedSchedule;
  }

  @Delete(':id')
  @HttpCode(200)
  @ApiOperation({
    summary: 'Delete a schedule',
  })
  @ApiOkResponse({
    description: 'Delete successfully',
    type: BaseResponseDto,
  })
  async remove(@AuthUser() user, @Param('id') id: string) {
    const schedule = await this.scheduleService.findByIdWithRelation(+id);
    if (!schedule || schedule.createdBy.id !== user.id) {
      throw new NotFoundException();
    }
    await this.scheduleService.remove(+id);
    this.scheduleService.unscheduleEvent(+id);
  }
}
