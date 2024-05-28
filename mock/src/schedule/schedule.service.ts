import { Injectable } from '@nestjs/common';
import { CreateScheduleDto } from './dto/create-schedule.dto';
import { UpdateScheduleDto } from './dto/update-schedule.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Schedule } from './entities/schedule.entity';
import { Repository } from 'typeorm';
import { SchedulerRegistry } from '@nestjs/schedule';
import { CronJob } from 'cron';
import { MailService } from 'src/mail/mail.service';

@Injectable()
export class ScheduleService {
  constructor(
    @InjectRepository(Schedule)
    private scheduleRepository: Repository<Schedule>,
    private schedulerRegistry: SchedulerRegistry,
    private mailService: MailService,
  ) {}
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
    return `This action returns a #${id} schedule`;
  }

  update(id: number, updateScheduleDto: UpdateScheduleDto) {
    return this.scheduleRepository.update(
      { id },
      {
        ...updateScheduleDto,
        recipients: updateScheduleDto.recipientIds.map((e) => ({ id: e })),
      },
    );
  }

  remove(id: number) {
    return this.scheduleRepository.delete({ id });
  }

  async scheduleEvent(schedule: Schedule) {
    const current = await this.findByIdWithRelation(schedule.id);
    const job = new CronJob(current.timeExecute, () => {
      Promise.all(
        current.recipients.map((user) => {
          return this.mailService.addMailJob(
            user.email,
            current.title,
            current.content,
          );
        }),
      );
    });
    this.schedulerRegistry.addCronJob(`Schedule-${schedule.id}`, job);
    job.start();
  }
}
