import { getFirestore } from "firebase-admin/firestore";

import { PermissionCode } from "@/app/registration/_types";
import { PERMISSION_CODES_COLLECTION } from "@/constants";

export const getPermissionCodes = async (): Promise<PermissionCode[]> => {
  const db = getFirestore();

  const permissionCodeDocRef = db.collection(PERMISSION_CODES_COLLECTION);

  const permissionCodeDocSnapshots = await permissionCodeDocRef.get();

  if (!permissionCodeDocSnapshots.docs.length) {
    return [];
  }

  return permissionCodeDocSnapshots.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  })) as PermissionCode[];
};
