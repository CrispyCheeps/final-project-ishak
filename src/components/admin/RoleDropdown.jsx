import React, { useState } from 'react';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ChevronDown, User, Shield } from 'lucide-react';
const RoleDropdown = ({ user, onRoleChange }) => {
  const roles = [
    { value: 'user', label: 'User', icon: User },
    { value: 'admin', label: 'Admin', icon: Shield }
  ];

  const getRoleVariant = (role) => {
    switch (role) {
      case 'admin':
        return 'destructive';
      case 'user':
        return 'secondary';
      default:
        return 'secondary';
    }
  };

  const handleRoleChange = (newRole) => {
    if (onRoleChange) {
      onRoleChange(user.id, newRole);
    }
  };

  const currentRole = roles.find(role => role.value === user.role);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-8 px-2 py-1">
          <Badge variant={getRoleVariant(user.role)} className="capitalize">
            {currentRole?.icon && <currentRole.icon className="w-3 h-3 mr-1" />}
            {user.role}
          </Badge>
          <ChevronDown className="w-3 h-3 ml-1" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-24">
        {roles.map((role) => (
          <DropdownMenuItem
            key={role.value}
            onClick={() => handleRoleChange(role.value)}
            className="cursor-pointer"
          >
            <role.icon className="w-4 h-4 mr-2" />
            {role.label}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default RoleDropdown;