import { Page, Locator } from '@playwright/test';

export class TestPage {
  readonly page: Page;
  readonly userEmailInput: Locator;
  readonly passwordInput: Locator;
  readonly signInButton: Locator;
  readonly errorMessage: Locator;
  // --- Login flow locators (TC-LOGIN-001..004) ---
  readonly logoutButton: Locator;
  readonly userEmailInNav: Locator;
  readonly featuredEventsHeading: Locator;
 readonly eventTab: Locator;
readonly addNewEvent: Locator;
readonly eventTitle: Locator;
readonly eventDesc: Locator;
readonly categoryDD: Locator;
readonly eventCity: Locator;
 readonly eventVenue: Locator;
readonly eventCalender: Locator;
readonly eventPrice: Locator;
readonly eventSeat: Locator;
readonly addEventButton: Locator;

// --- My Bookings page locators (TC-BOOK-001/002/003) ---
readonly bookingsNavLink: Locator;
readonly bookingsHeading: Locator;
readonly bookingCards: Locator;
readonly firstBookingCard: Locator;
readonly firstBookingEventName: Locator;
readonly firstBookingDate: Locator;
readonly firstBookingVenue: Locator;
readonly firstBookingSeats: Locator;
readonly firstBookingPrice: Locator;
readonly firstBookingStatus: Locator;
readonly confirmedStatusBadges: Locator;
readonly cancelledStatusBadges: Locator;
readonly firstCancelButton: Locator;
readonly cancelConfirmModal: Locator;
readonly modalKeepBookingButton: Locator;
readonly modalConfirmCancelButton: Locator;
readonly cancelSuccessToast: Locator;
readonly emptyStateContainer: Locator;
readonly emptyStateHeading: Locator;
readonly emptyStateSubText: Locator;
readonly emptyStateCTA: Locator;

// --- Events listing field locators (TC-EVT-001) ---
readonly eventCards: Locator;
readonly firstEventCard: Locator;
readonly firstEventTitle: Locator;
readonly firstEventCategory: Locator;
readonly firstEventCity: Locator;
readonly firstEventVenue: Locator;
readonly firstEventDate: Locator;
readonly firstEventPrice: Locator;
readonly firstEventSeats: Locator;
readonly firstEventStatus: Locator;

// --- Add New Event validation / form locators (TC-EVT-003) ---
readonly eventTitleError: Locator;
readonly eventPriceError: Locator;
readonly eventSeatsError: Locator;
readonly eventCategoryError: Locator;
readonly eventCityError: Locator;
readonly eventVenueError: Locator;
readonly eventDateError: Locator;
readonly anyEventFormError: Locator;
readonly addEventForm: Locator;
readonly eventCreatedToast: Locator;

  constructor(page: Page) {
    this.page = page;
    this.userEmailInput = this.page.getByPlaceholder('you@email.com');
    this.passwordInput = this.page.getByPlaceholder('••••••');
    this.signInButton = this.page.getByRole('button', { name: 'Sign In' });
    this.errorMessage = page.locator('.error-message');

    // --- Login flow locators (TC-LOGIN-001..004) ---
    // Logout button — appears in the top navigation only after a successful login.
    this.logoutButton = this.page.getByRole('button', { name: /logout/i });

    // The authenticated user's email appears in the nav as a labelled element
    // (aria-label = email) per the automationHints in login-testcases.json.
    this.userEmailInNav = this.page.getByLabel('manish123@gmail.com');

    // Home page heading — only visible on the post-login "/" route.
    this.featuredEventsHeading = this.page.getByRole('heading', { name: /featured events/i });
    this.eventTab=page.locator( '#nav-events')
    this.addNewEvent = page.getByRole('button', { name: 'Add New Event' });
    this.eventTitle=page.locator('//input[@id="event-title-input"]');
     this.eventDesc=page.getByPlaceholder('Describe the event…"]');
     this.categoryDD=page.locator('#category');
     this.eventCity=page.locator('#city');
     this.eventVenue=page.locator('#venue');
      this.eventCalender=page.locator('//input[@id="event-date-&-time"]');
       this.eventPrice=page.getByPlaceholder('0.00');
        this.eventSeat=page.locator('#total-seats');
        this.addEventButton=page.locator('#add-event-btn')

    // Bookings nav link — matches the existing #nav-* convention used by the app shell
    // (eventTab uses '#nav-events'). Best-guess id derived from that pattern; falls
    // back to the visible "My Bookings" text via getByRole on the link.
    this.bookingsNavLink = page.locator('#nav-bookings, a[href="/bookings"]').or(
      page.getByRole('link', { name: /my bookings/i })
    );

    // Page heading — verified against JSON expectedResult ("Page heading reads 'My Bookings'")
    this.bookingsHeading = page.getByRole('heading', { name: /my bookings/i });

    // Booking cards/rows — common patterns in this Bootstrap-style demo app
    // (each booking rendered as a .card or li.booking-item). Combined selector
    // makes the locator resilient to either implementation.
    this.bookingCards = page.locator('.booking-card, .booking-item, [data-testid="booking-card"], .card:has(.status), .card:has-text("Confirmed"), .card:has-text("Cancelled")');
    this.firstBookingCard = this.bookingCards.first();

    // Individual fields inside the first booking — scoped to the first card to
    // avoid clashing with similar text elsewhere on the page.
    this.firstBookingEventName = this.firstBookingCard.locator('.event-name, .card-title, h3, h4').first();
    this.firstBookingDate = this.firstBookingCard.locator('.event-date, .booking-date, time, :text-matches("\\\\d{1,2}\\\\s?[A-Za-z]{3,}\\\\s?\\\\d{4}")').first();
    this.firstBookingVenue = this.firstBookingCard.locator('.event-venue, .venue, .location').first();
    this.firstBookingSeats = this.firstBookingCard.locator('.seats, .booking-seats, :text-matches("\\\\bseats?\\\\b", "i")').first();
    this.firstBookingPrice = this.firstBookingCard.locator('.price, .total-price, :text-matches("[₹$€£]\\\\s?\\\\d+")').first();
    this.firstBookingStatus = this.firstBookingCard.locator('.status, .badge, .booking-status').first();

    // Status badges scoped page-wide (used to confirm at least one Confirmed exists)
    this.confirmedStatusBadges = page.locator('.status, .badge, .booking-status').filter({ hasText: /confirmed/i });
    this.cancelledStatusBadges = page.locator('.status, .badge, .booking-status').filter({ hasText: /cancelled|canceled/i });

    // Cancel button on the first booking — observed pattern: button with visible
    // text "Cancel" or "Cancel Booking". Scoped to the first card to act on a
    // single deterministic row.
    this.firstCancelButton = this.firstBookingCard.getByRole('button', { name: /^cancel( booking)?$/i });

    // Confirmation modal — Bootstrap-style .modal[role=dialog] is the canonical
    // pattern in this demo app family. data-testid kept as a fallback.
    this.cancelConfirmModal = page.locator('.modal.show, [role="dialog"]:visible, [data-testid="cancel-confirm-modal"]').first();

    // Modal action buttons — exact button text taken from the JSON test case
    // (TC-BOOK-002 steps 4 & 5: "Close" / "Keep Booking" and "Confirm Cancel" / "Yes, Cancel").
    this.modalKeepBookingButton = this.cancelConfirmModal.getByRole('button', { name: /keep booking|close|cancel$/i });
    this.modalConfirmCancelButton = this.cancelConfirmModal.getByRole('button', { name: /confirm cancel|yes,? cancel|confirm/i });

    // Success toast / inline message after cancellation — common toastr/alert patterns
    this.cancelSuccessToast = page.locator('.toast, .alert-success, [role="status"], [data-testid="toast-success"]').filter({ hasText: /cancel/i });

    // Empty-state region — TC-BOOK-003 expects illustration + heading + subtext + CTA
    this.emptyStateContainer = page.locator('.empty-state, .no-bookings, [data-testid="empty-state"]').first();
    this.emptyStateHeading = page.getByRole('heading', { name: /no bookings yet|you haven'?t booked/i });
    this.emptyStateSubText = page.getByText(/browse upcoming events|book your first/i);
    this.emptyStateCTA = page.getByRole('button', { name: /browse events|explore events/i }).or(
      page.getByRole('link', { name: /browse events|explore events/i })
    );

    // --- Events listing locators (TC-EVT-001) ---
    // Verified against the live /events route (2026-06): the listing renders event
    // cards as <article> elements inside a CSS grid. Each card contains an image
    // area, a category badge (e.g. "Festival"), a "Featured" badge (optional), an
    // <a> wrapping an <h3> title, date/venue/price/seats rows, and a "Book Now"
    // button. There are NO `.event-card` / `.event-item` / `[data-testid="event-card"]`
    // hooks in the live DOM.
    this.eventCards = page.locator('main article');
    this.firstEventCard = this.eventCards.first();

    // Title is the <h3> inside the card's <a> link.
    this.firstEventTitle = this.firstEventCard.locator('h3').first();
    // Category is the rounded-full span in the image overlay (e.g. "Festival").
    this.firstEventCategory = this.firstEventCard.locator('span').filter({ hasText: /^(Conference|Concert|Sports|Workshop|Festival)$/ }).first();
    // "Featured" badge — only on featured events. Used as a status indicator.
    this.firstEventStatus = this.firstEventCard.locator('span', { hasText: /^Featured$/ }).first();
    // Date, venue, price, seats are text inside rows with SVG icons. Use
    // regex-based locators scoped to the card to avoid clashing with the nav/footer.
    this.firstEventDate = this.firstEventCard.locator(':text-matches("\\\\b(Mon|Tue|Wed|Thu|Fri|Sat|Sun),\\\\s?\\\\d{1,2}\\\\s+(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)\\\\b")').first();
    this.firstEventVenue = this.firstEventCard.locator(':text-matches("\\\\b(Mumbai|Bangalore|Delhi|Hyderabad|Chennai|Pune|Los Angeles|New York|London)\\\\b|, ")').first();
    this.firstEventPrice = this.firstEventCard.locator(':text-matches("\\\\$\\\\d{1,3}(,\\\\d{3})*(\\\\.\\\\d{1,2})?")').first();
    this.firstEventSeats = this.firstEventCard.locator(':text-matches("\\\\bseats?\\\\b", "i")').first();
    // City is not rendered as a separate field on the listing card; the venue line
    // is "Venue, City". Expose a city locator that picks up the city token.
    this.firstEventCity = this.firstEventCard.locator(':text-matches("\\\\b(Mumbai|Bangalore|Delhi|Hyderabad|Chennai|Pune|Los Angeles|New York|London)\\\\b")').first();

    // "Event created!" success toast — appears after submitting the Add Event form.
    // The toast is a div with class `border-emerald-200 bg-emerald-50 text-emerald-800`
    // and contains a <p> with the literal text "Event created!".
    this.eventCreatedToast = page.locator('p', { hasText: /^Event created!$/ }).locator('xpath=ancestor::div[contains(@class, "border-emerald-200")][1]');

    // --- Add New Event validation locators (TC-EVT-003) ---
    // Inline error messages per field. The form uses both .error / .invalid-feedback
    // / .field-error classes; the data-testid values are best-guess hooks derived
    // from the JSON IDs.
    this.eventTitleError = page.locator(
      '#event-title-input ~ .error, #event-title-error, [data-testid="event-title-error"], .field-error:has(+ #event-title-input)'
    );
    this.eventPriceError = page.locator(
      '#price ~ .error, #price-error, [data-testid="price-error"], .field-error:has(+ input[placeholder="0.00"])'
    );
    this.eventSeatsError = page.locator(
      '#total-seats ~ .error, #total-seats-error, [data-testid="total-seats-error"], .field-error:has(+ #total-seats)'
    );
    this.eventCategoryError = page.locator(
      '#category ~ .error, #category-error, [data-testid="category-error"]'
    );
    this.eventCityError = page.locator(
      '#city ~ .error, #city-error, [data-testid="city-error"]'
    );
    this.eventVenueError = page.locator(
      '#venue ~ .error, #venue-error, [data-testid="venue-error"]'
    );
    this.eventDateError = page.locator(
      '#event-date-&-time ~ .error, #event-date-error, [data-testid="event-date-error"]'
    );

    // Generic "any validation error visible" — used in TC-EVT-003 to assert the
    // form did not silently submit.
    this.anyEventFormError = page.locator(
      '.error:visible, .invalid-feedback:visible, .field-error:visible, [role="alert"]:visible, .text-danger:visible, .error-message:visible'
    );

    // The Add Event modal/form container — used to confirm the form is open.
    this.addEventForm = page.locator(
      '.modal:visible, [role="dialog"]:visible, form:has(#add-event-btn)'
    ).first();
  }
}