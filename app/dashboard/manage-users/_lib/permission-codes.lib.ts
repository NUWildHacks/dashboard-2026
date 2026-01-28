import { PERMISSION_CODE_TYPE_MAP } from "../_constants";

const getPermissionCodeType = (type: string) => {
  return PERMISSION_CODE_TYPE_MAP[type] || "Unknown";
};

export { getPermissionCodeType };
