"use client"
import { useEffect } from "react"
import type { SalesOrder, OrderTotals } from "@/types/pos"

interface ReceiptGeneratorProps {
  open?: boolean
  orderData?: SalesOrder | null
  totals?: OrderTotals | null
  onPrinted?: () => void
}

export function ReceiptGenerator({
  open = false,
  orderData = null,
  totals = null,
  onPrinted = () => {},
}: ReceiptGeneratorProps) {
  useEffect(() => {
    if (!open || !orderData || !totals) return

    const generateReceiptContent = () => {
      const actualSubtotal = orderData.items.reduce((sum, item) => {
        return sum + item.price * item.quantity
      }, 0)

      const actualItemDiscounts = orderData.items.reduce((sum, item) => {
        const itemTotal = item.price * item.quantity
        const itemDiscount = (item.discount || 0) / 100
        return sum + itemTotal * itemDiscount
      }, 0)

      const subtotalAfterItemDiscounts = actualSubtotal - actualItemDiscounts
      const cartDiscountAmount = orderData.discount - actualItemDiscounts
      const finalSubtotal = subtotalAfterItemDiscounts - cartDiscountAmount
      const taxAmount = finalSubtotal * 0.1
      const finalTotal = finalSubtotal + taxAmount

      return `
        <html>
        <head>
          <title>Order Receipt</title>
          <link href="https://fonts.googleapis.com/css2?family=Quantico:ital,wght@0,400;0,700;1,400;1,700&display=swap" rel="stylesheet">
          <style>
            body { 
              font-family: 'Quantico', sans-serif; 
              color: #222; 
              background: #fff; 
              margin: 0; 
              padding: 20px; 
              font-size: 12px;
              line-height: 1.6;
              font-weight: 400;
            }
            .header { text-align: center; margin-bottom: 25px; }
            .header h1 { margin: 0; font-size: 18px; font-weight: 700; }
            .section { margin-bottom: 20px; }
            .section div { margin-bottom: 4px; }
            table { width: 100%; border-collapse: collapse; margin-bottom: 20px; }
            th, td { text-align: left; padding: 4px 0; }
            th { border-bottom: 2px solid #000; font-weight: 700; }
            .total-row { font-weight: 700; border-top: 2px solid #000; }
            .right { text-align: right; }
            .center { text-align: center; }
            .footer { text-align: center; margin-top: 25px; }
            .discount { color: #16a34a; font-weight: 500; }
            .bold { font-weight: 700; }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>RestaurantPOS</h1>
            <div>123 Main Street</div>
            <div>Phone: (555) 123-4567</div>
          </div>
          
          <div class="section">
            <div><span class="bold">Order: ${orderData.orderNumber}</span></div>
            <div><span class="bold">Customer: ${orderData.customerName || "Guest"}</span></div>
            <div><span class="bold">Payment: ${orderData.paymentMethod?.charAt(0).toUpperCase() + orderData.paymentMethod?.slice(1) || "Cash"}</span></div>
            <div><span class="bold">Date: ${orderData.date}</span></div>
            <div><span class="bold">Time: ${orderData.time}</span></div>
          </div>
          
          <table>
            <thead>
              <tr>
                <th>Item</th>
                <th class="right">Qty</th>
                <th class="right">Price</th>
                <th class="right">Total</th>
              </tr>
            </thead>
            <tbody>
              ${orderData.items
                .map((item) => {
                  const itemTotal = item.price * item.quantity
                  const itemDiscountAmount = itemTotal * ((item.discount || 0) / 100)
                  const finalItemTotal = itemTotal - itemDiscountAmount

                  return `
                    <tr>
                      <td>${item.name}${item.notes ? `<br><small style="color: #666;">${item.notes}</small>` : ""}${item.discount && item.discount > 0 ? `<br><small class="discount">${item.discount}% OFF</small>` : ""}</td>
                      <td class="right">${item.quantity}</td>
                      <td class="right">$${item.price.toFixed(2)}</td>
                      <td class="right">$${finalItemTotal.toFixed(2)}</td>
                    </tr>
                  `
                })
                .join("")}
            </tbody>
            <tfoot>
              <tr>
                <td colspan="3" class="right">Subtotal:</td>
                <td class="right">$${actualSubtotal.toFixed(2)}</td>
              </tr>
              ${
                actualItemDiscounts > 0
                  ? `<tr>
                      <td colspan="3" class="right discount">Item Discounts:</td>
                      <td class="right discount">-$${actualItemDiscounts.toFixed(2)}</td>
                    </tr>`
                  : ""
              }
              ${
                cartDiscountAmount > 0
                  ? `<tr>
                      <td colspan="3" class="right discount">Cart Discount:</td>
                      <td class="right discount">-$${cartDiscountAmount.toFixed(2)}</td>
                    </tr>`
                  : ""
              }
              <tr>
                <td colspan="3" class="right">Tax (10%):</td>
                <td class="right">$${taxAmount.toFixed(2)}</td>
              </tr>
              <tr class="total-row">
                <td colspan="3" class="right"><span class="bold">TOTAL:</span></td>
                <td class="right"><span class="bold">$${finalTotal.toFixed(2)}</span></td>
              </tr>
            </tfoot>
          </table>
          
          <div class="footer">
            <div class="bold">Thank you for your order!</div>
            <div>Please come again</div>
          </div>
          
          <script>
            window.onload = function() { 
              window.print(); 
              setTimeout(() => window.close(), 1000); 
            };
          </script>
        </body>
        </html>
      `
    }

    const printWindow = window.open("", "_blank", "width=400,height=600")
    if (printWindow) {
      printWindow.document.open()
      printWindow.document.write(generateReceiptContent())
      printWindow.document.close()
    }
    onPrinted()
  }, [open, orderData, totals, onPrinted])

  return null
}
