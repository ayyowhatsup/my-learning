import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import {
  generateRandomPassword,
  hashPassword,
  verifyPassword,
} from 'src/utils/password';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
  ) {}

  async create(createdBy: number, createUserDto: CreateUserDto): Promise<User> {
    const { email } = createUserDto;
    if (await this.isEmailUsed(email)) {
      throw new BadRequestException('Invalid email', 'Email is already used!');
    }
    const password = generateRandomPassword();
    const hashedPassword: string = await hashPassword(password);
    const newUser = this.userRepository.create({
      ...createUserDto,
      password: hashedPassword,
      createdBy: { id: createdBy },
    });
    return this.userRepository.save(newUser);
  }

  findAll(): Promise<User[]> {
    return this.userRepository.find();
  }

  findById(id: number): Promise<User> {
    return this.userRepository.findOneBy({ id });
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }

  async findByEmailAndPassword(email, password): Promise<User | null> {
    const user = await this.findByEmail(email);
    if (user && (await verifyPassword(password, user.password))) return user;
    return null;
  }

  async isEmailUsed(email: string): Promise<boolean> {
    return (await this.findByEmail(email)) ? true : false;
  }

  findByEmail(email: string): Promise<User | null> {
    return this.userRepository.findOneBy({ email });
  }

  async updatePassword(userId: number, password: string): Promise<User> {
    const user = await this.findById(userId);
    if (!user) {
      throw new NotFoundException('User not found!');
    }
    user.password = await hashPassword(password);
    return this.userRepository.save(user);
  }

  async verifyUserPassword(userId: number, password: string): Promise<boolean> {
    const user = await this.findById(userId);
    return verifyPassword(password, user.password);
  }
}
