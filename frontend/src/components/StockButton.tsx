export default function StockButton({ name, className }: { name: string | JSX.Element; className: string }) {
	return <button className={className}>{name}</button>;
}
