declare module "astro:actions" {
	type Actions = typeof import("C:/Users/UZER/Documents/VisualStudioCode/itquizbee/itso-quiz-bee/src/actions")["server"];

	export const actions: Actions;
}