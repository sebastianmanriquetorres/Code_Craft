import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://rfqsuqsclbdeivygopxl.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJmcXN1cXNjbGJkZWl2eWdvcHhsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTk2MjA4MjIsImV4cCI6MjA3NTE5NjgyMn0.l1X2pwuSriLsrAuCzyyFsNuWIva6xnO4-fRejpDIyuM';

const customSupabaseClient = createClient(supabaseUrl, supabaseAnonKey);

export default customSupabaseClient;

export { 
    customSupabaseClient,
    customSupabaseClient as supabase,
};
