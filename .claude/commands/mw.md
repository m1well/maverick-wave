# MaverickWave CSS Framework — Angular Integration Guide

This skill helps you use the **MaverickWave CSS framework** in an Angular project.
MaverickWave provides ready-made CSS classes. You apply them directly in Angular templates — no Angular-specific library is needed.

---

## Setup

### 1. Build the framework

```bash
cd path/to/maverick-wave
npm run build
# Outputs: dist/maverick-wave.min.css  (and .css for dev)
```

### 2. Add to Angular project

**Option A — copy the CSS file** and reference it in `angular.json`:

```json
"styles": [
  "src/styles.scss",
  "src/assets/maverick-wave.min.css"
]
```

**Option B — import in `styles.scss`** (if you publish to npm or use a local path):

```scss
@import 'path/to/maverick-wave.min.css';
```

### 3. FontAwesome icons

MaverickWave uses FontAwesome icons. Add to `index.html`:

```html
<link
  rel="stylesheet"
  href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css"
/>
```

### 4. Theme (dark/light)

The framework defaults to dark mode. To enable switching, add `.mw-theme-light` to `<body>`:

```typescript
// In your AppComponent
toggleTheme() {
  document.body.classList.toggle('mw-theme-light');
}
```

---

## Angular Reactive Forms Integration

Use the `mw-field` wrapper to group label + control + hint/error:

```html
<div
  class="mw-field"
  [class.mw-field-has-error]="email.invalid && email.touched"
>
  <label class="mw-field-label mw-required" for="email">Email</label>
  <input id="email" type="email" class="mw-input" formControlName="email" />
  <span class="mw-field-hint">Used for account notifications.</span>
  <span class="mw-field-error" *ngIf="email.invalid && email.touched">
    <i class="fas fa-exclamation-circle"></i>
    Please enter a valid email address.
  </span>
</div>
```

---

## Form Elements

### Input

```html
<input type="text" class="mw-input" />
<input type="text" class="mw-input mw-input-sm" />
<input type="text" class="mw-input mw-input-lg" />
<input type="text" class="mw-input mw-input-xl" />
```

### Input Group (prefix / suffix / button)

```html
<!-- Icon prefix -->
<div class="mw-input-group">
  <span class="mw-input-group-prefix"><i class="fas fa-search"></i></span>
  <input type="text" class="mw-input" placeholder="Search..." />
</div>

<!-- Text prefix + suffix -->
<div class="mw-input-group">
  <span class="mw-input-group-prefix">https://</span>
  <input type="text" class="mw-input" placeholder="your-domain.com" />
  <span class="mw-input-group-suffix">.com</span>
</div>

<!-- Input + button -->
<div class="mw-input-group">
  <input type="text" class="mw-input" placeholder="Search..." />
  <button type="button" class="mw-btn mw-btn-primary">
    <i class="fas fa-search"></i>
  </button>
</div>

<!-- Sizes: mw-input-group-sm / mw-input-group-lg -->
```

### Date, Time & DateTime

```html
<!-- Date -->
<div class="mw-input-group">
  <span class="mw-input-group-prefix"
    ><i class="fas fa-calendar-days"></i
  ></span>
  <input type="date" class="mw-input" formControlName="appointmentDate" />
</div>

<!-- Time -->
<div class="mw-input-group">
  <span class="mw-input-group-prefix"><i class="fas fa-clock"></i></span>
  <input type="time" class="mw-input" formControlName="startTime" />
</div>

<!-- DateTime-local -->
<div class="mw-input-group">
  <span class="mw-input-group-prefix"
    ><i class="fas fa-calendar-days"></i
  ></span>
  <input type="datetime-local" class="mw-input" formControlName="mainSlot" />
</div>

<!-- With mw-field wrapper (recommended for forms) -->
<div class="mw-field">
  <label class="mw-field-label mw-required" for="mainSlot">Main Slot</label>
  <div class="mw-input-group">
    <span class="mw-input-group-prefix"
      ><i class="fas fa-calendar-days"></i
    ></span>
    <input
      id="mainSlot"
      type="datetime-local"
      class="mw-input"
      formControlName="mainSlot"
    />
  </div>
</div>

<!-- Sizes: combine mw-input-group-sm/lg with mw-input-sm/lg -->
```

### Select

```html
<select class="mw-select">
  <option value="" disabled selected>Choose...</option>
  <option value="a">Option A</option>
</select>
```

### Textarea

```html
<textarea class="mw-textarea" rows="4" placeholder="..."></textarea>
<textarea class="mw-textarea mw-textarea-resizable-vertical"></textarea>
```

### Checkbox

```html
<label class="mw-checkbox">
  <input type="checkbox" formControlName="agreed" />
  <span class="mw-checkbox-box"></span>
  <span class="mw-checkbox-label">I agree to the terms</span>
</label>

<!-- Color variants: mw-checkbox-primary / secondary / success / warning / danger / info -->
<!-- Size variants: mw-checkbox-sm / mw-checkbox-lg / mw-checkbox-xl -->
```

### Radio

```html
<label class="mw-radio">
  <input type="radio" name="plan" value="free" formControlName="plan" />
  <span class="mw-radio-button"></span>
  <span class="mw-radio-label">Free</span>
</label>

<!-- Color variants: mw-radio-primary / secondary / success / warning / danger / info -->
<!-- Size variants: mw-radio-sm / mw-radio-lg / mw-radio-xl -->
```

### Toggle Switch

```html
<label class="mw-toggle">
  <input type="checkbox" formControlName="notifications" />
  <span class="mw-toggle-track"></span>
  <span class="mw-toggle-label">Enable notifications</span>
</label>

<!-- Sizes: mw-toggle-sm / mw-toggle-lg -->
<!-- Colors: mw-toggle-primary / secondary / success / warning / danger -->
<!-- Disabled: mw-toggle-disabled (add disabled attr to input too) -->
```

### Form Field Pattern

```html
<div class="mw-field">
  <label class="mw-field-label mw-required" for="name">Full Name</label>
  <input id="name" type="text" class="mw-input" formControlName="name" />
  <span class="mw-field-hint">As it appears on your ID.</span>
  <span class="mw-field-error" *ngIf="name.invalid && name.touched">
    <i class="fas fa-exclamation-circle"></i> Name is required.
  </span>
</div>
```

### Form Layout

```html
<form class="mw-form" [formGroup]="myForm" (ngSubmit)="onSubmit()">
  <div class="mw-form-group">
    <h4 class="mw-form-group-title">Personal Info</h4>
    <div class="mw-grid-2 mw-gap-4">
      <!-- fields go here -->
    </div>
  </div>
  <div class="mw-form-actions">
    <button type="button" class="mw-btn mw-btn-outline">Cancel</button>
    <button type="submit" class="mw-btn mw-btn-primary">Save</button>
  </div>
</form>
```

---

## Buttons

```html
<button class="mw-btn mw-btn-primary">Primary</button>
<button class="mw-btn mw-btn-secondary">Secondary</button>
<button class="mw-btn mw-btn-outline">Outline</button>
<button class="mw-btn mw-btn-link">Link</button>
<button class="mw-btn mw-btn-link-muted">Muted Link</button>

<!-- Sizes: mw-btn-sm / mw-btn-lg -->
<!-- With icon: -->
<button class="mw-btn mw-btn-primary"><i class="fas fa-save"></i> Save</button>
```

---

## Layout Utilities

```html
<!-- Grid -->
<div class="mw-grid-2 mw-gap-4">...</div>
<!-- 2-col grid -->
<div class="mw-grid-3 mw-gap-6">...</div>
<!-- 3-col grid -->
<div class="mw-grid-4 mw-gap-4">...</div>
<!-- 4-col grid -->

<!-- Spacing: mw-mt-4, mw-mb-6, mw-mx-3, mw-my-2, mw-p-4, mw-px-6, mw-py-2 -->
<!-- Gap values: 1–9 -->
```

---

## Cards & Panels

```html
<!-- Simple card -->
<div class="mw-card mw-card-simple">
  <h4 class="mw-card-title">Title</h4>
  <p>Content</p>
</div>

<!-- Hoverable card -->
<div class="mw-card mw-card-hover">...</div>

<!-- Panel (titled section) -->
<div class="mw-panel">
  <div class="mw-panel-header">
    <h3 class="mw-panel-title">Panel Title</h3>
  </div>
  <div class="mw-panel-body">...</div>
</div>
```

---

## Alerts

```html
<div class="mw-alert mw-alert-primary">Info message.</div>
<div class="mw-alert mw-alert-success">Success message.</div>
<div class="mw-alert mw-alert-warning">Warning message.</div>
<div class="mw-alert mw-alert-danger">Error message.</div>

<!-- Closable (handle dismiss in component) -->
<div class="mw-alert mw-alert-primary" *ngIf="showAlert">
  Message
  <button class="mw-btn mw-btn-link" (click)="showAlert = false">
    <i class="fas fa-times"></i>
  </button>
</div>
```

---

## Tables

```html
<div class="mw-table-wrapper">
  <table class="mw-table">
    <thead>
      <tr>
        <th>Name</th>
        <th>Status</th>
      </tr>
    </thead>
    <tbody>
      <tr *ngFor="let item of items">
        <td>{{ item.name }}</td>
        <td>
          <span class="mw-tag mw-tag-success">Active</span>
        </td>
      </tr>
    </tbody>
  </table>
</div>
```

---

## Tags / Badges

```html
<span class="mw-tag mw-tag-primary">Primary</span>
<span class="mw-tag mw-tag-success">Active</span>
<span class="mw-tag mw-tag-warning">Pending</span>
<span class="mw-tag mw-tag-danger">Error</span>
<span class="mw-tag mw-tag-info">Info</span>
<span class="mw-tag mw-tag-secondary">Secondary</span>
```

---

## Modal

```html
<!-- Trigger: set isOpen = true in component -->
<div
  class="mw-modal-overlay"
  [class.mw-modal-open]="isOpen"
  (click)="isOpen = false"
>
  <div class="mw-modal" (click)="$event.stopPropagation()">
    <div class="mw-modal-header">
      <h3 class="mw-modal-title">Title</h3>
      <button class="mw-btn mw-btn-link" (click)="isOpen = false">
        <i class="fas fa-times"></i>
      </button>
    </div>
    <div class="mw-modal-body">Content</div>
    <div class="mw-modal-footer">
      <button class="mw-btn mw-btn-outline" (click)="isOpen = false">
        Cancel
      </button>
      <button class="mw-btn mw-btn-primary" (click)="confirm()">Confirm</button>
    </div>
  </div>
</div>
```

---

## Spinner / Loading

```html
<div class="mw-spinner mw-spinner-primary"></div>
<div class="mw-spinner mw-spinner-sm mw-spinner-secondary"></div>

<!-- With overlay (e.g., on async operations) -->
<div class="mw-spinner-overlay" *ngIf="isLoading">
  <div class="mw-spinner mw-spinner-primary"></div>
</div>
```

---

## Skeleton Loader

```html
<!-- Show while data is loading -->
<div class="mw-skeleton-card" *ngIf="isLoading">
  <span class="mw-skeleton mw-skeleton-title"></span>
  <span class="mw-skeleton mw-skeleton-text"></span>
  <span class="mw-skeleton mw-skeleton-text"></span>
</div>

<!-- Avatar + text placeholder -->
<div class="mw-skeleton-card" *ngIf="isLoading">
  <div class="mw-skeleton-row">
    <span class="mw-skeleton mw-skeleton-circle"></span>
    <div class="mw-skeleton-body">
      <span class="mw-skeleton mw-skeleton-text" style="width: 55%"></span>
      <span class="mw-skeleton mw-skeleton-text"></span>
    </div>
  </div>
</div>
```

---

## Stepper

```html
<!-- Horizontal -->
<div class="mw-stepper">
  <div class="mw-stepper-step">
    <div class="mw-stepper-indicator mw-done"><i class="fas fa-check"></i></div>
    <span class="mw-stepper-label mw-done">Account</span>
  </div>
  <div class="mw-stepper-connector mw-done"></div>
  <div class="mw-stepper-step">
    <div class="mw-stepper-indicator mw-active">2</div>
    <span class="mw-stepper-label mw-active">Details</span>
  </div>
  <div class="mw-stepper-connector"></div>
  <div class="mw-stepper-step">
    <div class="mw-stepper-indicator">3</div>
    <span class="mw-stepper-label">Review</span>
  </div>
</div>
```

---

## Empty State

```html
<div class="mw-empty-state">
  <div class="mw-empty-state-icon">
    <i class="fas fa-inbox"></i>
  </div>
  <h3 class="mw-empty-state-title">No results found</h3>
  <p class="mw-empty-state-desc">Try adjusting your search or filters.</p>
  <button class="mw-btn mw-btn-primary">Clear filters</button>
</div>

<!-- Color variants: mw-empty-state-primary / success / warning / danger -->
<!-- Size variant: mw-empty-state-sm -->
```

---

## Divider

```html
<hr class="mw-divider" />
<hr class="mw-divider mw-divider-thick" />
<hr class="mw-divider mw-divider-dashed" />
<hr class="mw-divider mw-divider-primary" />

<!-- With text -->
<div class="mw-divider-text">or continue with</div>

<!-- Vertical (in flex containers) -->
<span class="mw-divider-vertical"></span>
```

---

## Typography Helpers

```html
<p class="mw-text-muted">Muted text</p>
<p class="mw-text-sm">Small text</p>
<p class="mw-text-medium">Medium weight</p>
<span class="mw-text-primary">Primary colored</span>
<span class="mw-text-success">Success colored</span>
<span class="mw-text-danger">Danger colored</span>
```

---

## Common Angular Patterns

### Reactive form with full validation

```typescript
// component.ts
form = this.fb.group({
  email: ['', [Validators.required, Validators.email]],
  name: ['', Validators.required],
  notifications: [true],
});

get email() { return this.form.get('email')!; }
```

```html
<!-- template -->
<form class="mw-form" [formGroup]="form" (ngSubmit)="onSubmit()">
  <div
    class="mw-field"
    [class.mw-field-has-error]="email.invalid && email.touched"
  >
    <label class="mw-field-label mw-required" for="email">Email</label>
    <div class="mw-input-group">
      <span class="mw-input-group-prefix"><i class="fas fa-envelope"></i></span>
      <input id="email" type="email" class="mw-input" formControlName="email" />
    </div>
    <span
      class="mw-field-error"
      *ngIf="email.errors?.['required'] && email.touched"
    >
      <i class="fas fa-exclamation-circle"></i> Email is required.
    </span>
    <span
      class="mw-field-error"
      *ngIf="email.errors?.['email'] && email.touched"
    >
      <i class="fas fa-exclamation-circle"></i> Please enter a valid email
      address.
    </span>
  </div>

  <div class="mw-field">
    <label class="mw-toggle">
      <input type="checkbox" formControlName="notifications" />
      <span class="mw-toggle-track"></span>
      <span class="mw-toggle-label">Enable email notifications</span>
    </label>
  </div>

  <div class="mw-form-actions">
    <button
      type="submit"
      class="mw-btn mw-btn-primary"
      [disabled]="form.invalid"
    >
      <i class="fas fa-save"></i> Save
    </button>
  </div>
</form>
```

### Loading state pattern

```html
<!-- Use skeleton while loading, then show real content -->
<ng-container *ngIf="!isLoading; else loadingTpl">
  <div class="mw-card mw-card-simple">
    <!-- real content -->
  </div>
</ng-container>
<ng-template #loadingTpl>
  <div class="mw-skeleton-card">
    <span class="mw-skeleton mw-skeleton-title"></span>
    <span class="mw-skeleton mw-skeleton-text"></span>
    <span class="mw-skeleton mw-skeleton-text"></span>
  </div>
</ng-template>
```
