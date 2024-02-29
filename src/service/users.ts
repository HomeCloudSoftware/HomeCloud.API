import {randomBytes} from 'crypto';

import { Role, User } from '@prisma/client';

import UserController, { UpdateUser } from '../controllers/User';
import { hashPassword } from '../core/passwords';

import { handleDBError } from './_handleDBError';

type ReturnUser = Omit<User, 'password'>;
type UserData = {
  firstname: string;
  lastname: string;
  email: string;
  password: string;
  role: Role;
  profilePic: string;
}

// TODO: Error handling, (trycatch)

const getAll = async (): Promise<ReturnUser[]> => {
  return await UserController.getUsers();
};

const getById = async(id: string): Promise<ReturnUser> => {
  try {
    const user =  await UserController.getUserById(id);

    return user;
  } catch (error) {
    handleDBError(error);
  }
};

const create = async(data: UserData): Promise<ReturnUser> => {
  try {
    
    const passHash = await hashPassword(data.password);
    const userId = randomBytes(11).toString('hex');

    const user = {
      ...data,
      password: passHash,
      id: userId,
    };

    return await UserController.createUser(user);
  } catch (error) {
    handleDBError(error);
  }
};

const update = async (id: string, data: UpdateUser): Promise<ReturnUser> => {

  await getById(id);

  const user = await UserController.updateUser(id, data);

  return user;
};

const deleteById = async (id: string):Promise<boolean>  => {
  const deleted = UserController.deleteUser(id);

  return deleted;
};

export default {
  getAll,
  getById,
  create,
  update,
  deleteById,
};