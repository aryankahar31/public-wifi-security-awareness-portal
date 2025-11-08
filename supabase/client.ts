import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://qyrykhovfvuetmyhqgth.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InF5cnlraG92ZnZ1ZXRteWhxZ3RoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjI1OTM5MTgsImV4cCI6MjA3ODE2OTkxOH0.hWh8Qqv7nDRVi-xYm72yM03NmtcdY_Hn1xwJclls-Dg';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
