import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://lrckixazluezrxvgpome.supabase.co'
const supabaseKey = 'sb_publishable_52buJetpH7W56KF4V0DEmA_4_F5Wv3k'

export const supabase = createClient(
  supabaseUrl,
  supabaseKey
)