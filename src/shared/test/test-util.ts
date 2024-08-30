import { User } from './../../user/entities/user.entity';

export default class TestUtil {
  static giveAMeAvalidUser(): User {
    const user = new User();

    (user.email = 'valid@email.com'),
      (user.name = 'valid name'),
      (user.id = '1');

    return user;
  }
}
