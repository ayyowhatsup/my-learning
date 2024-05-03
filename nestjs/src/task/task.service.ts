import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { AuthUser } from 'src/auth/types/auth-user.type';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Task } from './entities/task.entity';
import { User } from 'src/users/entities/user.entity';

@Injectable()
export class TaskService {
  constructor(
    @InjectRepository(Task) private taskRepository: Repository<Task>,
  ) {}
  assignTask(authUser: AuthUser, createTaskDto: CreateTaskDto): Promise<Task> {
    const newTask = this.taskRepository.create({
      ...createTaskDto,
      assigner: { id: authUser.id },
      assignees: createTaskDto.assignees.map((e) => ({ id: e })) as User[],
    });
    return this.taskRepository.save(newTask);
  }

  getAllUserTasks(authUser: AuthUser) {
    const tasks = this.taskRepository.find({
      relations: ['assigner', 'assignees'],
      where: [
        {
          assigner: { id: authUser.id },
        },
        { assignees: { id: authUser.id } },
      ],
    });
    return tasks;
  }

  getUserTask(authUser: AuthUser, taskId: number) {
    return this.taskRepository.findOne({
      relations: ['assigner', 'assignees'],
      where: [
        {
          id: taskId,
          assigner: { id: authUser.id },
        },
        {
          id: taskId,
          assignees: { id: authUser.id },
        },
      ],
    });
  }

  getUserOwnTask(authUser: AuthUser, taskId: number) {
    return this.taskRepository.findOne({
      relations: ['assigner', 'assignees'],
      where: {
        id: taskId,
        assigner: { id: authUser.id },
      },
    });
  }

  async updateUserOwnTask(
    authUser: AuthUser,
    taskId: number,
    updateTaskDto: UpdateTaskDto,
  ) {
    const task = await this.getUserOwnTask(authUser, taskId);
    if (!task) throw new NotFoundException('Task not found!');
    return this.taskRepository.save({
      ...updateTaskDto,
      id: taskId,
      assignees: updateTaskDto.assignees.map((e) => ({ id: e })) as User[],
    });
  }

  async deleteUserOwnTask(authUser: AuthUser, taskId: number) {
    const task = await this.getUserOwnTask(authUser, taskId);
    if (!task) throw new NotFoundException('Task not found!');
    return this.taskRepository.remove(task);
  }
}
