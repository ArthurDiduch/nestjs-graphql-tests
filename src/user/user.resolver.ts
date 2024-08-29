import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { UserService } from './user.service';

@Resolver()
export class UserResolver {
  constructor(private readonly userService: UserService) {}

  @Query(() => [User])
  async users() {
    return await this.userService.findAllUsers();
  }

  @Query(() => User)
  async user(@Args('id') id: string) {
    return await this.userService.findUserById(id);
  }

  @Mutation(() => User)
  async createUser(@Args('createUserDto') createUserDto: CreateUserDto) {
    return await this.userService.createUser(createUserDto);
  }

  @Mutation(() => Boolean)
  async updateUser(
    @Args('id') id: string,
    @Args('updateUserDto') updateUserDto: UpdateUserDto,
  ): Promise<boolean> {
    const result = await this.userService.updateUser(id, { ...updateUserDto });

    return result.affected > 0;
  }

  @Mutation(() => Boolean)
  async deleteUser(@Args('id') id: string): Promise<boolean> {
    const result = await this.userService.deleteUser(id);

    return result.affected > 0;
  }
}
