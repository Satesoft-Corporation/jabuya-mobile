import { extractTime, formatDate, formatNumberWithCommas } from "./Utils";
import * as Print from "expo-print";

export const salePrintoutTemplate = async (data) => {
  try {
    const {
      shopName,
      serialNumber,
      shopPhoneNumber,
      shopAddress,
      createdByFullName,
      totalCost,
      dateCreated,
      balanceGivenOut,
      debtBalance,
      clientPhoneNumber,
      clientName,
      lineItems,
      attendantDailyReceiptCount,
      amountPaid,
    } = data;

    const formattedLineItems = lineItems
      ?.map((item) => {
        const { shopProductName, saleUnitName } = item;

        let unitName = saleUnitName ? " - " + saleUnitName : "";

        return ` <tr>
          ${
            item?.status === "CANCELLED"
              ? `<td><s>${shopProductName + unitName} </s></td>
          <td><s>${item.quantity || 0}</s></td>
          <td class="price"><s>${formatNumberWithCommas(item.unitCost || 0)}</s></td>
          <td class="price"><s>${formatNumberWithCommas(item.totalCost || 0)}</s></td>`
              : `<td>${shopProductName + unitName}</td>
          <td>${item.quantity || 0}</td>
          <td class="price">${formatNumberWithCommas(item.unitCost || 0)}</td>
          <td class="price">${formatNumberWithCommas(item.totalCost || 0)}</td>`
          }
        </tr>
      `;
      })
      .join("");

    return `<!DOCTYPE html>
<html lang="en">
  <head>
   <style>
      body {
        margin: 0;
        padding: 0;
        font-family: "PT Sans", sans-serif;
      }

      html,
      body {
        height: auto;
      }

      @page {
        size: 2.8in 11in;
        margin-top: 0cm;
        margin-left: 0cm;
        margin-right: 0cm;
      }
      table {
        width: 100%;
      }

      tr {
        width: 100%;
      }

      h1 {
        text-align: center;
        vertical-align: middle;
      }

      h3 {
        text-align: left;
        vertical-align: middle;
        margin-bottom: 0;
      }

      #logo {
        width: 60%;
        text-align: center;
        -webkit-align-content: center;
        align-content: center;
        padding: 5px;
        margin: 2px;
        display: block;
        margin: 0 auto;
      }

      header {
        width: 100%;
        text-align: center;
        -webkit-align-content: center;
        align-content: center;
        vertical-align: middle;
      }

      .headings {
        text-align: center;
        vertical-align: middle;
      }

      .items thead {
        text-align: center;
      }

      .center-align {
        text-align: center;
      }

      .bill-details td {
        font-size: 12px;
      }

      .receipt {
        font-size: medium;
      }

      .items .heading {
        font-size: 12.5px;
        text-transform: uppercase;
        border-top: 1px solid black;
        margin-bottom: 4px;
        border-bottom: 1px solid black;
        vertical-align: middle;
      }

      .items thead tr th:first-child,
      .items tbody tr td:first-child {
        width: 47%;
        min-width: 47%;
        max-width: 47%;
        word-break: break-all;
        text-align: left;
      }

      .items td {
        font-size: 12px;
        text-align: right;
        vertical-align: bottom;
      }

      .price::before {
        font-family: Arial;
        text-align: right;
      }

      .sum-up {
        text-align: right !important;
      }

      .total {
        font-size: 13px;
        border-bottom: 1px dashed black !important;
      }

      .total-line {
        font-size: 13px;
        text-align: end;
      }

      .line-dashed {
        border-top: 1px dashed black !important;
      }

      .total.text,
      .total.price {
        text-align: right;
      }

      .line {
        border-top: 1px solid black !important;
      }

      .heading.rate {
        width: 20%;
      }

      .heading.amount {
        width: 25%;
      }

      .heading.qty {
        width: 5%;
      }

      p {
        padding: 1px;
        margin: 0;
      }

      section,
      footer {
        font-size: 12px;
      }

      .count {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 20px;
      }

      .noMargin {
        margin: 0;
      }

      .counter {
        border: 1px solid black;
        padding: 5px;
        justify-content: center;
        align-items: center;
        align-self: center;
      }
    </style>
  </head>
  <body>
    <div class="count">
      <div>
        <h3>${shopName}</h3>
        <p>Location: ${shopAddress}</p>
        <p>Contact: ${shopPhoneNumber}</p>
      </div>
      ${
        attendantDailyReceiptCount
          ? `<div class="counter">
              <h2 class="noMargin">${attendantDailyReceiptCount}</h2>
            </div>`
          : ""
      }
    </div>

    <table class="bill-details">
      <tbody>
        <tr>
          <td>Date: <span>${formatDate(dateCreated, true)}</span></td>
          <td class=' text-right'>Time: <span>${extractTime(dateCreated)}</span></td>
        </tr>
      </tbody>
    </table>

    <table class="items">
      <thead>
        <tr>
          <th class="heading name">Item</th>
          <th class="heading qty">Qty</th>
          <th class="heading rate">Rate</th>
          <th class="heading amount">Amount</th>
        </tr>
      </thead>
      <tbody>
        ${formattedLineItems}
        <tr>
          <td colspan="3" class="sum-up line-dashed">Subtotal</td>
          <td class="price line-dashed">${formatNumberWithCommas(totalCost)}</td>
        </tr>
        <tr>
          <td colspan="3" class="sum-up">VAT</td>
          <td class="price">0.00</td>
        </tr>
        <tr>
          <th colspan="3" class="total text">Total</th>
          <th class="total price">${formatNumberWithCommas(totalCost)}</th>
        </tr>
        <tr>
          <th colspan="3" class="sum-up total-line font-light">Paid Amount</th>
          <th class="total-line price">${formatNumberWithCommas(amountPaid)}</th>
        </tr>
        <tr>
          <th colspan="3" class="sum-up total-line font-light">Balance</th>
          <th class="total-line price">${formatNumberWithCommas(balanceGivenOut)}</th>
        </tr>
        <tr>
          <th colspan="3" class="sum-up total-line font-light">Outstanding</th>
          <th class="total-line price">${formatNumberWithCommas(debtBalance)}</th>
        </tr>
      </tbody>
    </table>

     <section>
      <p class="flex justify-content-between">Txn type : <span>${balanceGivenOut < 0 ? "DEBT" : "CASH"}</span></p>
      <p class="flex justify-content-between">Served by : <span>${createdByFullName}</span></p>

      ${clientName ? `<p class="flex justify-content-between">Client name : <span>${clientName}</span></p>  ` : ""} 
       ${clientPhoneNumber ? ` <p class="flex justify-content-between">Client number : <span>${clientPhoneNumber}</span></p> ` : ""} 
       ${debtBalance ? ` <p class="flex justify-content-between>OutStanding balance : <span>${formatNumberWithCommas(debtBalance)}</span></p> ` : ""}

      <p class="flex justify-content-between">Reciept SN : <span>${serialNumber}</span></p>
      <p></p>
      <p style="text-align: center">Thank you for your purchase!</p>
    </section>
    <footer style="text-align: center">
      <p>Powered by Satesoft</p>
      <p>www.duqact.com</p>
    </footer>
  </body>
  </body>
</html>`;
  } catch (error) {
    console.error("Error generating template:", error);
    return `<html><body><h1>Error generating receipt</h1></body></html>`;
  }
};
export const printSale = async (data) => {
  const printData = await salePrintoutTemplate(data);
  console.log("printing");
  await Print.printAsync({ html: printData });
};
