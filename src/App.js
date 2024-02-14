import { useState, useEffect } from "react";

// `https://api.frankfurter.app/latest?amount=100&from=EUR&to=USD`

function Result({ result }) {
  return <p>{result}</p>;
}

export default function App() {
  const [amount, setAmount] = useState("");
  const [fromCurrency, setCurrencyFrom] = useState("EUR");
  const [toCurrency, setCurrencyTo] = useState("USD");
  const [result, setResult] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  function handleAmountChange(value) {
    setAmount(value);
  }

  function handleFromCurrencyChange(value) {
    setCurrencyFrom(value);
  }

  function handleToCurrencyChange(value) {
    setCurrencyTo(value);
  }

  useEffect(
    function () {
      const controller = new AbortController();
      async function fetchData() {
        setIsLoading(true);
        try {
          const res = await fetch(
            `https://api.frankfurter.app/latest?amount=${amount}&from=${fromCurrency}&to=${toCurrency}`,
            { signal: controller.signal }
          );

          if (!res.ok) throw new Error("Error occured fetching data.");
          const data = await res.json();
          setResult(data.rates[toCurrency]);
          setIsLoading(false);
        } catch {
          console.error("Error occured fetching data.");
        } finally {
          console.log("Clean up");
        }
      }
      if (fromCurrency == toCurrency) {
        setResult(amount);
        setIsLoading(false);
        return;
      }
      fetchData();
      return () => controller.abort();
    },
    [fromCurrency, toCurrency, amount]
  );

  return (
    <div>
      <input
        value={amount}
        type="text"
        onChange={(e) => handleAmountChange(Number(e.target.value))}
        disabled={isLoading}
      />
      <select
        value={fromCurrency}
        onChange={(e) => handleFromCurrencyChange(e.target.value)}
        disabled={isLoading}
      >
        <option value="USD">USD</option>
        <option value="EUR">EUR</option>
        <option value="CAD">CAD</option>
        <option value="INR">INR</option>
      </select>
      <select
        value={toCurrency}
        onChange={(e) => handleToCurrencyChange(e.target.value)}
        disabled={isLoading}
      >
        <option value="USD">USD</option>
        <option value="EUR">EUR</option>
        <option value="CAD">CAD</option>
        <option value="INR">INR</option>
      </select>
      <Result result={result} />
    </div>
  );
}
