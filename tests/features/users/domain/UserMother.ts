import { User } from '@features/users/domain/User';

export class UserMother {
  static aUser(overrides?: Partial<User>): User {
    const base: User = {
      id: 'user-1',
      name: 'John Doe',
    };
    return {
      ...base,
      ...overrides,
    };
  }

  static johnDoe(): User {
    return {
      id: 'user-1',
      name: 'John Doe',
    };
  }

  static janeSmith(): User {
    return {
      id: 'user-2',
      name: 'Jane Smith',
    };
  }

  static bobJohnson(): User {
    return {
      id: 'user-3',
      name: 'Bob Johnson',
    };
  }

  static random(overrides?: Partial<User>): User {
    const base = this.aUser();
    return {
      ...base,
      id: `user-${Math.random().toString(36).substr(2, 9)}`,
      ...overrides,
    };
  }
}
