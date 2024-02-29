import { Role, User } from '@prisma/client';

import { getPrisma } from '../data';

const prisma = getPrisma();

export type UserCreate = Omit<User, 'homeFolderId'>

const getUsers = async (): Promise<User[]> => {
  return await prisma.user.findMany();
};

const getAdmins = async (): Promise<User[]> => {
  return await prisma.user.findMany({
    where: { role: Role.ADMIN },
  });
};

const getUserById = async (id: string): Promise<User> => {
  return await prisma.user.findFirst({
    where: { id },
  });
};


const createUser = async (data: UserCreate): Promise<User> => {
  const user = await prisma.user.upsert({ 
    where: {email: data.email},
    update: {},
    create: {
      ...data,
      home: {
        create: {
          name: 'home',
          url: `/storage/users/${data.id}/`,
        },
      },
    },
  });

  return user;
};

export interface UpdateUser {
    firstname?: string;
    lastname?: string;
    email?: string;
    profilePic?: string;
    role?: Role;
}

const updateUser = async (id: string, data: UpdateUser) => {

  const user = await prisma.user.update({
    where: { id },
    data,
  });

  return user;
};

const deleteUser = async (id: string): Promise<boolean> => {
  const user = await prisma.user.delete({
    where: { id },
  });

  return user !== null;
};

export default { getUsers, getAdmins, getUserById, createUser, updateUser, deleteUser };