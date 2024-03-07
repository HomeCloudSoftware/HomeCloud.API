import { Folder } from '@prisma/client';

import FolderController, { FolderData, UpdateFolder } from '../controllers/Folder';

import { handleDBError } from './_handleDBError';

const getAll = async (): Promise<Folder[]> => {
  return await FolderController.getFolders();
};

const getById = async (id: number): Promise<Folder> => {
  try {
    return await FolderController.getFolderById(id);  
  } catch (error) {
    handleDBError(error);
  }
};

export type FolderCreate = Omit<FolderData, 'url'>

const create = async (data: FolderCreate): Promise<Folder> => {
  try {
    const folder: Folder = await FolderController.createFolder({
      ...data,
      url: `/upload/${data.userId}/${data.name}`,
    }); 

    return folder;
  } catch (error) {
    handleDBError(error);
  }
};

const update = async (id: number, data: UpdateFolder): Promise<Folder> => {
  try {
    await getById(id);

    return await FolderController.updateFolder(id, data);
  } catch (error) {
    handleDBError(error);
  }
};

const deleteById = async (id: number): Promise<boolean> => {
  try {
    const deleted = FolderController.deleteFolder(id);
    return deleted;
  } catch (error) {
    handleDBError(error);
  }
};

export default {
  getAll,
  getById,
  create,
  update,
  deleteById,
};