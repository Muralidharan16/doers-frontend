import type { BranchContact, CreateBranchContactPayload, UpdateBranchContactPayload } from '../types/branchContacts';
export declare const getBranchContacts: (branchId: string) => Promise<BranchContact[]>;
export declare const createBranchContact: (branchId: string, payload: CreateBranchContactPayload) => Promise<BranchContact>;
export declare const updateBranchContact: (branchId: string, contactId: string, payload: UpdateBranchContactPayload) => Promise<BranchContact>;
export declare const deleteBranchContact: (branchId: string, contactId: string) => Promise<void>;
export declare const promoteBranchContact: (branchId: string, contactId: string) => Promise<BranchContact>;
