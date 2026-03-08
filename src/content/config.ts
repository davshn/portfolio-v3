import { defineCollection, z } from 'astro:content'

const projects = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    client: z.string(),
    category: z.string(),
    date: z.string(),
    description: z.string(),
    stack: z.array(z.string()),
    thumbnail: z.string(),
    liveUrl: z.string().url().optional(),
    order: z.number(),
  }),
})

const services = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    description: z.string().optional(),
    shortDescription: z.string(),
    icon: z.string().optional(),
    order: z.number(),
  }),
})

export const collections = { projects, services }

export interface Skill {
  name: string
  percent: number
}

export interface Experience {
  startYear: string
  endYear: string
  role: string
  company: string
}

export interface Education {
  year: string
  degree: string
  institution: string
}
