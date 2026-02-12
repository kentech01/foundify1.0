import { initializePaddle, Paddle } from "@paddle/paddle-js";

// Paddle instance (singleton)
let paddleInstance: Paddle | null = null;

/**
 * Initialize Paddle.js SDK
 * This should be called once when the app starts
 */
export async function initPaddle(): Promise<Paddle | null> {
  if (paddleInstance) {
    return paddleInstance;
  }

  try {
    const clientToken = import.meta.env.VITE_PADDLE_CLIENT_TOKEN;
    const environment = import.meta.env.VITE_PADDLE_ENVIRONMENT || "sandbox";

    if (!clientToken) {
      console.error("Paddle client token not configured");
      return null;
    }

    // Initialize Paddle with your client-side token
    paddleInstance = await initializePaddle({
      token: clientToken,
      environment: environment as "sandbox" | "production",
      eventCallback: (event) => {
        // Handle Paddle events (optional)
        console.log("Paddle event:", event);
      },
    });

    console.log("✅ Paddle initialized successfully");
    return paddleInstance;
  } catch (error) {
    console.error("Error initializing Paddle:", error);
    return null;
  }
}

/**
 * Get the current Paddle instance
 */
export function getPaddleInstance(): Paddle | null {
  return paddleInstance;
}

/**
 * Open Paddle checkout overlay
 * @param transactionId - The transaction ID returned from backend
 */
export async function openPaddleCheckout(transactionId: string): Promise<void> {
  const paddle = paddleInstance || (await initPaddle());

  if (!paddle) {
    throw new Error("Paddle not initialized");
  }

  try {
    // Open checkout overlay
    paddle.Checkout.open({
      transactionId: transactionId,
      settings: {
        displayMode: "overlay",
        theme: "light",
        locale: "en",
        allowLogout: false,
        // After successful payment, redirect back into the app dashboard
        successUrl: "https://www.foundify.app/dashboard/pitches",
      },
    });
  } catch (error) {
    console.error("Error opening Paddle checkout:", error);
    throw error;
  }
}

/**
 * Open Paddle checkout with price items (alternative method)
 * This can be used to directly open checkout without creating a transaction first
 * @param priceId - The Paddle price ID
 * @param quantity - Quantity to purchase (default: 1)
 * @param customData - Custom data to pass to Paddle
 */
export async function openPaddleCheckoutWithPrice(
  priceId: string,
  quantity: number = 1,
  customData?: Record<string, any>
): Promise<void> {
  const paddle = paddleInstance || (await initPaddle());

  if (!paddle) {
    throw new Error("Paddle not initialized");
  }

  try {
    // Open checkout overlay with price
    paddle.Checkout.open({
      items: [
        {
          priceId: priceId,
          quantity: quantity,
        },
      ],
      customData: customData,
      settings: {
        displayMode: "overlay",
        theme: "light",
        locale: "en",
        allowLogout: false,
      },
    });
  } catch (error) {
    console.error("Error opening Paddle checkout:", error);
    throw error;
  }
}

/**
 * Update Paddle checkout items
 * This can be used to update the items in an open checkout
 */
export async function updatePaddleCheckout(
  items: Array<{ priceId: string; quantity: number }>
): Promise<void> {
  const paddle = paddleInstance;

  if (!paddle) {
    throw new Error("Paddle not initialized");
  }

  try {
    paddle.Checkout.updateItems(items);
  } catch (error) {
    console.error("Error updating Paddle checkout:", error);
    throw error;
  }
}

/**
 * Close the Paddle checkout overlay
 */
export function closePaddleCheckout(): void {
  const paddle = paddleInstance;

  if (paddle) {
    paddle.Checkout.close();
  }
}

/**
 * Get customer information from Paddle
 * This can be used to get the customer's email, country, etc.
 */
export async function getPaddleCustomer(): Promise<any> {
  const paddle = paddleInstance;

  if (!paddle) {
    throw new Error("Paddle not initialized");
  }

  try {
    // Note: This is a placeholder - actual implementation depends on Paddle API
    // You might need to use the Paddle API directly via backend
    return null;
  } catch (error) {
    console.error("Error getting Paddle customer:", error);
    throw error;
  }
}

// Export types for TypeScript
export type { Paddle };
