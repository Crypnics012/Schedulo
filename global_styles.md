# Schedulo Pro - Global Styles

## Typography

- **Body Text**: Inter
  - Regular (400): Main text content
  - Medium (500): Emphasized content
  - Semi-bold (600): Subheadings

- **Headers**: Space Grotesk
  - Medium (500): Small headers
  - Bold (700): Main headers

## Color Palette

- **Primary**: Indigo 500 (#6366F1)
  - Hover state: Indigo 600 (#4F46E5)
  - Active state: Indigo 700 (#4338CA)
  - Light variant: Indigo 100 (#E0E7FF)

- **Secondary**: Orange 500 (#F97316)
  - Hover state: Orange 600 (#EA580C)
  - Active state: Orange 700 (#C2410C)
  - Light variant: Orange 100 (#FFEDD5)

- **Neutrals**:
  - Gray 100 (#F3F4F6): Background, light surfaces
  - Gray 200 (#E5E7EB): Borders, dividers
  - Gray 300 (#D1D5DB): Disabled elements
  - Gray 500 (#6B7280): Secondary text
  - Gray 700 (#374151): Primary text
  - Gray 900 (#111827): Headings

- **Status Colors**:
  - Success: #10B981 (Green 500)
  - Error: #EF4444 (Red 500)
  - Warning: #F59E0B (Amber 500)
  - Info: #3B82F6 (Blue 500)

## Spacing

Based on 8px grid system:
- p-2: 8px (0.5rem) - Minimal spacing
- p-4: 16px (1rem) - Standard spacing
- p-6: 24px (1.5rem) - Comfortable spacing
- p-8: 32px (2rem) - Section spacing
- p-12: 48px (3rem) - Large section spacing

## Border Radius

- 2xl (1rem): Applied to cards, buttons, and other interactive elements
- xl (0.75rem): Applied to smaller elements like chips and badges
- full: For circular elements like avatars and status indicators

## Shadows

- **sm**: 0 1px 2px 0 rgba(0, 0, 0, 0.05)
  - Used for subtle elevation (dropdown menus, tooltips)

- **md**: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)
  - Used for cards and interactive elements

- **lg**: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)
  - Used for modals and elevated content

## Button Styles

- **Primary Button**:
  - Background: Indigo 500 (#6366F1)
  - Text: White
  - Hover: Scale 1.05 + subtle glow
  - Border Radius: 2xl
  - Padding: px-6 py-3

- **Secondary Button**:
  - Background: White
  - Border: 1px solid Indigo 500
  - Text: Indigo 500
  - Hover: Scale 1.05 + subtle glow
  - Border Radius: 2xl
  - Padding: px-6 py-3

- **Tertiary Button**:
  - Background: Transparent
  - Text: Indigo 500
  - Hover: Background Indigo 100
  - Border Radius: 2xl
  - Padding: px-4 py-2

## Form Elements

- **Input Fields**:
  - Border: 1px solid Gray 300
  - Border Radius: xl
  - Focus: 2px ring Indigo 300
  - Padding: px-4 py-3
  - Background: White

- **Dropdown**:
  - Same as input fields
  - Dropdown icon: Gray 500

- **Checkbox/Radio**:
  - Checked color: Indigo 500
  - Border: 1px solid Gray 300
  - Size: 18px

## Card Styles

- Background: White
- Border Radius: 2xl
- Shadow: md
- Padding: p-6
- Border: Optional 1px solid Gray 200

## Icons

- Line weight: 1.5px
- Size: 24px for standard, 20px for compact UI
- Color: Matches text color or specific semantic color

## Responsive Breakpoints

- **sm**: 640px
- **md**: 768px
- **lg**: 1024px
- **xl**: 1280px
- **2xl**: 1536px

## Animation Standards

- **Duration**:
  - Fast: 150ms (micro-interactions)
  - Standard: 300ms (most UI elements)
  - Slow: 500ms (larger transitions)

- **Easing**:
  - Standard: cubic-bezier(0.4, 0, 0.2, 1)
  - Entrance: cubic-bezier(0, 0, 0.2, 1)
  - Exit: cubic-bezier(0.4, 0, 1, 1)
  - Spring: spring(1, 80, 10, 0) (using Framer Motion)

- **Hover Animation**:
  - Scale: 1.05
  - Transition: 150ms ease-in-out

- **Success Animation**:
  - Toast notification
  - Green check mark
  - Confetti burst

- **Error Animation**:
  - Shake animation (horizontal translation)
  - Red inline message
