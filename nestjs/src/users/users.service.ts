import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async create(createUserDto: Partial<CreateUserDto>): Promise<User> {
    const newUser = this.usersRepository.create(createUserDto);
    return this.usersRepository.save(newUser);
  }

  findAll(): Promise<User[]> {
    return this.usersRepository.find();
  }

  findById(id: number): Promise<User | null> {
    return this.usersRepository.findOneBy({ id });
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return this.usersRepository.update({ id }, updateUserDto);
  }

  remove(id: number) {
    return this.usersRepository.save({ id, isActive: false });
  }

  findByEmail(email: string) {
    return this.usersRepository.findOneBy({ email });
  }

  async isEmailTaken(email: string): Promise<boolean> {
    return !!(await this.usersRepository.findOneBy({ email }));
  }

  async updateUserPassword(id: number, newPassword: string) {
    return this.update(id, { password: newPassword });
  }
}
