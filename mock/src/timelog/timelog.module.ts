import { Module } from '@nestjs/common';
import { TimeLogService } from './timelog.service';
import { TimeLogController } from './timelog.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TimeLog } from './entities/timelog.entity';

@Module({
  imports: [TypeOrmModule.forFeature([TimeLog])],
  providers: [TimeLogService],
  controllers: [TimeLogController],
})
export class TimeLogModule {}
