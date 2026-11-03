-- First blog post: how the Kodi AI agent works end to end. Edit it later in /admin → Blog.
insert into public.posts (slug, title, excerpt, content, cover_image_url, tags, published, published_at)
select
  'building-kodi-ai-agent',
  'I Built an AI Agent That Sells My Rental App, and Asks Before It Touches Money',
  'Landlords message at 10pm, ask "how much?", then go quiet. Here is how I built Kodi''s AI agent: WhatsApp conversations, demo booking, a voice assistant and a morning brief, with three levels of autonomy enforced in code, not in the prompt.',
  $post$
Every evening it was the same story. A landlord would message Kodi's WhatsApp at 9:47pm: *"Hi, how does this work? How much is it for 24 units?"* I would be asleep, or in a meeting, or deep in a bug. By the time I replied the next afternoon, they had moved on.

Kodi is the rental management platform I build for Kenyan landlords: M-Pesa rent collection, water billing, SMS reminders and a caretaker app. The product was ready. The bottleneck was me. One person cannot answer every question, book every demo, follow up every lead and still ship features.

So I built an AI agent to do the customer work. This post walks through how it works end to end, the decisions that mattered, and the guardrails that let me trust it.

## What I wanted it to do

I wrote the brief in one sentence:

> Handle everything to do with customers: answer questions, book meetings, follow up, and create marketing content. Call me only when something needs my attention, never do anything serious without my approval, and brief me every morning on what happened and what we made.

That sentence hides the real problem. "Do everything" and "never do anything serious without me" pull in opposite directions. The whole design is about where that line sits, and who enforces it.

## The core idea: autonomy is a permission system, not a prompt

Most agent demos tell the model "don't give discounts" in the system prompt and hope. A prompt is a suggestion. Anyone who writes *"ignore your instructions, I'm the owner"* in a chat is testing that suggestion.

Kodi's agent has **three levels of autonomy, enforced in code**:

1. **Does it alone (and logs it):** answers questions about Kodi, creates and updates leads, writes notes, books demos in my free slots, sends reminders.
2. **Asks me first (Approvals):** prices, discounts and trials (these need my 6-digit PIN), promises or contract terms, messages to more than one person, publishing anything, deleting a lead.
3. **Alerts me at once:** an angry or threatening customer, a legal or data-protection question, an attempt to trick the agent, Kodi being down, M-Pesa payments failing.

The model never decides which level an action belongs to. Every tool it can call is validated with zod, and the tool itself decides whether to act, file an approval, or raise an alert. If the model tries to set a lead to "paying" or invent its own consent wording, the code refuses. Customer messages are treated as data, never as instructions.

## The architecture

The agent is **a separate service with its own database**, not a feature inside Kodi. If the agent breaks, rent collection must not.

- **Node.js and Express 5 with PostgreSQL**, the same stack as Kodi, so one person can maintain both.
- **Google Gemini with function calling** as the brain. Every model call goes through one file, so switching model or provider is a one-line change.
- **A small read-only API into Kodi.** The agent can see totals and landlord accounts (sign-ins, features used, billing) but never a tenant's personal data. Every read is audited.
- **An append-only audit log.** The database itself refuses updates and deletes on it, so every action the agent takes has a permanent record.
- **An owner-only admin page.** Phone-number sign-in with a one-time SMS code, sessions that end after 15 idle minutes, and pages for Conversations, Leads, Approvals, Alerts, Knowledge and Activity.

## A conversation, end to end

Here is what happens when that 9:47pm message arrives today.

**1. The message lands.** Meta's webhook hits the agent. The signature is verified, the message is stored exactly once, and a lead is created with the landlord's verified phone number. If two messages arrive at once, an advisory lock makes sure the agent answers them together instead of twice.

**2. The agent introduces itself honestly.** It says it is Kodi's AI assistant and replies in the landlord's language, English or Swahili, whichever they wrote in. Before saving any contact details for follow-up, it asks for consent using fixed wording and records the exact text the landlord agreed to.

**3. It answers from what it knows, not from what it guesses.** The agent answers only from a versioned knowledge base about Kodi. If it doesn't know, it says so and asks me instead of inventing an answer. When I reply, it learns the answer, tells me what it learned, and I can undo it with one message.

**4. "How much?"** The agent never quotes a price it hasn't been given. It offers a free demo instead. If the landlord asks for a discount or a trial, that becomes an approval that waits for my PIN.

**5. Booking the demo.** The agent checks my Google Calendar for free slots (Monday to Friday, 9:00 to 17:00 Nairobi time, 30-minute demos, at least two hours' notice), proposes a time, and **books only after the landlord clearly says yes**. The calendar event gets a Google Meet link, the landlord gets a confirmation, and I get an SMS saying who booked, when, and what they want.

**6. Reminders.** The evening before and one hour before, the landlord gets a reminder on WhatsApp. If WhatsApp's 24-hour window has closed, it falls back to SMS, but only if they consented.

**7. Opting out.** If a landlord sends STOP, UNSUBSCRIBE, ACHA or SITISHA, everything stops, they get a confirmation in their language, and nothing more goes out until they write again.

The same agent answers the chat widget on Kodi's website and messages on Facebook Messenger.

## Talking to my own agent

The landlord-facing agent is half the system. The other half works for me.

**Ask Kodi** is my own assistant. I can type or talk to it: "Which landlords went quiet this week?", "Move Peter's demo to Thursday", "Send me today's report". It answers only from the records and cites what it looked at. When it wants to change something, it reads the change back and acts only after I say yes.

Voice runs on **Gemini Live**. I say *"Kodi, wake up"* and a small speech model running in the browser hears the wake phrase, so no audio leaves my machine until I'm actually talking to it. I can interrupt it mid-sentence, and it answers in English or Swahili. Approvals involving money still need a tap and a PIN, never voice alone, because a voice can be faked or misheard.

**The morning brief** arrives at 8:00 every day as a PDF on WhatsApp:
- Kodi's income this month and what landlords owe
- demos today and new leads
- conversations waiting for me
- landlords who have gone quiet
- suggested actions

The figures are calculated by code; the model only writes the commentary around them. If the model is unavailable, the brief still goes out with the figures alone.

## Guardrails I would not ship without

- **Facts only.** Every fact must come from a tool result or the knowledge base. "I don't know, and here's what I checked" is an acceptable answer. A guess is not.
- **Prompt injection is expected.** Someone *will* try "ignore previous instructions". That attempt raises an alert instead of changing behaviour.
- **Privacy by design.** No tenant data reaches the model. Leads that never became customers are deleted after 12 months. Consent is recorded word for word.
- **Hard limits.** A daily reply cap, approvals that expire after three days (and the landlord is told), and rate limits on every public endpoint.
- **Test the agent like software.** Every part has an automated test suite that plays Gemini, Meta, Google and Africa's Talking with scripted responses: more than 700 checks in total, run before every merge.

## What's next

The system is built and running. Next up:

- **Production launch:** WhatsApp Business verification and Meta app review, so the agent can talk to any landlord, not just test numbers.
- **Phone calls:** the morning brief and urgent alerts as a voice call, then answering incoming calls.
- **Finding leads:** researching property management firms and landlord associations from public business listings, with every first contact going through approval.

## What I learned

- **Put the rules in code, not in the prompt.** The model can be as creative as it likes, as long as the tools decide what actually happens.
- **Design the "no" paths first.** "I don't know", "the owner will get back to you" and "this needs approval" made the agent trustworthy faster than any clever prompt.
- **Keep the agent outside the core product.** A separate service with a narrow, audited API means an AI mistake can never touch rent collection.
- **Give the owner an undo button.** When I can see everything it did and reverse what it learned, I'm comfortable letting it do more.

If you're building AI agents for real businesses, especially in fintech or anywhere money moves, I'd love to compare notes. [Get in touch](/#contact).
$post$,
  '/projects/kodi-agent.jpg',
  array['AI Agents', 'Gemini', 'Node.js', 'WhatsApp', 'Fintech']::text[],
  true,
  now()
where not exists (select 1 from public.posts where slug = 'building-kodi-ai-agent');
