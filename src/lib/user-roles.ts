import {
  IconSquareRoundedLetterM,
  IconAffiliate,
  IconBuildingBank,
  IconUserCog,
} from "@tabler/icons-react";
import { UserRoleEnum } from "@/sdk/types";

export interface RoleConfig {
  icon: React.ComponentType<{ size?: number; className?: string }>;
  label: string;
  badgeVariant: "default" | "secondary" | "destructive" | "outline";
  color: string;
}

export const ROLE_CONFIG: Record<UserRoleEnum, RoleConfig> = {
  [UserRoleEnum.MERCHANT]: {
    icon: IconSquareRoundedLetterM,
    label: "Merchant",
    badgeVariant: "secondary",
    color: "hsl(var(--secondary-foreground))",
  },
  [UserRoleEnum.SUB_MERCHANT]: {
    icon: IconAffiliate,
    label: "Sub Merchant",
    badgeVariant: "secondary",
    color: "hsl(var(--secondary-foreground))",
  },
  [UserRoleEnum.PARTNER_BANK]: {
    icon: IconBuildingBank,
    label: "Partner Bank",
    badgeVariant: "secondary",
    color: "hsl(var(--secondary-foreground))",
  },
  [UserRoleEnum.ADMIN]: {
    icon: IconUserCog,
    label: "Admin",
    badgeVariant: "secondary",
    color: "hsl(var(--secondary-foreground))",
  },
};

export function getRoleIcon(role: UserRoleEnum) {
  return ROLE_CONFIG[role]?.icon || IconUserCog;
}

export function getRoleLabel(role: UserRoleEnum): string {
  return ROLE_CONFIG[role]?.label || "Unknown Role";
}

export function getRoleBadgeVariant(role: UserRoleEnum) {
  return ROLE_CONFIG[role]?.badgeVariant || "default";
}

export function getRoleColor(role: UserRoleEnum): string {
  return ROLE_CONFIG[role]?.color || "hsl(var(--foreground))";
}

export function isRoleAuthorized(
  userRole: UserRoleEnum,
  requiredRoles: UserRoleEnum[]
): boolean {
  return requiredRoles.includes(userRole);
}

export function getAllRoles(): Array<{ value: UserRoleEnum; label: string }> {
  return Object.values(UserRoleEnum).map((role) => ({
    value: role,
    label: getRoleLabel(role),
  }));
}

export function isValidRole(role: string): role is UserRoleEnum {
  return Object.values(UserRoleEnum).includes(role as UserRoleEnum);
}