import "./Home.css";

function Home() {
  return (
    <div className="home">

      <div className="dashboard-header">
        <div>
          <h1>Expense Dashboard</h1>
          <p>Track and manage your finances efficiently.</p>
        </div>

        <button className="add-btn">
          + Add Expense
        </button>
      </div>

      <div className="stats-grid">

        <div className="card">
          <h4>Total Balance</h4>
          <h2>₹75,000</h2>
        </div>

        <div className="card">
          <h4>Total Income</h4>
          <h2>₹1,20,000</h2>
        </div>

        <div className="card">
          <h4>Total Expenses</h4>
          <h2>₹45,000</h2>
        </div>

        <div className="card">
          <h4>Savings</h4>
          <h2>₹30,000</h2>
        </div>

      </div>

      <div className="dashboard-content">

        <div className="transactions">
          <h3>Recent Transactions</h3>

          <table>
            <thead>
              <tr>
                <th>Title</th>
                <th>Category</th>
                <th>Amount</th>
              </tr>
            </thead>

            <tbody>
              <tr>
                <td>Groceries</td>
                <td>Food</td>
                <td>₹2,500</td>
              </tr>

              <tr>
                <td>Movie</td>
                <td>Entertainment</td>
                <td>₹800</td>
              </tr>

              <tr>
                <td>Fuel</td>
                <td>Transport</td>
                <td>₹1,500</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="categories">
          <h3>Top Categories</h3>

          <div className="category-item">
            <span>🍔 Food</span>
            <span>₹12,000</span>
          </div>

          <div className="category-item">
            <span>🚗 Transport</span>
            <span>₹8,000</span>
          </div>

          <div className="category-item">
            <span>🎬 Entertainment</span>
            <span>₹5,000</span>
          </div>

          <div className="category-item">
            <span>🛒 Shopping</span>
            <span>₹7,000</span>
          </div>

        </div>

      </div>

    </div>
  );
}

export default Home;