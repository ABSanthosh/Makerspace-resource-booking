import { db } from '$lib/prisma';

// get content by pathname
export const getContentByPathname = async (pathname: string) => {
  return await db.contentManagement.findFirst({
    where: {
      pathname: pathname
    }
  });
};

// get content by id
export const getContentById = async (id: string) => {
  return await db.contentManagement.findFirst({
    where: {
      id: id
    }
  });
};

export const getAllContent = async () => {
  return await db.contentManagement.findMany();
};

// update data by id
export const updateContentById = async (id: string, data: Object) => {
  return await db.contentManagement.update({
    where: {
      id: id
    },
    data: {
      data: data as any
    }
  });
};
