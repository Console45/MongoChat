import React, { ChangeEvent, FC, KeyboardEvent } from 'react';

interface PropTypes {
	send: (event: KeyboardEvent<HTMLTextAreaElement>) => void;
	change: (event: ChangeEvent<HTMLTextAreaElement>) => void;
	message: string;
}
const ChatInput: FC<PropTypes> = ({ send, change, message }) => {
	return (
		<textarea
			name="chat"
			placeholder="Enter Message"
			className="form-control mt-4"
			onKeyPress={send}
			onChange={change}
			value={message}
		/>
	);
};

export default ChatInput;
