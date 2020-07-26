import { connect, Schema, Document, model } from 'mongoose';
import socketio from 'socket.io';

const uri: string =
	'mongodb+srv://Cosmos:Heymorgan22@cluster0-0mf4u.mongodb.net/mongo-chat?retryWrites=true&w=majority';

interface IChat extends Document {
	name: String;
	message: String;
}
const chatSchema: Schema = new Schema(
	{
		name: String,
		message: String
	},
	{
		timestamps: true
	}
);

const Chat = model<IChat>('Chat', chatSchema);
const main: () => Promise<void> = async () => {
	await connect(uri, {
		useNewUrlParser: true,
		useUnifiedTopology: true
	});
	console.log('mongodb connected');
	const io: socketio.Server = socketio.listen(4000);

	io.on('connection', async (socket: socketio.Socket): Promise<void> => {
		socket.emit('status', 'connected');
		socket.broadcast.emit('status', 'A new user has joined');
		const sendStatus = (s: string | { message: string; clear: boolean }): void => {
			socket.emit('status', s);
		};
		const chats = await Chat.find({}, {}, { limit: 100, sort: { _id: 1 } });
		socket.emit('output', chats);

		interface Data {
			name: string;
			message: string;
		}
		socket.on('input', async ({ name, message }: Data): Promise<void> => {
			if (name == '' || message == '') sendStatus('Enter a name and a message');
			else {
				const chat = await Chat.create({
					name,
					message
				});
				io.emit('output', [ chat ]);
				sendStatus({ message: 'Message sent', clear: true });
				socket.broadcast.emit('status', `Message from ${chat.name}`);
			}
		});

		socket.on('clear', async (): Promise<void> => {
			await Chat.deleteMany({});
			io.emit('cleared');
			sendStatus('Chat cleared');
		});
	});
};

main();
