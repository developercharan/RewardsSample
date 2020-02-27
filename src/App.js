import React from 'react';
import './App.css';
import transactionsData from './data/transactions.json';
import customersData from './data/customers.json';

var customerInfo = [];
organizeData();
function organizeData() {
  let customersList = [...new Set(transactionsData.map(x => x.userId))];  
  for (let index = 0; index < customersList.length; index++) {
    let customerData = transactionsData.filter(x => x.userId === customersList[index]);
    let customerName = customersData[customersList[index]];
    let currentMonthPts = currentMonthData(customerData, 0)
      .map(x => calculateRewards(x.transactionAmount)).reduce((prev, curr) => prev + curr, 0);
    let previousMonthPts = currentMonthData(customerData, 1)
      .map(x => calculateRewards(x.transactionAmount)).reduce((prev, curr) => prev + curr, 0);
    let earlierMonthPts = currentMonthData(customerData, 2)
      .map(x => calculateRewards(x.transactionAmount)).reduce((prev, curr) => prev + curr, 0);       
    customerInfo.push(
      {
        "CustomerName": customerName,
        "CurrentMonth": currentMonthPts,
        "PreviousMonth": previousMonthPts,
        "EarlierMonth": earlierMonthPts,
      })
  }

}

function currentMonthData(customerData, forMonth) {
  var date = new Date();
  var month = date.getMonth() - forMonth;
  var firstDay = new Date(date.getFullYear(), month, 1);
  var lastDay = new Date(date.getFullYear(), month + 1, 0);
  return customerData.filter(function (product) {
    var date = new Date(product.transactionDate);
    return (date >= firstDay && date <= lastDay);
  });
}


class App extends React.Component {
  render() {
    return (
      <div>
        <div>
          <Header />
          <table className="tblRewards">
            <TableHeader />
            <tbody>
              {
                customerInfo.map((customer, i) => <TableRow key={i}
                  data={customer} />)
              }
            </tbody>
          </table>
        </div>
      </div>
    );
  }
}

class Header extends React.Component {
  render() {
    return (
      <div className="header">
        <h1>Rewards Info</h1>
      </div>
    );
  }
}

class TableHeader extends React.Component {
  render() {
    return (
      <thead>
        <tr>
          <th>Customer Name</th>          
          <th>Current Month Points</th>
          <th>Previous Month Points</th>
          <th>Earlier Month Points</th>
          <th>Total 3 Month Points</th>
        </tr>
      </thead>
    );
  }
}
class TableRow extends React.Component {
  render() {
    console.log(this.props.data);
    return (
      <tr>
        <td>{this.props.data.CustomerName}</td>
        <td>{this.props.data.CurrentMonth}</td>
        <td>{this.props.data.PreviousMonth}</td>
        <td>{this.props.data.EarlierMonth}</td>
        <td>{this.props.data.CurrentMonth + this.props.data.PreviousMonth + this.props.data.EarlierMonth}</td>        
      </tr>
    );
  }
}

function calculateRewards(transactionAmount) {
  let points = 0;
  if (transactionAmount > 100) {
    points = (transactionAmount - 100) * 2; //
    points = points + 50;
  }
  else if (transactionAmount > 50 && transactionAmount <= 100) {
    points = (transactionAmount - 50);
  }
  return points;
}

export default App;
