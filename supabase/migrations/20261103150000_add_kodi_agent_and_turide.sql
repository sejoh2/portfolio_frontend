-- Content update: add the Kodi AI Agent and tuRide projects, Kodi's extra links,
-- the tuRide line on the AnnexTechnologies role, and the featured order. Safe to re-run.

insert into public.projects (title, description, category, tags, image_url, demo_url, code_url, links, featured, published)
select 'Kodi AI Agent', 'An AI sales and support agent for Kodi. It qualifies landlord leads over web chat, WhatsApp and Messenger, books demos in Google Calendar, and gives owners a morning brief and a voice assistant. Actions run at three autonomy levels (act alone, needs approval with a PIN for money, alert at once) with an append-only audit log.', 'AI Agents', array['Node.js', 'Express', 'PostgreSQL', 'Gemini', 'WhatsApp Cloud API', 'Google Calendar', 'React']::text[], '/projects/kodi-agent.jpg', 'https://rental-management-system-agent.onrender.com', null, '[{"label":"Kodi web app","url":"https://rental-managemtn-system-frontend.onrender.com"}]'::jsonb, true, true
where not exists (select 1 from public.projects where title = 'Kodi AI Agent');

insert into public.projects (title, description, category, tags, image_url, demo_url, code_url, links, featured, published)
select 'tuRide · Ride Aggregator', 'Compares ride-hailing fares across Uber, Bolt, Yego and Faras in real time. Riders enter pickup and drop-off and get a side-by-side comparison of price, arrival time and vehicle type in under 5 seconds, so they stop overpaying. Built at AnnexTechnologies.', 'Mobility', array['Node.js', 'PostgreSQL', 'REST APIs']::text[], '/projects/turide.jpg', 'https://tu-ride.netlify.app', null, '[{"label":"Case study","url":"https://annex-technologies.com/projects/turide-ride-aggregator-platform-8a9d9e"}]'::jsonb, true, true
where not exists (select 1 from public.projects where title = 'tuRide · Ride Aggregator');

update public.projects
set links = '[{"label":"API docs","url":"https://rental-managemtn-system-backend.onrender.com/api-docs"},{"label":"AI agent","url":"https://rental-management-system-agent.onrender.com"},{"label":"Web app code","url":"https://github.com/sejoh2/Rental_managemtn_system_frontend"},{"label":"Mobile app code","url":"https://github.com/sejoh2/Rental_Management_System_Mobile"}]'::jsonb, description = 'Rent collection, utility billing and caretaker tools for Kenyan landlords. Four apps on one PostgreSQL core (owner web app, REST API, Flutter caretaker app and a Gemini AI sales agent) with M-Pesa payments, SMS reminders and CI on GitHub Actions. Live on Render.'
where title = 'Kodi · Rental Management Platform' and links = '[]'::jsonb;

update public.projects set sort_order = 1, featured = true where title = 'Kodi · Rental Management Platform';
update public.projects set sort_order = 2, featured = true where title = 'Kodi AI Agent';
update public.projects set sort_order = 3, featured = true where title = 'tuRide · Ride Aggregator';
update public.projects set sort_order = 4, featured = true where title = 'WayPoint CRM (Wakandi)';
update public.projects set sort_order = 5, featured = true where title = 'Forex Trading Agent';
update public.projects set sort_order = 6, featured = true where title = 'SACCO Lead-Qualification Agent';
update public.projects set sort_order = 7, featured = false where title = 'Kweli Rentals Mobile App';
update public.projects set sort_order = 8, featured = false where title = 'PM Furniture E-commerce';

update public.experience
set achievements = array_append(achievements, 'Built tuRide, a ride-hailing aggregator that compares Uber, Bolt, Yego and Faras fares in real time')
where company = 'AnnexTechnologies' and not ('Built tuRide, a ride-hailing aggregator that compares Uber, Bolt, Yego and Faras fares in real time' = any(achievements));
