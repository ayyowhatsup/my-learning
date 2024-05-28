import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TimeLog } from './entities/timelog.entity';
import { Like, Repository } from 'typeorm';

@Injectable()
export class TimeLogService {
  constructor(
    @InjectRepository(TimeLog) private timeLogRepository: Repository<TimeLog>,
  ) {}

  private getLocalISOString(date: Date) {
    const tzOffSet = date.getTimezoneOffset() * 60000;
    return new Date(date.valueOf() - tzOffSet).toISOString().slice(0, -1);
  }

  async checkIn(userId: number) {
    let record = await this.timeLogRepository.findOne({
      relations: ['user'],
      where: {
        user: {
          id: userId,
        },
        date: this.getLocalISOString(new Date()).split('T')[0],
      },
    });
    if (record) {
      record.checkOutTime = new Date();
    } else {
      record = this.timeLogRepository.create({
        date: this.getLocalISOString(new Date()).split('T')[0],
        checkInTime: new Date(),
        userId: userId,
      });
    }
    return this.timeLogRepository.save(record);
  }

  getUserMonthlyTimeLog(userId: number, month: number, year: number) {
    return this.timeLogRepository.find({
      where: {
        userId: userId,
        date: Like(
          `${this.getLocalISOString(new Date(year, month - 1)).split(/-\d{2}T/)[0]}%`,
        ),
      },
    });
  }
}
