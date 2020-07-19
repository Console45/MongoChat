import React, { FC } from "react";
import Aux from "../hoc/Auxilliary";

interface Proptypes {
  clear: () => void;
}

const Header: FC<Proptypes> = ({ clear }) => {
  return (
    <Aux>
      <h1 className="text-center display-4">
        Mongo Chat
        <button className="btn btn-danger ml-4" onClick={clear}>
          Clear
        </button>
      </h1>
    </Aux>
  );
};

export default Header;
