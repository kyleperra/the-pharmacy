import "../styles/Drink.css";
import { useState } from "react";
import Rodal from "rodal";

function Drink({ drink, addToBag }) {
  const [drinkAmt, changeAmt] = useState(1);
  const [visibleRodal, toggleRodal] = useState(false);

  function showRodal() {
    toggleRodal(true);
  }

  function closeRodal() {
    toggleRodal(false);
  }

  return (
    <div>
      <img
        className="drinkImg"
        onClick={showRodal}
        src={drink.images}
        alt="hi"
      ></img>
      <Rodal visible={visibleRodal} onClose={closeRodal} className="popupStyle">
        <div>
          <h2 className="rodalName">{drink.name.toUpperCase()}</h2>
          <div className="rodalPrice">${drink.price.toFixed(2)}</div>
        </div>
        <div className="drinkDesc">"{drink.description}"</div>
        <input
          id="addCartAmt"
          className="addCartAmt"
          value={drinkAmt}
          type="number"
          min="1"
          onChange={(e) => changeAmt(e.target.value)}
        ></input>
        <button
          className="addToCart"
          onClick={(e) =>
            addToBag({ name: drink.name, price: drink.price, amount: drinkAmt })
          }
          type="submit"
        >
          Add to Bag
        </button>
      </Rodal>
    </div>
  );
}

export default Drink;
