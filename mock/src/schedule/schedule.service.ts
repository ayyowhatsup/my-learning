import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { CreateScheduleDto } from './dto/create-schedule.dto';
import { UpdateScheduleDto } from './dto/update-schedule.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Schedule } from './entities/schedule.entity';
import { MoreThan, Repository } from 'typeorm';
import { SchedulerRegistry } from '@nestjs/schedule';
import { CronJob } from 'cron';
import { MailService } from 'src/mail/mail.service';

@Injectable()
export class ScheduleService implements OnModuleInit {
  private logger: Logger = new Logger(ScheduleService.name);
  constructor(
    @InjectRepository(Schedule)
    private scheduleRepository: Repository<Schedule>,
    private schedulerRegistry: SchedulerRegistry,
    private mailService: MailService,
  ) {}

  async onModuleInit() {
    await this.reScheduleAllEvents();
  }

  create(createdById: number, createScheduleDto: CreateScheduleDto) {
    const newSchedule = this.scheduleRepository.create({
      ...createScheduleDto,
      recipients: createScheduleDto.recipientIds.map((e) => ({ id: e })),
      createdBy: { id: createdById },
    });
    return this.scheduleRepository.save(newSchedule);
  }

  findAll() {
    return this.scheduleRepository.find({
      relations: ['createdBy', 'recipients'],
    });
  }

  findByIdWithRelation(id: number) {
    return this.scheduleRepository.findOne({
      where: { id: id },
      relations: ['createdBy', 'recipients'],
    });
  }

  findOne(id: number) {
    return this.scheduleRepository.findOne({
      where: {
        id,
      },
      relations: ['createdBy', 'recipients'],
    });
  }

  update(id: number, updateScheduleDto: UpdateScheduleDto) {
    return this.scheduleRepository.save({
      ...updateScheduleDto,
      id: id,
      recipients: updateScheduleDto.recipientIds.map((e) => ({ id: e })),
    });
  }

  remove(id: number) {
    return this.scheduleRepository.delete({ id });
  }

  async scheduleEvent(schedule: Schedule) {
    const current = await this.findByIdWithRelation(schedule.id);
    const job = new CronJob(current.timeExecute, () => {
      Promise.all(
        current.recipients.map((user) => {
          return this.mailService.sendMailNotification(
            user.email,
            current.title,
            current.content,
          );
        }),
      );
    });
    this.schedulerRegistry.addCronJob(`Schedule-${schedule.id}`, job);
    this.logger.log(`A cronjob is scheduled: Schedule-${schedule.id}`);
    job.start();
  }

  unscheduleEvent(scheduleId: number): void {
    return this.schedulerRegistry.deleteCronJob(`Schedule-${scheduleId}`);
  }

  reScheduleEvent(schedule: Schedule): Promise<void> {
    const name = `Schedule-${schedule.id}`;
    this.schedulerRegistry.deleteCronJob(name);
    return this.scheduleEvent(schedule);
  }

  private async reScheduleAllEvents() {
    const schedules = await this.scheduleRepository.find({
      where: {
        timeExecute: MoreThan(new Date()),
      },
    });
    schedules.map((schedule) => {
      this.scheduleEvent(schedule);
    });
  }
}
