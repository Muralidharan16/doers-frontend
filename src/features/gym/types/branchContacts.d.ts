export type ContactKind = "phone" | "email";
export type VisibilityScope = "public" | "internal" | "management" | "emergency" | "billing";
export interface ChannelCapabilities {
    whatsapp?: boolean;
    sms?: boolean;
    voice?: boolean;
    fax?: boolean;
}
export interface BranchContact {
    id: string;
    branch_id: string;
    contact_kind: ContactKind;
    contact_label: string;
    visibility_scope: VisibilityScope;
    is_primary: boolean;
    phone_number?: string;
    country_code?: string;
    phone_e164?: string;
    channel_capabilities?: ChannelCapabilities;
    email?: string;
    email_normalized?: string;
    created_at?: string;
    updated_at?: string;
}
export interface CreateBranchContactPayload {
    contact_kind: ContactKind;
    contact_label: string;
    visibility_scope: VisibilityScope;
    is_primary?: boolean;
    phone_number?: string;
    country_code?: string;
    channel_capabilities?: ChannelCapabilities;
    email?: string;
}
export interface UpdateBranchContactPayload {
    contact_label?: string;
    visibility_scope?: VisibilityScope;
    is_primary?: boolean;
    phone_number?: string;
    country_code?: string;
    channel_capabilities?: ChannelCapabilities;
    email?: string;
}
