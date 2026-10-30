<?php
// Configuration for Supabase Database
// Uses production credentials with environment variable fallback support

return [
    'supabase_url' => getenv('NEXT_PUBLIC_SUPABASE_URL') ?: (getenv('SUPABASE_URL') ?: 'https://lwjncfbpknvwinkuptue.supabase.co'),
    'supabase_key' => getenv('SUPABASE_SERVICE_ROLE_KEY') ?: (getenv('SUPABASE_KEY') ?: 'sb_secret_7fwQXwcbNdDnebi8qg1HnA_YrwyOjZ-'),
    'project_ref' => getenv('FULLSTACK_PROJECT_REF') ?: 'lwjncfbpknvwinkuptue',
    'restore_url' => getenv('FULLSTACK_RESTORE_API_URL') ?: 'https://designarena.ai/api/fullstack-restore',
];
