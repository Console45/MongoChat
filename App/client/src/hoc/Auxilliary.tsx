interface Props {
	children: JSX.Element;
}
const Aux: (props: Props) => JSX.Element = (props) => props.children;

export default Aux;
