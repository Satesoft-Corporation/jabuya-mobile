import { extractTime, formatDate, formatNumberWithCommas } from "./Utils";
import * as Print from "expo-print";

const SALE_HTML = `
<!DOCTYPE html>
<html lang="en">
<head>
    <style>
        body {
            margin: 0;
            padding: 0;
            font-family: 'PT Sans', sans-serif;
        }
        html, body { height: auto; }
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
            text-align: center;
            vertical-align: middle;
            margin-bottom:0;
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
            border-top:1px solid black;
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
            border-top:1px dashed black !important;
            border-bottom:1px dashed black !important;
        }
        .total.text, .total.price {
            text-align: right;
        }
        .total.price::before {
        }
        .line {
            border-top:1px solid black !important;
        }
        .heading.rate {
            width: 20%;
        }
        .heading.amount {
            width: 25%;
        }
        .heading.qty {
            width: 5%
        }
        p {
            padding: 1px;
            margin: 0;
        }
        section, footer {
            font-size: 12px;
        }
    </style>
</head>

<body class="print">
  
    <h3>{shopName} </h3>
    <p class="headings">
    Location: {shopAddress}
    </p>
    <p class="headings">
     Contact : {shopPhoneNumber}
    </p>
  
    <table class="bill-details">
        <tbody>
           
            <tr>
                <td>Date : <span>{dateCreated}</span></td>
                <td>Time : <span>{timeCreated}</span></td>
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
          {productsRow}
          
            <tr>
                <td colspan="3" class="sum-up line">Subtotal</td>
                <td class="line price">{cur} {subTotal}</td>
            </tr>
            <tr>
                <td colspan="3" class="sum-up">VAT</td>
                <td class="price">{cur} 0.00</td>
            </tr>
           
            <tr>
                <th colspan="3" class="total text">Total</th>
                <th class="total price">{cur} {total}</th>
            </tr>
        </tbody>
    </table>
    <section>
        <p>
            Paid by : <span>CASH</span>
        </p>
        <p>
        Served by : <span>{createdBy}</span>
    </p>

    <p>Reciept SN : {serialNumber}</p>
    <p></p>
        <p style="text-align:center">
            Thank you for your purchase!
        </p>
    </section>
    <footer style="text-align:center">
        <p>Powered by Duquat</p>
        <p>www.duquat.com</p>
    </footer>
</body>

</html>`;

const SALE_TABLE_DATA = `  <tr>
<td>{productName}</td>
<td>{quantity}</td>
<td class="price">{cur} {unitCost}</td>
<td class="price">{cur} {totalCost}</td>
</tr>`;

const salePrintoutTemplate = async (data) => {
  try {
    let template = SALE_HTML;
    template = template.replace("{shopName}", data.shopName);
    template = template.replace("{serialNumber}", data.serialNumber);
    template = template.replace("{shopPhoneNumber}", data.shopPhoneNumber);
    template = template.replace("{shopAddress}", data.shopAddress);
    template = template.replace("{createdBy}", data.createdByFullName);
    template = template.replace(
      "{subTotal}",
      formatNumberWithCommas(data.totalCost)
    );
    template = template.replace(
      "{total}",
      formatNumberWithCommas(data.totalCost)
    );
    template = template.replace(
      "{dateCreated}",
      formatDate(data.dateCreated, true)
    );
    template = template.replace("{timeCreated}", extractTime(data.dateCreated));
    template = template.replace("{balanceGivenOut}", data.balanceGivenOut);
    template = template.replace("{cur}", data.currency);
    template = template.replace("{cur}", data.currency);
    template = template.replace("{cur}", data.currency);

    let productsRow = "";
    data.lineItems.map((item) => {
      let itemTemplate = SALE_TABLE_DATA;
      itemTemplate = itemTemplate.replace(
        "{productName}",
        item.shopProductName
      );
      itemTemplate = itemTemplate.replace("{quantity}", item.quantity);
      itemTemplate = itemTemplate.replace(
        "{unitCost}",
        formatNumberWithCommas(item.unitCost)
      );
      itemTemplate = itemTemplate.replace(
        "{totalCost}",
        formatNumberWithCommas(item.totalCost)
      );
      itemTemplate = itemTemplate.replace("{cur}", data.currency);
      itemTemplate = itemTemplate.replace("{cur}", data.currency);

      productsRow = productsRow + "" + itemTemplate;
    });
    template = template.replace("{productsRow}", productsRow);
    return template;
  } catch (e) {
    console.error(e);
  }
};

export const printSale = async (data) => {
  const printData = await salePrintoutTemplate(data);
  console.log("printing");
  await Print.printAsync({ html: printData });
};
