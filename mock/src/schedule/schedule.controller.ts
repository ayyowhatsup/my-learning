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
} from '@nestjs/common';
import { ScheduleService } from './schedule.service';
import { CreateScheduleDto } from './dto/create-schedule.dto';
import { UpdateScheduleDto } from './dto/update-schedule.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from 'src/auth/auth.guard';
import { AdminGuard } from 'src/auth/admin.guard';
import { AuthUser } from 'src/auth/decorators/auth-user.decorator';

@ApiTags('Schedule')
@Controller('schedule')
@UseGuards(AuthGuard, AdminGuard)
@ApiBearerAuth('accessToken')
export class ScheduleController {
  constructor(private readonly scheduleService: ScheduleService) {}

  @Post()
  async create(@AuthUser() user, @Body() createScheduleDto: CreateScheduleDto) {
    const schedule = await this.scheduleService.create(
      user.id,
      createScheduleDto,
    );
    this.scheduleService.scheduleEvent(schedule);
    return schedule;
  }

  @Get()
  findAll() {
    return this.scheduleService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.scheduleService.findOne(+id);
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateScheduleDto: UpdateScheduleDto,
  ) {
    const schedule = await this.scheduleService.findByIdWithRelation(+id);
    if (schedule.timeExecute < new Date()) {
      throw new BadRequestException(
        'Changes cannot be made to the schedule for events that have already occurred',
      );
    }
    return this.scheduleService.update(+id, updateScheduleDto);
  }

  @Delete(':id')
  async remove(@AuthUser() user, @Param('id') id: string) {
    const schedule = await this.scheduleService.findByIdWithRelation(+id);
    if (!schedule || schedule.createdBy.id !== user.id) {
      throw new NotFoundException();
    }
    return this.scheduleService.remove(+id);
  }
}
