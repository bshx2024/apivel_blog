import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const blogCollection = defineCollection({
	loader: glob({ pattern: '**/[^_]*.{md,mdx}', base: "./src/content/blog" }),
	schema: z.object({
		title: z.string(),
		metaTitle: z.string().optional(),
		description: z.string(),
		date: z.string().transform((str) => new Date(str)),
		author: z.string(),
		authorTitle: z.string(),
		authorBio: z.string().optional(),
		tags: z.array(z.string()),
		image: z.string().optional().default('/blog/og-cover.png'),
		lang: z.string().optional().default('en'),
	}),
});

export const collections = {
	blog: blogCollection,
};
