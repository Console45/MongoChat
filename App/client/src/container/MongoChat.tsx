import React, { ChangeEvent, Component, Fragment, KeyboardEvent } from "react";
import Header from "../components/Header";
import socketIoClient from "socket.io-client";
import Aux from "../hoc/Auxilliary";
import ChatArea from "../components/ChatArea";
import ChatInput from "../components/ChatInput";
import NameInput from "../components/NameInput";

interface Chat {
  name: string;
  message: string;
}
interface State {
  status: string;
  chat: Chat;
  output: Array<String>;
}
interface Status {
  message: string;
  clear: boolean;
}

const socket: SocketIOClient.Socket = socketIoClient("http://localhost:4000");

class MongoChat extends Component<{}, State> {
  state = {
    status: "",
    chat: {
      name: "",
      message: "",
    },
    output: [],
  };

  componentDidMount(): void {
    socket.on("status", (status: string | Status): void => {
      this.setState((): { status: string } => ({
        status: typeof status === "object" ? status.message : status,
      }));
      if ((status as Status).clear)
        this.setState((): { chat: Chat } => ({
          chat: {
            name: this.state.chat.name,
            message: "",
          },
        }));
      setTimeout((): void => {
        this.setState((): { status: string } => ({
          status: "",
        }));
      }, 4000);
    });
    socket.on("cleared", (): void => {
      this.setState((): { output: [] } => ({
        output: [],
      }));
    });
    socket.on("output", (chatData: []): void => {
      for (let chat of chatData) {
        this.setState((): { output: string[] } => ({
          output: (this.state.output as []).concat(chat),
        }));
      }
    });
  }

  handleClear: () => void = () => {
    socket.emit("clear");
  };

  handleSend: (event: KeyboardEvent<HTMLTextAreaElement>) => void = (event) => {
    if (event.key === "Enter" && event.shiftKey === false) {
      socket.emit("input", this.state.chat);
      event.preventDefault();
    }
  };

  handleNameChange: (event: ChangeEvent<HTMLInputElement>) => void = (
    event
  ) => {
    const name = event.target.value;
    this.setState((): { chat: Chat } => ({
      chat: {
        name,
        message: this.state.chat.message,
      },
    }));
  };

  handleMessageChange: (event: ChangeEvent<HTMLTextAreaElement>) => void = (
    event
  ) => {
    const message = event.target.value;
    this.setState((): { chat: Chat } => ({
      chat: {
        name: this.state.chat.name,
        message,
      },
    }));
  };

  sortOutputState: (output: []) => [] = (output) => {
    return output.sort((a: { createdAt: string }, b: { createdAt: string }) => {
      return a.createdAt > b.createdAt ? -1 : 1;
    });
  };

  render() {
    return (
      <div className="container">
        <div className="row">
          <div className="col-md-6 offset-md-3 col-sm-12">
            <Header clear={this.handleClear} />
            <div className="mb-3" style={{ height: "20px" }}>
              {this.state.status && <p>{this.state.status}</p>}
            </div>
            <Aux>
              <Fragment>
                <NameInput change={this.handleNameChange} />
                <ChatArea
                  output={this.sortOutputState(this.state.output as [])}
                />
                <ChatInput
                  send={this.handleSend}
                  change={this.handleMessageChange}
                  message={this.state.chat.message}
                />
              </Fragment>
            </Aux>
          </div>
        </div>
      </div>
    );
  }
}

export default MongoChat;
