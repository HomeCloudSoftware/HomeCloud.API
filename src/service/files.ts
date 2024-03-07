import { File } from '@prisma/client';

import FileController, { UpdateFile } from '../controllers/File';

import FolderService from './folders';
import { handleDBError } from './_handleDBError';

interface FileData {
  name: string;
  url: string;
  createdAt?: Date;
  updatedAt?: Date;
  type: string;
  size: number;
  userId: string;
  folderId: number;
}

const getAll = async (): Promise<File[]> => {
  return await FileController.getFiles();
};

const getById = async (id: number): Promise<File> => {
  try {
    return await FileController.getFileById(id);

  } catch (error) {
    handleDBError(error);
  }
};

export type FileCreate = Omit<FileData, 'url'>

const create = async (data: FileCreate): Promise<File> => {
  try {
    const folder = await FolderService.getById(data.folderId);

    const file = await FileController.createFile({
      ...data,
      url: `${folder.url}/${data.name}`, 
    });

    return file;
  } catch (error) {
    handleDBError(error);
  }
};

const update = async (id: number, data: UpdateFile) => {
  try {
    const prefFile = await getById(id);

    let folderUrl = null;
    if (data.folderId != null) {
      folderUrl = (await FolderService.getById(data.folderId)).url;
    }

    return await FileController.updateFile(id, {
      ...data,
      url: folderUrl && `${folderUrl}/${data.name ? data.name : prefFile.name}`,
    });
  } catch (error) {
    handleDBError(error);
  } 
};

const deleteById = async (id: number): Promise<boolean> => {
  try {
    return await FileController.deleteFile(id);
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