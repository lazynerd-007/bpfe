import React from 'react';
import {Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle} from "@/components/ui/dialog";
import {CreateUserForm} from "@/features/users/create-user/create-user-form";

interface CreateUserModalProps {
    showCreateDialog: boolean;
    setShowCreateDialog: (show: boolean) => void;
}

export const CreateUserModal = ({
                             showCreateDialog,
                             setShowCreateDialog,
                         }: CreateUserModalProps) => {
    return (
        <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
            <DialogContent className="max-w-3xl w-full">
                <DialogHeader>
                    <DialogTitle>Add a New User</DialogTitle>
                    <DialogDescription>
                        Fill in the details below to create a new user account.
                    </DialogDescription>
                </DialogHeader>
                <CreateUserForm onSuccess={() => setShowCreateDialog(false)}/>
            </DialogContent>
        </Dialog>
    );
};