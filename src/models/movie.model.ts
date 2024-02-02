import { JSONSchema7 } from 'json-schema'
import { Genre, genre } from './genre.model'

export type MovieDocument = Movie & { id: number, temp?: number, runtime: string, year: string }

export type Movie = {
  title: string,
  year: number,
  runtime: number,
  genres: Genre[]
  director: string,
  actors?: string,
  plot?: string,
  posterUrl?: string,
}

export const MovieSchema: JSONSchema7 = {
  required: ['title', 'year', 'runtime', 'genres', 'director'],
  properties: {
    title: {
      type: 'string',
      maxLength: 255,
    },
    year: {
      type: 'number'
    },
    runtime: { type: 'number' },
    director: {
      type: 'string',
      maxLength: 255,
    },
    posterUrl: {
      type: 'string'
    },
    plot: {
      type: 'string'
    },
    actors: {
      type: 'string'
    },
    genres: {
      type: 'array',
      items: {
        type: 'string',
        enum: [...genre]
      },
    },
  },

  additionalProperties: { type: 'string' },
  type: 'object',
}