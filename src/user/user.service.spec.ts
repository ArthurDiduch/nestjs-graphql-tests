import { ConflictException, NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import TestUtil from './../shared/test/test-util';
import { User } from './entities/user.entity';
import { UserService } from './user.service';

describe('UserService', () => {
  let service: UserService;

  const mockRepository = {
    find: jest.fn(),
    findOne: jest.fn(),
    save: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  };

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: getRepositoryToken(User),
          useValue: mockRepository,
        },
      ],
    }).compile();

    service = module.get<UserService>(UserService);
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findAllUsers', () => {
    it('should be list all users', async () => {
      const user = TestUtil.giveAMeAvalidUser();
      mockRepository.find.mockReturnValue([user, user]);

      const users = await service.findAllUsers();
      expect(users).toHaveLength(2);
      expect(mockRepository.find).toHaveBeenCalledTimes(1);
    });
  });

  describe('findUserById', () => {
    it('should find a existing user', async () => {
      const user = TestUtil.giveAMeAvalidUser();
      mockRepository.findOne.mockReturnValue(user);

      const foundUser = await service.findUserById(user.id);
      expect(foundUser).toEqual(user);
      expect(foundUser).toMatchObject({ name: user.name });
      expect(mockRepository.findOne).toHaveBeenCalledWith({
        where: { id: user.id },
      });
      expect(mockRepository.findOne).toHaveBeenCalledTimes(1);
    });

    it('should return an exception when it does not find a user', async () => {
      const user = TestUtil.giveAMeAvalidUser();
      mockRepository.findOne.mockReturnValue(null);

      expect(service.findUserById(user.id)).rejects.toBeInstanceOf(
        NotFoundException,
      );
      expect(mockRepository.findOne).toHaveBeenCalledTimes(1);
    });
  });

  describe('createUser', () => {
    it('should create a new user', async () => {
      const user = TestUtil.giveAMeAvalidUser();
      const createUserDto = {
        name: user.name,
        email: user.email,
        password: user.password,
      };
      mockRepository.save.mockReturnValue(user);

      const savedUser = await service.createUser(createUserDto);
      expect(mockRepository.save).toHaveBeenCalledTimes(1);
      expect(savedUser).toEqual(user);
      expect(savedUser).toMatchObject({ name: user.name, email: user.email });
      expect(mockRepository.save).toHaveBeenCalledWith(createUserDto);
    });

    it('should throw a ConflictException when save fails', async () => {
      const user = TestUtil.giveAMeAvalidUser();
      const createUserDto = {
        name: user.name,
        email: user.email,
        password: user.password,
      };

      mockRepository.save.mockRejectedValue(new Error('Save failed'));

      await expect(service.createUser(createUserDto)).rejects.toBeInstanceOf(
        ConflictException,
      );

      expect(mockRepository.save).toHaveBeenCalledTimes(1);
      expect(mockRepository.save).toHaveBeenCalledWith(createUserDto);
    });
  });

  describe('updateUser', () => {
    it('should update an existing user', async () => {
      const user = TestUtil.giveAMeAvalidUser();
      const updateUserDto = { name: 'updated name' };

      mockRepository.findOne.mockResolvedValue(user);
      mockRepository.update.mockResolvedValue({ ...user, ...updateUserDto });

      const updatedUser = await service.updateUser(user.id, updateUserDto);

      expect(mockRepository.findOne).toHaveBeenCalledWith({
        where: { id: user.id },
      });
      expect(mockRepository.findOne).toHaveBeenCalledTimes(1);

      expect(mockRepository.update).toHaveBeenCalledWith(
        user.id,
        updateUserDto,
      );
      expect(mockRepository.update).toHaveBeenCalledTimes(1);

      expect(updatedUser).toEqual({ ...user, ...updateUserDto });
    });

    it('should throw a NotFoundException if the user does not exist', async () => {
      const updateUserDto = { name: 'updated name' };

      mockRepository.findOne.mockResolvedValue(null);

      await expect(
        service.updateUser('non-existent-id', updateUserDto),
      ).rejects.toBeInstanceOf(NotFoundException);

      expect(mockRepository.findOne).toHaveBeenCalledWith({
        where: { id: 'non-existent-id' },
      });
      expect(mockRepository.findOne).toHaveBeenCalledTimes(1);
      expect(mockRepository.update).not.toHaveBeenCalled();
    });
  });

  describe('deleteUser', () => {
    it('should delete an existing user', async () => {
      const user = TestUtil.giveAMeAvalidUser();

      mockRepository.findOne.mockResolvedValue(user);
      mockRepository.delete.mockResolvedValue({ affected: 1 });

      const result = await service.deleteUser(user.id);

      expect(mockRepository.findOne).toHaveBeenCalledWith({
        where: { id: user.id },
      });
      expect(mockRepository.findOne).toHaveBeenCalledTimes(1);

      expect(mockRepository.delete).toHaveBeenCalledWith(user.id);
      expect(mockRepository.delete).toHaveBeenCalledTimes(1);

      expect(result).toEqual({ affected: 1 });
    });

    it('should throw a NotFoundException if the user does not exist', async () => {
      mockRepository.findOne.mockResolvedValue(null);

      await expect(
        service.deleteUser('non-existent-id'),
      ).rejects.toBeInstanceOf(NotFoundException);

      expect(mockRepository.findOne).toHaveBeenCalledWith({
        where: { id: 'non-existent-id' },
      });
      expect(mockRepository.findOne).toHaveBeenCalledTimes(1);

      expect(mockRepository.delete).not.toHaveBeenCalled();
    });
  });
});
