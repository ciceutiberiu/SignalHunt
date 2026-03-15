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
      profiles: {
        Row: {
          id: string;
          email: string;
          display_name: string | null;
          plan: "free" | "starter" | "pro";
          stripe_customer_id: string | null;
          stripe_subscription_id: string | null;
          subscription_status: string | null;
          keyword_limit: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          email: string;
          display_name?: string | null;
          plan?: "free" | "starter" | "pro";
          stripe_customer_id?: string | null;
          stripe_subscription_id?: string | null;
          subscription_status?: string | null;
          keyword_limit?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          email?: string;
          display_name?: string | null;
          plan?: "free" | "starter" | "pro";
          stripe_customer_id?: string | null;
          stripe_subscription_id?: string | null;
          subscription_status?: string | null;
          keyword_limit?: number;
          updated_at?: string;
        };
      };
      keywords: {
        Row: {
          id: string;
          user_id: string;
          keyword: string;
          is_active: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          keyword: string;
          is_active?: boolean;
          created_at?: string;
        };
        Update: {
          keyword?: string;
          is_active?: boolean;
        };
      };
      signals: {
        Row: {
          id: string;
          reddit_post_id: string;
          reddit_type: "post" | "comment";
          title: string | null;
          body: string | null;
          subreddit: string;
          author: string;
          reddit_url: string;
          permalink: string;
          reddit_created_at: string;
          matched_keyword: string;
          intent_score: number | null;
          intent_label: "high" | "medium" | "low" | "none" | null;
          summary: string | null;
          classified_at: string | null;
          classification_attempts: number;
          upvotes: number;
          num_comments: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          reddit_post_id: string;
          reddit_type?: "post" | "comment";
          title?: string | null;
          body?: string | null;
          subreddit: string;
          author: string;
          reddit_url: string;
          permalink: string;
          reddit_created_at: string;
          matched_keyword: string;
          intent_score?: number | null;
          intent_label?: "high" | "medium" | "low" | "none" | null;
          summary?: string | null;
          classified_at?: string | null;
          classification_attempts?: number;
          upvotes?: number;
          num_comments?: number;
          created_at?: string;
        };
        Update: {
          intent_score?: number | null;
          intent_label?: "high" | "medium" | "low" | "none" | null;
          summary?: string | null;
          classified_at?: string | null;
          classification_attempts?: number;
        };
      };
      user_signals: {
        Row: {
          id: string;
          user_id: string;
          signal_id: string;
          status: "new" | "viewed" | "saved" | "contacted" | "archived";
          notes: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          signal_id: string;
          status?: "new" | "viewed" | "saved" | "contacted" | "archived";
          notes?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          status?: "new" | "viewed" | "saved" | "contacted" | "archived";
          notes?: string | null;
          updated_at?: string;
        };
      };
      ingestion_log: {
        Row: {
          id: string;
          job_type: string;
          keywords_processed: number;
          signals_created: number;
          signals_classified: number;
          errors: Json | null;
          duration_ms: number;
          started_at: string;
          completed_at: string;
        };
        Insert: {
          id?: string;
          job_type: string;
          keywords_processed?: number;
          signals_created?: number;
          signals_classified?: number;
          errors?: Json | null;
          duration_ms?: number;
          started_at?: string;
          completed_at?: string;
        };
        Update: {};
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
}
