import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://xxnkromrfnekzcnalryj.supabase.co';
const supabaseKey = 'sb_publishable_C0ZPKIM9KiNt6WW7w9hAPw_TMo8OBAv';

export const supabase = createClient(supabaseUrl, supabaseKey);
