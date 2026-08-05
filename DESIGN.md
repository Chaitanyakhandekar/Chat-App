Your task is to implement ONLY Phase 1 of the UI redesign.

Read DESIGN.md completely before making any changes.

This phase is ONLY about creating the shared design system foundation.

Do NOT redesign pages yet.

Do NOT modify business logic, APIs, hooks, sockets, routing, authentication, state management, or any functionality.

========================================
OBJECTIVES
========================================

Create a reusable production-grade design system that every page will use.

Improve maintainability before improving appearance.

Every future component should reuse these styles instead of creating new ones.

========================================
FILES YOU MAY MODIFY
========================================

- tailwind.config.js
- index.css
- index.html

Only modify additional files if absolutely necessary for the design system.

========================================
TASKS
========================================

1. Configure Inter as the global font.

2. Create a semantic color system.

Example tokens:

- background
- surface
- surface-hover
- surface-elevated
- border
- accent
- text-primary
- text-secondary
- text-muted
- success
- warning
- danger

3. Create reusable shadow tokens.

4. Create reusable border radius tokens.

5. Create reusable spacing tokens.

6. Create reusable animation tokens.

Keep animations subtle.

Remove decorative animations.

7. Create reusable utility classes inside index.css.

Examples:

.btn-primary
.btn-secondary
.btn-ghost
.input-field
.card-surface
.icon-button
.panel
.modal
.drawer
.badge
.empty-state
.skeleton
.scrollbar

These classes should be generic and reusable.

8. Move duplicated global CSS into index.css.

Examples:

- scrollbar
- skeleton
- loading
- focus ring
- selection
- reusable animations

9. Remove duplicate font imports.

10. Remove duplicate CSS variables.

11. Remove unnecessary hardcoded colors where possible.

12. Create a clean design token architecture that future components can use.

========================================
DO NOT
========================================

Do NOT redesign:

- Login
- Register
- Sidebar
- Chat
- ChatList
- Message
- Profile
- Notifications

Only build the shared foundation.

========================================
CODE QUALITY
========================================

- Remove dead CSS
- Remove duplicated CSS
- Use semantic naming
- Keep the code clean
- Keep everything reusable
- Follow DESIGN.md strictly

========================================
BEFORE FINISHING
========================================

Verify:

✓ Build succeeds

✓ No console errors

✓ Existing functionality unchanged

✓ Design tokens are reusable

✓ No duplicated styles

✓ No broken imports

✓ Global design system is ready for Phase 2

After completing Phase 1, stop and wait for further instructions.
Do not redesign any pages yet.




phase 2 


IMPORTANT

Before making any changes:

1. Read DESIGN.md completely.
2. Treat DESIGN.md as the project's official design specification.
3. Follow every design principle, rule, and constraint defined in DESIGN.md.
4. Preserve 100% of the existing functionality.

=========================================
TASK
=========================================

Implement ONLY Phase 2.

Redesign the authentication pages only.

Files to modify:

- Login.jsx
- Register.jsx

Do NOT modify any other pages or components unless absolutely necessary for shared reusable UI.

=========================================
OBJECTIVE
=========================================

Transform the authentication experience into a premium SaaS-quality interface.

The pages should feel modern, minimal, elegant, professional, and trustworthy.

The redesign should resemble the quality level of products such as Linear, Notion, Raycast, Slack, GitHub, and Vercel without copying their design.

=========================================
VISUAL IMPROVEMENTS
=========================================

Improve:

- Layout
- Visual hierarchy
- Typography
- Spacing
- Responsive behavior
- Accessibility
- Component consistency
- Overall polish

Reduce:

- Visual clutter
- Decorative elements
- Heavy gradients
- Glow effects
- Excessive blur
- Large shadows
- Unnecessary borders

Premium software feels clean rather than flashy.

=========================================
LAYOUT
=========================================

Create a clean centered authentication layout.

Improve:

- card proportions
- spacing
- content alignment
- responsive width
- visual balance

Avoid oversized containers.

Keep comfortable whitespace.

=========================================
CARD
=========================================

Redesign the authentication card.

Requirements:

- subtle border
- subtle elevation
- premium spacing
- clean corners
- no glow
- no heavy blur
- no noisy decorations

The card should feel lightweight.

=========================================
TYPOGRAPHY
=========================================

Improve hierarchy using:

- font size
- weight
- spacing

Avoid relying on colors.

Headings should immediately attract attention.

Descriptions should be readable but subtle.

=========================================
INPUTS
=========================================

Use the reusable input design from DESIGN.md.

Ensure:

- consistent height
- consistent padding
- semantic colors
- clean borders
- subtle focus ring
- proper disabled state
- accessible labels
- improved placeholder styling

Do not redesign every input differently.

=========================================
BUTTONS
=========================================

Primary button should:

- use semantic accent color
- have consistent height
- subtle hover
- subtle active feedback
- proper disabled state
- loading state if already supported

Do not use gradients.

Do not use glow.

=========================================
LINKS
=========================================

Improve:

- hover states
- focus states
- readability

Links should be subtle but discoverable.

=========================================
ICONS
=========================================

If icons exist:

- simplify them
- keep consistent sizing
- remove decorative styling
- remove unnecessary animations

=========================================
ANIMATIONS
=========================================

Keep animations subtle.

Allowed:

- fade
- opacity
- transform
- scale

Duration:

150–200ms

Remove decorative animations.

=========================================
RESPONSIVENESS
=========================================

Verify:

Desktop

Tablet

Mobile

Landscape

No overflow.

No broken alignment.

=========================================
ACCESSIBILITY
=========================================

Ensure:

- keyboard navigation
- visible focus
- proper contrast
- semantic HTML
- screen-reader friendly forms

=========================================
DO NOT CHANGE
=========================================

Do NOT modify:

- authentication logic
- API calls
- validation
- form submission
- routing
- hooks
- state management
- business logic
- backend

This is a visual redesign only.

=========================================
CODE QUALITY
=========================================

While redesigning:

- remove duplicated styles
- remove dead CSS
- use reusable utility classes
- use semantic design tokens
- improve maintainability
- avoid inline styles
- avoid hardcoded colors

=========================================
FINAL VERIFICATION
=========================================

Before finishing verify:

✓ Login works exactly as before

✓ Register works exactly as before

✓ Validation still works

✓ Navigation still works

✓ No console errors

✓ No TypeScript/ESLint errors

✓ Fully responsive

✓ Accessibility improved

✓ DESIGN.md followed consistently

✓ Premium visual quality achieved

After completing ONLY Login.jsx and Register.jsx, stop and wait for further instructions.

Do NOT redesign Sidebar, Chat, Profile, Notifications, or any other pages yet.


phase 3


IMPORTANT

Before making any changes:

1. Read DESIGN.md completely.
2. Treat DESIGN.md as the project's official design specification.
3. Follow every design rule defined there.
4. Preserve 100% of the existing functionality.

=========================================
TASK
=========================================

Implement ONLY Phase 3.

Redesign ONLY the navigation experience.

Focus on:

- Sidebar
- Navigation Rail
- Mobile Bottom Navigation
- Navigation Buttons
- Navigation Header
- Tooltips

Do not redesign the chat area or other pages.

=========================================
OBJECTIVE
=========================================

Create a premium navigation experience that feels modern, minimal, and highly polished.

Navigation should be effortless to understand.

Improve usability before aesthetics.

=========================================
VISUAL IMPROVEMENTS
=========================================

Improve:

- spacing
- typography
- icon consistency
- active states
- hover states
- focus states
- visual hierarchy
- responsive behavior

Reduce:

- gradients
- glow
- decorative blur
- excessive borders
- unnecessary shadows

=========================================
SIDEBAR
=========================================

Improve:

- overall spacing
- alignment
- navigation grouping
- active indicator
- selected state
- panel structure

Navigation should feel calm and lightweight.

=========================================
NAVIGATION BUTTONS
=========================================

All navigation buttons must:

- share identical sizing
- share identical spacing
- share identical radius
- share identical hover behavior
- share identical focus behavior
- share identical active behavior

Remove inconsistent styling.

=========================================
ICONS
=========================================

Improve icon consistency.

Maintain:

- identical sizing
- identical spacing
- identical alignment

Remove decorative icon styling.

=========================================
TOOLTIPS
=========================================

Create clean tooltips.

Improve:

- spacing
- readability
- animation
- accessibility

=========================================
MOBILE
=========================================

Improve bottom navigation.

Maintain:

- touch friendliness
- spacing
- responsiveness

No overflow.

=========================================
DO NOT MODIFY
=========================================

- routing
- navigation logic
- authentication
- permissions
- business logic
- hooks
- APIs

Visual improvements only.

=========================================
VERIFY
=========================================

✓ Navigation still works

✓ Responsive

✓ No console errors

✓ DESIGN.md followed

After completion stop and wait.


phase 4

IMPORTANT

Read DESIGN.md completely before making changes.

Implement ONLY Phase 4.

=========================================
TASK
=========================================

Redesign ONLY the Chat List.

Focus on:

- Chat List
- Chat Cards
- Search
- Filters
- Empty State

Do not modify Chat Window.

=========================================
OBJECTIVE
=========================================

Create a premium conversation list with excellent readability and hierarchy.

=========================================
IMPROVE
=========================================

- spacing
- typography
- search bar
- avatars
- timestamps
- unread badge
- hover states
- selected conversation
- online indicator
- typing indicator
- responsive layout

=========================================
SEARCH
=========================================

Improve:

- input styling
- spacing
- placeholder
- focus state
- icon alignment

=========================================
CHAT CARDS
=========================================

Improve:

- padding
- spacing
- hierarchy
- hover
- active state
- avatar alignment
- timestamp alignment

Unread conversations should be immediately recognizable without excessive colors.

=========================================
BADGES
=========================================

Improve:

- unread count
- mention count
- online state

Keep styling subtle.

=========================================
EMPTY STATE
=========================================

Create a premium empty state.

Use:

- icon
- title
- description

Avoid decorative illustrations.

=========================================
RESPONSIVENESS
=========================================

Verify:

Desktop

Tablet

Mobile

=========================================
DO NOT MODIFY
=========================================

- searching logic
- filtering
- chat selection
- API
- sockets
- state management

=========================================
VERIFY
=========================================

✓ Chat selection still works

✓ Search works

✓ Responsive

✓ No console errors

Stop after completion.


phase 5


IMPORTANT

Read DESIGN.md completely.

Implement ONLY Phase 5.

=========================================
TASK
=========================================

Redesign ONLY the Chat Window.

Focus on:

- Chat Header
- Chat Body
- Empty State
- Drawers
- Menus
- Layout
- Background
- Scroll Area

Do NOT redesign Message Bubbles or Composer yet.

=========================================
OBJECTIVE
=========================================

Transform the chat experience into a premium messaging interface.

Prioritize readability.

Improve visual hierarchy.

Reduce clutter.

=========================================
CHAT HEADER
=========================================

Improve:

- spacing
- avatar
- typography
- action buttons
- online status
- alignment

Simplify the visual appearance.

=========================================
CHAT BODY
=========================================

Improve:

- spacing
- readability
- background
- scrolling experience
- conversation rhythm

Remove decorative backgrounds.

=========================================
EMPTY STATE
=========================================

Design a premium empty state.

Improve:

- layout
- spacing
- typography

Avoid decorative effects.

=========================================
DRAWERS
=========================================

Improve:

- spacing
- elevation
- readability
- consistency

=========================================
MENUS
=========================================

Improve:

- spacing
- typography
- hover
- focus
- accessibility

=========================================
LOADING
=========================================

Improve:

- skeleton loaders
- loading hierarchy

Keep loading lightweight.

=========================================
RESPONSIVENESS
=========================================

Verify:

Desktop

Tablet

Mobile

Landscape

=========================================
DO NOT MODIFY
=========================================

- sockets
- chat logic
- API
- routing
- business logic
- hooks
- state management

=========================================
VERIFY
=========================================

✓ Chat still functions normally

✓ Responsive

✓ No console errors

✓ DESIGN.md followed

Stop after completion.



phase 6

IMPORTANT

Before making any changes:

1. Read DESIGN.md completely.
2. Treat DESIGN.md as the project's official design specification.
3. Follow every design rule.
4. Preserve 100% of existing functionality.

=========================================
TASK
=========================================

Implement ONLY Phase 6.

Focus ONLY on:

- Message.jsx
- Message Bubble
- Reply UI
- Message Actions
- Message Composer
- Attachment UI
- FileUpload
- MediaPreview
- Emoji/Reactions UI

Do not redesign Profile or Notifications.

=========================================
OBJECTIVE
=========================================

Create a premium messaging experience comparable to modern SaaS messaging products.

Messages should be highly readable.

Interactions should feel smooth.

The interface should feel calm, clean and refined.

=========================================
MESSAGE BUBBLES
=========================================

Improve:

- padding
- spacing
- corner radius
- typography
- readability
- sender vs receiver distinction
- timestamp placement
- attachment layout
- image presentation

Do NOT use heavy gradients.

Do NOT use glow.

Use subtle surfaces.

=========================================
MESSAGE COMPOSER
=========================================

Improve:

- input styling
- send button
- attachment button
- emoji button
- reply indicator
- spacing
- placeholder
- focus state

Keep the composer lightweight.

=========================================
MESSAGE ACTIONS
=========================================

Improve:

- context menu
- hover state
- accessibility
- spacing
- icon consistency

Keep actions discoverable but unobtrusive.

=========================================
MEDIA
=========================================

Improve:

- image preview
- file preview
- upload card
- video preview

Maintain consistent spacing and radius.

=========================================
REACTIONS
=========================================

Improve:

- reaction chips
- hover
- active state
- spacing

Keep reactions subtle.

=========================================
REPLY UI
=========================================

Improve:

- quote block
- typography
- spacing
- hierarchy

Avoid visual clutter.

=========================================
RESPONSIVENESS
=========================================

Verify:

Desktop

Tablet

Mobile

Landscape

=========================================
DO NOT MODIFY
=========================================

- sockets
- message sending
- upload logic
- reply logic
- API
- state management
- business logic

=========================================
VERIFY
=========================================

✓ Messaging still works

✓ Upload still works

✓ Reply still works

✓ Responsive

✓ No console errors

✓ DESIGN.md followed

Stop after completion.


phase 7

IMPORTANT

Read DESIGN.md completely.

Implement ONLY Phase 7.

=========================================
TASK
=========================================

Redesign ONLY:

- Profile
- Notification Panel
- Notification Cards
- Create Group
- Supporting Dialogs
- Supporting Forms

=========================================
OBJECTIVE
=========================================

Create a clean, modern and consistent supporting experience.

Every panel should feel like part of the same product.

=========================================
PROFILE
=========================================

Improve:

- information hierarchy
- cards
- spacing
- typography
- avatar
- buttons
- forms

Reduce unnecessary visual noise.

=========================================
NOTIFICATIONS
=========================================

Improve:

- notification cards
- hierarchy
- badges
- timestamps
- spacing
- hover states

Unread notifications should be obvious without using excessive colors.

=========================================
CREATE GROUP
=========================================

Improve:

- modal
- inputs
- member selection
- buttons
- spacing
- typography

Use reusable form components.

=========================================
DIALOGS
=========================================

Standardize:

- spacing
- radius
- shadows
- typography
- actions
- buttons

Every modal should feel identical.

=========================================
FORMS
=========================================

Improve:

- labels
- helper text
- validation appearance
- spacing
- focus state

Do not modify validation logic.

=========================================
DO NOT MODIFY
=========================================

- profile logic
- notification logic
- API
- routing
- state management
- authentication

=========================================
VERIFY
=========================================

✓ Profile works

✓ Notifications work

✓ Create Group works

✓ Responsive

✓ No console errors

Stop after completion.


phase 8


IMPORTANT

Read DESIGN.md completely.

Implement ONLY Phase 8.

=========================================
TASK
=========================================

Perform a complete UI consistency audit across the entire application.

Do not introduce new features.

Do not redesign completed sections.

Focus only on consistency, cleanup and polish.

=========================================
AUDIT
=========================================

Inspect every component for:

- inconsistent spacing
- inconsistent typography
- inconsistent radius
- inconsistent shadows
- inconsistent colors
- inconsistent hover states
- inconsistent focus states
- inconsistent disabled states
- inconsistent loading states
- inconsistent empty states
- inconsistent animations

=========================================
REFACTOR
=========================================

Remove:

- duplicate CSS
- duplicate Tailwind classes
- duplicate JSX
- duplicate animations
- duplicate utility code
- duplicate components

Extract reusable UI where appropriate.

=========================================
STANDARDIZE
=========================================

Ensure every component follows:

- shared spacing
- shared typography
- shared buttons
- shared cards
- shared inputs
- shared shadows
- shared radius
- shared animation timing

=========================================
PERFORMANCE
=========================================

Reduce unnecessary:

- backdrop blur
- shadows
- nested wrappers
- DOM complexity
- CSS duplication

Improve maintainability without changing appearance significantly.

=========================================
DO NOT MODIFY
=========================================

- business logic
- APIs
- routing
- sockets
- authentication
- state management

=========================================
VERIFY
=========================================

✓ No duplicated styles

✓ No dead CSS

✓ Shared design system used everywhere

✓ Consistent UI

✓ Build succeeds

✓ No console errors

Stop after completion.



phase 9

IMPORTANT

Read DESIGN.md completely.

Implement ONLY Phase 9.

=========================================
TASK
=========================================

Perform a complete accessibility audit across the entire application.

Improve accessibility without changing any functionality.

Follow WCAG AA guidelines wherever practical.

=========================================
OBJECTIVE
=========================================

The application should be fully usable with:

- Keyboard
- Screen readers
- Reduced vision
- Color blindness
- Touch devices

Accessibility should feel natural rather than added later.

=========================================
VERIFY EVERY COMPONENT
=========================================

Buttons

Links

Inputs

Textareas

Dropdowns

Menus

Modals

Drawers

Tooltips

Chat

Composer

Profile

Notifications

Sidebar

=========================================
IMPROVE
=========================================

Keyboard navigation

Tab order

Focus visibility

ARIA labels

Semantic HTML

Button accessibility

Form accessibility

Input labels

Placeholder readability

Error message readability

Color contrast

Touch targets

Hover alternatives

Screen reader compatibility

=========================================
FOCUS STATES
=========================================

Every interactive element must have:

- visible focus
- consistent focus ring
- keyboard accessibility

Remove inconsistent focus styles.

=========================================
FORMS
=========================================

Ensure:

Proper labels

Required indicators

Error messages

Accessible validation

Correct autocomplete

=========================================
CONTRAST
=========================================

Verify sufficient contrast for:

Text

Buttons

Inputs

Links

Badges

Status indicators

=========================================
DO NOT MODIFY
=========================================

Business logic

API

Validation logic

Authentication

Routing

State management

=========================================
VERIFY
=========================================

✓ Keyboard accessible

✓ Screen reader friendly

✓ Accessible forms

✓ Accessible navigation

✓ DESIGN.md followed

Stop after completion.


phase 10

IMPORTANT

Read DESIGN.md completely.

Implement ONLY Phase 10.

=========================================
TASK
=========================================

Perform a full responsive audit.

Do not redesign components.

Improve layout behavior only.

=========================================
VERIFY
=========================================

Mobile

Tablet

Laptop

Desktop

Ultra-wide

Landscape

=========================================
FIX
=========================================

Overflow

Wrapping

Spacing

Alignment

Touch targets

Scrolling

Grid behavior

Flex layouts

Drawer behavior

Sidebar behavior

Chat layout

Composer layout

Profile layout

Notification layout

=========================================
ENSURE
=========================================

No horizontal scrolling

No clipped content

No overlapping components

No broken layouts

Comfortable spacing

Readable typography

Consistent padding

=========================================
DO NOT MODIFY
=========================================

Business logic

APIs

Hooks

Sockets

Authentication

=========================================
VERIFY
=========================================

✓ Responsive on all screen sizes

✓ No overflow

✓ No broken layouts

✓ No console errors

Stop after completion.



phase 11

IMPORTANT

Read DESIGN.md completely.

Implement ONLY Phase 11.

=========================================
TASK
=========================================

Review every animation and interaction.

Keep only animations that improve usability.

=========================================
REMOVE
=========================================

Floating animations

Decorative animations

Glow animations

Heavy scaling

Large blur transitions

Unnecessary motion

=========================================
STANDARDIZE
=========================================

Hover

Focus

Pressed

Selected

Opening

Closing

Loading

Hover duration

Focus duration

Animation timing

Animation easing

=========================================
MICRO INTERACTIONS
=========================================

Improve:

Buttons

Inputs

Cards

Menus

Dropdowns

Message reactions

Composer

Navigation

Dialogs

=========================================
GOAL
=========================================

Interactions should feel:

Fast

Smooth

Premium

Predictable

Subtle

Never distracting.

=========================================
VERIFY
=========================================

✓ Consistent animations

✓ Smooth interactions

✓ No unnecessary motion

✓ Performance preserved

Stop after completion.


phase 12

IMPORTANT

Read DESIGN.md completely.

Implement ONLY Phase 12.

=========================================
TASK
=========================================

Perform a complete production-quality UI review.

Do not redesign.

Only polish, refactor and verify.

=========================================
AUDIT
=========================================

Review every screen.

Review every reusable component.

Review every layout.

Review every interaction.

Review every responsive breakpoint.

Review every animation.

=========================================
VERIFY DESIGN SYSTEM
=========================================

Spacing

Typography

Radius

Shadows

Colors

Buttons

Inputs

Cards

Modals

Dropdowns

Badges

Navigation

Messages

Composer

Profile

Notifications

Everything should feel like one unified design system.

=========================================
REMOVE
=========================================

Dead CSS

Unused imports

Duplicate utilities

Duplicate components

Duplicate styles

Unused variables

Magic numbers

Hardcoded colors

=========================================
VERIFY
=========================================

Build

Lint

Console

Performance

Accessibility

Responsiveness

Maintainability

=========================================
FINAL CHECKLIST
=========================================

✓ No functionality changed

✓ No API changes

✓ No routing changes

✓ No socket changes

✓ No authentication changes

✓ No state management changes

✓ DESIGN.md followed

✓ Responsive

✓ Accessible

✓ Premium appearance

✓ Consistent design system

✓ Clean code

✓ Build passes

✓ Lint passes

✓ No console errors

=========================================
FINAL REPORT
=========================================

When finished, provide a summary containing:

1. Files modified

2. Components redesigned

3. Reusable components created

4. CSS cleanup performed

5. Accessibility improvements

6. Responsive improvements

7. Performance improvements

8. Remaining recommendations (if any)

Stop after generating the final report.