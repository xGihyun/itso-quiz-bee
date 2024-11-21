declare module 'astro:env/client' {
	
}

declare module 'astro:env/server' {
	export const DATABASE_URL: string;	


	export const getSecret: (key: string) => string | undefined;
}
