# Spec: Contact

## Purpose

The Contact section provides three address cards (phone, email, location), a contact form that submits via EmailJS with toast notification feedback, and an embedded Google Maps iframe centered on Bogota, Colombia.

---

## Requirements

### Requirement: Contact Section Structure

The system MUST render a Contact section with `id="contact"` containing: three address info cards, a contact form, and an embedded Google Maps iframe.

#### Scenario: All contact section elements are present

- GIVEN the page is rendered
- WHEN the `#contact` section is inspected
- THEN address cards, the contact form, and the Google Maps embed MUST all be present

---

### Requirement: Address Info Cards

The system MUST render three address cards with the following content:
1. Phone: +57 3106961637
2. Email: davshn@gmail.com
3. Location: Galan, Bogota, Colombia

#### Scenario: Three address cards render with correct content

- GIVEN the contact section is rendered
- WHEN the three address cards are inspected
- THEN card 1 MUST show phone `+57 3106961637`, card 2 MUST show email `davshn@gmail.com`, card 3 MUST show location `Galan, Bogota, Colombia`

---

### Requirement: Contact Form Fields

The contact form MUST contain exactly three fields: name (text input), email (email input), and message (textarea). All three fields MUST be required. The form MUST have a submit button.

#### Scenario: Form renders with all required fields

- GIVEN the contact section is rendered
- WHEN the form is inspected
- THEN name input, email input, message textarea, and submit button MUST all be present

#### Scenario: Form does not submit with empty fields

- GIVEN all form fields are empty
- WHEN the user clicks the submit button
- THEN the form MUST NOT submit and MUST indicate which fields are required (browser native validation or custom validation)

#### Scenario: Form does not submit with invalid email

- GIVEN the email field contains a value that is not a valid email address
- WHEN the user attempts to submit
- THEN the form MUST NOT submit and MUST indicate the email field is invalid

---

### Requirement: EmailJS Form Submission

The contact form MUST submit via `@emailjs/browser` using environment variables `EMAILJS_SERVICE_ID`, `EMAILJS_TEMPLATE_ID`, and `EMAILJS_PUBLIC_KEY`. The form MUST NOT send data to any backend server. The form is implemented as a React island with `client:visible`.

#### Scenario: Successful submission shows success toast

- GIVEN all form fields are validly filled
- AND EmailJS environment variables are configured
- WHEN the user submits the form
- THEN EmailJS `send()` MUST be called with the correct service ID, template ID, form data, and public key
- AND a success toast MUST display with text `"Message Sent Successfully!"`
- AND the form fields MUST be cleared after successful submission

#### Scenario: Failed submission shows error toast

- GIVEN all form fields are validly filled
- AND EmailJS `send()` rejects (e.g., network error or invalid credentials)
- WHEN the submission fails
- THEN an error toast MUST display with text `"Ops Message Not Sent!"`
- AND the form fields MUST remain populated so the user can retry

#### Scenario: Submit button is disabled during submission

- GIVEN the user has submitted the form and the EmailJS call is in progress
- WHEN the form is inspected
- THEN the submit button MUST be disabled or show a loading state to prevent duplicate submissions

#### Scenario: Form degrades gracefully when env vars are absent

- GIVEN `EMAILJS_SERVICE_ID`, `EMAILJS_TEMPLATE_ID`, or `EMAILJS_PUBLIC_KEY` are not set
- WHEN the user submits the form
- THEN the form MUST NOT throw an uncaught JavaScript exception
- AND SHOULD display the error toast or a clear message indicating the form is unavailable

---

### Requirement: Toast Notification Configuration

Toast notifications triggered by the contact form MUST use `react-toastify` with: `position="top-right"`, `autoClose=2000`, `pauseOnHover=true`, `draggable=true`, `closeOnClick=true`. The `<ToastContainer />` is mounted globally in BaseLayout (not in this section).

#### Scenario: Success toast auto-closes after 2 seconds

- GIVEN a success toast is displayed
- WHEN 2000ms have elapsed
- THEN the toast MUST be automatically dismissed

#### Scenario: Toast pauses auto-close on hover

- GIVEN a toast is visible and counting down
- WHEN the user hovers over the toast
- THEN the auto-close timer MUST pause while the pointer is over the toast

---

### Requirement: Google Maps Embed

The contact section MUST embed a Google Maps iframe centered on coordinates `4.6482975, -74.107807` (Bogota, Colombia). The iframe MUST have a defined width and height and MUST NOT cause layout shift.

#### Scenario: Google Maps iframe is present with correct coordinates

- GIVEN the contact section is rendered
- WHEN the map iframe `src` attribute is inspected
- THEN it MUST reference the coordinates `4.6482975, -74.107807`

#### Scenario: Map does not cause CLS

- GIVEN the contact section is rendered
- WHEN the map iframe loads
- THEN its layout space MUST be reserved in advance (explicit width/height or aspect-ratio)

---

### Requirement: Contact Section AOS Animations

Address cards and the contact form MUST use AOS attributes with `data-aos="fade-up"` (or `fade-right`/`fade-left` for two-column layout), `data-aos-duration="1200"`, and staggered `data-aos-delay` values in 100ms increments.

#### Scenario: AOS attributes are present on contact section elements

- GIVEN the contact section is rendered
- WHEN the address cards and form container are inspected
- THEN each MUST have `data-aos` and `data-aos-duration` attributes with correct values
