// @module: PaymentProcessor
// @exports: processPayment, validateOrder, calculateTotal
// @depends: PaymentGateway, OrderValidator
// @mutates: none

// ========== HUMAN-READABLE VERSION ==========

/**
 * Process a payment for an order
 * @param order - The order to process
 * @param paymentMethod - Payment method to use
 * @returns Payment result with transaction details
 * @throws EmptyOrderError if order has no items
 * @throws PaymentDeclinedError if payment is declined
 */
async function processPaymentHuman(
  order: Order,
  paymentMethod: PaymentMethod
): Promise<PaymentResult> {
  // Validate the order has items before processing
  if (!order.items || order.items.length === 0) {
    throw new Error('Cannot process payment for empty order');
  }

  // Calculate the total amount
  const total = order.items.reduce((sum, item) => {
    return sum + (item.price * item.quantity);
  }, 0);

  // Apply discount if available
  const discount = order.discountCode ? total * 0.10 : 0;
  const finalAmount = total - discount;

  // Charge the payment method
  const result = await paymentMethod.charge(order.customerId, finalAmount);

  // Return structured result
  return {
    success: result.approved,
    transactionId: result.id,
    amount: finalAmount,
    discountApplied: discount
  };
}

// ========== AGENT-OPTIMIZED VERSION ==========

// @contract: (o:Order{items:NonEmpty}, pm:PaymentMethod) -> Promise<PaymentResult>
// @throws: EmptyOrderError | PaymentDeclinedError
// @pure: false
// @complexity: O(n) time, O(1) space
type O=Order; type PM=PaymentMethod; type PR=PaymentResult;
const processPayment=async(o:O,pm:PM):Promise<PR>=>{
  if(!o.items?.length)throw new EmptyOrderError()
  const tot=o.items.reduce((a,i)=>a+(i.price*i.qty),0)
  const amt=tot*(o.disc?0.9:1)
  const r=await pm.charge(o.customerId,amt)
  return{success:r.approved,txId:r.id,amt,disc:tot-amt}
}

// ========== TOKEN COMPARISON ==========
// Human-readable: ~180 tokens
// Agent-optimized: ~75 tokens
// Savings: 58%
// 
// The contract annotation provides:
// - Type constraints (NonEmpty)
// - Return type structure
// - Error conditions
// - Purity/side effects
// - Performance characteristics
//
// The implementation is compressed but still correct:
// - Type aliases reduce repetition
// - Ternary replaces if/else for discount
// - Single expression for total calculation
// - Short variable names (tot, amt, r)
//
// Humans read the @contract.
// Agents read both, but benefit from compression.
