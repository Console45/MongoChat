import React, { ChangeEvent, Component, Fragment, KeyboardEvent } from 'react';
import Header from '../components/Header';
import socketIoClient from 'socket.io-client';
import Aux from '../hoc/Auxilliary';
import ChatArea from '../components/ChatArea';
import ChatInput from '../components/ChatInput';
import NameInput from '../components/NameInput';

interface Chat {
	name: string;
	message: string;
}
export interface Output {
	__v: number;
	name: string;
	_id: string;
	createdAt: string;
	message: string;
}
interface State {
	status: string;
	chat: Chat;
	output: Array<Output>;
}
interface Status {
	message: string;
	clear: boolean;
}

const socket: SocketIOClient.Socket = socketIoClient('http://localhost:4000');

class MongoChat extends Component<{}, State> {
	state = {
		status: '',
		chat: {
			name: '',
			message: ''
		},
		output: [
			{
				name: '',
				message: '',
				createdAt: '',
				_id: '',
				__v: 0
			}
		]
	};
	componentDidMount(): void {
		socket.on('status', (status: string | Status): void => {
			this.setState((): { status: string } => ({
				status: typeof status === 'object' ? status.message : status
			}));
			if ((status as Status).clear)
				this.setState((): { chat: Chat } => ({
					chat: {
						name: this.state.chat.name,
						message: ''
					}
				}));
			setTimeout((): void => {
				this.setState((): { status: string } => ({
					status: ''
				}));
			}, 4000);
		});
		socket.on('cleared', (): void => {
			this.setState((): { output: [] } => ({
				output: []
			}));
		});
		socket.on('output', (chatData: []): void => {
			for (let chat of chatData) {
				this.setState((): { output: Array<Output> } => ({
					output: this.state.output.concat(chat)
				}));
			}
			console.log(this.state.output);
		});
	}

	handleClear: () => void = () => {
		socket.emit('clear');
	};

	handleSend: (event: KeyboardEvent<HTMLTextAreaElement>) => void = (event) => {
		if (event.key === 'Enter' && event.shiftKey === false) {
			socket.emit('input', this.state.chat);
			event.preventDefault();
		}
	};

	handleNameChange: (event: ChangeEvent<HTMLInputElement>) => void = (event) => {
		const name = event.target.value;
		this.setState((): { chat: Chat } => ({
			chat: {
				name,
				message: this.state.chat.message
			}
		}));
	};

	handleMessageChange: (event: ChangeEvent<HTMLTextAreaElement>) => void = (event) => {
		const message = event.target.value;
		this.setState((): { chat: Chat } => ({
			chat: {
				name: this.state.chat.name,
				message
			}
		}));
	};

	sortOutputState: (output: Output[]) => Output[] = (output) => {
		return output.sort((a, b) => {
			return a.createdAt > b.createdAt ? -1 : 1;
		});
	};

	render() {
		return (
			<div className="container">
				<div className="row">
					<div className="col-md-6 offset-md-3 col-sm-12">
						<Header clear={this.handleClear} />
						<div className="mb-3" style={{ height: '20px' }}>
							{this.state.status && <p>{this.state.status}</p>}
						</div>
						<Aux>
							<Fragment>
								<NameInput change={this.handleNameChange} />
								<ChatArea output={this.sortOutputState(this.state.output)} />
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
