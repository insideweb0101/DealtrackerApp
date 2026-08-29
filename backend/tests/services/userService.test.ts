import { userService } from '../../src/services/userService';
import { userModel } from '../../src/models/User';

jest.mock('../../src/models/User');

describe('User Service', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should register a new user', async () => {
    const userData = {
      email: 'test@example.com',
      name: 'Test User',
      password_hash: 'password123',
      role: 'sales_rep',
    };

    (userModel.findByEmail as jest.Mock).mockResolvedValue(null);
    (userModel.create as jest.Mock).mockResolvedValue({
      id: 'user-1',
      ...userData,
    });

    const result = await userService.register(
      userData.email,
      userData.name,
      'password123'
    );

    expect(result.token).toBeDefined();
    expect(result.user).toBeDefined();
  });

  it('should login user with valid credentials', async () => {
    const user = {
      id: 'user-1',
      email: 'test@example.com',
      name: 'Test User',
      role: 'sales_rep',
    };

    (userModel.verifyPassword as jest.Mock).mockResolvedValue(user);

    const result = await userService.login('test@example.com', 'password123');

    expect(result.token).toBeDefined();
    expect(result.user).toEqual(user);
  });

  it('should throw error if user already exists', async () => {
    const userData = {
      email: 'test@example.com',
      name: 'Test User',
      password_hash: 'password123',
    };

    (userModel.findByEmail as jest.Mock).mockResolvedValue(userData);

    await expect(
      userService.register(userData.email, userData.name, 'password123')
    ).rejects.toThrow('User already exists');
  });
});
