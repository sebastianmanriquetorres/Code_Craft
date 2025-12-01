
import { loadStripe } from '@stripe/stripe-js';

// This is a public test key provided by Stripe documentation for testing purposes.
// In a real application, this would be an environment variable.
export const stripePromise = loadStripe('pk_test_51O5QyKIE2e8X9k8Y6x7yZ0a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0u');
