import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
  ) {}

  async findAllUsers() {
    return await this.userRepository.find();
  }

  async findUserById(id: string) {
    const user = await this.userRepository.findOne({ where: { id: id } });

    if (!user) {
      throw new NotFoundException({ message: 'User not found' });
    }

    return user;
  }

  async findUserByEmail(email: string) {
    const user = await this.userRepository.findOne({ where: { email: email } });

    if (!user) {
      throw new NotFoundException({ message: 'User not found' });
    }

    return user;
  }

  async createUser(createUserDto: CreateUserDto) {
    try {
      return await this.userRepository.save(createUserDto);
    } catch (err) {
      throw new ConflictException({ message: 'Error creating user' });
    }
  }

  async updateUser(id: string, updateUserDto: UpdateUserDto) {
    const user = await this.findUserById(id);

    return await this.userRepository.update(user.id, updateUserDto);
  }

  async deleteUser(id: string) {
    const user = await this.findUserById(id);

    return await this.userRepository.delete(user.id);
  }
}
