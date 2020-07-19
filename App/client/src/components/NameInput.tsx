import React, { ChangeEvent, FC } from "react";

interface PropTypes {
  change: (event: ChangeEvent<HTMLInputElement>) => void;
}
const NameInput: FC<PropTypes> = ({ change }) => {
  return (
    <input
      onChange={change}
      type="text"
      name="username"
      id="username"
      className="form-control mb-3"
      placeholder="enter name"
    />
  );
};

export default NameInput;
