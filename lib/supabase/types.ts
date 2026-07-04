/**
 * Groundcrew Supabase schema types (PRD §5 adaptation).
 * Hand-written — replace with `supabase gen types` when the schema is live.
 */
export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      orgs: {
        Row: {
          id: string;
          name: string;
          slug: string;
          plan: "free" | "pro" | "enterprise";
          created_at: string;
        };
        Insert: Omit<Database["public"]["Tables"]["orgs"]["Row"], "id" | "created_at"> & {
          id?: string;
          created_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["orgs"]["Insert"]>;
      };
      org_members: {
        Row: {
          id: string;
          org_id: string;
          user_id: string;
          role: "owner" | "admin" | "member";
          created_at: string;
        };
        Insert: Omit<Database["public"]["Tables"]["org_members"]["Row"], "id" | "created_at"> & {
          id?: string;
          created_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["org_members"]["Insert"]>;
      };
      projects: {
        Row: {
          id: string;
          org_id: string;
          name: string;
          client_name: string;
          client_email: string;
          status: "runway" | "review" | "cleared" | "pushed" | "portal_active" | "complete";
          sow_storage_path: string | null;
          portal_token: string;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database["public"]["Tables"]["projects"]["Row"], "id" | "created_at" | "updated_at" | "portal_token"> & {
          id?: string;
          created_at?: string;
          updated_at?: string;
          portal_token?: string;
        };
        Update: Partial<Database["public"]["Tables"]["projects"]["Insert"]>;
      };
      extractions: {
        Row: {
          id: string;
          project_id: string;
          pass: 1 | 2;
          raw_json: Json;
          item_count: number;
          verified_count: number;
          created_at: string;
        };
        Insert: Omit<Database["public"]["Tables"]["extractions"]["Row"], "id" | "created_at"> & {
          id?: string;
          created_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["extractions"]["Insert"]>;
      };
      extraction_items: {
        Row: {
          id: string;
          extraction_id: string;
          project_id: string;
          title: string;
          category: string;
          cite_id: string | null;
          page: number | null;
          status: "verified" | "needs_review" | "waived";
          waive_reason: string | null;
          pushed_task_id: string | null;
          created_at: string;
        };
        Insert: Omit<Database["public"]["Tables"]["extraction_items"]["Row"], "id" | "created_at"> & {
          id?: string;
          created_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["extraction_items"]["Insert"]>;
      };
      portal_checklist: {
        Row: {
          id: string;
          project_id: string;
          step: string;
          label: string;
          done: boolean;
          done_at: string | null;
        };
        Insert: Omit<Database["public"]["Tables"]["portal_checklist"]["Row"], "id"> & {
          id?: string;
        };
        Update: Partial<Database["public"]["Tables"]["portal_checklist"]["Insert"]>;
      };
      chase_events: {
        Row: {
          id: string;
          project_id: string;
          channel: "email" | "slack";
          subject: string;
          sent_at: string;
        };
        Insert: Omit<Database["public"]["Tables"]["chase_events"]["Row"], "id"> & {
          id?: string;
        };
        Update: Partial<Database["public"]["Tables"]["chase_events"]["Insert"]>;
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
  };
}
