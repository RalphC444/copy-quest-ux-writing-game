// Level content. Each playable level = one company, three rounds (screens).
// Field rules drive the heuristic grader:
//   kind:  headline | body | cta | label | title
//   slot:  where the copy renders in the screen mockup
//   max:   character limit
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
        lines: {
          happy: 'That sounds like my grandmother wrote it. In a good way.',
          meh: 'Close. It still sounds a bit like a chain store.',
          mad: 'Who wrote this, a vending machine?',
        },
      },
      {
        name: 'Marcus Lee',
        role: 'Operations Manager',
        wants: 'People must know pickup ends at 11 a.m. or I get angry calls all afternoon.',
        cares: 'message',
        lines: {
          happy: 'Pickup times are clear. My phone will finally stop ringing.',
          meh: 'It does not quite say when or where to pick up.',
          mad: 'Nobody will know when to come in. Expect a line out the door.',
        },
      },
      {
        name: 'Priya Shah',
        role: 'Marketing Lead',
        look: { mustache: false },
        wants: 'I need people to actually tap the button. Make the next step obvious.',
        cares: 'action',
        lines: {
          happy: 'Those buttons practically press themselves.',
          meh: 'The buttons work, but they do not pull me in.',
          mad: 'I would not know what to tap. Neither will anyone else.',
        },
      },
    ],
    rounds: [
      {
        title: 'Home hero',
        layout: 'hero',
        goal: 'Invite regulars to preorder tomorrow\'s bread tonight.',
        static: { nav: ['Menu', 'Shops', 'Preorder'] },
        fields: [
          { id: 'headline', slot: 'headline', kind: 'headline', label: 'Headline', max: 40,
            hint: 'Invite people to reserve tomorrow\'s loaf.',
            must: [
              { need: 'Invite them to reserve or preorder', any: ['preorder', 'reserve', 'save', 'order ahead', 'hold', 'claim', 'set aside'] },
              { need: 'Mention the bread', any: ['loaf', 'bread', 'sourdough', 'bake', 'tomorrow'] }
            ] },
          { id: 'sub', slot: 'body', kind: 'body', label: 'Subhead', max: 100,
            hint: 'Explain the deal: order tonight, pick up before 11 a.m.',
            must: [
              { need: 'Say when to order: tonight', any: ['tonight', 'night before', 'evening', 'today'] },
              { need: 'Say pickup ends at 11 a.m.', any: ['11', 'eleven'] },
              { need: 'Mention picking up', any: ['pick up', 'pickup', 'grab', 'collect'] }
            ] },
          { id: 'cta', slot: 'cta', kind: 'cta', label: 'Button', max: 22,
            hint: 'Start the preorder.',
            must: [
              { need: 'Name the preorder action', any: ['preorder', 'reserve', 'order', 'save', 'claim', 'hold', 'pick'] }
            ] },
        ],
      },
      {
        title: 'Sold-out product card',
        layout: 'card',
        goal: 'Tomorrow\'s Country Sourdough is gone. Keep the customer around.',
        static: { product: 'Country Sourdough', price: '$9' },
        fields: [
          { id: 'badge', slot: 'label', kind: 'label', label: 'Status badge', max: 24,
            hint: 'Say it is sold out for tomorrow.',
            must: [
              { need: 'Say it is sold out', any: ['sold out', 'all gone', 'gone', 'none left', 'out for'] }
            ] },
          { id: 'body', slot: 'body', kind: 'body', label: 'Helper text', max: 90,
            hint: 'Offer the next option: Friday\'s batch, or the seeded rye.',
            must: [
              { need: 'Point to Friday\'s batch', any: ['friday', 'next batch', 'next bake', 'later this week'] },
              { need: 'Offer the seeded rye instead', any: ['rye', 'instead', 'try'] }
            ] },
          { id: 'cta', slot: 'cta', kind: 'cta', label: 'Button', max: 20,
            hint: 'Get a heads-up when it is back.',
            must: [
              { need: 'Offer a back-in-stock alert', any: ['notify', 'remind', 'alert', 'tell me', 'text me', 'email me', 'let me know'] }
            ] },
        ],
      },
      {
        title: 'Order confirmation',
        layout: 'confirm',
        goal: 'The loaf is reserved. Confirm it and tell them exactly where and when.',
        static: { order: '1 × Country Sourdough', shop: 'Elm Street', window: 'Sat 7–11 a.m.' },
        fields: [
          { id: 'headline', slot: 'headline', kind: 'headline', label: 'Headline', max: 36,
            hint: 'Celebrate: their bread is held.',
            must: [
              { need: 'Confirm the loaf is reserved', any: ['reserved', 'saved', 'set', 'held', 'yours', 'confirmed', 'got it', 'ready'] }
            ] },
          { id: 'body', slot: 'body', kind: 'body', label: 'Details', max: 130,
            hint: 'Pick up at Elm Street, Saturday 7–11 a.m.',
            must: [
              { need: 'Name the shop: Elm Street', any: ['elm'] },
              { need: 'Name the day: Saturday', any: ['saturday', 'sat'] },
              { need: 'Say pickup ends at 11 a.m.', any: ['11', 'eleven'] },
              { need: 'Mention picking up', any: ['pick up', 'pickup', 'grab', 'collect', 'swing by', 'come by'] }
            ] },
          { id: 'cta', slot: 'cta', kind: 'cta', label: 'Button', max: 22,
            hint: 'Help them remember or find the shop.',
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
        lines: {
          happy: 'Clean next steps everywhere. Ship it.',
          meh: 'A couple of buttons make me think too hard.',
          mad: 'This will lose more people than the old flow.',
        },
      },
      {
        name: 'Sam Whitfield',
        role: 'Security & Compliance',
        wants: 'Explain read-only access honestly. Never promise "100% secure."',
        cares: 'message',
        lines: {
          happy: 'Accurate, honest, no overpromising. Legal will be bored. Perfect.',
          meh: 'Mostly right, but some details about access are missing.',
          mad: 'This makes claims we cannot back up. Hard no.',
        },
      },
      {
        name: 'Lena Park',
        role: 'Support Lead',
        wants: 'If an error does not say how to fix it, it becomes my ticket.',
        cares: 'clarity',
        lines: {
          happy: 'My team could paste this into a help article as is.',
          meh: 'Readable, but a few lines are dense.',
          mad: 'This will triple our ticket queue.',
        },
      },
    ],
    rounds: [
      {
        title: 'Connect your bank',
        layout: 'form',
        goal: 'Get the owner to connect their bank and explain why it is safe.',
        static: { step: 'Step 2 of 3', banks: ['Chase', 'Wells Fargo', 'Bank of America', 'Other'] },
        fields: [
          { id: 'headline', slot: 'headline', kind: 'headline', label: 'Headline', max: 45,
            hint: 'Ask them to connect their business bank.',
            must: [
              { need: 'Ask them to connect', any: ['connect', 'link', 'add'] },
              { need: 'Mention the bank account', any: ['bank', 'account'] }
            ] },
          { id: 'body', slot: 'body', kind: 'body', label: 'Body', max: 150,
            hint: 'Why it helps, and that Ledgerly can only view, never move, money.',
            must: [
              { need: 'Say Ledgerly can only view money, never move it', any: ['read-only', 'view-only', 'only see', 'only view', 'only read', "can't move", 'cannot move', 'never move'] },
              { need: 'Say what it does for them: sorts transactions', any: ['transaction', 'expense', 'automatic', 'categoriz', 'books'] }
            ],
            avoid: ['100%', 'completely secure', 'totally secure', 'guarantee', 'unhackable'] },
          { id: 'cta', slot: 'cta', kind: 'cta', label: 'Button', max: 22,
            hint: 'Start the connection.',
            must: [
              { need: 'Name the connect action', any: ['connect', 'link', 'choose', 'find'] }
            ] },
        ],
      },
      {
        title: 'Connection failed',
        layout: 'dialog',
        goal: 'The bank rejected the sign-in. Tell them what happened and how to fix it.',
        static: {},
        fields: [
          { id: 'title', slot: 'title', kind: 'title', label: 'Title', max: 40,
            hint: 'Name the problem (the bank sign-in) without blame.',
            must: [
              { need: 'Name what went wrong: the bank sign-in', any: ['connect', 'sign in', 'log in', 'reach', 'bank'] }
            ],
            avoid: ['error', 'failed', 'invalid', 'denied'] },
          { id: 'body', slot: 'body', kind: 'body', label: 'Body', max: 150,
            hint: 'Your bank did not accept the sign-in. Check the password you use on the bank site.',
            must: [
              { need: 'Mention the bank', any: ['bank'] },
              { need: 'Point to the password or sign-in', any: ['password', 'sign-in', 'sign in', 'login', 'username'] },
              { need: 'Tell them how to fix it', any: ['try', 'check', 'again', 'reset'] }
            ],
            avoid: ['invalid credentials', 'error code', 'unknown error', 'something went wrong'] },
          { id: 'primary', slot: 'cta', kind: 'cta', label: 'Primary button', max: 20,
            hint: 'Retry.',
            must: [
              { need: 'Offer to try again', any: ['try', 'retry', 'again', 'sign in'] }
            ] },
          { id: 'secondary', slot: 'secondary', kind: 'cta', label: 'Secondary button', max: 26,
            hint: 'Offer a way around: add transactions manually.',
            must: [
              { need: 'Offer a way around, like adding manually', any: ['manual', 'upload', 'later', 'skip', 'import', 'another'] }
            ] },
        ],
      },
      {
        title: 'Empty dashboard',
        layout: 'empty',
        goal: 'Nothing is connected yet. Show what they will get and pull them back in.',
        static: { tabs: ['Overview', 'Expenses', 'Reports'] },
        fields: [
          { id: 'headline', slot: 'headline', kind: 'headline', label: 'Headline', max: 40,
            hint: 'Describe what will live here.',
            must: [
              { need: 'Name what will show here: cash and expenses', any: ['cash', 'money', 'expense', 'spend', 'income', 'books', 'transaction'] }
            ] },
          { id: 'body', slot: 'body', kind: 'body', label: 'Body', max: 120,
            hint: 'Once a bank is connected, expenses sort themselves.',
            must: [
              { need: 'Tell them to connect a bank', any: ['connect', 'link', 'add'] },
              { need: 'Say transactions sort themselves', any: ['automatic', 'sort', 'categoriz', 'organiz', 'appear', 'show up'] }
            ] },
          { id: 'cta', slot: 'cta', kind: 'cta', label: 'Button', max: 24,
            hint: 'Send them to connect.',
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
        lines: {
          happy: 'Calm and kind. This is how our nurses talk.',
          meh: 'Mostly calm, but a few lines feel brisk.',
          mad: 'This would worry patients. Please soften it.',
        },
      },
      {
        name: 'Greg Holloway',
        role: 'Legal & Compliance',
        wants: 'Emergency guidance must be present. No promises about care outcomes.',
        cares: 'message',
        lines: {
          happy: 'All the required details are there. I have no notes.',
          meh: 'A required detail is missing. Close, though.',
          mad: 'We cannot publish this. Key safety details are missing.',
        },
      },
      {
        name: 'Tess Romero',
        role: 'Accessibility Lead',
        wants: 'Short sentences. Plain words. Nothing in all caps.',
        cares: 'clarity',
        lines: {
          happy: 'Easy to read, easy to hear on a screen reader. Lovely.',
          meh: 'A few long sentences would trip people up.',
          mad: 'Too dense. Many patients will give up and call.',
        },
      },
    ],
    rounds: [
      {
        title: 'Book a visit',
        layout: 'form',
        goal: 'Help patients start booking, and point emergencies away from the portal.',
        static: { step: 'Book a visit', banks: ['Annual checkup', 'Sick visit', 'Follow-up', 'Something else'] },
        fields: [
          { id: 'headline', slot: 'headline', kind: 'headline', label: 'Headline', max: 40,
            hint: 'Invite them to book.',
            must: [
              { need: 'Invite them to book', any: ['book', 'schedule', 'make'] },
              { need: 'Say visit or appointment', any: ['visit', 'appointment'] }
            ] },
          { id: 'body', slot: 'body', kind: 'body', label: 'Helper text', max: 130,
            hint: 'Ask them to pick a visit type. For an emergency, call 911.',
            must: [
              { need: 'Include 911', any: ['911'] },
              { need: 'Mention emergencies', any: ['emergency', 'urgent', 'right away'] },
              { need: 'Tell them to pick a visit type', any: ['choose', 'pick', 'select', 'tell us'] }
            ],
            avoid: ['guarantee', 'cure'] },
          { id: 'cta', slot: 'cta', kind: 'cta', label: 'Button', max: 22,
            hint: 'Move to times.',
            must: [
              { need: 'Name the next step: see times', any: ['see', 'find', 'choose', 'pick', 'next', 'show', 'continue'] }
            ] },
        ],
      },
      {
        title: 'Visit reminder',
        layout: 'notification',
        goal: 'Remind them about tomorrow\'s visit and what to bring.',
        static: { app: 'Northwind Health', when: 'Tomorrow, 9:30 a.m.', where: 'Oak Park Clinic' },
        fields: [
          { id: 'title', slot: 'title', kind: 'title', label: 'Title', max: 40,
            hint: 'Your visit is tomorrow.',
            must: [
              { need: 'Say it is tomorrow', any: ['tomorrow'] },
              { need: 'Say visit or appointment', any: ['visit', 'appointment'] }
            ] },
          { id: 'body', slot: 'body', kind: 'body', label: 'Body', max: 140,
            hint: '9:30 a.m. at Oak Park. Arrive 10 minutes early. Bring your insurance card.',
            must: [
              { need: 'Include the time: 9:30 a.m.', any: ['9:30'] },
              { need: 'Name the clinic: Oak Park', any: ['oak park'] },
              { need: 'Ask them to arrive early', any: ['arrive', 'come', 'get there'] },
              { need: 'Remind them to bring their insurance card', any: ['insurance', 'card'] }
            ] },
          { id: 'action', slot: 'cta', kind: 'cta', label: 'Action', max: 18,
            hint: 'Confirm, or change the time.',
            must: [
              { need: 'Let them confirm or reschedule', any: ['confirm', "i'll be there", 'reschedule', 'change', 'move'] }
            ] },
        ],
      },
      {
        title: 'Cancel a visit',
        layout: 'dialog',
        goal: 'Confirm a cancellation without guilt, and make rebooking easy.',
        static: {},
        fields: [
          { id: 'title', slot: 'title', kind: 'title', label: 'Title', max: 45,
            hint: 'Ask if they want to cancel the visit.',
            must: [
              { need: 'Say cancel', any: ['cancel'] },
              { need: 'Say visit or appointment', any: ['visit', 'appointment'] }
            ] },
          { id: 'body', slot: 'body', kind: 'body', label: 'Body', max: 120,
            hint: 'Your time will go to another patient. You can book again anytime.',
            must: [
              { need: 'Say they can book again', any: ['book', 'schedule', 'new time'] },
              { need: 'Say when: anytime', any: ['anytime', 'any time', 'later', 'again', 'when you are ready', "when you're ready"] }
            ],
            avoid: ['fee', 'penalty', 'no-show'] },
          { id: 'primary', slot: 'cta', kind: 'cta', label: 'Destructive button', max: 22,
            hint: 'Confirm the cancel.',
            must: [
              { need: 'Say cancel on the button', any: ['cancel'] }
            ] },
          { id: 'secondary', slot: 'secondary', kind: 'cta', label: 'Safe button', max: 22,
            hint: 'Keep the visit.',
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
        lines: {
          happy: 'That upsell is going to print memberships.',
          meh: 'Decent, but the membership pitch is easy to ignore.',
          mad: 'No one is joining off this.',
        },
      },
      {
        name: 'Nadia Ibrahim',
        role: 'Payments Lead',
        wants: 'Always say whether the card was charged. Ambiguity creates chargebacks.',
        cares: 'message',
        lines: {
          happy: 'Precise about money every time. Chargebacks will drop.',
          meh: 'The money part is a little fuzzy.',
          mad: 'Drivers will think they were double-charged.',
        },
      },
      {
        name: 'Chris Albright',
        role: 'Brand Director',
        wants: 'Short and sure of itself. Glanceable beats clever.',
        cares: 'fit',
        lines: {
          happy: 'Tight. Every line earns its spot.',
          meh: 'A few lines run long for a parked driver.',
          mad: 'Nobody reads paragraphs at a charger.',
        },
      },
    ],
    rounds: [
      {
        title: 'Station card',
        layout: 'card',
        goal: 'Show a station on the map. Get them to start charging fast.',
        static: { product: 'Voltway — Exit 42, Kettleman City', price: '0.4 mi' },
        fields: [
          { id: 'badge', slot: 'label', kind: 'label', label: 'Availability', max: 24,
            hint: '4 of 6 chargers open.',
            must: [
              { need: 'Say how many are open: 4', any: ['4'] },
              { need: 'Say out of how many: 6', any: ['6', 'open', 'free', 'available'] }
            ] },
          { id: 'body', slot: 'body', kind: 'body', label: 'Price + speed', max: 80,
            hint: '$0.48 per kWh. Up to 250 kW.',
            must: [
              { need: 'Include the price: $0.48', any: ['0.48', '48'] },
              { need: 'Say per kWh', any: ['kwh'] },
              { need: 'Mention the speed: 250 kW', any: ['250', 'fast'] }
            ] },
          { id: 'cta', slot: 'cta', kind: 'cta', label: 'Button', max: 18,
            hint: 'Go there, or start.',
            must: [
              { need: 'Name the action: start or navigate', any: ['start', 'charge', 'navigate', 'go', 'directions', 'drive'] }
            ] },
        ],
      },
      {
        title: 'Payment failed',
        layout: 'dialog',
        goal: 'The card was declined. Nothing was charged. Get them charging anyway.',
        static: {},
        fields: [
          { id: 'title', slot: 'title', kind: 'title', label: 'Title', max: 36,
            hint: 'Name the card problem.',
            must: [
              { need: 'Name the card or payment', any: ['card', 'payment'] }
            ],
            avoid: ['error', 'failed'] },
          { id: 'body', slot: 'body', kind: 'body', label: 'Body', max: 130,
            hint: 'Your bank declined the card. You were not charged. Use another card to start.',
            must: [
              { need: 'Say they were not charged', any: ["weren't charged", 'not charged', 'no charge', "haven't charged", "didn't charge", 'nothing was charged', 'not been charged'] },
              { need: 'Tell them to use another card', any: ['another', 'different', 'update', 'new card', 'other'] }
            ] },
          { id: 'primary', slot: 'cta', kind: 'cta', label: 'Primary button', max: 20,
            hint: 'Fix the payment.',
            must: [
              { need: 'Name the fix: use or update a card', any: ['use', 'add', 'update', 'change', 'pick', 'choose'] }
            ] },
          { id: 'secondary', slot: 'secondary', kind: 'cta', label: 'Secondary button', max: 22,
            hint: 'Get a human.',
            must: [
              { need: 'Offer help or support', any: ['help', 'support', 'call', 'contact', 'chat'] }
            ] },
        ],
      },
      {
        title: 'Session complete',
        layout: 'summary',
        goal: 'Charging is done. Recap the cost and pitch the membership.',
        static: { stats: [['Energy', '52 kWh'], ['Time', '28 min'], ['Total', '$24.96']] },
        fields: [
          { id: 'headline', slot: 'headline', kind: 'headline', label: 'Headline', max: 36,
            hint: 'Tell them charging is done.',
            must: [
              { need: 'Say charging is done', any: ['done', 'charged', 'ready', 'complete', 'full', 'good to go', 'all set'] }
            ] },
          { id: 'body', slot: 'body', kind: 'body', label: 'Receipt line', max: 110,
            hint: '$24.96 on your card ending 4021. Receipt is in your email.',
            must: [
              { need: 'Include the total: $24.96', any: ['24.96'] },
              { need: 'Name the card: ending 4021', any: ['4021', 'card'] },
              { need: 'Point to the emailed receipt', any: ['receipt', 'email'] }
            ] },
          { id: 'upsell', slot: 'upsell', kind: 'body', label: 'Membership pitch', max: 90,
            hint: 'Members pay less per kWh. Today would have cost less.',
            must: [
              { need: 'Mention membership', any: ['member', 'membership'] },
              { need: 'Say members pay less', any: ['save', 'less', 'off', 'cheaper'] },
              { need: 'Make it concrete: today\'s price or savings', any: ['$', 'today', 'this charge', 'per kwh'] }
            ] },
          { id: 'cta', slot: 'cta', kind: 'cta', label: 'Button', max: 22,
            hint: 'Join or try membership.',
            must: [
              { need: 'Name the action: join or try', any: ['join', 'try', 'start', 'get', 'save'] }
            ] },
        ],
      },
    ],
  },
  { id: 'E', playable: false, company: 'Harbor Bank', genre: 'Fraud alerts', stars: 4,
    teaser: 'Write fraud alerts people trust and act on within seconds.' },
  { id: 'F', playable: false, company: 'Quill', genre: 'AI writing assistant', stars: 4,
    teaser: 'Onboard skeptics to an AI tool without hype.' },
  { id: 'G', playable: false, company: 'Trailhead Outdoors', genre: 'E-commerce returns', stars: 5,
    teaser: 'Turn a strict returns policy into copy that keeps customers.' },
  { id: 'H', playable: false, company: 'Orbit Air', genre: 'Flight disruptions', stars: 5,
    teaser: 'Cancelled flight, 300 angry passengers, one push notification.' },
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
