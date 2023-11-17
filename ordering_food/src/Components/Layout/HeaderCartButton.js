import { useContext, useEffect, useState } from "react";
import CartIcon from "../Cart/CartIcon";
import classes from "./HeaderCartButton.module.css";
import CartContext from "../../store/cart-context";

const HeaderCartButton = (props) => {
const [btnIsHighlighted, setBtnIsHighlited] = useState(false);
const cartCtx = useContext(CartContext);
const { items } = cartCtx;

const numberOfCartItems = items.reduce((curtNumber, item) => {
  return curtNumber + item.amount;
}, 0)

  
  useEffect(() => {
    if (items.length === 0 ){return;}
    setBtnIsHighlited(true);

    const timer = setTimeout(() => {
      setBtnIsHighlited(false);
    }, 300);

    return () => {
      clearTimeout(timer);
    }

  }, [items])

  const btnClasses = `${classes.button} ${btnIsHighlighted ? classes.bump: ''}`
  return (
    <button className={btnClasses} onClick={props.onClick}>
      <span className={classes.icon}>
        <CartIcon />
      </span>
      <span>Your Cart</span>
      <span className={classes.badge}>{numberOfCartItems}</span>
    </button>
  );
};

export default HeaderCartButton;