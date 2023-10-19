export default function displayLoanDetails(values: any[]) {
  let [name, email, phone_number, reason, amount, uniqueToken, date] = values;
  const loanDetailsTemplate = /* html */ `
    <!DOCTYPE html>
    <html>
      <head>
        <title>Loan Details</title>
      </head>
      <body>
        <h1>Loan Details of ${name} </h1>
        <ul>
          <li>Name: ${name}</li>
          <li>Email: ${email}</li>
          <li>Phone Number: ${phone_number}</li>
          <li>Reason: ${reason}</li>
          <li>Amount: ${amount}</li>
          <li>Unique Token: ${uniqueToken}</li>
          <li>You borrowed at time: ${date}</li>
        </ul>
        <button>
          <a href="/">
          Go back
          </a>
        </button>
      </body>
    </html>
  `;
  return loanDetailsTemplate;
}
