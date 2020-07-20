import React, { FC } from "react";

interface PropTypes {
  output: [];
}
const ChatArea: FC<PropTypes> = ({ output }) => {
  return (
    <div className="card">
      <div id="messages" className="card-block" style={{ height: "300px" }}>
        {output.map(
          (chat: {
            name: string;
            message: string;
            _id: string;
            createdAt: string;
          }) => (
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
