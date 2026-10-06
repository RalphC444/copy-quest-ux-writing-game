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
        lines: {
          happy: 'Amount, merchant, card. That is an alert people can act on.',
          meh: 'Close, but a detail members need to decide is missing.',
          mad: 'Members cannot tell what we are asking about. They will call us.',
        },
      },
      {
        name: 'Omar Haddad',
        role: 'Member Experience Lead',
        wants: 'Fraud is scary. Our words should not be. Keep it calm and kind.',
        cares: 'voice',
        lines: {
          happy: 'Reassuring without sounding sleepy. Nicely done.',
          meh: 'A little cold. Members want to feel looked after.',
          mad: 'This would frighten my mother.',
        },
      },
      {
        name: 'Ruth Kimura',
        role: 'Security Lead',
        wants: 'Plain words only. If members have to reread a fraud alert, they ignore it.',
        cares: 'clarity',
        lines: {
          happy: 'I read it once and knew exactly what to do.',
          meh: 'Readable, but it makes me work a little.',
          mad: 'Too dense. This alert gets swiped away.',
        },
      },
    ],
    rounds: [
      {
        title: 'Fraud alert',
        layout: 'notification',
        goal: 'A $482.19 charge at ElectroMart on card ending 7731 looks unusual. Ask the member if it was them.',
        static: { app: 'Harbor Bank' },
        fields: [
          { id: 'title', slot: 'title', kind: 'title', label: 'Title', max: 40,
            hint: 'Ask: did you make this charge?',
            must: [
              { need: 'Ask if the charge was theirs', any: ['was this you', 'did you', 'yours', 'you make', 'you made', 'recognize'] },
            ] },
          { id: 'body', slot: 'body', kind: 'body', label: 'Body', max: 120,
            hint: '$482.19 at ElectroMart on your card ending 7731.',
            must: [
              { need: 'Include the amount: $482.19', any: ['482.19'] },
              { need: 'Name the merchant: ElectroMart', any: ['electromart'] },
              { need: 'Name the card: ending 7731', any: ['7731'] },
            ],
            avoid: ['pin', 'password', 'social security'] },
          { id: 'action', slot: 'cta', kind: 'cta', label: 'Action', max: 18,
            hint: 'Open the charge to review it.',
            must: [
              { need: 'Let them review the charge', any: ['review', 'check', 'see', 'view'] },
            ] },
        ],
      },
      {
        title: 'Card locked',
        layout: 'dialog',
        goal: 'They said it was not them. The card is now locked. Tell them they are safe and what happens next.',
        static: {},
        fields: [
          { id: 'title', slot: 'title', kind: 'title', label: 'Title', max: 36,
            hint: 'Tell them the card is locked.',
            must: [
              { need: 'Say the card is locked', any: ['locked', 'frozen', 'blocked', 'paused'] },
            ],
            avoid: ['error', 'failed'] },
          { id: 'body', slot: 'body', kind: 'body', label: 'Body', max: 150,
            hint: 'You will not pay for the $482.19 charge. A new card arrives in 5 to 7 days.',
            must: [
              { need: 'Say they will not pay for the charge', any: ["won't pay", 'will not pay', 'not responsible', "won't be charged", 'refund', 'not charged', 'covered', "don't owe", 'do not owe'] },
              { need: 'Say a new card is coming', any: ['new card', 'replacement'] },
              { need: 'Give the timing: 5 to 7 days', any: ['5', '7', 'days', 'week'] },
            ],
            avoid: ['pin', 'password', 'unfortunately'] },
          { id: 'primary', slot: 'cta', kind: 'cta', label: 'Primary button', max: 22,
            hint: 'Track the new card.',
            must: [
              { need: 'Let them track the new card', any: ['track', 'see', 'view', 'check'] },
            ] },
          { id: 'secondary', slot: 'secondary', kind: 'cta', label: 'Secondary button', max: 22,
            hint: 'Talk to a person.',
            must: [
              { need: 'Offer a person to talk to', any: ['call', 'talk', 'chat', 'help', 'contact', 'support'] },
            ] },
        ],
      },
      {
        title: 'Verify a new phone',
        layout: 'form',
        goal: 'A member is signing in on a new phone. Send a one-time code, and warn them never to share it.',
        static: { step: 'Verify it’s you', banks: ['Text (•••) •••-0142', 'Email r•••@mail.com', 'Call me instead'] },
        fields: [
          { id: 'headline', slot: 'headline', kind: 'headline', label: 'Headline', max: 36,
            hint: 'Ask them to confirm it is really them.',
            must: [
              { need: 'Ask them to verify or confirm', any: ['verify', 'confirm', "it's you", 'it is you', 'check'] },
            ] },
          { id: 'body', slot: 'body', kind: 'body', label: 'Body', max: 140,
            hint: 'We will send a 6-digit code. Never share it. Harbor Bank will never ask you for it.',
            must: [
              { need: 'Mention the code', any: ['code'] },
              { need: 'Say the bank never asks for it', any: ['never ask', 'never call', 'will never', 'we never', "won't ask"] },
              { need: 'Tell them not to share it', any: ["don't share", 'do not share', 'never share', 'keep it', 'only you', 'not share'] },
            ] },
          { id: 'cta', slot: 'cta', kind: 'cta', label: 'Button', max: 20,
            hint: 'Send the code.',
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
        lines: {
          happy: 'That gets people writing in seconds.',
          meh: 'Fine, but I would wander off before the first draft.',
          mad: 'Nobody makes it past this screen.',
        },
      },
      {
        name: 'Ama Owusu',
        role: 'Trust & AI Ethics Lead',
        wants: 'Be honest about what the AI cannot do, and that people stay in control.',
        cares: 'message',
        lines: {
          happy: 'Honest and clear about the limits. I would sign off.',
          meh: 'Mostly honest, but a key caveat is missing.',
          mad: 'This overpromises. We lose trust on day one.',
        },
      },
      {
        name: 'Jun Park',
        role: 'Brand Writer',
        wants: 'No hype words. If it sounds like a launch tweet, rewrite it.',
        cares: 'voice',
        lines: {
          happy: 'Zero hype. Sounds like a person. Love it.',
          meh: 'One or two lines drift into ad-speak.',
          mad: 'This reads like a crypto launch.',
        },
      },
    ],
    rounds: [
      {
        title: 'Welcome',
        layout: 'hero',
        goal: 'Greet a skeptical new user and get them to try one real draft.',
        static: { nav: ['Product', 'Pricing', 'Sign in'] },
        fields: [
          { id: 'headline', slot: 'headline', kind: 'headline', label: 'Headline', max: 44,
            hint: 'Say what Quill does in plain words: it drafts your writing.',
            must: [
              { need: 'Say what it does: drafts writing', any: ['draft', 'write', 'writing', 'first version'] },
            ] },
          { id: 'sub', slot: 'body', kind: 'body', label: 'Subhead', max: 110,
            hint: 'Quill drafts your emails and docs. You edit and decide what goes out.',
            must: [
              { need: 'Say they stay in control', any: ['you edit', 'you decide', 'you choose', "you're in charge", 'you stay', 'in control', 'your call', 'you approve'] },
              { need: 'Name a real use: emails, docs or replies', any: ['email', 'doc', 'repl', 'message', 'report'] },
            ] },
          { id: 'cta', slot: 'cta', kind: 'cta', label: 'Button', max: 22,
            hint: 'Start a first draft.',
            must: [
              { need: 'Name the action: try or start a draft', any: ['draft', 'try', 'start', 'write'] },
            ] },
        ],
      },
      {
        title: 'Honest heads-up',
        layout: 'dialog',
        goal: 'Before the first draft, set honest expectations: Quill can get facts wrong.',
        static: {},
        fields: [
          { id: 'title', slot: 'title', kind: 'title', label: 'Title', max: 40,
            hint: 'Introduce a quick heads-up before they start.',
            must: [
              { need: 'Signal this is a quick note', any: ['before', 'heads-up', 'heads up', 'quick note', 'good to know', 'note', 'know'] },
            ] },
          { id: 'body', slot: 'body', kind: 'body', label: 'Body', max: 150,
            hint: 'Quill can get facts wrong, so check names, numbers and dates before you send.',
            must: [
              { need: 'Admit it can get things wrong', any: ['wrong', 'mistake', 'error', 'not always right', 'incorrect', 'make things up'] },
              { need: 'Tell them to check facts before sending', any: ['check', 'review', 'double-check', 'verify'] },
            ],
            avoid: ['always accurate', '100%', 'perfect', 'never wrong', 'guarantee'] },
          { id: 'primary', slot: 'cta', kind: 'cta', label: 'Primary button', max: 18,
            hint: 'Acknowledge and start writing.',
            must: [
              { need: 'Let them move on to writing', any: ['got it', 'start', 'write', 'draft', 'understood', 'sounds good'] },
            ] },
          { id: 'secondary', slot: 'secondary', kind: 'cta', label: 'Secondary button', max: 24,
            hint: 'Show how Quill handles their data.',
            must: [
              { need: 'Offer details on how it works', any: ['how', 'data', 'privacy', 'works'] },
            ] },
        ],
      },
      {
        title: 'Free drafts used up',
        layout: 'summary',
        goal: 'They used all 20 free drafts this month. Recap what they did and invite them to upgrade.',
        static: { stats: [['Drafts', '20 of 20'], ['Time saved', '~3 hrs'], ['Resets', 'Mar 1']] },
        fields: [
          { id: 'headline', slot: 'headline', kind: 'headline', label: 'Headline', max: 36,
            hint: 'Tell them they have used all their free drafts.',
            must: [
              { need: 'Say they used all the free drafts', any: ['used', 'all 20', 'reached', 'out of', 'no drafts left', 'limit'] },
            ] },
          { id: 'body', slot: 'body', kind: 'body', label: 'Body', max: 110,
            hint: 'Free drafts reset March 1. Everything you saved stays put.',
            must: [
              { need: 'Say when it resets: March 1', any: ['march 1', 'mar 1', 'march first'] },
              { need: 'Reassure them saved drafts are kept', any: ['saved', 'keep', 'still have', 'safe', 'stay'] },
            ] },
          { id: 'upsell', slot: 'upsell', kind: 'body', label: 'Upgrade pitch', max: 90,
            hint: 'Pro is $12 a month for unlimited drafts.',
            must: [
              { need: 'Name the plan: Pro', any: ['pro'] },
              { need: 'Give the price: $12', any: ['12'] },
              { need: 'Say what they get: unlimited drafts', any: ['unlimited', 'no limit'] },
            ] },
          { id: 'cta', slot: 'cta', kind: 'cta', label: 'Button', max: 22,
            hint: 'Upgrade to Pro.',
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
        lines: {
          happy: 'Sounds like us. Like a friend who knows the trail.',
          meh: 'A bit stiff. Loosen the boots.',
          mad: 'This reads like a terms-of-service page.',
        },
      },
      {
        name: 'Carmen Ruiz',
        role: 'Customer Care Manager',
        wants: 'Every no needs a next step: exchange, repair or store credit.',
        cares: 'message',
        lines: {
          happy: 'Every no has a way forward. My team will love it.',
          meh: 'Mostly there, but someone will still call us.',
          mad: 'Dead ends everywhere. Our phones will melt.',
        },
      },
      {
        name: 'Theo Lindqvist',
        role: 'E-commerce Product Manager',
        wants: 'Mobile first. If it wraps to five lines, it is too long.',
        cares: 'fit',
        lines: {
          happy: 'Tight and scannable. Perfect on a phone.',
          meh: 'Some lines run long on mobile.',
          mad: 'Wall of text. Nobody reads this on a phone.',
        },
      },
    ],
    rounds: [
      {
        title: 'Start a return',
        layout: 'form',
        goal: 'Explain the return rules up front and help them pick an item.',
        static: { step: 'Returns', banks: ['Trail Runner 2 shoes · $139', 'Summit 30L pack · $189', 'Camp mug · $18'] },
        fields: [
          { id: 'headline', slot: 'headline', kind: 'headline', label: 'Headline', max: 36,
            hint: 'Invite them to start a return.',
            must: [
              { need: 'Say return', any: ['return'] },
            ] },
          { id: 'body', slot: 'body', kind: 'body', label: 'Body', max: 140,
            hint: 'Returns are free within 30 days for unused gear with the tags on.',
            must: [
              { need: 'Give the window: 30 days', any: ['30'] },
              { need: 'Say it must be unused', any: ['unused', "haven't used", 'not used', 'new condition', 'unworn'] },
              { need: 'Mention the tags', any: ['tag'] },
            ],
            avoid: ['policy prohibits', 'non-negotiable'] },
          { id: 'cta', slot: 'cta', kind: 'cta', label: 'Button', max: 22,
            hint: 'Pick an item to return.',
            must: [
              { need: 'Name the action: pick an item', any: ['choose', 'pick', 'select', 'start', 'return'] },
            ] },
        ],
      },
      {
        title: 'Past the return window',
        layout: 'dialog',
        goal: 'Their tent was bought 41 days ago, past the 30-day window. Say no kindly and offer a free repair or store credit.',
        static: {},
        fields: [
          { id: 'title', slot: 'title', kind: 'title', label: 'Title', max: 40,
            hint: 'Say this one cannot be returned.',
            must: [
              { need: 'Say it cannot be returned', any: ["can't be returned", 'cannot be returned', "can't return", 'past the', 'too late', 'window', 'not returnable'] },
            ],
            avoid: ['denied', 'rejected', 'error'] },
          { id: 'body', slot: 'body', kind: 'body', label: 'Body', max: 150,
            hint: 'It is past 30 days, but we can repair it for free or give you store credit.',
            must: [
              { need: 'Explain why: past 30 days', any: ['30', 'past', 'days'] },
              { need: 'Offer a free repair', any: ['repair', 'fix'] },
              { need: 'Offer store credit', any: ['credit'] },
            ],
            avoid: ['unfortunately', 'policy'] },
          { id: 'primary', slot: 'cta', kind: 'cta', label: 'Primary button', max: 20,
            hint: 'Request the repair.',
            must: [
              { need: 'Name the action: repair', any: ['repair', 'fix', 'send'] },
            ] },
          { id: 'secondary', slot: 'secondary', kind: 'cta', label: 'Secondary button', max: 22,
            hint: 'Choose store credit instead.',
            must: [
              { need: 'Offer store credit', any: ['credit'] },
            ] },
        ],
      },
      {
        title: 'Return approved',
        layout: 'confirm',
        goal: 'Their return is approved. Explain how to send it back and when the refund lands.',
        static: { rows: [['Item', 'Summit 30L pack'], ['Drop-off', 'Any UPS store'], ['Ship by', 'April 12']] },
        fields: [
          { id: 'headline', slot: 'headline', kind: 'headline', label: 'Headline', max: 36,
            hint: 'Tell them the return is approved.',
            must: [
              { need: 'Say the return is approved', any: ['approved', 'all set', 'good to go', 'ready', 'accepted', 'on its way'] },
            ] },
          { id: 'body', slot: 'body', kind: 'body', label: 'Details', max: 140,
            hint: 'Drop it at any UPS store by April 12. Your refund lands 3 to 5 days after we get it.',
            must: [
              { need: 'Say where: any UPS store', any: ['ups'] },
              { need: 'Give the deadline: April 12', any: ['april 12', 'apr 12'] },
              { need: 'Say when the refund lands', any: ['refund'] },
            ] },
          { id: 'cta', slot: 'cta', kind: 'cta', label: 'Button', max: 22,
            hint: 'Show the return label.',
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
        lines: {
          happy: 'Flight, time, gate. My agents can breathe.',
          meh: 'Close, but one missing detail sends people to the desk.',
          mad: 'Everyone is going to line up at the gate now.',
        },
      },
      {
        name: 'Sami Rahman',
        role: 'Customer Advocate',
        wants: 'Own it. Say sorry once, plainly, and skip the corporate excuses.',
        cares: 'voice',
        lines: {
          happy: 'Human and honest. People will feel respected.',
          meh: 'A little stiff. Sounds like a press release.',
          mad: 'This hides behind jargon. People will be furious.',
        },
      },
      {
        name: 'Ivy Chen',
        role: 'Mobile Product Lead',
        wants: 'Give them a button that solves it: rebook, take a credit, see options.',
        cares: 'action',
        lines: {
          happy: 'One tap and they are sorted. Beautiful.',
          meh: 'The next step is there, but easy to miss.',
          mad: 'No clear way out. They will all call.',
        },
      },
    ],
    rounds: [
      {
        title: 'Delay alert',
        layout: 'notification',
        goal: 'Flight OA 214 to Denver is delayed 2 hours. It now leaves at 6:40 p.m. from gate C9.',
        static: { app: 'Orbit Air' },
        fields: [
          { id: 'title', slot: 'title', kind: 'title', label: 'Title', max: 40,
            hint: 'Say flight OA 214 is delayed.',
            must: [
              { need: 'Name the flight: OA 214', any: ['214'] },
              { need: 'Say it is delayed', any: ['delay', 'late', 'later'] },
            ] },
          { id: 'body', slot: 'body', kind: 'body', label: 'Body', max: 140,
            hint: 'Now leaving at 6:40 p.m. from gate C9. Sorry for the wait.',
            must: [
              { need: 'Give the new time: 6:40 p.m.', any: ['6:40'] },
              { need: 'Give the gate: C9', any: ['c9'] },
              { need: 'Apologize once, plainly', any: ['sorry', 'apolog'] },
            ] },
          { id: 'action', slot: 'cta', kind: 'cta', label: 'Action', max: 18,
            hint: 'Show their options.',
            must: [
              { need: 'Let them see their options', any: ['see', 'view', 'option', 'rebook', 'change'] },
            ] },
        ],
      },
      {
        title: 'Flight cancelled',
        layout: 'dialog',
        goal: 'OA 377 is cancelled. They are rebooked on tomorrow’s 8:05 a.m. flight, with a $200 credit.',
        static: {},
        fields: [
          { id: 'title', slot: 'title', kind: 'title', label: 'Title', max: 40,
            hint: 'Say flight OA 377 is cancelled.',
            must: [
              { need: 'Say it is cancelled', any: ['cancel'] },
              { need: 'Name the flight: OA 377', any: ['377'] },
            ] },
          { id: 'body', slot: 'body', kind: 'body', label: 'Body', max: 160,
            hint: 'We moved you to tomorrow at 8:05 a.m. and added a $200 credit. Hotel vouchers are at the desk.',
            must: [
              { need: 'Say they are rebooked', any: ['rebook', 'moved you', 'new flight', 'booked you', 'seat on'] },
              { need: 'Give the new time: 8:05 a.m.', any: ['8:05'] },
              { need: 'Mention the $200 credit', any: ['200'] },
            ] },
          { id: 'primary', slot: 'cta', kind: 'cta', label: 'Primary button', max: 22,
            hint: 'Keep the new flight.',
            must: [
              { need: 'Let them keep the new flight', any: ['keep', 'confirm', 'accept', 'sounds good'] },
            ] },
          { id: 'secondary', slot: 'secondary', kind: 'cta', label: 'Secondary button', max: 24,
            hint: 'See other flights.',
            must: [
              { need: 'Offer other flights', any: ['other', 'see', 'change', 'different', 'option'] },
            ] },
        ],
      },
      {
        title: 'Choose compensation',
        layout: 'summary',
        goal: 'Offer compensation for the cancellation: a $200 travel credit, or $150 back to their card.',
        static: { stats: [['Flight', 'OA 377'], ['Delay', '14 hrs'], ['Credit', '$200']] },
        fields: [
          { id: 'headline', slot: 'headline', kind: 'headline', label: 'Headline', max: 36,
            hint: 'Tell them they get something for the trouble.',
            must: [
              { need: 'Say this is for the trouble', any: ['for the trouble', 'owe you', 'make it up', 'compensation', 'credit', 'refund', 'yours'] },
            ] },
          { id: 'body', slot: 'body', kind: 'body', label: 'Body', max: 120,
            hint: 'Pick a $200 travel credit, or $150 back to your card.',
            must: [
              { need: 'Offer the $200 credit', any: ['200'] },
              { need: 'Offer the $150 refund', any: ['150'] },
            ] },
          { id: 'upsell', slot: 'upsell', kind: 'body', label: 'Credit details', max: 90,
            hint: 'The credit never expires and works on any route.',
            must: [
              { need: 'Say the credit never expires', any: ['never expire', "doesn't expire", 'no expir', "won't expire", 'does not expire'] },
              { need: 'Say it works on any route', any: ['any route', 'any flight', 'anywhere', 'any trip'] },
            ] },
          { id: 'cta', slot: 'cta', kind: 'cta', label: 'Button', max: 22,
            hint: 'Take the credit.',
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
