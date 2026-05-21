1. What your dummy data should simulate

Each lead must look like a real CRM entry:

Identity: who
Intent: why they came
Context: what they want
Priority: how urgent/value
System: metadata (auto-generated)
2. Recommended approach (best practice)

You should NOT manually hardcode leads.

Instead, your script should:

Step 1: Generate structured random profiles
Step 2: Map them into CRM schema
Step 3: POST them into your API (/api/leads)

That means your CRM is tested through the same pipeline as real users.

3. Dummy Data Strategy (important)
A. Identity (realistic variation)

Generate:

Full names
Emails based on names

Examples:

James Mwangi
Sarah Achieng
Daniel Kimani
B. Intent (classification simulation)

Use controlled categories:

General Inquiry
Pricing Question
Product/Service Request
Demo Request
Partnership
Support
C. Context (message generation)

Generate short realistic messages:

“I would like to know more about your services.”
“Can I get pricing for bulk orders?”
“Interested in scheduling a demo.”
D. Priority (business logic simulation)

You should simulate urgency:

High → immediate purchase intent
Medium → exploring
Low → general browsing

OR derive from intent:

Demo Request → High
Pricing → Medium/High
General Inquiry → Low
E. System fields (auto-handled)

Your script should NOT set these manually:

status = new
createdAt = now
notes = []
source = website_form or test_seed
4. Script Design (clean architecture)

Your seeding script should have 4 layers:

1. Data pools (static arrays)

You define:

Names list
Intent types
Messages templates
Domains for emails
2. Generator function

Creates a structured lead object:

Identity → Intent → Context → Priority → System fields
3. Batch runner

Controls:

number of leads (e.g. 20, 50, 100)
delay between requests (optional)
4. API injector

Sends each lead to:

POST /api/leads
5. Example structure of generated lead (conceptual)

Each generated record should look like:

Identity:
  name: "Sarah Achieng"
  email: "sarah@gmail.com"

Intent:
  "Pricing Question"

Context:
  "Can I get a quote for your service?"

Priority:
  "High"

System:
  status: "new"
  source: "seed_script"
  createdAt: auto
6. Generation logic (important thinking model)

Instead of random data, use correlated generation:

Example rules:
If Intent = Pricing → Context must mention “price / quote / cost”
If Intent = Demo → Context must mention “demo / trial / walkthrough”
If Intent = Partnership → Context must mention “collaboration / integration”

This makes your dataset:

realistic instead of noisy