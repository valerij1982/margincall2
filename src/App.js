import { useMemo, useState } from "react";
import "./styles.css";

const DEFAULT_DEPOSIT = 10000;
const DEFAULT_ENTRY_PRICE = 55000;
const DEFAULT_STOP_LOSS_DOLLAR = 50000;
const DEFAULT_RISK_DOLLAR = 200;
const DEFAULT_RISK_RADIO = "DOLLAR"
export default function App() {
  const [deposit, setDeposit] = useState(DEFAULT_DEPOSIT)
  const [entryPrice, setEntryPrice] = useState(DEFAULT_ENTRY_PRICE);
  const [stopLossDollar, setStopLossDollar] = useState(DEFAULT_STOP_LOSS_DOLLAR);
  const [stopLossPercent, setStopLossPercent] =
      useState(butify(DEFAULT_ENTRY_PRICE-DEFAULT_STOP_LOSS_DOLLAR) / DEFAULT_ENTRY_PRICE * 100);
  const [riskRadio, setRiskRadio] = useState(DEFAULT_RISK_RADIO);
  const [riskPercent, setRiskPercent] = useState(butify(DEFAULT_RISK_DOLLAR / DEFAULT_DEPOSIT * 100));
  const [riskDollar, setRiskDollar] = useState(DEFAULT_RISK_DOLLAR);

  function onDepositChange(event) {
    const value = event.target.value;
    setDeposit(butify(value));
    setRiskPercent(butify(riskDollar/value*100))

  }

  function onEntryPriceChange(event) {
    const value = event.target.value;
    setEntryPrice(butify(value));
    setStopLossPercent(butify((value-stopLossDollar)/value*100))
  }

  function onStopLossDollarChange(event) {
    const value = event.target.value;
    setStopLossDollar(butify(value));
    setStopLossPercent(butify((entryPrice-value)/entryPrice*100));
  }

  function onStopLossPercentChange(event) {
    const value = event.target.value;
    setStopLossPercent(butify(value));
  }

  function onRiskDollarChange(event) {
    const value = event.target.value;
    setRiskRadio("DOLLAR");
    setRiskDollar(value);
    setRiskPercent(butify(value/deposit*100))
  }

  function butify(float) {
    if (isNumber(float)) {
      return parseFloat(parseFloat(float).toFixed(2));
    }

  }
  function isNumber(n) { return !isNaN(parseFloat(n)) && !isNaN(n - 0) }

  function onRiskPercentChange(event) {
    const value = event.target.value;
    setRiskRadio( "PERCENT");
    // if(!isNumber(value)) return
    setRiskPercent(butify(value));
    setRiskDollar(butify(deposit * value * 0.01));
  }

  const onOptionChange = e => {
    setRiskRadio(e.target.value)
  }

  const output = useMemo(() => {
    console.log("riskDollar "  + riskDollar)
    console.log("stopLossPercent " + stopLossPercent)
    console.log("entryPrice " + entryPrice)
    console.log(riskDollar / stopLossPercent * 100)
    const volume = (riskDollar / stopLossPercent * 100)
    return "Volume: " +  butify(volume)
        + " Leverage: x" + butify(volume / riskDollar);

  }, [riskPercent, riskDollar, entryPrice, deposit, stopLossPercent, stopLossDollar]);

  return (
      <main>
        <div className="container">
          <h1>Margin call calculator</h1>
          <div className="input-section">
            <p className="">Deposit, $</p>
            <input
                onChange={onDepositChange}
                type="number"
                value={deposit}
            />
            <br/>
            <div>
              <div>
                <input
                    type="radio"
                    name="riskRadio"
                    value="DOLLAR"
                    id="riskRadioDollar"
                    checked={riskRadio === "DOLLAR"}
                    onChange={onOptionChange}
                />
                <label className="slider-output" htmlFor="riskRadioDollar">Risk, $</label>
              </div>
              <input
                  className=""
                  onChange={onRiskDollarChange}
                  type="number"
                  value={riskDollar}
              />

            </div>
            <br/>
            <div>
              <input
                  type="radio"
                  name="riskRadio"
                  value="PERCENT"
                  id="riskRadioPercent"
                  checked={riskRadio === "PERCENT"}
                  onChange={onOptionChange}
              />

              <label htmlFor="riskRadioPercent">Risk in % of deposit</label>
              <br/>
              <input
                  className="input-slider"
                  onChange={onRiskPercentChange}
                  type="number"
                  value={riskPercent}
              />
            </div>


            <p className="slider-output">Entry price, $</p>
            <input
                className="input-slider"
                onChange={onEntryPriceChange}
                type="number"
                value={entryPrice}
            />
            <p className="slider-output">SL price, $</p>
            <input
                className="input-slider"
                onChange={onStopLossDollarChange}
                type="number"
                value={stopLossDollar}
            />
            <p className="slider-output">SL, %</p>
            <input
                className="input-slider"
                onChange={onStopLossPercentChange}
                type=""
                value={stopLossPercent}
            />
          </div>
          <div className="output-section">
            <h2>Output:</h2>
            <p className="output">{output}</p>
            {/*<p>Volume/Объём:</p>*/}
            {/*<p className="output">{volume}</p>*/}
            {/*<p>Worth/Стоимость:</p>*/}
            {/*<p className="output">{cost}</p>*/}
            {/*<p>Leverage/Плечо:</p>*/}
            {/*<p className="output">x{leverage}</p>*/}

          </div>
        </div>
      </main>
  )
      ;
}
