import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';

serve(async (req) => {
  const { record } = await req.json();
  const { name, email, message } = record;

  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${Deno.env.get('RESEND_API_KEY')}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from: 'Portfolio Contact <onboarding@resend.dev>',
      to: 'egebilir@gmail.com',
      subject: `Portfolio: New message from ${name}`,
      html: `
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> <a href="mailto:${email}">${email}</a></p>
        <p><strong>Message:</strong><br>${message.replace(/\n/g, '<br>')}</p>
      `,
    }),
  });

  const data = await res.json();
  return new Response(JSON.stringify(data), {
    headers: { 'Content-Type': 'application/json' },
    status: res.ok ? 200 : 500,
  });
});
