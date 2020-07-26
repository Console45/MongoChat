import React, { FC } from "react";
import { Output } from "../container/MongoChat";

interface PropTypes {
  output: Output[];
}
const ChatArea: FC<PropTypes> = ({ output }) => {
  return (
    <div className="card">
      <div id="messages" className="card-block" style={{ height: "300px" }}>
        {output.map(
          (chat) => (
            <div key={chat._id}>
              {chat.name} : {chat.message}
            </div>
          )
        )}
      </div>
    </div>
  );
};

export default ChatArea;
