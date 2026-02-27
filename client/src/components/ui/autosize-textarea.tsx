import { Textarea } from "@/components/ui/textarea";
import { ChangeEvent, JSX, TextareaHTMLAttributes, useRef } from "react";

export function AutosizeTextarea({
	onChange,
	...props
}: TextareaHTMLAttributes<HTMLTextAreaElement>): JSX.Element {
	const textareaRef = useRef<HTMLTextAreaElement>(null);
	const defaultRows = 1;
	const maxRows = undefined; // You can set a max number of rows

	const handleInput = (e: ChangeEvent<HTMLTextAreaElement>) => {
		const textarea = e.target;
		textarea.style.height = "auto";

		const style = window.getComputedStyle(textarea);
		const borderHeight =
			parseInt(style.borderTopWidth) + parseInt(style.borderBottomWidth);
		const paddingHeight =
			parseInt(style.paddingTop) + parseInt(style.paddingBottom);

		const lineHeight = parseInt(style.lineHeight);
		const maxHeight = maxRows
			? lineHeight * maxRows + borderHeight + paddingHeight
			: Infinity;

		const newHeight = Math.min(textarea.scrollHeight + borderHeight, maxHeight);

		textarea.style.height = `${newHeight}px`;
	};

	return (
		<Textarea
			ref={textareaRef}
			onChange={(e) => {
				handleInput(e);

				if (onChange) {
					onChange(e);
				}
			}}
			rows={defaultRows}
			className="min-h-[none] resize-none"
			{...props}
		/>
	);
}
