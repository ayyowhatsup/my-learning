import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Req,
  NotFoundException,
  HttpCode,
} from '@nestjs/common';
import { TaskService } from './task.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import {
  ApiBearerAuth,
  ApiBody,
  ApiCreatedResponse,
  ApiNoContentResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { AuthGuard } from 'src/auth/auth.guard';
import { AuthUser } from 'src/auth/types/auth-user.type';

@Controller('u/tasks')
@UseGuards(AuthGuard)
@ApiBearerAuth('accessToken')
@ApiTags('Task')
export class TaskController {
  constructor(private readonly taskService: TaskService) {}

  @ApiOperation({ summary: 'Assign a new task to others' })
  @ApiCreatedResponse()
  @Post()
  create(@Req() req, @Body() createTaskDto: CreateTaskDto) {
    return this.taskService.assignTask(req.user as AuthUser, createTaskDto);
  }

  @ApiOperation({
    summary: 'Get all relevant tasks (both assign and get assigned)',
  })
  @Get()
  findAllUserTasks(@Req() req) {
    return this.taskService.getAllUserTasks(req.user);
  }

  @ApiOperation({ summary: 'Get a task by id (assign or get assigned)' })
  @Get(':id')
  async findOne(@Req() req, @Param('id') id: string) {
    const task = await this.taskService.getUserTask(req.user as AuthUser, +id);
    if (!task) throw new NotFoundException('Task not found!');
    return task;
  }

  @ApiOperation({ summary: 'Update a task that user created by id' })
  @ApiBody({ type: UpdateTaskDto })
  @Patch(':id')
  update(
    @Req() req,
    @Param('id') id: string,
    @Body() updateTaskDto: UpdateTaskDto,
  ) {
    return this.taskService.updateUserOwnTask(
      req.user as AuthUser,
      +id,
      updateTaskDto,
    );
  }

  @ApiOperation({ summary: 'Delete task that user created' })
  @ApiNoContentResponse()
  @Delete(':id')
  @HttpCode(204)
  async remove(@Req() req, @Param('id') id: string) {
    await this.taskService.deleteUserOwnTask(req.user as AuthUser, +id);
    return;
  }
}
