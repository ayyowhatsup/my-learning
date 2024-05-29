import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { DataSource, Repository } from 'typeorm';
import {
  generateRandomPassword,
  hashPassword,
  verifyPassword,
} from 'src/utils/password';
import { MailService } from 'src/mail/mail.service';
import { TokenService } from 'src/token/token.service';
import { ConfigService } from '@nestjs/config';
import { Token } from 'src/token/entities/token.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
    private mailService: MailService,
    private tokenService: TokenService,
    private configService: ConfigService,
    private dataSource: DataSource,
  ) {}

  async create(createdBy: number, createUserDto: CreateUserDto): Promise<User> {
    return this.dataSource.manager.transaction(async (manager) => {
      const { email } = createUserDto;
      if (await this.isEmailUsed(email)) {
        throw new BadRequestException(
          'Invalid email',
          'Email is already used!',
        );
      }
      const password = generateRandomPassword();
      const hashedPassword: string = await hashPassword(password);
      const newUser = manager.getRepository(User).create({
        ...createUserDto,
        password: hashedPassword,
        createdBy: { id: createdBy },
      });
      await manager.getRepository(User).save(newUser);
      const token: string = await this.tokenService.generateResetPasswordToken(
        newUser,
        manager.getRepository(Token),
      );
      const resetPasswordLink = `${this.configService.get<string>(
        'storefront_reset_password_url',
      )}?token=${token}`;

      this.mailService.sendEmailRegisterConfirmation(email, resetPasswordLink);

      return newUser;
    });
  }

  findAll(): Promise<User[]> {
    return this.userRepository.find();
  }

  findById(id: number): Promise<User> {
    return this.userRepository.findOneBy({ id });
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    return this.userRepository.save({
      ...updateUserDto,
      id: id,
      ...(updateUserDto.password
        ? { password: await hashPassword(updateUserDto.password) }
        : {}),
    });
  }

  remove(id: number) {
    return this.userRepository.delete({ id });
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
