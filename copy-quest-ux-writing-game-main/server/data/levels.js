// Level content. Each playable level = one company, three rounds (screens).
// Field rules drive the heuristic grader:
//   kind:  headline | body | cta | label | title
//   slot:  where the copy renders in the screen mockup
//   max:   character limit
//   hint:  a deliberately open prompt; the screen's `facts` hold the specifics
//   must:  brief requirements; each { need, any } is met if any phrase in `any` appears
//   avoid: words/phrases that cost points on this field
// Stakeholder `cares` maps to a grading metric: voice | clarity | message | action | fit
// Stakeholder `look` (optional) sets their pixel judge: { style: short|bun|bald|spiky|long|afro,
//   skin, hair, shirt (hex colors), glasses: bool, mustache: bool }. Unset parts are picked from the name.

export const levels = [
  {
    id: 'A',
    playable: true,
    company: 'Brightloaf Bakery',
    genre: 'Neighborhood retail',
    stars: 1,
    teaser: 'A family bakery takes preorders online. Keep it warm and keep it short.',
    brand: { color: '#c8692b', ink: '#3b1d0b', surface: '#fff6ec', mark: 'BL' },
    business:
      'Brightloaf is a family-owned bakery with three neighborhood shops that sells out of sourdough by 10 a.m. most days. Regulars know the bakers by name.',
    project:
      'We are launching online preorders so regulars can reserve a loaf the night before and skip the line. It has to feel as warm as the counter.',
    tone: { label: 'Warm, neighborly, a little playful', exclamations: 1, serious: false },
    avoid: ['utilize', 'leverage', 'solution', 'synergy', 'seamless', 'customers'],
    stakeholders: [
      {
        name: 'Rosa Delgado',
        role: 'Owner',
        wants: 'Make it sound like us. If it reads like a bank, I am not shipping it.',
        cares: 'voice',
      },
      {
        name: 'Marcus Lee',
        role: 'Operations Manager',
        wants: 'People must know pickup ends at 11 a.m. or I get angry calls all afternoon.',
        cares: 'message',
      },
      {
        name: 'Priya Shah',
        role: 'Marketing Lead',
        look: { mustache: false },
        wants: 'I need people to actually tap the button. Make the next step obvious.',
        cares: 'action',
      },
    ],
    rounds: [
      {
        title: 'Home hero',
        layout: 'hero',
        goal: 'Invite regulars to preorder tomorrow\'s bread tonight.',
        facts: ["Orders placed tonight are for tomorrow", "Pickup closes at 11 a.m."],
        static: { nav: ['Menu', 'Shops', 'Preorder'] },
        fields: [
          { id: 'headline', slot: 'headline', kind: 'headline', label: 'Headline', max: 40,
            hint: "What should a regular feel the moment they land?",
            must: [
              { need: 'Invite them to reserve or preorder', any: ['preorder', 'reserve', 'save', 'order ahead', 'hold', 'claim', 'set aside'] },
              { need: 'Mention the bread', any: ['loaf', 'bread', 'sourdough', 'bake', 'tomorrow'] }
            ] },
          { id: 'sub', slot: 'body', kind: 'body', label: 'Subhead', max: 100,
            hint: "What's the deal, and what's the catch?",
            must: [
              { need: 'Say when to order: tonight', any: ['tonight', 'night before', 'evening', 'today'] },
              { need: 'Say pickup ends at 11 a.m.', any: ['11', 'eleven'] },
              { need: 'Mention picking up', any: ['pick up', 'pickup', 'grab', 'collect'] }
            ] },
          { id: 'cta', slot: 'cta', kind: 'cta', label: 'Button', max: 22,
            hint: "What happens when they tap?",
            must: [
              { need: 'Name the preorder action', any: ['preorder', 'reserve', 'order', 'save', 'claim', 'hold', 'pick'] }
            ] },
        ],
      },
      {
        title: 'Sold-out product card',
        layout: 'card',
        goal: 'Tomorrow\'s Country Sourdough is gone. Keep the customer around.',
        facts: ["Country Sourdough is sold out for tomorrow", "Friday's batch is still open", "Seeded rye is available"],
        static: { product: 'Country Sourdough', price: '$9' },
        fields: [
          { id: 'badge', slot: 'label', kind: 'label', label: 'Status badge', max: 24,
            hint: "What's the status, at a glance?",
            must: [
              { need: 'Say it is sold out', any: ['sold out', 'all gone', 'gone', 'none left', 'out for'] }
            ] },
          { id: 'body', slot: 'body', kind: 'body', label: 'Helper text', max: 90,
            hint: "Don't leave them empty-handed.",
            must: [
              { need: 'Point to Friday\'s batch', any: ['friday', 'next batch', 'next bake', 'later this week'] },
              { need: 'Offer the seeded rye instead', any: ['rye', 'instead', 'try'] }
            ] },
          { id: 'cta', slot: 'cta', kind: 'cta', label: 'Button', max: 20,
            hint: "How can they avoid missing out next time?",
            must: [
              { need: 'Offer a back-in-stock alert', any: ['notify', 'remind', 'alert', 'tell me', 'text me', 'email me', 'let me know'] }
            ] },
        ],
      },
      {
        title: 'Order confirmation',
        layout: 'confirm',
        goal: 'The loaf is reserved. Confirm it and tell them exactly where and when.',
        facts: ["Shop: Elm Street", "Pickup: Saturday, 7–11 a.m."],
        static: { order: '1 × Country Sourdough', shop: 'Elm Street', window: 'Sat 7–11 a.m.' },
        fields: [
          { id: 'headline', slot: 'headline', kind: 'headline', label: 'Headline', max: 36,
            hint: "How should this moment feel?",
            must: [
              { need: 'Confirm the loaf is reserved', any: ['reserved', 'saved', 'set', 'held', 'yours', 'confirmed', 'got it', 'ready'] }
            ] },
          { id: 'body', slot: 'body', kind: 'body', label: 'Details', max: 130,
            hint: "What do they need to know to actually get their bread?",
            must: [
              { need: 'Name the shop: Elm Street', any: ['elm'] },
              { need: 'Name the day: Saturday', any: ['saturday', 'sat'] },
              { need: 'Say pickup ends at 11 a.m.', any: ['11', 'eleven'] },
              { need: 'Mention picking up', any: ['pick up', 'pickup', 'grab', 'collect', 'swing by', 'come by'] }
            ] },
          { id: 'cta', slot: 'cta', kind: 'cta', label: 'Button', max: 22,
            hint: "What would help them show up?",
            must: [
              { need: 'Offer a calendar reminder or directions', any: ['calendar', 'directions', 'map', 'remind', 'route'] }
            ] },
        ],
      },
    ],
  },
  {
    id: 'B',
    playable: true,
    company: 'Ledgerly',
    genre: 'B2B fintech SaaS',
    stars: 2,
    teaser: 'Bookkeeping software losing 40% of signups at one step. Earn their trust.',
    brand: { color: '#2f6fed', ink: '#0f1d3d', surface: '#f3f6fd', mark: 'L' },
    business:
      'Ledgerly is bookkeeping software for small-business owners who never wanted to learn accounting. It runs on a monthly subscription, so week one decides who stays.',
    project:
      'We are redesigning onboarding around connecting a bank account, the step where 40% of new signups quit. Fix the words and we fix the funnel.',
    tone: { label: 'Plain, confident, reassuring', exclamations: 0, serious: true },
    avoid: ['oauth', 'token', 'api', 'sync', 'credentials', 'leverage', 'utilize', 'seamless', 'oops'],
    stakeholders: [
      {
        name: 'Dana Okafor',
        role: 'VP of Product',
        wants: 'Every screen needs one obvious next step. Activation is my whole quarter.',
        cares: 'action',
      },
      {
        name: 'Sam Whitfield',
        role: 'Security & Compliance',
        wants: 'Explain read-only access honestly. Never promise "100% secure."',
        cares: 'message',
      },
      {
        name: 'Lena Park',
        role: 'Support Lead',
        wants: 'If an error does not say how to fix it, it becomes my ticket.',
        cares: 'clarity',
      },
    ],
    rounds: [
      {
        title: 'Connect your bank',
        layout: 'form',
        goal: 'Get the owner to connect their bank and explain why it is safe.',
        facts: ["Ledgerly can only view transactions, never move money", "Connected accounts sort expenses automatically"],
        static: { step: 'Step 2 of 3', banks: ['Chase', 'Wells Fargo', 'Bank of America', 'Other'] },
        fields: [
          { id: 'headline', slot: 'headline', kind: 'headline', label: 'Headline', max: 45,
            hint: "What are you asking them to do?",
            must: [
              { need: 'Ask them to connect', any: ['connect', 'link', 'add'] },
              { need: 'Mention the bank account', any: ['bank', 'account'] }
            ] },
          { id: 'body', slot: 'body', kind: 'body', label: 'Body', max: 150,
            hint: "Why should a nervous owner trust this step?",
            must: [
              { need: 'Say Ledgerly can only view money, never move it', any: ['read-only', 'view-only', 'only see', 'only view', 'only read', "can't move", 'cannot move', 'never move'] },
              { need: 'Say what it does for them: sorts transactions', any: ['transaction', 'expense', 'automatic', 'categoriz', 'books'] }
            ],
            avoid: ['100%', 'completely secure', 'totally secure', 'guarantee', 'unhackable'] },
          { id: 'cta', slot: 'cta', kind: 'cta', label: 'Button', max: 22,
            hint: "What's the next move?",
            must: [
              { need: 'Name the connect action', any: ['connect', 'link', 'choose', 'find'] }
            ] },
        ],
      },
      {
        title: 'Connection failed',
        layout: 'dialog',
        goal: 'The bank rejected the sign-in. Tell them what happened and how to fix it.',
        facts: ["The bank didn't accept the sign-in", "Usually a wrong or changed bank password", "They can add transactions manually instead"],
        static: {},
        fields: [
          { id: 'title', slot: 'title', kind: 'title', label: 'Title', max: 40,
            hint: "Name what happened, without pointing fingers.",
            must: [
              { need: 'Name what went wrong: the bank sign-in', any: ['connect', 'sign in', 'log in', 'reach', 'bank'] }
            ],
            avoid: ['error', 'failed', 'invalid', 'denied'] },
          { id: 'body', slot: 'body', kind: 'body', label: 'Body', max: 150,
            hint: "What went wrong, and what can they do about it?",
            must: [
              { need: 'Mention the bank', any: ['bank'] },
              { need: 'Point to the password or sign-in', any: ['password', 'sign-in', 'sign in', 'login', 'username'] },
              { need: 'Tell them how to fix it', any: ['try', 'check', 'again', 'reset'] }
            ],
            avoid: ['invalid credentials', 'error code', 'unknown error', 'something went wrong'] },
          { id: 'primary', slot: 'cta', kind: 'cta', label: 'Primary button', max: 20,
            hint: "The obvious way forward.",
            must: [
              { need: 'Offer to try again', any: ['try', 'retry', 'again', 'sign in'] }
            ] },
          { id: 'secondary', slot: 'secondary', kind: 'cta', label: 'Secondary button', max: 26,
            hint: "A way around it.",
            must: [
              { need: 'Offer a way around, like adding manually', any: ['manual', 'upload', 'later', 'skip', 'import', 'another'] }
            ] },
        ],
      },
      {
        title: 'Empty dashboard',
        layout: 'empty',
        goal: 'Nothing is connected yet. Show what they will get and pull them back in.',
        facts: ["No bank is connected yet", "Once one is linked, transactions sort themselves"],
        static: { tabs: ['Overview', 'Expenses', 'Reports'] },
        fields: [
          { id: 'headline', slot: 'headline', kind: 'headline', label: 'Headline', max: 40,
            hint: "What will this space hold?",
            must: [
              { need: 'Name what will show here: cash and expenses', any: ['cash', 'money', 'expense', 'spend', 'income', 'books', 'transaction'] }
            ] },
          { id: 'body', slot: 'body', kind: 'body', label: 'Body', max: 120,
            hint: "Paint a picture of what's coming.",
            must: [
              { need: 'Tell them to connect a bank', any: ['connect', 'link', 'add'] },
              { need: 'Say transactions sort themselves', any: ['automatic', 'sort', 'categoriz', 'organiz', 'appear', 'show up'] }
            ] },
          { id: 'cta', slot: 'cta', kind: 'cta', label: 'Button', max: 24,
            hint: "Get them unstuck.",
            must: [
              { need: 'Name the connect action', any: ['connect', 'link', 'add', 'import', 'upload'] }
            ] },
        ],
      },
    ],
  },
  {
    id: 'C',
    playable: true,
    company: 'Northwind Health',
    genre: 'Healthcare patient portal',
    stars: 3,
    teaser: 'Fourteen clinics, older patients, zero room for confusion. Calm and plain wins.',
    brand: { color: '#1f8a70', ink: '#0d2e26', surface: '#f1f8f5', mark: 'NH' },
    business:
      'Northwind Health runs 14 primary care clinics across the Midwest, and many of its patients are over 65. Phone lines jam every Monday morning.',
    project:
      'We are moving appointment booking into the patient portal so people can book, move or cancel visits without calling. Every word must read at a sixth-grade level.',
    tone: { label: 'Calm, clear, respectful', exclamations: 0, serious: true },
    avoid: ['oops', 'uh oh', 'whoops', 'click here', 'utilize', 'facilitate', 'commence', 'leverage', 'provider portal'],
    stakeholders: [
      {
        name: 'Dr. Amara Nwosu',
        role: 'Chief Medical Officer',
        wants: 'Patients should feel looked after, never rushed or alarmed.',
        cares: 'voice',
      },
      {
        name: 'Greg Holloway',
        role: 'Legal & Compliance',
        wants: 'Emergency guidance must be present. No promises about care outcomes.',
        cares: 'message',
      },
      {
        name: 'Tess Romero',
        role: 'Accessibility Lead',
        wants: 'Short sentences. Plain words. Nothing in all caps.',
        cares: 'clarity',
      },
    ],
    rounds: [
      {
        title: 'Book a visit',
        layout: 'form',
        goal: 'Help patients start booking, and point emergencies away from the portal.',
        facts: ["Visit types: checkup, sick visit, follow-up, other", "Emergencies need 911, not online booking", "Next, they pick a time"],
        static: { step: 'Book a visit', banks: ['Annual checkup', 'Sick visit', 'Follow-up', 'Something else'] },
        fields: [
          { id: 'headline', slot: 'headline', kind: 'headline', label: 'Headline', max: 40,
            hint: "Set the task, kindly.",
            must: [
              { need: 'Invite them to book', any: ['book', 'schedule', 'make'] },
              { need: 'Say visit or appointment', any: ['visit', 'appointment'] }
            ] },
          { id: 'body', slot: 'body', kind: 'body', label: 'Helper text', max: 130,
            hint: "What must every patient know before they start?",
            must: [
              { need: 'Include 911', any: ['911'] },
              { need: 'Mention emergencies', any: ['emergency', 'urgent', 'right away'] },
              { need: 'Tell them to pick a visit type', any: ['choose', 'pick', 'select', 'tell us'] }
            ],
            avoid: ['guarantee', 'cure'] },
          { id: 'cta', slot: 'cta', kind: 'cta', label: 'Button', max: 22,
            hint: "Where does this take them next?",
            must: [
              { need: 'Name the next step: see times', any: ['see', 'find', 'choose', 'pick', 'next', 'show', 'continue'] }
            ] },
        ],
      },
      {
        title: 'Visit reminder',
        layout: 'notification',
        goal: 'Remind them about tomorrow\'s visit and what to bring.',
        facts: ["Tomorrow at 9:30 a.m.", "Oak Park Clinic", "Arrive 10 minutes early", "Bring an insurance card"],
        static: { app: 'Northwind Health', when: 'Tomorrow, 9:30 a.m.', where: 'Oak Park Clinic' },
        fields: [
          { id: 'title', slot: 'title', kind: 'title', label: 'Title', max: 40,
            hint: "What's this about, at a glance?",
            must: [
              { need: 'Say it is tomorrow', any: ['tomorrow'] },
              { need: 'Say visit or appointment', any: ['visit', 'appointment'] }
            ] },
          { id: 'body', slot: 'body', kind: 'body', label: 'Body', max: 140,
            hint: "What would help them arrive ready?",
            must: [
              { need: 'Include the time: 9:30 a.m.', any: ['9:30'] },
              { need: 'Name the clinic: Oak Park', any: ['oak park'] },
              { need: 'Ask them to arrive early', any: ['arrive', 'come', 'get there'] },
              { need: 'Remind them to bring their insurance card', any: ['insurance', 'card'] }
            ] },
          { id: 'action', slot: 'cta', kind: 'cta', label: 'Action', max: 18,
            hint: "What might they want to do right now?",
            must: [
              { need: 'Let them confirm or reschedule', any: ['confirm', "i'll be there", 'reschedule', 'change', 'move'] }
            ] },
        ],
      },
      {
        title: 'Cancel a visit',
        layout: 'dialog',
        goal: 'Confirm a cancellation without guilt, and make rebooking easy.',
        facts: ["Their slot goes to another patient", "They can book again anytime"],
        static: {},
        fields: [
          { id: 'title', slot: 'title', kind: 'title', label: 'Title', max: 45,
            hint: "Make sure they mean it.",
            must: [
              { need: 'Say cancel', any: ['cancel'] },
              { need: 'Say visit or appointment', any: ['visit', 'appointment'] }
            ] },
          { id: 'body', slot: 'body', kind: 'body', label: 'Body', max: 120,
            hint: "What happens next, and what's still possible?",
            must: [
              { need: 'Say they can book again', any: ['book', 'schedule', 'new time'] },
              { need: 'Say when: anytime', any: ['anytime', 'any time', 'later', 'again', 'when you are ready', "when you're ready"] }
            ],
            avoid: ['fee', 'penalty', 'no-show'] },
          { id: 'primary', slot: 'cta', kind: 'cta', label: 'Destructive button', max: 22,
            hint: "The choice they came to make.",
            must: [
              { need: 'Say cancel on the button', any: ['cancel'] }
            ] },
          { id: 'secondary', slot: 'secondary', kind: 'cta', label: 'Safe button', max: 22,
            hint: "The way back.",
            must: [
              { need: 'Let them keep the visit', any: ['keep', 'go back', 'never mind', 'stay'] }
            ] },
        ],
      },
    ],
  },
  {
    id: 'D',
    playable: true,
    company: 'Voltway',
    genre: 'EV charging app',
    stars: 4,
    teaser: 'Drivers are tired, parked and in a hurry. Every line has three seconds.',
    brand: { color: '#6b4dff', ink: '#160f3a', surface: '#f4f2ff', mark: 'V' },
    business:
      'Voltway operates 2,300 fast chargers along US highways and earns per kilowatt-hour, plus a $9.99 monthly membership. Drivers use the app parked, tired and in a hurry.',
    project:
      'We are rebuilding the charging flow because failed payments are leaving drivers stranded and angry online. Every line has to read in under three seconds.',
    tone: { label: 'Confident, quick, precise', exclamations: 1, serious: false },
    avoid: ['transaction declined', 'utilize', 'leverage', 'oops', 'seamless', 'unfortunately', 'kindly'],
    stakeholders: [
      {
        name: 'Jordan Reyes',
        role: 'Growth PM',
        wants: 'The membership pitch has to land right when they see what they paid.',
        cares: 'action',
      },
      {
        name: 'Nadia Ibrahim',
        role: 'Payments Lead',
        wants: 'Always say whether the card was charged. Ambiguity creates chargebacks.',
        cares: 'message',
      },
      {
        name: 'Chris Albright',
        role: 'Brand Director',
        wants: 'Short and sure of itself. Glanceable beats clever.',
        cares: 'fit',
      },
    ],
    rounds: [
      {
        title: 'Station card',
        layout: 'card',
        goal: 'Show a station on the map. Get them to start charging fast.',
        facts: ["4 of 6 chargers are open", "$0.48 per kWh", "Up to 250 kW", "0.4 miles away"],
        static: { product: 'Voltway — Exit 42, Kettleman City', price: '0.4 mi' },
        fields: [
          { id: 'badge', slot: 'label', kind: 'label', label: 'Availability', max: 24,
            hint: "Can they charge here right now?",
            must: [
              { need: 'Say how many are open: 4', any: ['4'] },
              { need: 'Say out of how many: 6', any: ['6', 'open', 'free', 'available'] }
            ] },
          { id: 'body', slot: 'body', kind: 'body', label: 'Price + speed', max: 80,
            hint: "What does a driver weigh before pulling in?",
            must: [
              { need: 'Include the price: $0.48', any: ['0.48', '48'] },
              { need: 'Say per kWh', any: ['kwh'] },
              { need: 'Mention the speed: 250 kW', any: ['250', 'fast'] }
            ] },
          { id: 'cta', slot: 'cta', kind: 'cta', label: 'Button', max: 18,
            hint: "Get them moving.",
            must: [
              { need: 'Name the action: start or navigate', any: ['start', 'charge', 'navigate', 'go', 'directions', 'drive'] }
            ] },
        ],
      },
      {
        title: 'Payment failed',
        layout: 'dialog',
        goal: 'The card was declined. Nothing was charged. Get them charging anyway.',
        facts: ["The bank declined the card", "Nothing was charged", "Another card will work"],
        static: {},
        fields: [
          { id: 'title', slot: 'title', kind: 'title', label: 'Title', max: 36,
            hint: "Name the problem without blame.",
            must: [
              { need: 'Name the card or payment', any: ['card', 'payment'] }
            ],
            avoid: ['error', 'failed'] },
          { id: 'body', slot: 'body', kind: 'body', label: 'Body', max: 130,
            hint: "What's the damage, and what's the fix?",
            must: [
              { need: 'Say they were not charged', any: ["weren't charged", 'not charged', 'no charge', "haven't charged", "didn't charge", 'nothing was charged', 'not been charged'] },
              { need: 'Tell them to use another card', any: ['another', 'different', 'update', 'new card', 'other'] }
            ] },
          { id: 'primary', slot: 'cta', kind: 'cta', label: 'Primary button', max: 20,
            hint: "The fastest fix.",
            must: [
              { need: 'Name the fix: use or update a card', any: ['use', 'add', 'update', 'change', 'pick', 'choose'] }
            ] },
          { id: 'secondary', slot: 'secondary', kind: 'cta', label: 'Secondary button', max: 22,
            hint: "For when the fix doesn't work.",
            must: [
              { need: 'Offer help or support', any: ['help', 'support', 'call', 'contact', 'chat'] }
            ] },
        ],
      },
      {
        title: 'Session complete',
        layout: 'summary',
        goal: 'Charging is done. Recap the cost and pitch the membership.',
        facts: ["52 kWh in 28 minutes, total $24.96", "Charged to the card ending 4021; receipt emailed", "Members pay less per kWh ($9.99 a month)"],
        static: { stats: [['Energy', '52 kWh'], ['Time', '28 min'], ['Total', '$24.96']] },
        fields: [
          { id: 'headline', slot: 'headline', kind: 'headline', label: 'Headline', max: 36,
            hint: "How does the driver feel right now?",
            must: [
              { need: 'Say charging is done', any: ['done', 'charged', 'ready', 'complete', 'full', 'good to go', 'all set'] }
            ] },
          { id: 'body', slot: 'body', kind: 'body', label: 'Receipt line', max: 110,
            hint: "Close the loop on the money.",
            must: [
              { need: 'Include the total: $24.96', any: ['24.96'] },
              { need: 'Name the card: ending 4021', any: ['4021', 'card'] },
              { need: 'Point to the emailed receipt', any: ['receipt', 'email'] }
            ] },
          { id: 'upsell', slot: 'upsell', kind: 'body', label: 'Membership pitch', max: 90,
            hint: "Why would they care about membership today?",
            must: [
              { need: 'Mention membership', any: ['member', 'membership'] },
              { need: 'Say members pay less', any: ['save', 'less', 'off', 'cheaper'] },
              { need: 'Make it concrete: today\'s price or savings', any: ['$', 'today', 'this charge', 'per kwh'] }
            ] },
          { id: 'cta', slot: 'cta', kind: 'cta', label: 'Button', max: 22,
            hint: "Make the next step easy.",
            must: [
              { need: 'Name the action: join or try', any: ['join', 'try', 'start', 'get', 'save'] }
            ] },
        ],
      },
    ],
  },
  {
    id: 'E',
    playable: true,
    company: 'Harbor Bank',
    genre: 'Banking fraud alerts',
    stars: 4,
    teaser: 'Fraud alerts members trust and act on in seconds. Calm beats scary.',
    brand: { color: '#0f6e8c', ink: '#08222c', surface: '#eef6f8', mark: 'HB' },
    business:
      'Harbor Bank is a 90-year-old community bank with 60 branches along the Gulf Coast and a growing mobile app. Most members are over 50 and wary of scams.',
    project:
      'We are redesigning fraud alerts so members can confirm or block a suspicious charge in seconds. Every alert must be trusted, not ignored.',
    tone: { label: 'Calm, direct, trustworthy', exclamations: 0, serious: true },
    avoid: ['oops', 'unfortunately', 'kindly', 'valued customer', 'utilize', 'leverage', 'click here', 'act now'],
    stakeholders: [
      {
        name: 'Denise Fairbanks',
        role: 'Head of Fraud Operations',
        wants: 'Every alert needs the amount, the merchant and the last four digits. No exceptions.',
        cares: 'message',
      },
      {
        name: 'Omar Haddad',
        role: 'Member Experience Lead',
        wants: 'Fraud is scary. Our words should not be. Keep it calm and kind.',
        cares: 'voice',
      },
      {
        name: 'Ruth Kimura',
        role: 'Security Lead',
        wants: 'Plain words only. If members have to reread a fraud alert, they ignore it.',
        cares: 'clarity',
      },
    ],
    rounds: [
      {
        title: 'Fraud alert',
        layout: 'notification',
        goal: 'A charge on their card looks unusual. Ask the member if it was them.',
        facts: ["$482.19 at ElectroMart", "Card ending 7731"],
        static: { app: 'Harbor Bank' },
        fields: [
          { id: 'title', slot: 'title', kind: 'title', label: 'Title', max: 40,
            hint: "What do you need from them?",
            must: [
              { need: 'Ask if the charge was theirs', any: ['was this you', 'did you', 'yours', 'you make', 'you made', 'recognize'] },
            ] },
          { id: 'body', slot: 'body', kind: 'body', label: 'Body', max: 120,
            hint: "What would they need to recognize it?",
            must: [
              { need: 'Include the amount: $482.19', any: ['482.19'] },
              { need: 'Name the merchant: ElectroMart', any: ['electromart'] },
              { need: 'Name the card: ending 7731', any: ['7731'] },
            ],
            avoid: ['pin', 'password', 'social security'] },
          { id: 'action', slot: 'cta', kind: 'cta', label: 'Action', max: 18,
            hint: "Where does tapping take them?",
            must: [
              { need: 'Let them review the charge', any: ['review', 'check', 'see', 'view'] },
            ] },
        ],
      },
      {
        title: 'Card locked',
        layout: 'dialog',
        goal: 'They said it was not them. The card is now locked. Tell them they are safe and what happens next.',
        facts: ["The card is now locked", "They won't pay for the $482.19 charge", "A new card arrives in 5–7 days"],
        static: {},
        fields: [
          { id: 'title', slot: 'title', kind: 'title', label: 'Title', max: 36,
            hint: "What just happened to their card?",
            must: [
              { need: 'Say the card is locked', any: ['locked', 'frozen', 'blocked', 'paused'] },
            ],
            avoid: ['error', 'failed'] },
          { id: 'body', slot: 'body', kind: 'body', label: 'Body', max: 150,
            hint: "Calm them down. What's settled, and what's next?",
            must: [
              { need: 'Say they will not pay for the charge', any: ["won't pay", 'will not pay', 'not responsible', "won't be charged", 'refund', 'not charged', 'covered', "don't owe", 'do not owe'] },
              { need: 'Say a new card is coming', any: ['new card', 'replacement'] },
              { need: 'Give the timing: 5 to 7 days', any: ['5', '7', 'days', 'week'] },
            ],
            avoid: ['pin', 'password', 'unfortunately'] },
          { id: 'primary', slot: 'cta', kind: 'cta', label: 'Primary button', max: 22,
            hint: "What will they want to keep an eye on?",
            must: [
              { need: 'Let them track the new card', any: ['track', 'see', 'view', 'check'] },
            ] },
          { id: 'secondary', slot: 'secondary', kind: 'cta', label: 'Secondary button', max: 22,
            hint: "For when they'd rather talk it through.",
            must: [
              { need: 'Offer a person to talk to', any: ['call', 'talk', 'chat', 'help', 'contact', 'support'] },
            ] },
        ],
      },
      {
        title: 'Verify a new phone',
        layout: 'form',
        goal: 'A member is signing in on a new phone. Send a one-time code, and warn them never to share it.',
        facts: ["A 6-digit code will be sent", "Harbor Bank never asks for this code", "The code must never be shared"],
        static: { step: 'Verify it’s you', banks: ['Text (•••) •••-0142', 'Email r•••@mail.com', 'Call me instead'] },
        fields: [
          { id: 'headline', slot: 'headline', kind: 'headline', label: 'Headline', max: 36,
            hint: "What are you checking?",
            must: [
              { need: 'Ask them to verify or confirm', any: ['verify', 'confirm', "it's you", 'it is you', 'check'] },
            ] },
          { id: 'body', slot: 'body', kind: 'body', label: 'Body', max: 140,
            hint: "Explain the code, and protect them from scammers.",
            must: [
              { need: 'Mention the code', any: ['code'] },
              { need: 'Say the bank never asks for it', any: ['never ask', 'never call', 'will never', 'we never', "won't ask"] },
              { need: 'Tell them not to share it', any: ["don't share", 'do not share', 'never share', 'keep it', 'only you', 'not share'] },
            ] },
          { id: 'cta', slot: 'cta', kind: 'cta', label: 'Button', max: 20,
            hint: "Get the code moving.",
            must: [
              { need: 'Name the action: send the code', any: ['send', 'get', 'text'] },
            ] },
        ],
      },
    ],
  },
  {
    id: 'F',
    playable: true,
    company: 'Quill',
    genre: 'AI writing assistant',
    stars: 4,
    teaser: 'Onboard AI skeptics with honesty, not hype.',
    brand: { color: '#a8457f', ink: '#2a0f22', surface: '#fbf2f7', mark: 'Q' },
    business:
      'Quill is an AI writing assistant used by 40,000 teams to draft emails, docs and support replies. Most new users arrive skeptical after tools that overpromised.',
    project:
      'We are rebuilding onboarding so skeptics see one real, useful result in their first two minutes. No hype, no magic words.',
    tone: { label: 'Friendly, honest, no hype', exclamations: 1, serious: false },
    avoid: ['revolutionary', 'magic', 'game-changing', 'game changer', 'supercharge', 'unleash', '10x', 'effortless', 'cutting-edge', 'seamless'],
    stakeholders: [
      {
        name: 'Leo Brandt',
        role: 'Head of Growth',
        wants: 'Get them to a first draft fast. Every extra click loses people.',
        cares: 'action',
      },
      {
        name: 'Ama Owusu',
        role: 'Trust & AI Ethics Lead',
        wants: 'Be honest about what the AI cannot do, and that people stay in control.',
        cares: 'message',
      },
      {
        name: 'Jun Park',
        role: 'Brand Writer',
        wants: 'No hype words. If it sounds like a launch tweet, rewrite it.',
        cares: 'voice',
      },
    ],
    rounds: [
      {
        title: 'Welcome',
        layout: 'hero',
        goal: 'Greet a skeptical new user and get them to try one real draft.',
        facts: ["Quill drafts emails, docs and replies", "People edit and decide what goes out"],
        static: { nav: ['Product', 'Pricing', 'Sign in'] },
        fields: [
          { id: 'headline', slot: 'headline', kind: 'headline', label: 'Headline', max: 44,
            hint: "What is Quill, in plain words?",
            must: [
              { need: 'Say what it does: drafts writing', any: ['draft', 'write', 'writing', 'first version'] },
            ] },
          { id: 'sub', slot: 'body', kind: 'body', label: 'Subhead', max: 110,
            hint: "Win over a skeptic.",
            must: [
              { need: 'Say they stay in control', any: ['you edit', 'you decide', 'you choose', "you're in charge", 'you stay', 'in control', 'your call', 'you approve'] },
              { need: 'Name a real use: emails, docs or replies', any: ['email', 'doc', 'repl', 'message', 'report'] },
            ] },
          { id: 'cta', slot: 'cta', kind: 'cta', label: 'Button', max: 22,
            hint: "What should their first move be?",
            must: [
              { need: 'Name the action: try or start a draft', any: ['draft', 'try', 'start', 'write'] },
            ] },
        ],
      },
      {
        title: 'Honest heads-up',
        layout: 'dialog',
        goal: 'Before the first draft, set honest expectations: Quill can get facts wrong.',
        facts: ["Quill can get facts wrong", "Names, numbers and dates need checking before sending"],
        static: {},
        fields: [
          { id: 'title', slot: 'title', kind: 'title', label: 'Title', max: 40,
            hint: "Signal that something's worth knowing.",
            must: [
              { need: 'Signal this is a quick note', any: ['before', 'heads-up', 'heads up', 'quick note', 'good to know', 'note', 'know'] },
            ] },
          { id: 'body', slot: 'body', kind: 'body', label: 'Body', max: 150,
            hint: "Be honest about the limits.",
            must: [
              { need: 'Admit it can get things wrong', any: ['wrong', 'mistake', 'error', 'not always right', 'incorrect', 'make things up'] },
              { need: 'Tell them to check facts before sending', any: ['check', 'review', 'double-check', 'verify'] },
            ],
            avoid: ['always accurate', '100%', 'perfect', 'never wrong', 'guarantee'] },
          { id: 'primary', slot: 'cta', kind: 'cta', label: 'Primary button', max: 18,
            hint: "Let them get going.",
            must: [
              { need: 'Let them move on to writing', any: ['got it', 'start', 'write', 'draft', 'understood', 'sounds good'] },
            ] },
          { id: 'secondary', slot: 'secondary', kind: 'cta', label: 'Secondary button', max: 24,
            hint: "For the curious.",
            must: [
              { need: 'Offer details on how it works', any: ['how', 'data', 'privacy', 'works'] },
            ] },
        ],
      },
      {
        title: 'Free drafts used up',
        layout: 'summary',
        goal: 'They have hit the free limit. Recap where they stand and invite them to upgrade.',
        facts: ["All 20 free drafts are used", "Free drafts reset March 1", "Saved drafts are kept", "Pro: $12 a month, unlimited drafts"],
        static: { stats: [['Drafts', '20 of 20'], ['Time saved', '~3 hrs'], ['Resets', 'Mar 1']] },
        fields: [
          { id: 'headline', slot: 'headline', kind: 'headline', label: 'Headline', max: 36,
            hint: "Where do they stand?",
            must: [
              { need: 'Say they used all the free drafts', any: ['used', 'all 20', 'reached', 'out of', 'no drafts left', 'limit'] },
            ] },
          { id: 'body', slot: 'body', kind: 'body', label: 'Body', max: 110,
            hint: "What happens now if they don't pay?",
            must: [
              { need: 'Say when it resets: March 1', any: ['march 1', 'mar 1', 'march first'] },
              { need: 'Reassure them saved drafts are kept', any: ['saved', 'keep', 'still have', 'safe', 'stay'] },
            ] },
          { id: 'upsell', slot: 'upsell', kind: 'body', label: 'Upgrade pitch', max: 90,
            hint: "Make the case for Pro, without pressure.",
            must: [
              { need: 'Name the plan: Pro', any: ['pro'] },
              { need: 'Give the price: $12', any: ['12'] },
              { need: 'Say what they get: unlimited drafts', any: ['unlimited', 'no limit'] },
            ] },
          { id: 'cta', slot: 'cta', kind: 'cta', label: 'Button', max: 22,
            hint: "The upgrade path.",
            must: [
              { need: 'Name the action: upgrade', any: ['upgrade', 'get pro', 'go pro', 'try pro', 'start'] },
            ] },
        ],
      },
    ],
  },
  {
    id: 'G',
    playable: true,
    company: 'Trailhead Outdoors',
    genre: 'Outdoor gear e-commerce',
    stars: 5,
    teaser: 'Strict return rules. Say no kindly, and always offer a way forward.',
    brand: { color: '#3f7d3a', ink: '#13250f', surface: '#f3f6ec', mark: 'TO' },
    business:
      'Trailhead Outdoors sells hiking and camping gear online and from 12 stores in the Mountain West. Its return rules are strict: 30 days, unused, tags on.',
    project:
      'We are rewriting the returns flow because strict rules are costing loyal customers. Say no kindly, and always offer a next step.',
    tone: { label: 'Outdoorsy, friendly, straight-talking', exclamations: 1, serious: false },
    avoid: ['unfortunately', 'policy prohibits', 'per our policy', 'non-negotiable', 'utilize', 'kindly', 'valued customer'],
    stakeholders: [
      {
        name: 'Hank Morrow',
        role: 'Founder',
        wants: 'Sound like a guide at the trailhead, not a lawyer.',
        cares: 'voice',
      },
      {
        name: 'Carmen Ruiz',
        role: 'Customer Care Manager',
        wants: 'Every no needs a next step: exchange, repair or store credit.',
        cares: 'message',
      },
      {
        name: 'Theo Lindqvist',
        role: 'E-commerce Product Manager',
        wants: 'Mobile first. If it wraps to five lines, it is too long.',
        cares: 'fit',
      },
    ],
    rounds: [
      {
        title: 'Start a return',
        layout: 'form',
        goal: 'Explain the return rules up front and help them pick an item.',
        facts: ["Returns accepted within 30 days", "Gear must be unused, with tags on", "Returns are free"],
        static: { step: 'Returns', banks: ['Trail Runner 2 shoes · $139', 'Summit 30L pack · $189', 'Camp mug · $18'] },
        fields: [
          { id: 'headline', slot: 'headline', kind: 'headline', label: 'Headline', max: 36,
            hint: "What are they here to do?",
            must: [
              { need: 'Say return', any: ['return'] },
            ] },
          { id: 'body', slot: 'body', kind: 'body', label: 'Body', max: 140,
            hint: "Set expectations before they start.",
            must: [
              { need: 'Give the window: 30 days', any: ['30'] },
              { need: 'Say it must be unused', any: ['unused', "haven't used", 'not used', 'new condition', 'unworn'] },
              { need: 'Mention the tags', any: ['tag'] },
            ],
            avoid: ['policy prohibits', 'non-negotiable'] },
          { id: 'cta', slot: 'cta', kind: 'cta', label: 'Button', max: 22,
            hint: "Get them going.",
            must: [
              { need: 'Name the action: pick an item', any: ['choose', 'pick', 'select', 'start', 'return'] },
            ] },
        ],
      },
      {
        title: 'Past the return window',
        layout: 'dialog',
        goal: 'Their tent is past the return window. Say no kindly and offer a way forward.',
        facts: ["Bought 41 days ago; the window is 30 days", "A free repair is available", "Store credit is available"],
        static: {},
        fields: [
          { id: 'title', slot: 'title', kind: 'title', label: 'Title', max: 40,
            hint: "Break the news.",
            must: [
              { need: 'Say it cannot be returned', any: ["can't be returned", 'cannot be returned', "can't return", 'past the', 'too late', 'window', 'not returnable'] },
            ],
            avoid: ['denied', 'rejected', 'error'] },
          { id: 'body', slot: 'body', kind: 'body', label: 'Body', max: 150,
            hint: "Explain, then offer a way forward.",
            must: [
              { need: 'Explain why: past 30 days', any: ['30', 'past', 'days'] },
              { need: 'Offer a free repair', any: ['repair', 'fix'] },
              { need: 'Offer store credit', any: ['credit'] },
            ],
            avoid: ['unfortunately', 'policy'] },
          { id: 'primary', slot: 'cta', kind: 'cta', label: 'Primary button', max: 20,
            hint: "One way forward.",
            must: [
              { need: 'Name the action: repair', any: ['repair', 'fix', 'send'] },
            ] },
          { id: 'secondary', slot: 'secondary', kind: 'cta', label: 'Secondary button', max: 22,
            hint: "The other way forward.",
            must: [
              { need: 'Offer store credit', any: ['credit'] },
            ] },
        ],
      },
      {
        title: 'Return approved',
        layout: 'confirm',
        goal: 'Their return is approved. Explain how to send it back and when the refund lands.',
        facts: ["A prepaid return label is ready", "Drop off at any UPS store", "Ship by April 12", "Refund lands 3–5 days after it arrives"],
        static: { rows: [['Item', 'Summit 30L pack'], ['Drop-off', 'Any UPS store'], ['Ship by', 'April 12']] },
        fields: [
          { id: 'headline', slot: 'headline', kind: 'headline', label: 'Headline', max: 36,
            hint: "Good news. Say it.",
            must: [
              { need: 'Say the return is approved', any: ['approved', 'all set', 'good to go', 'ready', 'accepted', 'on its way'] },
            ] },
          { id: 'body', slot: 'body', kind: 'body', label: 'Details', max: 140,
            hint: "What do they need to do, and when does the money come back?",
            must: [
              { need: 'Say where: any UPS store', any: ['ups'] },
              { need: 'Give the deadline: April 12', any: ['april 12', 'apr 12'] },
              { need: 'Say when the refund lands', any: ['refund'] },
            ] },
          { id: 'cta', slot: 'cta', kind: 'cta', label: 'Button', max: 22,
            hint: "What will they need in hand?",
            must: [
              { need: 'Name the action: get the label', any: ['label', 'show', 'print', 'get', 'view'] },
            ] },
        ],
      },
    ],
  },
  {
    id: 'H',
    playable: true,
    company: 'Orbit Air',
    genre: 'Airline disruptions',
    stars: 5,
    teaser: 'Cancelled flight, 300 tired passengers, one push notification.',
    brand: { color: '#d64545', ink: '#2b0d0d', surface: '#fdf3f1', mark: 'OA' },
    business:
      'Orbit Air is a low-cost airline flying 180 routes across North America from busy hub airports. When a flight breaks, 300 tired passengers read the same alert at once.',
    project:
      'We are rewriting disruption messages because vague alerts send everyone to one overwhelmed gate agent. Say what happened, what we are doing, and what they can do now.',
    tone: { label: 'Honest, human, fast', exclamations: 0, serious: true },
    avoid: ['unfortunately', 'inconvenience', 'operational reasons', 'valued customer', 'oops', 'kindly', 'regret to inform'],
    stakeholders: [
      {
        name: 'Grace Achebe',
        role: 'VP of Operations',
        wants: 'Every alert needs the flight, the new time and the gate. People are standing in an airport.',
        cares: 'message',
      },
      {
        name: 'Sami Rahman',
        role: 'Customer Advocate',
        wants: 'Own it. Say sorry once, plainly, and skip the corporate excuses.',
        cares: 'voice',
      },
      {
        name: 'Ivy Chen',
        role: 'Mobile Product Lead',
        wants: 'Give them a button that solves it: rebook, take a credit, see options.',
        cares: 'action',
      },
    ],
    rounds: [
      {
        title: 'Delay alert',
        layout: 'notification',
        goal: 'Their flight is running late. Tell them what changed.',
        facts: ["Flight OA 214 to Denver", "Delayed 2 hours", "New departure: 6:40 p.m.", "Gate C9"],
        static: { app: 'Orbit Air' },
        fields: [
          { id: 'title', slot: 'title', kind: 'title', label: 'Title', max: 40,
            hint: "What happened, at a glance?",
            must: [
              { need: 'Name the flight: OA 214', any: ['214'] },
              { need: 'Say it is delayed', any: ['delay', 'late', 'later'] },
            ] },
          { id: 'body', slot: 'body', kind: 'body', label: 'Body', max: 140,
            hint: "What do they need to know, standing in the terminal?",
            must: [
              { need: 'Give the new time: 6:40 p.m.', any: ['6:40'] },
              { need: 'Give the gate: C9', any: ['c9'] },
              { need: 'Apologize once, plainly', any: ['sorry', 'apolog'] },
            ] },
          { id: 'action', slot: 'cta', kind: 'cta', label: 'Action', max: 18,
            hint: "What can they do about it?",
            must: [
              { need: 'Let them see their options', any: ['see', 'view', 'option', 'rebook', 'change'] },
            ] },
        ],
      },
      {
        title: 'Flight cancelled',
        layout: 'dialog',
        goal: 'Their flight is cancelled, and you already have a plan for them.',
        facts: ["OA 377 is cancelled", "Rebooked on tomorrow's 8:05 a.m. flight", "$200 credit added", "Hotel vouchers at the desk"],
        static: {},
        fields: [
          { id: 'title', slot: 'title', kind: 'title', label: 'Title', max: 40,
            hint: "Deliver the bad news, straight.",
            must: [
              { need: 'Say it is cancelled', any: ['cancel'] },
              { need: 'Name the flight: OA 377', any: ['377'] },
            ] },
          { id: 'body', slot: 'body', kind: 'body', label: 'Body', max: 160,
            hint: "What have you already done for them?",
            must: [
              { need: 'Say they are rebooked', any: ['rebook', 'moved you', 'new flight', 'booked you', 'seat on'] },
              { need: 'Give the new time: 8:05 a.m.', any: ['8:05'] },
              { need: 'Mention the $200 credit', any: ['200'] },
            ] },
          { id: 'primary', slot: 'cta', kind: 'cta', label: 'Primary button', max: 22,
            hint: "If the plan works for them.",
            must: [
              { need: 'Let them keep the new flight', any: ['keep', 'confirm', 'accept', 'sounds good'] },
            ] },
          { id: 'secondary', slot: 'secondary', kind: 'cta', label: 'Secondary button', max: 24,
            hint: "If it doesn't.",
            must: [
              { need: 'Offer other flights', any: ['other', 'see', 'change', 'different', 'option'] },
            ] },
        ],
      },
      {
        title: 'Choose compensation',
        layout: 'summary',
        goal: 'Offer something for the trouble, and let them choose.',
        facts: ["$200 travel credit, or $150 back to their card", "The credit never expires", "The credit works on any route"],
        static: { stats: [['Flight', 'OA 377'], ['Delay', '14 hrs'], ['Credit', '$200']] },
        fields: [
          { id: 'headline', slot: 'headline', kind: 'headline', label: 'Headline', max: 36,
            hint: "Acknowledge what they went through.",
            must: [
              { need: 'Say this is for the trouble', any: ['for the trouble', 'owe you', 'make it up', 'compensation', 'credit', 'refund', 'yours'] },
            ] },
          { id: 'body', slot: 'body', kind: 'body', label: 'Body', max: 120,
            hint: "Lay out the choice.",
            must: [
              { need: 'Offer the $200 credit', any: ['200'] },
              { need: 'Offer the $150 refund', any: ['150'] },
            ] },
          { id: 'upsell', slot: 'upsell', kind: 'body', label: 'Credit details', max: 90,
            hint: "Make the credit worth considering.",
            must: [
              { need: 'Say the credit never expires', any: ['never expire', "doesn't expire", 'no expir', "won't expire", 'does not expire'] },
              { need: 'Say it works on any route', any: ['any route', 'any flight', 'anywhere', 'any trip'] },
            ] },
          { id: 'cta', slot: 'cta', kind: 'cta', label: 'Button', max: 22,
            hint: "Help them decide.",
            must: [
              { need: 'Name the action: take the credit', any: ['take', 'get', 'claim', 'choose', 'use'] },
            ] },
        ],
      },
    ],
  },
];

export function levelSummary(l) {
  return {
    id: l.id, playable: l.playable, company: l.company, genre: l.genre,
    stars: l.stars, teaser: l.teaser, brand: l.brand ?? null,
  };
}

export function getLevel(id) {
  return levels.find((l) => l.id === String(id).toUpperCase());
}
