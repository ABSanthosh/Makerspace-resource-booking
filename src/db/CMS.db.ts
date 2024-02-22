import { db } from '$lib/prisma';

// get content by pathname
export const getContentByPathname = async (pathname: string) => {
  return await db.contentManagement.findFirst({
    where: {
      pathname: pathname
    }
  });
};