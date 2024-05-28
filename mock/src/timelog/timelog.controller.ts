import {
  Controller,
  Get,
  HttpCode,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { TimeLogService } from './timelog.service';
import { AuthGuard } from 'src/auth/auth.guard';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiExtraModels,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
  getSchemaPath,
} from '@nestjs/swagger';
import { AuthUser } from 'src/auth/decorators/auth-user.decorator';
import { BaseResponseDto } from 'src/shared/dto/base-response.dto';
import { MonthYearDto } from './dto/month-year-query.dto';
import { TimeLogDto } from './dto/time-log.dto';

@ApiTags('TimeLog')
@ApiBearerAuth('accessToken')
@Controller('timelog')
@ApiUnauthorizedResponse({
  description: 'Invalid Token!',
  type: BaseResponseDto,
})
@UseGuards(AuthGuard)
export class TimeLogController {
  constructor(private readonly timeLogService: TimeLogService) {}

  @Post('check-in')
  @HttpCode(200)
  @ApiOperation({
    summary: 'User check-in',
  })
  @ApiOkResponse({
    description: 'User check-in successfully',
    type: BaseResponseDto,
  })
  async checkIn(@AuthUser() user) {
    await this.timeLogService.checkIn(user.id);
    return;
  }

  @Get('me')
  @HttpCode(200)
  @ApiExtraModels(TimeLogDto)
  @ApiOkResponse({
    description: 'Get user time log successfully',
    schema: {
      allOf: [
        { $ref: getSchemaPath(BaseResponseDto) },
        {
          properties: {
            data: { type: 'array', items: { $ref: getSchemaPath(TimeLogDto) } },
          },
        },
      ],
    },
  })
  @ApiBadRequestResponse({
    type: BaseResponseDto,
    description: 'Year or month is not a number',
  })
  getUserTimeLog(@AuthUser() user, @Query() monthYearDto: MonthYearDto) {
    return this.timeLogService.getUserMonthlyTimeLog(
      user.id,
      monthYearDto.month,
      monthYearDto.year,
    );
  }
}
